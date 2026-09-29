// ═══════════════════════════════════════════════════════════════
// PAIN-DATABASE.JS - Comprehensive Pain Level & Anatomical Discomfort Data (V2)
// 13 Piercing Placements + 11 Tattoo Benchmark Reference Placements
// Grounded in professional studio observations. Zero simulated metrics.
// Fully internationalized with character-for-character translation keys.
// ═══════════════════════════════════════════════════════════════

(function() {
    window.piercingPainLevels = {
        "earlobe": {
                "id": "earlobe",
                "nameKey": "piercing.earlobe.name",
                "name": "Ear Lobe",
                "pain_level": 2,
                "categoryKey": "category.minimal",
                "category": "Minimal Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts_key": "piercing.earlobe.why",
                "why_hurts": "Soft fleshy tissue with minimal cartilage and moderate nerve density.",
                "feels_like_key": "piercing.earlobe.feels",
                "feels_like": "Quick momentary pinch, comparable to a hard fingernail press, subsiding in seconds.",
                "duration_key": "piercing.earlobe.duration",
                "duration": "Initial pinch lasts 1 second; warm dull throb for 10–20 minutes.",
                "factors": [
                        "Easiest placement to relax through",
                        "Virtually zero cartilage resistance",
                        "Excellent choice for first-time clients"
                ],
                "healing_pain_key": "piercing.earlobe.healing_pain",
                "healing_pain": "Mild tenderness when touched or bumped; virtually painless during rest.",
                "healing_time_key": "piercing.earlobe.healing",
                "healing_time": "6–8 weeks initial healing",
                "best_for": "First-time piercing, multiple stacked lobes",
                "related_tool": {
                        "url": "https://poliinternational.com/jewelry-size-visualizer/",
                        "label": "Jewelry Size Visualizer",
                        "label_key": "tool.jewelry_visualizer"
                },
                "factor_keys": [
                        "piercing.earlobe.factor_1",
                        "piercing.earlobe.factor_2",
                        "piercing.earlobe.factor_3"
                ],
                "best_for_key": "piercing.earlobe.best_for",
		"sensory": {"sharpness": 2, "pressure": 1, "duration": 1, "aftercare": 1}
        },
        "septum": {
                "id": "septum",
                "nameKey": "piercing.septum.name",
                "name": "Septum",
                "pain_level": 3,
                "categoryKey": "category.mild",
                "category": "Mild Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts_key": "piercing.septum.why",
                "why_hurts": "Pierced through the thin membranous sub-cartilaginous \"sweet spot\", not the hard cartilage.",
                "feels_like_key": "piercing.septum.feels",
                "feels_like": "Sharp, intense pinch accompanied by an automatic eye-watering lacrimal reflex (reflexive, not a pain indicator).",
                "duration_key": "piercing.septum.duration",
                "duration": "Sharp pinch for 2–3 seconds; slight throbbing for a few hours.",
                "factors": [
                        "Locating the membranous sweet spot is critical",
                        "Eyes watering is a normal neurological cranial reflex, not severe pain",
                        "Can be flipped up and hidden easily during initial healing"
                ],
                "healing_pain_key": "piercing.septum.healing_pain",
                "healing_pain": "Tender when the tip of the nose is bumped or during facial movement.",
                "healing_time_key": "piercing.septum.healing",
                "healing_time": "2–3 months initial healing",
                "best_for": "Versatile styling, discreet healing",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-angle-guide/",
                        "label": "Piercing Angle Guide",
                        "label_key": "tool.piercing_angle_guide"
                },
                "factor_keys": [
                        "piercing.septum.factor_1",
                        "piercing.septum.factor_2",
                        "piercing.septum.factor_3"
                ],
                "best_for_key": "piercing.septum.best_for",
		"sensory": {"sharpness": 4, "pressure": 2, "duration": 2, "aftercare": 2}
        },
        "nostril": {
                "id": "nostril",
                "nameKey": "piercing.nostril.name",
                "name": "Nostril",
                "pain_level": 4,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.nostril.why",
                "why_hurts": "Passes through firm alar cartilage with rich blood flow and sensitive local nerve branches.",
                "feels_like_key": "piercing.nostril.feels",
                "feels_like": "Firm, sharp pinch followed by localized heat and involuntary tearing on the pierced side.",
                "duration_key": "piercing.nostril.duration",
                "duration": "Sharp pinch lasts 2–4 seconds; warm stinging ache for 1–2 hours.",
                "factors": [
                        "Cartilage resistance requires steady needle drive",
                        "Lacrimal reflex triggers tearing on the pierced side",
                        "Accidental snagging during face washing is common"
                ],
                "healing_pain_key": "piercing.nostril.healing_pain",
                "healing_pain": "Mild soreness; susceptible to accidental snagging on towels or clothing.",
                "healing_time_key": "piercing.nostril.healing",
                "healing_time": "4–6 months initial healing",
                "best_for": "Classic facial accent, studs or hoops after healing",
                "related_tool": {
                        "url": "https://poliinternational.com/jewelry-size-visualizer/",
                        "label": "Jewelry Size Visualizer",
                        "label_key": "tool.jewelry_visualizer"
                },
                "factor_keys": [
                        "piercing.nostril.factor_1",
                        "piercing.nostril.factor_2",
                        "piercing.nostril.factor_3"
                ],
                "best_for_key": "piercing.nostril.best_for",
		"sensory": {"sharpness": 5, "pressure": 3, "duration": 2, "aftercare": 3}
        },
        "helix": {
                "id": "helix",
                "nameKey": "piercing.helix.name",
                "name": "Helix (Upper Ear Cartilage)",
                "pain_level": 4,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.helix.why",
                "why_hurts": "Penetrates the upper cartilage rim (avascular, firm structure requiring greater needle driving force).",
                "feels_like_key": "piercing.helix.feels",
                "feels_like": "A crisp, distinct crunch sensation accompanied by a sharp pinch and immediate burning heat.",
                "duration_key": "piercing.helix.duration",
                "duration": "Needle passage lasts 2–3 seconds; persistent throbbing warmth for 12–24 hours.",
                "factors": [
                        "Cartilage crunch sound is audible to client",
                        "Sleeping pressure causes throbbing flares",
                        "Hair snagging can prolong irritation"
                ],
                "healing_pain_key": "piercing.helix.healing_pain",
                "healing_pain": "Sensitive to pressure; sleeping on the pierced ear causes significant throbbing.",
                "healing_time_key": "piercing.helix.healing",
                "healing_time": "6–9 months initial healing",
                "best_for": "Ear styling, stacking, studs or hoops",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-angle-guide/",
                        "label": "Piercing Angle Guide",
                        "label_key": "tool.piercing_angle_guide"
                },
                "factor_keys": [
                        "piercing.helix.factor_1",
                        "piercing.helix.factor_2",
                        "piercing.helix.factor_3"
                ],
                "best_for_key": "piercing.helix.best_for",
		"sensory": {"sharpness": 5, "pressure": 4, "duration": 3, "aftercare": 6}
        },
        "dermal_anchor": {
                "id": "dermal_anchor",
                "nameKey": "piercing.dermal_anchor.name",
                "name": "Dermal Anchor (Microdermal)",
                "pain_level": 5,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.dermal_anchor.why",
                "why_hurts": "Single-point skin entry using a dermal punch or needle pocket to seat an anchor foot in the sub-dermis.",
                "feels_like_key": "piercing.dermal_anchor.feels",
                "feels_like": "A sharp, focused skin pinch during pocket creation, followed by firm internal pressing as the anchor plate is seated.",
                "duration_key": "piercing.dermal_anchor.duration",
                "duration": "Pocket creation and seating take 4–7 seconds; localized soreness for 3–5 days.",
                "factors": [
                        "Placement mobility: low-movement flat surfaces hurt less than joints",
                        "Method: biopsy dermal punch vs needle pocketing technique",
                        "Zero tolerance for snagging during early anchor integration"
                ],
                "healing_pain_key": "piercing.dermal_anchor.healing_pain",
                "healing_pain": "Moderate surface tenderness; vulnerable to snagging on loose threads and towels.",
                "healing_time_key": "piercing.dermal_anchor.healing",
                "healing_time": "2–4 months initial anchor stabilization",
                "best_for": "Collarbone, cheekbone, or flat sternum single-point accents",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-migration-risk/",
                        "label": "Piercing Migration & Rejection Risk Guide"
                },
                "factor_keys": [
                        "piercing.dermal_anchor.factor_1",
                        "piercing.dermal_anchor.factor_2",
                        "piercing.dermal_anchor.factor_3"
                ],
                "best_for_key": "piercing.dermal_anchor.best_for",
		"sensory": {"sharpness": 6, "pressure": 5, "duration": 3, "aftercare": 4}
        },
        "tongue": {
                "id": "tongue",
                "nameKey": "piercing.tongue.name",
                "name": "Tongue",
                "pain_level": 5,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.tongue.why",
                "why_hurts": "High vascularity and muscle tissue; the actual needle pass is surprisingly fast, but post-piercing swelling is significant.",
                "feels_like_key": "piercing.tongue.feels",
                "feels_like": "Firm clamp pressure followed by a quick, blunt passage; surprisingly mild initial puncture.",
                "duration_key": "piercing.tongue.duration",
                "duration": "Puncture takes 2–3 seconds; major swelling and muscle ache peak at days 2–5.",
                "factors": [
                        "Very rapid initial needle puncture",
                        "Post-piercing swelling requires an initial long barbell",
                        "Mandatory downsize after 2 weeks to avoid dental wear"
                ],
                "healing_pain_key": "piercing.tongue.healing_pain",
                "healing_pain": "Initial piercing is mild; eating, speaking, and swallowing cause significant soreness for 5–7 days.",
                "healing_time_key": "piercing.tongue.healing",
                "healing_time": "4–6 weeks initial healing",
                "best_for": "Oral modification with fast mucosal tissue regeneration",
                "related_tool": {
                        "url": "https://poliinternational.com/jewelry-size-visualizer/",
                        "label": "Jewelry Size Visualizer",
                        "label_key": "tool.jewelry_visualizer"
                },
                "factor_keys": [
                        "piercing.tongue.factor_1",
                        "piercing.tongue.factor_2",
                        "piercing.tongue.factor_3"
                ],
                "best_for_key": "piercing.tongue.best_for",
		"sensory": {"sharpness": 4, "pressure": 4, "duration": 2, "aftercare": 7}
        },
        "conch": {
                "id": "conch",
                "nameKey": "piercing.conch.name",
                "name": "Conch",
                "pain_level": 6,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.conch.why",
                "why_hurts": "Thick central auricular cartilage shell requiring steady needle pressure to penetrate.",
                "feels_like_key": "piercing.conch.feels",
                "feels_like": "Deep, firm pressure followed by a sharp pop and localized radiating earache.",
                "duration_key": "piercing.conch.duration",
                "duration": "Needle passage lasts 3–5 seconds; deep dull ache for 24–48 hours.",
                "factors": [
                        "Cartilage thickness varies significantly by ear anatomy",
                        "Protected inside the ear cup from direct pillow friction",
                        "Pressure from in-ear headphones must be avoided during healing"
                ],
                "healing_pain_key": "piercing.conch.healing_pain",
                "healing_pain": "Deep ache when bumped; protected inside ear bowl but sensitive to headphones.",
                "healing_time_key": "piercing.conch.healing",
                "healing_time": "6–12 months initial healing",
                "best_for": "Central ear statement, studs or large hoops when healed",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-angle-guide/",
                        "label": "Piercing Angle Guide",
                        "label_key": "tool.piercing_angle_guide"
                },
                "factor_keys": [
                        "piercing.conch.factor_1",
                        "piercing.conch.factor_2",
                        "piercing.conch.factor_3"
                ],
                "best_for_key": "piercing.conch.best_for",
		"sensory": {"sharpness": 6, "pressure": 8, "duration": 4, "aftercare": 7}
        },
        "daith": {
                "id": "daith",
                "nameKey": "piercing.daith.name",
                "name": "Daith",
                "pain_level": 6,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.daith.why",
                "why_hurts": "Innermost cartilage fold directly above the ear canal; awkward entry angle requiring firm clamp stability.",
                "feels_like_key": "piercing.daith.feels",
                "feels_like": "Heavy, blunt internal ear pressure and a solid crunch as the needle tracks through the fold.",
                "duration_key": "piercing.daith.duration",
                "duration": "4–6 seconds during needle guidance and receiving tube alignment; warm ache for 1–2 days.",
                "factors": [
                        "Tight anatomical space requires meticulous needle guidance",
                        "Audible crunch sounds very loud due to proximity to the ear canal",
                        "Very sheltered location promotes low snagging risk"
                ],
                "healing_pain_key": "piercing.daith.healing_pain",
                "healing_pain": "Tucked away from pillow contact, but tender when cleaning or smiling broadly.",
                "healing_time_key": "piercing.daith.healing",
                "healing_time": "6–9 months initial healing",
                "best_for": "Heart or ornate clicker rings, sheltered ear aesthetics",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-angle-guide/",
                        "label": "Piercing Angle Guide",
                        "label_key": "tool.piercing_angle_guide"
                },
                "factor_keys": [
                        "piercing.daith.factor_1",
                        "piercing.daith.factor_2",
                        "piercing.daith.factor_3"
                ],
                "best_for_key": "piercing.daith.best_for",
		"sensory": {"sharpness": 6, "pressure": 8, "duration": 4, "aftercare": 6}
        },
        "surface_barbell": {
                "id": "surface_barbell",
                "nameKey": "piercing.surface_barbell.name",
                "name": "Surface Barbell",
                "pain_level": 6,
                "categoryKey": "category.moderate",
                "category": "Moderate to High Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.surface_barbell.why",
                "why_hurts": "Subdermal channel tracking across flat body contours to house a 90-degree surface bar under continuous skin tension.",
                "feels_like_key": "piercing.surface_barbell.feels",
                "feels_like": "Two distinct puncture sensations with a firm dragging tension as the passage channel is prepared.",
                "duration_key": "piercing.surface_barbell.duration",
                "duration": "6–10 seconds for tracking and bar insertion; tender swelling for 4–7 days.",
                "factors": [
                        "Tissue mobility: areas of high movement (hips, wrists) experience high tension",
                        "Requires an engineered 90-degree flat-bottom surface barbell, never a curved bar",
                        "High long-term migration risk if subjected to muscle stretching"
                ],
                "healing_pain_key": "piercing.surface_barbell.healing_pain",
                "healing_pain": "Surface tightness and irritation when surrounding muscles flex or stretch.",
                "healing_time_key": "piercing.surface_barbell.healing",
                "healing_time": "3–6 months initial stabilization",
                "best_for": "Nape, sternum, or temple surface modifications",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-migration-risk/",
                        "label": "Piercing Migration & Rejection Risk Guide"
                },
                "factor_keys": [
                        "piercing.surface_barbell.factor_1",
                        "piercing.surface_barbell.factor_2",
                        "piercing.surface_barbell.factor_3"
                ],
                "best_for_key": "piercing.surface_barbell.best_for",
		"sensory": {"sharpness": 7, "pressure": 6, "duration": 4, "aftercare": 5}
        },
        "navel": {
                "id": "navel",
                "nameKey": "piercing.navel.name",
                "name": "Navel",
                "pain_level": 6,
                "categoryKey": "category.moderate",
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts_key": "piercing.navel.why",
                "why_hurts": "Thick ridge of abdominal skin and collagen tissue subjected to movement every time the torso bends.",
                "feels_like_key": "piercing.navel.feels",
                "feels_like": "Firm clamp pressure followed by a steady, resistant push through dense skin folds.",
                "duration_key": "piercing.navel.duration",
                "duration": "Puncture takes 3–5 seconds; dull muscular ache when sitting or bending for 2–3 days.",
                "factors": [
                        "Suitability depends on navel hood shelf anatomy",
                        "Waistband pressure from high-rise pants will severely irritate wound",
                        "Long healing span due to constant torso movement"
                ],
                "healing_pain_key": "piercing.navel.healing_pain",
                "healing_pain": "Continual friction from waistbands, belts, and bending movements during daily activity.",
                "healing_time_key": "piercing.navel.healing",
                "healing_time": "6–12 months initial healing",
                "best_for": "Classic torso accent, curved barbells or floating navel jewelry",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-migration-risk/",
                        "label": "Piercing Migration & Rejection Risk Guide"
                },
                "factor_keys": [
                        "piercing.navel.factor_1",
                        "piercing.navel.factor_2",
                        "piercing.navel.factor_3"
                ],
                "best_for_key": "piercing.navel.best_for",
		"sensory": {"sharpness": 6, "pressure": 5, "duration": 3, "aftercare": 5}
        },
        "industrial": {
                "id": "industrial",
                "nameKey": "piercing.industrial.name",
                "name": "Industrial (Scaffold)",
                "pain_level": 7,
                "categoryKey": "category.high",
                "category": "High Discomfort",
                "level_class": "high",
                "color_var": "var(--pain-high)",
                "why_hurts_key": "piercing.industrial.why",
                "why_hurts": "Two distinct cartilage piercings (forward helix + outer helix) connected by a single rigid barbell.",
                "feels_like_key": "piercing.industrial.feels",
                "feels_like": "The first hole is a standard cartilage pinch; the second immediately follows on sensitized tissue, followed by barbell insertion tension.",
                "duration_key": "piercing.industrial.duration",
                "duration": "Double puncture sequence (5–8 seconds total); notable throbbing for 2–3 days.",
                "factors": [
                        "Perfect directional alignment across both piercings is mandatory",
                        "Second puncture always feels more acute due to neurological sensitization",
                        "Sleeping on that side is strictly out of the question for months"
                ],
                "healing_pain_key": "piercing.industrial.healing_pain",
                "healing_pain": "Prolonged soreness; shared barbell transmits every bump between both wounds.",
                "healing_time_key": "piercing.industrial.healing",
                "healing_time": "9–12 months initial healing",
                "best_for": "Prominent ear scaffold architecture (anatomy-dependent)",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-angle-guide/",
                        "label": "Piercing Angle Guide",
                        "label_key": "tool.piercing_angle_guide"
                },
                "factor_keys": [
                        "piercing.industrial.factor_1",
                        "piercing.industrial.factor_2",
                        "piercing.industrial.factor_3"
                ],
                "best_for_key": "piercing.industrial.best_for",
		"sensory": {"sharpness": 8, "pressure": 8, "duration": 6, "aftercare": 9}
        },
        "nipple": {
                "id": "nipple",
                "nameKey": "piercing.nipple.name",
                "name": "Nipple",
                "pain_level": 8,
                "categoryKey": "category.high",
                "category": "High Discomfort",
                "level_class": "high",
                "color_var": "var(--pain-high)",
                "why_hurts_key": "piercing.nipple.why",
                "why_hurts": "Extremely high concentration of sensory nerve endings and erectile muscular tissue.",
                "feels_like_key": "piercing.nipple.feels",
                "feels_like": "Intense, breath-catching sharp bite with immediate deep radiating heat.",
                "duration_key": "piercing.nipple.duration",
                "duration": "3–5 seconds per side; sharp sensitivity for 24–48 hours, then dull ache.",
                "factors": [
                        "Deep nervous innervation requires deliberate exhale breathing",
                        "Erectile tissue contraction can cause initial stinging spasms",
                        "Snagging on loofahs, bra lace, or seatbelts requires vigilance"
                ],
                "healing_pain_key": "piercing.nipple.healing_pain",
                "healing_pain": "Hypersensitive to light friction from shirts, seatbelts, and temperature changes.",
                "healing_time_key": "piercing.nipple.healing",
                "healing_time": "9–12 months initial healing",
                "best_for": "Body confidence, aesthetic symmetry",
                "related_tool": {
                        "url": "https://poliinternational.com/piercing-angle-guide/",
                        "label": "Piercing Angle Guide",
                        "label_key": "tool.piercing_angle_guide"
                },
                "factor_keys": [
                        "piercing.nipple.factor_1",
                        "piercing.nipple.factor_2",
                        "piercing.nipple.factor_3"
                ],
                "best_for_key": "piercing.nipple.best_for",
		"sensory": {"sharpness": 9, "pressure": 7, "duration": 4, "aftercare": 7}
        },
        "genital": {
                "id": "genital",
                "nameKey": "piercing.genital.name",
                "name": "Genital Placements",
                "pain_level": 9,
                "categoryKey": "category.severe",
                "category": "Severe Discomfort",
                "level_class": "severe",
                "color_var": "var(--pain-severe)",
                "why_hurts_key": "piercing.genital.why",
                "why_hurts": "Dense sensory innervation, erectile tissue, and vascularity; requires expert studio technique.",
                "feels_like_key": "piercing.genital.feels",
                "feels_like": "Extremely sharp, intense, lightning-quick pinch followed by immediate warm rush and localized throbbing.",
                "duration_key": "piercing.genital.duration",
                "duration": "Puncture is very rapid (1–2 seconds); intense throbbing for 30–60 minutes.",
                "factors": [
                        "Expert studio hygiene and needle speed are paramount",
                        "Client relaxation dramatically reduces muscular clamping resistance",
                        "Substantial blood flow actually allows surprisingly fast healing in most placements"
                ],
                "healing_pain_key": "piercing.genital.healing_pain",
                "healing_pain": "Sensitive to clothing friction, urination stinging, and sexual activity restriction.",
                "healing_time_key": "piercing.genital.healing",
                "healing_time": "4–10 weeks (varies significantly by placement)",
                "best_for": "Intimate body modification by experienced studio specialists",
                "related_tool": {
                        "url": "https://poliinternational.com/jewelry-size-visualizer/",
                        "label": "Jewelry Size Visualizer",
                        "label_key": "tool.jewelry_visualizer"
                },
                "factor_keys": [
                        "piercing.genital.factor_1",
                        "piercing.genital.factor_2",
                        "piercing.genital.factor_3"
                ],
                "best_for_key": "piercing.genital.best_for",
		"sensory": {"sharpness": 9, "pressure": 7, "duration": 3, "aftercare": 6}
        }
};

    window.tattooPainLevels = {
        "outer_shoulder": {
                "id": "outer_shoulder",
                "name": "Outer Shoulder",
                "pain_level": 2,
                "category": "Minimal Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts": "Thick dermis, ample underlying muscle padding, and moderate sensory nerve distribution.",
                "feels_like": "Vibrating scratch or dull cat scratch sensation, easy to zone out during.",
                "duration": "Manageable for multi-hour sessions with minimal fatigue.",
                "factors": [
                        "Thick musculature",
                        "Few nerve clusters",
                        "Ideal first tattoo placement"
                ],
                "healing_pain": "Feels like a light sunburn for 2–4 days.",
                "healing_time": "2–3 weeks",
                "nameKey": "tattoo.outer_shoulder.name",
                "categoryKey": "tattoo.outer_shoulder.category",
                "why_hurts_key": "tattoo.outer_shoulder.why",
                "feels_like_key": "tattoo.outer_shoulder.feels",
                "duration_key": "tattoo.outer_shoulder.duration",
                "healing_pain_key": "tattoo.outer_shoulder.healing_pain",
                "healing_time_key": "tattoo.outer_shoulder.healing",
                "factor_keys": [
                        "tattoo.outer_shoulder.factor_1",
                        "tattoo.outer_shoulder.factor_2",
                        "tattoo.outer_shoulder.factor_3"
                ],
		"sensory": {"sharpness": 2, "pressure": 2, "duration": 2, "aftercare": 2}
        },
        "outer_upper_arm": {
                "id": "outer_upper_arm",
                "name": "Outer Upper Arm (Bicep/Deltoid)",
                "pain_level": 2,
                "category": "Minimal Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts": "Generous muscle mass, stable tissue support, low nerve concentration.",
                "feels_like": "Electric vibration with mild surface scratching.",
                "duration": "Consistently easy to manage over long sessions.",
                "factors": [
                        "Dense muscle cushioning",
                        "Minimal bone proximity"
                ],
                "healing_pain": "Mild sunburn feeling; easy to keep clean.",
                "healing_time": "2–3 weeks",
                "nameKey": "tattoo.outer_upper_arm.name",
                "categoryKey": "tattoo.outer_upper_arm.category",
                "why_hurts_key": "tattoo.outer_upper_arm.why",
                "feels_like_key": "tattoo.outer_upper_arm.feels",
                "duration_key": "tattoo.outer_upper_arm.duration",
                "healing_pain_key": "tattoo.outer_upper_arm.healing_pain",
                "healing_time_key": "tattoo.outer_upper_arm.healing",
                "factor_keys": [
                        "tattoo.outer_upper_arm.factor_1",
                        "tattoo.outer_upper_arm.factor_2"
                ],
		"sensory": {"sharpness": 2, "pressure": 2, "duration": 2, "aftercare": 2}
        },
        "outer_forearm": {
                "id": "outer_forearm",
                "name": "Outer Forearm",
                "pain_level": 2,
                "category": "Minimal Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts": "Sturdy skin and muscular base away from major nerve trunks.",
                "feels_like": "Mild scratching and rhythmic vibration.",
                "duration": "Very manageable over 3–5 hour sessions.",
                "factors": [
                        "Thick skin",
                        "Flat workable surface"
                ],
                "healing_pain": "Mild dryness and peeling after 4–5 days.",
                "healing_time": "2–3 weeks",
                "nameKey": "tattoo.outer_forearm.name",
                "categoryKey": "tattoo.outer_forearm.category",
                "why_hurts_key": "tattoo.outer_forearm.why",
                "feels_like_key": "tattoo.outer_forearm.feels",
                "duration_key": "tattoo.outer_forearm.duration",
                "healing_pain_key": "tattoo.outer_forearm.healing_pain",
                "healing_time_key": "tattoo.outer_forearm.healing",
                "factor_keys": [
                        "tattoo.outer_forearm.factor_1",
                        "tattoo.outer_forearm.factor_2"
                ],
		"sensory": {"sharpness": 3, "pressure": 2, "duration": 3, "aftercare": 2}
        },
        "outer_calf": {
                "id": "outer_calf",
                "name": "Outer Calf",
                "pain_level": 3,
                "category": "Mild Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts": "Thick muscle layer absorbing needle vibration away from the shin bone.",
                "feels_like": "Steady warm vibration with minor burning during shading.",
                "duration": "Comfortable for moderate sessions.",
                "factors": [
                        "Good muscle cushion",
                        "Lower nerve density"
                ],
                "healing_pain": "Mild swelling when standing for prolonged periods on day 2.",
                "healing_time": "2–3 weeks",
                "nameKey": "tattoo.outer_calf.name",
                "categoryKey": "tattoo.outer_calf.category",
                "why_hurts_key": "tattoo.outer_calf.why",
                "feels_like_key": "tattoo.outer_calf.feels",
                "duration_key": "tattoo.outer_calf.duration",
                "healing_pain_key": "tattoo.outer_calf.healing_pain",
                "healing_time_key": "tattoo.outer_calf.healing",
                "factor_keys": [
                        "tattoo.outer_calf.factor_1",
                        "tattoo.outer_calf.factor_2"
                ],
		"sensory": {"sharpness": 3, "pressure": 3, "duration": 3, "aftercare": 3}
        },
        "outer_thigh": {
                "id": "outer_thigh",
                "name": "Outer Thigh",
                "pain_level": 3,
                "category": "Mild Discomfort",
                "level_class": "minimal",
                "color_var": "var(--pain-minimal)",
                "why_hurts": "Large muscle mass and thick subcutaneous layer.",
                "feels_like": "Dull scratch; line work feels crisp but manageable.",
                "duration": "Well-tolerated for long sessions.",
                "factors": [
                        "Substantial padding",
                        "Far from major joints"
                ],
                "healing_pain": "Ache when walking or sitting on hard chairs for 2 days.",
                "healing_time": "2–4 weeks",
                "nameKey": "tattoo.outer_thigh.name",
                "categoryKey": "tattoo.outer_thigh.category",
                "why_hurts_key": "tattoo.outer_thigh.why",
                "feels_like_key": "tattoo.outer_thigh.feels",
                "duration_key": "tattoo.outer_thigh.duration",
                "healing_pain_key": "tattoo.outer_thigh.healing_pain",
                "healing_time_key": "tattoo.outer_thigh.healing",
                "factor_keys": [
                        "tattoo.outer_thigh.factor_1",
                        "tattoo.outer_thigh.factor_2"
                ],
		"sensory": {"sharpness": 3, "pressure": 3, "duration": 3, "aftercare": 3}
        },
        "upper_back": {
                "id": "upper_back",
                "name": "Upper Back",
                "pain_level": 4,
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts": "Thick skin over shoulder blade musculature, though intensity spikes near the spine.",
                "feels_like": "Broad scratchy heat; dull ache over flat muscle zones.",
                "duration": "Manageable for 2–4 hours.",
                "factors": [
                        "Bone proximity near scapula",
                        "Posture fatigue while sitting forward"
                ],
                "healing_pain": "Shirt friction can irritate fresh scabbing.",
                "healing_time": "2–3 weeks",
                "nameKey": "tattoo.upper_back.name",
                "categoryKey": "tattoo.upper_back.category",
                "why_hurts_key": "tattoo.upper_back.why",
                "feels_like_key": "tattoo.upper_back.feels",
                "duration_key": "tattoo.upper_back.duration",
                "healing_pain_key": "tattoo.upper_back.healing_pain",
                "healing_time_key": "tattoo.upper_back.healing",
                "factor_keys": [
                        "tattoo.upper_back.factor_1",
                        "tattoo.upper_back.factor_2"
                ],
		"sensory": {"sharpness": 4, "pressure": 4, "duration": 4, "aftercare": 3}
        },
        "inner_forearm": {
                "id": "inner_forearm",
                "name": "Inner Forearm",
                "pain_level": 5,
                "category": "Moderate Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts": "Thinner, softer skin with closer proximity to superficial veins and tendons.",
                "feels_like": "Sharp, hot scratching with occasional nerve twinges into the wrist.",
                "duration": "Sharp during lining; settling during shading.",
                "factors": [
                        "Skin softness",
                        "Sensitivity spikes near the wrist crease"
                ],
                "healing_pain": "Tender when bending wrist or typing.",
                "healing_time": "2–3 weeks",
                "nameKey": "tattoo.inner_forearm.name",
                "categoryKey": "tattoo.inner_forearm.category",
                "why_hurts_key": "tattoo.inner_forearm.why",
                "feels_like_key": "tattoo.inner_forearm.feels",
                "duration_key": "tattoo.inner_forearm.duration",
                "healing_pain_key": "tattoo.inner_forearm.healing_pain",
                "healing_time_key": "tattoo.inner_forearm.healing",
                "factor_keys": [
                        "tattoo.inner_forearm.factor_1",
                        "tattoo.inner_forearm.factor_2"
                ],
		"sensory": {"sharpness": 5, "pressure": 3, "duration": 5, "aftercare": 4}
        },
        "chest": {
                "id": "chest",
                "name": "Chest / Sternum",
                "pain_level": 6,
                "category": "Moderate to High Discomfort",
                "level_class": "moderate",
                "color_var": "var(--pain-moderate)",
                "why_hurts": "Thin skin directly over the clavicle, sternum, and ribs, vibrating bone structures.",
                "feels_like": "Intense rattling vibration that resonates through the ribcage and collarbones.",
                "duration": "Fatigue sets in quickly after 1.5–2 hours.",
                "factors": [
                        "Bone resonance",
                        "Breath movement during tattooing"
                ],
                "healing_pain": "Tender during deep breaths; tight chest sensation for 3 days.",
                "healing_time": "3–4 weeks",
                "nameKey": "tattoo.chest.name",
                "categoryKey": "tattoo.chest.category",
                "why_hurts_key": "tattoo.chest.why",
                "feels_like_key": "tattoo.chest.feels",
                "duration_key": "tattoo.chest.duration",
                "healing_pain_key": "tattoo.chest.healing_pain",
                "healing_time_key": "tattoo.chest.healing",
                "factor_keys": [
                        "tattoo.chest.factor_1",
                        "tattoo.chest.factor_2"
                ],
		"sensory": {"sharpness": 7, "pressure": 6, "duration": 7, "aftercare": 6}
        },
        "knee": {
                "id": "knee",
                "name": "Knee / Kneecap",
                "pain_level": 7,
                "category": "High Discomfort",
                "level_class": "high",
                "color_var": "var(--pain-high)",
                "why_hurts": "Virtually no muscle padding over the patellar bone and sensitive tendon attachments.",
                "feels_like": "Deep drilling vibration directly into the kneecap joint.",
                "duration": "Intense spikes during needle passage.",
                "factors": [
                        "Direct bone contact",
                        "Joint mobility during healing"
                ],
                "healing_pain": "Significant joint swelling and stiffness when bending.",
                "healing_time": "3–5 weeks",
                "nameKey": "tattoo.knee.name",
                "categoryKey": "tattoo.knee.category",
                "why_hurts_key": "tattoo.knee.why",
                "feels_like_key": "tattoo.knee.feels",
                "duration_key": "tattoo.knee.duration",
                "healing_pain_key": "tattoo.knee.healing_pain",
                "healing_time_key": "tattoo.knee.healing",
                "factor_keys": [
                        "tattoo.knee.factor_1",
                        "tattoo.knee.factor_2"
                ],
		"sensory": {"sharpness": 8, "pressure": 7, "duration": 7, "aftercare": 7}
        },
        "ribs": {
                "id": "ribs",
                "name": "Ribs / Side Torso",
                "pain_level": 8,
                "category": "High Discomfort",
                "level_class": "high",
                "color_var": "var(--pain-high)",
                "why_hurts": "Very thin skin stretched tight over intercostal nerves and rib bones with constant respiratory movement.",
                "feels_like": "Hot razor sensation cutting into bone; breath-catching sharp sting.",
                "duration": "Challenging after 45 minutes; requires deep breathing discipline.",
                "factors": [
                        "Intercostal nerve density",
                        "Every breath shifts the tattoo canvas"
                ],
                "healing_pain": "Hurts to laugh, cough, or twist torso for 4–6 days.",
                "healing_time": "3–4 weeks",
                "nameKey": "tattoo.ribs.name",
                "categoryKey": "tattoo.ribs.category",
                "why_hurts_key": "tattoo.ribs.why",
                "feels_like_key": "tattoo.ribs.feels",
                "duration_key": "tattoo.ribs.duration",
                "healing_pain_key": "tattoo.ribs.healing_pain",
                "healing_time_key": "tattoo.ribs.healing",
                "factor_keys": [
                        "tattoo.ribs.factor_1",
                        "tattoo.ribs.factor_2"
                ],
		"sensory": {"sharpness": 9, "pressure": 7, "duration": 8, "aftercare": 7}
        },
        "spine": {
                "id": "spine",
                "name": "Spine / Vertebrae",
                "pain_level": 9,
                "category": "Severe Discomfort",
                "level_class": "severe",
                "color_var": "var(--pain-severe)",
                "why_hurts": "Direct proximity to central spinal nerves and vertebrae with minimal intervening tissue.",
                "feels_like": "High-voltage electric vibration vibrating through the entire skeletal column.",
                "duration": "Exhausting; sessions usually capped at 1.5–2 hours.",
                "factors": [
                        "Central nervous system proximity",
                        "Constant bone vibration"
                ],
                "healing_pain": "Sensitive to chair backs, car seats, and sleeping on back.",
                "healing_time": "3–4 weeks",
                "nameKey": "tattoo.spine.name",
                "categoryKey": "tattoo.spine.category",
                "why_hurts_key": "tattoo.spine.why",
                "feels_like_key": "tattoo.spine.feels",
                "duration_key": "tattoo.spine.duration",
                "healing_pain_key": "tattoo.spine.healing_pain",
                "healing_time_key": "tattoo.spine.healing",
                "factor_keys": [
                        "tattoo.spine.factor_1",
                        "tattoo.spine.factor_2"
                ],
		"sensory": {"sharpness": 9, "pressure": 8, "duration": 9, "aftercare": 7}
        }
};

    window.getPainDatabase = function(procedureType) {
        return procedureType === "tattoo" ? window.tattooPainLevels : window.piercingPainLevels;
    };
})();
