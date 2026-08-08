import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    baseUrl: Boolean(process.env.GAMAD_CORE_BASE_URL),
    productRef: Boolean(process.env.GAMAD_CORE_PRODUCT_REF),
    authnRef: Boolean(process.env.GAMAD_CORE_AUTHN_REF),
    connectSecret: Boolean(process.env.GAMAD_CORE_CONNECT_SECRET),
  };

  const configured = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      service: 'DG AFRIQUE Portal Genesis',
      coreConfiguration: configured ? 'ready' : 'incomplete',
      checks,
    },
    {
      status: configured ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
