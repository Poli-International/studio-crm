import { describe, it, expect } from 'vitest';
import { AFTERCARE_TRANSLATIONS, AFTERCARE_LANGS, addAftercareTranslations, aftercareText } from '../src/aftercare-texts.js';

describe('aftercare sheets in every language', () => {
  it('every built-in sheet has every language, with as many steps in each', () => {
    const steps = { tattoo: 6, piercing: 5, 'fine-line': 5, pmu: 5 };
    for (const [id, n] of Object.entries(steps)) {
      for (const lang of AFTERCARE_LANGS.filter((l) => l !== 'en')) {
        const t = AFTERCARE_TRANSLATIONS[id][lang];
        expect(t && t.title && t.description, `${id} ${lang}`).toBeTruthy();
        expect(t.steps.length, `${id} ${lang}`).toBe(n);
      }
    }
  });
  it('fills only the languages a sheet does not have, never the studio\'s own wording', () => {
    const tpl = [{ id: 'tattoo', title: 'T', steps: ['a'], translations: { fr: { title: 'Notre fiche', steps: ['x'] } } }, { id: 'custom-1', title: 'C', steps: ['b'] }];
    addAftercareTranslations(tpl);
    expect(tpl[0].translations.fr.title).toBe('Notre fiche');
    expect(tpl[0].translations.de.steps.length).toBe(6);
    expect(tpl[1].translations).toBeUndefined();
  });
  it('a language with no text falls back to the English', () => {
    const t = { title: 'Tattoo care', description: 'd', steps: ['one'], translations: { fr: { title: 'Soins', description: '', steps: [] } } };
    expect(aftercareText(t, 'fr')).toEqual({ title: 'Soins', description: '', steps: ['one'] });
    expect(aftercareText(t, 'de').title).toBe('Tattoo care');
    expect(aftercareText(t, 'en').steps).toEqual(['one']);
  });
});
