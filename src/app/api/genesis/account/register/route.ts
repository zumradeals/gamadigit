import { NextResponse } from 'next/server';
import { createGamadAccount, type HumanIdentifierType } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    identifier?: string;
    type?: HumanIdentifierType;
    password?: string;
  } | null;

  const name = body?.name?.trim();
  const identifier = body?.identifier?.trim();
  const type = body?.type;
  const password = body?.password;

  if (!name || !identifier || !password || !type || !['EMAIL', 'TELEPHONE'].includes(type)) {
    return NextResponse.json({ ok: false, error: 'DONNEES_REQUISES' }, { status: 422 });
  }

  try {
    const result = await createGamadAccount({ name, identifier, type, password });
    return NextResponse.json({
      ok: true,
      pending: {
        identity: result.identity,
        identifierReference: result.identifierReference,
        verificationReference: result.verificationReference,
        expiresAt: result.expiresAt,
        channel: result.channel,
      },
    }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'CORE_INDISPONIBLE';
    const status = code === 'COMPTE_NON_CREATABLE' ? 409 : 503;
    return NextResponse.json({ ok: false, error: code }, { status });
  }
}
