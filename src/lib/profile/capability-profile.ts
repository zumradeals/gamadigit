import { z } from 'zod';

const nullableText = (max: number) => z.string().trim().max(max).optional().nullable().transform((value) => value?.trim() || null);
const textList = (maxItems: number) => z.array(z.string().trim().min(1).max(80)).max(maxItems).optional().default([]);

const capabilityProfileSchema = z.object({
  country: nullableText(120),
  city: nullableText(120),
  phone: nullableText(30),
  currentActivity: nullableText(160),
  education: nullableText(160),
  skills: textList(20),
  noSkillsYet: z.boolean().optional().default(false),
  learningGoals: textList(20),
  sectors: textList(12),
  intentions: textList(12),
  participationMode: z.enum(['physical', 'digital', 'both']).optional().nullable().default(null),
  openToRecommendations: z.boolean().optional().default(true),
});

export type CapabilityProfileInput = z.infer<typeof capabilityProfileSchema>;

export type CapabilityProfile = CapabilityProfileInput & {
  displayName: string | null;
  exists: boolean;
};

export function parseCapabilityProfileInput(input: unknown): CapabilityProfileInput | null {
  const parsed = capabilityProfileSchema.safeParse(input);
  if (!parsed.success) return null;

  return {
    ...parsed.data,
    skills: parsed.data.noSkillsYet ? [] : parsed.data.skills,
  };
}

export function profileHasOrientationSignal(profile: CapabilityProfileInput): boolean {
  return Boolean(
    profile.country ||
    profile.city ||
    profile.currentActivity ||
    profile.skills.length ||
    profile.noSkillsYet ||
    profile.learningGoals.length ||
    profile.sectors.length ||
    profile.intentions.length,
  );
}
