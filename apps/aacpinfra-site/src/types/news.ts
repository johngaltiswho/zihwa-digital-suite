export type NewsCategory =
  | "Project"
  | "In The News"
  | "Presentation"
  | "Jobs";

export interface NewsDocument {
  label: string;
  file: string; // pdf / ppt path
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;

  categories: NewsCategory[];

  /** HERO SECTION – slider images */
  heroImages: string[];

  /** GALLERY AFTER CONCLUSION */
  gallery?: string[];

  client?: string;
  natureOfWork?: string;
  structuralDesigner?: string;
  projectManagementConsultant?: string;
  consultant?: string;
  PMC?: string;
  MonitoringAgency?: string;

  introduction: string;
  content: string[];

  bulletPoints?: string[];
  conclusion?: string;

  documents?: NewsDocument[];
}
