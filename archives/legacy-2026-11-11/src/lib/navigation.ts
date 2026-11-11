import { getPublicFamilies } from '@/lib/public-content';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type PublicMenuItem = {
  id: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
  sortOrder: number;
  children: PublicMenuItem[];
};

async function fallbackMenu(location: 'header' | 'footer'): Promise<PublicMenuItem[]> {
  if (location === 'footer') {
    return [
      { id: 'footer-software', label: 'Logiciels', url: '/logiciels', target: '_self', sortOrder: 10, children: [] },
      { id: 'footer-blog', label: 'Blog', url: '/blog', target: '_self', sortOrder: 20, children: [] },
      { id: 'footer-contact', label: 'Demander un devis', url: '/contact', target: '_self', sortOrder: 30, children: [] },
      { id: 'footer-admin', label: 'Administration', url: '/admin', target: '_self', sortOrder: 40, children: [] },
    ];
  }

  const families = await getPublicFamilies();
  const serviceFamilies = families.filter((family) => family.slug !== 'logiciels-abonnements');
  return [
    { id: 'header-home', label: 'Accueil', url: '/', target: '_self', sortOrder: 10, children: [] },
    {
      id: 'header-services',
      label: 'Services',
      url: '#services',
      target: '_self',
      sortOrder: 20,
      children: serviceFamilies.map((family, index) => ({
        id: family.id,
        label: family.shortName,
        url: `/services/${family.slug}`,
        target: '_self',
        sortOrder: (index + 1) * 10,
        children: [],
      })),
    },
    { id: 'header-software', label: 'Logiciels', url: '/logiciels', target: '_self', sortOrder: 30, children: [] },
    { id: 'header-blog', label: 'Blog', url: '/blog', target: '_self', sortOrder: 40, children: [] },
    { id: 'header-contact', label: 'Contact', url: '/contact', target: '_self', sortOrder: 50, children: [] },
  ];
}

export async function getPublicMenu(location: 'header' | 'footer'): Promise<PublicMenuItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackMenu(location);

  const { data: menu, error: menuError } = await supabase
    .from('menus')
    .select('id')
    .eq('location', location)
    .eq('status', 'published')
    .maybeSingle();

  if (menuError || !menu) return fallbackMenu(location);

  const { data: rows, error } = await supabase
    .from('menu_items')
    .select('id, parent_id, label, url, target, sort_order')
    .eq('menu_id', menu.id)
    .eq('status', 'published')
    .order('sort_order');

  if (error || !rows?.length) return fallbackMenu(location);

  const items = new Map<string, PublicMenuItem>();
  for (const row of rows) {
    items.set(row.id, {
      id: row.id,
      label: row.label,
      url: row.url,
      target: row.target === '_blank' ? '_blank' : '_self',
      sortOrder: row.sort_order,
      children: [],
    });
  }

  const roots: PublicMenuItem[] = [];
  for (const row of rows) {
    const item = items.get(row.id);
    if (!item) continue;
    if (row.parent_id && items.has(row.parent_id)) {
      items.get(row.parent_id)?.children.push(item);
    } else {
      roots.push(item);
    }
  }

  for (const item of items.values()) {
    item.children.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return roots.sort((a, b) => a.sortOrder - b.sortOrder);
}
