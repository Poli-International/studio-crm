/**
 * Translated risk-badge labels and their explanations.
 *
 * HAND-AUTHORED, NOT GENERATED. Same rule as med-content-i18n.js: this is
 * clinical copy and no script writes the prose. A script created the scaffold
 * and filled the English from the existing RISK_EXPLANATIONS; everything else
 * is for a person.
 *
 * HOW TO FILL IT IN
 * For each entry, write two things per language:
 *   label   - the short badge text a reader sees, e.g. "Bleeding Risk"
 *   explain - the tooltip sentence explaining the mechanism
 * Leave a value as '' and that language falls back to the English, visibly.
 *
 * THE TOP-LEVEL KEY IS NOT LANGUAGE. It is the English badge string with its
 * emoji stripped, and it is also the lookup key used by the medication data.
 * Never translate it, never re-order it, never add an accent to it: the badge
 * would stop resolving for every reader.
 *
 * 36 badges. 30 already have an English explanation.
 */
const RISK_I18N = {
  "Bleeding Risk": {
    en: { label: "Bleeding Risk", explain: "NSAIDs and blood thinners inhibit platelet aggregation (clotting factors) or thin blood, preventing rapid scab formation during skin perforation." },
    fr: { label: "Risque de saignement", explain: "Les AINS et les anticoagulants inhibent l'agrégation plaquettaire (facteurs de coagulation) ou fluidifient le sang, ce qui empêche la formation rapide d'une croûte lors de la perforation de la peau." },
    it: { label: "Rischio di sanguinamento", explain: "I FANS e gli anticoagulanti inibiscono l'aggregazione piastrinica (fattori della coagulazione) o fluidificano il sangue, impedendo la rapida formazione della crosta durante la perforazione della pelle." },
    es: { label: "Riesgo de sangrado", explain: "Los AINE y los anticoagulantes inhiben la agregación plaquetaria (factores de coagulación) o fluidifican la sangre, lo que impide que se forme rápidamente una costra al perforar la piel." },
    de: { label: "Blutungsrisiko", explain: "NSAR und Blutverdünner hemmen die Blutplättchenaggregation (Gerinnungsfaktoren) oder verdünnen das Blut, sodass sich beim Durchstechen der Haut nicht schnell genug Schorf bildet." },
    nl: { label: "Bloedingsrisico", explain: "NSAID's en bloedverdunners remmen de klontering van bloedplaatjes (stollingsfactoren) of verdunnen het bloed, waardoor er bij het doorprikken van de huid niet snel een korstje ontstaat." },
    pt: { label: "Risco de hemorragia", explain: "Os AINE e os anticoagulantes inibem a agregação plaquetária (fatores de coagulação) ou tornam o sangue mais fluido, impedindo a formação rápida de crosta durante a perfuração da pele." }
  },
  "Bradycardia": {
    en: { label: "Bradycardia", explain: "Beta-blockers slow heart rate, preventing normal cardiac response to pain and triggering dizziness." },
    fr: { label: "Bradycardie", explain: "Les bêtabloquants ralentissent le rythme cardiaque, ce qui empêche la réponse cardiaque normale à la douleur et provoque des vertiges." },
    it: { label: "Bradicardia", explain: "I betabloccanti rallentano la frequenza cardiaca, impediscono la normale risposta del cuore al dolore e provocano vertigini." },
    es: { label: "Bradicardia", explain: "Los betabloqueantes ralentizan la frecuencia cardíaca, impiden la respuesta normal del corazón al dolor y provocan mareos." },
    de: { label: "Bradykardie", explain: "Betablocker verlangsamen den Herzschlag, verhindern die normale Reaktion des Herzens auf Schmerz und lösen Schwindel aus." },
    nl: { label: "Bradycardie", explain: "Bètablokkers vertragen de hartslag, verhinderen de normale reactie van het hart op pijn en veroorzaken duizeligheid." },
    pt: { label: "Bradicardia", explain: "Os betabloqueantes abrandam o ritmo cardíaco, impedem a resposta normal do coração à dor e provocam tonturas." }
  },
  "Cardiac Stress": {
    en: { label: "Cardiac Stress", explain: "Stimulants raise sympathetic activity, elevating blood pressure and heart rate, which makes sitting still through a long painful session far riskier." },
    fr: { label: "Stress cardiaque", explain: "Les stimulants augmentent l'activité sympathique, élèvent la tension artérielle et le rythme cardiaque, ce qui rend bien plus risqué de rester immobile pendant une longue séance douloureuse." },
    it: { label: "Stress cardiaco", explain: "Gli stimolanti aumentano l'attività simpatica, alzando pressione arteriosa e frequenza cardiaca: restare fermi durante una seduta lunga e dolorosa diventa molto più rischioso." },
    es: { label: "Estrés cardíaco", explain: "Los estimulantes aumentan la actividad simpática y elevan la tensión arterial y la frecuencia cardíaca: aguantar quieto una sesión larga y dolorosa resulta mucho más arriesgado." },
    de: { label: "Belastung des Herzens", explain: "Stimulanzien erhöhen die sympathische Aktivität und damit Blutdruck und Herzfrequenz: eine lange, schmerzhafte Sitzung stillzuhalten wird deutlich riskanter." },
    nl: { label: "Belasting van het hart", explain: "Stimulerende middelen verhogen de sympathische activiteit en daarmee bloeddruk en hartslag: een lange, pijnlijke sessie stilzitten wordt een stuk riskanter." },
    pt: { label: "Stress cardíaco", explain: "Os estimulantes aumentam a atividade simpática, elevando a tensão arterial e o ritmo cardíaco: aguentar imóvel uma sessão longa e dolorosa torna-se bastante mais arriscado." }
  },
  "Dehydration Sensitivity": {
    en: { label: "Dehydration Sensitivity", explain: "Diuretic effects increase fluid loss, requiring double the normal water intake to prevent blood pressure drops." },
    fr: { label: "Sensibilité à la déshydratation", explain: "L'effet diurétique augmente les pertes hydriques et impose de boire deux fois plus d'eau que d'habitude pour éviter une chute de tension." },
    it: { label: "Sensibilità alla disidratazione", explain: "L'effetto diuretico aumenta la perdita di liquidi e impone di bere il doppio dell'acqua abituale per evitare cali di pressione." },
    es: { label: "Sensibilidad a la deshidratación", explain: "El efecto diurético aumenta la pérdida de líquidos y obliga a beber el doble de agua de lo habitual para evitar bajadas de tensión." },
    de: { label: "Empfindlich gegenüber Austrocknung", explain: "Die harntreibende Wirkung erhöht den Flüssigkeitsverlust, sodass doppelt so viel Wasser nötig ist, um einen Blutdruckabfall zu vermeiden." },
    nl: { label: "Gevoelig voor uitdroging", explain: "Het vochtafdrijvende effect vergroot het vochtverlies, zodat je twee keer zoveel water moet drinken om een bloeddrukdaling te voorkomen." },
    pt: { label: "Sensibilidade à desidratação", explain: "O efeito diurético aumenta a perda de líquidos e obriga a beber o dobro da água habitual para evitar quedas de tensão." }
  },
  "Delayed Healing": {
    en: { label: "Delayed Healing", explain: "Anticoagulants and steroids slow down fibrin formation and cell proliferation required for wound closure." },
    fr: { label: "Cicatrisation retardée", explain: "Les anticoagulants et les corticoïdes ralentissent la formation de fibrine et la prolifération cellulaire nécessaires à la fermeture de la plaie." },
    it: { label: "Guarigione ritardata", explain: "Anticoagulanti e cortisonici rallentano la formazione di fibrina e la proliferazione cellulare necessarie alla chiusura della ferita." },
    es: { label: "Cicatrización retardada", explain: "Los anticoagulantes y los corticoides ralentizan la formación de fibrina y la proliferación celular necesarias para que la herida cierre." },
    de: { label: "Verzögerte Heilung", explain: "Gerinnungshemmer und Kortikoide verlangsamen die Fibrinbildung und die Zellteilung, die für den Wundverschluss nötig sind." },
    nl: { label: "Vertraagde genezing", explain: "Antistollingsmiddelen en corticosteroïden vertragen de vorming van fibrine en de celdeling die nodig zijn om de wond te sluiten." },
    pt: { label: "Cicatrização retardada", explain: "Os anticoagulantes e os corticoides abrandam a formação de fibrina e a proliferação celular necessárias ao encerramento da ferida." }
  },
  "Drowsiness": {
    en: { label: "Drowsiness", explain: "Antihistamines cause central sedation, making you sleepy during long procedures." },
    fr: { label: "Somnolence", explain: "Les antihistaminiques provoquent une sédation centrale qui donne envie de dormir pendant les longues séances." },
    it: { label: "Sonnolenza", explain: "Gli antistaminici provocano sedazione centrale e fanno venire sonno durante le sedute lunghe." },
    es: { label: "Somnolencia", explain: "Los antihistamínicos provocan sedación central y dan sueño durante las sesiones largas." },
    de: { label: "Schläfrigkeit", explain: "Antihistaminika wirken zentral dämpfend und machen während langer Sitzungen müde." },
    nl: { label: "Slaperigheid", explain: "Antihistaminica werken kalmerend op het centraal zenuwstelsel en maken je slaperig tijdens lange sessies." },
    pt: { label: "Sonolência", explain: "Os anti-histamínicos provocam sedação central e dão sono durante as sessões longas." }
  },
  "Fainting Risk": {
    en: { label: "Fainting Risk", explain: "Vasovagal syncope occurs when pain, stress, or medications trigger a sudden reflex drop in heart rate and blood pressure." },
    fr: { label: "Risque de malaise", explain: "La syncope vasovagale survient lorsque la douleur, le stress ou un médicament déclenchent une chute réflexe et brutale du rythme cardiaque et de la tension artérielle." },
    it: { label: "Rischio di svenimento", explain: "La sincope vasovagale si verifica quando dolore, stress o farmaci scatenano un calo riflesso e improvviso della frequenza cardiaca e della pressione arteriosa." },
    es: { label: "Riesgo de desmayo", explain: "El síncope vasovagal aparece cuando el dolor, el estrés o un medicamento desencadenan una caída refleja y repentina de la frecuencia cardíaca y la tensión arterial." },
    de: { label: "Ohnmachtsrisiko", explain: "Eine vasovagale Synkope entsteht, wenn Schmerz, Stress oder ein Medikament einen plötzlichen Reflexabfall von Herzfrequenz und Blutdruck auslösen." },
    nl: { label: "Risico op flauwvallen", explain: "Een vasovagale collaps ontstaat wanneer pijn, stress of een medicijn een plotselinge reflexmatige daling van hartslag en bloeddruk uitlokt." },
    pt: { label: "Risco de desmaio", explain: "A síncope vasovagal surge quando a dor, o stress ou um medicamento desencadeiam uma queda reflexa e súbita do ritmo cardíaco e da tensão arterial." }
  },
  "Fragile Skin": {
    en: { label: "Fragile Skin", explain: "Dermal layers are thinned, making skin easily torn by friction or adhesive bandage removal." },
    fr: { label: "Peau fragile", explain: "Les couches du derme sont amincies : la peau se déchire facilement sous l'effet des frottements ou du retrait d'un pansement adhésif." },
    it: { label: "Pelle fragile", explain: "Gli strati del derma sono assottigliati: la pelle si lacera facilmente per attrito o alla rimozione di un cerotto adesivo." },
    es: { label: "Piel frágil", explain: "Las capas de la dermis están adelgazadas: la piel se desgarra con facilidad por el roce o al retirar un apósito adhesivo." },
    de: { label: "Empfindliche Haut", explain: "Die Hautschichten sind ausgedünnt: die Haut reißt leicht durch Reibung oder beim Abziehen eines Pflasters." },
    nl: { label: "Kwetsbare huid", explain: "De huidlagen zijn dunner geworden: de huid scheurt gemakkelijk door wrijving of bij het verwijderen van een pleister." },
    pt: { label: "Pele frágil", explain: "As camadas da derme estão mais finas: a pele rasga-se facilmente com o atrito ou ao retirar um penso adesivo." }
  },
  "Healing Delay": {
    en: { label: "Healing Delay", explain: "Impaired skin cell turnover delays epithelialization of fresh tattoo ink or piercing fistula walls." },
    fr: { label: "Retard de cicatrisation", explain: "Le renouvellement cellulaire de la peau étant ralenti, l'épithélialisation d'un tatouage frais ou des parois du canal d'un piercing prend plus de temps." },
    it: { label: "Ritardo di guarigione", explain: "Il ricambio delle cellule cutanee è rallentato e ritarda l'epitelizzazione di un tatuaggio fresco o delle pareti del tramite di un piercing." },
    es: { label: "Retraso en la cicatrización", explain: "La renovación de las células cutáneas está frenada y retrasa la epitelización de un tatuaje reciente o de las paredes del canal de un piercing." },
    de: { label: "Heilungsverzögerung", explain: "Die Erneuerung der Hautzellen ist gebremst und verzögert die Epithelisierung eines frischen Tattoos oder der Kanalwände eines Piercings." },
    nl: { label: "Genezingsvertraging", explain: "De vernieuwing van huidcellen is geremd en vertraagt het dichtgroeien van een verse tatoeage of van de wand van een piercingkanaal." },
    pt: { label: "Atraso na cicatrização", explain: "A renovação das células da pele está travada e atrasa a epitelização de uma tatuagem recente ou das paredes do canal de um piercing." }
  },
  "Heart Rate Increase": {
    en: { label: "Heart Rate Increase", explain: "Stimulants raise baseline heart rate and sympathetic arousal, increasing jitteriness and pain sensitivity." },
    fr: { label: "Accélération du rythme cardiaque", explain: "Les stimulants augmentent le rythme cardiaque de base et l'activation sympathique, ce qui accroît la nervosité et la sensibilité à la douleur." },
    it: { label: "Aumento della frequenza cardiaca", explain: "Gli stimolanti alzano la frequenza cardiaca di base e l'attivazione simpatica, aumentando nervosismo e sensibilità al dolore." },
    es: { label: "Aumento de la frecuencia cardíaca", explain: "Los estimulantes elevan la frecuencia cardíaca basal y la activación simpática, lo que aumenta el nerviosismo y la sensibilidad al dolor." },
    de: { label: "Erhöhte Herzfrequenz", explain: "Stimulanzien erhöhen den Ruhepuls und die sympathische Erregung, was Nervosität und Schmerzempfindlichkeit steigert." },
    nl: { label: "Verhoogde hartslag", explain: "Stimulerende middelen verhogen de rusthartslag en de sympathische prikkeling, wat onrust en pijngevoeligheid vergroot." },
    pt: { label: "Aumento da frequência cardíaca", explain: "Os estimulantes elevam o ritmo cardíaco de base e a ativação simpática, aumentando o nervosismo e a sensibilidade à dor." }
  },
  "Heightened Sensitivity": {
    en: { label: "Heightened Sensitivity", explain: "THC alters pain perception unpredictably, so skin puncture can feel sharper than expected and anxiety can escalate mid-session." },
    fr: { label: "Sensibilité accrue", explain: "Le THC modifie la perception de la douleur de façon imprévisible : la perforation de la peau peut sembler plus vive que prévu et l'anxiété peut monter en pleine séance." },
    it: { label: "Sensibilità accentuata", explain: "Il THC altera in modo imprevedibile la percezione del dolore: la perforazione può risultare più intensa del previsto e l'ansia può crescere durante la seduta." },
    es: { label: "Sensibilidad aumentada", explain: "El THC altera la percepción del dolor de forma impredecible: la perforación puede notarse más intensa de lo previsto y la ansiedad puede aumentar en plena sesión." },
    de: { label: "Erhöhte Empfindlichkeit", explain: "THC verändert die Schmerzwahrnehmung unvorhersehbar: der Stich kann sich stärker anfühlen als erwartet und die Angst kann mitten in der Sitzung zunehmen." },
    nl: { label: "Verhoogde gevoeligheid", explain: "THC verandert de pijnbeleving onvoorspelbaar: het prikken kan heftiger aanvoelen dan verwacht en de angst kan halverwege de sessie oplopen." },
    pt: { label: "Sensibilidade acrescida", explain: "O THC altera a perceção da dor de forma imprevisível: a perfuração pode parecer mais intensa do que o esperado e a ansiedade pode subir a meio da sessão." }
  },
  "High Bleeding Risk": {
    en: { label: "High Bleeding Risk", explain: "Strong anticoagulants severely inhibit clotting cascades, causing steady arterial or capillary bleeding during skin puncture." },
    fr: { label: "Risque de saignement élevé", explain: "Les anticoagulants puissants inhibent fortement la cascade de coagulation et provoquent un saignement artériel ou capillaire continu lors de la perforation de la peau." },
    it: { label: "Rischio di sanguinamento elevato", explain: "Gli anticoagulanti forti inibiscono pesantemente la cascata coagulativa e causano un sanguinamento arterioso o capillare continuo durante la puntura della pelle." },
    es: { label: "Riesgo de sangrado alto", explain: "Los anticoagulantes potentes inhiben gravemente la cascada de coagulación y provocan un sangrado arterial o capilar continuo al puncionar la piel." },
    de: { label: "Hohes Blutungsrisiko", explain: "Starke Gerinnungshemmer blockieren die Gerinnungskaskade massiv und verursachen beim Durchstechen der Haut eine anhaltende arterielle oder kapillare Blutung." },
    nl: { label: "Hoog bloedingsrisico", explain: "Sterke antistollingsmiddelen remmen de stollingscascade fors en veroorzaken bij het doorprikken van de huid een aanhoudende slagaderlijke of haarvatbloeding." },
    pt: { label: "Risco de hemorragia elevado", explain: "Os anticoagulantes potentes inibem fortemente a cascata de coagulação e provocam uma hemorragia arterial ou capilar contínua durante a punção da pele." }
  },
  "High Infection Risk": {
    en: { label: "High Infection Risk", explain: "Immunosuppressive medications significantly impair bacterial defense, making sterile aftercare critical." },
    fr: { label: "Risque d'infection élevé", explain: "Les immunosuppresseurs réduisent nettement les défenses contre les bactéries : des soins parfaitement stériles deviennent indispensables." },
    it: { label: "Rischio di infezione elevato", explain: "Gli immunosoppressori riducono nettamente le difese contro i batteri: una medicazione sterile diventa indispensabile." },
    es: { label: "Riesgo de infección alto", explain: "Los inmunosupresores reducen notablemente las defensas frente a las bacterias: unos cuidados estériles se vuelven imprescindibles." },
    de: { label: "Hohes Infektionsrisiko", explain: "Immunsuppressiva schwächen die Abwehr gegen Bakterien deutlich, sodass eine sterile Nachsorge unverzichtbar wird." },
    nl: { label: "Hoog infectierisico", explain: "Afweeronderdrukkende medicijnen verzwakken de verdediging tegen bacteriën aanzienlijk, waardoor steriele nazorg onmisbaar wordt." },
    pt: { label: "Risco de infeção elevado", explain: "Os imunossupressores reduzem bastante as defesas contra as bactérias, tornando indispensáveis cuidados estéreis." }
  },
  "Hypoglycemia Risk": {
    en: { label: "Hypoglycemia Risk", explain: "GLP-1 drugs delay stomach emptying and drop blood glucose, causing sudden nausea or weakness if sugar levels drop." },
    fr: { label: "Risque d'hypoglycémie", explain: "Les analogues du GLP-1 ralentissent la vidange gastrique et font baisser la glycémie, ce qui peut provoquer des nausées ou une faiblesse soudaines si le taux de sucre chute." },
    it: { label: "Rischio di ipoglicemia", explain: "I farmaci GLP-1 rallentano lo svuotamento gastrico e abbassano la glicemia, causando nausea o debolezza improvvise se lo zucchero cala." },
    es: { label: "Riesgo de hipoglucemia", explain: "Los fármacos GLP-1 retrasan el vaciado gástrico y bajan la glucemia, lo que puede causar náuseas o debilidad repentinas si el azúcar cae." },
    de: { label: "Risiko einer Unterzuckerung", explain: "GLP-1-Medikamente verzögern die Magenentleerung und senken den Blutzucker, was bei einem Zuckerabfall plötzliche Übelkeit oder Schwäche auslösen kann." },
    nl: { label: "Risico op lage bloedsuiker", explain: "GLP-1-medicijnen vertragen de maaglediging en verlagen de bloedsuiker, wat plotselinge misselijkheid of zwakte kan geven als de suiker wegzakt." },
    pt: { label: "Risco de hipoglicemia", explain: "Os fármacos GLP-1 atrasam o esvaziamento gástrico e baixam a glicemia, podendo causar náuseas ou fraqueza súbitas se o açúcar descer." }
  },
  "Infection Risk": {
    en: { label: "Infection Risk", explain: "Suppressed immune response reduces white blood cell activity, increasing vulnerability to bacterial skin infection." },
    fr: { label: "Risque d'infection", explain: "Une réponse immunitaire diminuée réduit l'activité des globules blancs et augmente la vulnérabilité aux infections cutanées bactériennes." },
    it: { label: "Rischio di infezione", explain: "Una risposta immunitaria ridotta diminuisce l'attività dei globuli bianchi e aumenta la vulnerabilità alle infezioni cutanee batteriche." },
    es: { label: "Riesgo de infección", explain: "Una respuesta inmunitaria disminuida reduce la actividad de los glóbulos blancos y aumenta la vulnerabilidad a las infecciones cutáneas bacterianas." },
    de: { label: "Infektionsrisiko", explain: "Eine gedämpfte Immunantwort verringert die Aktivität der weißen Blutkörperchen und erhöht die Anfälligkeit für bakterielle Hautinfektionen." },
    nl: { label: "Infectierisico", explain: "Een onderdrukte afweerreactie verlaagt de activiteit van de witte bloedcellen en vergroot de kans op een bacteriële huidinfectie." },
    pt: { label: "Risco de infeção", explain: "Uma resposta imunitária diminuída reduz a atividade dos glóbulos brancos e aumenta a vulnerabilidade a infeções cutâneas bacterianas." }
  },
  "Ink Staining Risk": {
    en: { label: "Ink Staining Risk", explain: "Minocycline can deposit in skin tissue and rarely produce blue-grey pigmentation, changing how healed tattoo ink reads." },
    fr: { label: "Risque de coloration de l'encre", explain: "La minocycline peut se déposer dans les tissus cutanés et provoquer, rarement, une pigmentation gris-bleu qui modifie le rendu de l'encre cicatrisée." },
    it: { label: "Rischio di alterazione dell'inchiostro", explain: "La minociclina può depositarsi nei tessuti cutanei e provocare, raramente, una pigmentazione grigio-bluastra che altera la resa dell'inchiostro guarito." },
    es: { label: "Riesgo de alteración de la tinta", explain: "La minociclina puede depositarse en el tejido cutáneo y provocar, en raras ocasiones, una pigmentación gris azulada que altera el aspecto de la tinta ya curada." },
    de: { label: "Risiko einer Farbveränderung", explain: "Minocyclin kann sich im Hautgewebe ablagern und in seltenen Fällen eine blaugraue Pigmentierung erzeugen, die den Farbeindruck des abgeheilten Tattoos verändert." },
    nl: { label: "Risico op inktverkleuring", explain: "Minocycline kan zich in het huidweefsel afzetten en zelden een blauwgrijze pigmentatie geven, waardoor de genezen inkt er anders uitziet." },
    pt: { label: "Risco de alteração da tinta", explain: "A minociclina pode depositar-se no tecido cutâneo e provocar, raramente, uma pigmentação cinzento-azulada que altera o aspeto da tinta já cicatrizada." }
  },
  "Low Blood Pressure": {
    en: { label: "Low Blood Pressure", explain: "Sedatives and anti-anxiety drugs lower vascular tone, increasing fainting risk upon standing or pain stimulation." },
    fr: { label: "Tension artérielle basse", explain: "Les sédatifs et les anxiolytiques abaissent le tonus vasculaire, ce qui augmente le risque de malaise au lever ou sous l'effet de la douleur." },
    it: { label: "Pressione arteriosa bassa", explain: "Sedativi e ansiolitici abbassano il tono vascolare, aumentando il rischio di svenimento quando ci si alza o sotto stimolo doloroso." },
    es: { label: "Tensión arterial baja", explain: "Los sedantes y ansiolíticos bajan el tono vascular, lo que aumenta el riesgo de desmayo al ponerse de pie o ante el estímulo doloroso." },
    de: { label: "Niedriger Blutdruck", explain: "Beruhigungs- und Angstmittel senken den Gefäßtonus und erhöhen damit das Ohnmachtsrisiko beim Aufstehen oder bei Schmerzreizen." },
    nl: { label: "Lage bloeddruk", explain: "Kalmerings- en angstremmende middelen verlagen de vaatspanning, wat de kans op flauwvallen bij opstaan of bij pijnprikkels vergroot." },
    pt: { label: "Tensão arterial baixa", explain: "Os sedativos e ansiolíticos baixam o tónus vascular, aumentando o risco de desmaio ao levantar ou perante o estímulo doloroso." }
  },
  "Mild Bleeding Risk": {
    en: { label: "Mild Bleeding Risk", explain: "Slight decrease in platelet stickiness or minor blood thinning leading to mild extra oozing." },
    fr: { label: "Risque de saignement léger", explain: "Légère diminution de l'adhésivité des plaquettes ou fluidification modérée du sang, à l'origine d'un suintement un peu plus abondant." },
    it: { label: "Rischio di sanguinamento lieve", explain: "Lieve riduzione dell'adesività delle piastrine o modesta fluidificazione del sangue, con un'essudazione un po' più abbondante." },
    es: { label: "Riesgo de sangrado leve", explain: "Ligera disminución de la adhesividad de las plaquetas o fluidificación moderada de la sangre, con una exudación algo más abundante." },
    de: { label: "Leichtes Blutungsrisiko", explain: "Leicht verringerte Klebrigkeit der Blutplättchen oder geringe Blutverdünnung, mit etwas stärkerem Nässen." },
    nl: { label: "Licht bloedingsrisico", explain: "Licht verminderde plakkerigheid van de bloedplaatjes of lichte bloedverdunning, met wat meer vochtafscheiding." },
    pt: { label: "Risco de hemorragia ligeiro", explain: "Ligeira diminuição da adesividade das plaquetas ou fluidificação moderada do sangue, com uma exsudação um pouco mais abundante." }
  },
  "Minor Pigmentation Risk": {
    en: { label: "Minor Pigmentation Risk", explain: "Hormonal fluctuations sensitize melanocytes, increasing melasma risk when exposed to sun during healing." },
    fr: { label: "Risque de pigmentation mineur", explain: "Les variations hormonales sensibilisent les mélanocytes et augmentent le risque de mélasma en cas d'exposition au soleil pendant la cicatrisation." },
    it: { label: "Rischio di pigmentazione lieve", explain: "Le oscillazioni ormonali sensibilizzano i melanociti e aumentano il rischio di melasma in caso di esposizione al sole durante la guarigione." },
    es: { label: "Riesgo de pigmentación leve", explain: "Las oscilaciones hormonales sensibilizan los melanocitos y aumentan el riesgo de melasma si hay exposición al sol durante la cicatrización." },
    de: { label: "Geringes Pigmentierungsrisiko", explain: "Hormonschwankungen sensibilisieren die Melanozyten und erhöhen das Melasma-Risiko, wenn die Haut während der Heilung Sonne abbekommt." },
    nl: { label: "Licht pigmentatierisico", explain: "Hormoonschommelingen maken de pigmentcellen gevoeliger en vergroten de kans op melasma bij zonlicht tijdens de genezing." },
    pt: { label: "Risco de pigmentação ligeiro", explain: "As oscilações hormonais sensibilizam os melanócitos e aumentam o risco de melasma em caso de exposição ao sol durante a cicatrização." }
  },
  "No Extra Bleeding": {
    en: { label: "No Extra Bleeding", explain: "Does not affect blood clotting or vascular constriction." },
    fr: { label: "Pas de saignement supplémentaire", explain: "N'a aucun effet sur la coagulation du sang ni sur la constriction des vaisseaux." },
    it: { label: "Nessun sanguinamento aggiuntivo", explain: "Non influisce sulla coagulazione del sangue né sulla costrizione dei vasi." },
    es: { label: "Sin sangrado adicional", explain: "No afecta ni a la coagulación de la sangre ni a la constricción de los vasos." },
    de: { label: "Keine zusätzliche Blutung", explain: "Beeinflusst weder die Blutgerinnung noch die Gefäßverengung." },
    nl: { label: "Geen extra bloeding", explain: "Heeft geen invloed op de bloedstolling of op het samentrekken van de bloedvaten." },
    pt: { label: "Sem hemorragia adicional", explain: "Não afeta a coagulação do sangue nem a constrição dos vasos." }
  },
  "Outbreak Prevention": {
    en: { label: "Outbreak Prevention", explain: "Lip trauma triggers dormant HSV-1 herpes cold sores; prophylactic antivirals suppress viral replication." },
    fr: { label: "Prévention des poussées", explain: "Un traumatisme de la lèvre réveille le virus HSV-1 responsable de l'herpès labial ; un antiviral pris en prévention bloque la réplication virale." },
    it: { label: "Prevenzione delle recidive", explain: "Un trauma al labbro risveglia l'herpes labiale HSV-1 latente; un antivirale in profilassi blocca la replicazione virale." },
    es: { label: "Prevención de brotes", explain: "Un traumatismo en el labio despierta el herpes labial HSV-1 latente; un antiviral preventivo bloquea la replicación del virus." },
    de: { label: "Vorbeugung eines Ausbruchs", explain: "Eine Verletzung der Lippe weckt schlummernde HSV-1-Lippenherpes; ein vorbeugendes Virostatikum unterdrückt die Virusvermehrung." },
    nl: { label: "Preventie van een uitbraak", explain: "Een beschadiging van de lip wekt sluimerende HSV-1-koortslip; een antiviraal middel vooraf remt de vermenigvuldiging van het virus." },
    pt: { label: "Prevenção de surtos", explain: "Um traumatismo no lábio desperta o herpes labial HSV-1 latente; um antiviral preventivo bloqueia a replicação do vírus." }
  },
  "Photosensitivity": {
    en: { label: "Photosensitivity", explain: "Certain drugs make skin cells absorb UV rays rapidly, causing severe sunburn-like allergic reactions on fresh tattoos." },
    fr: { label: "Photosensibilité", explain: "Certains médicaments font absorber les rayons UV très rapidement par les cellules de la peau, ce qui provoque sur un tatouage frais des réactions allergiques proches d'un coup de soleil sévère." },
    it: { label: "Fotosensibilità", explain: "Alcuni farmaci fanno assorbire molto rapidamente i raggi UV alle cellule cutanee, provocando su un tatuaggio fresco reazioni allergiche simili a una grave scottatura." },
    es: { label: "Fotosensibilidad", explain: "Algunos medicamentos hacen que las células de la piel absorban los rayos UV muy deprisa, lo que provoca sobre un tatuaje reciente reacciones alérgicas parecidas a una quemadura solar grave." },
    de: { label: "Lichtempfindlichkeit", explain: "Manche Medikamente lassen Hautzellen UV-Strahlen sehr schnell aufnehmen, was auf einem frischen Tattoo allergische Reaktionen wie ein schwerer Sonnenbrand auslöst." },
    nl: { label: "Lichtgevoeligheid", explain: "Sommige medicijnen laten huidcellen uv-straling zeer snel opnemen, wat op een verse tatoeage allergische reacties geeft die op ernstige zonnebrand lijken." },
    pt: { label: "Fotossensibilidade", explain: "Alguns medicamentos fazem as células da pele absorver os raios UV muito depressa, provocando numa tatuagem recente reações alérgicas semelhantes a uma queimadura solar grave." }
  },
  "Plasma Oozing": {
    en: { label: "Plasma Oozing", explain: "When blood clotting is delayed, blood vessel walls leak clear plasma onto skin, diluting tattoo ink and pushing pigment out of dermal layers." },
    fr: { label: "Suintement de plasma", explain: "Quand la coagulation est retardée, la paroi des vaisseaux laisse suinter un plasma clair à la surface de la peau, qui dilue l'encre et repousse le pigment hors du derme." },
    it: { label: "Essudazione di plasma", explain: "Quando la coagulazione è rallentata, le pareti dei vasi lasciano trasudare plasma chiaro sulla pelle, che diluisce l'inchiostro e spinge il pigmento fuori dal derma." },
    es: { label: "Exudación de plasma", explain: "Cuando la coagulación se retrasa, la pared de los vasos deja rezumar plasma transparente sobre la piel, que diluye la tinta y empuja el pigmento fuera de la dermis." },
    de: { label: "Austritt von Wundwasser", explain: "Ist die Gerinnung verzögert, tritt aus den Gefäßwänden klares Wundwasser auf die Haut, das die Farbe verdünnt und Pigment aus der Lederhaut drückt." },
    nl: { label: "Lekkend wondvocht", explain: "Als de stolling vertraagd is, lekt er uit de vaatwanden helder wondvocht op de huid, dat de inkt verdunt en pigment uit de lederhuid duwt." },
    pt: { label: "Exsudação de plasma", explain: "Quando a coagulação está atrasada, a parede dos vasos deixa escorrer plasma transparente sobre a pele, que dilui a tinta e empurra o pigmento para fora da derme." }
  },
  "Rebound Bleeding": {
    en: { label: "Rebound Bleeding", explain: "Epinephrine temporarily shrinks blood vessels. When it wears off, blood vessels dilate rapidly (rebound hyperemia), producing heavy bleeding." },
    fr: { label: "Saignement de rebond", explain: "L'adrénaline resserre temporairement les vaisseaux. Lorsque son effet se dissipe, ils se dilatent brutalement (hyperémie de rebond) et le saignement devient abondant." },
    it: { label: "Sanguinamento di rimbalzo", explain: "L'adrenalina restringe temporaneamente i vasi. Quando l'effetto svanisce, i vasi si dilatano rapidamente (iperemia di rimbalzo) e il sanguinamento diventa abbondante." },
    es: { label: "Sangrado de rebote", explain: "La adrenalina estrecha los vasos temporalmente. Cuando su efecto desaparece, los vasos se dilatan de golpe (hiperemia de rebote) y el sangrado se vuelve abundante." },
    de: { label: "Rebound-Blutung", explain: "Adrenalin verengt die Gefäße vorübergehend. Lässt die Wirkung nach, weiten sie sich schlagartig (Rebound-Hyperämie) und es blutet stark." },
    nl: { label: "Rebound-bloeding", explain: "Adrenaline vernauwt de vaten tijdelijk. Als de werking wegebt, zetten ze zich razendsnel uit (rebound-hyperemie) en gaat het hevig bloeden." },
    pt: { label: "Hemorragia de rebound", explain: "A adrenalina aperta temporariamente os vasos. Quando o efeito passa, os vasos dilatam-se de repente (hiperemia de rebound) e a hemorragia torna-se abundante." }
  },
  "Rebound Shock": {
    en: { label: "Rebound Shock", explain: "When topical numbing wears off mid-session, pain receptors suddenly flood the brain without gradual adaptation, causing intense pain shock." },
    fr: { label: "Choc de rebond", explain: "Lorsque l'anesthésiant local cesse d'agir en pleine séance, les récepteurs de la douleur submergent le cerveau d'un coup, sans adaptation progressive, ce qui provoque un choc douloureux intense." },
    it: { label: "Shock di rimbalzo", explain: "Quando l'anestetico locale smette di agire a metà seduta, i recettori del dolore inondano il cervello all'improvviso, senza adattamento graduale, con uno shock doloroso intenso." },
    es: { label: "Choque de rebote", explain: "Cuando el anestésico tópico deja de actuar a mitad de sesión, los receptores del dolor inundan el cerebro de golpe, sin adaptación gradual, con un choque doloroso intenso." },
    de: { label: "Rebound-Schock", explain: "Lässt die örtliche Betäubung mitten in der Sitzung nach, überfluten die Schmerzrezeptoren das Gehirn schlagartig, ohne allmähliche Gewöhnung, und lösen einen heftigen Schmerzschock aus." },
    nl: { label: "Rebound-schok", explain: "Als de plaatselijke verdoving halverwege uitwerkt, overspoelen de pijnreceptoren de hersenen in één keer, zonder geleidelijke gewenning, met een heftige pijnschok tot gevolg." },
    pt: { label: "Choque de rebound", explain: "Quando o anestésico tópico deixa de atuar a meio da sessão, os recetores da dor inundam o cérebro de uma só vez, sem adaptação gradual, provocando um choque doloroso intenso." }
  },
  "Safe Analgesic": {
    en: { label: "Safe Analgesic", explain: "Acetaminophen/Paracetamol works on central nervous system pain receptors without inhibiting platelet aggregation." },
    fr: { label: "Antalgique sans risque", explain: "Le paracétamol (acétaminophène) agit sur les récepteurs de la douleur du système nerveux central sans inhiber l'agrégation plaquettaire." },
    it: { label: "Analgesico sicuro", explain: "Il paracetamolo (acetaminofene) agisce sui recettori del dolore del sistema nervoso centrale senza inibire l'aggregazione piastrinica." },
    es: { label: "Analgésico seguro", explain: "El paracetamol (acetaminofén) actúa sobre los receptores del dolor del sistema nervioso central sin inhibir la agregación plaquetaria." },
    de: { label: "Unbedenkliches Schmerzmittel", explain: "Paracetamol (Acetaminophen) wirkt auf die Schmerzrezeptoren des zentralen Nervensystems, ohne die Blutplättchenaggregation zu hemmen." },
    nl: { label: "Veilige pijnstiller", explain: "Paracetamol (acetaminofen) werkt op de pijnreceptoren van het centraal zenuwstelsel zonder de klontering van bloedplaatjes te remmen." },
    pt: { label: "Analgésico seguro", explain: "O paracetamol (acetaminofeno) atua sobre os recetores da dor do sistema nervoso central sem inibir a agregação plaquetária." }
  },
  "Sedation Risk": {
    en: { label: "Sedation Risk", explain: "Central nervous system depressants reduce alertness, lowering blood pressure and raising risk of lightheadedness or nausea." },
    fr: { label: "Risque de sédation", explain: "Les dépresseurs du système nerveux central diminuent la vigilance, font baisser la tension artérielle et augmentent le risque d'étourdissement ou de nausée." },
    it: { label: "Rischio di sedazione", explain: "I depressori del sistema nervoso centrale riducono la vigilanza, abbassano la pressione arteriosa e aumentano il rischio di capogiri o nausea." },
    es: { label: "Riesgo de sedación", explain: "Los depresores del sistema nervioso central reducen el estado de alerta, bajan la tensión arterial y aumentan el riesgo de mareo o náuseas." },
    de: { label: "Sedierungsrisiko", explain: "Dämpfende Mittel für das zentrale Nervensystem verringern die Wachheit, senken den Blutdruck und erhöhen das Risiko von Schwindel oder Übelkeit." },
    nl: { label: "Risico op sufheid", explain: "Middelen die het centraal zenuwstelsel dempen verlagen de alertheid en de bloeddruk en vergroten de kans op licht worden in het hoofd of misselijkheid." },
    pt: { label: "Risco de sedação", explain: "Os depressores do sistema nervoso central reduzem o estado de alerta, baixam a tensão arterial e aumentam o risco de tonturas ou náuseas." }
  },
  "Severe Dehydration": {
    en: { label: "Severe Dehydration", explain: "Alcohol suppresses vasopressin, so fluid leaves the body faster than it is replaced, lowering blood volume and raising fainting risk." },
    fr: { label: "Déshydratation sévère", explain: "L'alcool inhibe la vasopressine : les liquides quittent l'organisme plus vite qu'ils ne sont remplacés, ce qui fait baisser le volume sanguin et augmente le risque de malaise." },
    it: { label: "Disidratazione grave", explain: "L'alcol inibisce la vasopressina: i liquidi lasciano il corpo più in fretta di quanto vengano reintegrati, riducendo il volume ematico e aumentando il rischio di svenimento." },
    es: { label: "Deshidratación grave", explain: "El alcohol inhibe la vasopresina: el líquido sale del cuerpo más rápido de lo que se repone, lo que baja el volumen sanguíneo y aumenta el riesgo de desmayo." },
    de: { label: "Starke Austrocknung", explain: "Alkohol hemmt das Vasopressin: Flüssigkeit verlässt den Körper schneller, als sie ersetzt wird, das Blutvolumen sinkt und das Ohnmachtsrisiko steigt." },
    nl: { label: "Ernstige uitdroging", explain: "Alcohol remt vasopressine: er gaat sneller vocht uit het lichaam dan er wordt aangevuld, waardoor het bloedvolume daalt en de kans op flauwvallen stijgt." },
    pt: { label: "Desidratação grave", explain: "O álcool inibe a vasopressina: o líquido sai do corpo mais depressa do que é reposto, o que baixa o volume sanguíneo e aumenta o risco de desmaio." }
  },
  "Severe Scarring": {
    en: { label: "Severe Scarring", explain: "Isotretinoin (Accutane) suppresses sebum and alters skin cell regeneration, causing fragile skin to form keloid or hypertrophic scars." },
    fr: { label: "Cicatrices importantes", explain: "L'isotrétinoïne (Accutane) supprime le sébum et modifie la régénération cellulaire : la peau, fragilisée, forme des cicatrices chéloïdes ou hypertrophiques." },
    it: { label: "Cicatrici gravi", explain: "L'isotretinoina (Accutane) sopprime il sebo e altera la rigenerazione cellulare: la pelle, fragile, forma cicatrici cheloidee o ipertrofiche." },
    es: { label: "Cicatrices graves", explain: "La isotretinoína (Accutane) suprime el sebo y altera la regeneración celular: la piel, frágil, forma cicatrices queloides o hipertróficas." },
    de: { label: "Starke Narbenbildung", explain: "Isotretinoin (Accutane) unterdrückt den Talg und verändert die Zellerneuerung: die brüchige Haut bildet Keloide oder hypertrophe Narben." },
    nl: { label: "Ernstige littekenvorming", explain: "Isotretinoïne (Accutane) onderdrukt de talg en verandert de celvernieuwing: de kwetsbare huid vormt keloïde of hypertrofische littekens." },
    pt: { label: "Cicatrizes graves", explain: "A isotretinoína (Accutane) suprime o sebo e altera a regeneração celular: a pele, frágil, forma cicatrizes queloides ou hipertróficas." }
  },
  "Severe Vasoconstriction": {
    en: { label: "Severe Vasoconstriction", explain: "Stimulants narrow blood vessels sharply, blanching the skin and restricting blood flow to the area being worked on." },
    fr: { label: "Vasoconstriction sévère", explain: "Les stimulants resserrent fortement les vaisseaux sanguins, font blanchir la peau et limitent l'irrigation de la zone travaillée." },
    it: { label: "Vasocostrizione grave", explain: "Gli stimolanti restringono fortemente i vasi sanguigni, sbiancano la pelle e limitano l'afflusso di sangue alla zona lavorata." },
    es: { label: "Vasoconstricción grave", explain: "Los estimulantes estrechan mucho los vasos sanguíneos, blanquean la piel y limitan el riego de la zona sobre la que se trabaja." },
    de: { label: "Starke Gefäßverengung", explain: "Stimulanzien verengen die Blutgefäße stark, lassen die Haut abblassen und drosseln die Durchblutung der bearbeiteten Stelle." },
    nl: { label: "Sterke vaatvernauwing", explain: "Stimulerende middelen vernauwen de bloedvaten sterk, laten de huid verbleken en beperken de doorbloeding van het bewerkte gebied." },
    pt: { label: "Vasoconstrição grave", explain: "Os estimulantes apertam fortemente os vasos sanguíneos, fazem a pele empalidecer e limitam a irrigação da zona trabalhada." }
  },
  "Skin Fragility at Site": {
    en: { label: "Skin Fragility at Site", explain: "Topical corticosteroids thin local dermal collagen fibers." },
    fr: { label: "Fragilité cutanée sur la zone", explain: "Les corticoïdes locaux amincissent les fibres de collagène du derme à l'endroit où ils sont appliqués." },
    it: { label: "Fragilità cutanea nella zona", explain: "I cortisonici topici assottigliano le fibre di collagene del derma nel punto in cui vengono applicati." },
    es: { label: "Fragilidad cutánea en la zona", explain: "Los corticoides tópicos adelgazan las fibras de colágeno de la dermis en el punto donde se aplican." },
    de: { label: "Empfindliche Haut an der Stelle", explain: "Örtlich aufgetragene Kortikoide dünnen die Kollagenfasern der Lederhaut genau dort aus, wo sie aufgetragen werden." },
    nl: { label: "Kwetsbare huid op de plek", explain: "Corticosteroïdzalf maakt de collageenvezels van de lederhuid dunner op precies de plek waar hij wordt aangebracht." },
    pt: { label: "Fragilidade cutânea na zona", explain: "Os corticoides tópicos afinam as fibras de colagénio da derme no ponto exato onde são aplicados." }
  },
  "Skin Sensitivity": {
    en: { label: "Skin Sensitivity", explain: "Accelerated exfoliation makes skin hyper-reactive to needle friction and aftercare products." },
    fr: { label: "Sensibilité cutanée", explain: "Une exfoliation accélérée rend la peau hyperréactive au frottement de l'aiguille et aux produits de soin." },
    it: { label: "Sensibilità cutanea", explain: "Un'esfoliazione accelerata rende la pelle iperreattiva all'attrito dell'ago e ai prodotti per la cura." },
    es: { label: "Sensibilidad cutánea", explain: "Una exfoliación acelerada vuelve la piel hiperreactiva al roce de la aguja y a los productos de cuidado." },
    de: { label: "Hautempfindlichkeit", explain: "Beschleunigte Abschuppung macht die Haut überempfindlich gegenüber der Reibung der Nadel und gegenüber Pflegeprodukten." },
    nl: { label: "Huidgevoeligheid", explain: "Versnelde vervelling maakt de huid overgevoelig voor de wrijving van de naald en voor verzorgingsproducten." },
    pt: { label: "Sensibilidade cutânea", explain: "Uma esfoliação acelerada torna a pele hiper-reativa ao atrito da agulha e aos produtos de cuidado." }
  },
  "Skin Texture Alteration": {
    en: { label: "Skin Texture Alteration", explain: "Topical anesthetics cause localized edema (fluid swelling in skin cells), making skin rubbery and harder for needles to deposit ink evenly." },
    fr: { label: "Modification de la texture de la peau", explain: "Les anesthésiants locaux provoquent un œdème localisé (gonflement des cellules par accumulation de liquide) qui rend la peau caoutchouteuse et complique le dépôt régulier de l'encre." },
    it: { label: "Alterazione della texture cutanea", explain: "Gli anestetici topici provocano un edema localizzato (rigonfiamento delle cellule per accumulo di liquido) che rende la pelle gommosa e complica il deposito uniforme dell'inchiostro." },
    es: { label: "Alteración de la textura de la piel", explain: "Los anestésicos tópicos provocan un edema localizado (hinchazón de las células por acumulación de líquido) que vuelve la piel gomosa y dificulta depositar la tinta de forma uniforme." },
    de: { label: "Veränderte Hautbeschaffenheit", explain: "Örtliche Betäubungsmittel erzeugen ein lokales Ödem (Flüssigkeitsschwellung in den Hautzellen), das die Haut gummiartig macht und ein gleichmäßiges Einbringen der Farbe erschwert." },
    nl: { label: "Veranderde huidstructuur", explain: "Verdovende zalf veroorzaakt plaatselijk oedeem (vochtophoping in de huidcellen), waardoor de huid rubberachtig wordt en de inkt zich lastiger gelijkmatig laat aanbrengen." },
    pt: { label: "Alteração da textura da pele", explain: "Os anestésicos tópicos provocam um edema localizado (inchaço das células por acumulação de líquido) que torna a pele emborrachada e dificulta depositar a tinta de forma uniforme." }
  },
  "Slightly Thicker Blood": {
    en: { label: "Slightly Thicker Blood", explain: "Testosterone increases red blood cell count (hematocrit), making blood slightly denser during heavy linework." },
    fr: { label: "Sang légèrement plus épais", explain: "La testostérone augmente le nombre de globules rouges (hématocrite), ce qui rend le sang légèrement plus dense lors des tracés appuyés." },
    it: { label: "Sangue leggermente più denso", explain: "Il testosterone aumenta il numero di globuli rossi (ematocrito) e rende il sangue leggermente più denso durante i tratti marcati." },
    es: { label: "Sangre ligeramente más espesa", explain: "La testosterona aumenta el número de glóbulos rojos (hematocrito) y hace la sangre algo más densa durante los trazos marcados." },
    de: { label: "Etwas dickeres Blut", explain: "Testosteron erhöht die Zahl der roten Blutkörperchen (Hämatokrit) und macht das Blut bei kräftigen Linien etwas dickflüssiger." },
    nl: { label: "Iets dikker bloed", explain: "Testosteron verhoogt het aantal rode bloedcellen (hematocriet), waardoor het bloed bij stevig lijnwerk iets dikker is." },
    pt: { label: "Sangue ligeiramente mais espesso", explain: "A testosterona aumenta o número de glóbulos vermelhos (hematócrito) e torna o sangue ligeiramente mais denso durante os traços carregados." }
  },
  "Vasoconstriction": {
    en: { label: "Vasoconstriction", explain: "Narrowing of blood vessels blanches skin, making alignment difficult and temporarily restricting blood flow." },
    fr: { label: "Vasoconstriction", explain: "Le resserrement des vaisseaux fait blanchir la peau, ce qui complique l'alignement et limite temporairement la circulation sanguine." },
    it: { label: "Vasocostrizione", explain: "Il restringimento dei vasi sbianca la pelle, rende difficile l'allineamento e limita temporaneamente il flusso sanguigno." },
    es: { label: "Vasoconstricción", explain: "El estrechamiento de los vasos blanquea la piel, dificulta la alineación y limita temporalmente el flujo sanguíneo." },
    de: { label: "Gefäßverengung", explain: "Verengte Gefäße lassen die Haut abblassen, erschweren das Ausrichten und drosseln vorübergehend die Durchblutung." },
    nl: { label: "Vaatvernauwing", explain: "Vernauwde bloedvaten laten de huid verbleken, maken uitlijnen lastig en beperken tijdelijk de doorbloeding." },
    pt: { label: "Vasoconstrição", explain: "O aperto dos vasos faz a pele empalidecer, dificulta o alinhamento e limita temporariamente o fluxo sanguíneo." }
  },
  "Vasodilation": {
    en: { label: "Vasodilation", explain: "THC widens blood vessels, increasing blood flow to the skin and the clear plasma that weeps from a fresh tattoo." },
    fr: { label: "Vasodilatation", explain: "Le THC dilate les vaisseaux sanguins, ce qui augmente l'afflux de sang vers la peau et le plasma clair qui suinte d'un tatouage frais." },
    it: { label: "Vasodilatazione", explain: "Il THC dilata i vasi sanguigni, aumentando l'afflusso di sangue alla pelle e il plasma chiaro che trasuda da un tatuaggio fresco." },
    es: { label: "Vasodilatación", explain: "El THC dilata los vasos sanguíneos, lo que aumenta el riego de la piel y el plasma transparente que rezuma de un tatuaje reciente." },
    de: { label: "Gefäßerweiterung", explain: "THC weitet die Blutgefäße, steigert die Durchblutung der Haut und das klare Wundwasser, das aus einem frischen Tattoo tritt." },
    nl: { label: "Vaatverwijding", explain: "THC verwijdt de bloedvaten, waardoor de huid meer doorbloed raakt en er meer helder wondvocht uit een verse tatoeage lekt." },
    pt: { label: "Vasodilatação", explain: "O THC dilata os vasos sanguíneos, aumentando a irrigação da pele e o plasma transparente que escorre de uma tatuagem recente." }
  }
};

/**
 * The label or explanation for a badge, in the current language.
 *
 * Falls back to English rather than to nothing, so an unfinished translation
 * reads correctly instead of rendering an empty badge.
 */
function riskText(englishKey, field) {
  var lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
  var entry = RISK_I18N[englishKey];
  if (!entry) return null;
  var v = entry[lang] && entry[lang][field];
  if (v) return v;
  return (entry.en && entry.en[field]) || null;
}

if (typeof window !== 'undefined') { window.RISK_I18N = RISK_I18N; window.riskText = riskText; }
