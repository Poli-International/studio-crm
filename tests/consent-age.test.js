import { describe, it, expect } from 'vitest';
import { ageOn, isGuardianForm, dobFromResponses } from '../src/consent-age.js';

describe('client age', () => {
  const on = new Date(2026, 9, 18); // 18 October 2026
  it('counts whole years, the birthday itself included', () => {
    expect(ageOn('2008-10-18', on)).toBe(18);
    expect(ageOn('2008-10-19', on)).toBe(17);
    expect(ageOn('2008-11-01', on)).toBe(17);
    expect(ageOn('1990-01-01', on)).toBe(36);
  });
  it('is unknown for no date or one that cannot be read', () => {
    for (const v of ['', null, undefined, 'Not recorded', '18/10/2008', '2008-13-01', '2030-01-01']) expect(ageOn(v, on)).toBe(null);
  });
});

describe('guardian forms', () => {
  const form = (fields) => ({ sections: [{ id: 's', fields }] });
  it('needs a signature field for a parent or guardian', () => {
    expect(isGuardianForm(form([{ id: 'guardian_sig', type: 'signature', label: 'Parent / Legal Guardian Signature' }]))).toBe(true);
    expect(isGuardianForm(form([{ id: 'sig2', type: 'signature', label: 'Signature of parent' }]))).toBe(true);
    expect(isGuardianForm(form([{ id: 'client_sig', type: 'signature', label: 'Client Signature' }]))).toBe(false);
    expect(isGuardianForm(form([{ id: 'guardian_name', type: 'text', label: 'Guardian name' }]))).toBe(false);
    expect(isGuardianForm(null)).toBe(false);
  });
  it("reads the client's own birth date from the answers", () => {
    expect(dobFromResponses({ dob: '2010-05-02' })).toBe('2010-05-02');
    expect(dobFromResponses({ minor_dob: '2011-01-09T00:00' })).toBe('2011-01-09');
    expect(dobFromResponses({ guardian_dob: '1980-01-01' })).toBe(null);
    expect(dobFromResponses({ dob: 'unknown' })).toBe(null);
  });
});
