export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface ServiceMedia {
  url?: string;
  publicUrl?: string;
  alt?: string;
}

export interface SoftwareCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  accent: string;
  sortOrder: number;
  status: PublicationStatus;
}

export interface TrainingCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  accent: string;
  sortOrder: number;
  status: PublicationStatus;
}

export interface TrainingProgram {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  categoryAccent: string;
  slug: string;
  name: string;
  kind: 'software' | 'career_pack';
  excerpt: string;
  description: string;
  priceLabel?: string;
  showPrice: boolean;
  formatLabel?: string;
  durationLabel?: string;
  highlights: string[];
  media: ServiceMedia[];
  whatsappMessage?: string;
  partnerLabel?: string;
  featured: boolean;
  sortOrder: number;
  status: PublicationStatus;
}

export interface ServiceItem {
  id: string;
  slug: string;
  familySlug: string;
  name: string;
  excerpt: string;
  description: string;
  priceLabel: string;
  deliveryLabel: string;
  features: string[];
  targetAudience?: string[];
  keyPoints?: string[];
  seoTitle?: string;
  seoDescription?: string;
  socialContent?: Record<string, unknown>;
  featured?: boolean;
  status: PublicationStatus;
  productCode?: string;
  categorySlug?: string;
  categoryName?: string;
  categoryAccent?: string;
  categorySortOrder?: number;
  whatsappMessage?: string;
  media?: ServiceMedia[];
}

export interface ServiceFamily {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  icon: 'code' | 'palette' | 'cloud' | 'package' | 'graduation' | 'building';
  accent: string;
  status: PublicationStatus;
}

export type BlogContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; text: string }
  | { type: 'cta'; label: string; href: string };

export type BlogContentItem = string | BlogContentBlock;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  content: BlogContentItem[];
  seoTitle?: string;
  seoDescription?: string;
  status: PublicationStatus;
}
