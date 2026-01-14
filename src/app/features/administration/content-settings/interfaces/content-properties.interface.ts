export interface ImagePreview {
  url: string;
  file?: File;
}

export interface HeroSlidesToUpload extends ImagePreview {
  title?: string;
  description?: string;
  redirectUrl?: string;
}

export interface QuickAccessToUpload extends ImagePreview {
  name: string;
  redirectUrl: string;
}
