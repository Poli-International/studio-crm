'use strict';

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const CATEGORIES = [
  {
    id: 'pain',
    label: 'Painkillers & Anti-inflammatories (NSAIDs)',
    meds: [
      {
        id: 'ibuprofen',
        name: 'Ibuprofen',
        sub: 'Advil / Nurofen / Motrin / Brufen / Ibuprom / Alivium / Cuprofen / Spidifen / Antalgic / Algiasdin / Neobrufen / Ibu-Ratiopharm / Espidifen / Dalsy',
        cat: 'pain',
        sev: 'mod',
        riskBadges: ['🩸 Bleeding Risk', '💧 Plasma Oozing'],
        tattoo: 'Inhibits COX-1/2 enzymes, reducing platelet aggregation. Taking ibuprofen before a session increases procedural bleeding and plasma oozing, and heavier scabbing follows from that. Whether it affects ink retention itself has not been studied. Paracetamol/Acetaminophen is the better choice before a session.',
        piercing: 'Increases local bleeding and initial bruising at the piercing site. Not a total contraindication, but can cause prolonged oozing during tissue perforation.',
        wait: 'Avoid taking non-prescribed NSAIDs 24–48 hours prior to a session. Paracetamol is a safer alternative if approved by your doctor.',
        tags: 'pain, nsaid, advil, nurofen, motrin, brufen, ibuprom, alivium, cuprofen, spidifen, antalgic, algiasdin, neobrufen, espidifen, dalsy, headache, fever, inflammation, uk, us, eu, au, ca, fr, es, de, it, pt'
      },
      {
        id: 'naproxen',
        name: 'Naproxen',
        sub: 'Aleve / Anaprox / Naprosyn / Synflex / Feminax Ultra / Apranax / Momendol / Antalgin / Naproxeno Ratiopharm / Feldene',
        cat: 'pain',
        sev: 'mod',
        riskBadges: ['🩸 Bleeding Risk', '💧 Plasma Oozing'],
        tattoo: 'Longer-acting NSAID with significant platelet-inhibiting effects lasting up to 24–36 hours. Increased risk of prolonged bleeding and scab formation. As with other NSAIDs, the effect on ink retention itself has not been studied.',
        piercing: 'Increased bleeding and localized hematoma formation at fresh piercing sites.',
        wait: 'Avoid 48 hours pre-procedure if taken casually for pain. If prescribed, consult your doctor before pausing.',
        tags: 'aleve, naprosyn, anaprox, synflex, feminax, apranax, momendol, antalgin, feldene, pain, nsaid, joint pain, period pain, uk, us, eu, au, fr, es, it, de'
      },
      {
        id: 'paracetamol',
        name: 'Acetaminophen / Paracetamol',
        sub: 'Tylenol / Panadol / Calpol / Hedex / Mapap / Dolo / Disprol / Efferalgan / Doliprane / Dafalgan / Tachipirina / Gelocatil / Ben-u-ron / Apotel / Termalgin / Paralen',
        cat: 'pain',
        sev: 'low',
        riskBadges: ['✅ Safe Analgesic', '🩸 No Extra Bleeding'],
        tattoo: 'Does NOT inhibit platelet function or increase bleeding. Safe and preferred analgesic for pre-procedure nervous tension or post-procedure soreness when taken at therapeutic doses.',
        piercing: 'Ideal over-the-counter pain reliever for post-piercing swelling or soreness as it does not promote bleeding or bruising.',
        wait: 'No pre-procedure wait required. Stay within recommended daily dosage limits.',
        tags: 'tylenol, panadol, calpol, hedex, mapap, dolo, disprol, efferalgan, doliprane, dafalgan, tachipirina, gelocatil, benuron, apotel, termalgin, paralen, pain, fever, safe, headache, uk, us, eu, au, ca, fr, es, it, de, pt, in'
      },
      {
        id: 'opioids',
        name: 'Opioids & Narcotic Analgesics',
        sub: 'Codeine / Tramadol / Oxycodone (OxyContin) / Hydrocodone (Vicodin) / Morphine / Fentanyl / Tramal / Contramal / Adolonta / Skenan / Oxygesic / Targin / Subutex / Co-Codamol / Klipal / Izalgi / Zaldiar',
        cat: 'pain',
        sev: 'high',
        riskBadges: ['💫 Fainting Risk', '⚠️ Sedation Risk'],
        tattoo: 'Alters pain perception and central nervous system response. Causes sedation, lowered blood pressure, nausea, and increased risk of vasovagal syncope (fainting). Most professional studios will decline clients under active narcotic influence.',
        piercing: 'High risk of dizziness, nausea, and fainting during or after the procedure. Impaired consent issues if taking acute high-dose narcotics.',
        wait: 'Do not attend a session under the acute influence of narcotic painkillers. If taking chronic prescription pain medication, obtain physician clearance.',
        tags: 'tramadol, oxycontin, oxycodone, codeine, vicodin, hydrocodone, morphine, percocet, fentanyl, tramal, contramal, adolonta, skenan, oxygesic, targin, subutex, cocodamol, klipal, izalgi, zaldiar, nurofen plus, pain, prescription, us, uk, ca, au, eu, fr, es, de, it'
      }
    ]
  },
  {
    id: 'numbing',
    label: 'Topical Numbing Creams & Local Anaesthetics',
    meds: [
      {
        id: 'lidocaine_cream',
        name: 'Topical Lidocaine / Prilocaine',
        sub: 'EMLA / TKTX / Mithra / J-Pro / LMX4 / Numb-It / Deep Numb / Anesten',
        cat: 'numbing',
        sev: 'mod',
        riskBadges: ['🩹 Skin Texture Alteration', '⚡ Rebound Shock'],
        tattoo: 'Alters skin texture by causing localized edema (swelling) and spongy/rubbery skin density. Can hinder clean needle penetration and line precision. When the cream wears off mid-session, sudden intense pain shock can occur. Unregulated high-concentration creams carry toxicity risks.',
        piercing: 'Topical creams only numb the superficial epidermis, not the deeper cartilage or subcutaneous tissue pierced. May cause localized skin blanching and swelling.',
        wait: 'Always inform your artist prior to applying numbing cream. Many studios prohibit client-applied numbing cream due to chemical burn and skin texture risks.',
        tags: 'emla, tktx, mithra, jpro, lmx4, numbit, deepnumb, anesten, numbing, lidocaine, prilocaine, pain relief, cream, us, uk, eu, au'
      },
      {
        id: 'epinephrine_numbing',
        name: 'Numbing Creams with Epinephrine',
        sub: 'Adrenaline / Vascular Constrictor Additives',
        cat: 'numbing',
        sev: 'high',
        riskBadges: ['🩸 Rebound Bleeding', '⚠️ Vasoconstriction'],
        tattoo: 'Epinephrine causes strong vasoconstriction (narrowing blood vessels) to reduce bleeding. When it wears off, severe "rebound hyperemia" occurs — rapid vascular dilation, intense bleeding, and heavy plasma exudate that damages fresh ink setting.',
        piercing: 'Blanches skin during piercing marking, making accurate alignment difficult. Rebound bleeding and intense throbbing occur post-procedure.',
        wait: 'Avoid vasoconstrictive numbing agents unless administered directly by a medical professional or approved by your artist.',
        tags: 'adrenaline, epinephrine, vasoconstrictor, bleeding, rebound, numbing'
      }
    ]
  },
  {
    id: 'blood',
    label: 'Blood Thinners & Anticoagulants',
    meds: [
      {
        id: 'warfarin',
        name: 'Warfarin',
        sub: 'Coumadin / Jantoven / Marevan / Uniwarfin',
        cat: 'blood',
        sev: 'high',
        riskBadges: ['🩸 High Bleeding Risk', '⏳ Delayed Healing'],
        tattoo: 'Significant bleeding during tattooing — prolonged oozing impairs ink setting. Colour saturation and linework clarity are affected. Most professional studios require medical clearance or decline clients on active therapeutic anticoagulation.',
        piercing: 'Excessive bleeding during piercing and prolonged healing phase. Any haematoma at a new piercing site delays fistula formation significantly.',
        wait: 'Discuss stopping or bridging with your prescribing physician — do not discontinue without medical guidance.',
        tags: 'coumadin, jantoven, marevan, uniwarfin, blood thinner, anticoagulant, heart, stroke, uk, us, eu, au'
      },
      {
        id: 'apixaban',
        name: 'Apixaban / Rivaroxaban / Dabigatran',
        sub: 'Eliquis / Xarelto / Pradaxa / Savaysa / Lixiana',
        cat: 'blood',
        sev: 'high',
        riskBadges: ['🩸 High Bleeding Risk', '⏳ Delayed Healing'],
        tattoo: 'Same bleeding profile as warfarin. Direct oral anticoagulants (DOACs) have shorter half-lives but effects are still significant during skin-breaking procedures.',
        piercing: 'Elevated bleeding and bruising at piercing site. Jewellery pressure on a haematoma increases rejection risk.',
        wait: 'Half-life 8–12 hours — discuss a supervised pause with your physician. Do not pause without medical approval.',
        tags: 'eliquis, xarelto, pradaxa, savaysa, lixiana, doac, blood thinner, clot, stroke, us, uk, eu, au'
      },
      {
        id: 'aspirin',
        name: 'Aspirin (therapeutic dose)',
        sub: 'Bayer / Disprin / Anacin / Ecotrin / Bufferin / Asaphen (75–300 mg daily)',
        cat: 'blood',
        sev: 'mod',
        riskBadges: ['🩸 Mild Bleeding Risk'],
        tattoo: 'Low-dose aspirin increases procedural bleeding and minor bruising. Does not typically prevent tattooing but your artist should be informed to adjust wiping technique.',
        piercing: 'Increased bruising and minor bleeding. Not usually a contraindication at low doses, but inform your piercer.',
        wait: 'Aspirin irreversibly inhibits platelets — effects last 7–10 days after last dose. Discuss temporary pause with your doctor if appropriate.',
        tags: 'bayer, disprin, anacin, ecotrin, bufferin, asaphen, blood thinner, cardiac, heart, stroke, us, uk, au, ca'
      },
      {
        id: 'clopidogrel',
        name: 'Clopidogrel / Prasugrel / Ticagrelor',
        sub: 'Plavix / Effient / Brilinta / Brilique',
        cat: 'blood',
        sev: 'high',
        riskBadges: ['🩸 High Bleeding Risk', '⏳ Delayed Healing'],
        tattoo: 'Significant platelet inhibition — similar bleeding profile to aspirin but often combined with other anticoagulants. Most studios will request medical clearance.',
        piercing: 'Significant bleeding risk. Haematoma formation at piercing site is a real concern.',
        wait: 'Do not stop clopidogrel without cardiologist approval — prescribed for cardiac protection.',
        tags: 'plavix, effient, brilinta, brilique, stent, cardiac, blood thinner, heart, us, uk, eu, au'
      },
      {
        id: 'heparin',
        name: 'Heparin / Enoxaparin',
        sub: 'Lovenox / Clexane / Fragmin / Injections',
        cat: 'blood',
        sev: 'high',
        riskBadges: ['🩸 High Bleeding Risk', '⏳ Delayed Healing'],
        tattoo: 'Injectable low-molecular-weight heparin causes strong anticoagulation. Very high bleeding risk during skin puncture. Elective tattooing should be deferred.',
        piercing: 'High bleeding risk and hematoma formation. Defer elective piercings while on therapeutic LMWH.',
        wait: 'Consult your prescribing doctor. Never miss doses without medical supervision.',
        tags: 'lovenox, clexane, fragmin, injection, clot, dvt, pe, us, uk, eu, au'
      }
    ]
  },
  {
    id: 'retinoid',
    label: 'Retinoids (Acne / Anti-ageing)',
    meds: [
      {
        id: 'isotretinoin',
        name: 'Isotretinoin',
        sub: 'Accutane / Roaccutane / Oratane / Curatane / Claravis / Amnesteem / Sotret / Myorisan',
        cat: 'retinoid',
        sev: 'high',
        riskBadges: ['❌ Severe Scarring', '⏳ Healing Delay', '🩹 Fragile Skin'],
        tattoo: 'Isotretinoin fundamentally alters epidermal cell turnover, thins the skin, and suppresses sebum production. Tattooing during treatment causes severe scarring, unpredictable ink loss, and impaired healing. Universal contraindication.',
        piercing: 'Skin is fragile and slow to heal. Fistula formation is severely impaired. High risk of hypertrophic scarring or piercing rejection.',
        wait: 'Standard professional guidance: wait 6–12 months after finishing isotretinoin treatment before tattooing or getting new piercings.',
        tags: 'accutane, roaccutane, oratane, curatane, claravis, amnesteem, sotret, myorisan, acne, skin, pimples, us, uk, eu, au, ca'
      },
      {
        id: 'tretinoin',
        name: 'Tretinoin (topical)',
        sub: 'Retin-A / Stieva-A / Rejuva-A / Treclin / Aretin',
        cat: 'retinoid',
        sev: 'mod',
        riskBadges: ['🩹 Skin Sensitivity', '☀️ Photosensitivity'],
        tattoo: 'Topical retinoids at the tattoo site thin the upper skin layers and increase sensitivity. Stop applying to the target area 2–4 weeks prior. Systemic absorption from topical use is minimal.',
        piercing: 'Avoid applying topical retinoids to or near a new piercing site during healing to prevent chemical irritation.',
        wait: 'Discontinue topical tretinoin at the specific site 2–4 weeks pre-tattoo.',
        tags: 'retin-a, stieva-a, rejuva-a, treclin, aretin, anti aging, wrinkle, topical, acne, us, uk, au, ca'
      },
      {
        id: 'adapalene',
        name: 'Adapalene',
        sub: 'Differin / Epiduo',
        cat: 'retinoid',
        sev: 'mod',
        riskBadges: ['🩹 Skin Sensitivity'],
        tattoo: 'Topical retinoid causing localized skin sensitivity and peeling. Discontinue at the target site before tattooing.',
        piercing: 'Keep away from fresh piercing sites to prevent severe irritation or delayed epithelialization.',
        wait: 'Discontinue topical application at the target site 2 weeks prior to procedure.',
        tags: 'differin, epiduo, acne, topical, skin, us, uk, eu'
      }
    ]
  },
  {
    id: 'anxiety',
    label: 'Anti-Anxiety, Sedatives & Blood Pressure',
    meds: [
      {
        id: 'xanax',
        name: 'Benzodiazepines',
        sub: 'Xanax / Valium / Ativan / Klonopin / Diazepam / Alprazolam / Lorazepam / Clonazepam / Temazepam / Lexotan',
        cat: 'anxiety',
        sev: 'mod',
        riskBadges: ['💫 Fainting Risk', '⬇️ Low Blood Pressure'],
        tattoo: 'Causes central nervous system depression, drowsiness, and lowered blood pressure. Combined with pain or anxiety, can trigger sudden blood pressure drops or fainting. Inform your artist.',
        piercing: 'Increases risk of vasovagal syncope (fainting) post-procedure. Ensure you stay seated or reclined for 15 minutes after piercing.',
        wait: 'Inform your artist if taken pre-procedure for anxiety. Do not drive to or from your appointment if sedated.',
        tags: 'valium, xanax, ativan, klonopin, diazepam, alprazolam, lorazepam, clonazepam, temazepam, lexotan, anxiety, panic, nerves, sedatives, us, uk, eu, au, ca'
      },
      {
        id: 'propranolol',
        name: 'Beta Blockers',
        sub: 'Propranolol (Inderal) / Metoprolol (Lopressor) / Atenolol (Tenormin) / Bisoprolol',
        cat: 'anxiety',
        sev: 'mod',
        riskBadges: ['💫 Fainting Risk', '❤️ Bradycardia'],
        tattoo: 'Lowers heart rate and blunts normal epinephrine stress response. During long sessions or pain, clients are at higher risk of orthostatic hypotension and vasovagal fainting.',
        piercing: 'Higher fainting risk during rapid needle insertion. Piercer should perform procedure with client lying down.',
        wait: 'Do not skip prescribed cardiac medications. Inform your artist/piercer so they can adjust seating position.',
        tags: 'propranolol, inderal, metoprolol, lopressor, atenolol, tenormin, bisoprolol, blood pressure, cardiac, stage fright, us, uk, au, ca'
      },
      {
        id: 'hydroxyzine',
        name: 'Sedating Antihistamines',
        sub: 'Hydroxyzine (Vistaril / Atarax) / Diphenhydramine (Benadryl)',
        cat: 'anxiety',
        sev: 'low',
        riskBadges: ['😴 Drowsiness'],
        tattoo: 'Used for mild anxiety or hives. Causes mild drowsiness and dry mouth. Minimal direct interaction with tattooing.',
        piercing: 'Mild sedative effect. Stay hydrated during session.',
        wait: 'No washout required.',
        tags: 'vistaril, atarax, benadryl, hydroxyzine, anxiety, allergy, sleep, us, uk, ca'
      }
    ]
  },
  {
    id: 'hormone',
    label: 'Hormones, Contraceptives & HRT',
    meds: [
      {
        id: 'birth_control',
        name: 'Oral Contraceptives & Hormonal Contraception',
        sub: 'Pill / Patch / Ring / Depo-Provera / Hormonal IUD (Mirena / Jaydess)',
        cat: 'hormone',
        sev: 'low',
        riskBadges: ['☀️ Minor Pigmentation Risk'],
        tattoo: 'Estrogen-containing contraceptives slightly increase baseline hyperpigmentation risk (melasma) when exposed to sun during healing. Minimal impact on tattooing.',
        piercing: 'Progestin or estrogen can cause minor fluid retention or localized swelling sensitivity.',
        wait: 'No pre-procedure changes required.',
        tags: 'contraceptive, pill, mirena, jaydess, depo, estrogen, iud, progesterone, us, uk, au'
      },
      {
        id: 'hrt_testosterone',
        name: 'Gender-Affirming HRT (Testosterone)',
        sub: 'Nebido / Sustanon / Testim / AndroGel / Testosterone Enanthate',
        cat: 'hormone',
        sev: 'low',
        riskBadges: ['🩸 Slightly Thicker Blood'],
        tattoo: 'Testosterone therapy can increase skin oiliness, thickness, and hematocrit (red blood cell density), which may cause slightly thicker blood flow during sessions. Generally safe for tattooing.',
        piercing: 'Testosterone can cause skin thickening and increased sebum production near facial or body piercings. Maintain good hygiene.',
        wait: 'No pre-procedure changes required. Continue regular medical HRT dosing.',
        tags: 'testosterone, nebido, sustanon, testim, androgel, hrt, gender affirming, trans, hormone, us, uk, eu, au'
      },
      {
        id: 'hrt_estrogen',
        name: 'Gender-Affirming HRT (Estrogen / Anti-androgens)',
        sub: 'Estradiol / Spironolactone (Aldactone) / Cyproterone (Androcur)',
        cat: 'hormone',
        sev: 'low',
        riskBadges: ['💧 Dehydration Sensitivity'],
        tattoo: 'Estrogen therapy thins the dermal layer slightly over time and increases skin softness. Spironolactone has mild diuretic and blood-pressure lowering properties; ensure full hydration.',
        piercing: 'Spironolactone increases urination and dehydrates tissue slightly — drink extra fluids before piercing.',
        wait: 'No pre-procedure changes required. Stay well-hydrated.',
        tags: 'estradiol, spironolactone, aldactone, cyproterone, androcur, hrt, trans, hormone, us, uk, eu'
      }
    ]
  },
  {
    id: 'stimulant',
    label: 'ADHD & Stimulants',
    meds: [
      {
        id: 'adhd_stimulants',
        name: 'ADHD Stimulants',
        sub: 'Adderall / Vyvanse (Elvanse / Tyvense) / Ritalin / Concerta / Foquest / Dexedrine / Focalin',
        cat: 'stimulant',
        sev: 'mod',
        riskBadges: ['⚡ Heart Rate Increase', '💫 Fainting Risk'],
        tattoo: 'Stimulants elevate heart rate, blood pressure, and central nervous arousal. Can make clients jittery, lower pain tolerance during long sessions, and increase dehydration. Blood sugar drops faster.',
        piercing: 'Higher nervous tension and muscle tightness during piercing. Increased risk of sudden lightheadedness when adrenaline drops.',
        wait: 'Ensure you eat a heavy meal and drink plenty of water before your appointment. Inform your artist.',
        tags: 'adderall, vyvanse, elvanse, tyvense, ritalin, concerta, foquest, dexedrine, focalin, adhd, stimulant, focus, us, uk, ca, au, eu'
      }
    ]
  },
  {
    id: 'metabolic',
    label: 'Diabetes, Metabolic & GLP-1 Agonists',
    meds: [
      {
        id: 'glp1_agonists',
        name: 'GLP-1 Receptor Agonists',
        sub: 'Ozempic / Wegovy / Mounjaro / Zepbound / Trulicity / Saxenda / Victoza / Rybelsus',
        cat: 'metabolic',
        sev: 'mod',
        riskBadges: ['💫 Hypoglycemia Risk', '💫 Fainting Risk'],
        tattoo: 'GLP-1 drugs delay gastric emptying and alter blood glucose regulation. Clients undergoing long tattoo sessions are at risk for sudden hypoglycemia, nausea, and vasovagal fainting if they haven\'t consumed adequate calories.',
        piercing: 'Increased risk of nausea, lightheadedness, or fainting during piercing if blood sugar drops.',
        wait: 'Eat a small, easily digestible meal 1–2 hours before the session and bring sugary drinks (juice, soda) to maintain glucose levels.',
        tags: 'ozempic, wegovy, mounjaro, zepbound, trulicity, saxenda, victoza, rybelsus, semaglutide, tirzepatide, weight loss, diabetes, us, uk, eu, ca, au'
      },
      {
        id: 'insulin',
        name: 'Insulin & Diabetes Medications',
        sub: 'Metformin (Glucophage) / Januvia / Jardiance / Insulin (Lantus / Humalog / Novolog)',
        cat: 'metabolic',
        sev: 'mod',
        riskBadges: ['⏳ Delayed Healing', '🦠 Infection Risk'],
        tattoo: 'Diabetes impairs microvascular circulation and wound healing. Poorer immune response increases infection risk and delays scab resolution. Well-controlled diabetes is low risk; poorly controlled increases infection risk.',
        piercing: 'Higher infection risk and slower fistula formation in poorly controlled diabetes. Lower extremity piercings (e.g. ankles) heal very slowly in diabetic clients.',
        wait: 'Ensure blood glucose is stable before session. Bring glucose tablets or snacks.',
        tags: 'insulin, metformin, glucophage, januvia, jardiance, lantus, humalog, novolog, diabetes, blood sugar, us, uk, eu, au'
      }
    ]
  },
  {
    id: 'corticosteroid',
    label: 'Corticosteroids',
    meds: [
      {
        id: 'prednisone',
        name: 'Oral Corticosteroids',
        sub: 'Prednisone (Deltasone) / Prednisolone (Panafcort) / Dexamethasone / Medrol',
        cat: 'corticosteroid',
        sev: 'mod',
        riskBadges: ['🦠 Infection Risk', '⏳ Delayed Healing'],
        tattoo: 'Systemic steroids suppress the immune response required for proper wound healing. Higher infection risk and altered inflammatory phase. Skin fragile on chronic doses.',
        piercing: 'Immunosuppression significantly increases infection risk during piercing healing. Fistula formation delayed.',
        wait: 'Short courses (<2 weeks): wait until course ends. Long-term steroid therapy: obtain physician clearance.',
        tags: 'prednisone, deltasone, panafcort, dexamethasone, medrol, steroid, immune, inflammation, asthma, us, uk, au, ca'
      },
      {
        id: 'inhaled_steroids',
        name: 'Inhaled / Topical Steroids',
        sub: 'Fluticasone (Flonase) / Hydrocortisone / Betamethasone',
        cat: 'corticosteroid',
        sev: 'low',
        riskBadges: ['🩹 Skin Fragility at Site'],
        tattoo: 'Inhaled steroids have minimal systemic impact. Topical steroids applied at the tattoo site thin the skin and should be discontinued 2 weeks prior.',
        piercing: 'Standard risk unless topical steroid is applied directly to the piercing site.',
        wait: 'Discontinue topical steroids at the target area 2 weeks pre-procedure.',
        tags: 'flonase, hydrocortisone, betamethasone, cream, inhaler, eczema, us, uk'
      }
    ]
  },
  {
    id: 'immuno',
    label: 'Immunosuppressants & Biologics',
    meds: [
      {
        id: 'methotrexate',
        name: 'Methotrexate',
        sub: 'Rheumatrex / Maxtrex / Trexall / Metoject',
        cat: 'immuno',
        sev: 'high',
        riskBadges: ['🦠 High Infection Risk', '⏳ Delayed Healing'],
        tattoo: 'Significant immune suppression means tattoo healing is unpredictable — increased infection risk, impaired inflammatory phase, and potential for opportunistic skin infection. Medical clearance required.',
        piercing: 'High infection risk. Elective piercings during methotrexate therapy are strongly inadvisable without specialist approval.',
        wait: 'Discuss with rheumatologist/dermatologist before booking. Do not pause without doctor guidance.',
        tags: 'rheumatrex, maxtrex, trexall, metoject, methotrexate, rheumatoid, arthritis, psoriasis, immune, us, uk, eu'
      },
      {
        id: 'biologics',
        name: 'Biologics & TNF Inhibitors',
        sub: 'Adalimumab (Humira) / Enbrel / Stelara / Skyrizi / Tremfya / Cosentyx / Dupixent',
        cat: 'immuno',
        sev: 'high',
        riskBadges: ['🦠 High Infection Risk', '⏳ Delayed Healing'],
        tattoo: 'Biologics suppress specific immune pathways (TNF-alpha, IL-17/23). Significantly elevated risk of bacterial skin infections and delayed wound closure.',
        piercing: 'High infection risk. Elective piercings should be discussed with your prescribing specialist.',
        wait: 'Do not interrupt biologic therapy. Schedule sessions relative to injection cycles after specialist consultation.',
        tags: 'humira, enbrel, stelara, skyrizi, tremfya, cosentyx, dupixent, crohns, psoriasis, biologic, us, uk, eu, au'
      },
      {
        id: 'ciclosporin',
        name: 'Calcineurin Inhibitors',
        sub: 'Ciclosporin / Tacrolimus (Neoral / Prograf)',
        cat: 'immuno',
        sev: 'high',
        riskBadges: ['🦠 High Infection Risk', '⏳ Delayed Healing'],
        tattoo: 'Systemic immunosuppressants used in transplant medicine and severe autoimmune disease. Suppressing the immune system raises infection risk generally, and that is the reason for caution here. The effect on tattoo healing specifically has not been studied, so treat this entry as precautionary rather than evidence-based.',
        piercing: 'Elective piercings during active therapy are best deferred until your specialist has weighed in. This is a precaution, not a measured risk.',
        wait: 'Obtain clearance from transplant team or specialist.',
        tags: 'prograf, neoral, ciclosporin, tacrolimus, transplant, autoimmune, us, uk, eu'
      }
    ]
  },
  {
    id: 'supplement',
    label: 'Herbal Supplements & Vitamins',
    meds: [
      {
        id: 'fish_oil',
        name: 'Fish Oil & Omega-3 Fatty Acids',
        sub: 'EPA / DHA High-Dose Supplements',
        cat: 'supplement',
        sev: 'mod',
        riskBadges: ['🩸 Mild Bleeding Risk'],
        tattoo: 'High doses (>2000mg/day) mildly inhibit platelet aggregation and thin blood. Often causes increased plasma oozing during tattooing.',
        piercing: 'Mildly increased bleeding and initial bruising.',
        wait: 'Consider pausing high-dose fish oil 5–7 days before session if approved by your doctor.',
        tags: 'fish oil, omega 3, epa, dha, supplement, blood thinner, heart, us, uk, au'
      },
      {
        id: 'vitamin_e',
        name: 'Vitamin E (High Dose)',
        sub: 'Tocopherol Supplements',
        cat: 'supplement',
        sev: 'mod',
        riskBadges: ['🩸 Mild Bleeding Risk'],
        tattoo: 'Vitamin E antagonizes Vitamin K dependent clotting factors. High doses increase bleeding and bruising during tattooing.',
        piercing: 'Increased bruising at piercing site.',
        wait: 'Pause high-dose Vitamin E supplements 7 days prior to procedure.',
        tags: 'vitamin e, tocopherol, supplement, skin, antioxidant'
      },
      {
        id: 'ginkgo_stjohns',
        name: 'Ginkgo Biloba & St. John\'s Wort',
        sub: 'Herbal Blood Thinners / Mood Supplements',
        cat: 'supplement',
        sev: 'mod',
        riskBadges: ['🩸 Bleeding Risk', '☀️ Photosensitivity'],
        tattoo: 'Ginkgo biloba inhibits PAF (platelet-activating factor) and causes excessive procedural bleeding. St. John\'s Wort induces liver enzymes and increases photosensitivity.',
        piercing: 'Increased bleeding risk from Ginkgo; photosensitivity from St. John\'s Wort.',
        wait: 'Pause herbal supplements 7–10 days before procedure.',
        tags: 'ginkgo, st johns wort, herbal, mood, blood thinner, us, uk, eu'
      },
      {
        id: 'turmeric_garlic',
        name: 'Turmeric / Curcumin & Concentrated Garlic',
        sub: 'High-Potency Extract Pills',
        cat: 'supplement',
        sev: 'mod',
        riskBadges: ['🩸 Mild Bleeding Risk'],
        tattoo: 'High-dose curcumin and garlic extracts have antiplatelet effects. Can cause noticeable extra bleeding and plasma weeping.',
        piercing: 'Minor increase in bleeding during tissue perforation.',
        wait: 'Pause high-potency extracts 5–7 days before procedure. Culinary garlic/turmeric in food is completely safe.',
        tags: 'turmeric, curcumin, garlic, herbal, inflammation'
      }
    ]
  },
  {
    id: 'antibiotic',
    label: 'Antibiotics & Antivirals',
    meds: [
      {
        id: 'tetracyclines',
        name: 'Tetracyclines',
        sub: 'Doxycycline / Minocycline',
        cat: 'antibiotic',
        sev: 'mod',
        riskBadges: ['☀️ Photosensitivity', '🎨 Ink Staining Risk'],
        tattoo: 'Causes significant photosensitivity — UV exposure on new tattoos during treatment can trigger painful allergic reactions and ink fading. Minocycline can rarely cause blue-grey skin pigmentation.',
        piercing: 'No direct healing interaction, but protect fresh piercing site from sun exposure.',
        wait: 'Avoid sun/UV exposure on target area while taking tetracyclines.',
        tags: 'doxycycline, minocycline, acne, antibiotic, sun, us, uk, eu'
      },
      {
        id: 'antivirals_herpes',
        name: 'Antivirals (Oral / Lip Piercing Care)',
        sub: 'Acyclovir / Valacyclovir (Zovirax / Valtrex / Famvir)',
        cat: 'antibiotic',
        sev: 'low',
        riskBadges: ['👄 Outbreak Prevention'],
        tattoo: 'CRUCIAL FOR LIP TATTOOS / PERMANENT MAKEUP: Permanent lip blushing can trigger severe HSV-1 (cold sore) flare-ups. Prophylactic antivirals are strongly recommended before lip tattooing.',
        piercing: 'Lip or oral piercings can trigger cold sore outbreaks in HSV-positive clients. Taking prophylactic antivirals prevents painful herpes lesions on new piercings.',
        wait: 'Start prophylactic antiviral 2 days before lip tattooing or oral piercing as directed by your doctor.',
        tags: 'valtrex, acyclovir, zovirax, famvir, valacyclovir, cold sore, herpes, lip tattoo, lip blush, lip piercing, us, uk, eu, au'
      }
    ]
  },
  {
    id: 'substance',
    label: 'Substances, Alcohol, Nicotine & Lifestyle',
    meds: [
      {
        id: 'cannabis',
        name: 'Cannabis / THC / CBD / Marijuana',
        sub: 'Weed / Joint / Hash / Edibles / Medical Cannabis / Vapes',
        cat: 'substance',
        sev: 'mod',
        riskBadges: ['⚡ Vasodilation', '💫 Fainting Risk', '🧠 Heightened Sensitivity'],
        tattoo: 'THC increases baseline heart rate, dilates blood vessels (increasing plasma weeping), and can significantly heighten anxiety or paranoia during skin puncture. Many artists will decline clients under acute influence.',
        piercing: 'Increases risk of vasovagal syncope or sudden panic during piercing insertion. Alters pain perception unexpectedly.',
        wait: 'Avoid smoking or consuming THC edibles 12–24 hours before your appointment.',
        tags: 'cannabis, thc, cbd, weed, marijuana, joint, hash, edible, vape, mariguana, cannabis sativa, us, uk, eu, ca, au'
      },
      {
        id: 'alcohol',
        name: 'Alcohol & Hangovers',
        sub: 'Beer / Wine / Spirits / Hangover / Binge Drinking',
        cat: 'substance',
        sev: 'high',
        riskBadges: ['🩸 High Bleeding Risk', '💧 Severe Dehydration', '💫 Hypoglycemia Risk'],
        tattoo: 'Alcohol affects platelet function and coagulation, suppresses vasopressin (which promotes dehydration), and can lower blood glucose. The practical concern is more bleeding and oozing during a session, and a lower pain threshold when hungover. How much that affects ink retention has not been studied - treat claims about ink being "pushed out" with caution.',
        piercing: 'More bleeding and prolonged oozing. Dehydration increases fainting risk.',
        wait: 'Do NOT consume alcohol for 24–48 hours before or after your procedure.',
        tags: 'alcohol, beer, wine, vodka, whiskey, hangover, alcohol, bière, vino, cerveza, bier, us, uk, eu, au, ca'
      },
      {
        id: 'nicotine',
        name: 'Nicotine / Tobacco / Vaping',
        sub: 'Cigarettes / Vapes / Nicotine Pouches (Zyn) / Snus / Cigars',
        cat: 'substance',
        sev: 'mod',
        riskBadges: ['⚠️ Vasoconstriction', '⏳ Delayed Healing'],
        tattoo: 'Nicotine is a potent microvascular vasoconstrictor. It shrinks capillary blood vessels, reducing oxygenated blood delivery to fresh tattoo wounds and delaying dermal closure.',
        piercing: 'Dramatically slows down piercing fistula formation, especially for oral, ear cartilage, and nipple piercings.',
        wait: 'Avoid heavy vaping or smoking immediately before and during initial healing phase.',
        tags: 'nicotine, tobacco, cigarettes, vape, vaping, zyn, snus, smoking, tabac, tabacco, us, uk, eu'
      },
      {
        id: 'recreational_stimulants',
        name: 'Recreational Stimulants & Kratom',
        sub: 'Cocaine / MDMA (Ecstasy) / Amphetamines / Kratom / Speed',
        cat: 'substance',
        sev: 'high',
        riskBadges: ['⚡ Cardiac Stress', '💫 Fainting Risk', '🩸 Severe Vasoconstriction'],
        tattoo: 'Stimulants raise sympathetic activity: elevated blood pressure, tachycardia and tremor are well documented. That makes someone a poor candidate for sitting still through a session and raises the stakes if anything goes wrong. Whether stimulants change the outcome of a tattoo has not been studied, so the concern here is your cardiovascular state during the procedure, not the ink.',
        piercing: 'Piercers will normally refuse to work on someone under the influence. Staying still and giving informed consent both matter, and neither is reliable in that state.',
        wait: 'Do not undergo any body modification procedure with active recreational stimulants in your system.',
        tags: 'cocaine, mdma, ecstasy, kratom, amphetamine, speed, party drugs, us, uk, eu'
      }
    ]
  }
];

// DOM References
const medListEl       = document.getElementById('med-list');
const resultEl        = document.getElementById('result');
const medSearchEl     = document.getElementById('med-search');
const clearSearchBtn  = document.getElementById('clear-search');
const filterTagsEl    = document.getElementById('filter-tags');
const toolTabsEl      = document.getElementById('tool-tabs');
const briefCountEl    = document.getElementById('brief-count');

// Modal DOM References
const doctorModalEl   = document.getElementById('doctor-modal');
const openDocModalBtn = document.getElementById('open-doctor-modal-btn');
const closeDocModalBtn= document.getElementById('close-doctor-modal-btn');
const cancelDocModalBtn= document.getElementById('cancel-doc-modal-btn');
const docNameInput    = document.getElementById('doc-name');
const patientNameInput= document.getElementById('patient-name');
const procTypeInput   = document.getElementById('procedure-type');
const procDateInput   = document.getElementById('procedure-date');
const modalMedPillsEl = document.getElementById('modal-med-pills');
const modalDraftArea  = document.getElementById('modal-draft-preview');
const copyDocMsgBtn   = document.getElementById('copy-doc-msg-btn');
const emailDocBtn     = document.getElementById('email-doc-btn');

// Flatten lookup map
const medMap = {};
CATEGORIES.forEach(cat => cat.meds.forEach(m => { medMap[m.id] = m; }));

let activeCategoryFilter = 'all';
let searchQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set default appointment date to 1 week from today
  if (procDateInput) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    procDateInput.value = nextWeek.toISOString().split('T')[0];
  }

  renderMedList();
  setupEventListeners();
  initCalculators();
  initQuiz();
  initTrendingSearches();
  initRecentSearches();
  initReadingProgress();
  initEmergencyModal();
  initHealingJourney();
  initDeepLinkFromUrl();
  initServiceWorker();
});

let currentLang = 'en';

