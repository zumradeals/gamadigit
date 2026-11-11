import 'server-only';
import crypto from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ZUMRA_FOUNDING_ROLE_LABELS,
  ZUMRA_FOUNDING_ROLE_ORDER,
  type ZumraFoundingRole,
  type ZumraGroupDetail,
  type ZumraGroupSummary,
} from '@/lib/zumra/types';

export class ZumraEngineError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
    this.name = 'ZumraEngineError';
  }
}

export function hashZumraInviteToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function translateZumraDbError(error: { message?: string } | null | undefined) {
  const message = error?.message ?? '';
  const known: Array<[string, string, number]> = [
    ['ADHESION_ZUMRA_NON_ACTIVE', 'ADHESION_NON_ACTIVE', 403],
    ['RESPONSABLE_PRINCIPAL_REQUIS', 'RESPONSABLE_PRINCIPAL_REQUIS', 403],
    ['INVITATION_INVALIDE', 'INVITATION_INVALIDE', 404],
    ['INVITATION_EXPIREE', 'INVITATION_EXPIREE', 410],
    ['MEMBRE_DEJA_ROLE_FONDATEUR', 'MEMBRE_DEJA_ROLE_FONDATEUR', 409],
    ['MEMBRE_INACTIF', 'MEMBRE_INACTIF', 422],
    ['RESPONSABLE_DEJA_EN_PLACE', 'RESPONSABLE_DEJA_EN_PLACE', 422],
    ['LOCALISATION_REQUISE', 'LOCALISATION_REQUISE', 422],
    ['MODE_PARTICIPATION_INVALIDE', 'MODE_PARTICIPATION_INVALIDE', 422],
    ['ROLE_INVALIDE', 'ROLE_INVALIDE', 422],
    ['ZUMRA_INTROUVABLE', 'ZUMRA_INTROUVABLE', 404],
  ];

  for (const [needle, code, status] of known) {
    if (message.includes(needle)) return new ZumraEngineError(code, status);
  }

  return new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);
}

export async function assertActiveProgramMembership(supabase: SupabaseClient, identity: string) {
  const { data, error } = await supabase
    .from('zumra_memberships')
    .select('status')
    .eq('core_identity_reference', identity)
    .maybeSingle();

  if (error) throw new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);
  if (data?.status !== 'active') throw new ZumraEngineError('ADHESION_NON_ACTIVE', 403);
}

export async function loadMyZumraGroups(
  supabase: SupabaseClient,
  identity: string,
): Promise<ZumraGroupSummary[]> {
  await assertActiveProgramMembership(supabase, identity);

  const { data: memberships, error: membershipError } = await supabase
    .from('zumra_group_members')
    .select('zumra_id')
    .eq('core_identity_reference', identity)
    .eq('status', 'active');

  if (membershipError) throw new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);
  const groupIds = [...new Set((memberships ?? []).map((row) => row.zumra_id as string))];
  if (groupIds.length === 0) return [];

  const [groupsResult, membersResult, rolesResult] = await Promise.all([
    supabase
      .from('zumra_groups')
      .select('id,name,sector,objective,participation_mode,country,city,status,activated_at,created_at')
      .in('id', groupIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('zumra_group_members')
      .select('zumra_id,core_identity_reference')
      .in('zumra_id', groupIds)
      .eq('status', 'active'),
    supabase
      .from('zumra_group_roles')
      .select('zumra_id,core_identity_reference,role')
      .in('zumra_id', groupIds),
  ]);

  if (groupsResult.error || membersResult.error || rolesResult.error) {
    throw new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);
  }

  return (groupsResult.data ?? []).map((group) => {
    const memberCount = (membersResult.data ?? []).filter((row) => row.zumra_id === group.id).length;
    const groupRoles = (rolesResult.data ?? []).filter((row) => row.zumra_id === group.id);
    const currentRole = groupRoles.find((row) => row.core_identity_reference === identity)?.role as ZumraFoundingRole | undefined;

    return {
      id: group.id,
      name: group.name,
      sector: group.sector,
      objective: group.objective,
      participationMode: group.participation_mode,
      country: group.country,
      city: group.city,
      status: group.status,
      activatedAt: group.activated_at,
      createdAt: group.created_at,
      activeMembers: memberCount,
      rolesFilled: new Set(groupRoles.map((row) => row.role)).size,
      requiredMembers: 5,
      requiredRoles: 5,
      currentRole: currentRole ?? null,
    } satisfies ZumraGroupSummary;
  });
}

