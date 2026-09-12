export type UserRole = 'admin' | 'student' | 'parent' | 'teacher';

export interface User {
  _id: string;
  name: string;
  email: { value: string; verified: boolean };
  role: UserRole;
  curriculaCreated: number;
  curriculaEnrolled: number;
}