const TRANSLATIONS = {
  en: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "High Concern",
    "x.moderate_concern": "Moderate Concern",
    "x.low_concern": "Low Concern",
    "x.low_syncope_risk": "Low Syncope Risk",
    "x.moderate_syncope_risk": "Moderate Syncope Risk",
    "x.elevated_syncope_risk": "⚠️ Elevated Syncope Risk",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Share Intake Deep Link",
    "x.quick_print_summary": "🖨️ Quick Print Summary",
    "x.trending_inquiries": "🔥 Trending Inquiries:",
    "x.advil_ibuprofen": "Advil / Ibuprofen",
    "x.accutane_retinoids": "Accutane / Retinoids",
    "x.tktx_numbing": "TKTX / Numbing",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Anxiety",
    "x.cannabis_thc": "Cannabis / THC",
    "x.alcohol_hangover": "Alcohol / Hangover",
    "x.aspirin_blood_thinners": "Aspirin / Blood Thinners",
    "x.recent_searches": "🕒 Recent Searches:",
    "x.clear_history": "Clear History",
    "x.share_intake_status": "Share Intake Status:",
    "x.copy_shareable_link": "🔗 Copy Shareable Link",
    "x.select_all_medications_and_supplements_you": "💡 Select all medications and supplements you take. Results will automatically highlight procedural risks, wait times, and recommended artist precautions.",
    "x.client_consultation_brief": "Client Consultation Brief",
    "x.a_printable_and_shareable_summary_of": "A printable and shareable summary of selected medications and procedural recommendations for your tattoo artist or piercer.",
    "x.no_medications_selected_yet": "⚠️ No medications selected yet.",
    "x.switch_to_the_interaction_checker": "Switch to the Interaction Checker",
    "x.generate_full_clinic_packet_print": "📄 Generate Full Clinic Packet (Print)",
    "x.share_deep_link": "🔗 Share Deep Link",
    "x.export_data_json": "💾 Export Data (JSON)",
    "x.export_text_file": "📄 Export Text File",
    "x.download_pdf_document": "📥 Download PDF Document",
    "x.copy_summary": "📋 Copy Summary",
    "x.print_brief": "🖨️ Print Brief",
    "x.expected_healing_journey_timeline": "🩺 Expected Healing Journey Timeline",
    "x.tattoo_healing": "🎨 Tattoo Healing",
    "x.piercing_healing": "💎 Piercing Healing",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Interactive timeline mapping physiological milestones and dynamic medication interaction impacts across healing phases.",
    "x.pre_procedure_medication_washout_reminders": "⏰ Pre-Procedure Medication Washout & Reminders",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Calculate precise discontinuation deadlines for medications (NSAIDs, blood thinners, alcohol, retinoids) prior to your tattoo or piercing appointment, and set browser notifications or calendar alerts.",
    "x.scheduled_appointment_date_time": "📅 Scheduled Appointment Date & Time:",
    "x.save_compute_washout": "💾 Save & Compute Washout",
    "x.setting_your_appointment_date_computes_live": "Setting your appointment date computes live countdowns showing exactly when to stop taking specific drugs.",
    "x.enable_browser_notification_alerts": "🔔 Enable Browser Notification Alerts",
    "x.download_google_calendar_ics_pre_filled": "📅 Download Google Calendar .ics (Pre-filled Washout Deadlines)",
    "x.open_washout_in_google_calendar_web": "🌐 Open Washout in Google Calendar Web",
    "x.export_standard_calendar_ics": "📅 Export Standard Calendar (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Artist & Piercer Readiness Self-Assessment",
    "x.answer_3_quick_questions_about_your": "Answer 3 quick questions about your client's procedure and medication disclosures to generate a studio precautions checklist.",
    "x.1_what_procedure_is_being_performed": "1. What procedure is being performed?",
    "x.tattoo_body_linework_shading_color": "Tattoo (Body Linework / Shading / Color)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Cosmetic Tattoo (Microblading / Lip Blush / Scalp)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (Ear Cartilage / Nose / Nipple / Body)",
    "x.piercing_oral_lip_tongue": "Piercing (Oral / Lip / Tongue)",
    "x.2_disclosed_client_medications_or_topicals": "2. Disclosed client medications or topicals? (Check all that apply)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "NSAIDs / Blood Thinners (Ibuprofen, Aspirin, Warfarin)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Numbing Cream applied (Lidocaine, Epinephrine, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Acne Retinoids (Accutane) or Corticosteroids",
    "x.blood_pressure_beta_blockers_glp_1": "Blood Pressure / Beta-Blockers / GLP-1 / Stimulants",
    "x.none_disclosed_healthy": "None / Disclosed Healthy",
    "x.3_client_history_physiological_risk_factors": "3. Client history & physiological risk factors?",
    "x.no_known_fainting_history_or_skin": "No known fainting history or skin issues",
    "x.history_of_vasovagal_syncope_fainting_low": "History of vasovagal syncope / fainting / low blood sugar",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Extremely sensitive skin / Eczema / Easy bruising",
    "x.first_time_client_high_nervous_tension": "First-time client / High nervous tension",
    "x.studio_safety_guide_progress": "🛡️ Studio Safety Guide Progress",
    "x.0_6_sections_read_0": "0 / 6 Sections Read (0%)",
    "x.studio_safety_clinical_reference": "🛡️ Studio Safety & Clinical Reference",
    "x.essential_clinical_reference_for_clients_tattoo": "Essential clinical reference for clients, tattoo artists, and piercers on managing common procedural challenges associated with medications.",
    "x.1_painkillers_pre_procedure_pain_management": "1. Painkillers & Pre-Procedure Pain Management",
    "x.clients_often_take_over_the_counter": "Clients often take over-the-counter painkillers before a session to manage pain. It is vital to understand the difference between drug classes:",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirin & NSAIDs (Ibuprofen, Naproxen, Nurofen, Aleve):",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracetamol / Acetaminophen (Tylenol, Panadol):",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Topical Numbing Creams & Local Anaesthetics",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Numbing creams (Lidocaine, Tetracaine, Prilocaine, TKTX) have exploded in popularity, but introduce specific risks:",
    "x.skin_texture_alterations": "Skin Texture Alterations:",
    "x.rebound_pain_vasoconstriction": "Rebound Pain & Vasoconstriction:",
    "x.toxicity_methemoglobinemia_risk": "Toxicity & Methemoglobinemia Risk:",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Fainting & Vasovagal Syncope Risk Factors",
    "x.vasovagal_syncope_is_a_sudden_drop": "Vasovagal syncope is a sudden drop in heart rate and blood pressure triggered by pain, nervous tension, or long sessions:",
    "x.high_risk_medications": "High Risk Medications:",
    "x.prevention_protocol": "Prevention Protocol:",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Adhesive Aftercare Bandages (Saniderm / Tegaderm) & Skin Thinning",
    "x.patients_on_topical_retinoids_systemic_steroids": "Patients on topical retinoids, systemic steroids, or with thin skin are at high risk of skin tearing, blisters, or contact dermatitis when removing second-skin bandages.",
    "x.in_these_cases_traditional_breathable_cling": "In these cases, traditional breathable cling wrap or non-stick pads with gentle hypoallergenic tape are recommended.",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Bloodborne Pathogens & Cross-Contamination Containment",
    "x.barrier_protection": "Barrier Protection:",
    "x.single_use_cartridges_needles": "Single-Use Cartridges & Needles:",
    "x.sharps_container_disposal": "Sharps Container Disposal:",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Alcohol, Cannabis & Recreational Substance Intake Policy",
    "x.informed_consent_legal_safety": "Informed Consent & Legal Safety:",
    "x.physiological_compromise": "Physiological Compromise:",
    "x.studio_safety_lifestyle_quiz": "🎮 Studio Safety & Lifestyle Quiz",
    "x.test_your_studio_safety_medication_iq": "Test Your Studio Safety & Medication IQ!",
    "x.answer_7_fun_educational_scenarios_about": "Answer 7 fun, educational scenarios about alcohol, cannabis, painkillers, numbing creams, and aftercare prep.",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Pre-Session Prep & Vasovagal Syncope Calculator",
    "x.calculate_your_custom_fluid_target_blood": "Calculate your custom fluid target, blood sugar maintenance schedule, and syncope risk reduction plan before your appointment.",
    "x.body_weight": "Body Weight:",
    "x.lbs": "lbs",
    "x.estimated_session_duration": "Estimated Session Duration:",
    "x.1_hour_piercing_small_tattoo": "1 Hour (Piercing / Small Tattoo)",
    "x.2_hours_small_medium_tattoo": "2 Hours (Small / Medium Tattoo)",
    "x.3_hours_standard_session": "3 Hours (Standard Session)",
    "x.4_hours_half_day": "4 Hours (Half Day)",
    "x.6_hours_full_day_session": "6 Hours (Full Day Session)",
    "x.8_hours_extended_full_day": "8 Hours (Extended Full Day)",
    "x.procedure_type": "Procedure Type:",
    "x.tattoo_session_linework_color": "Tattoo Session (Linework / Color)",
    "x.piercing_session_body_ear_oral": "Piercing Session (Body / Ear / Oral)",
    "x.resting_heart_rate_bpm": "Resting Heart Rate (bpm)",
    "x.optional": "(Optional)",
    "x.blood_pressure_mmhg": "Blood Pressure (mmHg)",
    "x.risk_medication_factors_check_all_that": "Risk & Medication Factors (Check all that apply):",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Taking ADHD Stimulants (Adderall/Vyvanse/Ritalin)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Taking Beta Blockers / Blood Pressure Meds",
    "x.taking_glp_1_weight_loss_meds": "💫 Taking GLP-1 Weight Loss Meds (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Taking Anxiety Meds or History of Fainting",
    "x.faq_guidelines_progress": "❓ FAQ & Guidelines Progress",
    "x.0_8_faqs_read_0": "0 / 8 FAQs Read (0%)",
    "x.frequently_asked_questions": "❓ Frequently Asked Questions",
    "x.should_i_stop_taking_my_prescribed": "Should I stop taking my prescribed medication before getting a tattoo or piercing?",
    "x.never_stop_or_adjust_prescribed_medication": "NEVER stop or adjust prescribed medication",
    "x.why_is_accutane_isotretinoin_a_complete": "Why is Accutane (Isotretinoin) a complete contraindication?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "Isotretinoin fundamentally alters skin cell turnover, thins the stratum corneum, and suppresses sebum glands. Tattooing or piercing during or shortly after Accutane treatment leads to unpredictable ink fallout, severe scarring, hypertrophic tissue, and non-healing piercing fistulas. Most professionals require waiting 6 to 12 months after the last dose.",
    "x.can_i_smoke_marijuana_or_consume": "Can I smoke marijuana or consume THC edibles before my tattoo appointment?",
    "x.it_is_strongly_discouraged_thc_causes": "It is strongly discouraged. THC causes vasodilation (blood vessel opening), raises baseline heart rate, and can significantly heighten anxiety, paranoia, or pain sensitivity during skin puncture. Many professional artists will refuse to tattoo clients under acute influence.",
    "x.why_shouldn_t_i_drink_alcohol": "Why shouldn't I drink alcohol or have a hangover on my tattoo day?",
    "x.alcohol_thins_your_blood_and_acts": "Alcohol thins your blood and acts as a diuretic, leaving you severely dehydrated. During tattooing, thin blood causes heavy plasma weeping that pushes ink pigment out of dermal layers and causes thick, patchy scabs. A hangover also dramatically lowers your pain threshold and blood sugar, making fainting far more likely.",
    "x.how_does_smoking_cigarettes_or_vaping": "How does smoking cigarettes or vaping nicotine affect my new piercing or tattoo?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "Nicotine is a powerful microvascular vasoconstrictor. It shrinks tiny capillaries near the surface of your skin, restricting oxygenated blood supply needed for dermal cell repair and piercing fistula formation. Heavy nicotine use leads to delayed healing, higher infection risk, and increased piercing rejection rates.",
    "x.can_i_drink_coffee_or_energy": "Can I drink coffee or energy drinks before my session?",
    "x.limit_high_caffeine_intake_right_before": "Limit high caffeine intake right before your session. Caffeine raises resting pulse rate and blood pressure, increases muscle jitteriness, and can heighten nervous tension. A small cup of coffee is fine, but avoid large energy drinks or pre-workout supplements prior to tattooing.",
    "x.what_should_i_bring_to_my": "What should I bring to my appointment if I take daily medications?",
    "x.bring_a_complete_list_of_your": "Bring a complete list of your medications (or use our Artist Consultation Brief feature), inform your artist/piercer during intake, bring snacks/sugary drinks if you take diabetes or blood pressure medications, and bring a physician's clearance note if taking blood thinners or immunosuppressants.",
    "x.can_i_take_ibuprofen_or_aspirin": "Can I take ibuprofen or aspirin before my appointment for pain control?",
    "x.it_is_strongly_recommended_to_avoid": "It is strongly recommended to avoid NSAIDs (Ibuprofen, Naproxen) and Aspirin 24–48 hours before tattooing or piercing because they thin blood and increase procedural bleeding. If you need mild pain relief, Acetaminophen (Paracetamol) is generally safer as it does not affect clotting.",
    "x.can_i_go_to_the_gym": "Can I go to the gym, swim, or exercise after getting a tattoo or piercing?",
    "x.avoid_heavy_exercise_for_24_48": "Avoid heavy exercise for 24–48 hours to prevent excessive sweating, stretching, or friction on fresh wounds. Swimming in pools, lakes, rivers, or ocean water is strictly prohibited for 2–4 weeks until completely healed, as standing water contains bacterial pathogens that easily cause severe skin infections.",
    "x.consult_your_physician_message_draft": "✉️ Consult Your Physician - Message Draft",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Use this template to draft an email or message to your doctor inquiring about safe medication adjustments before your upcoming procedure.",
    "x.doctor_or_clinic_name": "Doctor or Clinic Name:",
    "x.your_name": "Your Name:",
    "x.procedure_location": "Procedure & Location:",
    "x.appointment_date": "Appointment Date:",
    "x.selected_disclosed_medication_s": "Selected Disclosed Medication(s):",
    "x.no_medications_currently_selected_in_checker": "No medications currently selected in checker.",
    "x.generated_message_draft_editable_customize_your": "Generated Message Draft (Editable - customize your message below):",
    "x.copy_draft_message": "📋 Copy Draft Message",
    "x.open_email_app": "✉️ Open Email App",
    "x.print_physician_note": "🖨️ Print Physician Note",
    "x.close": "Close",
    "x.studio_emergency_first_aid_protocols": "🚨 Studio Emergency First Aid Protocols",
    "x.fainting_syncope": "💫 Fainting / Syncope",
    "x.allergic_reaction": "🐝 Allergic Reaction",
    "x.excessive_bleeding": "🩸 Excessive Bleeding",
    "x.panic_breathing": "🫁 Panic & Breathing",
    "x.vasovagal_syncope_fainting_protocol": "Vasovagal Syncope & Fainting Protocol",
    "x.common_response_to_sudden_pain_anxiety": "Common response to sudden pain, anxiety, or low blood sugar causing temporary cerebral hypoperfusion.",
    "x.stop_procedure_immediately": "Stop Procedure Immediately:",
    "x.lay_flat_elevate_legs": "Lay Flat & Elevate Legs:",
    "x.cool_ventilate": "Cool & Ventilate:",
    "x.glucose_boost": "Glucose Boost:",
    "x.acute_allergic_reaction_anaphylaxis": "Acute Allergic Reaction & Anaphylaxis",
    "x.allergic_response_to_topical_numbing_creams": "Allergic response to topical numbing creams, latex gloves, stencil chemicals, or inks.",
    "x.call_emergency_services_now": "CALL EMERGENCY SERVICES NOW:",
    "x.remove_the_trigger": "Remove the Trigger:",
    "x.keep_them_lying_flat": "Keep Them Lying Flat:",
    "x.their_own_auto_injector": "Their Own Auto-Injector:",
    "x.stay_with_them": "Stay With Them:",
    "x.excessive_bleeding_heavy_plasma_oozing": "Excessive Bleeding & Heavy Plasma Oozing",
    "x.triggered_by_recent_nsaids_blood_thinners": "Triggered by recent NSAIDs, blood thinners, alcohol intake, or high blood pressure.",
    "x.direct_firm_pressure": "Direct Firm Pressure:",
    "x.elevate_area": "Elevate Area:",
    "x.pressure_wrap": "Pressure Wrap:",
    "x.bright_spurting_blood_call_immediately": "Bright, Spurting Blood: Call Immediately.",
    "x.hyperventilation_acute_panic_attack": "Hyperventilation & Acute Panic Attack",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Rapid shallow breathing causing lightheadedness, tingling fingers, and muscle tightness.",
    "x.pause_reassure": "Pause & Reassure:",
    "x.4_4_4_box_breathing": "4-4-4 Box Breathing:",
    "x.physical_grounding": "Physical Grounding:",
    "x.close_emergency_guide": "Close Emergency Guide",
    "x.immediate_action": "🚨 Immediate Action",
    "x.search_medication_or_brand_e_g": "Search medication or brand (e.g. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "e.g. 72 (bpm)",
    "x.e_g_dr_smith_city_health": "e.g. Dr. Smith / City Health Clinic",
    "x.e_g_alex_miller": "e.g. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "e.g. Forearm Tattoo / Septum Piercing",
    "x.type_or_customize_your_physician_inquiry": "Type or customize your physician inquiry message here...",

    translationNotice: 'This page has been translated from English. We cannot guarantee the translation is exact. We do our best so that everyone can understand, but the English version is the one we consider correct - please check anything important against it.',
    waitLabel: 'Wait / Washout Recommendation:',
    medUntranslated: 'Some medication details above are shown in English - translation into this language is still in progress.',
    medSourcesLabel: 'Published sources',
    tabSupplements: '🌿 Supplements',
    suppHeading: 'Supplement & Medication Interaction Checker',
    suppIntro: 'Most people do not think of fish oil, garlic capsules or ginkgo as "medication", so they never mention them. Taken alongside a blood thinner or a painkiller, some supplements add to bleeding and oozing during a session. Add what you take below to see what the published evidence says.',
    suppSearchPlaceholder: 'Search a supplement (e.g. fish oil, vitamin E, turmeric, ginseng)...',
    suppEmpty: 'Add a supplement to see whether it has been studied alongside your medication.',
    suppStudied: 'has been studied for effects on bleeding and clotting. Based on',
    suppStudies: 'human or clinical studies.',
    suppCardFooter: 'This does not mean you must stop either one. Tell your artist or piercer what you take, and raise anything you are unsure about with the doctor who prescribed your medication.',
    suppNoPairs: 'We hold no published human studies linking this supplement to the medications this tool covers. That is not the same as "no interaction" - it means the research is not there to quote. Mention it to your artist anyway.',
    suppUnknownTitle: 'We do not hold data on',
    suppUnknownBody: 'This is a gap in our library, not a clean result. Do not read it as safe. Bring it up with your artist or piercer, and with your doctor if you are also on prescribed medication.',
    suppClinical: 'Clinical evidence',
    suppHuman: 'Human studies',
    suppCredit: 'Interaction evidence from SUPP.AI (Allen Institute for AI). Only human and clinical studies are shown; retracted papers are excluded.',
    geoLangLabel: 'Search in:',
    geoFindStudio: '🎨 Find a studio nearby',
    geoFindDoctor: '🩺 Find a doctor nearby',
    geoFindPharmacy: '💊 Nearest pharmacy',
    geoFindHospital: '🏥 Nearest hospital',
    geoNote: 'These open Google Maps and search in the local language of where you are, which finds far more than an English search does abroad. Your location is never sent to us - only a search word goes to Google. Change the language above if it guessed wrong.',
    emergHeadSub: 'Immediate step-by-step action guides for studio staff during procedural complications.',
    emergCallLabel: 'Call emergency services first:',
    emergCallConfirm: 'This number is guessed from your device time zone and can be wrong, for example on a VPN. Confirm the correct number for your country and keep it written on the studio wall.',
    emergDisclaimer: 'This guide is a memory aid for people who are already trained in first aid. It is not first-aid training, and it does not replace it. Call emergency services first, do nothing you are not trained and permitted to do where you work, and stay with the person until help arrives.',
    disclaimerTitle: 'Important Disclaimer:',
    disclaimerBody: 'This tool is an educational reference only and does not constitute medical advice. Never stop or adjust prescribed medication without consulting your prescribing physician. Always inform your tattoo artist and piercer of any medications, health conditions, or supplements you are taking before the procedure.',
    langLabel: '🌐 Language:',
    headerBadge: '💊 Medication & Safety Reference',
    headerTitle: 'Medication Interaction Checker',
    headerSubtitle: 'Check how prescription medications, OTC painkillers, numbing creams, and supplements affect bleeding risk, ink setting, and piercing healing for tattoos & piercings.',
    draftDoctorBtn: '✉️ Draft Message to Doctor',
    tabChecker: '🔍 Checker',
    tabBrief: '📄 Artist Brief',
    tabSafety: '🛡️ Studio Safety',
    tabFaq: '❓ FAQs & Tips',
    tabReminders: '⏰ Reminders & Washout',
    searchPlaceholder: 'Search medication or brand (e.g. Advil, Accutane, Xanax, EMLA, Ozempic)...',
    filterAll: 'All',
    filterPain: 'Painkillers & NSAIDs',
    filterNumbing: 'Numbing Creams',
    filterBlood: 'Blood Thinners',
    filterRetinoid: 'Acne / Retinoids',
    filterAnxiety: 'Anti-Anxiety / Sedatives',
    filterHormone: 'Hormones & HRT',
    filterStimulant: 'ADHD & Stimulants',
    filterMetabolic: 'Diabetes & GLP-1',
    filterCorticosteroid: 'Corticosteroids',
    filterImmuno: 'Immunosuppressants',
    filterSupplement: 'Supplements',
    filterAntibiotic: 'Antibiotics & Antivirals',
    filterSubstance: 'Substances & Lifestyle',
    infoNote: '💡 Select all medications and supplements you take. Results will automatically highlight procedural risks, wait times, and recommended artist precautions.',
    clearAll: 'Clear all',
    draftDoctorNoteBtn: '✉️ Draft Doctor Note',
    viewBriefBtn: '📄 View Artist Brief',
    backToTopBtn: '⬆️ Back to Top',
    backToMedListBtn: '⬆️ Back to Med List'
  },
  fr: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "Préoccupation élevée",
    "x.moderate_concern": "Préoccupation modérée",
    "x.low_concern": "Préoccupation faible",
    "x.low_syncope_risk": "Risque de syncope faible",
    "x.moderate_syncope_risk": "Risque de syncope modéré",
    "x.elevated_syncope_risk": "⚠️ Risque de syncope élevé",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Partager le lien direct du questionnaire",
    "x.quick_print_summary": "🖨️ Résumé à imprimer",
    "x.trending_inquiries": "🔥 Recherches fréquentes :",
    "x.advil_ibuprofen": "Advil / Ibuprofène",
    "x.accutane_retinoids": "Accutane / Rétinoïdes",
    "x.tktx_numbing": "TKTX / Crème anesthésiante",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Anxiété",
    "x.cannabis_thc": "Cannabis / THC",
    "x.alcohol_hangover": "Alcool / Gueule de bois",
    "x.aspirin_blood_thinners": "Aspirine / Anticoagulants",
    "x.recent_searches": "🕒 Recherches récentes :",
    "x.clear_history": "Effacer l'historique",
    "x.share_intake_status": "Statut du partage du questionnaire :",
    "x.copy_shareable_link": "🔗 Copier le lien de partage",
    "x.select_all_medications_and_supplements_you": "💡 Sélectionnez tous les médicaments et compléments que vous prenez. Les résultats mettront automatiquement en évidence",
    "x.client_consultation_brief": "Fiche de consultation du client",
    "x.a_printable_and_shareable_summary_of": "Un résumé imprimable et partageable des médicaments sélectionnés et des recommandations pour la séance",
    "x.no_medications_selected_yet": "⚠️ Aucun médicament sélectionné pour l'instant.",
    "x.switch_to_the_interaction_checker": "Passer au vérificateur d'interactions",
    "x.generate_full_clinic_packet_print": "📄 Générer le dossier clinique complet (impression)",
    "x.share_deep_link": "🔗 Partager le lien direct",
    "x.export_data_json": "💾 Exporter les données (JSON)",
    "x.export_text_file": "📄 Exporter un fichier texte",
    "x.download_pdf_document": "📥 Télécharger le document PDF",
    "x.copy_summary": "📋 Copier le résumé",
    "x.print_brief": "🖨️ Imprimer la fiche",
    "x.expected_healing_journey_timeline": "🩺 Déroulement attendu de la cicatrisation",
    "x.tattoo_healing": "🎨 Cicatrisation du tatouage",
    "x.piercing_healing": "💎 Cicatrisation du piercing",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Chronologie interactive des étapes physiologiques et des effets des médicaments",
    "x.pre_procedure_medication_washout_reminders": "⏰ Arrêt des médicaments avant la séance et rappels",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Calculez les délais précis d'arrêt des médicaments (AINS, anticoagulants)",
    "x.scheduled_appointment_date_time": "📅 Date et heure du rendez-vous prévu :",
    "x.save_compute_washout": "💾 Enregistrer et calculer le délai d'arrêt",
    "x.setting_your_appointment_date_computes_live": "Renseigner la date du rendez-vous déclenche des comptes à rebours indiquant précisément quand cesser de prendre",
    "x.enable_browser_notification_alerts": "🔔 Activer les notifications du navigateur",
    "x.download_google_calendar_ics_pre_filled": "📅 Télécharger le fichier .ics Google Agenda (délais d'arrêt préremplis)",
    "x.open_washout_in_google_calendar_web": "🌐 Ouvrir les délais d'arrêt dans Google Agenda",
    "x.export_standard_calendar_ics": "📅 Exporter un calendrier standard (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Auto-évaluation de préparation du tatoueur et du perceur",
    "x.answer_3_quick_questions_about_your": "Répondez à 3 questions rapides sur la séance de votre client et les médicaments déclarés pour obtenir",
    "x.1_what_procedure_is_being_performed": "1. Quelle prestation est réalisée ?",
    "x.tattoo_body_linework_shading_color": "Tatouage (tracé corporel / ombrage / couleur)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Maquillage permanent (microblading / lip blush / cuir chevelu)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (cartilage de l'oreille / nez / téton / corps)",
    "x.piercing_oral_lip_tongue": "Piercing (buccal / lèvre / langue)",
    "x.2_disclosed_client_medications_or_topicals": "2. Médicaments ou produits topiques déclarés par le client ? (cochez tout ce qui s'applique)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "AINS / anticoagulants (ibuprofène, aspirine, warfarine)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Crème anesthésiante appliquée (lidocaïne, épinéphrine, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Rétinoïdes contre l'acné (Accutane) ou corticoïdes",
    "x.blood_pressure_beta_blockers_glp_1": "Tension artérielle / bêtabloquants / GLP-1 / stimulants",
    "x.none_disclosed_healthy": "Aucun / en bonne santé déclarée",
    "x.3_client_history_physiological_risk_factors": "3. Antécédents du client et facteurs de risque physiologiques ?",
    "x.no_known_fainting_history_or_skin": "Aucun antécédent connu de malaise ni de problème cutané",
    "x.history_of_vasovagal_syncope_fainting_low": "Antécédents de syncope vasovagale / malaise / hypoglycémie",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Peau très sensible / eczéma / bleus faciles",
    "x.first_time_client_high_nervous_tension": "Premier tatouage ou piercing / forte tension nerveuse",
    "x.studio_safety_guide_progress": "🛡️ Progression du guide de sécurité du studio",
    "x.0_6_sections_read_0": "0 / 6 sections lues (0 %)",
    "x.studio_safety_clinical_reference": "🛡️ Sécurité du studio et référence clinique",
    "x.essential_clinical_reference_for_clients_tattoo": "Référence clinique essentielle pour les clients, les tatoueurs et les perceurs sur la gestion",
    "x.1_painkillers_pre_procedure_pain_management": "1. Antalgiques et gestion de la douleur avant la séance",
    "x.clients_often_take_over_the_counter": "Les clients prennent souvent des antalgiques en vente libre avant une séance pour gérer la douleur. Il est essentiel de",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirine et AINS (ibuprofène, naproxène, Nurofen, Aleve) :",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracétamol / acétaminophène (Tylenol, Panadol) :",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Crèmes anesthésiantes topiques et anesthésiques locaux",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Les crèmes anesthésiantes (lidocaïne, tétracaïne, prilocaïne, TKTX) se sont fortement répandues",
    "x.skin_texture_alterations": "Modification de la texture de la peau :",
    "x.rebound_pain_vasoconstriction": "Douleur de rebond et vasoconstriction :",
    "x.toxicity_methemoglobinemia_risk": "Toxicité et risque de méthémoglobinémie :",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Malaise et facteurs de risque de syncope vasovagale",
    "x.vasovagal_syncope_is_a_sudden_drop": "La syncope vasovagale est une chute brutale du rythme cardiaque et de la tension provoquée par la douleur, la tension nerveuse",
    "x.high_risk_medications": "Médicaments à risque élevé :",
    "x.prevention_protocol": "Protocole de prévention :",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Pansements adhésifs de soin (Saniderm / Tegaderm) et amincissement de la peau",
    "x.patients_on_topical_retinoids_systemic_steroids": "Les personnes sous rétinoïdes topiques, corticoïdes systémiques ou à peau fine présentent un risque élevé",
    "x.in_these_cases_traditional_breathable_cling": "Dans ces cas, un film respirant traditionnel ou des compresses non adhérentes avec un adhésif hypoallergénique doux",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Agents pathogènes transmissibles par le sang et prévention des contaminations croisées",
    "x.barrier_protection": "Protection barrière :",
    "x.single_use_cartridges_needles": "Cartouches et aiguilles à usage unique :",
    "x.sharps_container_disposal": "Élimination dans un collecteur d'objets piquants :",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Politique en matière d'alcool, de cannabis et de substances récréatives",
    "x.informed_consent_legal_safety": "Consentement éclairé et sécurité juridique :",
    "x.physiological_compromise": "Atteinte physiologique :",
    "x.studio_safety_lifestyle_quiz": "🎮 Quiz sécurité du studio et mode de vie",
    "x.test_your_studio_safety_medication_iq": "Testez vos connaissances en sécurité de studio et en médicaments !",
    "x.answer_7_fun_educational_scenarios_about": "Répondez à 7 mises en situation ludiques et pédagogiques sur l'alcool, le cannabis, les antalgiques, les crèmes anesthésiantes",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Préparation avant séance et calculateur de syncope vasovagale",
    "x.calculate_your_custom_fluid_target_blood": "Calculez votre objectif d'hydratation personnalisé, votre plan de maintien de la glycémie et la réduction du risque de syncope",
    "x.body_weight": "Poids corporel :",
    "x.lbs": "lb",
    "x.estimated_session_duration": "Durée estimée de la séance :",
    "x.1_hour_piercing_small_tattoo": "1 heure (piercing / petit tatouage)",
    "x.2_hours_small_medium_tattoo": "2 heures (petit / moyen tatouage)",
    "x.3_hours_standard_session": "3 heures (séance standard)",
    "x.4_hours_half_day": "4 heures (demi-journée)",
    "x.6_hours_full_day_session": "6 heures (journée complète)",
    "x.8_hours_extended_full_day": "8 heures (journée complète prolongée)",
    "x.procedure_type": "Type de prestation :",
    "x.tattoo_session_linework_color": "Séance de tatouage (tracé / couleur)",
    "x.piercing_session_body_ear_oral": "Séance de piercing (corps / oreille / buccal)",
    "x.resting_heart_rate_bpm": "Fréquence cardiaque au repos (bpm)",
    "x.optional": "(facultatif)",
    "x.blood_pressure_mmhg": "Tension artérielle (mmHg)",
    "x.risk_medication_factors_check_all_that": "Facteurs de risque et médicaments (cochez tout ce qui s'applique) :",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Prise de stimulants pour le TDAH (Adderall/Vyvanse/Ritaline)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Prise de bêtabloquants / traitements pour la tension",
    "x.taking_glp_1_weight_loss_meds": "💫 Prise de traitements GLP-1 pour la perte de poids (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Prise d'anxiolytiques ou antécédents de malaise",
    "x.faq_guidelines_progress": "❓ Progression des questions fréquentes",
    "x.0_8_faqs_read_0": "0 / 8 questions lues (0 %)",
    "x.frequently_asked_questions": "❓ Questions fréquentes",
    "x.should_i_stop_taking_my_prescribed": "Dois-je arrêter mon traitement prescrit avant un tatouage ou un piercing ?",
    "x.never_stop_or_adjust_prescribed_medication": "N'arrêtez et ne modifiez JAMAIS un traitement prescrit",
    "x.why_is_accutane_isotretinoin_a_complete": "Pourquoi l'Accutane (isotrétinoïne) est-il une contre-indication absolue ?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "L'isotrétinoïne modifie en profondeur le renouvellement cellulaire de la peau et amincit la couche cornée,",
    "x.can_i_smoke_marijuana_or_consume": "Puis-je fumer du cannabis ou consommer des comestibles au THC avant mon rendez-vous de tatouage ?",
    "x.it_is_strongly_discouraged_thc_causes": "C'est fortement déconseillé. Le THC provoque une vasodilatation (ouverture des vaisseaux), augmente la fréquence cardiaque de repos",
    "x.why_shouldn_t_i_drink_alcohol": "Pourquoi ne dois-je pas boire d'alcool ni avoir la gueule de bois le jour de mon tatouage ?",
    "x.alcohol_thins_your_blood_and_acts": "L'alcool fluidifie le sang et agit comme un diurétique, ce qui vous déshydrate fortement. Pendant le tatouage,",
    "x.how_does_smoking_cigarettes_or_vaping": "Quel est l'effet de la cigarette ou du vapotage de nicotine sur un piercing ou un tatouage récent ?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "La nicotine est un puissant vasoconstricteur microvasculaire. Elle rétrécit les petits capillaires",
    "x.can_i_drink_coffee_or_energy": "Puis-je boire du café ou des boissons énergisantes avant ma séance ?",
    "x.limit_high_caffeine_intake_right_before": "Limitez la caféine juste avant votre séance. La caféine augmente le pouls de repos et",
    "x.what_should_i_bring_to_my": "Que dois-je apporter à mon rendez-vous si je prends des médicaments quotidiens ?",
    "x.bring_a_complete_list_of_your": "Apportez la liste complète de vos médicaments (ou utilisez notre fiche de consultation), informez votre",
    "x.can_i_take_ibuprofen_or_aspirin": "Puis-je prendre de l'ibuprofène ou de l'aspirine avant mon rendez-vous pour la douleur ?",
    "x.it_is_strongly_recommended_to_avoid": "Il est fortement recommandé d'éviter les AINS (ibuprofène, naproxène) et l'aspirine 24 à 48 heures avant",
    "x.can_i_go_to_the_gym": "Puis-je aller à la salle de sport, nager ou faire du sport après un tatouage ou un piercing ?",
    "x.avoid_heavy_exercise_for_24_48": "Évitez les efforts intenses pendant 24 à 48 heures afin de limiter la transpiration, les étirements et les frottements sur une plaie fraîche",
    "x.consult_your_physician_message_draft": "✉️ Consulter votre médecin - modèle de message",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Utilisez ce modèle pour rédiger un e-mail ou un message à votre médecin au sujet d'un ajustement sûr de votre traitement",
    "x.doctor_or_clinic_name": "Nom du médecin ou de la clinique :",
    "x.your_name": "Votre nom :",
    "x.procedure_location": "Prestation et emplacement :",
    "x.appointment_date": "Date du rendez-vous :",
    "x.selected_disclosed_medication_s": "Médicament(s) sélectionné(s) et déclaré(s) :",
    "x.no_medications_currently_selected_in_checker": "Aucun médicament actuellement sélectionné dans le vérificateur.",
    "x.generated_message_draft_editable_customize_your": "Brouillon de message généré (modifiable - personnalisez votre message ci-dessous) :",
    "x.copy_draft_message": "📋 Copier le brouillon",
    "x.open_email_app": "✉️ Ouvrir l'application e-mail",
    "x.print_physician_note": "🖨️ Imprimer la note pour le médecin",
    "x.close": "Fermer",
    "x.studio_emergency_first_aid_protocols": "🚨 Protocoles de premiers secours en studio",
    "x.fainting_syncope": "💫 Malaise / syncope",
    "x.allergic_reaction": "🐝 Réaction allergique",
    "x.excessive_bleeding": "🩸 Saignement excessif",
    "x.panic_breathing": "🫁 Panique et respiration",
    "x.vasovagal_syncope_fainting_protocol": "Protocole en cas de syncope vasovagale et de malaise",
    "x.common_response_to_sudden_pain_anxiety": "Réaction fréquente à une douleur soudaine, à l'anxiété ou à une hypoglycémie, provoquant une hypoperfusion cérébrale passagère",
    "x.stop_procedure_immediately": "Arrêtez immédiatement la prestation :",
    "x.lay_flat_elevate_legs": "Allongez la personne et surélevez ses jambes :",
    "x.cool_ventilate": "Rafraîchissez et aérez :",
    "x.glucose_boost": "Apport de glucose :",
    "x.acute_allergic_reaction_anaphylaxis": "Réaction allergique aiguë et anaphylaxie",
    "x.allergic_response_to_topical_numbing_creams": "Réaction allergique aux crèmes anesthésiantes, aux gants en latex, aux produits de stencil ou aux encres.",
    "x.call_emergency_services_now": "APPELEZ LES SECOURS IMMÉDIATEMENT :",
    "x.remove_the_trigger": "Retirez l'élément déclencheur :",
    "x.keep_them_lying_flat": "Maintenez la personne allongée :",
    "x.their_own_auto_injector": "Son propre auto-injecteur :",
    "x.stay_with_them": "Restez auprès d'elle :",
    "x.excessive_bleeding_heavy_plasma_oozing": "Saignement excessif et suintement plasmatique important",
    "x.triggered_by_recent_nsaids_blood_thinners": "Déclenché par une prise récente d'AINS, d'anticoagulants, d'alcool ou par une tension élevée.",
    "x.direct_firm_pressure": "Pression directe et ferme :",
    "x.elevate_area": "Surélevez la zone :",
    "x.pressure_wrap": "Pansement compressif :",
    "x.bright_spurting_blood_call_immediately": "Sang rouge vif et jaillissant : appelez immédiatement.",
    "x.hyperventilation_acute_panic_attack": "Hyperventilation et crise de panique aiguë",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Respiration rapide et superficielle provoquant des vertiges, des fourmillements dans les doigts et des contractures",
    "x.pause_reassure": "Faites une pause et rassurez :",
    "x.4_4_4_box_breathing": "Respiration carrée 4-4-4 :",
    "x.physical_grounding": "Ancrage physique :",
    "x.close_emergency_guide": "Fermer le guide d'urgence",
    "x.immediate_action": "🚨 Action immédiate",
    "x.search_medication_or_brand_e_g": "Rechercher un médicament ou une marque (ex. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "ex. 72 (bpm)",
    "x.e_g_dr_smith_city_health": "ex. Dr Martin / Centre de santé de la ville",
    "x.e_g_alex_miller": "ex. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "ex. tatouage avant-bras / piercing septum",
    "x.type_or_customize_your_physician_inquiry": "Rédigez ou personnalisez ici votre message au médecin...",

    translationNotice: 'Cette page a été traduite de l\'anglais. Nous ne pouvons pas garantir que la traduction soit exacte. Nous faisons de notre mieux pour que chacun puisse comprendre, mais la version anglaise est celle que nous considérons comme correcte : vérifiez-y tout point important.',
    waitLabel: 'Recommandation de délai / élimination :',
    medUntranslated: 'Certains détails sur les médicaments ci-dessus sont affichés en anglais : la traduction dans cette langue est encore en cours.',
    medSourcesLabel: 'Sources publiées',
    tabSupplements: '🌿 Compléments',
    suppHeading: 'Vérificateur d\'interactions compléments et médicaments',
    suppIntro: 'La plupart des gens ne considèrent pas l\'huile de poisson, les gélules d\'ail ou le ginkgo comme des « médicaments », et ne les mentionnent donc jamais. Pris avec un anticoagulant ou un antidouleur, certains compléments augmentent le saignement et le suintement pendant la séance. Ajoutez ce que vous prenez ci-dessous pour voir ce que dit la littérature publiée.',
    suppSearchPlaceholder: 'Rechercher un complément (ex. huile de poisson, vitamine E, curcuma, ginseng)...',
    suppEmpty: 'Ajoutez un complément pour voir s\'il a été étudié avec votre médicament.',
    suppStudied: 'a fait l\'objet d\'études sur les effets liés au saignement et à la coagulation. D\'après',
    suppStudies: 'études humaines ou cliniques.',
    suppCardFooter: 'Cela ne veut pas dire que vous devez arrêter l\'un ou l\'autre. Dites à votre tatoueur ou perceur ce que vous prenez, et posez toute question au médecin qui vous a prescrit votre traitement.',
    suppNoPairs: 'Nous n\'avons aucune étude humaine publiée reliant ce complément aux médicaments couverts par cet outil. Ce n\'est pas la même chose que « aucune interaction » : cela signifie que la recherche n\'existe pas pour l\'affirmer. Mentionnez-le quand même à votre praticien.',
    suppUnknownTitle: 'Nous n\'avons pas de données sur',
    suppUnknownBody: 'C\'est une lacune de notre bibliothèque, pas un résultat rassurant. Ne le prenez pas pour une absence de risque. Parlez-en à votre tatoueur ou perceur, et à votre médecin si vous prenez aussi un traitement prescrit.',
    suppClinical: 'Preuves cliniques',
    suppHuman: 'Études humaines',
    suppCredit: 'Données d\'interaction issues de SUPP.AI (Allen Institute for AI). Seules les études humaines et cliniques sont affichées ; les articles rétractés sont exclus.',
    geoLangLabel: 'Rechercher en :',
    geoFindStudio: '🎨 Trouver un studio à proximité',
    geoFindDoctor: '🩺 Trouver un médecin à proximité',
    geoFindPharmacy: '💊 Pharmacie la plus proche',
    geoFindHospital: '🏥 Hôpital le plus proche',
    geoNote: 'Ces liens ouvrent Google Maps et lancent la recherche dans la langue du pays où vous vous trouvez, ce qui donne bien plus de résultats qu\'une recherche en anglais à l\'étranger. Votre position ne nous est jamais transmise : seul un mot de recherche est envoyé à Google. Changez la langue ci-dessus si la détection est incorrecte.',
    emergHeadSub: 'Guides d\'action immédiats, étape par étape, pour le personnel du studio en cas de complication pendant une seance.',
    emergCallLabel: 'Appelez d\'abord les secours :',
    emergCallConfirm: 'Ce numéro est déduit du fuseau horaire de votre appareil et peut être faux, par exemple derriere un VPN. Vérifiez le numéro correct pour votre pays et gardez-le écrit au mur du studio.',
    emergDisclaimer: 'Ce guide est un aide-mémoire destiné à des personnes déjà formées aux premiers secours. Ce n\'est pas une formation aux premiers secours et cela ne la remplace pas. Appelez d\'abord les secours, ne faites rien pour quoi vous n\'êtes ni formé ni autorisé là où vous exercez, et restez auprès de la personne jusqu\'à l\'arrivée des secours.',
    disclaimerTitle: 'Avertissement important :',
    disclaimerBody: 'Cet outil est une référence éducative uniquement et ne constitue pas un avis médical. N\'arrêtez et ne modifiez jamais un médicament prescrit sans consulter le médecin qui vous l\'a prescrit. Informez toujours votre tatoueur et votre perceur de tout médicament, problème de santé ou complément alimentaire que vous prenez avant l\'intervention.',
    langLabel: '🌐 Langue:',
    headerBadge: '💊 Référence Médicaments et Sécurité',
    headerTitle: 'Vérificateur d\'Interactions Médicamenteuses',
    headerSubtitle: 'Vérifiez l\'impact des médicaments sur les saignements, la prise d\'encre et la cicatrisation des tatouages et piercings.',
    draftDoctorBtn: '✉️ Rédiger un message pour le médecin',
    tabChecker: '🔍 Vérificateur',
    tabBrief: '📄 Rapport Artiste',
    tabSafety: '🛡️ Sécurité Studio',
    tabFaq: '❓ FAQ & Conseils',
    tabReminders: '⏰ Rappels & Sevrage',
    searchPlaceholder: 'Rechercher un médicament (ex. Ibuprofène, Accutane, Xanax, EMLA)...',
    filterAll: 'Tous',
    filterPain: 'Anti-douleurs & AINS',
    filterNumbing: 'Crèmes anesthésiantes',
    filterBlood: 'Anticoagulants',
    filterRetinoid: 'Acné / Rétinoïdes',
    filterAnxiety: 'Anxiolytiques / Sédatifs',
    filterHormone: 'Hormones & THS',
    filterStimulant: 'TDAH & Stimulants',
    filterMetabolic: 'Diabète & GLP-1',
    filterCorticosteroid: 'Corticostéroïdes',
    filterImmuno: 'Immunosuppresseurs',
    filterSupplement: 'Compléments alimentaires',
    filterAntibiotic: 'Antibiotiques & Antiviraux',
    filterSubstance: 'Substances & Mode de vie',
    infoNote: '💡 Sélectionnez vos médicaments. Les résultats afficheront les risques et précautions recommandées.',
    clearAll: 'Tout effacer',
    draftDoctorNoteBtn: '✉️ Note pour le médecin',
    viewBriefBtn: '📄 Voir le rapport',
    backToTopBtn: '⬆️ Haut de page',
    backToMedListBtn: '⬆️ Retour à la liste'
  },
  it: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "Preoccupazione elevata",
    "x.moderate_concern": "Preoccupazione moderata",
    "x.low_concern": "Preoccupazione bassa",
    "x.low_syncope_risk": "Rischio di sincope basso",
    "x.moderate_syncope_risk": "Rischio di sincope moderato",
    "x.elevated_syncope_risk": "⚠️ Rischio di sincope elevato",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Condividi il link diretto al questionario",
    "x.quick_print_summary": "🖨️ Riepilogo da stampare",
    "x.trending_inquiries": "🔥 Ricerche frequenti:",
    "x.advil_ibuprofen": "Advil / Ibuprofene",
    "x.accutane_retinoids": "Accutane / Retinoidi",
    "x.tktx_numbing": "TKTX / Crema anestetica",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Ansia",
    "x.cannabis_thc": "Cannabis / THC",
    "x.alcohol_hangover": "Alcol / Postumi",
    "x.aspirin_blood_thinners": "Aspirina / Anticoagulanti",
    "x.recent_searches": "🕒 Ricerche recenti:",
    "x.clear_history": "Cancella la cronologia",
    "x.share_intake_status": "Stato della condivisione del questionario:",
    "x.copy_shareable_link": "🔗 Copia il link di condivisione",
    "x.select_all_medications_and_supplements_you": "💡 Seleziona tutti i farmaci e gli integratori che assumi. I risultati evidenzieranno automaticamente",
    "x.client_consultation_brief": "Scheda di consulenza del cliente",
    "x.a_printable_and_shareable_summary_of": "Un riepilogo stampabile e condivisibile dei farmaci selezionati e delle raccomandazioni per la seduta",
    "x.no_medications_selected_yet": "⚠️ Nessun farmaco ancora selezionato.",
    "x.switch_to_the_interaction_checker": "Passa al verificatore di interazioni",
    "x.generate_full_clinic_packet_print": "📄 Genera il fascicolo clinico completo (stampa)",
    "x.share_deep_link": "🔗 Condividi il link diretto",
    "x.export_data_json": "💾 Esporta i dati (JSON)",
    "x.export_text_file": "📄 Esporta un file di testo",
    "x.download_pdf_document": "📥 Scarica il documento PDF",
    "x.copy_summary": "📋 Copia il riepilogo",
    "x.print_brief": "🖨️ Stampa la scheda",
    "x.expected_healing_journey_timeline": "🩺 Percorso di guarigione previsto",
    "x.tattoo_healing": "🎨 Guarigione del tatuaggio",
    "x.piercing_healing": "💎 Guarigione del piercing",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Cronologia interattiva delle tappe fisiologiche e degli effetti dei farmaci",
    "x.pre_procedure_medication_washout_reminders": "⏰ Sospensione dei farmaci prima della seduta e promemoria",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Calcola i tempi precisi di sospensione dei farmaci (FANS, anticoagulanti)",
    "x.scheduled_appointment_date_time": "📅 Data e ora dell'appuntamento previsto:",
    "x.save_compute_washout": "💾 Salva e calcola la sospensione",
    "x.setting_your_appointment_date_computes_live": "Indicare la data dell'appuntamento avvia conti alla rovescia che mostrano esattamente quando smettere di assumere",
    "x.enable_browser_notification_alerts": "🔔 Attiva le notifiche del browser",
    "x.download_google_calendar_ics_pre_filled": "📅 Scarica il file .ics di Google Calendar (scadenze di sospensione precompilate)",
    "x.open_washout_in_google_calendar_web": "🌐 Apri le scadenze di sospensione in Google Calendar",
    "x.export_standard_calendar_ics": "📅 Esporta un calendario standard (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Autovalutazione della preparazione di tatuatore e piercer",
    "x.answer_3_quick_questions_about_your": "Rispondi a 3 domande rapide sulla seduta del cliente e sui farmaci dichiarati per ottenere",
    "x.1_what_procedure_is_being_performed": "1. Quale prestazione viene eseguita?",
    "x.tattoo_body_linework_shading_color": "Tatuaggio (tratto sul corpo / sfumatura / colore)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Trucco permanente (microblading / lip blush / cuoio capelluto)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (cartilagine dell'orecchio / naso / capezzolo / corpo)",
    "x.piercing_oral_lip_tongue": "Piercing (orale / labbro / lingua)",
    "x.2_disclosed_client_medications_or_topicals": "2. Farmaci o prodotti topici dichiarati dal cliente? (seleziona tutto ciò che si applica)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "FANS / anticoagulanti (ibuprofene, aspirina, warfarin)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Crema anestetica applicata (lidocaina, epinefrina, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Retinoidi per l'acne (Accutane) o corticosteroidi",
    "x.blood_pressure_beta_blockers_glp_1": "Pressione arteriosa / betabloccanti / GLP-1 / stimolanti",
    "x.none_disclosed_healthy": "Nessuno / in buona salute dichiarata",
    "x.3_client_history_physiological_risk_factors": "3. Anamnesi del cliente e fattori di rischio fisiologici?",
    "x.no_known_fainting_history_or_skin": "Nessun precedente noto di svenimento né problemi cutanei",
    "x.history_of_vasovagal_syncope_fainting_low": "Precedenti di sincope vasovagale / svenimento / ipoglicemia",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Pelle molto sensibile / eczema / lividi facili",
    "x.first_time_client_high_nervous_tension": "Prima volta / forte tensione nervosa",
    "x.studio_safety_guide_progress": "🛡️ Avanzamento della guida alla sicurezza dello studio",
    "x.0_6_sections_read_0": "0 / 6 sezioni lette (0%)",
    "x.studio_safety_clinical_reference": "🛡️ Sicurezza dello studio e riferimento clinico",
    "x.essential_clinical_reference_for_clients_tattoo": "Riferimento clinico essenziale per clienti, tatuatori e piercer sulla gestione",
    "x.1_painkillers_pre_procedure_pain_management": "1. Antidolorifici e gestione del dolore prima della seduta",
    "x.clients_often_take_over_the_counter": "I clienti assumono spesso antidolorifici da banco prima di una seduta per gestire il dolore. È fondamentale",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirina e FANS (ibuprofene, naprossene, Nurofen, Aleve):",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracetamolo / acetaminofene (Tylenol, Panadol):",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Creme anestetiche topiche e anestetici locali",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Le creme anestetiche (lidocaina, tetracaina, prilocaina, TKTX) si sono diffuse enormemente",
    "x.skin_texture_alterations": "Alterazioni della consistenza della pelle:",
    "x.rebound_pain_vasoconstriction": "Dolore di rimbalzo e vasocostrizione:",
    "x.toxicity_methemoglobinemia_risk": "Tossicità e rischio di metaemoglobinemia:",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Svenimento e fattori di rischio di sincope vasovagale",
    "x.vasovagal_syncope_is_a_sudden_drop": "La sincope vasovagale è un calo improvviso della frequenza cardiaca e della pressione provocato da dolore, tensione nervosa",
    "x.high_risk_medications": "Farmaci ad alto rischio:",
    "x.prevention_protocol": "Protocollo di prevenzione:",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Medicazioni adesive per la cura (Saniderm / Tegaderm) e assottigliamento della pelle",
    "x.patients_on_topical_retinoids_systemic_steroids": "Chi assume retinoidi topici, corticosteroidi sistemici o ha la pelle sottile è ad alto rischio",
    "x.in_these_cases_traditional_breathable_cling": "In questi casi, la tradizionale pellicola traspirante o le garze non aderenti con adesivo ipoallergenico delicato",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Patogeni trasmessi per via ematica e contenimento delle contaminazioni crociate",
    "x.barrier_protection": "Protezione barriera:",
    "x.single_use_cartridges_needles": "Cartucce e aghi monouso:",
    "x.sharps_container_disposal": "Smaltimento nel contenitore per taglienti:",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Politica su alcol, cannabis e sostanze ricreative",
    "x.informed_consent_legal_safety": "Consenso informato e sicurezza legale:",
    "x.physiological_compromise": "Compromissione fisiologica:",
    "x.studio_safety_lifestyle_quiz": "🎮 Quiz su sicurezza dello studio e stile di vita",
    "x.test_your_studio_safety_medication_iq": "Metti alla prova le tue conoscenze su sicurezza e farmaci!",
    "x.answer_7_fun_educational_scenarios_about": "Rispondi a 7 scenari divertenti e istruttivi su alcol, cannabis, antidolorifici, creme anestetiche",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Preparazione pre-seduta e calcolatore della sincope vasovagale",
    "x.calculate_your_custom_fluid_target_blood": "Calcola il tuo obiettivo di idratazione personalizzato, il piano di mantenimento della glicemia e la riduzione del rischio di sincope",
    "x.body_weight": "Peso corporeo:",
    "x.lbs": "lb",
    "x.estimated_session_duration": "Durata stimata della seduta:",
    "x.1_hour_piercing_small_tattoo": "1 ora (piercing / tatuaggio piccolo)",
    "x.2_hours_small_medium_tattoo": "2 ore (tatuaggio piccolo / medio)",
    "x.3_hours_standard_session": "3 ore (seduta standard)",
    "x.4_hours_half_day": "4 ore (mezza giornata)",
    "x.6_hours_full_day_session": "6 ore (giornata intera)",
    "x.8_hours_extended_full_day": "8 ore (giornata intera prolungata)",
    "x.procedure_type": "Tipo di prestazione:",
    "x.tattoo_session_linework_color": "Seduta di tatuaggio (tratto / colore)",
    "x.piercing_session_body_ear_oral": "Seduta di piercing (corpo / orecchio / orale)",
    "x.resting_heart_rate_bpm": "Frequenza cardiaca a riposo (bpm)",
    "x.optional": "(facoltativo)",
    "x.blood_pressure_mmhg": "Pressione arteriosa (mmHg)",
    "x.risk_medication_factors_check_all_that": "Fattori di rischio e farmaci (seleziona tutto ciò che si applica):",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Assunzione di stimolanti per l'ADHD (Adderall/Vyvanse/Ritalin)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Assunzione di betabloccanti / farmaci per la pressione",
    "x.taking_glp_1_weight_loss_meds": "💫 Assunzione di farmaci GLP-1 per il dimagrimento (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Assunzione di ansiolitici o precedenti di svenimento",
    "x.faq_guidelines_progress": "❓ Avanzamento delle domande frequenti",
    "x.0_8_faqs_read_0": "0 / 8 domande lette (0%)",
    "x.frequently_asked_questions": "❓ Domande frequenti",
    "x.should_i_stop_taking_my_prescribed": "Devo sospendere il farmaco prescritto prima di un tatuaggio o di un piercing?",
    "x.never_stop_or_adjust_prescribed_medication": "Non sospendere né modificare MAI un farmaco prescritto",
    "x.why_is_accutane_isotretinoin_a_complete": "Perché l'Accutane (isotretinoina) è una controindicazione assoluta?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "L'isotretinoina altera profondamente il ricambio cellulare della pelle e assottiglia lo strato corneo,",
    "x.can_i_smoke_marijuana_or_consume": "Posso fumare cannabis o assumere edibili al THC prima dell'appuntamento per il tatuaggio?",
    "x.it_is_strongly_discouraged_thc_causes": "È fortemente sconsigliato. Il THC provoca vasodilatazione (apertura dei vasi), aumenta la frequenza cardiaca a riposo",
    "x.why_shouldn_t_i_drink_alcohol": "Perché non devo bere alcol né avere i postumi il giorno del tatuaggio?",
    "x.alcohol_thins_your_blood_and_acts": "L'alcol fluidifica il sangue e agisce da diuretico, disidratandoti gravemente. Durante il tatuaggio,",
    "x.how_does_smoking_cigarettes_or_vaping": "Che effetto hanno le sigarette o lo svapo di nicotina su un piercing o un tatuaggio nuovo?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "La nicotina è un potente vasocostrittore microvascolare. Restringe i capillari più piccoli",
    "x.can_i_drink_coffee_or_energy": "Posso bere caffè o energy drink prima della seduta?",
    "x.limit_high_caffeine_intake_right_before": "Limita la caffeina subito prima della seduta. La caffeina aumenta la frequenza cardiaca a riposo e",
    "x.what_should_i_bring_to_my": "Cosa devo portare all'appuntamento se assumo farmaci quotidiani?",
    "x.bring_a_complete_list_of_your": "Porta l'elenco completo dei tuoi farmaci (o usa la nostra scheda di consulenza), informa il tuo",
    "x.can_i_take_ibuprofen_or_aspirin": "Posso prendere ibuprofene o aspirina prima dell'appuntamento per il dolore?",
    "x.it_is_strongly_recommended_to_avoid": "Si raccomanda vivamente di evitare FANS (ibuprofene, naprossene) e aspirina nelle 24-48 ore precedenti",
    "x.can_i_go_to_the_gym": "Posso andare in palestra, nuotare o allenarmi dopo un tatuaggio o un piercing?",
    "x.avoid_heavy_exercise_for_24_48": "Evita sforzi intensi per 24-48 ore per limitare sudorazione, stiramenti e sfregamenti sulla zona fresca",
    "x.consult_your_physician_message_draft": "✉️ Consultare il medico - bozza di messaggio",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Usa questo modello per scrivere un'e-mail o un messaggio al tuo medico su un'eventuale modifica sicura della terapia",
    "x.doctor_or_clinic_name": "Nome del medico o della clinica:",
    "x.your_name": "Il tuo nome:",
    "x.procedure_location": "Prestazione e zona:",
    "x.appointment_date": "Data dell'appuntamento:",
    "x.selected_disclosed_medication_s": "Farmaco/i selezionato/i e dichiarato/i:",
    "x.no_medications_currently_selected_in_checker": "Nessun farmaco attualmente selezionato nel verificatore.",
    "x.generated_message_draft_editable_customize_your": "Bozza di messaggio generata (modificabile - personalizza il messaggio qui sotto):",
    "x.copy_draft_message": "📋 Copia la bozza",
    "x.open_email_app": "✉️ Apri l'app e-mail",
    "x.print_physician_note": "🖨️ Stampa la nota per il medico",
    "x.close": "Chiudi",
    "x.studio_emergency_first_aid_protocols": "🚨 Protocolli di primo soccorso in studio",
    "x.fainting_syncope": "💫 Svenimento / sincope",
    "x.allergic_reaction": "🐝 Reazione allergica",
    "x.excessive_bleeding": "🩸 Sanguinamento eccessivo",
    "x.panic_breathing": "🫁 Panico e respirazione",
    "x.vasovagal_syncope_fainting_protocol": "Protocollo per sincope vasovagale e svenimento",
    "x.common_response_to_sudden_pain_anxiety": "Reazione frequente a dolore improvviso, ansia o ipoglicemia, che provoca una temporanea ipoperfusione cerebrale",
    "x.stop_procedure_immediately": "Interrompi subito la prestazione:",
    "x.lay_flat_elevate_legs": "Distendi la persona e solleva le gambe:",
    "x.cool_ventilate": "Rinfresca e arieggia:",
    "x.glucose_boost": "Apporto di glucosio:",
    "x.acute_allergic_reaction_anaphylaxis": "Reazione allergica acuta e anafilassi",
    "x.allergic_response_to_topical_numbing_creams": "Reazione allergica a creme anestetiche, guanti in lattice, prodotti per stencil o inchiostri.",
    "x.call_emergency_services_now": "CHIAMA SUBITO I SOCCORSI:",
    "x.remove_the_trigger": "Rimuovi la causa scatenante:",
    "x.keep_them_lying_flat": "Mantieni la persona distesa:",
    "x.their_own_auto_injector": "Il suo autoiniettore:",
    "x.stay_with_them": "Resta accanto a lei:",
    "x.excessive_bleeding_heavy_plasma_oozing": "Sanguinamento eccessivo e forte essudazione plasmatica",
    "x.triggered_by_recent_nsaids_blood_thinners": "Causato da FANS o anticoagulanti assunti di recente, da alcol o da pressione alta.",
    "x.direct_firm_pressure": "Pressione diretta e decisa:",
    "x.elevate_area": "Solleva la zona:",
    "x.pressure_wrap": "Bendaggio compressivo:",
    "x.bright_spurting_blood_call_immediately": "Sangue rosso vivo e a zampillo: chiama subito.",
    "x.hyperventilation_acute_panic_attack": "Iperventilazione e attacco di panico acuto",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Respiro rapido e superficiale che provoca capogiri, formicolio alle dita e contratture",
    "x.pause_reassure": "Fai una pausa e rassicura:",
    "x.4_4_4_box_breathing": "Respirazione quadrata 4-4-4:",
    "x.physical_grounding": "Radicamento fisico:",
    "x.close_emergency_guide": "Chiudi la guida di emergenza",
    "x.immediate_action": "🚨 Azione immediata",
    "x.search_medication_or_brand_e_g": "Cerca un farmaco o una marca (es. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "es. 72 (bpm)",
    "x.e_g_dr_smith_city_health": "es. Dott. Rossi / Poliambulatorio cittadino",
    "x.e_g_alex_miller": "es. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "es. tatuaggio avambraccio / piercing setto",
    "x.type_or_customize_your_physician_inquiry": "Scrivi o personalizza qui il messaggio per il medico...",

    translationNotice: 'Questa pagina è stata tradotta dall\'inglese. Non possiamo garantire che la traduzione sia esatta. Facciamo del nostro meglio perché tutti possano capire, ma la versione inglese è quella che consideriamo corretta: verificate lì qualsiasi punto importante.',
    waitLabel: 'Raccomandazione di attesa / washout:',
    medUntranslated: 'Alcuni dettagli sui farmaci qui sopra sono mostrati in inglese: la traduzione in questa lingua è ancora in corso.',
    medSourcesLabel: 'Fonti pubblicate',
    tabSupplements: '🌿 Integratori',
    suppHeading: 'Verifica interazioni integratori e farmaci',
    suppIntro: 'La maggior parte delle persone non considera l\'olio di pesce, le capsule di aglio o il ginkgo come "farmaci", quindi non li menziona mai. Assunti insieme a un anticoagulante o a un antidolorifico, alcuni integratori aumentano il sanguinamento e l\'essudato durante la seduta. Aggiungi qui sotto quello che prendi per vedere cosa dice la letteratura pubblicata.',
    suppSearchPlaceholder: 'Cerca un integratore (es. olio di pesce, vitamina E, curcuma, ginseng)...',
    suppEmpty: 'Aggiungi un integratore per vedere se è stato studiato insieme al tuo farmaco.',
    suppStudied: 'è stato studiato per gli effetti su sanguinamento e coagulazione. Sulla base di',
    suppStudies: 'studi umani o clinici.',
    suppCardFooter: 'Questo non significa che devi sospendere l\'uno o l\'altro. Dì al tuo tatuatore o piercer cosa prendi e chiarisci ogni dubbio con il medico che ti ha prescritto la terapia.',
    suppNoPairs: 'Non disponiamo di studi umani pubblicati che colleghino questo integratore ai farmaci coperti da questo strumento. Non è lo stesso che dire "nessuna interazione": significa che la ricerca non esiste per affermarlo. Segnalalo comunque al tuo professionista.',
    suppUnknownTitle: 'Non abbiamo dati su',
    suppUnknownBody: 'È una lacuna della nostra libreria, non un risultato rassicurante. Non interpretarlo come sicuro. Parlane con il tuo tatuatore o piercer e con il tuo medico se assumi anche farmaci prescritti.',
    suppClinical: 'Evidenze cliniche',
    suppHuman: 'Studi sull\'uomo',
    suppCredit: 'Dati sulle interazioni da SUPP.AI (Allen Institute for AI). Sono mostrati solo studi umani e clinici; gli articoli ritirati sono esclusi.',
    geoLangLabel: 'Cerca in:',
    geoFindStudio: '🎨 Trova uno studio vicino',
    geoFindDoctor: '🩺 Trova un medico vicino',
    geoFindPharmacy: '💊 Farmacia più vicina',
    geoFindHospital: '🏥 Ospedale più vicino',
    geoNote: 'Questi link aprono Google Maps e cercano nella lingua del posto in cui ti trovi: all\'estero trova molto più di una ricerca in inglese. La tua posizione non arriva mai a noi: a Google va solo una parola di ricerca. Cambia la lingua qui sopra se il rilevamento è sbagliato.',
    emergHeadSub: 'Guide di intervento immediato, passo per passo, per il personale dello studio in caso di complicazioni durante una seduta.',
    emergCallLabel: 'Chiami prima i soccorsi:',
    emergCallConfirm: 'Questo numero è dedotto dal fuso orario del suo dispositivo e può essere sbagliato, per esempio dietro una VPN. Verifichi il numero corretto per il suo paese e lo tenga scritto sul muro dello studio.',
    emergDisclaimer: 'Questa guida è un promemoria per chi ha già una formazione di primo soccorso. Non è un corso di primo soccorso e non lo sostituisce. Chiami prima i soccorsi, non faccia nulla per cui non è formato e autorizzato dove lavora, e resti accanto alla persona fino all\'arrivo dei soccorsi.',
    disclaimerTitle: 'Avvertenza importante:',
    disclaimerBody: 'Questo strumento è solo un riferimento educativo e non costituisce un parere medico. Non interrompere né modificare mai un farmaco prescritto senza consultare il medico che lo ha prescritto. Informa sempre il tuo tatuatore e il tuo piercer di qualsiasi farmaco, condizione di salute o integratore che stai assumendo prima della procedura.',
    langLabel: '🌐 Lingua:',
    headerBadge: '💊 Riferimento Farmaci e Sicurezza',
    headerTitle: 'Verifica Interazioni Farmacologiche',
    headerSubtitle: 'Scopri come i farmaci influiscono sul rischio di sanguinamento e sulla guarigione di tatuaggi e piercing.',
    draftDoctorBtn: '✉️ Bozza per il medico',
    tabChecker: '🔍 Verifica',
    tabBrief: '📄 Report Artista',
    tabSafety: '🛡️ Sicurezza Studio',
    tabFaq: '❓ FAQ & Consigli',
    tabReminders: '⏰ Promemoria & Sospensione',
    searchPlaceholder: 'Cerca farmaco o marca (es. Aspirina, Accutane, Xanax, EMLA)...',
    filterAll: 'Tutti',
    filterPain: 'Antidolorifici & FANS',
    filterNumbing: 'Creme Anestetiche',
    filterBlood: 'Fluidificanti del sangue',
    filterRetinoid: 'Acne / Retinoidi',
    filterAnxiety: 'Ansia / Ansiolitici',
    filterHormone: 'Ormoni & TOC',
    filterStimulant: 'ADHD & Stimolanti',
    filterMetabolic: 'Diabete & GLP-1',
    filterCorticosteroid: 'Corticosteroidi',
    filterImmuno: 'Immunosoppressori',
    filterSupplement: 'Integratori',
    filterAntibiotic: 'Antibiotici & Antivirali',
    filterSubstance: 'Sostanze & Stile di vita',
    infoNote: '💡 Seleziona i tuoi farmaci per visualizzare i rischi procedurali e le precauzioni.',
    clearAll: 'Cancella tutto',
    draftDoctorNoteBtn: '✉️ Bozza per il medico',
    viewBriefBtn: '📄 Vedi Report',
    backToTopBtn: '⬆️ Torna Su',
    backToMedListBtn: '⬆️ Torna alla Lista'
  },
  es: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "Preocupación alta",
    "x.moderate_concern": "Preocupación moderada",
    "x.low_concern": "Preocupación baja",
    "x.low_syncope_risk": "Riesgo de síncope bajo",
    "x.moderate_syncope_risk": "Riesgo de síncope moderado",
    "x.elevated_syncope_risk": "⚠️ Riesgo de síncope elevado",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Compartir el enlace directo al cuestionario",
    "x.quick_print_summary": "🖨️ Resumen para imprimir",
    "x.trending_inquiries": "🔥 Búsquedas frecuentes:",
    "x.advil_ibuprofen": "Advil / Ibuprofeno",
    "x.accutane_retinoids": "Accutane / Retinoides",
    "x.tktx_numbing": "TKTX / Crema anestésica",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Ansiedad",
    "x.cannabis_thc": "Cannabis / THC",
    "x.alcohol_hangover": "Alcohol / Resaca",
    "x.aspirin_blood_thinners": "Aspirina / Anticoagulantes",
    "x.recent_searches": "🕒 Búsquedas recientes:",
    "x.clear_history": "Borrar el historial",
    "x.share_intake_status": "Estado del cuestionario compartido:",
    "x.copy_shareable_link": "🔗 Copiar el enlace para compartir",
    "x.select_all_medications_and_supplements_you": "💡 Seleccione todos los medicamentos y suplementos que toma. Los resultados destacarán automáticamente",
    "x.client_consultation_brief": "Ficha de consulta del cliente",
    "x.a_printable_and_shareable_summary_of": "Un resumen imprimible y compartible de los medicamentos seleccionados y las recomendaciones para la sesión",
    "x.no_medications_selected_yet": "⚠️ Todavía no se ha seleccionado ningún medicamento.",
    "x.switch_to_the_interaction_checker": "Ir al verificador de interacciones",
    "x.generate_full_clinic_packet_print": "📄 Generar el expediente clínico completo (impresión)",
    "x.share_deep_link": "🔗 Compartir el enlace directo",
    "x.export_data_json": "💾 Exportar los datos (JSON)",
    "x.export_text_file": "📄 Exportar un archivo de texto",
    "x.download_pdf_document": "📥 Descargar el documento PDF",
    "x.copy_summary": "📋 Copiar el resumen",
    "x.print_brief": "🖨️ Imprimir la ficha",
    "x.expected_healing_journey_timeline": "🩺 Proceso de cicatrización previsto",
    "x.tattoo_healing": "🎨 Cicatrización del tatuaje",
    "x.piercing_healing": "💎 Cicatrización del piercing",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Cronología interactiva de las etapas fisiológicas y los efectos de los medicamentos",
    "x.pre_procedure_medication_washout_reminders": "⏰ Suspensión de medicamentos antes de la sesión y recordatorios",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Calcule los plazos exactos de suspensión de los medicamentos (AINE, anticoagulantes)",
    "x.scheduled_appointment_date_time": "📅 Fecha y hora de la cita prevista:",
    "x.save_compute_washout": "💾 Guardar y calcular la suspensión",
    "x.setting_your_appointment_date_computes_live": "Indicar la fecha de la cita activa cuentas atrás que muestran exactamente cuándo dejar de tomar",
    "x.enable_browser_notification_alerts": "🔔 Activar las notificaciones del navegador",
    "x.download_google_calendar_ics_pre_filled": "📅 Descargar el archivo .ics de Google Calendar (plazos de suspensión rellenados)",
    "x.open_washout_in_google_calendar_web": "🌐 Abrir los plazos de suspensión en Google Calendar",
    "x.export_standard_calendar_ics": "📅 Exportar un calendario estándar (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Autoevaluación de preparación del tatuador y del perforador",
    "x.answer_3_quick_questions_about_your": "Responda 3 preguntas rápidas sobre la sesión de su cliente y los medicamentos declarados para obtener",
    "x.1_what_procedure_is_being_performed": "1. ¿Qué procedimiento se va a realizar?",
    "x.tattoo_body_linework_shading_color": "Tatuaje (línea corporal / sombreado / color)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Micropigmentación (microblading / lip blush / cuero cabelludo)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (cartílago de la oreja / nariz / pezón / cuerpo)",
    "x.piercing_oral_lip_tongue": "Piercing (oral / labio / lengua)",
    "x.2_disclosed_client_medications_or_topicals": "2. ¿Medicamentos o productos tópicos declarados por el cliente? (marque todo lo que corresponda)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "AINE / anticoagulantes (ibuprofeno, aspirina, warfarina)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Crema anestésica aplicada (lidocaína, epinefrina, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Retinoides para el acné (Accutane) o corticoides",
    "x.blood_pressure_beta_blockers_glp_1": "Tensión arterial / betabloqueantes / GLP-1 / estimulantes",
    "x.none_disclosed_healthy": "Ninguno / declarado sano",
    "x.3_client_history_physiological_risk_factors": "3. ¿Antecedentes del cliente y factores de riesgo fisiológicos?",
    "x.no_known_fainting_history_or_skin": "Sin antecedentes conocidos de desmayo ni problemas cutáneos",
    "x.history_of_vasovagal_syncope_fainting_low": "Antecedentes de síncope vasovagal / desmayo / hipoglucemia",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Piel muy sensible / eccema / moratones fáciles",
    "x.first_time_client_high_nervous_tension": "Primera vez / gran tensión nerviosa",
    "x.studio_safety_guide_progress": "🛡️ Progreso de la guía de seguridad del estudio",
    "x.0_6_sections_read_0": "0 / 6 secciones leídas (0 %)",
    "x.studio_safety_clinical_reference": "🛡️ Seguridad del estudio y referencia clínica",
    "x.essential_clinical_reference_for_clients_tattoo": "Referencia clínica esencial para clientes, tatuadores y perforadores sobre el manejo",
    "x.1_painkillers_pre_procedure_pain_management": "1. Analgésicos y manejo del dolor antes de la sesión",
    "x.clients_often_take_over_the_counter": "Los clientes suelen tomar analgésicos sin receta antes de una sesión para controlar el dolor. Es fundamental",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirina y AINE (ibuprofeno, naproxeno, Nurofen, Aleve):",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracetamol / acetaminofén (Tylenol, Panadol):",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Cremas anestésicas tópicas y anestésicos locales",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Las cremas anestésicas (lidocaína, tetracaína, prilocaína, TKTX) se han popularizado enormemente",
    "x.skin_texture_alterations": "Alteraciones de la textura de la piel:",
    "x.rebound_pain_vasoconstriction": "Dolor de rebote y vasoconstricción:",
    "x.toxicity_methemoglobinemia_risk": "Toxicidad y riesgo de metahemoglobinemia:",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Desmayo y factores de riesgo de síncope vasovagal",
    "x.vasovagal_syncope_is_a_sudden_drop": "El síncope vasovagal es una caída brusca de la frecuencia cardíaca y la tensión provocada por el dolor, la tensión nerviosa",
    "x.high_risk_medications": "Medicamentos de alto riesgo:",
    "x.prevention_protocol": "Protocolo de prevención:",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Apósitos adhesivos de cuidado (Saniderm / Tegaderm) y adelgazamiento de la piel",
    "x.patients_on_topical_retinoids_systemic_steroids": "Quienes usan retinoides tópicos, corticoides sistémicos o tienen la piel fina corren un riesgo alto",
    "x.in_these_cases_traditional_breathable_cling": "En estos casos, el film transpirable tradicional o los apósitos no adherentes con adhesivo hipoalergénico suave",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Patógenos de transmisión sanguínea y contención de la contaminación cruzada",
    "x.barrier_protection": "Protección de barrera:",
    "x.single_use_cartridges_needles": "Cartuchos y agujas de un solo uso:",
    "x.sharps_container_disposal": "Eliminación en contenedor de objetos punzantes:",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Política sobre alcohol, cannabis y sustancias recreativas",
    "x.informed_consent_legal_safety": "Consentimiento informado y seguridad jurídica:",
    "x.physiological_compromise": "Compromiso fisiológico:",
    "x.studio_safety_lifestyle_quiz": "🎮 Cuestionario de seguridad del estudio y estilo de vida",
    "x.test_your_studio_safety_medication_iq": "¡Ponga a prueba sus conocimientos sobre seguridad y medicamentos!",
    "x.answer_7_fun_educational_scenarios_about": "Responda a 7 casos amenos y didácticos sobre alcohol, cannabis, analgésicos, cremas anestésicas",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Preparación previa a la sesión y calculadora de síncope vasovagal",
    "x.calculate_your_custom_fluid_target_blood": "Calcule su objetivo personalizado de hidratación, su plan de glucemia y la reducción del riesgo de síncope",
    "x.body_weight": "Peso corporal:",
    "x.lbs": "lb",
    "x.estimated_session_duration": "Duración estimada de la sesión:",
    "x.1_hour_piercing_small_tattoo": "1 hora (piercing / tatuaje pequeño)",
    "x.2_hours_small_medium_tattoo": "2 horas (tatuaje pequeño / mediano)",
    "x.3_hours_standard_session": "3 horas (sesión estándar)",
    "x.4_hours_half_day": "4 horas (media jornada)",
    "x.6_hours_full_day_session": "6 horas (jornada completa)",
    "x.8_hours_extended_full_day": "8 horas (jornada completa ampliada)",
    "x.procedure_type": "Tipo de procedimiento:",
    "x.tattoo_session_linework_color": "Sesión de tatuaje (línea / color)",
    "x.piercing_session_body_ear_oral": "Sesión de piercing (cuerpo / oreja / oral)",
    "x.resting_heart_rate_bpm": "Frecuencia cardíaca en reposo (lpm)",
    "x.optional": "(opcional)",
    "x.blood_pressure_mmhg": "Tensión arterial (mmHg)",
    "x.risk_medication_factors_check_all_that": "Factores de riesgo y medicación (marque todo lo que corresponda):",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Toma estimulantes para el TDAH (Adderall/Vyvanse/Ritalin)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Toma betabloqueantes / medicación para la tensión",
    "x.taking_glp_1_weight_loss_meds": "💫 Toma medicación GLP-1 para adelgazar (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Toma ansiolíticos o tiene antecedentes de desmayo",
    "x.faq_guidelines_progress": "❓ Progreso de las preguntas frecuentes",
    "x.0_8_faqs_read_0": "0 / 8 preguntas leídas (0 %)",
    "x.frequently_asked_questions": "❓ Preguntas frecuentes",
    "x.should_i_stop_taking_my_prescribed": "¿Debo dejar mi medicación recetada antes de hacerme un tatuaje o un piercing?",
    "x.never_stop_or_adjust_prescribed_medication": "NUNCA deje ni ajuste una medicación recetada",
    "x.why_is_accutane_isotretinoin_a_complete": "¿Por qué el Accutane (isotretinoína) es una contraindicación absoluta?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "La isotretinoína altera profundamente la renovación celular de la piel y adelgaza el estrato córneo,",
    "x.can_i_smoke_marijuana_or_consume": "¿Puedo fumar marihuana o tomar comestibles con THC antes de mi cita de tatuaje?",
    "x.it_is_strongly_discouraged_thc_causes": "Se desaconseja firmemente. El THC provoca vasodilatación (apertura de los vasos), eleva la frecuencia cardíaca en reposo",
    "x.why_shouldn_t_i_drink_alcohol": "¿Por qué no debo beber alcohol ni tener resaca el día del tatuaje?",
    "x.alcohol_thins_your_blood_and_acts": "El alcohol diluye la sangre y actúa como diurético, lo que le deshidrata mucho. Durante el tatuaje,",
    "x.how_does_smoking_cigarettes_or_vaping": "¿Cómo afectan los cigarrillos o el vapeo de nicotina a un piercing o tatuaje reciente?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "La nicotina es un potente vasoconstrictor de los microvasos. Estrecha los capilares más finos",
    "x.can_i_drink_coffee_or_energy": "¿Puedo tomar café o bebidas energéticas antes de la sesión?",
    "x.limit_high_caffeine_intake_right_before": "Limite la cafeína justo antes de la sesión. La cafeína eleva el pulso en reposo y",
    "x.what_should_i_bring_to_my": "¿Qué debo llevar a la cita si tomo medicación a diario?",
    "x.bring_a_complete_list_of_your": "Lleve una lista completa de su medicación (o use nuestra ficha de consulta), informe a su",
    "x.can_i_take_ibuprofen_or_aspirin": "¿Puedo tomar ibuprofeno o aspirina antes de la cita para el dolor?",
    "x.it_is_strongly_recommended_to_avoid": "Se recomienda encarecidamente evitar los AINE (ibuprofeno, naproxeno) y la aspirina entre 24 y 48 horas antes",
    "x.can_i_go_to_the_gym": "¿Puedo ir al gimnasio, nadar o hacer ejercicio después de un tatuaje o un piercing?",
    "x.avoid_heavy_exercise_for_24_48": "Evite el ejercicio intenso entre 24 y 48 horas para no sudar en exceso ni estirar o rozar la zona reciente",
    "x.consult_your_physician_message_draft": "✉️ Consultar a su médico - borrador de mensaje",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Use esta plantilla para redactar un correo o mensaje a su médico sobre un ajuste seguro de la medicación",
    "x.doctor_or_clinic_name": "Nombre del médico o de la clínica:",
    "x.your_name": "Su nombre:",
    "x.procedure_location": "Procedimiento y zona:",
    "x.appointment_date": "Fecha de la cita:",
    "x.selected_disclosed_medication_s": "Medicamento(s) seleccionado(s) y declarado(s):",
    "x.no_medications_currently_selected_in_checker": "No hay ningún medicamento seleccionado en el verificador.",
    "x.generated_message_draft_editable_customize_your": "Borrador de mensaje generado (editable: personalice el mensaje abajo):",
    "x.copy_draft_message": "📋 Copiar el borrador",
    "x.open_email_app": "✉️ Abrir la aplicación de correo",
    "x.print_physician_note": "🖨️ Imprimir la nota para el médico",
    "x.close": "Cerrar",
    "x.studio_emergency_first_aid_protocols": "🚨 Protocolos de primeros auxilios del estudio",
    "x.fainting_syncope": "💫 Desmayo / síncope",
    "x.allergic_reaction": "🐝 Reacción alérgica",
    "x.excessive_bleeding": "🩸 Sangrado excesivo",
    "x.panic_breathing": "🫁 Pánico y respiración",
    "x.vasovagal_syncope_fainting_protocol": "Protocolo ante síncope vasovagal y desmayo",
    "x.common_response_to_sudden_pain_anxiety": "Respuesta frecuente al dolor repentino, la ansiedad o la hipoglucemia, que provoca hipoperfusión cerebral pasajera",
    "x.stop_procedure_immediately": "Detenga el procedimiento de inmediato:",
    "x.lay_flat_elevate_legs": "Tumbe a la persona y eleve sus piernas:",
    "x.cool_ventilate": "Refresque y ventile:",
    "x.glucose_boost": "Aporte de glucosa:",
    "x.acute_allergic_reaction_anaphylaxis": "Reacción alérgica aguda y anafilaxia",
    "x.allergic_response_to_topical_numbing_creams": "Reacción alérgica a cremas anestésicas, guantes de látex, productos de plantilla o tintas.",
    "x.call_emergency_services_now": "LLAME A EMERGENCIAS AHORA:",
    "x.remove_the_trigger": "Retire el desencadenante:",
    "x.keep_them_lying_flat": "Mantenga a la persona tumbada:",
    "x.their_own_auto_injector": "Su propio autoinyector:",
    "x.stay_with_them": "Quédese con ella:",
    "x.excessive_bleeding_heavy_plasma_oozing": "Sangrado excesivo y exudado abundante de plasma",
    "x.triggered_by_recent_nsaids_blood_thinners": "Provocado por AINE o anticoagulantes recientes, alcohol o tensión alta.",
    "x.direct_firm_pressure": "Presión directa y firme:",
    "x.elevate_area": "Eleve la zona:",
    "x.pressure_wrap": "Vendaje compresivo:",
    "x.bright_spurting_blood_call_immediately": "Sangre roja brillante a chorro: llame de inmediato.",
    "x.hyperventilation_acute_panic_attack": "Hiperventilación y crisis de pánico aguda",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Respiración rápida y superficial que causa mareo, hormigueo en los dedos y contracturas",
    "x.pause_reassure": "Haga una pausa y tranquilice:",
    "x.4_4_4_box_breathing": "Respiración cuadrada 4-4-4:",
    "x.physical_grounding": "Anclaje físico:",
    "x.close_emergency_guide": "Cerrar la guía de emergencia",
    "x.immediate_action": "🚨 Actuación inmediata",
    "x.search_medication_or_brand_e_g": "Buscar un medicamento o marca (p. ej. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "p. ej. 72 (lpm)",
    "x.e_g_dr_smith_city_health": "p. ej. Dra. Sánchez / Centro de salud municipal",
    "x.e_g_alex_miller": "p. ej. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "p. ej. tatuaje en antebrazo / piercing septum",
    "x.type_or_customize_your_physician_inquiry": "Escriba o personalice aquí su mensaje para el médico...",

    translationNotice: 'Esta página ha sido traducida del inglés. No podemos garantizar que la traducción sea exacta. Hacemos todo lo posible para que todos puedan entender, pero la versión en inglés es la que consideramos correcta: compruebe en ella cualquier punto importante.',
    waitLabel: 'Recomendación de espera / lavado:',
    medUntranslated: 'Algunos detalles sobre los medicamentos anteriores se muestran en inglés: la traducción a este idioma todavía está en curso.',
    medSourcesLabel: 'Fuentes publicadas',
    tabSupplements: '🌿 Suplementos',
    suppHeading: 'Verificador de interacciones entre suplementos y medicamentos',
    suppIntro: 'La mayoría de la gente no considera el aceite de pescado, las cápsulas de ajo o el ginkgo como «medicación», así que nunca los menciona. Tomados junto a un anticoagulante o un analgésico, algunos suplementos aumentan el sangrado y el exudado durante la sesión. Añade lo que tomas para ver qué dice la literatura publicada.',
    suppSearchPlaceholder: 'Buscar un suplemento (p. ej. aceite de pescado, vitamina E, cúrcuma, ginseng)...',
    suppEmpty: 'Añade un suplemento para ver si se ha estudiado junto con tu medicamento.',
    suppStudied: 'se ha estudiado por sus efectos sobre el sangrado y la coagulación. Según',
    suppStudies: 'estudios humanos o clínicos.',
    suppCardFooter: 'Esto no significa que debas suspender ninguno de los dos. Dile a tu tatuador o perforador qué tomas, y consulta cualquier duda con el médico que te recetó la medicación.',
    suppNoPairs: 'No disponemos de estudios humanos publicados que relacionen este suplemento con los medicamentos que cubre esta herramienta. Eso no es lo mismo que «ninguna interacción»: significa que no existe investigación que citar. Menciónalo igualmente a tu profesional.',
    suppUnknownTitle: 'No tenemos datos sobre',
    suppUnknownBody: 'Es una laguna de nuestra biblioteca, no un resultado tranquilizador. No lo interpretes como seguro. Coméntalo con tu tatuador o perforador, y con tu médico si además tomas medicación recetada.',
    suppClinical: 'Evidencia clínica',
    suppHuman: 'Estudios en humanos',
    suppCredit: 'Datos de interacciones de SUPP.AI (Allen Institute for AI). Solo se muestran estudios humanos y clínicos; se excluyen los artículos retractados.',
    geoLangLabel: 'Buscar en:',
    geoFindStudio: '🎨 Buscar un estudio cerca',
    geoFindDoctor: '🩺 Buscar un médico cerca',
    geoFindPharmacy: '💊 Farmacia más cercana',
    geoFindHospital: '🏥 Hospital más cercano',
    geoNote: 'Estos enlaces abren Google Maps y buscan en el idioma del lugar donde está, lo que encuentra mucho más que una búsqueda en inglés en el extranjero. Su ubicación nunca llega hasta nosotros: a Google solo va una palabra de búsqueda. Cambie el idioma de arriba si la detección no es correcta.',
    emergHeadSub: 'Guías de actuación inmediata, paso a paso, para el personal del estudio ante complicaciones durante una sesion.',
    emergCallLabel: 'Llame primero a los servicios de emergencia:',
    emergCallConfirm: 'Este número se deduce de la zona horaria de su dispositivo y puede ser incorrecto, por ejemplo con una VPN. Confirme el número correcto de su país y téngalo escrito en la pared del estudio.',
    emergDisclaimer: 'Esta guía es un recordatorio para personas que ya tienen formación en primeros auxilios. No es formación en primeros auxilios ni la sustituye. Llame primero a emergencias, no haga nada para lo que no esté formado y autorizado donde trabaja, y quédese con la persona hasta que llegue la ayuda.',
    disclaimerTitle: 'Aviso importante:',
    disclaimerBody: 'Esta herramienta es solo una referencia educativa y no constituye asesoramiento médico. Nunca suspenda ni modifique un medicamento recetado sin consultar al médico que se lo recetó. Informe siempre a su tatuador y a su perforador de cualquier medicamento, problema de salud o suplemento que esté tomando antes del procedimiento.',
    langLabel: '🌐 Idioma:',
    headerBadge: '💊 Referencia de Medicamentos y Seguridad',
    headerTitle: 'Comprobador de Interacciones de Medicamentos',
    headerSubtitle: 'Consulta cómo los medicamentos afectan el riesgo de sangrado, la fijación de tinta y la cicatrización de tatuajes y piercings.',
    draftDoctorBtn: '✉️ Redactar nota para el médico',
    tabChecker: '🔍 Buscador',
    tabBrief: '📄 Informe para el Artista',
    tabSafety: '🛡️ Seguridad en el Estudio',
    tabFaq: '❓ Preguntas Frecuentes',
    tabReminders: '⏰ Recordatorios & Suspensión',
    searchPlaceholder: 'Buscar medicamento (ej. Ibuprofeno, Accutane, Xanax, EMLA)...',
    filterAll: 'Todos',
    filterPain: 'Analgésicos y AINEs',
    filterNumbing: 'Cremas Anestésicas',
    filterBlood: 'Anticoagulantes',
    filterRetinoid: 'Acné / Retinoides',
    filterAnxiety: 'Ansiolíticos / Sedantes',
    filterHormone: 'Hormonas y TRH',
    filterStimulant: 'TDAH y Estimulantes',
    filterMetabolic: 'Diabetes y GLP-1',
    filterCorticosteroid: 'Corticosteroides',
    filterImmuno: 'Inmunosupresores',
    filterSupplement: 'Suplementos',
    filterAntibiotic: 'Antibióticos y Antivirales',
    filterSubstance: 'Sustancias y Estilo de vida',
    infoNote: '💡 Selecciona tus medicamentos para verificar precauciones e interacciones.',
    clearAll: 'Borrar todo',
    draftDoctorNoteBtn: '✉️ Nota médica',
    viewBriefBtn: '📄 Ver Informe',
    backToTopBtn: '⬆️ Volver Arriba',
    backToMedListBtn: '⬆️ Volver a la Lista'
  },
  de: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "Hohes Risiko",
    "x.moderate_concern": "Mäßiges Risiko",
    "x.low_concern": "Geringes Risiko",
    "x.low_syncope_risk": "Geringes Synkopenrisiko",
    "x.moderate_syncope_risk": "Mäßiges Synkopenrisiko",
    "x.elevated_syncope_risk": "⚠️ Erhöhtes Synkopenrisiko",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Direktlink zum Fragebogen teilen",
    "x.quick_print_summary": "🖨️ Kurzfassung zum Ausdrucken",
    "x.trending_inquiries": "🔥 Häufige Suchanfragen:",
    "x.advil_ibuprofen": "Advil / Ibuprofen",
    "x.accutane_retinoids": "Accutane / Retinoide",
    "x.tktx_numbing": "TKTX / Betäubungscreme",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Angst",
    "x.cannabis_thc": "Cannabis / THC",
    "x.alcohol_hangover": "Alkohol / Kater",
    "x.aspirin_blood_thinners": "Aspirin / Blutverdünner",
    "x.recent_searches": "🕒 Letzte Suchanfragen:",
    "x.clear_history": "Verlauf löschen",
    "x.share_intake_status": "Status der Fragebogen-Freigabe:",
    "x.copy_shareable_link": "🔗 Freigabelink kopieren",
    "x.select_all_medications_and_supplements_you": "💡 Wählen Sie alle Medikamente und Nahrungsergänzungsmittel aus, die Sie einnehmen. Die Ergebnisse heben automatisch hervor",
    "x.client_consultation_brief": "Beratungsbogen für den Kunden",
    "x.a_printable_and_shareable_summary_of": "Eine druck- und teilbare Übersicht der gewählten Medikamente und der Empfehlungen für die Sitzung",
    "x.no_medications_selected_yet": "⚠️ Noch keine Medikamente ausgewählt.",
    "x.switch_to_the_interaction_checker": "Zum Wechselwirkungs-Check wechseln",
    "x.generate_full_clinic_packet_print": "📄 Vollständige Klinikmappe erzeugen (Druck)",
    "x.share_deep_link": "🔗 Direktlink teilen",
    "x.export_data_json": "💾 Daten exportieren (JSON)",
    "x.export_text_file": "📄 Textdatei exportieren",
    "x.download_pdf_document": "📥 PDF-Dokument herunterladen",
    "x.copy_summary": "📋 Übersicht kopieren",
    "x.print_brief": "🖨️ Bogen drucken",
    "x.expected_healing_journey_timeline": "🩺 Erwarteter Heilungsverlauf",
    "x.tattoo_healing": "🎨 Heilung des Tattoos",
    "x.piercing_healing": "💎 Heilung des Piercings",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Interaktive Zeitleiste der körperlichen Etappen und der Medikamentenwirkungen",
    "x.pre_procedure_medication_washout_reminders": "⏰ Absetzen von Medikamenten vor der Sitzung und Erinnerungen",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Berechnen Sie genaue Absetzfristen für Medikamente (NSAR, Blutverdünner)",
    "x.scheduled_appointment_date_time": "📅 Datum und Uhrzeit des geplanten Termins:",
    "x.save_compute_washout": "💾 Speichern und Absetzfrist berechnen",
    "x.setting_your_appointment_date_computes_live": "Mit dem Termindatum starten Countdowns, die genau anzeigen, wann Sie die Einnahme beenden sollten von",
    "x.enable_browser_notification_alerts": "🔔 Browser-Benachrichtigungen aktivieren",
    "x.download_google_calendar_ics_pre_filled": "📅 Google-Kalender-.ics herunterladen (Absetzfristen vorausgefüllt)",
    "x.open_washout_in_google_calendar_web": "🌐 Absetzfristen in Google Kalender öffnen",
    "x.export_standard_calendar_ics": "📅 Standardkalender exportieren (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Selbsteinschätzung der Bereitschaft für Tätowierer und Piercer",
    "x.answer_3_quick_questions_about_your": "Beantworten Sie 3 kurze Fragen zur Sitzung Ihres Kunden und zu den angegebenen Medikamenten, um",
    "x.1_what_procedure_is_being_performed": "1. Welche Leistung wird durchgeführt?",
    "x.tattoo_body_linework_shading_color": "Tattoo (Linienarbeit am Körper / Schattierung / Farbe)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Permanent-Make-up (Microblading / Lip Blush / Kopfhaut)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (Ohrknorpel / Nase / Brustwarze / Körper)",
    "x.piercing_oral_lip_tongue": "Piercing (Mund / Lippe / Zunge)",
    "x.2_disclosed_client_medications_or_topicals": "2. Vom Kunden angegebene Medikamente oder Externa? (Zutreffendes ankreuzen)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "NSAR / Blutverdünner (Ibuprofen, Aspirin, Warfarin)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Betäubungscreme aufgetragen (Lidocain, Epinephrin, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Akne-Retinoide (Accutane) oder Kortikosteroide",
    "x.blood_pressure_beta_blockers_glp_1": "Blutdruck / Betablocker / GLP-1 / Stimulanzien",
    "x.none_disclosed_healthy": "Keine / als gesund angegeben",
    "x.3_client_history_physiological_risk_factors": "3. Vorgeschichte des Kunden und körperliche Risikofaktoren?",
    "x.no_known_fainting_history_or_skin": "Keine bekannten Ohnmachten oder Hautprobleme",
    "x.history_of_vasovagal_syncope_fainting_low": "Vasovagale Synkope / Ohnmacht / Unterzuckerung in der Vorgeschichte",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Sehr empfindliche Haut / Ekzem / leichte Blutergüsse",
    "x.first_time_client_high_nervous_tension": "Erstkunde / starke Nervosität",
    "x.studio_safety_guide_progress": "🛡️ Fortschritt im Studio-Sicherheitsleitfaden",
    "x.0_6_sections_read_0": "0 / 6 Abschnitte gelesen (0 %)",
    "x.studio_safety_clinical_reference": "🛡️ Studiosicherheit und klinische Referenz",
    "x.essential_clinical_reference_for_clients_tattoo": "Grundlegende klinische Referenz für Kunden, Tätowierer und Piercer zum Umgang",
    "x.1_painkillers_pre_procedure_pain_management": "1. Schmerzmittel und Schmerzbehandlung vor der Sitzung",
    "x.clients_often_take_over_the_counter": "Kunden nehmen vor einer Sitzung häufig rezeptfreie Schmerzmittel gegen die Schmerzen. Es ist wichtig,",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirin und NSAR (Ibuprofen, Naproxen, Nurofen, Aleve):",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracetamol / Acetaminophen (Tylenol, Panadol):",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Betäubungscremes und Lokalanästhetika",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Betäubungscremes (Lidocain, Tetracain, Prilocain, TKTX) haben stark an Verbreitung gewonnen",
    "x.skin_texture_alterations": "Veränderung der Hautbeschaffenheit:",
    "x.rebound_pain_vasoconstriction": "Rebound-Schmerz und Gefäßverengung:",
    "x.toxicity_methemoglobinemia_risk": "Toxizität und Risiko einer Methämoglobinämie:",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Ohnmacht und Risikofaktoren für eine vasovagale Synkope",
    "x.vasovagal_syncope_is_a_sudden_drop": "Eine vasovagale Synkope ist ein plötzlicher Abfall von Herzfrequenz und Blutdruck, ausgelöst durch Schmerz, Nervosität",
    "x.high_risk_medications": "Medikamente mit hohem Risiko:",
    "x.prevention_protocol": "Vorbeugungsprotokoll:",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Selbstklebende Pflegefolien (Saniderm / Tegaderm) und dünner werdende Haut",
    "x.patients_on_topical_retinoids_systemic_steroids": "Wer topische Retinoide oder systemische Steroide einnimmt oder dünne Haut hat, trägt ein hohes Risiko",
    "x.in_these_cases_traditional_breathable_cling": "In diesen Fällen sind herkömmliche atmungsaktive Folie oder nicht haftende Kompressen mit mildem hypoallergenem Kleber",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Blutübertragbare Erreger und Vermeidung von Kreuzkontamination",
    "x.barrier_protection": "Barriereschutz:",
    "x.single_use_cartridges_needles": "Einwegkartuschen und -nadeln:",
    "x.sharps_container_disposal": "Entsorgung im Kanülenabwurfbehälter:",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Regeln zu Alkohol, Cannabis und Freizeitdrogen",
    "x.informed_consent_legal_safety": "Aufgeklärte Einwilligung und Rechtssicherheit:",
    "x.physiological_compromise": "Körperliche Beeinträchtigung:",
    "x.studio_safety_lifestyle_quiz": "🎮 Quiz zu Studiosicherheit und Lebensstil",
    "x.test_your_studio_safety_medication_iq": "Testen Sie Ihr Wissen zu Studiosicherheit und Medikamenten!",
    "x.answer_7_fun_educational_scenarios_about": "Beantworten Sie 7 unterhaltsame, lehrreiche Fälle zu Alkohol, Cannabis, Schmerzmitteln, Betäubungscremes",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Vorbereitung vor der Sitzung und Rechner zur vasovagalen Synkope",
    "x.calculate_your_custom_fluid_target_blood": "Berechnen Sie Ihr persönliches Trinkziel, Ihren Blutzuckerplan und die Senkung des Synkopenrisikos",
    "x.body_weight": "Körpergewicht:",
    "x.lbs": "lb",
    "x.estimated_session_duration": "Geschätzte Sitzungsdauer:",
    "x.1_hour_piercing_small_tattoo": "1 Stunde (Piercing / kleines Tattoo)",
    "x.2_hours_small_medium_tattoo": "2 Stunden (kleines / mittleres Tattoo)",
    "x.3_hours_standard_session": "3 Stunden (übliche Sitzung)",
    "x.4_hours_half_day": "4 Stunden (halber Tag)",
    "x.6_hours_full_day_session": "6 Stunden (ganzer Tag)",
    "x.8_hours_extended_full_day": "8 Stunden (verlängerter ganzer Tag)",
    "x.procedure_type": "Art der Leistung:",
    "x.tattoo_session_linework_color": "Tattoo-Sitzung (Linienarbeit / Farbe)",
    "x.piercing_session_body_ear_oral": "Piercing-Sitzung (Körper / Ohr / Mund)",
    "x.resting_heart_rate_bpm": "Ruhepuls (bpm)",
    "x.optional": "(optional)",
    "x.blood_pressure_mmhg": "Blutdruck (mmHg)",
    "x.risk_medication_factors_check_all_that": "Risiko- und Medikamentenfaktoren (Zutreffendes ankreuzen):",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Einnahme von ADHS-Stimulanzien (Adderall/Vyvanse/Ritalin)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Einnahme von Betablockern / Blutdruckmitteln",
    "x.taking_glp_1_weight_loss_meds": "💫 Einnahme von GLP-1-Abnehmmitteln (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Einnahme von Angstmitteln oder Ohnmacht in der Vorgeschichte",
    "x.faq_guidelines_progress": "❓ Fortschritt bei den häufigen Fragen",
    "x.0_8_faqs_read_0": "0 / 8 Fragen gelesen (0 %)",
    "x.frequently_asked_questions": "❓ Häufige Fragen",
    "x.should_i_stop_taking_my_prescribed": "Soll ich mein verschriebenes Medikament vor einem Tattoo oder Piercing absetzen?",
    "x.never_stop_or_adjust_prescribed_medication": "Setzen Sie ein verschriebenes Medikament NIEMALS ab und ändern Sie es nicht",
    "x.why_is_accutane_isotretinoin_a_complete": "Warum ist Accutane (Isotretinoin) eine absolute Gegenanzeige?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "Isotretinoin verändert die Zellerneuerung der Haut grundlegend und macht die Hornschicht dünner,",
    "x.can_i_smoke_marijuana_or_consume": "Darf ich vor meinem Tattoo-Termin Cannabis rauchen oder THC-Esswaren zu mir nehmen?",
    "x.it_is_strongly_discouraged_thc_causes": "Davon wird dringend abgeraten. THC weitet die Gefäße, erhöht den Ruhepuls",
    "x.why_shouldn_t_i_drink_alcohol": "Warum soll ich am Tattoo-Tag keinen Alkohol trinken und keinen Kater haben?",
    "x.alcohol_thins_your_blood_and_acts": "Alkohol verdünnt das Blut und wirkt harntreibend, wodurch Sie stark dehydrieren. Beim Tätowieren",
    "x.how_does_smoking_cigarettes_or_vaping": "Wie wirken sich Zigaretten oder Nikotin-Dampfen auf ein frisches Piercing oder Tattoo aus?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "Nikotin verengt die kleinen Gefäße stark. Es lässt feinste Kapillaren schrumpfen",
    "x.can_i_drink_coffee_or_energy": "Darf ich vor meiner Sitzung Kaffee oder Energydrinks trinken?",
    "x.limit_high_caffeine_intake_right_before": "Schränken Sie Koffein direkt vor der Sitzung ein. Koffein erhöht den Ruhepuls und",
    "x.what_should_i_bring_to_my": "Was soll ich zum Termin mitbringen, wenn ich täglich Medikamente nehme?",
    "x.bring_a_complete_list_of_your": "Bringen Sie eine vollständige Liste Ihrer Medikamente mit (oder nutzen Sie unseren Beratungsbogen), informieren Sie Ihre",
    "x.can_i_take_ibuprofen_or_aspirin": "Darf ich vor dem Termin Ibuprofen oder Aspirin gegen die Schmerzen nehmen?",
    "x.it_is_strongly_recommended_to_avoid": "Es wird dringend empfohlen, NSAR (Ibuprofen, Naproxen) und Aspirin 24 bis 48 Stunden vorher zu meiden",
    "x.can_i_go_to_the_gym": "Darf ich nach einem Tattoo oder Piercing ins Fitnessstudio, schwimmen oder Sport treiben?",
    "x.avoid_heavy_exercise_for_24_48": "Meiden Sie 24 bis 48 Stunden starke Anstrengung, um Schwitzen, Dehnen und Reibung an der frischen Stelle zu vermeiden",
    "x.consult_your_physician_message_draft": "✉️ Ärztin oder Arzt fragen - Nachrichtenentwurf",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Nutzen Sie diese Vorlage für eine E-Mail oder Nachricht an Ihre Ärztin oder Ihren Arzt zu einer sicheren Anpassung der Medikation",
    "x.doctor_or_clinic_name": "Name der Praxis oder Klinik:",
    "x.your_name": "Ihr Name:",
    "x.procedure_location": "Leistung und Körperstelle:",
    "x.appointment_date": "Termindatum:",
    "x.selected_disclosed_medication_s": "Ausgewählte, angegebene Medikamente:",
    "x.no_medications_currently_selected_in_checker": "Derzeit ist im Check kein Medikament ausgewählt.",
    "x.generated_message_draft_editable_customize_your": "Erzeugter Nachrichtenentwurf (bearbeitbar - passen Sie die Nachricht unten an):",
    "x.copy_draft_message": "📋 Entwurf kopieren",
    "x.open_email_app": "✉️ E-Mail-App öffnen",
    "x.print_physician_note": "🖨️ Notiz für die Praxis drucken",
    "x.close": "Schließen",
    "x.studio_emergency_first_aid_protocols": "🚨 Erste-Hilfe-Protokolle im Studio",
    "x.fainting_syncope": "💫 Ohnmacht / Synkope",
    "x.allergic_reaction": "🐝 Allergische Reaktion",
    "x.excessive_bleeding": "🩸 Starke Blutung",
    "x.panic_breathing": "🫁 Panik und Atmung",
    "x.vasovagal_syncope_fainting_protocol": "Protokoll bei vasovagaler Synkope und Ohnmacht",
    "x.common_response_to_sudden_pain_anxiety": "Häufige Reaktion auf plötzlichen Schmerz, Angst oder Unterzuckerung mit vorübergehender Minderdurchblutung des Gehirns",
    "x.stop_procedure_immediately": "Leistung sofort abbrechen:",
    "x.lay_flat_elevate_legs": "Flach hinlegen und Beine hochlagern:",
    "x.cool_ventilate": "Kühlen und lüften:",
    "x.glucose_boost": "Zucker zuführen:",
    "x.acute_allergic_reaction_anaphylaxis": "Akute allergische Reaktion und Anaphylaxie",
    "x.allergic_response_to_topical_numbing_creams": "Allergische Reaktion auf Betäubungscremes, Latexhandschuhe, Schablonenmittel oder Farben.",
    "x.call_emergency_services_now": "SOFORT DEN NOTRUF WÄHLEN:",
    "x.remove_the_trigger": "Auslöser entfernen:",
    "x.keep_them_lying_flat": "Die Person flach liegen lassen:",
    "x.their_own_auto_injector": "Ihr eigener Autoinjektor:",
    "x.stay_with_them": "Bei ihr bleiben:",
    "x.excessive_bleeding_heavy_plasma_oozing": "Starke Blutung und reichlich austretendes Wundwasser",
    "x.triggered_by_recent_nsaids_blood_thinners": "Ausgelöst durch kürzlich eingenommene NSAR, Blutverdünner, Alkohol oder hohen Blutdruck.",
    "x.direct_firm_pressure": "Direkter, fester Druck:",
    "x.elevate_area": "Stelle hochlagern:",
    "x.pressure_wrap": "Druckverband:",
    "x.bright_spurting_blood_call_immediately": "Hellrotes, spritzendes Blut: sofort den Notruf wählen.",
    "x.hyperventilation_acute_panic_attack": "Hyperventilation und akute Panikattacke",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Schnelle, flache Atmung mit Benommenheit, Kribbeln in den Fingern und Verkrampfungen",
    "x.pause_reassure": "Pause machen und beruhigen:",
    "x.4_4_4_box_breathing": "4-4-4-Boxatmung:",
    "x.physical_grounding": "Körperliche Erdung:",
    "x.close_emergency_guide": "Notfallleitfaden schließen",
    "x.immediate_action": "🚨 Sofortmaßnahme",
    "x.search_medication_or_brand_e_g": "Medikament oder Marke suchen (z. B. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "z. B. 72 (bpm)",
    "x.e_g_dr_smith_city_health": "z. B. Dr. Schmidt / Stadtgesundheitszentrum",
    "x.e_g_alex_miller": "z. B. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "z. B. Unterarm-Tattoo / Septum-Piercing",
    "x.type_or_customize_your_physician_inquiry": "Schreiben oder bearbeiten Sie hier Ihre Nachricht an die Praxis...",

    translationNotice: 'Diese Seite wurde aus dem Englischen übersetzt. Wir können nicht garantieren, dass die Übersetzung exakt ist. Wir geben unser Bestes, damit alle sie verstehen können, aber die englische Fassung ist diejenige, die wir als korrekt ansehen - bitte prüfen Sie dort alles Wichtige nach.',
    waitLabel: 'Warte- / Auswaschempfehlung:',
    medUntranslated: 'Einige Angaben zu den Medikamenten oben werden auf Englisch angezeigt - die Übersetzung in diese Sprache ist noch in Arbeit.',
    medSourcesLabel: 'Veröffentlichte Quellen',
    tabSupplements: '🌿 Nahrungsergänzung',
    suppHeading: 'Interaktions-Check für Nahrungsergänzung und Medikamente',
    suppIntro: 'Die meisten Menschen halten Fischöl, Knoblauchkapseln oder Ginkgo nicht für „Medikamente" und erwähnen sie deshalb nie. Zusammen mit einem Blutverdünner oder einem Schmerzmittel erhöhen manche Präparate Blutung und Nässen während der Sitzung. Tragen Sie unten ein, was Sie einnehmen, um zu sehen, was die veröffentlichte Literatur sagt.',
    suppSearchPlaceholder: 'Präparat suchen (z. B. Fischöl, Vitamin E, Kurkuma, Ginseng)...',
    suppEmpty: 'Fügen Sie ein Präparat hinzu, um zu sehen, ob es zusammen mit Ihrem Medikament untersucht wurde.',
    suppStudied: 'wurde auf Wirkungen auf Blutung und Gerinnung untersucht. Auf Grundlage von',
    suppStudies: 'Human- oder klinischen Studien.',
    suppCardFooter: 'Das bedeutet nicht, dass Sie eines von beiden absetzen müssen. Sagen Sie Ihrem Tätowierer oder Piercer, was Sie einnehmen, und klären Sie Unklarheiten mit dem Arzt, der Ihre Medikamente verschrieben hat.',
    suppNoPairs: 'Uns liegen keine veröffentlichten Humanstudien vor, die dieses Präparat mit den hier abgedeckten Medikamenten verbinden. Das ist nicht dasselbe wie „keine Wechselwirkung" - es heißt, dass die Forschung dazu fehlt. Erwähnen Sie es trotzdem.',
    suppUnknownTitle: 'Wir haben keine Daten zu',
    suppUnknownBody: 'Das ist eine Lücke in unserer Datenbank, kein unbedenkliches Ergebnis. Werten Sie es nicht als sicher. Sprechen Sie es bei Ihrem Tätowierer oder Piercer an und bei Ihrem Arzt, wenn Sie zusätzlich verschriebene Medikamente einnehmen.',
    suppClinical: 'Klinische Evidenz',
    suppHuman: 'Humanstudien',
    suppCredit: 'Interaktionsdaten von SUPP.AI (Allen Institute for AI). Es werden nur Human- und klinische Studien gezeigt; zurückgezogene Arbeiten sind ausgeschlossen.',
    geoLangLabel: 'Suchen auf:',
    geoFindStudio: '🎨 Studio in der Nähe finden',
    geoFindDoctor: '🩺 Arzt in der Nähe finden',
    geoFindPharmacy: '💊 Nächste Apotheke',
    geoFindHospital: '🏥 Nächstes Krankenhaus',
    geoNote: 'Diese Links öffnen Google Maps und suchen in der Landessprache Ihres Aufenthaltsorts, was im Ausland weit mehr findet als eine englische Suche. Ihr Standort erreicht uns nie: an Google geht nur ein Suchwort. Ändern Sie oben die Sprache, falls die Erkennung falsch liegt.',
    emergHeadSub: 'Sofortige Schritt-für-Schritt-Anleitungen für das Studiopersonal bei Komplikationen während einer Sitzung.',
    emergCallLabel: 'Rufen Sie zuerst den Rettungsdienst:',
    emergCallConfirm: 'Diese Nummer wird aus der Zeitzone Ihres Geräts abgeleitet und kann falsch sein, etwa hinter einem VPN. Prüfen Sie die richtige Nummer für Ihr Land und halten Sie sie im Studio an der Wand fest.',
    emergDisclaimer: 'Dieser Leitfaden ist eine Gedächtnisstütze für Menschen, die bereits in Erster Hilfe ausgebildet sind. Er ist keine Erste-Hilfe-Ausbildung und ersetzt sie nicht. Rufen Sie zuerst den Rettungsdienst, tun Sie nichts, wofür Sie an Ihrem Arbeitsort nicht ausgebildet und befugt sind, und bleiben Sie bei der Person, bis Hilfe eintrifft.',
    disclaimerTitle: 'Wichtiger Hinweis:',
    disclaimerBody: 'Dieses Tool ist nur eine Bildungsreferenz und stellt keine medizinische Beratung dar. Setzen Sie verschriebene Medikamente niemals ohne Rücksprache mit Ihrem verschreibenden Arzt ab und ändern Sie sie nicht. Informieren Sie Ihren Tätowierer und Piercer immer über alle Medikamente, Gesundheitszustände oder Nahrungsergänzungsmittel, die Sie vor dem Eingriff einnehmen.',
    langLabel: '🌐 Sprache:',
    headerBadge: '💊 Medikamente & Sicherheitsreferenz',
    headerTitle: 'Medikamenten-Interaktions-Checker',
    headerSubtitle: 'Prüfen Sie, wie Medikamente das Blutungsrisiko und die Heilung von Tattoos & Piercings beeinflussen.',
    draftDoctorBtn: '✉️ Nachricht an Arzt entwerfen',
    tabChecker: '🔍 Checker',
    tabBrief: '📄 Künstler-Briefing',
    tabSafety: '🛡️ Studio-Sicherheit',
    tabFaq: '❓ FAQ & Tipps',
    tabReminders: '⏰ Erinnerungen & Karenzzeit',
    searchPlaceholder: 'Medikament suchen (z.B. Ibuprofen, Accutane, Xanax, EMLA)...',
    filterAll: 'Alle',
    filterPain: 'Schmerzmittel & NSAID',
    filterNumbing: 'Betäubungscremes',
    filterBlood: 'Blutverdünner',
    filterRetinoid: 'Akne / Retinoide',
    filterAnxiety: 'Beruhigungsmittel',
    filterHormone: 'Hormone & HRT',
    filterStimulant: 'ADHS & Stimulanzien',
    filterMetabolic: 'Diabetes & GLP-1',
    filterCorticosteroid: 'Kortikosteroide',
    filterImmuno: 'Immunsuppressiva',
    filterSupplement: 'Nahrungsergänzung',
    filterAntibiotic: 'Antibiotika & Antivirale',
    filterSubstance: 'Substanzen & Lebensstil',
    infoNote: '💡 Wählen Sie Ihre Medikamente aus, um Risiken und Vorsichtsmaßnahmen zu sehen.',
    clearAll: 'Alles löschen',
    draftDoctorNoteBtn: '✉️ Arzt-Nachricht',
    viewBriefBtn: '📄 Briefing anzeigen',
    backToTopBtn: '⬆️ Nach Oben',
    backToMedListBtn: '⬆️ Zurück zur Liste'
  },
  nl: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "Hoog risico",
    "x.moderate_concern": "Matig risico",
    "x.low_concern": "Laag risico",
    "x.low_syncope_risk": "Laag syncoperisico",
    "x.moderate_syncope_risk": "Matig syncoperisico",
    "x.elevated_syncope_risk": "⚠️ Verhoogd syncoperisico",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Directe link naar de vragenlijst delen",
    "x.quick_print_summary": "🖨️ Samenvatting om af te drukken",
    "x.trending_inquiries": "🔥 Veelgezochte onderwerpen:",
    "x.advil_ibuprofen": "Advil / Ibuprofen",
    "x.accutane_retinoids": "Accutane / Retinoïden",
    "x.tktx_numbing": "TKTX / Verdovende crème",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Angst",
    "x.cannabis_thc": "Cannabis / THC",
    "x.alcohol_hangover": "Alcohol / Kater",
    "x.aspirin_blood_thinners": "Aspirine / Bloedverdunners",
    "x.recent_searches": "🕒 Recente zoekopdrachten:",
    "x.clear_history": "Geschiedenis wissen",
    "x.share_intake_status": "Status van de gedeelde vragenlijst:",
    "x.copy_shareable_link": "🔗 Deelbare link kopiëren",
    "x.select_all_medications_and_supplements_you": "💡 Selecteer alle medicijnen en supplementen die u gebruikt. De resultaten markeren automatisch",
    "x.client_consultation_brief": "Consultformulier voor de klant",
    "x.a_printable_and_shareable_summary_of": "Een afdrukbare en deelbare samenvatting van de gekozen medicijnen en de aanbevelingen voor de sessie",
    "x.no_medications_selected_yet": "⚠️ Nog geen medicijnen geselecteerd.",
    "x.switch_to_the_interaction_checker": "Ga naar de interactiechecker",
    "x.generate_full_clinic_packet_print": "📄 Volledig klinisch dossier maken (afdrukken)",
    "x.share_deep_link": "🔗 Directe link delen",
    "x.export_data_json": "💾 Gegevens exporteren (JSON)",
    "x.export_text_file": "📄 Tekstbestand exporteren",
    "x.download_pdf_document": "📥 PDF-document downloaden",
    "x.copy_summary": "📋 Samenvatting kopiëren",
    "x.print_brief": "🖨️ Formulier afdrukken",
    "x.expected_healing_journey_timeline": "🩺 Verwacht genezingsverloop",
    "x.tattoo_healing": "🎨 Genezing van de tatoeage",
    "x.piercing_healing": "💎 Genezing van de piercing",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Interactieve tijdlijn van de lichamelijke fasen en de invloed van medicijnen",
    "x.pre_procedure_medication_washout_reminders": "⏰ Medicijnen stoppen vóór de sessie en herinneringen",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Bereken de precieze stopmomenten voor medicijnen (NSAID's, bloedverdunners)",
    "x.scheduled_appointment_date_time": "📅 Datum en tijd van de geplande afspraak:",
    "x.save_compute_washout": "💾 Opslaan en stopmoment berekenen",
    "x.setting_your_appointment_date_computes_live": "Door de afspraakdatum in te vullen starten aftellers die precies laten zien wanneer u moet stoppen met",
    "x.enable_browser_notification_alerts": "🔔 Browsermeldingen inschakelen",
    "x.download_google_calendar_ics_pre_filled": "📅 Google Agenda-.ics downloaden (stopmomenten al ingevuld)",
    "x.open_washout_in_google_calendar_web": "🌐 Stopmomenten openen in Google Agenda",
    "x.export_standard_calendar_ics": "📅 Standaardagenda exporteren (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Zelfbeoordeling van gereedheid voor tatoeëerder en piercer",
    "x.answer_3_quick_questions_about_your": "Beantwoord 3 korte vragen over de sessie van uw klant en de opgegeven medicijnen voor",
    "x.1_what_procedure_is_being_performed": "1. Welke behandeling wordt uitgevoerd?",
    "x.tattoo_body_linework_shading_color": "Tatoeage (lijnwerk op het lichaam / schaduw / kleur)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Permanente make-up (microblading / lip blush / hoofdhuid)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (oorkraakbeen / neus / tepel / lichaam)",
    "x.piercing_oral_lip_tongue": "Piercing (mond / lip / tong)",
    "x.2_disclosed_client_medications_or_topicals": "2. Door de klant opgegeven medicijnen of huidmiddelen? (kruis alles aan wat van toepassing is)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "NSAID's / bloedverdunners (ibuprofen, aspirine, warfarine)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Verdovende crème aangebracht (lidocaïne, epinefrine, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Acne-retinoïden (Accutane) of corticosteroïden",
    "x.blood_pressure_beta_blockers_glp_1": "Bloeddruk / bètablokkers / GLP-1 / stimulerende middelen",
    "x.none_disclosed_healthy": "Geen / opgegeven als gezond",
    "x.3_client_history_physiological_risk_factors": "3. Voorgeschiedenis van de klant en lichamelijke risicofactoren?",
    "x.no_known_fainting_history_or_skin": "Geen bekende flauwvallen of huidproblemen",
    "x.history_of_vasovagal_syncope_fainting_low": "Vasovagale syncope / flauwvallen / lage bloedsuiker in de voorgeschiedenis",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Zeer gevoelige huid / eczeem / snel blauwe plekken",
    "x.first_time_client_high_nervous_tension": "Eerste keer / grote nervositeit",
    "x.studio_safety_guide_progress": "🛡️ Voortgang van de veiligheidsgids",
    "x.0_6_sections_read_0": "0 / 6 hoofdstukken gelezen (0 %)",
    "x.studio_safety_clinical_reference": "🛡️ Studioveiligheid en klinische naslag",
    "x.essential_clinical_reference_for_clients_tattoo": "Onmisbare klinische naslag voor klanten, tatoeëerders en piercers over de omgang",
    "x.1_painkillers_pre_procedure_pain_management": "1. Pijnstillers en pijnbestrijding vóór de sessie",
    "x.clients_often_take_over_the_counter": "Klanten nemen vaak vrij verkrijgbare pijnstillers vóór een sessie. Het is van groot belang",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirine en NSAID's (ibuprofen, naproxen, Nurofen, Aleve):",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracetamol / acetaminofen (Tylenol, Panadol):",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Verdovende crèmes en plaatselijke verdoving",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Verdovende crèmes (lidocaïne, tetracaïne, prilocaïne, TKTX) zijn enorm populair geworden",
    "x.skin_texture_alterations": "Verandering van de huidstructuur:",
    "x.rebound_pain_vasoconstriction": "Rebound-pijn en vaatvernauwing:",
    "x.toxicity_methemoglobinemia_risk": "Toxiciteit en risico op methemoglobinemie:",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Flauwvallen en risicofactoren voor vasovagale syncope",
    "x.vasovagal_syncope_is_a_sudden_drop": "Vasovagale syncope is een plotselinge daling van hartslag en bloeddruk door pijn, nervositeit",
    "x.high_risk_medications": "Medicijnen met een hoog risico:",
    "x.prevention_protocol": "Preventieprotocol:",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Zelfklevende nazorgfolie (Saniderm / Tegaderm) en dunner wordende huid",
    "x.patients_on_topical_retinoids_systemic_steroids": "Wie retinoïden op de huid of systemische steroïden gebruikt, of een dunne huid heeft, loopt een hoog risico",
    "x.in_these_cases_traditional_breathable_cling": "In die gevallen zijn gewone ademende folie of niet-klevende gaasjes met zachte hypoallergene kleefstof",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Bloedoverdraagbare ziekteverwekkers en het voorkomen van kruisbesmetting",
    "x.barrier_protection": "Barrièrebescherming:",
    "x.single_use_cartridges_needles": "Cartridges en naalden voor eenmalig gebruik:",
    "x.sharps_container_disposal": "Afvoer in de naaldencontainer:",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Beleid rond alcohol, cannabis en recreatieve middelen",
    "x.informed_consent_legal_safety": "Geïnformeerde toestemming en juridische veiligheid:",
    "x.physiological_compromise": "Lichamelijke belasting:",
    "x.studio_safety_lifestyle_quiz": "🎮 Quiz over studioveiligheid en leefstijl",
    "x.test_your_studio_safety_medication_iq": "Test uw kennis over studioveiligheid en medicijnen!",
    "x.answer_7_fun_educational_scenarios_about": "Beantwoord 7 leerzame en leuke situaties over alcohol, cannabis, pijnstillers, verdovende crèmes",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Voorbereiding vóór de sessie en rekenhulp voor vasovagale syncope",
    "x.calculate_your_custom_fluid_target_blood": "Bereken uw persoonlijke vochtdoel, uw plan voor de bloedsuiker en de verlaging van het syncoperisico",
    "x.body_weight": "Lichaamsgewicht:",
    "x.lbs": "lb",
    "x.estimated_session_duration": "Geschatte sessieduur:",
    "x.1_hour_piercing_small_tattoo": "1 uur (piercing / kleine tatoeage)",
    "x.2_hours_small_medium_tattoo": "2 uur (kleine / middelgrote tatoeage)",
    "x.3_hours_standard_session": "3 uur (gebruikelijke sessie)",
    "x.4_hours_half_day": "4 uur (halve dag)",
    "x.6_hours_full_day_session": "6 uur (hele dag)",
    "x.8_hours_extended_full_day": "8 uur (verlengde hele dag)",
    "x.procedure_type": "Soort behandeling:",
    "x.tattoo_session_linework_color": "Tatoeagesessie (lijnwerk / kleur)",
    "x.piercing_session_body_ear_oral": "Piercingsessie (lichaam / oor / mond)",
    "x.resting_heart_rate_bpm": "Hartslag in rust (bpm)",
    "x.optional": "(optioneel)",
    "x.blood_pressure_mmhg": "Bloeddruk (mmHg)",
    "x.risk_medication_factors_check_all_that": "Risico- en medicijnfactoren (kruis alles aan wat van toepassing is):",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Gebruikt ADHD-stimulantia (Adderall/Vyvanse/Ritalin)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Gebruikt bètablokkers / bloeddrukmedicatie",
    "x.taking_glp_1_weight_loss_meds": "💫 Gebruikt GLP-1-afslankmedicatie (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Gebruikt angstmedicatie of is eerder flauwgevallen",
    "x.faq_guidelines_progress": "❓ Voortgang van de veelgestelde vragen",
    "x.0_8_faqs_read_0": "0 / 8 vragen gelezen (0 %)",
    "x.frequently_asked_questions": "❓ Veelgestelde vragen",
    "x.should_i_stop_taking_my_prescribed": "Moet ik mijn voorgeschreven medicijnen stoppen vóór een tatoeage of piercing?",
    "x.never_stop_or_adjust_prescribed_medication": "Stop of wijzig voorgeschreven medicatie NOOIT",
    "x.why_is_accutane_isotretinoin_a_complete": "Waarom is Accutane (isotretinoïne) een absolute contra-indicatie?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "Isotretinoïne verandert de celvernieuwing van de huid ingrijpend en maakt de hoornlaag dunner,",
    "x.can_i_smoke_marijuana_or_consume": "Mag ik cannabis roken of THC-edibles nemen vóór mijn tatoeageafspraak?",
    "x.it_is_strongly_discouraged_thc_causes": "Dat wordt sterk afgeraden. THC verwijdt de bloedvaten, verhoogt de hartslag in rust",
    "x.why_shouldn_t_i_drink_alcohol": "Waarom mag ik geen alcohol drinken of een kater hebben op de dag van mijn tatoeage?",
    "x.alcohol_thins_your_blood_and_acts": "Alcohol verdunt het bloed en werkt vochtafdrijvend, waardoor u sterk uitdroogt. Tijdens het tatoeëren",
    "x.how_does_smoking_cigarettes_or_vaping": "Welk effect hebben sigaretten of het dampen van nicotine op een verse piercing of tatoeage?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "Nicotine vernauwt de kleinste bloedvaten sterk. Het laat fijne haarvaten krimpen",
    "x.can_i_drink_coffee_or_energy": "Mag ik koffie of energiedrank drinken vóór mijn sessie?",
    "x.limit_high_caffeine_intake_right_before": "Beperk cafeïne vlak voor uw sessie. Cafeïne verhoogt de hartslag in rust en",
    "x.what_should_i_bring_to_my": "Wat moet ik meenemen naar de afspraak als ik dagelijks medicijnen gebruik?",
    "x.bring_a_complete_list_of_your": "Neem een volledige lijst van uw medicijnen mee (of gebruik ons consultformulier), informeer uw",
    "x.can_i_take_ibuprofen_or_aspirin": "Mag ik vóór de afspraak ibuprofen of aspirine nemen tegen de pijn?",
    "x.it_is_strongly_recommended_to_avoid": "Het wordt sterk aangeraden NSAID's (ibuprofen, naproxen) en aspirine 24 tot 48 uur vooraf te vermijden",
    "x.can_i_go_to_the_gym": "Mag ik sporten, zwemmen of naar de sportschool na een tatoeage of piercing?",
    "x.avoid_heavy_exercise_for_24_48": "Vermijd zware inspanning gedurende 24 tot 48 uur om overmatig zweten, rekken of wrijving op de verse plek te voorkomen",
    "x.consult_your_physician_message_draft": "✉️ Uw arts raadplegen - conceptbericht",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Gebruik dit sjabloon voor een e-mail of bericht aan uw arts over een veilige aanpassing van uw medicatie",
    "x.doctor_or_clinic_name": "Naam van de arts of praktijk:",
    "x.your_name": "Uw naam:",
    "x.procedure_location": "Behandeling en plek:",
    "x.appointment_date": "Datum van de afspraak:",
    "x.selected_disclosed_medication_s": "Geselecteerde, opgegeven medicijnen:",
    "x.no_medications_currently_selected_in_checker": "Er is nu geen medicijn geselecteerd in de checker.",
    "x.generated_message_draft_editable_customize_your": "Gegenereerd conceptbericht (aanpasbaar - pas het bericht hieronder aan):",
    "x.copy_draft_message": "📋 Concept kopiëren",
    "x.open_email_app": "✉️ E-mailprogramma openen",
    "x.print_physician_note": "🖨️ Notitie voor de arts afdrukken",
    "x.close": "Sluiten",
    "x.studio_emergency_first_aid_protocols": "🚨 EHBO-protocollen voor de studio",
    "x.fainting_syncope": "💫 Flauwvallen / syncope",
    "x.allergic_reaction": "🐝 Allergische reactie",
    "x.excessive_bleeding": "🩸 Overmatige bloeding",
    "x.panic_breathing": "🫁 Paniek en ademhaling",
    "x.vasovagal_syncope_fainting_protocol": "Protocol bij vasovagale syncope en flauwvallen",
    "x.common_response_to_sudden_pain_anxiety": "Veelvoorkomende reactie op plotselinge pijn, angst of lage bloedsuiker, met tijdelijk verminderde doorbloeding van de hersenen",
    "x.stop_procedure_immediately": "Stop de behandeling onmiddellijk:",
    "x.lay_flat_elevate_legs": "Leg de persoon plat neer en leg de benen hoog:",
    "x.cool_ventilate": "Koelen en luchten:",
    "x.glucose_boost": "Suiker toedienen:",
    "x.acute_allergic_reaction_anaphylaxis": "Acute allergische reactie en anafylaxie",
    "x.allergic_response_to_topical_numbing_creams": "Allergische reactie op verdovende crèmes, latex handschoenen, sjabloonmiddelen of inkten.",
    "x.call_emergency_services_now": "BEL NU 112:",
    "x.remove_the_trigger": "Verwijder de oorzaak:",
    "x.keep_them_lying_flat": "Laat de persoon plat liggen:",
    "x.their_own_auto_injector": "Zijn of haar eigen auto-injector:",
    "x.stay_with_them": "Blijf erbij:",
    "x.excessive_bleeding_heavy_plasma_oozing": "Overmatige bloeding en sterk lekkend wondvocht",
    "x.triggered_by_recent_nsaids_blood_thinners": "Veroorzaakt door recent gebruik van NSAID's of bloedverdunners, alcohol of hoge bloeddruk.",
    "x.direct_firm_pressure": "Directe, stevige druk:",
    "x.elevate_area": "Leg de plek hoog:",
    "x.pressure_wrap": "Drukverband:",
    "x.bright_spurting_blood_call_immediately": "Helderrood, spuitend bloed: bel onmiddellijk.",
    "x.hyperventilation_acute_panic_attack": "Hyperventilatie en acute paniekaanval",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Snelle, oppervlakkige ademhaling met duizeligheid, tintelende vingers en spierkrampen",
    "x.pause_reassure": "Pauzeer en stel gerust:",
    "x.4_4_4_box_breathing": "4-4-4-boxademhaling:",
    "x.physical_grounding": "Lichamelijke aarding:",
    "x.close_emergency_guide": "Noodgids sluiten",
    "x.immediate_action": "🚨 Onmiddellijk handelen",
    "x.search_medication_or_brand_e_g": "Zoek een medicijn of merk (bijv. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "bijv. 72 (bpm)",
    "x.e_g_dr_smith_city_health": "bijv. dr. De Vries / Gezondheidscentrum",
    "x.e_g_alex_miller": "bijv. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "bijv. onderarmtatoeage / septumpiercing",
    "x.type_or_customize_your_physician_inquiry": "Typ of pas hier uw bericht aan de arts aan...",

    translationNotice: 'Deze pagina is uit het Engels vertaald. Wij kunnen niet garanderen dat de vertaling exact is. Wij doen ons best zodat iedereen het kan begrijpen, maar de Engelse versie is degene die wij als juist beschouwen - controleer daar alles wat belangrijk is.',
    waitLabel: 'Wacht- / uitwasadvies:',
    medUntranslated: 'Sommige medicatiegegevens hierboven worden in het Engels getoond - de vertaling naar deze taal is nog bezig.',
    medSourcesLabel: 'Gepubliceerde bronnen',
    tabSupplements: '🌿 Supplementen',
    suppHeading: 'Interactiecheck voor supplementen en medicijnen',
    suppIntro: 'De meeste mensen zien visolie, knoflookcapsules of ginkgo niet als "medicijn" en noemen ze daarom nooit. Samen met een bloedverdunner of een pijnstiller verhogen sommige supplementen bloeding en vochtafscheiding tijdens de sessie. Voeg hieronder toe wat u gebruikt om te zien wat de gepubliceerde literatuur zegt.',
    suppSearchPlaceholder: 'Zoek een supplement (bijv. visolie, vitamine E, kurkuma, ginseng)...',
    suppEmpty: 'Voeg een supplement toe om te zien of het samen met uw medicijn is onderzocht.',
    suppStudied: 'is onderzocht op effecten op bloeding en stolling. Op basis van',
    suppStudies: 'humane of klinische studies.',
    suppCardFooter: 'Dit betekent niet dat u met een van beide moet stoppen. Vertel uw tatoeëerder of piercer wat u gebruikt, en bespreek twijfels met de arts die uw medicatie heeft voorgeschreven.',
    suppNoPairs: 'Wij hebben geen gepubliceerde humane studies die dit supplement koppelen aan de medicijnen die deze tool behandelt. Dat is niet hetzelfde als "geen interactie" - het betekent dat het onderzoek ontbreekt. Noem het toch bij uw specialist.',
    suppUnknownTitle: 'Wij hebben geen gegevens over',
    suppUnknownBody: 'Dit is een hiaat in onze bibliotheek, geen schone uitslag. Lees het niet als veilig. Bespreek het met uw tatoeëerder of piercer, en met uw arts als u ook voorgeschreven medicatie gebruikt.',
    suppClinical: 'Klinisch bewijs',
    suppHuman: 'Humane studies',
    suppCredit: 'Interactiegegevens van SUPP.AI (Allen Institute for AI). Alleen humane en klinische studies worden getoond; teruggetrokken artikelen zijn uitgesloten.',
    geoLangLabel: 'Zoeken in:',
    geoFindStudio: '🎨 Studio in de buurt zoeken',
    geoFindDoctor: '🩺 Arts in de buurt zoeken',
    geoFindPharmacy: '💊 Dichtstbijzijnde apotheek',
    geoFindHospital: '🏥 Dichtstbijzijnde ziekenhuis',
    geoNote: 'Deze links openen Google Maps en zoeken in de taal van het land waar je bent. Dat levert in het buitenland veel meer op dan een Engelse zoekopdracht. Je locatie bereikt ons nooit: naar Google gaat alleen een zoekwoord. Wijzig hierboven de taal als de detectie ernaast zit.',
    emergHeadSub: 'Directe stap-voor-stap handelingsgidsen voor studiomedewerkers bij complicaties tijdens een sessie.',
    emergCallLabel: 'Bel eerst de hulpdiensten:',
    emergCallConfirm: 'Dit nummer is afgeleid van de tijdzone van je apparaat en kan verkeerd zijn, bijvoorbeeld achter een VPN. Controleer het juiste nummer voor jouw land en hang het in de studio aan de muur.',
    emergDisclaimer: 'Deze gids is een geheugensteun voor mensen die al EHBO-geschoold zijn. Het is geen EHBO-opleiding en vervangt die niet. Bel eerst de hulpdiensten, doe niets waarvoor je op je werkplek niet geschoold en bevoegd bent, en blijf bij de persoon tot er hulp is.',
    disclaimerTitle: 'Belangrijke disclaimer:',
    disclaimerBody: 'Deze tool is alleen een educatieve referentie en vormt geen medisch advies. Stop of wijzig voorgeschreven medicatie nooit zonder overleg met uw voorschrijvend arts. Informeer uw tatoeëerder en piercer altijd over alle medicijnen, gezondheidsproblemen of supplementen die u gebruikt vóór de behandeling.',
    langLabel: '🌐 Taal:',
    headerBadge: '💊 Medicatie & Veiligheidsreferentie',
    headerTitle: 'Medicatie Interactie Checker',
    headerSubtitle: 'Controleer hoe medicijnen de bloedingsrisico\'s en genezing van tatoeages en piercings beïnvloeden.',
    draftDoctorBtn: '✉️ Bericht voor arts opstellen',
    tabChecker: '🔍 Checker',
    tabBrief: '📄 Artiest Briefing',
    tabSafety: '🛡️ Studio Veiligheid',
    tabFaq: '❓ Veelgestelde Vragen',
    tabReminders: '⏰ Herinneringen & Stopperiode',
    searchPlaceholder: 'Zoek medicijn (bijv. Ibuprofen, Accutane, Xanax, EMLA)...',
    filterAll: 'Alles',
    filterPain: 'Pijnstillers & NSAID\'s',
    filterNumbing: 'Verdovingscremes',
    filterBlood: 'Bloedverdunners',
    filterRetinoid: 'Acne / Retinoïden',
    filterAnxiety: 'Kalmeringsmiddelen',
    filterHormone: 'Hormonen & HST',
    filterStimulant: 'ADHD & Stimulantia',
    filterMetabolic: 'Diabetes & GLP-1',
    filterCorticosteroid: 'Corticosteroïden',
    filterImmuno: 'Immunosuppressiva',
    filterSupplement: 'Supplementen',
    filterAntibiotic: 'Antibiotica & Antiviraal',
    filterSubstance: 'Middelen & Levensstijl',
    infoNote: '💡 Selecteer uw medicijnen om risico\'s en adviezen te bekijken.',
    clearAll: 'Alles wissen',
    draftDoctorNoteBtn: '✉️ Bericht voor arts',
    viewBriefBtn: '📄 Bekijk Briefing',
    backToTopBtn: '⬆️ Naar Boven',
    backToMedListBtn: '⬆️ Terug naar Lijst'
  },
  pt: {
    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.high_concern": "Preocupação elevada",
    "x.moderate_concern": "Preocupação moderada",
    "x.low_concern": "Preocupação baixa",
    "x.low_syncope_risk": "Risco de síncope baixo",
    "x.moderate_syncope_risk": "Risco de síncope moderado",
    "x.elevated_syncope_risk": "⚠️ Risco de síncope elevado",

    // --- keyed from the markup 2026-09-02, see i18n-new-keys.en.json ---
    "x.share_intake_deep_link": "📲 Partilhar a ligação direta ao questionário",
    "x.quick_print_summary": "🖨️ Resumo para imprimir",
    "x.trending_inquiries": "🔥 Pesquisas frequentes:",
    "x.advil_ibuprofen": "Advil / Ibuprofeno",
    "x.accutane_retinoids": "Accutane / Retinoides",
    "x.tktx_numbing": "TKTX / Creme anestésico",
    "x.ozempic_glp_1": "Ozempic / GLP-1",
    "x.xanax_anxiety": "Xanax / Ansiedade",
    "x.cannabis_thc": "Canábis / THC",
    "x.alcohol_hangover": "Álcool / Ressaca",
    "x.aspirin_blood_thinners": "Aspirina / Anticoagulantes",
    "x.recent_searches": "🕒 Pesquisas recentes:",
    "x.clear_history": "Limpar o histórico",
    "x.share_intake_status": "Estado da partilha do questionário:",
    "x.copy_shareable_link": "🔗 Copiar a ligação de partilha",
    "x.select_all_medications_and_supplements_you": "💡 Selecione todos os medicamentos e suplementos que toma. Os resultados destacarão automaticamente",
    "x.client_consultation_brief": "Ficha de consulta do cliente",
    "x.a_printable_and_shareable_summary_of": "Um resumo imprimível e partilhável dos medicamentos selecionados e das recomendações para a sessão",
    "x.no_medications_selected_yet": "⚠️ Ainda não foi selecionado qualquer medicamento.",
    "x.switch_to_the_interaction_checker": "Ir para o verificador de interações",
    "x.generate_full_clinic_packet_print": "📄 Gerar o dossiê clínico completo (impressão)",
    "x.share_deep_link": "🔗 Partilhar a ligação direta",
    "x.export_data_json": "💾 Exportar os dados (JSON)",
    "x.export_text_file": "📄 Exportar um ficheiro de texto",
    "x.download_pdf_document": "📥 Transferir o documento PDF",
    "x.copy_summary": "📋 Copiar o resumo",
    "x.print_brief": "🖨️ Imprimir a ficha",
    "x.expected_healing_journey_timeline": "🩺 Percurso de cicatrização previsto",
    "x.tattoo_healing": "🎨 Cicatrização da tatuagem",
    "x.piercing_healing": "💎 Cicatrização do piercing",
    "x.interactive_timeline_mapping_physiological_milestones_and": "Cronologia interativa das etapas fisiológicas e dos efeitos dos medicamentos",
    "x.pre_procedure_medication_washout_reminders": "⏰ Suspensão de medicamentos antes da sessão e lembretes",
    "x.calculate_precise_discontinuation_deadlines_for_medications": "Calcule os prazos exatos de suspensão dos medicamentos (AINEs, anticoagulantes)",
    "x.scheduled_appointment_date_time": "📅 Data e hora da marcação prevista:",
    "x.save_compute_washout": "💾 Guardar e calcular a suspensão",
    "x.setting_your_appointment_date_computes_live": "Indicar a data da marcação inicia contagens decrescentes que mostram exatamente quando parar de tomar",
    "x.enable_browser_notification_alerts": "🔔 Ativar as notificações do navegador",
    "x.download_google_calendar_ics_pre_filled": "📅 Transferir o ficheiro .ics do Google Agenda (prazos de suspensão preenchidos)",
    "x.open_washout_in_google_calendar_web": "🌐 Abrir os prazos de suspensão no Google Agenda",
    "x.export_standard_calendar_ics": "📅 Exportar um calendário padrão (.ics)",
    "x.artist_piercer_readiness_self_assessment": "🎯 Autoavaliação de preparação do tatuador e do body piercer",
    "x.answer_3_quick_questions_about_your": "Responda a 3 perguntas rápidas sobre a sessão do seu cliente e os medicamentos declarados para obter",
    "x.1_what_procedure_is_being_performed": "1. Que procedimento vai ser realizado?",
    "x.tattoo_body_linework_shading_color": "Tatuagem (traço no corpo / sombreado / cor)",
    "x.cosmetic_tattoo_microblading_lip_blush_scalp": "Maquilhagem permanente (microblading / lip blush / couro cabeludo)",
    "x.piercing_ear_cartilage_nose_nipple_body": "Piercing (cartilagem da orelha / nariz / mamilo / corpo)",
    "x.piercing_oral_lip_tongue": "Piercing (oral / lábio / língua)",
    "x.2_disclosed_client_medications_or_topicals": "2. Medicamentos ou produtos tópicos declarados pelo cliente? (assinale tudo o que se aplica)",
    "x.nsaids_blood_thinners_ibuprofen_aspirin_warfarin": "AINEs / anticoagulantes (ibuprofeno, aspirina, varfarina)",
    "x.numbing_cream_applied_lidocaine_epinephrine_tktx": "Creme anestésico aplicado (lidocaína, epinefrina, TKTX)",
    "x.acne_retinoids_accutane_or_corticosteroids": "Retinoides para a acne (Accutane) ou corticosteroides",
    "x.blood_pressure_beta_blockers_glp_1": "Tensão arterial / betabloqueantes / GLP-1 / estimulantes",
    "x.none_disclosed_healthy": "Nenhum / declarado saudável",
    "x.3_client_history_physiological_risk_factors": "3. Antecedentes do cliente e fatores de risco fisiológicos?",
    "x.no_known_fainting_history_or_skin": "Sem antecedentes conhecidos de desmaio nem problemas de pele",
    "x.history_of_vasovagal_syncope_fainting_low": "Antecedentes de síncope vasovagal / desmaio / hipoglicemia",
    "x.extremely_sensitive_skin_eczema_easy_bruising": "Pele muito sensível / eczema / nódoas negras fáceis",
    "x.first_time_client_high_nervous_tension": "Primeira vez / grande tensão nervosa",
    "x.studio_safety_guide_progress": "🛡️ Progresso do guia de segurança do estúdio",
    "x.0_6_sections_read_0": "0 / 6 secções lidas (0 %)",
    "x.studio_safety_clinical_reference": "🛡️ Segurança do estúdio e referência clínica",
    "x.essential_clinical_reference_for_clients_tattoo": "Referência clínica essencial para clientes, tatuadores e body piercers sobre a gestão",
    "x.1_painkillers_pre_procedure_pain_management": "1. Analgésicos e gestão da dor antes da sessão",
    "x.clients_often_take_over_the_counter": "Os clientes tomam muitas vezes analgésicos de venda livre antes de uma sessão. É fundamental",
    "x.aspirin_nsaids_ibuprofen_naproxen_nurofen_aleve": "Aspirina e AINEs (ibuprofeno, naproxeno, Nurofen, Aleve):",
    "x.paracetamol_acetaminophen_tylenol_panadol": "Paracetamol / acetaminofeno (Tylenol, Panadol):",
    "x.2_topical_numbing_creams_local_anaesthetics": "2. Cremes anestésicos tópicos e anestésicos locais",
    "x.numbing_creams_lidocaine_tetracaine_prilocaine_tktx": "Os cremes anestésicos (lidocaína, tetracaína, prilocaína, TKTX) tornaram-se muito populares",
    "x.skin_texture_alterations": "Alterações da textura da pele:",
    "x.rebound_pain_vasoconstriction": "Dor de rebound e vasoconstrição:",
    "x.toxicity_methemoglobinemia_risk": "Toxicidade e risco de metemoglobinemia:",
    "x.3_fainting_vasovagal_syncope_risk_factors": "3. Desmaio e fatores de risco de síncope vasovagal",
    "x.vasovagal_syncope_is_a_sudden_drop": "A síncope vasovagal é uma queda súbita da frequência cardíaca e da tensão provocada por dor, tensão nervosa",
    "x.high_risk_medications": "Medicamentos de risco elevado:",
    "x.prevention_protocol": "Protocolo de prevenção:",
    "x.4_adhesive_aftercare_bandages_saniderm_tegaderm": "4. Pensos adesivos de cuidado (Saniderm / Tegaderm) e afinamento da pele",
    "x.patients_on_topical_retinoids_systemic_steroids": "Quem usa retinoides tópicos, corticosteroides sistémicos ou tem pele fina corre risco elevado",
    "x.in_these_cases_traditional_breathable_cling": "Nestes casos, a película respirável tradicional ou as compressas não aderentes com adesivo hipoalergénico suave",
    "x.5_bloodborne_pathogens_cross_contamination_containment": "5. Agentes patogénicos transmitidos pelo sangue e prevenção da contaminação cruzada",
    "x.barrier_protection": "Proteção de barreira:",
    "x.single_use_cartridges_needles": "Cartuchos e agulhas de utilização única:",
    "x.sharps_container_disposal": "Eliminação em contentor de cortoperfurantes:",
    "x.6_alcohol_cannabis_recreational_substance_intake": "6. Política sobre álcool, canábis e substâncias recreativas",
    "x.informed_consent_legal_safety": "Consentimento informado e segurança jurídica:",
    "x.physiological_compromise": "Comprometimento fisiológico:",
    "x.studio_safety_lifestyle_quiz": "🎮 Questionário de segurança do estúdio e estilo de vida",
    "x.test_your_studio_safety_medication_iq": "Teste os seus conhecimentos sobre segurança e medicamentos!",
    "x.answer_7_fun_educational_scenarios_about": "Responda a 7 situações divertidas e educativas sobre álcool, canábis, analgésicos, cremes anestésicos",
    "x.pre_session_prep_vasovagal_syncope_calculator": "💧 Preparação antes da sessão e calculadora de síncope vasovagal",
    "x.calculate_your_custom_fluid_target_blood": "Calcule o seu objetivo personalizado de hidratação, o plano de glicemia e a redução do risco de síncope",
    "x.body_weight": "Peso corporal:",
    "x.lbs": "lb",
    "x.estimated_session_duration": "Duração estimada da sessão:",
    "x.1_hour_piercing_small_tattoo": "1 hora (piercing / tatuagem pequena)",
    "x.2_hours_small_medium_tattoo": "2 horas (tatuagem pequena / média)",
    "x.3_hours_standard_session": "3 horas (sessão padrão)",
    "x.4_hours_half_day": "4 horas (meio dia)",
    "x.6_hours_full_day_session": "6 horas (dia inteiro)",
    "x.8_hours_extended_full_day": "8 horas (dia inteiro prolongado)",
    "x.procedure_type": "Tipo de procedimento:",
    "x.tattoo_session_linework_color": "Sessão de tatuagem (traço / cor)",
    "x.piercing_session_body_ear_oral": "Sessão de piercing (corpo / orelha / oral)",
    "x.resting_heart_rate_bpm": "Frequência cardíaca em repouso (bpm)",
    "x.optional": "(opcional)",
    "x.blood_pressure_mmhg": "Tensão arterial (mmHg)",
    "x.risk_medication_factors_check_all_that": "Fatores de risco e medicação (assinale tudo o que se aplica):",
    "x.taking_adhd_stimulants_adderall_vyvanse_ritalin": "⚡ Toma estimulantes para a PHDA (Adderall/Vyvanse/Ritalina)",
    "x.taking_beta_blockers_blood_pressure_meds": "❤️ Toma betabloqueantes / medicação para a tensão",
    "x.taking_glp_1_weight_loss_meds": "💫 Toma medicação GLP-1 para emagrecer (Ozempic/Mounjaro)",
    "x.taking_anxiety_meds_or_history_of": "⬇️ Toma ansiolíticos ou tem antecedentes de desmaio",
    "x.faq_guidelines_progress": "❓ Progresso das perguntas frequentes",
    "x.0_8_faqs_read_0": "0 / 8 perguntas lidas (0 %)",
    "x.frequently_asked_questions": "❓ Perguntas frequentes",
    "x.should_i_stop_taking_my_prescribed": "Devo suspender a minha medicação prescrita antes de uma tatuagem ou de um piercing?",
    "x.never_stop_or_adjust_prescribed_medication": "NUNCA suspenda nem altere medicação prescrita",
    "x.why_is_accutane_isotretinoin_a_complete": "Porque é que o Accutane (isotretinoína) é uma contraindicação absoluta?",
    "x.isotretinoin_fundamentally_alters_skin_cell_turnover": "A isotretinoína altera profundamente a renovação celular da pele e torna o estrato córneo mais fino,",
    "x.can_i_smoke_marijuana_or_consume": "Posso fumar canábis ou consumir comestíveis com THC antes da marcação da tatuagem?",
    "x.it_is_strongly_discouraged_thc_causes": "É fortemente desaconselhado. O THC provoca vasodilatação (abertura dos vasos), aumenta a frequência cardíaca em repouso",
    "x.why_shouldn_t_i_drink_alcohol": "Porque não devo beber álcool nem ter ressaca no dia da tatuagem?",
    "x.alcohol_thins_your_blood_and_acts": "O álcool fluidifica o sangue e funciona como diurético, desidratando-o gravemente. Durante a tatuagem,",
    "x.how_does_smoking_cigarettes_or_vaping": "Qual é o efeito dos cigarros ou do vaping de nicotina num piercing ou numa tatuagem recente?",
    "x.nicotine_is_a_powerful_microvascular_vasoconstrictor": "A nicotina é um potente vasoconstritor microvascular. Contrai os capilares mais finos",
    "x.can_i_drink_coffee_or_energy": "Posso beber café ou bebidas energéticas antes da sessão?",
    "x.limit_high_caffeine_intake_right_before": "Limite a cafeína mesmo antes da sessão. A cafeína aumenta o ritmo cardíaco em repouso e",
    "x.what_should_i_bring_to_my": "O que devo levar à marcação se tomo medicamentos diários?",
    "x.bring_a_complete_list_of_your": "Leve a lista completa dos seus medicamentos (ou use a nossa ficha de consulta), informe o seu",
    "x.can_i_take_ibuprofen_or_aspirin": "Posso tomar ibuprofeno ou aspirina antes da marcação para a dor?",
    "x.it_is_strongly_recommended_to_avoid": "Recomenda-se vivamente evitar AINEs (ibuprofeno, naproxeno) e aspirina 24 a 48 horas antes",
    "x.can_i_go_to_the_gym": "Posso ir ao ginásio, nadar ou fazer exercício depois de uma tatuagem ou de um piercing?",
    "x.avoid_heavy_exercise_for_24_48": "Evite exercício intenso durante 24 a 48 horas para não transpirar em excesso nem esticar ou friccionar a zona recente",
    "x.consult_your_physician_message_draft": "✉️ Consultar o seu médico - rascunho de mensagem",
    "x.text": "&times;",
    "x.use_this_template_to_draft_an": "Use este modelo para escrever um e-mail ou mensagem ao seu médico sobre um ajuste seguro da medicação",
    "x.doctor_or_clinic_name": "Nome do médico ou da clínica:",
    "x.your_name": "O seu nome:",
    "x.procedure_location": "Procedimento e zona:",
    "x.appointment_date": "Data da marcação:",
    "x.selected_disclosed_medication_s": "Medicamento(s) selecionado(s) e declarado(s):",
    "x.no_medications_currently_selected_in_checker": "Não há qualquer medicamento selecionado no verificador.",
    "x.generated_message_draft_editable_customize_your": "Rascunho de mensagem gerado (editável - personalize a mensagem abaixo):",
    "x.copy_draft_message": "📋 Copiar o rascunho",
    "x.open_email_app": "✉️ Abrir a aplicação de e-mail",
    "x.print_physician_note": "🖨️ Imprimir a nota para o médico",
    "x.close": "Fechar",
    "x.studio_emergency_first_aid_protocols": "🚨 Protocolos de primeiros socorros do estúdio",
    "x.fainting_syncope": "💫 Desmaio / síncope",
    "x.allergic_reaction": "🐝 Reação alérgica",
    "x.excessive_bleeding": "🩸 Hemorragia excessiva",
    "x.panic_breathing": "🫁 Pânico e respiração",
    "x.vasovagal_syncope_fainting_protocol": "Protocolo para síncope vasovagal e desmaio",
    "x.common_response_to_sudden_pain_anxiety": "Reação frequente a dor súbita, ansiedade ou hipoglicemia, que provoca hipoperfusão cerebral passageira",
    "x.stop_procedure_immediately": "Pare o procedimento de imediato:",
    "x.lay_flat_elevate_legs": "Deite a pessoa e eleve-lhe as pernas:",
    "x.cool_ventilate": "Arrefeça e areje:",
    "x.glucose_boost": "Reforço de glicose:",
    "x.acute_allergic_reaction_anaphylaxis": "Reação alérgica aguda e anafilaxia",
    "x.allergic_response_to_topical_numbing_creams": "Reação alérgica a cremes anestésicos, luvas de látex, produtos de estêncil ou tintas.",
    "x.call_emergency_services_now": "LIGUE JÁ PARA A EMERGÊNCIA:",
    "x.remove_the_trigger": "Retire o agente desencadeante:",
    "x.keep_them_lying_flat": "Mantenha a pessoa deitada:",
    "x.their_own_auto_injector": "O autoinjetor da própria pessoa:",
    "x.stay_with_them": "Fique junto dela:",
    "x.excessive_bleeding_heavy_plasma_oozing": "Hemorragia excessiva e exsudação abundante de plasma",
    "x.triggered_by_recent_nsaids_blood_thinners": "Provocada por AINEs ou anticoagulantes recentes, álcool ou tensão alta.",
    "x.direct_firm_pressure": "Pressão direta e firme:",
    "x.elevate_area": "Eleve a zona:",
    "x.pressure_wrap": "Penso compressivo:",
    "x.bright_spurting_blood_call_immediately": "Sangue vermelho vivo e em jato: ligue de imediato.",
    "x.hyperventilation_acute_panic_attack": "Hiperventilação e ataque de pânico agudo",
    "x.rapid_shallow_breathing_causing_lightheadedness_tingling": "Respiração rápida e superficial que provoca tonturas, formigueiro nos dedos e contraturas",
    "x.pause_reassure": "Faça uma pausa e tranquilize:",
    "x.4_4_4_box_breathing": "Respiração quadrada 4-4-4:",
    "x.physical_grounding": "Ancoragem física:",
    "x.close_emergency_guide": "Fechar o guia de emergência",
    "x.immediate_action": "🚨 Ação imediata",
    "x.search_medication_or_brand_e_g": "Procurar um medicamento ou marca (p. ex. Advil, Accutane, Xanax, EMLA, Ozempic)...",
    "x.e_g_72_bpm": "p. ex. 72 (bpm)",
    "x.e_g_dr_smith_city_health": "p. ex. Dr. Silva / Centro de Saúde da cidade",
    "x.e_g_alex_miller": "p. ex. Alex Miller",
    "x.e_g_forearm_tattoo_septum_piercing": "p. ex. tatuagem no antebraço / piercing no septo",
    "x.type_or_customize_your_physician_inquiry": "Escreva ou personalize aqui a sua mensagem para o médico...",

    translationNotice: 'Esta página foi traduzida do inglês. Não podemos garantir que a tradução seja exata. Fazemos o nosso melhor para que todos possam compreender, mas a versão inglesa é aquela que consideramos correta: verifique nela qualquer ponto importante.',
    waitLabel: 'Recomendação de espera / eliminação:',
    medUntranslated: 'Alguns detalhes sobre os medicamentos acima são mostrados em inglês: a tradução para este idioma ainda está em curso.',
    medSourcesLabel: 'Fontes publicadas',
    tabSupplements: '🌿 Suplementos',
    suppHeading: 'Verificador de interações entre suplementos e medicamentos',
    suppIntro: 'A maioria das pessoas não considera o óleo de peixe, as cápsulas de alho ou o ginkgo como «medicação», por isso nunca os menciona. Tomados com um anticoagulante ou um analgésico, alguns suplementos aumentam a hemorragia e o exsudado durante a sessão. Adicione o que toma para ver o que diz a literatura publicada.',
    suppSearchPlaceholder: 'Procurar um suplemento (ex. óleo de peixe, vitamina E, curcuma, ginseng)...',
    suppEmpty: 'Adicione um suplemento para ver se foi estudado juntamente com o seu medicamento.',
    suppStudied: 'foi estudado quanto a efeitos na hemorragia e na coagulação. Com base em',
    suppStudies: 'estudos humanos ou clínicos.',
    suppCardFooter: 'Isto não significa que tenha de parar qualquer um deles. Diga ao seu tatuador ou body piercer o que toma e esclareça qualquer dúvida com o médico que lhe prescreveu a medicação.',
    suppNoPairs: 'Não dispomos de estudos humanos publicados que liguem este suplemento aos medicamentos abrangidos por esta ferramenta. Isso não é o mesmo que «nenhuma interação» - significa que não há investigação para citar. Mencione-o na mesma.',
    suppUnknownTitle: 'Não temos dados sobre',
    suppUnknownBody: 'Isto é uma lacuna da nossa biblioteca, não um resultado tranquilizador. Não o interprete como seguro. Fale disso com o seu tatuador ou body piercer, e com o seu médico se também toma medicação prescrita.',
    suppClinical: 'Evidência clínica',
    suppHuman: 'Estudos humanos',
    suppCredit: 'Dados de interação da SUPP.AI (Allen Institute for AI). São mostrados apenas estudos humanos e clínicos; artigos retratados são excluídos.',
    geoLangLabel: 'Pesquisar em:',
    geoFindStudio: '🎨 Encontrar um estúdio perto',
    geoFindDoctor: '🩺 Encontrar um médico perto',
    geoFindPharmacy: '💊 Farmácia mais próxima',
    geoFindHospital: '🏥 Hospital mais próximo',
    geoNote: 'Estas ligações abrem o Google Maps e pesquisam na língua do local onde está, o que encontra muito mais do que uma pesquisa em inglês no estrangeiro. A sua localização nunca chega até nós: para a Google vai apenas uma palavra de pesquisa. Mude a língua acima se a deteção estiver errada.',
    emergHeadSub: 'Guias de atuação imediata, passo a passo, para o pessoal do estudio perante complicações durante uma sessão.',
    emergCallLabel: 'Ligue primeiro para a emergência:',
    emergCallConfirm: 'Este número é deduzido do fuso horário do seu dispositivo e pode estar errado, por exemplo atrás de uma VPN. Confirme o número correto do seu país e mantenha-o escrito na parede do estúdio.',
    emergDisclaimer: 'Este guia é um lembrete para quem já tem formação em primeiros socorros. Não é formação em primeiros socorros nem a substitui. Ligue primeiro para a emergência, não faça nada para que não esteja formado e autorizado onde trabalha, e fique junto da pessoa até a ajuda chegar.',
    disclaimerTitle: 'Aviso importante:',
    disclaimerBody: 'Esta ferramenta é apenas uma referência educativa e não constitui aconselhamento médico. Nunca pare nem ajuste medicamentos prescritos sem consultar o médico que os prescreveu. Informe sempre o seu tatuador e o seu body piercer sobre quaisquer medicamentos, problemas de saúde ou suplementos que esteja a tomar antes do procedimento.',
    langLabel: '🌐 Idioma:',
    headerBadge: '💊 Referência de Medicamentos e Segurança',
    headerTitle: 'Verificador de Interação Medicamentosa',
    headerSubtitle: 'Verifique como medicamentos afetam o risco de sangramento e a cicatrização de tatuagens e piercings.',
    draftDoctorBtn: '✉️ Rascunhar mensagem para o médico',
    tabChecker: '🔍 Verificador',
    tabBrief: '📄 Relatório para o Artista',
    tabSafety: '🛡️ Segurança no Estúdio',
    tabFaq: '❓ Perguntas Frecuentes',
    tabReminders: '⏰ Lembretes & Suspensão',
    searchPlaceholder: 'Buscar medicamento (ex. Ibuprofeno, Accutane, Xanax, EMLA)...',
    filterAll: 'Todos',
    filterPain: 'Analgésicos e AINEs',
    filterNumbing: 'Cremes Anestésicos',
    filterBlood: 'Anticoagulantes',
    filterRetinoid: 'Acne / Retinoides',
    filterAnxiety: 'Ansiolíticos / Sedativos',
    filterHormone: 'Hormônios e TRH',
    filterStimulant: 'TDAH e Estimulantes',
    filterMetabolic: 'Diabetes e GLP-1',
    filterCorticosteroid: 'Corticosteroides',
    filterImmuno: 'Imunossupressores',
    filterSupplement: 'Suplementos',
    filterAntibiotic: 'Antibióticos e Antivirais',
    filterSubstance: 'Substâncias e Estilo de Vida',
    infoNote: '💡 Selecione seus medicamentos para visualizar riscos e recomendações.',
    clearAll: 'Limpar tudo',
    draftDoctorNoteBtn: '✉️ Nota médica',
    viewBriefBtn: '📄 Ver Relatório',
    backToTopBtn: '⬆️ Voltar ao Topo',
    backToMedListBtn: '⬆️ Voltar à Lista'
  }
};

