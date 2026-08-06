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

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  content: string[];
  status: PublicationStatus;
}
