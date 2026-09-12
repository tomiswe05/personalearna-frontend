export interface CurriculumMetadata {
  institutionName?: string;
  tutorName?: string;
  dateCreated?: string;
  professorContact?: string;
  courseRequirements?: string;
  technologyRequirements?: string;
  preliminaryInfo?: string;
}

export interface Curriculum {
  _id: string;
  title: string;
  description: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  extractedText?: string;
  createdBy: string;
  metadata?: CurriculumMetadata;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Set when a linked Teacher assigned this material instead of the
  // Student uploading it themselves — drives the "Assigned by" tag on Uploads.
  assignedByTeacherName?: string;
}

export type LearningStyle = 'visual' | 'audio' | 'reading' | 'kinesthetic';
export type LearningPace = 'slow' | 'moderate' | 'fast';
export type MediaPreference = 'video' | 'audio' | 'text' | 'mixed';

export interface PersonalizationPreferences {
  learningStyle: LearningStyle;
  learningPace: LearningPace;
  mediaPreference: MediaPreference;
  avatarId?: string;
  voiceId?: string;
  additionalPreferences?: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface MicroLesson {
  moduleTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  duration: string;
  script: string;
  quizzes: Quiz[];
  isCompleted?: boolean;
  quizScore?: number;
  attempts?: number;
  videoUrl?: string;
  videoId?: string;
  videoStatus?: VideoStatus;
  videoThumbnail?: string;
  videoDuration?: number;
}

export interface CourseModule {
  moduleTitle: string;
  moduleNumber: number;
  summary?: string;
  recommendedDuration?: string;
  lessons: MicroLesson[];
  progressPercentage?: number;
  isCompleted?: boolean;
}

export type VideoGenerationStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export interface UserCurriculum {
  _id: string;
  userId: string;
  curriculumId: string;
  courseTitle: string;
  preferences: PersonalizationPreferences;
  modules: CourseModule[];
  totalModules: number;
  overallProgress: number;
  isCompleted: boolean;
  enrolledAt: string;
  avatarConfig?: {
    avatarId?: string;
    voiceId?: string;
    isCustomAvatar?: boolean;
  };
  videoGenerationStatus?: VideoGenerationStatus;
  videoGenerationProgress?: number;
}