const RISK_EXPLANATIONS = {
  'Bleeding Risk': 'NSAIDs and blood thinners inhibit platelet aggregation (clotting factors) or thin blood, preventing rapid scab formation during skin perforation.',
  'High Bleeding Risk': 'Strong anticoagulants severely inhibit clotting cascades, causing steady arterial or capillary bleeding during skin puncture.',
  'Mild Bleeding Risk': 'Slight decrease in platelet stickiness or minor blood thinning leading to mild extra oozing.',
  'No Extra Bleeding': 'Does not affect blood clotting or vascular constriction.',
  'Plasma Oozing': 'When blood clotting is delayed, blood vessel walls leak clear plasma onto skin, diluting tattoo ink and pushing pigment out of dermal layers.',
  'Safe Analgesic': 'Acetaminophen/Paracetamol works on central nervous system pain receptors without inhibiting platelet aggregation.',
  'Fainting Risk': 'Vasovagal syncope occurs when pain, stress, or medications trigger a sudden reflex drop in heart rate and blood pressure.',
  'Sedation Risk': 'Central nervous system depressants reduce alertness, lowering blood pressure and raising risk of lightheadedness or nausea.',
  'Skin Texture Alteration': 'Topical anesthetics cause localized edema (fluid swelling in skin cells), making skin rubbery and harder for needles to deposit ink evenly.',
  'Rebound Shock': 'When topical numbing wears off mid-session, pain receptors suddenly flood the brain without gradual adaptation, causing intense pain shock.',
  'Rebound Bleeding': 'Epinephrine temporarily shrinks blood vessels. When it wears off, blood vessels dilate rapidly (rebound hyperemia), producing heavy bleeding.',
  'Vasoconstriction': 'Narrowing of blood vessels blanches skin, making alignment difficult and temporarily restricting blood flow.',
  'Delayed Healing': 'Anticoagulants and steroids slow down fibrin formation and cell proliferation required for wound closure.',
  'Severe Scarring': 'Isotretinoin (Accutane) suppresses sebum and alters skin cell regeneration, causing fragile skin to form keloid or hypertrophic scars.',
  'Healing Delay': 'Impaired skin cell turnover delays epithelialization of fresh tattoo ink or piercing fistula walls.',
  'Fragile Skin': 'Dermal layers are thinned, making skin easily torn by friction or adhesive bandage removal.',
  'Skin Sensitivity': 'Accelerated exfoliation makes skin hyper-reactive to needle friction and aftercare products.',
  'Photosensitivity': 'Certain drugs make skin cells absorb UV rays rapidly, causing severe sunburn-like allergic reactions on fresh tattoos.',
  'Low Blood Pressure': 'Sedatives and anti-anxiety drugs lower vascular tone, increasing fainting risk upon standing or pain stimulation.',
  'Bradycardia': 'Beta-blockers slow heart rate, preventing normal cardiac response to pain and triggering dizziness.',
  'Drowsiness': 'Antihistamines cause central sedation, making you sleepy during long procedures.',
  'Minor Pigmentation Risk': 'Hormonal fluctuations sensitize melanocytes, increasing melasma risk when exposed to sun during healing.',
  'Slightly Thicker Blood': 'Testosterone increases red blood cell count (hematocrit), making blood slightly denser during heavy linework.',
  'Dehydration Sensitivity': 'Diuretic effects increase fluid loss, requiring double the normal water intake to prevent blood pressure drops.',
  'Heart Rate Increase': 'Stimulants raise baseline heart rate and sympathetic arousal, increasing jitteriness and pain sensitivity.',
  'Hypoglycemia Risk': 'GLP-1 drugs delay stomach emptying and drop blood glucose, causing sudden nausea or weakness if sugar levels drop.',
  'Infection Risk': 'Suppressed immune response reduces white blood cell activity, increasing vulnerability to bacterial skin infection.',
  'High Infection Risk': 'Immunosuppressive medications significantly impair bacterial defense, making sterile aftercare critical.',
  'Skin Fragility at Site': 'Topical corticosteroids thin local dermal collagen fibers.',
  'Outbreak Prevention': 'Lip trauma triggers dormant HSV-1 herpes cold sores; prophylactic antivirals suppress viral replication.'
};

