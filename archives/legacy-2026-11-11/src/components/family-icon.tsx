import {
  Building2,
  CloudCog,
  Code2,
  GraduationCap,
  PackageCheck,
  Palette,
} from 'lucide-react';
import type { ServiceFamily } from '@/types/content';

const icons = {
  code: Code2,
  palette: Palette,
  cloud: CloudCog,
  package: PackageCheck,
  graduation: GraduationCap,
  building: Building2,
};

export function FamilyIcon({ name, className = '' }: { name: ServiceFamily['icon']; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
