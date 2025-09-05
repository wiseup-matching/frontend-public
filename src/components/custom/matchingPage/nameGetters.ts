/** Tiny pure helpers for looking up display names by ID. */
export const getSkillName = (id: string, skills: { id: string; name: string }[] = []) =>
  skills.find((s) => s.id === id)?.name ?? id;

export const getExpertiseName = (id: string, expertise: { id: string; name: string }[] = []) =>
  expertise.find((e) => e.id === id)?.name ?? id;

export const getLanguageName = (id: string, languages: { id: string; name: string }[] = []) =>
  languages.find((l) => l.id === id)?.name ?? id;

export const getLevelName = (id: string, levels: { id: string; code: string }[] = []) =>
  levels.find((l) => l.id === id)?.code ?? id;