/**
 * A UI string from TRANSLATIONS, falling back to the English.
 *
 * The file already writes `const dict = TRANSLATIONS[currentLang]` in eight
 * separate places; this is that, once, for code that is not inside one of them.
 */
function uiText(key, fallback) {
  var d = (typeof TRANSLATIONS !== 'undefined' && (TRANSLATIONS[currentLang] || TRANSLATIONS.en)) || {};
  return d[key] || fallback;
}

function renderRiskBadgeHtml(rb) {
  // ONE RULE FOR BOTH HALVES, OR THE TWO HALVES DISAGREE.
  //
  // This used to strip the emoji with a long list of code-point ranges while the
  // prefix was taken separately, and the two did not match. Two live defects
  // came out of it, and neither threw:
  //   "⬇ Low Blood Pressure"  U+2B07 was not in the ranges, so the emoji was
  //                           never stripped and then prepended again:
  //                           "⬇ ⬇ Low Blood Pressure".
  //   "⏳ Delayed Healing"     U+23F3 WAS in the ranges, so the key became
  //                           "Delayed Healing" while risk-i18n.js held it under
  //                           "⏳ Delayed Healing": the lookup missed and that
  //                           badge could never be translated at all.
  //
  // So the split is done once: everything before the first letter or digit is
  // decoration, the rest is the key. emoji + cleanKey always reconstructs rb,
  // which makes a doubled prefix and a missed lookup both impossible.
  const emoji = rb.slice(0, rb.length - rb.replace(/^[^\p{L}\p{N}]*/u, '').length);
  const cleanKey = rb.slice(emoji.length).trim();

  // TRANSLATE AT RENDER TIME, NEVER IN THE DATA. The medication data carries the
  // English string as its lookup key, so it stays English for ever; the label a
  // reader sees is looked up from it and the decoration put back afterwards.
  const translated = (typeof riskText === 'function' && riskText(cleanKey, 'label')) || cleanKey;
  const display = (emoji + translated).trim();

  const exp = (typeof riskText === 'function' && riskText(cleanKey, 'explain'))
    || RISK_EXPLANATIONS[cleanKey] || RISK_EXPLANATIONS[rb]
    || 'Mechanism related to tissue repair, blood clotting, or autonomic nervous system response during skin puncture.';

  return `
    <span class="risk-badge-wrapper" data-risk-name="${escHtml(display)}" data-risk-exp="${escHtml(exp)}">
      <span class="list-risk-badge">${escHtml(display)}</span>
    </span>`;
}

