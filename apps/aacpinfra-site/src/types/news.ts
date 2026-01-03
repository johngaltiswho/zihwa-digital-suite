export type NewsCategory =
  | "Project"
  | "In The News"
  | "Presentation"
  | "Jobs";

export interface NewsDocument {
  label: string;
  file: string; // pdf / ppt path
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

  /** HERO SECTION – slider images */
  heroImages?: string[];

  /** GALLERY AFTER CONCLUSION */
  gallery?: string[];

  /**
   * Thumbnail image for listing cards
   * (can be derived from heroImages[0])
   */
  image?: string;

  /* ================= PROJECT META ================= */
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

  /* ================= CONTENT ================= */

  /** Short intro shown in detail page */
  introduction?: string;

  /** Main article / project content */
  content: string[];

  /** Optional bullets */
  bulletPoints?: string[];

  conclusion?: string;

  /** Used in listing cards */
  excerpt?: string;

  description?: string;

  /* ================= ATTACHMENTS ================= */
  documents?: NewsDocument[];

  /* ================= META ================= */
  date?: string;
  keywords?: string[];
}
