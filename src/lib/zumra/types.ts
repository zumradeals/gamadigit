export const ZUMRA_CHARTER_VERSION = '1.0';

export type ZumraMembershipStatus = 'pending_payment' | 'active' | 'suspended' | 'closed';
export type ZumraContributionStatus = 'not_started' | 'up_to_date' | 'grace' | 'late';
export type ZumraParticipationMode = 'physical' | 'digital' | 'both';

export type ZumraMembership = {
  status: ZumraMembershipStatus;
  charterVersion: string;
  charterAcceptedAt: string;
  memberSince: string | null;
  contributionStatus: ZumraContributionStatus;
};

export type ZumraProfile = {
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
