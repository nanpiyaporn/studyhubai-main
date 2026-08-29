// src/services/agentOrchestrator.ts
import { 
  runSyllabusAgent, 
  runLatexTranscriptionAgent, 
  runActiveRecallAgent, 
  runStudyPlannerAgent 
} from './geminiAgents';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export interface ProcessedCourseResult {
  courseData: any;
  notes: string;
  deck: any[];
  studyPlan: any[];
}

export interface SavedCourseRecord {
  id: string;
  userId: string;
  courseCode: string;
  courseName: string;
  courseData: any;
  notes: string;
  deckCount: number;
  studyBlocksCount: number;
  createdAt: string;
  firestoreUpdatedAt?: any;
}

/**
 * Executes all 4 intelligent agents in sequence
 */
export async function processCourseMaterial(
  rawContent: string, 
  availableHours: number = 4
): Promise<ProcessedCourseResult> {
  // Step 1: Parse syllabus/notes
  const parsedCourse = await runSyllabusAgent(rawContent);

  // Step 2: Format technical notes into clean LaTeX
  const formattedNotes = await runLatexTranscriptionAgent(rawContent);

  // Step 3: Generate flashcards from the formatted notes
  const flashcards = await runActiveRecallAgent(formattedNotes);

  // Step 4: Schedule study blocks for deadlines
  const schedule = await runStudyPlannerAgent(parsedCourse.deadlines || [], availableHours);

  return {
    courseData: parsedCourse,
    notes: formattedNotes,
    deck: flashcards,
    studyPlan: schedule,
  };
}

/**
 * Executes the 4-agent orchestrator and persists all results into Firebase Firestore
 */
export async function processAndSaveCourse(
  userId: string = 'guest-user',
  rawContent: string,
  availableHours: number = 4,
  metadata?: { courseCode?: string; courseName?: string; instructor?: string }
) {
  // 1. Run the multi-agent pipeline
  const result = await processCourseMaterial(rawContent, availableHours);

  const courseId = `course-${Date.now()}`;
  const courseCode = metadata?.courseCode || result.courseData?.courseCode || 'ACAD-101';
  const courseName = metadata?.courseName || result.courseData?.courseName || 'Automated Course Roadmap';

  // 2. Save Course Overview Record
  const courseDocRef = doc(db, 'saved_courses', courseId);
  const courseRecord = {
    id: courseId,
    userId,
    courseCode,
    courseName,
    instructor: metadata?.instructor || result.courseData?.instructor || 'Instructor',
    courseData: result.courseData,
    notes: result.notes,
    deckCount: result.deck?.length || 0,
    studyBlocksCount: result.studyPlan?.length || 0,
    createdAt: new Date().toISOString(),
    firestoreUpdatedAt: serverTimestamp(),
  };
  await setDoc(courseDocRef, courseRecord);

  // 3. Save Generated Flashcard Deck
  const deckDocRef = doc(db, 'flashcard_decks', `deck-${courseId}`);
  await setDoc(deckDocRef, {
    id: `deck-${courseId}`,
    courseId,
    userId,
    title: `${courseCode} Flashcard Deck`,
    cards: result.deck,
    totalCards: result.deck?.length || 0,
    createdAt: new Date().toISOString(),
    firestoreUpdatedAt: serverTimestamp(),
  });

  // 4. Save Study Plan Blocks
  const studyPlanDocRef = doc(db, 'study_plans', `plan-${courseId}`);
  await setDoc(studyPlanDocRef, {
    id: `plan-${courseId}`,
    courseId,
    userId,
    title: `${courseCode} Study Schedule`,
    blocks: result.studyPlan,
    availableHoursPerDay: availableHours,
    createdAt: new Date().toISOString(),
    firestoreUpdatedAt: serverTimestamp(),
  });

  return {
    courseId,
    result,
    courseRecord,
  };
}

/**
 * Retrieves all saved courses for a given user from Firestore
 */
export async function fetchUserSavedCourses(userId?: string): Promise<SavedCourseRecord[]> {
  try {
    const coursesRef = collection(db, 'saved_courses');
    const snapshot = await getDocs(coursesRef);
    const list: SavedCourseRecord[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as SavedCourseRecord;
      if (!userId || data.userId === userId || data.userId === 'guest-user') {
        list.push(data);
      }
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Error fetching courses from Firestore:', error);
    return [];
  }
}
