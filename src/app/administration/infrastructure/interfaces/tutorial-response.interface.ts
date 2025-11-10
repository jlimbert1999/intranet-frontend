export interface TutorialResponse {
  id: string;
  title: string;
  description: string;
  videos: TutorialVideoResponse[];
}

export interface TutorialVideoResponse {
  id: string;
  title: string;
  fileUrl: string;
  previewUrl: string;
}
