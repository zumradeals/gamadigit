import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getBrandAssets } from '@/lib/brand-assets';

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = await getBrandAssets();

  return (
    <>
      <SiteHeader logoUrl={brand.logoUrl} />
      <main>{children}</main>
      <SiteFooter logoUrl={brand.logoUrl} />
    </>
  );
}
