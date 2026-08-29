export interface UserSession {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken?: string;
  isAuthenticated: boolean;
  provider: 'google';
  workspaceConnected: {
    calendar: boolean;
    tasks: boolean;
    gmail: boolean;
    drive?: boolean;
  };
}

export interface TextbookInfo {
  title: string;
  author: string;
  edition: string;
  isbn?: string;
  publisher?: string;
  courseRequired: boolean;
  notes: string;
}

export interface TextbookProcurementOption {
  source: 'OpenStax' | 'Internet Archive' | 'University Reserve' | 'eBay' | 'Amazon' | 'AbeBooks' | 'Chegg';
  type: 'free_open_access' | 'library_loan' | 'commercial_purchase';
  price: number;
  shipping: number;
  totalCost: number;
  format: 'PDF' | 'Hardcover' | 'Paperback' | 'eTextbook' | 'Library Hold';
  url: string;
  availability: string;
  rating?: number;
  condition?: string;
  bestValueBadge?: boolean;
}

export interface QuantitativeLectureSection {
  id: string;
  timestamp: string;
  topic: string;
  spokenSnippet: string;
  latexFormulation: string;
  decisionVariables: { name: string; description: string }[];
  objectiveFunction: string;
  constraints: string[];
  notes: string;
}

export interface AnkiCard {
  id: string;
  deck: string;
  cardType: 'concept' | 'formula' | 'scenario' | 'cloze';
  front: string;
  back: string;
  latexSnippet?: string;
  tags: string[];
  easeFactor: number;
  intervalDays: number;
  dueStatus: 'due_today' | 'mastered' | 'learning';
}

export interface PolicyRule {
  id: string;
  category: 'exam_window' | 'time_limit' | 'backtracking' | 'makeup_policy' | 'email_protocol' | 'academic_integrity';
  ruleTitle: string;
  detail: string;
  severity: 'critical' | 'warning' | 'info';
  actionableRecommendation: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  source: string;
  abstract: string;
  keyQuotes: string[];
  bibtex: string;
  doiUrl: string;
}

export interface SyllabusAssessment {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'project' | 'quiz' | 'reading';
  weight: number;
  dueDate: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  keyTopics: string[];
  tentativeWeek?: string;
  durationMinutes?: number;
}

export interface StudyBlock {
  id: string;
  title: string;
  courseCode: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isUninterruptedExamWindow?: boolean;
  topic: string;
  technique: 'Active Recall' | 'Spaced Repetition' | 'Practice Problems' | 'Syllabus Review' | 'Deep Work' | 'Milestone Checkpoint' | '420-Min Exam Reservation';
  status: 'scheduled' | 'in_progress' | 'completed';
  syncedToGoogleCalendar: boolean;
  gcalEventId?: string;
}

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes: string;
  due: string;
  status: 'needsAction' | 'completed';
  courseCode: string;
  priority: 'high' | 'medium' | 'low';
  syncedToGoogleTasks: boolean;
  gTaskId?: string;
}

export interface EmailDraft {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  purpose: 'office_hours' | 'rubric_clarification' | 'extension_request' | 'study_group' | 'canvas_forum_post';
  status: 'draft' | 'sent' | 'synced_to_gmail';
  courseCode: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface AgentActionStep {
  id: string;
  timestamp: string;
  agentName: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  tool: string;
  reasoning: string;
  outputSummary?: string;
  dataPayload?: any;
}

export interface WorkflowResult {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  instructorEmail: string;
  term: string;
  createdAt: string;
  syllabusSummary: string;
  difficultyLevel: 'Introductory' | 'Intermediate' | 'Rigorous' | 'Intensive';
  keyThemes: string[];
  assessments: SyllabusAssessment[];
  studyBlocks: StudyBlock[];
  tasks: GoogleTaskItem[];
  emailDrafts: EmailDraft[];
  quizzes: QuizQuestion[];
  textbook: TextbookInfo;
  textbookOptions: TextbookProcurementOption[];
  quantitativeFormulations: QuantitativeLectureSection[];
  ankiCards: AnkiCard[];
  policyRules: PolicyRule[];
  researchPapers: ResearchPaper[];
  logs: AgentActionStep[];
}