export async function loadZumraGroupDetail(
  supabase: SupabaseClient,
  groupId: string,
  identity: string,
): Promise<ZumraGroupDetail> {
  await assertActiveProgramMembership(supabase, identity);

  const { data: group, error: groupError } = await supabase
    .from('zumra_groups')
    .select('id,name,sector,objective,participation_mode,country,city,status,activated_at,created_at')
    .eq('id', groupId)
    .maybeSingle();

  if (groupError) throw new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);
  if (!group) throw new ZumraEngineError('ZUMRA_INTROUVABLE', 404);

  const [membersResult, rolesResult] = await Promise.all([
    supabase
      .from('zumra_group_members')
      .select('core_identity_reference,status,joined_at')
      .eq('zumra_id', groupId)
      .eq('status', 'active')
      .order('joined_at', { ascending: true }),
    supabase
      .from('zumra_group_roles')
      .select('core_identity_reference,role,assigned_at')
      .eq('zumra_id', groupId),
  ]);

  if (membersResult.error || rolesResult.error) throw new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);
  const memberRows = membersResult.data ?? [];
  if (!memberRows.some((row) => row.core_identity_reference === identity)) {
    throw new ZumraEngineError('ACCES_ZUMRA_REFUSE', 403);
  }

  const identities = memberRows.map((row) => row.core_identity_reference as string);
  const profilesResult = identities.length
    ? await supabase
      .from('zumra_member_profiles')
      .select('core_identity_reference,display_name,country,city,sectors')
      .in('core_identity_reference', identities)
    : { data: [], error: null };

  if (profilesResult.error) throw new ZumraEngineError('ZUMRA_INDISPONIBLE', 503);

  const profileByIdentity = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.core_identity_reference as string, profile]),
  );
  const roleByIdentity = new Map(
    (rolesResult.data ?? []).map((role) => [role.core_identity_reference as string, role.role as ZumraFoundingRole]),
  );

  const members = memberRows.map((member) => {
    const memberIdentity = member.core_identity_reference as string;
    const profile = profileByIdentity.get(memberIdentity);
    return {
      coreIdentityReference: memberIdentity,
      displayName: profile?.display_name || `Membre ${memberIdentity.slice(-6)}`,
      joinedAt: member.joined_at,
      country: profile?.country ?? null,
      city: profile?.city ?? null,
      sectors: profile?.sectors ?? [],
      role: roleByIdentity.get(memberIdentity) ?? null,
    };
  });

  const roles = ZUMRA_FOUNDING_ROLE_ORDER.map((role) => {
    const assignment = (rolesResult.data ?? []).find((row) => row.role === role);
    const holder = assignment
      ? members.find((member) => member.coreIdentityReference === assignment.core_identity_reference)
      : undefined;
    return {
      role,
      label: ZUMRA_FOUNDING_ROLE_LABELS[role],
      coreIdentityReference: assignment?.core_identity_reference ?? null,
      displayName: holder?.displayName ?? null,
      assignedAt: assignment?.assigned_at ?? null,
    };
  });

  const currentRole = roleByIdentity.get(identity) ?? null;
  const rolesFilled = roles.filter((role) => Boolean(role.coreIdentityReference)).length;

  return {
    group: {
      id: group.id,
      name: group.name,
      sector: group.sector,
      objective: group.objective,
      participationMode: group.participation_mode,
      country: group.country,
      city: group.city,
      status: group.status,
      activatedAt: group.activated_at,
      createdAt: group.created_at,
      activeMembers: members.length,
      rolesFilled,
      requiredMembers: 5,
      requiredRoles: 5,
      currentRole,
    },
    members,
    roles,
    canManage: currentRole === 'principal',
  };
}
