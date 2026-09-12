export interface HeyGenAvatar {
  id: string;
  name: string;
  preview_image_url?: string;
  preview_video_url?: string;
  gender?: string;
}

export interface LessonVideoStatus {
  videoStatus: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
}