function updateUILanguage(lang) {
  currentLang = lang || 'en';
  // <html lang> drives screen-reader pronunciation; without it French text is
  // read with English phonetics. Persist so a reload does not snap back to EN.
  document.documentElement.setAttribute('lang', currentLang);
  try { localStorage.setItem('ui_lang_v1', currentLang); } catch (e) {}
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Generic placeholder translation. The medication search box had a one-off
  // line below for exactly this; a second input needing the same thing is the
  // point to make it general rather than write the special case twice.
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });

  // English readers are reading the source, so the notice would be noise.
  const tn = document.getElementById('translation-notice');
  if (tn) tn.style.display = currentLang === 'en' ? 'none' : '';

  // The results already on screen are built from dict strings, so they have to
  // be rebuilt when the language changes or they stay in the old one.
  if (typeof renderSupplementResults === 'function') renderSupplementResults();

  if (medSearchEl && dict.searchPlaceholder) {
    medSearchEl.placeholder = dict.searchPlaceholder;
  }

  // Update tabs if text present
  const tabBtnMap = {
    checker: dict.tabChecker,
    brief: dict.tabBrief,
    safety: dict.tabSafety,
    faq: dict.tabFaq,
    reminders: dict.tabReminders
  };

  document.querySelectorAll('.tab-btn').forEach(btn => {
    const tabName = btn.dataset.tab;
    if (tabBtnMap[tabName]) {
      if (tabName === 'brief') {
        const countSpan = btn.querySelector('.badge-count');
        btn.innerHTML = `${dict.tabBrief} <span class="badge-count" id="brief-count">${countSpan ? countSpan.textContent : '0'}</span>`;
      } else {
        btn.textContent = tabBtnMap[tabName];
      }
    }
  });

  renderMedList();
  renderResults();
}

