import { Routes, Route, Navigate } from 'react-router';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { UploadsPage } from '../pages/app/UploadsPage';
import { UploadPdfPage } from '../pages/app/UploadPdfPage';
import { CurriculumDetailPage } from '../pages/app/CurriculumDetailPage';
import { PersonalizationFormPage } from '../pages/app/PersonalizationFormPage';
import { LessonPage } from '../pages/app/LessonPage';
import { AvatarChoicePage } from '../pages/app/AvatarChoicePage';
import { AvatarLibraryPage } from '../pages/app/AvatarLibraryPage';
import { JoinClassPage } from '../pages/app/JoinClassPage';
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { TeacherInvitePage } from '../pages/teacher/TeacherInvitePage';
import { StudentDetailPage } from '../pages/teacher/StudentDetailPage';
import { ParentDashboardPage } from '../pages/parent/ParentDashboardPage';
import { AddChildPage } from '../pages/parent/AddChildPage';
import { ChildDetailPage } from '../pages/parent/ChildDetailPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/uploads" element={<UploadsPage />} />
      <Route path="/upload" element={<UploadPdfPage />} />
      <Route path="/curriculum/:id" element={<CurriculumDetailPage />} />
      <Route path="/curriculum/:id/personalize" element={<PersonalizationFormPage />} />
      <Route path="/curriculum/:id/lesson" element={<LessonPage />} />
      <Route path="/curriculum/:id/avatar" element={<AvatarChoicePage />} />
      <Route path="/curriculum/:id/avatar/library" element={<AvatarLibraryPage />} />
      <Route path="/join-class" element={<JoinClassPage />} />
      <Route path="/teacher" element={<TeacherDashboardPage />} />
      <Route path="/teacher/invite" element={<TeacherInvitePage />} />
      <Route path="/teacher/upload" element={<UploadPdfPage variant="teacher" />} />
      <Route path="/teacher/students/:id" element={<StudentDetailPage />} />
      <Route path="/parent" element={<ParentDashboardPage />} />
      <Route path="/parent/children/new" element={<AddChildPage />} />
      <Route path="/parent/children/:id" element={<ChildDetailPage />} />
      <Route path="/parent/children/:id/upload" element={<UploadPdfPage variant="parent" />} />
    </Routes>
  );
}
