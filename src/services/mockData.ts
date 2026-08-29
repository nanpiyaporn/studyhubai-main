export interface PresetCourse {
  code: string;
  name: string;
  instructor: string;
  instructorEmail: string;
  term: string;
  studyHours: number;
  syllabus: string;
  defaultTextbook: string;
}

export const PRESET_COURSES: PresetCourse[] = [
  {
    code: '33:136:386',
    name: 'Operations Management & Applied Quantitative Modeling',
    instructor: 'Dr. Romulo N. Ely',
    instructorEmail: 'operations.questions@gmail.com',
    term: 'Fall 2022 / Current',
    studyHours: 14,
    defaultTextbook: 'Introduction to Management Science by Bernard W. Taylor III (13th Edition, Pearson)',
    syllabus: `RUTGERS BUSINESS SCHOOL - Newark and New Brunswick
Course: 33:136:386: 1-10, 20, 21, and 23 Operations Management
Instructor: Dr. Romulo N. Ely (Office: NB:100RR:5140)
Office Hours: Wed 2:15-3:15PM (Webex)
Email: operations.questions@gmail.com
Prerequisites: 01:640:135 (Calculus 1), 01:960:285 (Introduction to Statistics for Business)

COURSE DESCRIPTION:
This course focuses on key quantitative techniques essential for analyzing and improving business operations. It involves modelling business decision problems with and without data uncertainty: through applying linear, integer, and non-linear programming optimization models, and Monte Carlo simulation.

COURSE MATERIALS:
1. Textbook: "Introduction to Management Science" by Bernard W. Taylor III, Pearson, 13th Edition (previous editions also work). It is available at the Barnes and Noble book store. Additionally, Reserved copies are available in the following libraries: Alexander, Carr and Stephen and Lucy Chang Science library. (optional)
2. Microsoft Excel (required)
3. Canvas (required)

EXAM DATES AND POLICIES (Online taken through Canvas):
- Homework (HW1, HW2, HW3, HW4):
  1) You will have 420 minutes (7 hours) to accomplish the test.
  2) The test will be saved and submitted automatically when time expires.
  3) You are not allowed to start the Test if the due date has passed.
  4) Backtracking is PROHIBITED (you cannot go back to solve a question after you have skipped or answered it).
  5) Once you start the test, the time counts down continuously (e.g., start Sat 10PM, closes automatically at 5AM Sun).
  6) Window of 3-7 days to take the test.
- Final Exam (FE): Comprehensive, 180 minutes max, scheduled date during Dec 16th-23rd.

GRADING POLICY:
- Homework 1 (HW1): 15% (Likely Week 4, Sep 27 - Oct 3)
- Homework 2 (HW2): 15% (Likely Week 7, Oct 18 - 24)
- Homework 3 (HW3): 15% (Likely Week 11, Nov 15 - 21)
- Homework 4 (HW4): 15% (Likely Week 13, Nov 29 - Dec 5)
- Final Exam (FE): 40% (Week 15, Dec 16 - 23)
Total: 100%. No Extra Credit. No curve. Grades calculated to 0.01.

TENTATIVE SCHEDULE & TOPICS:
W1: Sep 6-12 - Introduction to Operations Management (Lecture 1)
W2: Sep 13-19 - Linear Programming: Model Formulation & Graphical Solution (Lecture 2)
W3: Sep 20-26 - Linear Programming: Graphical Solution (Lecture 2)
W4: Sep 27-Oct 3 - LP: Computer Solution & Sensitivity Analysis (Lecture 3) -> LIKELY WEEK FOR HW1 (420 min)
W5: Oct 4-10 - LP: Computer Solution & Sensitivity Analysis (Lecture 3)
W6: Oct 11-17 - LP: Modeling Examples (Lecture 4)
W7: Oct 18-24 - LP: Modeling Examples (Lecture 4) -> LIKELY WEEK FOR HW2 (420 min)
W8: Oct 25-31 - Integer Programming (Lecture 5)
W9: Nov 1-7 - Integer Programming (Lecture 5)
W10: Nov 8-14 - Nonlinear Programming (Lecture 6)
W11: Nov 15-21 - Nonlinear Programming (Lecture 6) -> LIKELY WEEK FOR HW3 (420 min)
W12: Nov 22-28 - Simulation (Lecture 7) (Thanksgiving Recess Nov 24-27)
W13: Nov 29-Dec 5 - Simulation & Monte Carlo (Lecture 7) -> LIKELY WEEK FOR HW4 (420 min)
W14: Dec 6-14 - Final Exam Review
W15: Dec 15-23 - Reading Day & Comprehensive Final Exam (FE, 180 min)`,
  },
  {
    code: 'CS 189',
    name: 'Introduction to Machine Learning & Autonomous Systems',
    instructor: 'Prof. Stuart Russell',
    instructorEmail: 'russell@berkeley.edu',
    term: 'Fall 2026',
    studyHours: 12,
    defaultTextbook: 'Pattern Recognition and Machine Learning by Christopher M. Bishop (Springer)',
    syllabus: `Course: CS 189 - Introduction to Machine Learning
Instructor: Prof. Stuart Russell (russell@berkeley.edu)
Textbook: Pattern Recognition and Machine Learning (Bishop) + Artificial Intelligence: A Modern Approach (Russell & Norvig, 4th Ed).
Grading: Problem Sets (20%), Midterm (25%), Capstone Autonomous Agent Project (25%), Final Exam (30%).
Core Topics: Empirical Risk Minimization, Convex Optimization, SVMs, Kernel Methods, CNNs, Transformers, Reinforcement Learning with Bellman Equations.`,
  },
  {
    code: 'BIO 102',
    name: 'Molecular Genetics & Cellular Biology',
    instructor: 'Dr. Jennifer Doudna',
    instructorEmail: 'doudna@biochem.edu',
    term: 'Fall 2026',
    studyHours: 10,
    defaultTextbook: 'Molecular Biology of the Cell by Alberts et al. (7th Edition, Norton)',
    syllabus: `Course: BIO 102 - Molecular Genetics & Cellular Biology
Instructor: Dr. Jennifer Doudna (doudna@biochem.edu)
Textbook: Molecular Biology of the Cell (7th Ed, Alberts).
Grading: Lab Practicals (35%), Midterm (25%), Gene Drive Research Paper (20%), Final Exam (20%).
Topics: CRISPR-Cas9 genome editing, Chromatin & Histones, Epigenetic checkpoints, Signal Transduction (RTKs & GPCRs).`,
  },
];
