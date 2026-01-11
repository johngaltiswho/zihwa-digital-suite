export type NewsCategory =
  | "Project"
  | "In The News"
  | "Presentation"
  | "Jobs";

export interface NewsDocument {
  label: string;
  file: string; // pdf 
}
export interface NewsListItem {
  id: number;
  slug: string;
  title: string;
  image: string;
  categories: NewsCategory[];
  excerpt?: string;
  date?: string;
}


export interface NewsItem {
  id: number;
  slug: string;
  title: string;

  /* ================= CATEGORIES ================= */
  categories: NewsCategory[];

  /* ================= IMAGES ================= */
  heroImages?: string[];
  gallery?: string[];
  image?: string;
  client?: string;
  natureOfWork?: string;
  structuralDesigner?: string;
  projectManagementConsultant?: string;
  consultant?: string;
  PMC?: string;
  MonitoringAgency?: string;

  location?: string;
  facility?: string;
  project_type?: string;
  scope?: string;
  status?: string;
  introduction?: string;
  content: string[];
  bulletPoints?: string[];
  conclusion?: string;
  excerpt?: string;
  description?: string;
  documents?: NewsDocument[];
  date?: string;
  keywords?: string[];
}