function triggerBadgePulse() {
  const briefCount = document.getElementById('brief-count');
  if (!briefCount) return;
  briefCount.classList.remove('pulse');
  void briefCount.offsetWidth; // Force reflow
  briefCount.classList.add('pulse');
  setTimeout(() => {
    briefCount.classList.remove('pulse');
  }, 500);
}

function setupEventListeners() {
  // Language Switcher
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      updateUILanguage(e.target.value);
    });
    var savedLang = '';
    try { savedLang = localStorage.getItem('ui_lang_v1') || ''; } catch (e) {}
    if (savedLang && TRANSLATIONS[savedLang]) {
      langSelect.value = savedLang;
      updateUILanguage(savedLang);
    }
  }

  // Risk Badge Popover Bubble Event Delegation
  document.addEventListener('click', (e) => {
    const wrapper = e.target.closest('.risk-badge-wrapper');
    const existingPopover = document.querySelector('.risk-popover-bubble');
    
    if (existingPopover) {
      existingPopover.remove();
    }

    if (wrapper) {
      e.stopPropagation();
      const riskName = wrapper.dataset.riskName || 'Risk Factors';
      const riskExp = wrapper.dataset.riskExp || 'Procedural risk mechanism.';

      const popover = document.createElement('div');
      popover.className = 'risk-popover-bubble';
      popover.innerHTML = `
        <div class="risk-popover-title">
          <span>${escHtml(riskName)}</span>
          <span style="cursor:pointer; font-size:1rem; opacity:0.7;" onclick="this.parentElement.parentElement.remove()">✕</span>
        </div>
        <div>${escHtml(riskExp)}</div>
      `;

      wrapper.appendChild(popover);
    }
  });

  // Tab switching
  toolTabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tabName = btn.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    
    btn.classList.add('active');
    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) targetTab.style.display = 'block';

    if (tabName === 'brief') {
      updateBriefTab();
    } else if (tabName === 'reminders') {
      renderRemindersTab();
    }
  });

  // Share Intake Deep Link Listeners
  document.getElementById('header-share-link-btn')?.addEventListener('click', copyShareableDeepLink);
  document.getElementById('share-deep-link-checker-btn')?.addEventListener('click', copyShareableDeepLink);
  document.getElementById('share-brief-link-btn')?.addEventListener('click', copyShareableDeepLink);

  // Quick Print Listener
  document.getElementById('header-quick-print-btn')?.addEventListener('click', triggerQuickPrint);

  // Reminders & Washout Tab Listeners
  document.getElementById('save-appointment-btn')?.addEventListener('click', saveAppointmentDate);
  document.getElementById('enable-notifications-btn')?.addEventListener('click', enableBrowserNotifications);
  document.getElementById('export-gcal-ics-btn')?.addEventListener('click', exportGoogleCalendarIcs);
  document.getElementById('open-gcal-web-btn')?.addEventListener('click', openGoogleCalendarWeb);
  document.getElementById('export-ics-btn')?.addEventListener('click', exportCalendarEvent);

  // Switch to checker link from empty brief / empty reminders
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'go-to-checker') {
      e.preventDefault();
      document.querySelector('[data-tab="checker"]').click();
    }
  });

  // Category filter tags
  filterTagsEl.addEventListener('click', (e) => {
    const tag = e.target.closest('.filter-tag');
    if (!tag) return;
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
    activeCategoryFilter = tag.dataset.cat;
    renderMedList();
  });

  // Live search
  medSearchEl.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
    renderMedList();
  });

  clearSearchBtn.addEventListener('click', () => {
    medSearchEl.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderMedList();
  });

  // Med list selection change
  medListEl.addEventListener('change', () => {
    renderResults();
    updateBriefCount();
  });

  // FAQ accordions
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
      const icon = btn.querySelector('.faq-icon');
      if (icon) icon.textContent = item.classList.contains('open') ? '−' : '+';
    });
  });

  // Brief actions
  document.getElementById('copy-brief-btn').addEventListener('click', copyBriefText);
  document.getElementById('print-brief-btn').addEventListener('click', () => window.print());
  
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', generateBriefPDF);
  }

  const exportJsonBtn = document.getElementById('export-json-btn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', exportBriefAsJson);
  }

  const exportTxtBtn = document.getElementById('export-txt-btn');
  if (exportTxtBtn) {
    exportTxtBtn.addEventListener('click', exportBriefAsTxt);
  }

  const printPacketBtn = document.getElementById('print-full-packet-btn');
  if (printPacketBtn) {
    printPacketBtn.addEventListener('click', printFullClinicPacket);
  }

  // Modal event listeners
  if (openDocModalBtn) {
    openDocModalBtn.addEventListener('click', openDoctorModal);
  }
  if (closeDocModalBtn) {
    closeDocModalBtn.addEventListener('click', closeDoctorModal);
  }
  if (cancelDocModalBtn) {
    cancelDocModalBtn.addEventListener('click', closeDoctorModal);
  }
  
  [docNameInput, patientNameInput, procTypeInput, procDateInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updateDoctorMessageDraft);
  });

  if (copyDocMsgBtn) {
    copyDocMsgBtn.addEventListener('click', copyDoctorMessage);
  }
  if (emailDocBtn) {
    emailDocBtn.addEventListener('click', openDoctorEmailClient);
  }
  const printDocMsgBtn = document.getElementById('print-doc-msg-btn');
  if (printDocMsgBtn) {
    printDocMsgBtn.addEventListener('click', printDoctorMessage);
  }

  // Floating Back to Top button - smooth scroll jump to search bar
  const floatTopBtn = document.getElementById('floating-top-btn');
  if (floatTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 280) {
        floatTopBtn.classList.add('visible');
      } else {
        floatTopBtn.classList.remove('visible');
      }
    });
    floatTopBtn.addEventListener('click', () => {
      const searchBox = document.querySelector('.search-box') || document.getElementById('med-search');
      if (searchBox) {
        searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (medSearchEl) {
          setTimeout(() => {
            try { medSearchEl.focus({ preventScroll: true }); } catch (e) {}
          }, 350);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Risk Badge & Med item jump handler and Card Back button handler
  document.addEventListener('click', (e) => {
    // 1. Check if clicking a card back button
    const backBtn = e.target.closest('.card-back-btn');
    if (backBtn) {
      const medId = backBtn.dataset.medId;
      const targetItem = document.querySelector(`input[data-med-id="${medId}"]`)?.closest('.med-item');
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetItem.classList.add('highlight-flash');
        setTimeout(() => targetItem.classList.remove('highlight-flash'), 1600);
      } else {
        const searchBox = document.querySelector('.search-box') || document.getElementById('med-search');
        if (searchBox) {
          searchBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    // 2. Check if clicking a risk badge or med item label to jump down to result card explanation section
    const riskBadge = e.target.closest('.risk-badge-wrapper, .med-item-label');
    if (riskBadge && !e.target.closest('input[type="checkbox"]') && !e.target.closest('.risk-popover-bubble')) {
      const medItem = riskBadge.closest('.med-item');
      if (!medItem) return;
      const chk = medItem.querySelector('input[data-med-id]');
      if (!chk) return;
      const medId = chk.dataset.medId;

      // Ensure checkbox is checked
      if (!chk.checked) {
        chk.checked = true;
        medItem.classList.add('selected');
        renderResults();
        updateBriefCount();
      }

      // Smooth scroll to result card explanation
      setTimeout(() => {
        const cardEl = document.getElementById(`result-card-${medId}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cardEl.classList.add('highlight-flash');
          setTimeout(() => cardEl.classList.remove('highlight-flash'), 1600);
        }
      }, 50);
    }
  });
}

function getSelectedMedIds() {
  return Array.from(document.querySelectorAll('input[data-med-id]:checked')).map(el => el.dataset.medId);
}

function updateBriefCount() {
  const count = getSelectedMedIds().length;
  const countEl = document.getElementById('brief-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'inline-block' : 'none';
  }
  triggerBadgePulse();
}

/* Levenshtein Distance & Fuzzy Matcher Engine */
function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b).length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function getFuzzySuggestion(query) {
  if (!query || query.length < 3) return null;
  const cleanQ = query.toLowerCase().trim();

  let bestMatch = null;
  let minDistance = Infinity;

  CATEGORIES.forEach(cat => {
    cat.meds.forEach(m => {
      // Test drug name
      const name = m.name.trim();
      const distName = levenshteinDistance(cleanQ, name.toLowerCase());

      if (distName > 0 && distName < minDistance && distName <= (cleanQ.length > 5 ? 3 : 2)) {
        minDistance = distName;
        bestMatch = name;
      }

      // Test brand names in sub
      if (m.sub) {
        const brands = m.sub.split('/').map(b => b.trim());
        brands.forEach(b => {
          const distBrand = levenshteinDistance(cleanQ, b.toLowerCase());
          if (distBrand > 0 && distBrand < minDistance && distBrand <= (cleanQ.length > 5 ? 3 : 2)) {
            minDistance = distBrand;
            bestMatch = b;
          }
        });
      }
    });
  });

  return bestMatch;
}

function renderMedList() {
  medListEl.innerHTML = '';
  let totalVisible = 0;

  CATEGORIES.forEach(cat => {
    if (activeCategoryFilter !== 'all' && cat.id !== activeCategoryFilter) {
      return;
    }

    const matchingMeds = cat.meds.filter(m => {
      if (!searchQuery) return true;
      const riskTagsStr = (m.riskBadges || []).join(' ');
      const haystack = `${m.name} ${m.sub} ${m.tags} ${m.cat} ${riskTagsStr}`.toLowerCase();
      return haystack.includes(searchQuery);
    });

    if (matchingMeds.length === 0) return;

    totalVisible += matchingMeds.length;

    const block = document.createElement('div');
    block.className = 'med-category';

    const itemsHtml = matchingMeds.map(m => {
      const isChecked = document.querySelector(`input[data-med-id="${m.id}"]`)?.checked ? 'checked' : '';
      
      const riskBadgesHtml = (m.riskBadges || []).map(rb => renderRiskBadgeHtml(rb)).join('');
      const riskLabel = m.sev === 'high' ? uiText('x.high_concern', 'High Concern')
        : m.sev === 'mod' ? uiText('x.moderate_concern', 'Moderate Concern')
        : uiText('x.low_concern', 'Low Concern');

      return `
        <label class="med-item ${isChecked ? 'selected' : ''}">
          <input type="checkbox" value="${escHtml(m.id)}" data-med-id="${escHtml(m.id)}" ${isChecked}>
          <div class="med-item-info">
            <span class="med-item-label">
              ${escHtml(m.name)} 
              <small>${escHtml(m.sub)}</small>
            </span>
            <div class="med-risk-badges-row">
              ${riskBadgesHtml}
            </div>
            <div class="med-risk-bar-container">
              <div class="med-risk-bar-label">
                <span>Healing Risk:</span>
                <strong class="risk-label-${escHtml(m.sev)}">${escHtml(riskLabel)}</strong>
              </div>
              <div class="med-risk-bar-track" title="Healing Risk Level: ${escHtml(m.sev)}">
                <div class="med-risk-bar-fill ${escHtml(m.sev)}"></div>
              </div>
            </div>
          </div>
          <span class="mini-sev-dot ${escHtml(m.sev)}" title="${m.sev} risk"></span>
        </label>`;
    }).join('');

    block.innerHTML = `
      <div class="med-category-title">${escHtml(cat.label)} <span class="cat-count">(${matchingMeds.length})</span></div>
      <div class="med-items">${itemsHtml}</div>`;

    medListEl.appendChild(block);
  });

  // Handle "Did you mean?" suggestions
  const dymBox = document.getElementById('did-you-mean-box');
  if (dymBox) {
    if (searchQuery.length >= 3) {
      const suggestion = getFuzzySuggestion(searchQuery);
      if (suggestion && suggestion.toLowerCase() !== searchQuery) {
        dymBox.style.display = 'flex';
        dymBox.innerHTML = `
          <span>💡 Did you mean:</span>
          <button class="dym-btn" id="dym-apply-btn" data-term="${escHtml(suggestion)}">${escHtml(suggestion)} 🔍</button>
        `;

        document.getElementById('dym-apply-btn')?.addEventListener('click', () => {
          if (!medSearchEl) return;
          medSearchEl.value = suggestion;
          searchQuery = suggestion.toLowerCase().trim();
          if (clearSearchBtn) clearSearchBtn.style.display = 'block';
          saveRecentSearch(suggestion);
          renderMedList();
        });
      } else {
        dymBox.style.display = 'none';
      }
    } else {
      dymBox.style.display = 'none';
    }
  }

  if (totalVisible === 0) {
    medListEl.innerHTML = `
      <div class="no-search-results">
        <div class="no-results-icon">🔍</div>
        <p class="no-results-title">No medications found matching "<strong>${escHtml(searchQuery)}</strong>"</p>
        <div class="no-results-box">
          <p><strong>Suggestions to find your medication:</strong></p>
          <ul class="no-results-list">
            <li>• Check spelling or try searching by generic chemical name (e.g., <em>Ibuprofen, Paracetamol, Isotretinoin, Alprazolam</em>).</li>
            <li>• Search by regional brand name (e.g., <em>Advil, Doliprane, Tachipirina, Gelocatil, Spidifen, Ben-u-ron, Accutane, Xanax, TKTX</em>).</li>
            <li>• Filter by drug category using the tabs above (e.g., <em>Painkillers, Blood Thinners, Numbing Creams</em>).</li>
          </ul>
        </div>
        <button class="reset-search-btn" id="clear-search-no-results">Reset Filter / Clear Search</button>
      </div>`;
    
    document.getElementById('clear-search-no-results')?.addEventListener('click', () => {
      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) clearBtn.click();
    });
  }
}

/**
 * The published sources behind one medication entry, when there are any.
 *
 * Data comes from js/medication-sources.js, generated by
 * scripts/build-tool-sources.js from ONLY the citations Patrick approved at
 * /cr/<code>. Nothing here proposes or infers a source.
 *
 * Returning '' when there is nothing is deliberate and covers two different
 * situations that both mean "we are not showing you a paper": the citation is
 * queued but not yet approved, or Europe PMC returned nothing on-claim for that
 * drug at all (calcineurin inhibitors, opioids, alcohol and stimulants). An
 * empty sources line is honest; an invented one is the defect this whole
 * exercise exists to prevent.
 */
/**
 * Translated medication prose, with an English fallback.
 *
 * The 38 medication entries carry ~1,942 words across tattoo/piercing/wait and
 * every word of it is English, in all seven languages. The chrome was
 * translated; the substance never was. A German user reads German buttons and
 * English pharmacology, and nothing tells them that is what is happening.
 *
 * medText() returns the translated string when js/med-content-i18n.js has one
 * and the English otherwise - but it records the miss, so the card can say so.
 * Silently serving English under a French flag is the failure mode here: the
 * reader cannot tell whether they are reading our words or a translation, on a
 * page about their medication.
 */
let medTextFellBack = false;

function medText(med, field) {
  const en = med[field] || '';
  if (currentLang === 'en') return en;
  const all = (typeof MED_CONTENT_I18N !== 'undefined' && MED_CONTENT_I18N) || {};
  const t = (all[med.id] || {})[currentLang];
  if (t && t[field]) return t[field];
  medTextFellBack = true;
  return en;
}

function renderMedSources(medId) {
  const all = (typeof MEDICATION_SOURCES !== 'undefined' && MEDICATION_SOURCES) || {};
  const srcs = all[medId];
  if (!srcs || !srcs.length) return '';
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const items = srcs.map((s) => {
    const label = escHtml(s.claim || '') || (s.pmid ? 'PMID ' + escHtml(s.pmid) : escHtml(s.url));
    return '<li><a href="' + escHtml(s.url) + '" target="_blank" rel="noopener noreferrer">'
      + label + (s.pmid ? ' (PMID ' + escHtml(s.pmid) + ')' : '') + '</a></li>';
  }).join('');
  return '<div class="med-sources"><strong>' + escHtml(dict.medSourcesLabel || 'Published sources')
    + '</strong><ul>' + items + '</ul></div>';
}

/* "Find X nearby" row.
   The button LABELS are in the reader's UI language; the Maps QUERY is in the
   language of where they physically are - see js/geo-search.js for why those
   are deliberately different, and why we never ask for geolocation. */
function geoSearchLang() {
  try {
    const saved = localStorage.getItem('geo_search_lang_v1');
    if (saved && GEO_SEARCH_TERMS[saved]) return saved;
  } catch (e) {}
  return geoSearchDetectLang();
}

function renderGeoRow(highCount) {
  if (typeof GEO_SEARCH_TERMS === 'undefined') return '';
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const gl = geoSearchLang();
  const kinds = [
    ['studio', dict.geoFindStudio || '\ud83c\udfa8 Find a studio nearby', ''],
    ['doctor', dict.geoFindDoctor || '\ud83e\ude7a Find a doctor nearby', ''],
    ['pharmacy', dict.geoFindPharmacy || '\ud83d\udc8a Nearest pharmacy', ''],
    ['hospital', dict.geoFindHospital || '\ud83c\udfe5 Nearest hospital', highCount > 0 ? ' urgent' : ''],
  ];
  const btns = kinds.map(([kind, label, extra]) =>
    `<a class="geo-btn${extra}" data-geo-kind="${kind}" target="_blank" rel="noopener noreferrer"
        href="${escHtml(geoSearchUrl(kind, gl))}">${escHtml(label)}</a>`).join('');

  const opts = Object.keys(GEO_SEARCH_TERMS)
    .sort((a, b) => GEO_SEARCH_LANG_NAMES[a].localeCompare(GEO_SEARCH_LANG_NAMES[b]))
    .map(l => `<option value="${l}"${l === gl ? ' selected' : ''}>${escHtml(GEO_SEARCH_LANG_NAMES[l])}</option>`)
    .join('');

  return `
    <div class="geo-row">
      <div class="geo-btns">${btns}</div>
      <div class="geo-lang">
        <label for="geo-lang-select">${escHtml(dict.geoLangLabel || 'Search in:')}</label>
        <select id="geo-lang-select">${opts}</select>
      </div>
      <p class="geo-note">${escHtml(dict.geoNote || '')}</p>
    </div>`;
}

/* Re-points the four links when the reader overrides the detected language. */
function initGeoRow() {
  const sel = document.getElementById('geo-lang-select');
  if (!sel) return;
  sel.addEventListener('change', () => {
    const l = sel.value;
    try { localStorage.setItem('geo_search_lang_v1', l); } catch (e) {}
    document.querySelectorAll('.geo-btn[data-geo-kind]').forEach((a) => {
      a.setAttribute('href', geoSearchUrl(a.getAttribute('data-geo-kind'), l));
    });
  });
}

function renderResults() {
  medTextFellBack = false;
  const checked = getSelectedMedIds();
  if (checked.length === 0) { 
    resultEl.innerHTML = ''; 
    return; 
  }

  const sevOrder = { high: 0, mod: 1, low: 2 };
  const sorted = [...checked].sort((a, b) => sevOrder[medMap[a].sev] - sevOrder[medMap[b].sev]);

  const highCount = sorted.filter(id => medMap[id].sev === 'high').length;
  const modCount  = sorted.filter(id => medMap[id].sev === 'mod').length;

  const cardsHtml = sorted.map(id => {
    const m = medMap[id];
    const sevLabel = m.sev === 'high' ? uiText('x.high_concern', 'High Concern')
      : m.sev === 'mod' ? uiText('x.moderate_concern', 'Moderate Concern')
      : uiText('x.low_concern', 'Low Concern');
    
    const riskBadgesHtml = (m.riskBadges || []).map(rb => renderRiskBadgeHtml(rb)).join('');

    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

    return `
      <div class="interaction-card ${escHtml(m.sev)}" id="result-card-${escHtml(m.id)}">
        <div class="interaction-head">
          <div class="interaction-title-group">
            <span class="interaction-name">${escHtml(m.name)}</span>
            <span class="interaction-sub">${escHtml(m.sub)}</span>
            <div class="card-risk-row">${riskBadgesHtml}</div>
          </div>
          <span class="sev-badge ${escHtml(m.sev)}">${escHtml(sevLabel)}</span>
        </div>
        <div class="interaction-body">
          <div class="effect-row">
            <span class="effect-type tattoo-badge">🎨 Tattoo</span>
            <span class="effect-text">${escHtml(medText(m, 'tattoo'))}</span>
          </div>
          <div class="effect-row">
            <span class="effect-type piercing-badge">💎 Piercing</span>
            <span class="effect-text">${escHtml(medText(m, 'piercing'))}</span>
          </div>
          ${m.wait ? `<div class="wait-note">⏱️ <strong>${escHtml(dict.waitLabel || 'Wait / Washout Recommendation:')}</strong> ${escHtml(medText(m, 'wait'))}</div>` : ''}
          ${renderMedSources(m.id)}
          <div style="margin-top:0.75rem; text-align:right;">
            <button class="card-back-btn" data-med-id="${escHtml(m.id)}">${dict.backToMedListBtn || '⬆️ Back to Med List'}</button>
          </div>
        </div>
      </div>`;
  }).join('');

  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  resultEl.innerHTML = `
    <div class="result-header-box">
      <div class="result-summary">
        <span class="result-count">
          <strong>${checked.length}</strong> medication${checked.length !== 1 ? 's' : ''} selected:
          ${highCount > 0 ? `<span class="badge-high">${highCount} High Concern</span>` : ''}
          ${modCount > 0 ? `<span class="badge-mod">${modCount} Moderate Concern</span>` : ''}
          ${highCount === 0 && modCount === 0 ? `<span class="badge-low">Low Concern Overall</span>` : ''}
        </span>
      </div>
      <div class="result-actions">
        <button class="brief-jump-btn" onclick="openDoctorModal()">${dict.draftDoctorNoteBtn || '✉️ Draft Doctor Note'}</button>
        <button class="brief-jump-btn" onclick="document.querySelector('[data-tab=\\'brief\\']').click()">${dict.viewBriefBtn || '📄 View Artist Brief'}</button>
        <button class="clear-btn" id="clear-btn">${dict.clearAll || 'Clear all'}</button>
      </div>
      ${renderGeoRow(highCount)}
    </div>
    ${cardsHtml}`;

  initGeoRow();

  document.getElementById('clear-btn').addEventListener('click', () => {
    document.querySelectorAll('input[data-med-id]:checked').forEach(el => { el.checked = false; });
    renderResults();
    renderMedList();
    updateBriefCount();
  });
}

/* Auto-Save Functionality for Readiness Assessment & Prep Calculator */
function saveReadinessAutoSave() {
  const allIds = [
    'calc-weight', 'calc-weight-unit', 'calc-hours', 'calc-proc-type', 'calc-rhr', 'calc-bp',
    'check-stimulant', 'check-beta', 'check-glp1', 'check-anxiety',
    'q-proc-select', 'q-history-select', 'q-med-nsaid', 'q-med-numbing', 'q-med-retinoid', 'q-med-bp', 'q-med-none'
  ];
  const data = {};
  allIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') {
      data[id] = el.checked;
    } else {
      data[id] = el.value;
    }
  });
  try {
    localStorage.setItem('readiness_assessment_autosave_v1', JSON.stringify(data));
  } catch(e) {}
}

function loadReadinessAutoSave() {
  try {
    const raw = localStorage.getItem('readiness_assessment_autosave_v1');
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.keys(data).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = !!data[id];
      } else {
        el.value = data[id];
      }
    });
  } catch(e) {}
}

/* Calculator & Readiness Assessment Logic */
function initCalculators() {
  // Restore auto-saved form selections
  loadReadinessAutoSave();

  // Pre-Session Prep Calculator Listener
  const calcInputs = ['calc-weight', 'calc-weight-unit', 'calc-hours', 'calc-proc-type', 'calc-rhr', 'calc-bp', 'check-stimulant', 'check-beta', 'check-glp1', 'check-anxiety'];
  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        updatePrepCalculator();
        saveReadinessAutoSave();
      });
      el.addEventListener('change', () => {
        updatePrepCalculator();
        saveReadinessAutoSave();
      });
    }
  });

  // Artist Readiness Assessment Listener
  const readinessInputs = ['q-proc-select', 'q-history-select', 'q-med-nsaid', 'q-med-numbing', 'q-med-retinoid', 'q-med-bp', 'q-med-none'];
  readinessInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        updateArtistReadiness();
        saveReadinessAutoSave();
      });
    }
  });

  updatePrepCalculator();
  updateArtistReadiness();
}

function updatePrepCalculator() {
  const weightInput = document.getElementById('calc-weight');
  const unitSelect  = document.getElementById('calc-weight-unit');
  const hoursSelect = document.getElementById('calc-hours');
  const procSelect  = document.getElementById('calc-proc-type');
  const resultsEl   = document.getElementById('prep-calc-results');

  if (!weightInput || !resultsEl) return;

  let weightVal = parseFloat(weightInput.value) || 70;
  if (unitSelect && unitSelect.value === 'lbs') {
    weightVal = weightVal * 0.453592; // convert to kg
  }

  const hours = parseInt(hoursSelect ? hoursSelect.value : '3', 10) || 3;

  const rhrInput = document.getElementById('calc-rhr');
  const bpInput  = document.getElementById('calc-bp');

  const rhrVal = rhrInput && rhrInput.value ? parseInt(rhrInput.value, 10) : null;
  const bpVal  = bpInput && bpInput.value ? bpInput.value.trim() : '';

  const chkStimulant = document.getElementById('check-stimulant')?.checked;
  const chkBeta      = document.getElementById('check-beta')?.checked;
  const chkGlp1      = document.getElementById('check-glp1')?.checked;
  const chkAnxiety   = document.getElementById('check-anxiety')?.checked;

  let syncopeScore = 0;
  if (chkStimulant) syncopeScore += 2;
  if (chkBeta) syncopeScore += 2;
  if (chkGlp1) syncopeScore += 3;
  if (chkAnxiety) syncopeScore += 2;
  if (hours >= 4) syncopeScore += 1;

  let vitalsAdvice = '';

  if (rhrVal && !isNaN(rhrVal)) {
    if (rhrVal < 60) {
      syncopeScore += 1;
      vitalsAdvice += `• <strong>Resting HR ${rhrVal} bpm (Bradycardia):</strong> Lower baseline pulse can increase vasovagal susceptibility when pain or fear occurs. Ensure you are fully reclined.<br>`;
    } else if (rhrVal > 100) {
      syncopeScore += 1;
      vitalsAdvice += `• <strong>Resting HR ${rhrVal} bpm (Tachycardia):</strong> Elevated pulse indicates high sympathetic arousal, anxiety, or caffeine/stimulant intake. Avoid extra coffee/energy drinks; practice 4-4-4 box breathing before needle contact.<br>`;
    } else {
      vitalsAdvice += `• <strong>Resting HR ${rhrVal} bpm:</strong> Normal baseline heart rate (60–100 bpm). Good cardiovascular stability for session.<br>`;
    }
  }

  if (bpVal) {
    const parts = bpVal.split(/[\/\\]/).map(p => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const sys = parts[0];
      const dia = parts[1];
      if (sys < 90 || dia < 60) {
        syncopeScore += 3;
        vitalsAdvice += `• <strong>Blood Pressure ${sys}/${dia} mmHg (Hypotension Alert):</strong> HIGH RISK OF VASOVAGAL SYNCOPE! Low blood pressure easily drops further during pain shock. <em>Mandatory Action:</em> Consume 500ml water + electrolyte mix 30 mins before seating; lie completely flat during session; keep glucose juice nearby.<br>`;
      } else if (sys >= 140 || dia >= 90) {
        syncopeScore += 1;
        vitalsAdvice += `• <strong>Blood Pressure ${sys}/${dia} mmHg (Elevated BP):</strong> Higher blood pressure increases microvascular bleeding and throbbing sensation during skin puncture. Ensure prescribed antihypertensives are taken as directed.<br>`;
      } else {
        vitalsAdvice += `• <strong>Blood Pressure ${sys}/${dia} mmHg:</strong> Optimal blood pressure range (90–120 / 60–80 mmHg).<br>`;
      }
    }
  }

  let riskTag = '<span class="syncope-risk-tag low">' + uiText('x.low_syncope_risk', 'Low Syncope Risk') + '</span>';
  if (syncopeScore >= 4) {
    riskTag = '<span class="syncope-risk-tag high">' + uiText('x.elevated_syncope_risk', '⚠️ Elevated Syncope Risk') + '</span>';
  } else if (syncopeScore >= 2) {
    riskTag = '<span class="syncope-risk-tag mod">' + uiText('x.moderate_syncope_risk', 'Moderate Syncope Risk') + '</span>';
  }

  const totalWaterMl = Math.round((weightVal * 35) + (hours * 250));
  const totalWaterOz = Math.round(totalWaterMl * 0.033814);
  const hourlyMl = Math.round(250 + (weightVal > 80 ? 50 : 0));

  resultsEl.innerHTML = `
    <div class="calc-result-box">
      <div class="calc-result-title">
        <span>💧 Target Hydration Plan</span>
        <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">${totalWaterMl} ml (${totalWaterOz} oz)</span>
      </div>
      <div class="calc-result-desc">
        • <strong>24 Hours Before:</strong> Drink ~${Math.round(totalWaterMl * 0.6)} ml throughout the day.<br>
        • <strong>2 Hours Before:</strong> Drink ~${Math.round(totalWaterMl * 0.25)} ml with electrolytes.<br>
        • <strong>During Session:</strong> Sip ~${hourlyMl} ml every 45–60 minutes.
      </div>
    </div>

    <div class="calc-result-box">
      <div class="calc-result-title">
        <span>🍌 Blood Sugar & Fuel Schedule</span>
        <span style="font-size:0.75rem; color:var(--primary); font-weight:700;">Glucose Target</span>
      </div>
      <div class="calc-result-desc">
        • <strong>Pre-Appointment Meal (1.5–2h pre):</strong> Eat complex carbs + protein (oatmeal, chicken rice bowl, or whole-grain toast).<br>
        • <strong>Session Glucose Boost:</strong> Consume 15–20g simple carbs (fruit juice, gummy candies, or sports drink) every ${hours >= 4 ? '90 minutes' : '2 hours'} to keep blood sugar >90 mg/dL.
      </div>
    </div>

    <div class="calc-result-box">
      <div class="calc-result-title">
        <span>💫 Vasovagal Syncope & Vitals Analysis</span>
        ${riskTag}
      </div>
      <div class="calc-result-desc">
        ${vitalsAdvice ? `<div style="margin-bottom:0.5rem; padding-bottom:0.4rem; border-bottom:1px dashed var(--border);">${vitalsAdvice}</div>` : ''}
        ${syncopeScore >= 2 
          ? '• <strong>Recommended Protocol:</strong> Request a reclined/lying position for your session. Keep fruit juice at your side. Yawning, cold sweats, or tunnel vision are early warnings — inform your artist immediately to pause and elevate your legs 30°.' 
          : '• <strong>Recommended Protocol:</strong> Standard ergonomic seating. Stay seated for 10 minutes after procedure before standing up rapidly.'}
      </div>
    </div>
  `;
}

function updateArtistReadiness() {
  const procVal = document.getElementById('q-proc-select')?.value || 'tattoo_body';
  const historyVal = document.getElementById('q-history-select')?.value || 'none';
  const box = document.getElementById('readiness-output-box');

  if (!box) return;

  const nsaidChecked    = document.getElementById('q-med-nsaid')?.checked;
  const numbingChecked  = document.getElementById('q-med-numbing')?.checked;
  const retinoidChecked  = document.getElementById('q-med-retinoid')?.checked;
  const bpChecked       = document.getElementById('q-med-bp')?.checked;

  let checklistItems = [];

  if (procVal.includes('tattoo')) {
    checklistItems.push('<strong>Station Setup:</strong> Prepare clean barrier film, extra paper towels, and sterile cold wash solution.');
  } else {
    checklistItems.push('<strong>Station Setup:</strong> Prepare sterile receiving tubes, surgical forceps, and appropriate needle gauge.');
  }

  if (nsaidChecked) {
    checklistItems.push('<strong>Bleeding Protocol:</strong> Client takes NSAIDs/blood thinners. Expect elevated plasma weeping. Use gentle dab wiping with witch hazel/green soap instead of dry scrubbing to protect ink setting.');
  }

  if (numbingChecked) {
    checklistItems.push('<strong>Skin Density Caution:</strong> Client applied numbing cream. Check for skin edema/rubbery texture before outlining. Be prepared for sudden pain shock when cream wears off.');
  }

  if (retinoidChecked) {
    checklistItems.push('<strong>Skin Fragility Warning:</strong> Client has retinoid or steroid exposure. DO NOT use aggressive adhesive second-skin bandages (Saniderm/Tegaderm). Use non-stick sterile absorbent pads with gentle paper tape.');
  }

  if (bpChecked || historyVal === 'fainting') {
    checklistItems.push('<strong>Vasovagal Position:</strong> Recline chair 30° with leg rest slightly raised. Keep fruit juice/glucose tabs at station before starting.');
  }

  if (procVal === 'tattoo_cosmetic' || procVal === 'piercing_oral') {
    checklistItems.push('<strong>Antiviral Check:</strong> Confirm client disclosed any history of lip herpes/cold sores; recommend prophylactic antivirals to prevent post-procedure outbreak.');
  }

  if (historyVal === 'sensitive_skin') {
    checklistItems.push('<strong>Dermal Sensitivity:</strong> Perform 5-minute patch test or use hypoallergenic ink/cleaning agents; avoid fragranced soaps.');
  }

  if (checklistItems.length === 0) {
    checklistItems.push('Standard studio intake and sterile procedure protocols applicable.');
  }

  box.innerHTML = `
    <div class="readiness-checklist-title">
      <span>📋 Studio Precautions & Checklist</span>
      <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Tailored for Artist Intake</span>
    </div>
    <ul class="readiness-list">
      ${checklistItems.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div class="readiness-actions">
      <button class="action-btn secondary" id="copy-readiness-btn" style="font-size:0.78rem; padding:0.4rem 0.8rem;">📋 Copy Artist Checklist</button>
    </div>
  `;

  document.getElementById('copy-readiness-btn')?.addEventListener('click', () => {
    const text = checklistItems.map(i => i.replace(/<[^>]*>/g, '')).join('\n• ');
    navigator.clipboard.writeText('ARTIST SAFETY CHECKLIST:\n• ' + text).then(() => {
      const btn = document.getElementById('copy-readiness-btn');
      if (btn) {
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy Artist Checklist'; }, 2000);
      }
    });
  });
}

function updateBriefTab() {
  const checked = getSelectedMedIds();
  const briefContentEl = document.getElementById('brief-content');
  const briefActionsEl = document.getElementById('brief-actions');

  if (checked.length === 0) {
    briefContentEl.innerHTML = `
      <div class="empty-brief-notice">
        <p>⚠️ No medications selected yet.</p>
        <p><a href="#" id="go-to-checker">Switch to the Interaction Checker</a> and select your medications to generate your custom consultation brief.</p>
      </div>`;
    briefActionsEl.style.display = 'none';
    return;
  }

  const sorted = [...checked].sort((a, b) => {
    const sevOrder = { high: 0, mod: 1, low: 2 };
    return sevOrder[medMap[a].sev] - sevOrder[medMap[b].sev];
  });

  const highCount = sorted.filter(id => medMap[id].sev === 'high').length;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let briefTextHtml = `
    <div class="printable-brief">
      <div class="brief-stamp">Poli International - Client Medication & Safety Brief</div>
      <div class="brief-meta">
        <div><strong>Date Generated:</strong> ${dateStr}</div>
        <div><strong>Total Disclosed Medications:</strong> ${checked.length}</div>
        <div><strong>Risk Profile:</strong> ${highCount > 0 ? '⚠️ High Concern Items Present (Medical Clearance Recommended)' : '✅ Standard Care & Disclosure'}</div>
      </div>

      <div class="brief-section-title">Disclosed Medications & Procedural Impact</div>
      <div class="brief-med-table">
  `;

  sorted.forEach(id => {
    const m = medMap[id];
    const riskPills = (m.riskBadges || []).map(rb => `<span class="card-risk-pill">${escHtml(rb)}</span>`).join(' ');

    briefTextHtml += `
      <div class="brief-med-row ${escHtml(m.sev)}">
        <div class="brief-med-name">
          <strong>${escHtml(m.name)}</strong>
          <small>(${escHtml(m.sub)})</small>
          <span class="sev-badge ${escHtml(m.sev)}">${m.sev.toUpperCase()}</span>
        </div>
        <div class="brief-risk-pills-container">${riskPills}</div>
        <div class="brief-med-details">
          <p><strong>Tattoo Impact:</strong> ${escHtml(m.tattoo)}</p>
          <p><strong>Piercing Impact:</strong> ${escHtml(m.piercing)}</p>
          ${m.wait ? `<p><strong>Recommended Action:</strong> ${escHtml(m.wait)}</p>` : ''}
        </div>
      </div>`;
  });

  briefTextHtml += `
      </div>

      <div class="brief-section-title">Recommended Studio Protocol</div>
      <ul class="brief-protocol-list">
        <li><strong>Hydration & Calories:</strong> Client should eat a full complex carb meal 1-2 hours pre-session and maintain active hydration.</li>
        <li><strong>Client Positioning:</strong> ${highCount > 0 ? 'Recline client during procedure to manage potential vasovagal fainting or lightheadedness.' : 'Standard studio ergonomic seating.'}</li>
        <li><strong>Bleeding & Plasma Management:</strong> ${sorted.some(id => ['pain', 'blood', 'supplement'].includes(medMap[id].cat)) ? 'Expect elevated plasma weeping. Gentle dab wiping recommended to preserve ink setting.' : 'Standard wiping protocol.'}</li>
        <li><strong>Aftercare Bandage Selection:</strong> ${sorted.some(id => ['retinoid', 'corticosteroid'].includes(medMap[id].cat)) ? '⚠️ Skin may be fragile. Avoid aggressive adhesive second-skin bandages (Saniderm/Tegaderm). Use non-stick pads or breathable cling wrap.' : 'Standard aftercare wrap applicable.'}</li>
      </ul>

      <div class="brief-footer-note">
        <em>Notice to Artist / Piercer: This brief is compiled by the client for educational disclosure. It is not a substitute for formal medical clearance from a licensed physician.</em>
      </div>
    </div>
  `;

  briefContentEl.innerHTML = briefTextHtml;
  briefActionsEl.style.display = 'flex';

  renderHealingJourneyTimeline();
}

function copyBriefText() {
  const checked = getSelectedMedIds();
  if (checked.length === 0) return;

  let text = `=== TATTOO & PIERCING MEDICATION CONSULTATION BRIEF ===\n`;
  text += `Date: ${new Date().toLocaleDateString()}\n\n`;
  text += `Selected Medications (${checked.length}):\n`;

  checked.forEach(id => {
    const m = medMap[id];
    text += `- ${m.name} (${m.sub}) [Risk: ${m.sev.toUpperCase()}]\n`;
    text += `  Risks: ${(m.riskBadges || []).join(', ')}\n`;
    text += `  Tattoo: ${m.tattoo}\n`;
    text += `  Piercing: ${m.piercing}\n`;
    if (m.wait) text += `  Action: ${m.wait}\n`;
    text += `\n`;
  });

  text += `Generated via Poli International Medication Reference.\n`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-brief-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
  }).catch(() => {
    alert('Brief copied to clipboard!');
  });
}

// PDF Document Generation using jsPDF
function generateBriefPDF() {
  const checked = getSelectedMedIds();
  if (checked.length === 0) {
    alert('Please select at least one medication first.');
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    window.print();
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let y = 15;

  // Title & Header
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, 210, 28, 'F');
  
  doc.setTextColor(68, 147, 248);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('POLI INTERNATIONAL - STUDIO SAFETY REFERENCE', 14, 11);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Client Medication & Safety Consultation Brief', 14, 20);

  y = 36;

  // Metadata Box
  doc.setFillColor(240, 243, 246);
  doc.setDrawColor(200, 205, 210);
  doc.roundedRect(14, y, 182, 20, 3, 3, 'FD');

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date Generated: ${dateStr}`, 18, y + 6);
  doc.text(`Total Disclosed Medications: ${checked.length}`, 18, y + 12);

  const highCount = checked.filter(id => medMap[id].sev === 'high').length;
  doc.setFont('helvetica', 'bold');
  if (highCount > 0) {
    doc.setTextColor(200, 40, 40);
    doc.text(`Risk Assessment: HIGH CONCERN ITEMS PRESENT (Medical clearance advised)`, 18, y + 17);
  } else {
    doc.setTextColor(0, 130, 50);
    doc.text(`Risk Assessment: Standard Disclosure & Routine Caution`, 18, y + 17);
  }

  y += 28;

  // Section Header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 105, 218);
  doc.text('Disclosed Medications & Procedural Effects', 14, y);
  doc.setLineWidth(0.5);
  doc.setDrawColor(9, 105, 218);
  doc.line(14, y + 2, 196, y + 2);

  y += 8;

  const sorted = [...checked].sort((a, b) => {
    const sevOrder = { high: 0, mod: 1, low: 2 };
    return sevOrder[medMap[a].sev] - sevOrder[medMap[b].sev];
  });

  sorted.forEach((id) => {
    const m = medMap[id];

    // Check page space
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 220, 220);
    
    // Severity side border
    if (m.sev === 'high') doc.setDrawColor(230, 50, 50);
    else if (m.sev === 'mod') doc.setDrawColor(210, 140, 20);
    else doc.setDrawColor(60, 180, 80);

    doc.roundedRect(14, y, 182, 32, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(`${m.name} (${m.sub})`, 18, y + 6);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    if (m.sev === 'high') doc.setTextColor(200, 30, 30);
    else if (m.sev === 'mod') doc.setTextColor(180, 110, 0);
    else doc.setTextColor(30, 140, 50);
    doc.text(`[${m.sev.toUpperCase()} RISK]`, 160, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);

    const tattooLines = doc.splitTextToSize(`• Tattoo Impact: ${m.tattoo}`, 170);
    doc.text(tattooLines, 18, y + 12);

    const piercingLines = doc.splitTextToSize(`• Piercing Impact: ${m.piercing}`, 170);
    doc.text(piercingLines, 18, y + 19);

    if (m.wait) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 80, 0);
      const waitLines = doc.splitTextToSize(`• Action: ${m.wait}`, 170);
      doc.text(waitLines, 18, y + 26);
    }

    y += 36;
  });

  // Recommended Protocols Section
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 105, 218);
  doc.text('Recommended Studio Protocols', 14, y);
  doc.line(14, y + 2, 196, y + 2);

  y += 8;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  const protocols = [
    '1. Meal & Hydration: Client should eat a full complex-carb meal 1-2 hours pre-session and maintain active hydration.',
    '2. Positioning: Recline client if taking blood pressure, anxiety, or GLP-1 medications to prevent syncope.',
    '3. Plasma & Bleeding: Expect extra weeping for NSAIDs/blood thinners. Gentle dab wiping is recommended.',
    '4. Aftercare Wrap: Avoid aggressive second-skin adhesives if client takes retinoids or steroids. Use non-stick pads.'
  ];

  protocols.forEach(p => {
    doc.text(p, 16, y);
    y += 5.5;
  });

  y += 6;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  const footerMsg = 'Disclaimer: Educational reference compiled by client for studio disclosure. Not a substitute for formal medical clearance.';
  doc.text(footerMsg, 14, y);

  doc.save(`Tattoo_Piercing_Medication_Brief_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Doctor Consultation Modal Logic
function openDoctorModal() {
  doctorModalEl.style.display = 'flex';
  renderModalMedPills();
  updateDoctorMessageDraft();
}

function closeDoctorModal() {
  doctorModalEl.style.display = 'none';
}

function renderModalMedPills() {
  const checked = getSelectedMedIds();
  if (checked.length === 0) {
    modalMedPillsEl.innerHTML = `<span class="no-meds-pill">No medications currently selected in checker.</span>`;
    return;
  }

  modalMedPillsEl.innerHTML = checked.map(id => {
    const m = medMap[id];
    return `<span class="modal-pill ${escHtml(m.sev)}">${escHtml(m.name)}</span>`;
  }).join(' ');
}

function getLocalizedBrands(med, lang) {
  if (!med || !med.sub) return med ? med.name : '';
  const rawBrands = med.sub.split('/').map(s => s.trim());

  const regionalMap = {
    fr: ['Doliprane', 'Dafalgan', 'Efferalgan', 'Spidifen', 'Apranax', 'Subutex', 'Valium', 'Xanax', 'Curacne', 'TKTX', 'Advil', 'Nurofen'],
    es: ['Gelocatil', 'Termalgin', 'Espidifen', 'Neobrufen', 'Nolotil', 'Antalgin', 'Orfidal', 'Valium', 'Accutane', 'TKTX', 'Advil'],
    it: ['Tachipirina', 'Momendol', 'Contramal', 'TKTX', 'Brufen', 'Roaccutane', 'Xanax', 'Ascriptin', 'Advil', 'Nurofen'],
    de: ['Ratiopharm', 'Ibu-Ratiopharm', 'Paralen', 'Ben-u-ron', 'Voltaren', 'Aspirin', 'Roaccutan', 'Xanax', 'Advil'],
    pt: ['Ben-u-ron', 'Alivium', 'Dorflex', 'Anador', 'Xanax', 'TKTX', 'Advil'],
    nl: ['Calpol', 'Panadol', 'Brufen', 'Nurofen', 'Advil', 'Aspirin']
  };

  const targeted = regionalMap[lang] || ['Advil', 'Nurofen', 'Tylenol', 'Panadol', 'Accutane', 'Xanax', 'Ozempic', 'EMLA', 'TKTX'];
  
  const matched = rawBrands.filter(b => 
    targeted.some(t => b.toLowerCase().includes(t.toLowerCase()))
  );

  if (matched.length > 0) {
    return matched.slice(0, 2).join(' / ');
  }

  return rawBrands.slice(0, 2).join(' / ');
}

function updateDoctorMessageDraft() {
  const docName     = docNameInput.value.trim() || 'Dr. [Doctor Name]';
  const patientName = patientNameInput.value.trim() || '[Your Name]';
  const procType    = procTypeInput.value.trim() || '[Tattoo / Piercing Procedure]';
  const procDate    = procDateInput.value ? new Date(procDateInput.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Appointment Date]';

  const checked = getSelectedMedIds();
  let medListFormatted = '';

  if (checked.length > 0) {
    medListFormatted = checked.map(id => {
      const m = medMap[id];
      const localizedBrand = getLocalizedBrands(m, currentLang);
      const brandSuffix = localizedBrand && localizedBrand !== m.name ? ` (e.g., ${localizedBrand})` : '';

      let riskSummary = 'Requires procedural awareness and precautions.';
      if (m.tattoo) {
        const sentence = m.tattoo.split('.')[0].trim();
        if (sentence) riskSummary = sentence + '.';
      }

      return `• ${m.name}${brandSuffix}: ${riskSummary}`;
    }).join('\n\n');
  } else {
    medListFormatted = '• [List of medications currently taking]';
  }

  const draftText = `Dear ${docName},

I hope this message finds you well.

I am reaching out to inform you that I have an upcoming ${procType} scheduled for ${procDate}. 

Because body modification procedures involve localized skin puncture and mild trauma, I want to ensure my current medication routine is safe. I am currently taking the following medication(s):

${medListFormatted}

Could you please advise if:
1. It is safe for me to proceed with this procedure while taking these medications.
2. I should temporarily adjust or pause any of these medications prior to or after the appointment.
3. You have any specific precautions or medical guidance I should share with my tattoo artist or piercer.

Thank you very much for your time and guidance.

Sincerely,
${patientName}`;

  if (modalDraftArea) {
    modalDraftArea.value = draftText;
  }
}

function copyDoctorMessage() {
  if (!modalDraftArea.value) return;
  navigator.clipboard.writeText(modalDraftArea.value).then(() => {
    copyDocMsgBtn.innerHTML = '✅ Copied to Clipboard!';
    setTimeout(() => { copyDocMsgBtn.innerHTML = '📋 Copy Draft Message'; }, 2000);
  }).catch(() => {
    alert('Message copied to clipboard!');
  });
}

function openDoctorEmailClient() {
  const docName  = docNameInput.value.trim() || 'Doctor';
  const subject  = encodeURIComponent(`Medical Inquiry regarding upcoming ${procTypeInput.value.trim() || 'Tattoo/Piercing'} procedure`);
  const bodyText = encodeURIComponent(modalDraftArea.value);
  window.location.href = `mailto:?subject=${subject}&body=${bodyText}`;
}

function printDoctorMessage() {
  document.body.classList.add('printing-doctor-note');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-doctor-note');
  }, 1000);
}

/* Interactive Studio Safety & Lifestyle Quiz Engine */
let quizCurrentIndex = 0;
let quizScore = 0;
let quizAnswered = false;

const QUIZ_QUESTIONS = [
  {
    q: "Can I smoke cannabis or consume THC edibles right before my tattoo appointment to relax?",
    options: [
      "A) Yes, it completely numbs physical pain and makes the session effortless.",
      "B) No! THC causes vasodilation, increases heart rate, and can heighten anxiety or pain sensitivity.",
      "C) Only if combined with alcohol."
    ],
    correct: 1,
    explanation: "THC dilates blood vessels (increasing plasma weeping) and triggers sympathetic nervous arousal, often heightening pain perception or triggering panic/fainting during skin puncture."
  },
  {
    q: "What happens if you get tattooed with a severe alcohol hangover?",
    options: [
      "A) Nothing, hangovers don't affect skin or blood.",
      "B) Severe dehydration, blood thinning, heavy plasma weeping pushing ink out, and increased pain sensitivity.",
      "C) Tattoo ink sets faster because alcohol sterilizes skin from inside."
    ],
    correct: 1,
    explanation: "Alcohol suppresses antidiuretic hormone (causing dehydration), thins blood, drops blood sugar, and causes heavy plasma weeping that dilutes tattoo ink and increases scab formation."
  },
  {
    q: "Does vaping or smoking cigarettes affect how a fresh piercing or tattoo heals?",
    options: [
      "A) No, nicotine only affects lungs.",
      "B) Yes! Nicotine causes microvascular vasoconstriction, starving fresh skin wounds of oxygen and delaying healing.",
      "C) It speeds up skin healing by keeping blood pressure high."
    ],
    correct: 1,
    explanation: "Nicotine shrinks tiny skin capillaries, restricting oxygenated blood supply required for dermal cellular repair and piercing fistula formation."
  },
  {
    q: "Is it safe to slather half a tub of TKTX or EMLA numbing cream under plastic wrap for 4 hours?",
    options: [
      "A) Yes, the thicker the layer, the safer it is.",
      "B) No! Covering large body areas can cause systemic lidocaine toxicity, chemical skin burns, and severe rebound pain shock.",
      "C) It turns skin into leather permanently."
    ],
    correct: 1,
    explanation: "High-potency local anesthetics absorbed over large surfaces risk systemic cardiovascular toxicity, localized swelling, and extreme rebound pain when the numbness wears off."
  },
  {
    q: "You have a headache 1 hour before your tattoo session. Which OTC painkiller is safer to take?",
    options: [
      "A) Ibuprofen (Advil/Nurofen), because it reduces inflammation.",
      "B) Paracetamol / Acetaminophen (Tylenol/Panadol), because it does NOT thin blood or increase procedural bleeding.",
      "C) High-dose Aspirin."
    ],
    correct: 1,
    explanation: "Ibuprofen and NSAIDs inhibit COX-1 and platelet aggregation, increasing bleeding. Paracetamol works centrally without affecting blood clotting or bleeding."
  },
  {
    q: "A client taking Accutane (Isotretinoin) wants a small tattoo or piercing. What should you advise?",
    options: [
      "A) Go ahead! Small tattoos don't bleed.",
      "B) Stop! Accutane thins skin and alters cell turnover, causing severe scarring and non-healing wounds. They must wait 6–12 months post-treatment.",
      "C) Just apply extra moisturizer after."
    ],
    correct: 1,
    explanation: "Accutane fundamentally impairs dermal wound healing and stratum corneum integrity, risking hypertrophic scarring, ink blowout, and non-healing piercing fistulas."
  },
  {
    q: "During a long tattoo session, you feel sudden cold sweats, yawning, and blurred vision. What is the best immediate action?",
    options: [
      "A) Hold your breath and stay quiet so the artist finishes faster.",
      "B) Tell your artist immediately to pause, lay flat on your back, elevate legs 30°, and sip fruit juice.",
      "C) Stand up rapidly and run outside."
    ],
    correct: 1,
    explanation: "These are classic prodromal symptoms of vasovagal syncope. Laying flat with elevated legs immediately restores blood flow to the brain and aborts fainting."
  }
];

function initQuiz() {
  quizCurrentIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-body');
  if (!container) return;

  if (quizCurrentIndex >= QUIZ_QUESTIONS.length) {
    let rankTitle = '🏆 Master Studio Safety Expert!';
    let rankDesc = 'Incredible job! You have an outstanding understanding of medication interactions, alcohol/substance risks, and studio aftercare safety.';
    if (quizScore < 5) {
      rankTitle = '🩹 Studio Safety Apprentice';
      rankDesc = 'Good effort! Review the Studio Safety guide and FAQs to sharpen your knowledge on painkillers, alcohol, and syncope prevention.';
    }

    container.innerHTML = `
      <div class="quiz-summary-box">
        <div class="quiz-score-badge">${quizScore} / ${QUIZ_QUESTIONS.length}</div>
        <div class="quiz-rank-title">${rankTitle}</div>
        <div class="quiz-rank-desc">${rankDesc}</div>
        <button class="quiz-next-btn" onclick="initQuiz()">🔄 Retake Quiz</button>
      </div>`;
    return;
  }

  const item = QUIZ_QUESTIONS[quizCurrentIndex];
  const optionsHtml = item.options.map((opt, idx) => `
    <button class="quiz-option-btn" data-opt-idx="${idx}">
      ${escHtml(opt)}
    </button>
  `).join('');

  container.innerHTML = `
    <div class="quiz-q-box">
      <div class="quiz-q-header">
        <span class="quiz-q-num">Question ${quizCurrentIndex + 1} of ${QUIZ_QUESTIONS.length}</span>
        <span class="quiz-q-score">Score: ${quizScore}</span>
      </div>
      <div class="quiz-q-text">${escHtml(item.q)}</div>
      <div class="quiz-options-list" id="quiz-options-list">
        ${optionsHtml}
      </div>
      <div id="quiz-feedback" style="display:none;"></div>
      <button class="quiz-next-btn" id="quiz-next-btn" style="display:none;">Next Question ➔</button>
    </div>`;

  const optionBtns = container.querySelectorAll('.quiz-option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;

      const selectedIdx = parseInt(btn.dataset.optIdx, 10);
      const isCorrect = selectedIdx === item.correct;

      if (isCorrect) quizScore++;

      optionBtns.forEach((b, idx) => {
        b.disabled = true;
        if (idx === item.correct) b.classList.add('correct');
        else if (idx === selectedIdx && !isCorrect) b.classList.add('incorrect');
      });

      const feedbackEl = document.getElementById('quiz-feedback');
      feedbackEl.style.display = 'block';
      feedbackEl.className = `quiz-feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
      feedbackEl.innerHTML = `
        <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</strong> ${escHtml(item.explanation)}
      `;

      const nextBtn = document.getElementById('quiz-next-btn');
      nextBtn.style.display = 'inline-block';
      nextBtn.addEventListener('click', () => {
        quizCurrentIndex++;
        quizAnswered = false;
        renderQuizQuestion();
      });
    });
  });
}

function initTrendingSearches() {
  const chips = document.querySelectorAll('.trending-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const term = chip.dataset.term;
      if (!term || !medSearchEl) return;
      medSearchEl.value = term;
      searchQuery = term.toLowerCase().trim();
      if (clearSearchBtn) clearSearchBtn.style.display = 'block';
      renderMedList();
      const medListEl = document.getElementById('med-list');
      if (medListEl) {
        medListEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initReadingProgress() {
  const safetySections = document.querySelectorAll('#tab-safety .guide-section');
  const safetyFill = document.getElementById('safety-progress-fill');
  const safetyText = document.getElementById('safety-progress-text');

  const faqItems = document.querySelectorAll('#tab-faq .faq-item');
  const faqFill = document.getElementById('faq-progress-fill');
  const faqText = document.getElementById('faq-progress-text');

  const readSafetySet = new Set();
  const readFaqSet = new Set();

  function updateSafetyProgress() {
    if (!safetySections.length) return;
    const triggerBottom = window.innerHeight * 0.85;

    safetySections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < triggerBottom && rect.bottom > 0) {
        readSafetySet.add(idx);
      }
    });

    const count = readSafetySet.size;
    const total = safetySections.length;
    const pct = Math.round((count / total) * 100);

    if (safetyFill) safetyFill.style.width = `${pct}%`;
    if (safetyText) safetyText.textContent = `${count} / ${total} Sections Read (${pct}%)`;
  }

  function updateFaqProgress() {
    if (!faqItems.length) return;

    faqItems.forEach((item, idx) => {
      if (item.classList.contains('active') || item.dataset.read === 'true') {
        readFaqSet.add(idx);
      }
    });

    const count = readFaqSet.size;
    const total = faqItems.length;
    const pct = Math.round((count / total) * 100);

    if (faqFill) faqFill.style.width = `${pct}%`;
    if (faqText) faqText.textContent = `${count} / ${total} FAQs Read (${pct}%)`;
  }

  faqItems.forEach((item, idx) => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        item.dataset.read = 'true';
        readFaqSet.add(idx);
        updateFaqProgress();
      });
    }
  });

  window.addEventListener('scroll', () => {
    updateSafetyProgress();
    updateFaqProgress();
  });

  updateSafetyProgress();
  updateFaqProgress();
}

/* Recent Searches Engine (LocalStorage) */
function saveRecentSearch(term) {
  if (!term || term.trim().length < 2) return;
  const clean = term.trim();
  let searches = [];
  try {
    searches = JSON.parse(localStorage.getItem('recent_searches_v1') || '[]');
  } catch (e) { searches = []; }
  
  searches = searches.filter(s => s.toLowerCase() !== clean.toLowerCase());
  searches.unshift(clean);
  if (searches.length > 5) searches = searches.slice(0, 5);

  try {
    localStorage.setItem('recent_searches_v1', JSON.stringify(searches));
  } catch (e) {}

  renderRecentSearches();
}

function renderRecentSearches() {
  const box = document.getElementById('recent-searches-box');
  const container = document.getElementById('recent-chips');
  if (!box || !container) return;

  let searches = [];
  try {
    searches = JSON.parse(localStorage.getItem('recent_searches_v1') || '[]');
  } catch (e) { searches = []; }

  if (searches.length === 0) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  container.innerHTML = searches.map(s => `
    <button class="recent-chip" data-term="${escHtml(s)}">🕒 ${escHtml(s)}</button>
  `).join('');

  container.querySelectorAll('.recent-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const term = btn.dataset.term;
      if (!term || !medSearchEl) return;
      medSearchEl.value = term;
      searchQuery = term.toLowerCase().trim();
      if (clearSearchBtn) clearSearchBtn.style.display = 'block';
      renderMedList();
      const medListEl = document.getElementById('med-list');
      if (medListEl) {
        medListEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function clearRecentSearches() {
  try {
    localStorage.removeItem('recent_searches_v1');
  } catch (e) {}
  renderRecentSearches();
}

function initRecentSearches() {
  renderRecentSearches();

  const clearBtn = document.getElementById('clear-recent-searches');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearRecentSearches);
  }

  if (medSearchEl) {
    medSearchEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && medSearchEl.value.trim().length >= 2) {
        saveRecentSearch(medSearchEl.value.trim());
      }
    });
    medSearchEl.addEventListener('change', () => {
      if (medSearchEl.value.trim().length >= 2) {
        saveRecentSearch(medSearchEl.value.trim());
      }
    });
  }
}

