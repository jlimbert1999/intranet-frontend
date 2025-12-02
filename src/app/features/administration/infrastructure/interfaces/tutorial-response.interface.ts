export interface TutorialResponse {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  slug: string;
  videos: TutorialVideoResponse[];
}

export interface TutorialVideoResponse {
  id: number;
  title: string;
  fileUrl: string;
}
