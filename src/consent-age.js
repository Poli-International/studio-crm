// Age and guardian rules for consent forms. A client under GUARDIAN_AGE signs only a form a parent
// or legal guardian signs too (the form builder's "Minor Consent & Legal Guardian Authorization").
// ponytail: one age for every service and country; a per-service setting if a studio needs 16 for piercings.
export const GUARDIAN_AGE = 18;

// Whole years on the given day, or null for no date or one that cannot be read.
export function ageOn(dob, on = new Date()) {
  const m = String(dob || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  let age = on.getFullYear() - y;
  if (on.getMonth() + 1 < mo || (on.getMonth() + 1 === mo && on.getDate() < d)) age--;
  return age >= 0 && age < 130 ? age : null;
}

// A form with a signature field for a parent or guardian.
export function isGuardianForm(schema) {
  const fields = ((schema && schema.sections) || []).flatMap((s) => (s && s.fields) || []);
  return fields.some((f) => f && f.type === 'signature' && /guardian|parent/i.test(`${f.id || ''} ${f.label || ''}`));
}

// The client's own birth date when the form asked for it (never the guardian's).
export function dobFromResponses(responses) {
  for (const k of ['dob', 'client_dob', 'date_of_birth', 'birth_date', 'birthdate', 'minor_dob']) {
    const v = responses && responses[k];
    if (typeof v === 'string' && ageOn(v) !== null) return v.slice(0, 10);
  }
  return null;
}