/* Export Functions & Full Clinic Packet Generation */
function exportBriefAsJson() {
  const checked = getSelectedMedIds();
  const patientName = patientNameInput?.value.trim() || 'Client';
  const procType = procTypeInput?.value.trim() || 'Tattoo / Piercing';
  const procDate = procDateInput?.value || '';

  const data = {
    appTitle: "Poli International - Studio Safety & Medication Reference",
    exportDate: new Date().toISOString(),
    clientDetails: {
      patientName,
      procedureType: procType,
      appointmentDate: procDate
    },
    disclosedMedications: checked.map(id => {
      const m = medMap[id];
      return {
        id: m.id,
        name: m.name,
        brandNames: m.sub,
        category: m.cat,
        severity: m.sev,
        riskBadges: m.riskBadges || [],
        tattooImpact: m.tattoo,
        piercingImpact: m.piercing,
        actionRecommendation: m.wait || ""
      };
    }),
    disclaimer: "Educational reference brief. Not formal medical clearance."
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `studio_medication_brief_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportBriefAsTxt() {
  const checked = getSelectedMedIds();
  const patientName = patientNameInput?.value.trim() || 'Client';
  const procType = procTypeInput?.value.trim() || 'Tattoo / Piercing';
  const procDate = procDateInput?.value || '';

  let txt = `========================================================\n`;
  txt += ` POLI INTERNATIONAL - CONSULTATION BRIEF & DISCLOSURE\n`;
  txt += `========================================================\n\n`;
  txt += `Date Generated: ${new Date().toLocaleDateString()}\n`;
  txt += `Client Name: ${patientName}\n`;
  txt += `Procedure Type: ${procType}\n`;
  txt += `Appointment Date: ${procDate || 'Not specified'}\n\n`;

  txt += `DISCLOSED MEDICATIONS (${checked.length}):\n`;
  txt += `--------------------------------------------------------\n`;

  if (checked.length === 0) {
    txt += `(No medications currently selected)\n`;
  } else {
    checked.forEach(id => {
      const m = medMap[id];
      txt += `• ${m.name} (${m.sub})\n`;
      txt += `  Risk Level: ${m.sev.toUpperCase()}\n`;
      txt += `  Risk Factors: ${(m.riskBadges || []).join(', ')}\n`;
      txt += `  Tattoo Impact: ${m.tattoo}\n`;
      txt += `  Piercing Impact: ${m.piercing}\n`;
      if (m.wait) txt += `  Recommended Action: ${m.wait}\n`;
      txt += `\n`;
    });
  }

  txt += `--------------------------------------------------------\n`;
  txt += `RECOMMENDED STUDIO PROTOCOLS:\n`;
  txt += `1. Meal & Hydration: Complex carbs 1.5h pre-session + active electrolyte hydration.\n`;
  txt += `2. Client Position: Recline if taking blood pressure or GLP-1 meds to mitigate syncope.\n`;
  txt += `3. Bandage Selection: Avoid aggressive second-skin adhesives for thin or fragile skin.\n\n`;

  txt += `Notice: Compiled for artist/piercer disclosure. Not a substitute for medical clearance.\n`;

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `studio_medication_brief_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* Interactive Healing Journey Timeline Component */
let currentJourneyProc = 'tattoo';

function renderHealingJourneyTimeline(procType) {
  if (procType) currentJourneyProc = procType;
  const container = document.getElementById('timeline-wrapper');
  if (!container) return;

  const checkedMeds = getSelectedMedIds();
  const selectedCats = checkedMeds.map(id => medMap[id]?.cat);

  const isTattoo = currentJourneyProc === 'tattoo';

  // Tattoo Timeline Data
  const tattooStages = [
    {
      num: 1,
      title: 'Hemostasis, Acute Inflammation & Plasma Exudate',
      days: 'Days 1 – 3',
      desc: 'Immediate physiological wound response following dermal needle punctures. Blood vessels constrict then dilate, releasing clear plasma weeping, mild swelling, localized heat, and initial pigment trapping.',
      alerts: []
    },
    {
      num: 2,
      title: 'Epidermal Re-Epithelialization & Flaking',
      days: 'Days 4 – 10',
      desc: 'Top epidermal skin layer begins shedding damaged cells. Surface scabbing and fine peeling/flaking occur as new epithelial cells migrate underneath to close micro-wounds.',
      alerts: []
    },
    {
      num: 3,
      title: 'Dermal Maturation & "Milky Skin" Layer',
      days: 'Weeks 2 – 4',
      desc: 'Surface peeling resolves, revealing a silvery/milky translucent skin layer over the settling ink. Dermal collagen fibers restructure around pigment particles inside macrophages.',
      alerts: []
    },
    {
      num: 4,
      title: 'Complete Dermal Consolidation & Barrier Restoration',
      days: 'Month 1 – 3+',
      desc: 'Dermal layer is fully stabilized and stratum corneum thickness returns to baseline. Tattoo color depth reaches final clarity and long-term vibrancy.',
      alerts: []
    }
  ];

  if (isTattoo) {
    if (selectedCats.some(c => ['pain', 'blood', 'substance'].includes(c))) {
      tattooStages[0].alerts.push('🩸 <strong>Bleeding & Plasma Risk:</strong> Disclosed NSAIDs, Anticoagulants, or Alcohol delay platelet aggregation. Expect elevated plasma weeping during Days 1–3. Dab gently with clean paper towel.');
    }
    if (selectedCats.includes('numbing')) {
      tattooStages[0].alerts.push('⚡ <strong>Rebound Edema Alert:</strong> Localized numbing cream wearing off causes rebound vasodilation, increasing throbbing and plasma outflow in Stage 1.');
    }
    if (selectedCats.some(c => ['retinoid', 'corticosteroid'].includes(c))) {
      tattooStages[1].alerts.push('⚡ <strong>Skin Fragility Warning:</strong> Isotretinoin (Accutane) or Corticosteroids impair epidermal cell turnover. Avoid aggressive adhesive second-skin bandages (Saniderm/Tegaderm). Use non-stick pads.');
    }
    if (selectedCats.some(c => ['immuno', 'metabolic'].includes(c))) {
      tattooStages[2].alerts.push('🛡️ <strong>Delayed Dermal Repair:</strong> Disclosed Immunosuppressants or GLP-1/Diabetes medications slow collagen synthesis and cellular repair during Stage 3. Maintain strict hygiene.');
    }
    if (selectedCats.includes('hormone')) {
      tattooStages[2].alerts.push('☀️ <strong>Hyperpigmentation Risk:</strong> Estrogen/HRT fluctuations increase melanocyte sensitivity. Apply daily SPF 50+ broad spectrum sunscreen once skin is scab-free.');
    }
  }

  // Piercing Timeline Data
  const piercingStages = [
    {
      num: 1,
      title: 'Hemostatic Plug & Initial Inflammatory Swelling',
      days: 'Days 1 – 3',
      desc: 'Needle creates a tubular channel through dermal or cartilage tissue. Localized edema swells tissue around the metal post, releasing lymph exudate as blood clotting forms the initial seal.',
      alerts: []
    },
    {
      num: 2,
      title: 'Fistula Channel Epithelialization & Crusting',
      days: 'Days 4 – 14',
      desc: 'Epithelial cells migrate inwards from outer entry/exit holes to form a delicate skin tube (fistula) around jewelry. Lymph fluid dries into yellow crusting on metal ends.',
      alerts: []
    },
    {
      num: 3,
      title: 'Fistula Canal Maturation & Tissue Tightening',
      days: 'Weeks 3 – 12',
      desc: 'Internal fistula canal walls thicken, smooth out, and gain structural integrity. Swelling recedes completely and discharge decreases significantly.',
      alerts: []
    },
    {
      num: 4,
      title: 'Complete Fistula Consolidation & Safe Downsizing',
      days: 'Months 3 – 12',
      desc: 'Fistula tube is fully lined with tough, flexible epithelium. Safe for professional jewelry downsizing, style swapping, and daily friction exposure.',
      alerts: []
    }
  ];

  if (!isTattoo) {
    if (selectedCats.some(c => ['pain', 'blood', 'substance'].includes(c))) {
      piercingStages[0].alerts.push('🩸 <strong>Prolonged Channel Oozing:</strong> NSAIDs or Anticoagulants prolong capillary weeping around metal posts during Days 1–3. Do NOT rotate or twist jewelry.');
    }
    if (selectedCats.includes('numbing')) {
      piercingStages[0].alerts.push('⚡ <strong>Post-Numbing Swelling:</strong> Swelling from topical anesthetic may cause jewelry posts to press tight against tissue as numbing wears off.');
    }
    if (selectedCats.includes('retinoid')) {
      piercingStages[1].alerts.push('⚡ <strong>Severe Fistula Impairment:</strong> Isotretinoin (Accutane) halts normal epithelial cell migration. Ear/nose piercing fistulas may remain raw, crusty, and unhealed for months.');
    }
    if (selectedCats.some(c => ['immuno', 'corticosteroid'].includes(c))) {
      piercingStages[2].alerts.push('🛡️ <strong>High Cartilage Infection Risk:</strong> Immunosuppressive therapy impairs localized bacterial defenses. Apply sterile 0.9% saline spray twice daily.');
    }
    if (selectedCats.includes('stimulant')) {
      piercingStages[1].alerts.push('🫀 <strong>Microvascular Constriction:</strong> ADHD stimulants constrict skin capillaries. Ensure hydration and avoid over-cleansing with harsh soaps.');
    }
  }

  const stages = isTattoo ? tattooStages : piercingStages;

  const html = `
    <div class="timeline-track">
      ${stages.map(s => {
        const hasWarning = s.alerts.length > 0;
        return `
          <div class="timeline-stage ${hasWarning ? 'has-warning' : ''}">
            <div class="timeline-node">${s.num}</div>
            <div class="stage-header">
              <span class="stage-title">${escHtml(s.title)}</span>
              <span class="stage-days">${escHtml(s.days)}</span>
            </div>
            <div class="stage-desc">${escHtml(s.desc)}</div>
            ${s.alerts.map(a => `<div class="stage-med-alert">${a}</div>`).join('')}
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;

  const tattooBtn = document.getElementById('journey-toggle-tattoo');
  const piercingBtn = document.getElementById('journey-toggle-piercing');
  if (tattooBtn && piercingBtn) {
    tattooBtn.classList.toggle('active', isTattoo);
    piercingBtn.classList.toggle('active', !isTattoo);
  }
}

function initHealingJourney() {
  const tattooBtn = document.getElementById('journey-toggle-tattoo');
  const piercingBtn = document.getElementById('journey-toggle-piercing');

  if (tattooBtn) {
    tattooBtn.addEventListener('click', () => renderHealingJourneyTimeline('tattoo'));
  }
  if (piercingBtn) {
    piercingBtn.addEventListener('click', () => renderHealingJourneyTimeline('piercing'));
  }

  renderHealingJourneyTimeline('tattoo');
}

/* Printable Medical Cover Page Generator */
function generatePrintCoverPage() {
  const coverEl = document.getElementById('print-cover-page');
  if (!coverEl) return;

  const checked = getSelectedMedIds();
  const patientName = patientNameInput?.value.trim() || 'Client / Patient Name';
  const procType = procTypeInput?.value.trim() || 'Tattoo / Body Piercing Procedure';
  const procDate = procDateInput?.value ? new Date(procDateInput.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();
  const dateGenerated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const sorted = [...checked].sort((a, b) => {
    const sevOrder = { high: 0, mod: 1, low: 2 };
    return sevOrder[medMap[a].sev] - sevOrder[medMap[b].sev];
  });

  const highCount = sorted.filter(id => medMap[id].sev === 'high').length;

  let html = `
    <div class="cover-header">
      <div class="cover-stamp" style="font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:1px;">POLI INTERNATIONAL - STUDIO CLINIC PACKET</div>
      <h1 class="cover-title">Full Medical & Procedural Disclosure Report</h1>
    </div>

    <div class="cover-meta-grid">
      <div class="cover-meta-item">
        <strong>Client / Patient Name:</strong>
        <span>${escHtml(patientName)}</span>
      </div>
      <div class="cover-meta-item">
        <strong>Procedure Type:</strong>
        <span>${escHtml(procType)}</span>
      </div>
      <div class="cover-meta-item">
        <strong>Appointment Date:</strong>
        <span>${escHtml(procDate)}</span>
      </div>
      <div class="cover-meta-item">
        <strong>Report Generated:</strong>
        <span>${dateGenerated}</span>
      </div>
      <div class="cover-meta-item" style="grid-column: span 2;">
        <strong>Procedural Risk Profile:</strong>
        <span style="font-weight:bold; color: ${highCount > 0 ? '#dc2626' : '#16a34a'};">
          ${highCount > 0 ? `⚠️ High Concern Items Present (${highCount} High Risk Item${highCount > 1 ? 's' : ''})` : '✅ Standard Care & Disclosure (Low / Moderate Risk Profile)'}
        </span>
      </div>
    </div>

    <h2 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin-bottom:0.75rem; text-transform:uppercase;">Summary of Disclosed Medications (${checked.length})</h2>
    
    <table class="cover-meds-table">
      <thead>
        <tr>
          <th>Medication / Brand</th>
          <th>Risk Level</th>
          <th>Key Procedural Impact Badges</th>
          <th>Action / Wait Advice</th>
        </tr>
      </thead>
      <tbody>
  `;

  if (checked.length === 0) {
    html += `
      <tr>
        <td colspan="4" style="text-align:center; padding:1.5rem; color:#64748b;">No medications selected prior to generating this clinic packet.</td>
      </tr>`;
  } else {
    sorted.forEach(id => {
      const m = medMap[id];
      const badges = (m.riskBadges || []).join(', ') || 'General Procedural Awareness';
      html += `
        <tr>
          <td><strong>${escHtml(m.name)}</strong><br><small style="color:#64748b;">${escHtml(m.sub)}</small></td>
          <td><strong style="color:${m.sev === 'high' ? '#dc2626' : m.sev === 'mod' ? '#d97706' : '#16a34a'};">${m.sev.toUpperCase()}</strong></td>
          <td>${escHtml(badges)}</td>
          <td>${escHtml(m.wait || 'Standard Studio Protocol')}</td>
        </tr>`;
    });
  }

  html += `
      </tbody>
    </table>

    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1.25rem; margin-top:1.5rem;">
      <h3 style="font-size:0.9rem; font-weight:800; color:#1e293b; margin-bottom:0.5rem; text-transform:uppercase;">Packet Contents Overview</h3>
      <ul style="margin:0; padding-left:1.2rem; font-size:0.83rem; color:#334155; line-height:1.6;">
        <li><strong>Page 2:</strong> Client Consultation Brief & Procedural Protocol Guidelines</li>
        <li><strong>Page 3:</strong> Studio Safety, First Aid & Syncope Prevention Guidelines</li>
        <li><strong>Page 4:</strong> Frequently Asked Questions & Aftercare Reference</li>
      </ul>
    </div>

    <div class="cover-signatures-box">
      <div>
        <div class="cover-sig-line"></div>
        <div class="cover-sig-label">Client Signature & Date</div>
      </div>
      <div>
        <div class="cover-sig-line"></div>
        <div class="cover-sig-label">Artist / Studio Technician Signature & Date</div>
      </div>
    </div>
  `;

  coverEl.innerHTML = html;
}

function printFullClinicPacket() {
  generatePrintCoverPage();
  document.body.classList.add('printing-full-packet');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-full-packet');
  }, 1200);
}

/* Immediate Action Emergency Modal Logic */
function initEmergencyModal() {
  const modal = document.getElementById('emergency-modal');
  const openBtn = document.getElementById('floating-emergency-btn');
  const closeBtnTop = document.getElementById('close-emergency-modal-btn');
  const closeBtnBottom = document.getElementById('close-emergency-modal-bottom');
  const tabBtns = document.querySelectorAll('.emergency-tab');
  const contents = document.querySelectorAll('.emergency-content');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    // Filled on open rather than at load, so a device that changes time zone
    // mid-session (a phone landing in another country) shows the new number.
    const numEl = document.getElementById('emergency-local-number');
    if (numEl && typeof geoEmergencyNumber === 'function') {
      numEl.textContent = geoEmergencyNumber();
    }
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  });

  function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  if (closeBtnTop) closeBtnTop.addEventListener('click', closeModal);
  if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.emergency;
      tabBtns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
      });

      btn.classList.add('active');
      const targetContent = document.getElementById(`emergency-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
      }
    });
  });
}

/* No service worker: the tool runs inside an iframe on poliinternational.com and
   a SW scoped there would cache site assets outside this tool's control. The
   AI Studio sw.js is deliberately not shipped. */
function initServiceWorker() {}

/* Toast Notification Engine */
function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.innerHTML = `<span>${escHtml(msg)}</span>`;
  toast.style.display = 'flex';
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 3400);
}

/* Deep Link / Share Intake Functionality */
function generateShareableDeepLink() {
  const checked = getSelectedMedIds();
  // The tool is served inside an iframe at /tools/<folder>/index.html; share the
  // public page, not the frame URL, or the recipient gets a bare iframe.
  const baseUrl = window.location.origin.indexOf('http') === 0
    ? window.location.origin + '/medication-interaction-checker/'
    : 'https://poliinternational.com/medication-interaction-checker/';
  if (checked.length === 0) return baseUrl;
  return baseUrl + '?meds=' + encodeURIComponent(checked.join(','));
}

function copyShareableDeepLink() {
  const link = generateShareableDeepLink();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('📲 Shareable intake deep link copied to clipboard!');
    }).catch(() => {
      fallbackCopyText(link);
      showToast('📲 Shareable intake deep link copied to clipboard!');
    });
  } else {
    fallbackCopyText(link);
    showToast('📲 Shareable intake deep link copied to clipboard!');
  }
}

function fallbackCopyText(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
}

function initDeepLinkFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  let medsParam = urlParams.get('meds');
  if (!medsParam && window.location.hash.includes('meds=')) {
    medsParam = window.location.hash.split('meds=')[1];
  }
  if (!medsParam) return;

  // Ids go straight into a querySelector below; anything with a quote or bracket
  // throws a SyntaxError and kills the rest of init. Only real id shapes pass.
  const medIds = medsParam
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => /^[a-z0-9_-]+$/.test(s));
  if (medIds.length === 0) return;

  let loadedCount = 0;
  medIds.forEach(id => {
    const chk = document.querySelector(`input[data-med-id="${id}"]`);
    if (chk) {
      chk.checked = true;
      chk.closest('.med-item')?.classList.add('selected');
      loadedCount++;
    }
  });

  if (loadedCount > 0) {
    renderResults();
    updateBriefCount();
    showToast(`📲 Shared intake link loaded: ${loadedCount} medication${loadedCount > 1 ? 's' : ''} pre-selected.`);
  }
}

/* Reminders & Washout Countdown Engine */
function renderRemindersTab() {
  const container = document.getElementById('washout-cards-container');
  const inputEl = document.getElementById('appointment-datetime-input');
  if (!container) return;

  const savedAppt = localStorage.getItem('appointment_datetime');
  if (savedAppt && inputEl && !inputEl.value) {
    inputEl.value = savedAppt;
  }

  const checked = getSelectedMedIds();
  const apptDate = inputEl && inputEl.value ? new Date(inputEl.value) : null;

  if (checked.length === 0) {
    container.innerHTML = `
      <div class="empty-brief-notice">
        <p>⏰ No medications selected for washout calculation.</p>
        <p><a href="#" id="go-to-checker">Switch to the Interaction Checker</a> to select your medications and view specific pre-procedure discontinuation deadlines.</p>
      </div>`;
    return;
  }

  const washoutMeds = checked.map(id => medMap[id]).filter(m => {
    return m.wait || ['pain', 'blood', 'retinoid', 'substance', 'numbing', 'corticosteroid', 'immuno'].includes(m.cat);
  });

  if (washoutMeds.length === 0) {
    container.innerHTML = `
      <div class="empty-brief-notice" style="background:rgba(63, 185, 80, 0.08); border-color:#3fb950;">
        <p>✅ All selected items have standard procedural safety.</p>
        <p>Maintain routine daily dosing unless explicitly directed by your prescribing physician.</p>
      </div>`;
    return;
  }

  let html = '';
  washoutMeds.forEach(m => {
    let countdownStr = 'Set scheduled appointment date & time above to calculate live countdown';

    if (apptDate && !isNaN(apptDate.getTime())) {
      let waitHours = 24;
      const waitText = (m.wait || '').toLowerCase();
      if (waitText.includes('48 hours') || waitText.includes('48h')) waitHours = 48;
      else if (waitText.includes('24 hours') || waitText.includes('24h')) waitHours = 24;
      else if (waitText.includes('72 hours') || waitText.includes('72h')) waitHours = 72;
      else if (waitText.includes('7 days') || waitText.includes('1 week')) waitHours = 168;
      else if (waitText.includes('6 months')) waitHours = 4320;
      else if (waitText.includes('14 days') || waitText.includes('2 weeks')) waitHours = 336;

      const stopDeadline = new Date(apptDate.getTime() - waitHours * 60 * 60 * 1000);
      const now = new Date();
      const diffMs = stopDeadline.getTime() - now.getTime();

      if (diffMs <= 0) {
        countdownStr = '⚠️ STOP IMMEDIATELY (Discontinuation deadline passed or imminent)';
      } else {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0 || days > 0) parts.push(`${hours}h`);
        parts.push(`${mins}m`);

        const formattedDeadline = stopDeadline.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        countdownStr = `⏱️ Stop Intake Deadline: <strong>${formattedDeadline}</strong> (${parts.join(' ')} remaining)`;
      }
    }

    const isHigh = m.sev === 'high';
    html += `
      <div class="washout-card ${isHigh ? 'high-risk-washout' : 'mod-risk-washout'}">
        <div class="washout-card-header">
          <div>
            <span class="washout-drug-title">${escHtml(m.name)}</span>
            <span class="washout-drug-sub">(${escHtml(m.sub)})</span>
          </div>
          <span class="washout-time-badge">${escHtml(m.wait || 'Pre-procedure Pause')}</span>
        </div>
        <div class="washout-desc">
          <strong>Recommended Guidance:</strong> ${escHtml(m.wait || 'Discuss pre-procedure discontinuation with artist/doctor.')}
        </div>
        <div class="washout-countdown-box">
          <span>${countdownStr}</span>
        </div>
        <div class="reminder-card-actions">
          <button class="reminder-action-btn" onclick="scheduleIndividualAlert('${escHtml(m.name)}')">🔔 Set 24h Alert</button>
          <button class="reminder-action-btn" onclick="exportMedIcsEvent('${escHtml(m.name)}', '${escHtml(m.wait || 'Discontinue medication prior to appointment')}')">📅 Add to Calendar (.ics)</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function saveAppointmentDate() {
  const inputEl = document.getElementById('appointment-datetime-input');
  if (!inputEl || !inputEl.value) {
    alert('Please choose a valid appointment date and time.');
    return;
  }
  localStorage.setItem('appointment_datetime', inputEl.value);
  showToast('📅 Appointment date saved! Live washout countdowns calculated.');
  renderRemindersTab();
}

function enableBrowserNotifications() {
  if (!('Notification' in window)) {
    alert('Browser notifications are not supported in your browser.');
    return;
  }

  if (Notification.permission === 'granted') {
    showToast('🔔 Browser notifications active! Alerts will fire before your session.');
    new Notification('Poli Safety Reference', {
      body: 'Browser alerts active for your pre-procedure medication washout deadlines!',
      icon: '/favicon.ico'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToast('🔔 Browser notifications enabled!');
        new Notification('Poli Safety Reference', {
          body: 'Notifications active! We will remind you when to stop taking specific medications.',
          icon: '/favicon.ico'
        });
      }
    });
  } else {
    alert('Browser notifications are currently blocked in your browser settings. Enable permissions in your browser URL bar.');
  }
}

