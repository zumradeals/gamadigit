import { NextResponse } from 'next/server';
import { createSimpleCaptcha } from '@/lib/simple-captcha';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(
      { ok: true, captcha: createSimpleCaptcha() },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'CAPTCHA_INDISPONIBLE' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
