export const ZUMRA_CHARTER_VERSION = '1.0';

export type ZumraMembershipStatus = 'pending_payment' | 'active' | 'suspended' | 'closed';
export type ZumraContributionStatus = 'not_started' | 'up_to_date' | 'grace' | 'late';
export type ZumraParticipationMode = 'physical' | 'digital' | 'both';
export type ZumraGroupStatus = 'forming' | 'active' | 'suspended' | 'closed';

export const ZUMRA_FOUNDING_ROLE_ORDER = [
  'principal',
  'deputy_1',
  'deputy_2',
  'finance',
  'social',
] as const;

export type ZumraFoundingRole = typeof ZUMRA_FOUNDING_ROLE_ORDER[number];

export const ZUMRA_FOUNDING_ROLE_LABELS: Record<ZumraFoundingRole, string> = {
  principal: 'Responsable principal',
  deputy_1: 'Responsable adjoint 1',
  deputy_2: 'Responsable adjoint 2',
  finance: 'Responsable financier',
  social: 'Responsable des affaires sociales',
};

export type ZumraMembership = {
  status: ZumraMembershipStatus;
  charterVersion: string;
  charterAcceptedAt: string;
  memberSince: string | null;
  contributionStatus: ZumraContributionStatus;
};

export type ZumraProfile = {
  displayName?: string | null;
  country: string;
  city: string;
  phone: string;
  skills: string[];
  noSkillsYet: boolean;
  learningGoals: string[];
  currentActivity: string | null;
  education: string | null;
  sectors: string[];
  intentions: string[];
  participationMode: ZumraParticipationMode;
  openToRecommendations: boolean;
};

export type ZumraMePayload = {
  ok: boolean;
  enrolled: boolean;
  coreIdentityReference?: string;
  membership?: ZumraMembership;
  profile?: ZumraProfile;
  error?: string;
};

export type ZumraGroupSummary = {
  id: string;
  name: string;
  sector: string;
  objective: string;
  participationMode: ZumraParticipationMode;
  country: string | null;
  city: string | null;
  status: ZumraGroupStatus;
  activatedAt: string | null;
  createdAt: string;
  activeMembers: number;
  rolesFilled: number;
  requiredMembers: 5;
  requiredRoles: 5;
  currentRole: ZumraFoundingRole | null;
};

export type ZumraGroupMember = {
  coreIdentityReference: string;
  displayName: string;
  joinedAt: string;
  country: string | null;
  city: string | null;
  sectors: string[];
  role: ZumraFoundingRole | null;
};

export type ZumraGroupRoleAssignment = {
  role: ZumraFoundingRole;
  label: string;
  coreIdentityReference: string | null;
  displayName: string | null;
  assignedAt: string | null;
};

export type ZumraGroupDetail = {
  group: ZumraGroupSummary;
  members: ZumraGroupMember[];
  roles: ZumraGroupRoleAssignment[];
  canManage: boolean;
};
