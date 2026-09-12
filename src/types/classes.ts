// Mirrors GET /curriculum/teacher/students
export interface TeacherStudentSummary {
  studentId: string;
  name: string;
  totalAssigned: number;
  completedCount: number;
}

// Mirrors GET /curriculum/teacher/students/:studentId — deliberately excludes
// UserCurriculum.preferences/avatarConfig, which stay private to the Student.
export interface AssignedItemDetail {
  curriculumId: string;
  title: string;
  courseTitle?: string;
  overallProgress: number;
  isCompleted: boolean;
  enrolledAt?: string;
}

// A Parent-managed profile — no account of its own (no email/password),
// per the "managed profile" decision. Not backed by a real endpoint yet.
export interface ChildProfile {
  childId: string;
  name: string;
  avatarColor: string;
}
