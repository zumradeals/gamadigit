export type PublicationStatus = 'draft' | 'published' | 'archived';

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