function scheduleIndividualAlert(medName) {
  enableBrowserNotifications();
  showToast(`🔔 Notification reminder scheduled for ${medName}!`);
}

function exportMedIcsEvent(medName, waitText) {
  const inputEl = document.getElementById('appointment-datetime-input');
  if (!inputEl || !inputEl.value) {
    alert('Please select your scheduled appointment date and time first in the box above.');
    return;
  }

  const apptDate = new Date(inputEl.value);
  const title = `Stop Taking ${medName} - Tattoo/Piercing Pre-Procedure Washout`;
  const description = `Pre-procedure medication reminder: Pause taking ${medName} before your tattoo or piercing appointment. Guidance: ${waitText}`;

  const formatIcsDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
  const startIso = formatIcsDate(apptDate);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Poli International//Medication Checker//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `DTSTART:${startIso}`,
    `DTEND:${startIso}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Discontinue ${medName} prior to your scheduled session!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Washout_Reminder_${medName.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`📅 Calendar event (.ics) for ${medName} exported!`);
}

function exportCalendarEvent() {
  const inputEl = document.getElementById('appointment-datetime-input');
  const checked = getSelectedMedIds();
  if (!inputEl || !inputEl.value) {
    alert('Please select your scheduled appointment date and time first!');
    return;
  }

  const apptDate = new Date(inputEl.value);
  const title = 'Tattoo / Piercing Session & Medication Washout Reminder';
  const medsListStr = checked.map(id => medMap[id].name).join(', ') || 'Disclosed medications';
  const description = `Appointment scheduled at studio. Selected medications: ${medsListStr}. Check your Poli Medication Checker brief for pre-procedure instructions!`;

  const formatIcsDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const startIso = formatIcsDate(apptDate);
  const endDate = new Date(apptDate.getTime() + 2 * 60 * 60 * 1000);
  const endIso = formatIcsDate(endDate);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Poli International//Medication Checker//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: 24 hours until tattoo/piercing session! Review medication washout state.',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Poli_Studio_Session_Calendar_Reminder.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📅 Full session calendar reminder (.ics) exported!');
}

/* Quick Print Functionality */
function triggerQuickPrint() {
  updateBriefTab();
  showToast('🖨️ Opening print dialog...');
  setTimeout(() => {
    window.print();
  }, 150);
}

/* Google Calendar .ics Export (Pre-filled Washout Deadlines) */
function exportGoogleCalendarIcs() {
  const inputEl = document.getElementById('appointment-datetime-input');
  const checked = getSelectedMedIds();
  
  if (!inputEl || !inputEl.value) {
    alert('Please select your scheduled appointment date and time first in the box above.');
    return;
  }
  if (checked.length === 0) {
    alert('No medications selected. Please select your medications in the Interaction Checker first.');
    return;
  }

  const apptDate = new Date(inputEl.value);
  const formatIcsDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
  const events = [];

  const washoutMeds = checked.map(id => medMap[id]).filter(m => Boolean(m));

  washoutMeds.forEach(m => {
    let waitHours = 24;
    const waitText = (m.wait || '').toLowerCase();
    if (waitText.includes('48 hours') || waitText.includes('48h')) waitHours = 48;
    else if (waitText.includes('24 hours') || waitText.includes('24h')) waitHours = 24;
    else if (waitText.includes('72 hours') || waitText.includes('72h')) waitHours = 72;
    else if (waitText.includes('7 days') || waitText.includes('1 week')) waitHours = 168;
    else if (waitText.includes('6 months')) waitHours = 4320;
    else if (waitText.includes('14 days') || waitText.includes('2 weeks')) waitHours = 336;

    const stopDeadline = new Date(apptDate.getTime() - waitHours * 60 * 60 * 1000);
    const stopIso = formatIcsDate(stopDeadline);

    const title = `STOP TAKING ${m.name.toUpperCase()} (Pre-Procedure Washout)`;
    const desc = `DISCONTINUATION DEADLINE: Stop taking ${m.name} (${m.sub}).\\nGuidance: ${m.wait || 'Pause prior to procedure.'}\\nScheduled Appointment: ${apptDate.toLocaleString()}`;

    events.push([
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `DTSTART:${stopIso}`,
      `DTEND:${stopIso}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT12H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: Pause ${m.name} now for your upcoming session!`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n'));
  });

  // Also add appointment event itself
  const apptStartIso = formatIcsDate(apptDate);
  const apptEndIso = formatIcsDate(new Date(apptDate.getTime() + 2 * 60 * 60 * 1000));
  const medsSummary = washoutMeds.map(m => `${m.name} (${m.wait || 'Standard Pause'})`).join('; ');

  events.push([
    'BEGIN:VEVENT',
    'SUMMARY:🎨 Tattoo / Piercing Studio Appointment',
    `DESCRIPTION:Scheduled appointment at studio.\\nDisclosed Medications & Washouts: ${medsSummary}`,
    `DTSTART:${apptStartIso}`,
    `DTEND:${apptEndIso}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Tomorrow is your tattoo/piercing appointment! Ensure all medication washouts were completed.',
    'END:VALARM',
    'END:VEVENT'
  ].join('\r\n'));

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Poli International//Google Calendar Washout Integration//EN',
    'X-WR-CALNAME:Medication Washout Deadlines (Google Calendar)',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Google_Calendar_Washout_Deadlines.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📅 Google Calendar .ics file pre-filled & downloaded!');
}

/* Direct Google Calendar Web Event Opener */
function openGoogleCalendarWeb() {
  const inputEl = document.getElementById('appointment-datetime-input');
  const checked = getSelectedMedIds();
  
  if (!inputEl || !inputEl.value) {
    alert('Please select your scheduled appointment date and time first in the box above.');
    return;
  }

  const apptDate = new Date(inputEl.value);
  const isoUtcFormat = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
  
  const startStr = isoUtcFormat(apptDate);
  const endStr = isoUtcFormat(new Date(apptDate.getTime() + 2 * 60 * 60 * 1000));

  const medsSummary = checked.map(id => {
    const m = medMap[id];
    return `• ${m.name} (${m.sub}): ${m.wait || 'Standard Pause'}`;
  }).join('\n') || 'None disclosed';

  const title = 'Tattoo / Piercing Session & Medication Washout Deadlines';
  const details = `PRE-PROCEDURE MEDICATION WASHOUT DEADLINES:\n\n${medsSummary}\n\nGenerated by Poli Medication Interaction Checker.`;

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}`;

  window.open(gcalUrl, '_blank');
  showToast('🌐 Opening Google Calendar with pre-filled washout details...');
}


/* Modal accessibility. Both overlays were mouse-only: no Escape, no focus move,
   so a keyboard user who opened the emergency guide was trapped behind it.
   Delegated + generic so any future .modal-overlay inherits the behaviour. */
(function () {
  var lastFocus = null;

  function openModals() {
    return Array.prototype.filter.call(
      document.querySelectorAll('.modal-overlay'),
      function (m) { return m.style.display && m.style.display !== 'none'; });
  }

  function closeModal(m) {
    m.style.display = 'none';
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    var open = openModals();
    if (open.length) { closeModal(open[open.length - 1]); }
  });

  // Click the backdrop (not the panel) to dismiss, the usual expectation.
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList
        && e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });

  // Remember the opener and move focus into the dialog when one appears.
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button');
    if (!t) return;
    lastFocus = t;
    setTimeout(function () {
      var open = openModals();
      if (!open.length) return;
      var panel = open[open.length - 1];
      panel.setAttribute('tabindex', '-1');
      panel.focus();
    }, 30);
  });
})();

/* ── Supplements tab ──────────────────────────────────────────────────────────
 *
 * Data comes from js/supplement-stacking.js, generated by
 * scripts/build-supplement-stacking.js from SUPP.AI. It is a SNAPSHOT, not a
 * live call: a runtime dependency would break this page when supp.ai is down -
 * on something people read before a procedure - and would send a visitor's
 * supplement list to a third party.
 *
 * THE MOST IMPORTANT BRANCH IS THE ONE THAT FINDS NOTHING. A safety tool that
 * answers silence when it has no data is read as "you are fine". Every miss
 * says so explicitly instead.
 */
let suppQuery = '';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function findSupplement(q) {
  const data = (typeof SUPPLEMENT_STACKING !== 'undefined' && SUPPLEMENT_STACKING) || [];
  const n = q.trim().toLowerCase();
  if (n.length < 2) return null;
  return data.find((s) => s.supplement.toLowerCase() === n)
      || data.find((s) => s.supplement.toLowerCase().includes(n))
      || null;
}

function renderSupplementResults() {
  const box = document.getElementById('supp-results');
  if (!box) return;
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  if (!suppQuery.trim()) {
    box.innerHTML = '<p class="supp-empty">' + escapeHtml(dict.suppEmpty) + '</p>';
    return;
  }

  const hit = findSupplement(suppQuery);

  // Not in the library at all. This wording is deliberate and must not be
  // softened into something that reads like an all-clear.
  if (!hit) {
    box.innerHTML =
      '<div class="supp-card supp-unknown">'
      + '<h3>' + escapeHtml(dict.suppUnknownTitle) + ' "' + escapeHtml(suppQuery.trim()) + '"</h3>'
      + '<p>' + escapeHtml(dict.suppUnknownBody) + '</p>'
      + '</div>';
    return;
  }

  // Known supplement, but nothing published against the drugs we cover.
  if (!hit.interactions || !hit.interactions.length) {
    box.innerHTML =
      '<div class="supp-card supp-nopairs">'
      + '<h3>' + escapeHtml(hit.supplement) + '</h3>'
      + '<p>' + escapeHtml(dict.suppNoPairs) + '</p>'
      + '</div>';
    return;
  }

  box.innerHTML = hit.interactions.map((i) => {
    const clinical = i.papers.some((p) => p.clinical);
    const badge = clinical ? dict.suppClinical : dict.suppHuman;
    const papers = i.papers.map((p) =>
      '<li>' + escapeHtml(p.title) + ' (' + escapeHtml(p.year) + ')'
      + (p.pmid ? ' - <a href="https://pubmed.ncbi.nlm.nih.gov/' + encodeURIComponent(p.pmid)
                  + '/" target="_blank" rel="noopener noreferrer">PMID ' + escapeHtml(p.pmid) + '</a>' : '')
      + '</li>').join('');
    return '<div class="supp-card">'
      + '<h3>' + escapeHtml(hit.supplement) + ' + ' + escapeHtml(i.drug) + '</h3>'
      + '<span class="supp-badge">' + escapeHtml(badge) + '</span>'
      + '<p>' + escapeHtml(hit.supplement) + ' + ' + escapeHtml(i.drug) + ' '
      + escapeHtml(dict.suppStudied) + ' ' + i.paperCount + ' ' + escapeHtml(dict.suppStudies) + '</p>'
      + '<ul class="supp-papers">' + papers + '</ul>'
      + '<p class="supp-footer">' + escapeHtml(dict.suppCardFooter) + '</p>'
      + '</div>';
  }).join('');
}

(function initSupplementsTab() {
  const input = document.getElementById('supp-search');
  if (!input) return;
  let t = null;
  input.addEventListener('input', (e) => {
    suppQuery = e.target.value;
    clearTimeout(t);
    t = setTimeout(renderSupplementResults, 180);
  });
  renderSupplementResults();
})();
