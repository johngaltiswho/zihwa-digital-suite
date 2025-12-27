export interface PrecastProduct {
  id: number;
  slug: string;

  title: string;
  shortDescription: string;

  image: string;

  category: "Compound Wall" | "Drainage" | "Boundary" | "Custom";

  highlights?: string[];
  brochure?: string;
}
