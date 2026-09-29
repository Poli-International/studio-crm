// Translated medication prose for the interaction checker.
//
// HAND-AUTHORED, NOT GENERATED. This is medical copy and no script writes it.
//
// STATUS 2026-08-26: COMPLETE. 38 medications x 3 fields x 6 languages = 684
// strings, about 11,650 words of pharmacology. Nothing falls back to English.
//
// It was built in that order on purpose: French first, and only the 12
// high-severity entries, because Patrick reads French and none of the other
// five - so the French tranche is the only one anyone could actually check
// before it went live. Once he had reviewed it (2026-08-25 and 2026-08-26) it
// became the quality bar and the fixed vocabulary for it, es, de, nl and pt.
//
// Anything missing here falls back to English - see medText() in app.js. A
// permanent notice on every non-English page says the text is translated and
// that the English is the version we stand behind, so a reader always knows
// which they are reading.
//
// TERMINOLOGY these translations commit to, so later languages stay consistent:
//   vasovagal syncope   -> syncope vasovagale
//   rebound hyperemia   -> hyperemie reactionnelle
//   plasma exudate      -> exsudat plasmatique
//   platelet inhibition -> inhibition plaquettaire
//   medical clearance   -> accord medical / avis medical
//   piercing (the act)  -> piercing, NOT percage (Patrick, 2026-08-25 review)
//   piercer (the person) -> perceur
//   fistula              -> fistule, NOT trajet (Patrick, 2026-08-26)
//   prescribing doctor   -> medecin traitant, NOT medecin prescripteur (same)
//
// TRADE VOCABULARY for the other five, checked against each language's own
// professional bodies rather than guessed:
//   it  piercing / piercer       (AIPP, Associazione Italiana Piercer Professionisti)
//   es  piercing / perforador    (APPE and CEP are Perforadores, but the trade
//                                 says piercing for the thing - as in French)
//   de  Piercing / Piercer       (VPP, DGP. Das Piercing, not Stechen)
//   nl  piercing / piercer
//   pt  piercing / body piercer
// fistula: fistola / fistula / Fistel / fistel / fistula
//                         Named specialists stay specific: cardiologue,
//                         rhumatologue/dermatologue, specialiste, equipe de
//                         transplantation. Only the generic phrase changed.
const MED_CONTENT_I18N = {
  opioids: {
    fr: {
      tattoo: "Modifient la perception de la douleur et la réponse du système nerveux central. Provoquent sédation, baisse de la tension artérielle, nausées et un risque accru de syncope vasovagale (malaise). La plupart des studios professionnels refusent un client sous l'influence active de stupéfiants.",
      piercing: "Risque élevé de vertiges, de nausées et de malaise pendant ou après l'intervention. Problèmes de consentements éclairés en cas de prise aiguë de stupéfiants à forte dose.",
      wait: "Ne vous présentez pas à une séance sous l'influence aiguë d'antidouleurs stupéfiants. En cas de traitement antalgique prescrit au long cours, demandez l'accord de votre médecin.",
    },
    it: {
      tattoo: "Alterano la percezione del dolore e la risposta del sistema nervoso centrale. Provocano sedazione, calo della pressione arteriosa, nausea e un rischio aumentato di sincope vasovagale (svenimento). La maggior parte degli studi professionali rifiuta un cliente sotto l'effetto attivo di stupefacenti.",
      piercing: "Rischio elevato di vertigini, nausea e svenimento durante o dopo la procedura. Problemi di consenso informato in caso di assunzione acuta di stupefacenti ad alto dosaggio.",
      wait: "Non presentarti a una seduta sotto l'effetto acuto di antidolorifici stupefacenti. In caso di terapia antalgica prescritta a lungo termine, chiedi l'assenso del tuo medico curante.",
    },
    es: {
      tattoo: "Alteran la percepción del dolor y la respuesta del sistema nervioso central. Provocan sedación, bajada de la tensión arterial, náuseas y un mayor riesgo de síncope vasovagal (desmayo). La mayoría de los estudios profesionales rechazan a un cliente bajo el efecto activo de estupefacientes.",
      piercing: "Riesgo elevado de mareo, náuseas y desmayo durante o después del procedimiento. Problemas de consentimiento informado en caso de consumo agudo de estupefacientes en dosis altas.",
      wait: "No acudas a una sesión bajo el efecto agudo de analgésicos estupefacientes. Si sigues un tratamiento analgésico prescrito a largo plazo, pide la conformidad de tu médico de cabecera.",
    },
    de: {
      tattoo: "Sie verändern die Schmerzwahrnehmung und die Reaktion des Zentralnervensystems. Sie verursachen Sedierung, Blutdruckabfall, Übelkeit und ein erhöhtes Risiko einer vasovagalen Synkope (Ohnmacht). Die meisten professionellen Studios lehnen Kunden unter akuter Betäubungsmittelwirkung ab.",
      piercing: "Hohes Risiko für Schwindel, Übelkeit und Ohnmacht während oder nach dem Eingriff. Probleme der informierten Einwilligung bei akuter Einnahme hoher Betäubungsmitteldosen.",
      wait: "Erscheinen Sie nicht unter akuter Wirkung von Betäubungsmitteln zu einem Termin. Bei einer langfristig verordneten Schmerztherapie holen Sie die Zustimmung Ihres behandelnden Arztes ein.",
    },
    nl: {
      tattoo: "Ze veranderen de pijnbeleving en de reactie van het centrale zenuwstelsel. Ze veroorzaken sedatie, bloeddrukdaling, misselijkheid en een verhoogd risico op vasovagale syncope (flauwvallen). De meeste professionele studio's weigeren een klant onder acute invloed van verdovende middelen.",
      piercing: "Hoog risico op duizeligheid, misselijkheid en flauwvallen tijdens of na de behandeling. Problemen met geïnformeerde toestemming bij acuut gebruik van hoge doses verdovende middelen.",
      wait: "Kom niet naar een afspraak onder acute invloed van verdovende pijnstillers. Bij langdurig voorgeschreven pijnmedicatie vraagt u toestemming aan uw behandelend arts.",
    },
    pt: {
      tattoo: "Alteram a perceção da dor e a resposta do sistema nervoso central. Provocam sedação, descida da tensão arterial, náuseas e um risco acrescido de síncope vasovagal (desmaio). A maioria dos estúdios profissionais recusa um cliente sob efeito ativo de estupefacientes.",
      piercing: "Risco elevado de tonturas, náuseas e desmaio durante ou após o procedimento. Problemas de consentimento informado em caso de consumo agudo de estupefacientes em dose alta.",
      wait: "Não compareça a uma sessão sob efeito agudo de analgésicos estupefacientes. Se faz tratamento analgésico prescrito de longa duração, peça a concordância do seu médico assistente.",
    },
  },
  epinephrine_numbing: {
    fr: {
      tattoo: "L'épinéphrine provoque une forte vasoconstriction (rétrécissement des vaisseaux) qui réduit le saignement. À la dissipation du produit survient une hyperémie réactionnelle sévère : dilatation vasculaire rapide, saignement intense et exsudat plasmatique abondant qui compromet la fixation de l'encre fraîche.",
      piercing: "Blanchit la peau au moment du marquage, ce qui rend l'alignement précis difficile. Saignement de rebond et élancements intenses après l'intervention.",
      wait: "Évitez les anesthésiants vasoconstricteurs, sauf s'ils sont administrés directement par un professionnel de santé ou approuvés par votre praticien.",
    },
    it: {
      tattoo: "L'epinefrina provoca una forte vasocostrizione (restringimento dei vasi) che riduce il sanguinamento. Quando l'effetto svanisce si verifica una grave iperemia reattiva: dilatazione vascolare rapida, sanguinamento intenso ed essudato plasmatico abbondante che compromette la fissazione dell'inchiostro fresco.",
      piercing: "Sbianca la pelle durante la marcatura, rendendo difficile un allineamento preciso. Dopo la procedura si verificano sanguinamento di rimbalzo e pulsazioni intense.",
      wait: "Evita gli anestetici vasocostrittori, salvo se somministrati direttamente da un professionista sanitario o approvati dal tuo operatore.",
    },
    es: {
      tattoo: "La epinefrina provoca una fuerte vasoconstricción (estrechamiento de los vasos) que reduce el sangrado. Cuando el efecto desaparece se produce una hiperemia reactiva grave: dilatación vascular rápida, sangrado intenso y exudado plasmático abundante que compromete la fijación de la tinta fresca.",
      piercing: "Blanquea la piel durante el marcado, lo que dificulta una alineación precisa. Tras el procedimiento aparecen sangrado de rebote y palpitaciones intensas.",
      wait: "Evita los anestésicos vasoconstrictores, salvo que los administre directamente un profesional sanitario o los apruebe tu perforador.",
    },
    de: {
      tattoo: "Epinephrin bewirkt eine starke Vasokonstriktion (Gefäßverengung), die die Blutung verringert. Lässt die Wirkung nach, folgt eine schwere reaktive Hyperämie: rasche Gefäßerweiterung, starke Blutung und reichlich Plasmaexsudat genau dann, wenn frische Farbe sich setzen soll.",
      piercing: "Beim Anzeichnen bleicht die Haut aus, was eine genaue Ausrichtung erschwert. Nach dem Eingriff treten Rebound-Blutungen und starkes Pochen auf.",
      wait: "Vermeiden Sie gefäßverengende Betäubungsmittel, sofern sie nicht direkt von medizinischem Fachpersonal verabreicht oder von Ihrem Piercer freigegeben wurden.",
    },
    nl: {
      tattoo: "Epinefrine veroorzaakt sterke vasoconstrictie (vernauwing van de bloedvaten), waardoor de bloeding afneemt. Als het middel is uitgewerkt volgt ernstige reactieve hyperemie: snelle vaatverwijding, hevige bloeding en overvloedig plasma-exsudaat, precies wanneer verse inkt moet hechten.",
      piercing: "Bleekt de huid tijdens het aftekenen, waardoor nauwkeurig uitlijnen lastig wordt. Na de behandeling ontstaan rebound-bloeding en hevig kloppen.",
      wait: "Vermijd vaatvernauwende verdovingsmiddelen, tenzij ze rechtstreeks door een zorgverlener worden toegediend of door uw piercer zijn goedgekeurd.",
    },
    pt: {
      tattoo: "A epinefrina provoca uma forte vasoconstrição (estreitamento dos vasos) que reduz a hemorragia. Quando o efeito passa, surge uma hiperemia reativa grave: dilatação vascular rápida, hemorragia intensa e exsudado plasmático abundante no momento exato em que a tinta fresca deveria fixar-se.",
      piercing: "Embranquece a pele durante a marcação, dificultando um alinhamento preciso. Após o procedimento surgem hemorragia de rebote e latejamento intenso.",
      wait: "Evite anestésicos vasoconstritores, salvo se administrados diretamente por um profissional de saúde ou aprovados pelo seu body piercer.",
    },
  },
  warfarin: {
    fr: {
      tattoo: "Saignements importants pendant le tatouage : le suintement prolongé nuit à la fixation de l'encre. La saturation des couleurs et la netteté des lignes en sont affectées. La plupart des studios professionnels exigent un accord médical ou refusent les clients sous anticoagulation thérapeutique active.",
      piercing: "Saignement excessif pendant le piercing et phase de cicatrisation prolongée. Tout hématome sur un piercing récent retarde nettement la formation d'une fistule.",
      wait: "Discutez d'un arrêt ou d'un relais avec votre médecin traitant : n'interrompez jamais le traitement sans avis médical.",
    },
    it: {
      tattoo: "Sanguinamenti importanti durante il tatuaggio: il trasudato prolungato compromette la fissazione dell'inchiostro. La saturazione dei colori e la nitidezza delle linee ne risentono. La maggior parte degli studi professionali richiede un assenso medico o rifiuta i clienti in terapia anticoagulante attiva.",
      piercing: "Sanguinamento eccessivo durante il piercing e fase di guarigione prolungata. Qualsiasi ematoma su un piercing recente ritarda nettamente la formazione della fistola.",
      wait: "Parla di una sospensione o di una terapia ponte con il tuo medico curante: non interrompere mai il trattamento senza parere medico.",
    },
    es: {
      tattoo: "Sangrados importantes durante el tatuaje: el exudado prolongado perjudica la fijación de la tinta. La saturación de los colores y la nitidez de las líneas se ven afectadas. La mayoría de los estudios profesionales exige conformidad médica o rechaza a los clientes en anticoagulación terapéutica activa.",
      piercing: "Sangrado excesivo durante el piercing y fase de cicatrización prolongada. Cualquier hematoma en un piercing reciente retrasa notablemente la formación de la fístula.",
      wait: "Habla de una suspensión o de una terapia puente con tu médico de cabecera: no interrumpas nunca el tratamiento sin criterio médico.",
    },
    de: {
      tattoo: "Starke Blutungen während des Tätowierens: das anhaltende Nässen beeinträchtigt das Setzen der Farbe. Farbsättigung und Linienschärfe leiden darunter. Die meisten professionellen Studios verlangen eine ärztliche Freigabe oder lehnen Kunden unter laufender therapeutischer Antikoagulation ab.",
      piercing: "Übermäßige Blutung während des Piercings und verlängerte Heilungsphase. Jedes Hämatom an einem frischen Piercing verzögert die Bildung der Fistel deutlich.",
      wait: "Besprechen Sie ein Absetzen oder eine Überbrückung mit Ihrem behandelnden Arzt: unterbrechen Sie die Therapie niemals ohne ärztlichen Rat.",
    },
    nl: {
      tattoo: "Forse bloedingen tijdens het tatoeëren: langdurig vochtverlies belemmert het hechten van de inkt. Kleurverzadiging en lijnscherpte lijden eronder. De meeste professionele studio's vragen medische toestemming of weigeren klanten onder actieve therapeutische antistolling.",
      piercing: "Overmatige bloeding tijdens de piercing en een langere genezingsfase. Elk hematoom bij een verse piercing vertraagt de vorming van de fistel aanzienlijk.",
      wait: "Bespreek stoppen of overbruggen met uw behandelend arts: onderbreek de behandeling nooit zonder medisch advies.",
    },
    pt: {
      tattoo: "Hemorragias importantes durante a tatuagem: o exsudado prolongado prejudica a fixação da tinta. A saturação das cores e a nitidez das linhas são afetadas. A maioria dos estúdios profissionais exige aval médico ou recusa clientes sob anticoagulação terapêutica ativa.",
      piercing: "Hemorragia excessiva durante o piercing e fase de cicatrização prolongada. Qualquer hematoma num piercing recente atrasa nitidamente a formação da fístula.",
      wait: "Fale de uma suspensão ou de uma terapia ponte com o seu médico assistente: nunca interrompa o tratamento sem parecer médico.",
    },
  },
  apixaban: {
    fr: {
      tattoo: "Même profil hémorragique que la warfarine. Les anticoagulants oraux directs (AOD) ont une demi-vie plus courte, mais leurs effets restent importants lors des actes qui traversent la peau.",
      piercing: "Saignements et ecchymoses accrus au site du piercing. La pression du bijou sur un hématome augmente le risque de rejet.",
      wait: "Demi-vie de 8 à 12 heures : discutez d'une pause encadrée avec votre médecin. N'interrompez pas le traitement sans accord médical.",
    },
    it: {
      tattoo: "Stesso profilo emorragico del warfarin. Gli anticoagulanti orali diretti (DOAC) hanno un'emivita più breve, ma i loro effetti restano rilevanti negli interventi che attraversano la pelle.",
      piercing: "Sanguinamenti ed ecchimosi aumentati nel punto del piercing. La pressione del gioiello su un ematoma aumenta il rischio di rigetto.",
      wait: "Emivita di 8-12 ore: parla di una pausa controllata con il tuo medico. Non interrompere il trattamento senza assenso medico.",
    },
    es: {
      tattoo: "Mismo perfil hemorrágico que la warfarina. Los anticoagulantes orales directos (ACOD) tienen una semivida más corta, pero sus efectos siguen siendo importantes en los procedimientos que atraviesan la piel.",
      piercing: "Sangrados y hematomas aumentados en la zona del piercing. La presión de la joya sobre un hematoma aumenta el riesgo de rechazo.",
      wait: "Semivida de 8-12 horas: habla de una pausa supervisada con tu médico. No interrumpas el tratamiento sin conformidad médica.",
    },
    de: {
      tattoo: "Gleiches Blutungsprofil wie Warfarin. Direkte orale Antikoagulanzien (DOAK) haben eine kürzere Halbwertszeit, ihre Wirkung bleibt bei hautdurchdringenden Eingriffen aber erheblich.",
      piercing: "Verstärkte Blutungen und Blutergüsse an der Piercingstelle. Druck des Schmucks auf ein Hämatom erhöht das Abstoßungsrisiko.",
      wait: "Halbwertszeit von 8 bis 12 Stunden: besprechen Sie eine kontrollierte Pause mit Ihrem Arzt. Setzen Sie die Therapie nicht ohne ärztliche Zustimmung aus.",
    },
    nl: {
      tattoo: "Zelfde bloedingsprofiel als warfarine. Directe orale anticoagulantia (DOAC's) hebben een kortere halfwaardetijd, maar hun effect blijft aanzienlijk bij ingrepen die de huid doorboren.",
      piercing: "Meer bloedingen en blauwe plekken op de piercingplek. Druk van de sieraad op een hematoom verhoogt het risico op afstoting.",
      wait: "Halfwaardetijd van 8 tot 12 uur: bespreek een begeleide pauze met uw arts. Onderbreek de behandeling niet zonder medische toestemming.",
    },
    pt: {
      tattoo: "Mesmo perfil hemorrágico da varfarina. Os anticoagulantes orais diretos (ACOD) têm uma semivida mais curta, mas os seus efeitos continuam relevantes em procedimentos que atravessam a pele.",
      piercing: "Hemorragias e equimoses aumentadas no local do piercing. A pressão da joia sobre um hematoma aumenta o risco de rejeição.",
      wait: "Semivida de 8 a 12 horas: fale de uma pausa acompanhada com o seu médico. Não interrompa o tratamento sem aval médico.",
    },
  },
  clopidogrel: {
    fr: {
      tattoo: "Inhibition plaquettaire importante : profil hémorragique proche de celui de l'aspirine, mais souvent associé à d'autres anticoagulants. La plupart des studios demanderont un accord médical.",
      piercing: "Risque hémorragique important. La formation d'un hématome à l'endroit du piercing est une préoccupation réelle.",
      wait: "N'arrêtez jamais le clopidogrel sans l'accord de votre cardiologue : il est prescrit pour la protection cardiaque.",
    },
    it: {
      tattoo: "Inibizione piastrinica importante: profilo emorragico simile a quello dell'aspirina, ma spesso associato ad altri anticoagulanti. La maggior parte degli studi chiederà un assenso medico.",
      piercing: "Rischio emorragico importante. La formazione di un ematoma nel punto del piercing è una preoccupazione reale.",
      wait: "Non sospendere mai il clopidogrel senza l'assenso del tuo cardiologo: è prescritto per la protezione cardiaca.",
    },
    es: {
      tattoo: "Inhibición plaquetaria importante: perfil hemorrágico similar al de la aspirina, pero a menudo combinado con otros anticoagulantes. La mayoría de los estudios pedirá conformidad médica.",
      piercing: "Riesgo hemorrágico importante. La formación de un hematoma en la zona del piercing es una preocupación real.",
      wait: "No suspendas nunca el clopidogrel sin la aprobación de tu cardiólogo: se prescribe para la protección cardiaca.",
    },
    de: {
      tattoo: "Deutliche Thrombozytenhemmung: Blutungsprofil ähnlich wie bei Aspirin, oft aber mit weiteren Gerinnungshemmern kombiniert. Die meisten Studios verlangen eine ärztliche Freigabe.",
      piercing: "Erhebliches Blutungsrisiko. Die Bildung eines Hämatoms an der Piercingstelle ist eine reale Sorge.",
      wait: "Setzen Sie Clopidogrel niemals ohne Zustimmung Ihres Kardiologen ab: es wird zum Schutz des Herzens verordnet.",
    },
    nl: {
      tattoo: "Sterke plaatjesremming: bloedingsprofiel vergelijkbaar met aspirine, maar vaak gecombineerd met andere antistollingsmiddelen. De meeste studio's vragen medische toestemming.",
      piercing: "Aanzienlijk bloedingsrisico. Vorming van een hematoom op de piercingplek is een reëel punt van zorg.",
      wait: "Stop nooit met clopidogrel zonder toestemming van uw cardioloog: het wordt voorgeschreven ter bescherming van het hart.",
    },
    pt: {
      tattoo: "Inibição plaquetária importante: perfil hemorrágico semelhante ao da aspirina, mas frequentemente associado a outros anticoagulantes. A maioria dos estúdios pedirá aval médico.",
      piercing: "Risco hemorrágico importante. A formação de um hematoma no local do piercing é uma preocupação real.",
      wait: "Nunca suspenda o clopidogrel sem o aval do seu cardiologista: é prescrito para proteção cardíaca.",
    },
  },
  heparin: {
    fr: {
      tattoo: "L'héparine de bas poids moléculaire injectable entraîne une anticoagulation puissante. Risque hémorragique très élevé lors de l'effraction cutanée. Un tatouage non urgent doit être reporté.",
      piercing: "Risque hémorragique élevé et formation d'hématomes. Reportez tout piercing non urgent pendant un traitement par HBPM à dose thérapeutique.",
      wait: "Consultez votre médecin traitant. Ne sautez jamais une dose sans surveillance médicale.",
    },
    it: {
      tattoo: "L'eparina a basso peso molecolare iniettabile determina una forte anticoagulazione. Rischio emorragico molto elevato quando si attraversa la pelle. Un tatuaggio non urgente va rimandato.",
      piercing: "Rischio emorragico elevato e formazione di ematomi. Rimanda qualsiasi piercing non urgente durante una terapia con EBPM a dose terapeutica.",
      wait: "Consulta il tuo medico curante. Non saltare mai una dose senza controllo medico.",
    },
    es: {
      tattoo: "La heparina de bajo peso molecular inyectable produce una anticoagulación potente. Riesgo hemorrágico muy elevado al atravesar la piel. Un tatuaje no urgente debe aplazarse.",
      piercing: "Riesgo hemorrágico elevado y formación de hematomas. Aplaza cualquier piercing no urgente durante un tratamiento con HBPM a dosis terapéutica.",
      wait: "Consulta a tu médico de cabecera. No te saltes nunca una dosis sin supervisión médica.",
    },
    de: {
      tattoo: "Injizierbares niedermolekulares Heparin bewirkt eine starke Antikoagulation. Sehr hohes Blutungsrisiko beim Durchstechen der Haut. Eine nicht dringende Tätowierung sollte verschoben werden.",
      piercing: "Hohes Blutungsrisiko und Hämatombildung. Verschieben Sie jedes nicht dringende Piercing während einer NMH-Therapie in therapeutischer Dosis.",
      wait: "Wenden Sie sich an Ihren behandelnden Arzt. Lassen Sie niemals eine Dosis ohne ärztliche Aufsicht aus.",
    },
    nl: {
      tattoo: "Injecteerbare laagmoleculaire heparine geeft sterke antistolling. Zeer hoog bloedingsrisico bij het doorboren van de huid. Een niet-dringende tatoeage moet worden uitgesteld.",
      piercing: "Hoog bloedingsrisico en vorming van hematomen. Stel elke niet-dringende piercing uit tijdens behandeling met LMWH in therapeutische dosis.",
      wait: "Raadpleeg uw behandelend arts. Sla nooit een dosis over zonder medisch toezicht.",
    },
    pt: {
      tattoo: "A heparina de baixo peso molecular injetável provoca uma anticoagulação forte. Risco hemorrágico muito elevado ao atravessar a pele. Uma tatuagem não urgente deve ser adiada.",
      piercing: "Risco hemorrágico elevado e formação de hematomas. Adie qualquer piercing não urgente durante um tratamento com HBPM em dose terapêutica.",
      wait: "Consulte o seu médico assistente. Nunca falhe uma dose sem supervisão médica.",
    },
  },
  isotretinoin: {
    fr: {
      tattoo: "L'isotrétinoïne modifie en profondeur le renouvellement cellulaire de l'épiderme, amincit la peau et supprime la production de sébum. Se faire tatouer pendant le traitement entraîne des cicatrices sévères, une perte d'encre imprévisible et une cicatrisation altérée. Contre-indication universelle.",
      piercing: "La peau est fragile et cicatrise lentement. La formation de la fistule est fortement compromise. Risque élevé de cicatrice hypertrophique ou de rejet du piercing.",
      wait: "Recommandation professionnelle habituelle : attendre 6 à 12 mois après la fin du traitement par isotrétinoïne avant tout tatouage ou nouveau piercing.",
    },
    it: {
      tattoo: "L'isotretinoina modifica profondamente il ricambio cellulare dell'epidermide, assottiglia la pelle e sopprime la produzione di sebo. Tatuarsi durante il trattamento provoca cicatrici gravi, perdita di inchiostro imprevedibile e guarigione compromessa. Controindicazione universale.",
      piercing: "La pelle è fragile e guarisce lentamente. La formazione della fistola è fortemente compromessa. Rischio elevato di cicatrice ipertrofica o di rigetto del piercing.",
      wait: "Indicazione professionale abituale: attendere 6-12 mesi dalla fine del trattamento con isotretinoina prima di qualsiasi tatuaggio o nuovo piercing.",
    },
    es: {
      tattoo: "La isotretinoína modifica profundamente la renovación celular de la epidermis, adelgaza la piel y suprime la producción de sebo. Tatuarse durante el tratamiento provoca cicatrices graves, pérdida de tinta impredecible y cicatrización alterada. Contraindicación universal.",
      piercing: "La piel es frágil y cicatriza lentamente. La formación de la fístula está muy comprometida. Riesgo elevado de cicatriz hipertrófica o de rechazo del piercing.",
      wait: "Recomendación profesional habitual: esperar de 6 a 12 meses tras finalizar el tratamiento con isotretinoína antes de cualquier tatuaje o piercing nuevo.",
    },
    de: {
      tattoo: "Isotretinoin verändert die Zellerneuerung der Oberhaut grundlegend, verdünnt die Haut und unterdrückt die Talgproduktion. Eine Tätowierung während der Behandlung führt zu schwerer Narbenbildung, unvorhersehbarem Farbverlust und gestörter Heilung. Universelle Kontraindikation.",
      piercing: "Die Haut ist empfindlich und heilt langsam. Die Bildung der Fistel ist stark beeinträchtigt. Hohes Risiko für hypertrophe Narben oder Abstoßung des Piercings.",
      wait: "Übliche fachliche Empfehlung: nach Abschluss der Isotretinoin-Behandlung 6 bis 12 Monate warten, bevor tätowiert oder neu gepierct wird.",
    },
    nl: {
      tattoo: "Isotretinoïne verandert de celvernieuwing van de opperhuid ingrijpend, maakt de huid dunner en onderdrukt de talgproductie. Tatoeëren tijdens de behandeling veroorzaakt ernstige littekens, onvoorspelbaar inktverlies en verstoorde genezing. Universele contra-indicatie.",
      piercing: "De huid is kwetsbaar en geneest traag. De vorming van de fistel is sterk verstoord. Hoog risico op hypertrofisch litteken of afstoting van de piercing.",
      wait: "Gebruikelijk professioneel advies: wacht 6 tot 12 maanden na afloop van de isotretinoïnebehandeling voordat u tatoeëert of nieuw laat piercen.",
    },
    pt: {
      tattoo: "A isotretinoína altera profundamente a renovação celular da epiderme, adelgaça a pele e suprime a produção de sebo. Tatuar durante o tratamento provoca cicatrizes graves, perda de tinta imprevisível e cicatrização comprometida. Contraindicação universal.",
      piercing: "A pele é frágil e cicatriza lentamente. A formação da fístula fica muito comprometida. Risco elevado de cicatriz hipertrófica ou de rejeição do piercing.",
      wait: "Recomendação profissional habitual: aguardar 6 a 12 meses após o fim do tratamento com isotretinoína antes de qualquer tatuagem ou piercing novo.",
    },
  },
  methotrexate: {
    fr: {
      tattoo: "L'immunosuppression marquée rend la cicatrisation d'un tatouage imprévisible : risque infectieux accru, phase inflammatoire altérée et possibilité d'infection cutanée opportuniste. Accord médical indispensable.",
      piercing: "Risque infectieux élevé. Les piercings non urgents pendant un traitement par méthotrexate sont fortement déconseillés sans accord du spécialiste.",
      wait: "Parlez-en à votre rhumatologue ou dermatologue avant de réserver. N'interrompez pas le traitement sans avis médical.",
    },
    it: {
      tattoo: "La marcata immunosoppressione rende imprevedibile la guarigione di un tatuaggio: rischio infettivo aumentato, fase infiammatoria alterata e possibilità di infezione cutanea opportunistica. Assenso medico indispensabile.",
      piercing: "Rischio infettivo elevato. I piercing non urgenti durante una terapia con metotrexato sono fortemente sconsigliati senza l'assenso dello specialista.",
      wait: "Parlane con il tuo reumatologo o dermatologo prima di prenotare. Non interrompere il trattamento senza parere medico.",
    },
    es: {
      tattoo: "La marcada inmunosupresión hace impredecible la cicatrización de un tatuaje: mayor riesgo de infección, fase inflamatoria alterada y posibilidad de infección cutánea oportunista. Conformidad médica imprescindible.",
      piercing: "Riesgo elevado de infección. Los piercings no urgentes durante un tratamiento con metotrexato están muy desaconsejados sin la aprobación del especialista.",
      wait: "Coméntalo con tu reumatólogo o dermatólogo antes de reservar. No interrumpas el tratamiento sin criterio médico.",
    },
    de: {
      tattoo: "Die ausgeprägte Immunsuppression macht die Heilung einer Tätowierung unvorhersehbar: erhöhtes Infektionsrisiko, gestörte Entzündungsphase und mögliche opportunistische Hautinfektionen. Ärztliche Freigabe erforderlich.",
      piercing: "Hohes Infektionsrisiko. Von nicht dringenden Piercings während einer Methotrexat-Therapie ist ohne Zustimmung des Facharztes dringend abzuraten.",
      wait: "Sprechen Sie vor der Terminbuchung mit Ihrem Rheumatologen oder Dermatologen. Unterbrechen Sie die Therapie nicht ohne ärztlichen Rat.",
    },
    nl: {
      tattoo: "De sterke immuunonderdrukking maakt de genezing van een tatoeage onvoorspelbaar: verhoogd infectierisico, verstoorde ontstekingsfase en kans op opportunistische huidinfectie. Medische toestemming is noodzakelijk.",
      piercing: "Hoog infectierisico. Niet-dringende piercings tijdens een behandeling met methotrexaat worden sterk afgeraden zonder toestemming van de specialist.",
      wait: "Bespreek het met uw reumatoloog of dermatoloog voordat u boekt. Onderbreek de behandeling niet zonder medisch advies.",
    },
    pt: {
      tattoo: "A imunossupressão acentuada torna imprevisível a cicatrização de uma tatuagem: risco infecioso aumentado, fase inflamatória alterada e possibilidade de infeção cutânea oportunista. Aval médico indispensável.",
      piercing: "Risco infecioso elevado. Os piercings não urgentes durante um tratamento com metotrexato são fortemente desaconselhados sem o aval do especialista.",
      wait: "Fale com o seu reumatologista ou dermatologista antes de marcar. Não interrompa o tratamento sem parecer médico.",
    },
  },
  biologics: {
    fr: {
      tattoo: "Les agents biologiques inhibent certaines voies immunitaires (TNF-alpha, IL-17/23). Risque significativement accru d'infections cutanées bactériennes et de cicatrisation retardée.",
      piercing: "Risque élevé d'infection. Les piercings non urgents doivent être discutés avec votre médecin traitant.",
      wait: "Ne pas interrompre le traitement. Planifier les séances en fonction des cycles d'injection après consultation avec un spécialiste.",
    },
    it: {
      tattoo: "Gli agenti biologici inibiscono determinate vie immunitarie (TNF-alfa, IL-17/23). Rischio significativamente aumentato di infezioni cutanee batteriche e di cicatrizzazione ritardata.",
      piercing: "Rischio elevato di infezione. I piercing non urgenti vanno discussi con il tuo medico curante.",
      wait: "Non interrompere il trattamento. Programmare le sedute in funzione dei cicli di iniezione dopo consulto con uno specialista.",
    },
    es: {
      tattoo: "Los agentes biológicos inhiben determinadas vías inmunitarias (TNF-alfa, IL-17/23). Riesgo significativamente mayor de infecciones cutáneas bacterianas y de cicatrización retardada.",
      piercing: "Riesgo elevado de infección. Los piercings no urgentes deben consultarse con tu médico de cabecera.",
      wait: "No interrumpir el tratamiento. Programar las sesiones en función de los ciclos de inyección tras consultar con un especialista.",
    },
    de: {
      tattoo: "Biologika hemmen bestimmte Immunwege (TNF-alpha, IL-17/23). Deutlich erhöhtes Risiko für bakterielle Hautinfektionen und verzögerte Wundheilung.",
      piercing: "Hohes Infektionsrisiko. Nicht dringende Piercings sollten mit Ihrem behandelnden Arzt besprochen werden.",
      wait: "Die Therapie nicht unterbrechen. Termine nach Rücksprache mit einem Facharzt am Injektionszyklus ausrichten.",
    },
    nl: {
      tattoo: "Biologische middelen remmen bepaalde immuunroutes (TNF-alfa, IL-17/23). Duidelijk verhoogd risico op bacteriële huidinfecties en vertraagde wondgenezing.",
      piercing: "Hoog infectierisico. Niet-dringende piercings moeten met uw behandelend arts worden besproken.",
      wait: "De behandeling niet onderbreken. Plan de sessies op het injectieschema na overleg met een specialist.",
    },
    pt: {
      tattoo: "Os agentes biológicos inibem determinadas vias imunitárias (TNF-alfa, IL-17/23). Risco significativamente acrescido de infeções cutâneas bacterianas e de cicatrização retardada.",
      piercing: "Risco elevado de infeção. Os piercings não urgentes devem ser discutidos com o seu médico assistente.",
      wait: "Não interromper o tratamento. Planear as sessões em função dos ciclos de injeção após consulta com um especialista.",
    },
  },
  ciclosporin: {
    fr: {
      tattoo: "Immunosuppresseurs systémiques utilisés en transplantation et dans les maladies auto-immunes sévères. Affaiblir le système immunitaire augmente le risque infectieux en général, et c'est la raison de la prudence ici. L'effet sur la cicatrisation d'un tatouage n'a pas été étudié : considérez cette fiche comme une précaution, non comme une donnée mesurée.",
      piercing: "Mieux vaut reporter tout piercing non urgent pendant un traitement actif, jusqu'à l'avis de votre spécialiste. Il s'agit d'une précaution, pas d'un risque mesuré.",
      wait: "Obtenez l'accord de votre équipe de transplantation ou de votre spécialiste.",
    },
    it: {
      tattoo: "Immunosoppressori sistemici usati nei trapianti e nelle malattie autoimmuni gravi. Indebolire il sistema immunitario aumenta il rischio infettivo in generale, ed è questa la ragione della prudenza. L'effetto sulla guarigione di un tatuaggio non è stato studiato: considera questa scheda una precauzione, non un dato misurato.",
      piercing: "Meglio rimandare qualsiasi piercing non urgente durante una terapia attiva, fino al parere del tuo specialista. Si tratta di una precauzione, non di un rischio misurato.",
      wait: "Ottieni l'assenso dell'équipe dei trapianti o del tuo specialista.",
    },
    es: {
      tattoo: "Inmunosupresores sistémicos usados en trasplantes y en enfermedades autoinmunes graves. Debilitar el sistema inmunitario aumenta el riesgo de infección en general, y esa es la razón de la prudencia. El efecto sobre la cicatrización de un tatuaje no se ha estudiado: considera esta ficha una precaución, no un dato medido.",
      piercing: "Es mejor aplazar cualquier piercing no urgente durante un tratamiento activo, hasta contar con la opinión de tu especialista. Es una precaución, no un riesgo medido.",
      wait: "Consigue la conformidad del equipo de trasplantes o de tu especialista.",
    },
    de: {
      tattoo: "Systemische Immunsuppressiva aus der Transplantationsmedizin und der Behandlung schwerer Autoimmunerkrankungen. Eine Schwächung des Immunsystems erhöht das Infektionsrisiko allgemein, und darauf beruht die Vorsicht hier. Die Wirkung auf die Heilung einer Tätowierung wurde nicht untersucht: verstehen Sie diesen Eintrag als Vorsichtsmaßnahme, nicht als gemessenes Risiko.",
      piercing: "Nicht dringende Piercings sollten während einer laufenden Therapie besser verschoben werden, bis Ihr Facharzt Stellung genommen hat. Das ist eine Vorsichtsmaßnahme, kein gemessenes Risiko.",
      wait: "Holen Sie die Freigabe des Transplantationsteams oder Ihres Facharztes ein.",
    },
    nl: {
      tattoo: "Systemische immunosuppressiva uit de transplantatiegeneeskunde en de behandeling van ernstige auto-immuunziekten. Het onderdrukken van het immuunsysteem verhoogt het infectierisico in het algemeen, en dat is hier de reden voor voorzichtigheid. Het effect op de genezing van een tatoeage is niet onderzocht: beschouw dit als een voorzorgsmaatregel, niet als een gemeten risico.",
      piercing: "Stel een niet-dringende piercing tijdens een lopende behandeling liever uit tot uw specialist zich heeft uitgesproken. Dit is een voorzorg, geen gemeten risico.",
      wait: "Vraag toestemming aan het transplantatieteam of aan uw specialist.",
    },
    pt: {
      tattoo: "Imunossupressores sistémicos usados em transplantação e em doenças autoimunes graves. Enfraquecer o sistema imunitário aumenta o risco infecioso em geral, e é essa a razão da prudência. O efeito na cicatrização de uma tatuagem não foi estudado: considere esta ficha uma precaução e não um dado medido.",
      piercing: "É preferível adiar qualquer piercing não urgente durante um tratamento ativo, até ao parecer do seu especialista. Trata-se de uma precaução, não de um risco medido.",
      wait: "Obtenha o aval da equipa de transplantação ou do seu especialista.",
    },
  },
  alcohol: {
    fr: {
      tattoo: "L'alcool agit sur la fonction plaquettaire et la coagulation, inhibe la vasopressine (ce qui favorise la déshydratation) et peut faire baisser la glycémie. En pratique, cela se traduit par davantage de saignements et de suintements pendant la séance, et par un seuil de douleur plus bas en cas de gueule de bois. L'effet sur la tenue de l'encre n'a pas été étudié : prenez avec prudence les affirmations selon lesquelles l'encre serait « chassée ».",
      piercing: "Davantage de saignements et suintements prolongés. La déshydratation augmente le risque de malaise.",
      wait: "Ne consommez PAS d'alcool dans les 24 à 48 heures qui précèdent ou suivent votre intervention.",
    },
    it: {
      tattoo: "L'alcol agisce sulla funzione piastrinica e sulla coagulazione, inibisce la vasopressina (favorendo la disidratazione) e può abbassare la glicemia. In pratica ciò si traduce in maggiori sanguinamenti e trasudati durante la seduta, e in una soglia del dolore più bassa in caso di postumi. L'effetto sulla tenuta dell'inchiostro non è stato studiato: prendi con cautela le affermazioni secondo cui l'inchiostro verrebbe espulso.",
      piercing: "Maggiori sanguinamenti e trasudato prolungato. La disidratazione aumenta il rischio di svenimento.",
      wait: "NON consumare alcol nelle 24-48 ore precedenti o successive alla procedura.",
    },
    es: {
      tattoo: "El alcohol actúa sobre la función plaquetaria y la coagulación, inhibe la vasopresina (lo que favorece la deshidratación) y puede bajar la glucemia. En la práctica esto se traduce en más sangrados y exudado durante la sesión, y en un umbral del dolor más bajo con resaca. El efecto sobre la retención de la tinta no se ha estudiado: toma con cautela las afirmaciones de que la tinta sería expulsada.",
      piercing: "Más sangrados y exudado prolongado. La deshidratación aumenta el riesgo de desmayo.",
      wait: "NO consumas alcohol en las 24-48 horas anteriores ni posteriores al procedimiento.",
    },
    de: {
      tattoo: "Alkohol wirkt auf die Thrombozytenfunktion und die Gerinnung, hemmt Vasopressin (was Dehydrierung begünstigt) und kann den Blutzucker senken. Praktisch bedeutet das mehr Blutung und Nässen während der Sitzung sowie eine niedrigere Schmerzschwelle bei Kater. Die Wirkung auf das Halten der Farbe wurde nicht untersucht: begegnen Sie Behauptungen, die Farbe werde herausgeschwemmt, mit Vorsicht.",
      piercing: "Mehr Blutung und längeres Nässen. Dehydrierung erhöht das Ohnmachtsrisiko.",
      wait: "Trinken Sie in den 24 bis 48 Stunden vor und nach dem Eingriff KEINEN Alkohol.",
    },
    nl: {
      tattoo: "Alcohol beïnvloedt de bloedplaatjesfunctie en de stolling, remt vasopressine (wat uitdroging bevordert) en kan de bloedsuiker verlagen. In de praktijk betekent dat meer bloeding en vochtverlies tijdens de sessie, en een lagere pijndrempel bij een kater. Het effect op het vasthouden van de inkt is niet onderzocht: wees voorzichtig met beweringen dat de inkt zou worden uitgedreven.",
      piercing: "Meer bloeding en langdurig vochtverlies. Uitdroging verhoogt het risico op flauwvallen.",
      wait: "Drink GEEN alcohol in de 24 tot 48 uur voor of na de behandeling.",
    },
    pt: {
      tattoo: "O álcool atua na função plaquetária e na coagulação, inibe a vasopressina (o que favorece a desidratação) e pode baixar a glicemia. Na prática traduz-se em mais hemorragias e exsudado durante a sessão, e num limiar de dor mais baixo em caso de ressaca. O efeito na fixação da tinta não foi estudado: encare com prudência as afirmações de que a tinta seria expulsa.",
      piercing: "Mais hemorragias e exsudado prolongado. A desidratação aumenta o risco de desmaio.",
      wait: "NÃO consuma álcool nas 24 a 48 horas antes ou depois do procedimento.",
    },
  },
  recreational_stimulants: {
    fr: {
      tattoo: "Les stimulants augmentent l'activité sympathique : élévation de la tension artérielle, tachycardie et tremblements sont bien documentés. Cela rend difficile de rester immobile pendant une séance et augmente les enjeux en cas de problème. On ne sait pas si les stimulants modifient le résultat d'un tatouage : la prudence porte ici sur votre état cardiovasculaire pendant l'intervention, pas sur l'encre.",
      piercing: "Les perceurs refusent normalement de travailler sur une personne sous influence. Rester immobile et donner un consentement éclairé comptent tous les deux, et ni l'un ni l'autre n'est fiable dans cet état.",
      wait: "N'entreprenez aucune modification corporelle avec des stimulants récréatifs actifs dans l'organisme.",
    },
    it: {
      tattoo: "Gli stimolanti aumentano l'attività simpatica: pressione arteriosa elevata, tachicardia e tremori sono ben documentati. Questo rende difficile restare immobili durante una seduta e alza la posta in gioco se qualcosa va storto. Non si sa se gli stimolanti modifichino il risultato di un tatuaggio: la prudenza riguarda qui il tuo stato cardiovascolare durante la procedura, non l'inchiostro.",
      piercing: "I piercer rifiutano normalmente di lavorare su una persona sotto effetto. Restare immobili e dare un consenso informato contano entrambi, e nessuno dei due è affidabile in quello stato.",
      wait: "Non sottoporti ad alcuna modifica corporea con stimolanti ricreativi attivi nell'organismo.",
    },
    es: {
      tattoo: "Los estimulantes aumentan la actividad simpática: tensión arterial elevada, taquicardia y temblores están bien documentados. Eso dificulta permanecer inmóvil durante una sesión y eleva lo que está en juego si algo sale mal. No se sabe si los estimulantes modifican el resultado de un tatuaje: aquí la prudencia se refiere a tu estado cardiovascular durante el procedimiento, no a la tinta.",
      piercing: "Los perforadores se niegan normalmente a trabajar sobre una persona bajo los efectos. Permanecer inmóvil y dar un consentimiento informado importan por igual, y ninguno de los dos es fiable en ese estado.",
      wait: "No te sometas a ninguna modificación corporal con estimulantes recreativos activos en el organismo.",
    },
    de: {
      tattoo: "Stimulanzien steigern die sympathische Aktivität: erhöhter Blutdruck, Tachykardie und Tremor sind gut belegt. Das macht es schwer, während einer Sitzung still zu bleiben, und erhöht den Einsatz, falls etwas schiefgeht. Ob Stimulanzien das Ergebnis einer Tätowierung verändern, wurde nicht untersucht: die Vorsicht gilt hier Ihrem Herz-Kreislauf-Zustand während des Eingriffs, nicht der Farbe.",
      piercing: "Piercer lehnen es in der Regel ab, an einer Person unter Einfluss zu arbeiten. Stillhalten und eine informierte Einwilligung zählen beide, und beides ist in diesem Zustand nicht verlässlich.",
      wait: "Unterziehen Sie sich keiner Körpermodifikation, solange Freizeitstimulanzien in Ihrem Körper wirken.",
    },
    nl: {
      tattoo: "Stimulerende middelen verhogen de sympathische activiteit: verhoogde bloeddruk, tachycardie en tremor zijn goed gedocumenteerd. Daardoor is stilzitten tijdens een sessie lastig en staat er meer op het spel als er iets misgaat. Of stimulantia het resultaat van een tatoeage veranderen is niet onderzocht: de voorzichtigheid geldt hier uw cardiovasculaire toestand tijdens de ingreep, niet de inkt.",
      piercing: "Piercers weigeren doorgaans te werken aan iemand die onder invloed is. Stilzitten en geïnformeerde toestemming geven tellen allebei, en geen van beide is in die toestand betrouwbaar.",
      wait: "Onderga geen enkele lichaamsmodificatie met actieve recreatieve stimulantia in uw lichaam.",
    },
    pt: {
      tattoo: "Os estimulantes aumentam a atividade simpática: tensão arterial elevada, taquicardia e tremores estão bem documentados. Isso dificulta ficar imóvel durante uma sessão e aumenta o que está em jogo se algo correr mal. Não se sabe se os estimulantes alteram o resultado de uma tatuagem: aqui a prudência diz respeito ao seu estado cardiovascular durante o procedimento, não à tinta.",
      piercing: "Os body piercers recusam normalmente trabalhar numa pessoa sob efeito. Ficar imóvel e dar um consentimento informado contam ambos, e nenhum deles é fiável nesse estado.",
      wait: "Não se submeta a qualquer modificação corporal com estimulantes recreativos ativos no organismo.",
    },
  },
  ibuprofen: {
    fr: {
      tattoo: "Inhibe les enzymes COX-1/2 et réduit l'agrégation plaquettaire. Prendre de l'ibuprofène avant une séance augmente le saignement et le suintement plasmatique, avec des croûtes plus épaisses à la clé. On ignore si cela affecte la tenue de l'encre elle-même. Le paracétamol est le meilleur choix avant une séance.",
      piercing: "Augmente le saignement local et les ecchymoses initiales au site du piercing. Ce n'est pas une contre-indication absolue, mais cela peut prolonger le suintement pendant la perforation des tissus.",
      wait: "Évitez les AINS non prescrits dans les 24 à 48 heures précédant une séance. Le paracétamol est une alternative plus sûre si votre médecin l'approuve.",
    },
    it: {
      tattoo: "Inibisce gli enzimi COX-1/2 e riduce l'aggregazione piastrinica. Prendere ibuprofene prima di una seduta aumenta il sanguinamento e il trasudato plasmatico, con croste più spesse di conseguenza. Non si sa se questo influisca sulla tenuta dell'inchiostro. Il paracetamolo è la scelta migliore prima di una seduta.",
      piercing: "Aumenta il sanguinamento locale e i lividi iniziali nel punto del piercing. Non è una controindicazione assoluta, ma può prolungare il trasudato durante la perforazione dei tessuti.",
      wait: "Evita i FANS non prescritti nelle 24-48 ore precedenti la seduta. Il paracetamolo è un'alternativa più sicura se approvata dal tuo medico.",
    },
    es: {
      tattoo: "Inhibe las enzimas COX-1/2 y reduce la agregación plaquetaria. Tomar ibuprofeno antes de una sesión aumenta el sangrado y el exudado plasmático, con costras más gruesas como consecuencia. Se desconoce si afecta a la retención de la tinta en sí. El paracetamol es la mejor opción antes de una sesión.",
      piercing: "Aumenta el sangrado local y los hematomas iniciales en la zona del piercing. No es una contraindicación absoluta, pero puede prolongar el exudado durante la perforación del tejido.",
      wait: "Evita los AINE no prescritos en las 24-48 horas previas a una sesión. El paracetamol es una alternativa más segura si tu médico lo aprueba.",
    },
    de: {
      tattoo: "Hemmt die COX-1/2-Enzyme und verringert die Thrombozytenaggregation. Ibuprofen vor einer Sitzung erhöht Blutung und Plasmanässen, woraus dickere Krusten folgen. Ob es das Halten der Farbe selbst beeinflusst, wurde nicht untersucht. Paracetamol ist vor einer Sitzung die bessere Wahl.",
      piercing: "Erhöht die örtliche Blutung und anfängliche Blutergüsse an der Piercingstelle. Keine absolute Kontraindikation, kann das Nässen beim Durchstechen des Gewebes aber verlängern.",
      wait: "Vermeiden Sie nicht verordnete NSAR in den 24 bis 48 Stunden vor einer Sitzung. Paracetamol ist die sicherere Alternative, sofern Ihr Arzt zustimmt.",
    },
    nl: {
      tattoo: "Remt de COX-1/2-enzymen en vermindert de bloedplaatjesaggregatie. Ibuprofen vóór een sessie verhoogt de bloeding en het plasmavocht, met dikkere korsten tot gevolg. Of het het vasthouden van de inkt zelf beïnvloedt, is niet onderzocht. Paracetamol is de betere keuze vóór een sessie.",
      piercing: "Verhoogt de plaatselijke bloeding en de eerste blauwe plekken op de piercingplek. Geen absolute contra-indicatie, maar het kan het vochtverlies tijdens het doorboren van weefsel verlengen.",
      wait: "Vermijd niet-voorgeschreven NSAID's in de 24 tot 48 uur vóór een sessie. Paracetamol is een veiliger alternatief als uw arts akkoord gaat.",
    },
    pt: {
      tattoo: "Inibe as enzimas COX-1/2 e reduz a agregação plaquetária. Tomar ibuprofeno antes de uma sessão aumenta a hemorragia e o exsudado plasmático, com crostas mais espessas em consequência. Não se sabe se afeta a fixação da tinta em si. O paracetamol é a melhor escolha antes de uma sessão.",
      piercing: "Aumenta a hemorragia local e as equimoses iniciais no local do piercing. Não é uma contraindicação absoluta, mas pode prolongar o exsudado durante a perfuração dos tecidos.",
      wait: "Evite AINE não prescritos nas 24 a 48 horas anteriores a uma sessão. O paracetamol é uma alternativa mais segura se o seu médico concordar.",
    },
  },
  naproxen: {
    fr: {
      tattoo: "AINS à action prolongée dont l'effet antiplaquettaire important dure jusqu'à 24 à 36 heures. Risque accru de saignement prolongé et de formation de croûtes. Comme pour les autres AINS, l'effet sur la tenue de l'encre elle-même n'a pas été étudié.",
      piercing: "Saignement accru et formation d'hématomes localisés sur les piercings récents.",
      wait: "À éviter 48 heures avant l'intervention en cas de prise occasionnelle contre la douleur. S'il est prescrit, consultez votre médecin avant toute interruption.",
    },
    it: {
      tattoo: "FANS a lunga durata d'azione con un effetto antiaggregante importante che persiste fino a 24-36 ore. Rischio aumentato di sanguinamento prolungato e formazione di croste. Come per gli altri FANS, l'effetto sulla tenuta dell'inchiostro non è stato studiato.",
      piercing: "Sanguinamento aumentato e formazione di ematomi localizzati sui piercing recenti.",
      wait: "Da evitare nelle 48 ore precedenti la procedura in caso di assunzione occasionale contro il dolore. Se è prescritto, consulta il tuo medico prima di sospenderlo.",
    },
    es: {
      tattoo: "AINE de acción prolongada con un efecto antiagregante importante que dura hasta 24-36 horas. Mayor riesgo de sangrado prolongado y formación de costras. Como con otros AINE, el efecto sobre la retención de la tinta no se ha estudiado.",
      piercing: "Sangrado aumentado y formación de hematomas localizados en piercings recientes.",
      wait: "Evítalo 48 horas antes del procedimiento si lo tomas ocasionalmente para el dolor. Si está prescrito, consulta a tu médico antes de suspenderlo.",
    },
    de: {
      tattoo: "Länger wirksames NSAR mit deutlicher Thrombozytenhemmung über bis zu 24 bis 36 Stunden. Erhöhtes Risiko für verlängerte Blutung und Krustenbildung. Wie bei anderen NSAR wurde die Wirkung auf das Halten der Farbe nicht untersucht.",
      piercing: "Verstärkte Blutung und örtliche Hämatombildung an frischen Piercingstellen.",
      wait: "Bei gelegentlicher Einnahme gegen Schmerzen 48 Stunden vor dem Eingriff meiden. Ist es verordnet, sprechen Sie vor dem Absetzen mit Ihrem Arzt.",
    },
    nl: {
      tattoo: "Langwerkende NSAID met een sterk plaatjesremmend effect dat tot 24 à 36 uur aanhoudt. Verhoogd risico op langdurige bloeding en korstvorming. Net als bij andere NSAID's is het effect op het vasthouden van de inkt niet onderzocht.",
      piercing: "Meer bloeding en plaatselijke hematoomvorming bij verse piercings.",
      wait: "Vermijd het 48 uur vóór de ingreep als u het incidenteel tegen pijn gebruikt. Is het voorgeschreven, overleg dan met uw arts voordat u stopt.",
    },
    pt: {
      tattoo: "AINE de ação prolongada com um efeito antiagregante importante que dura até 24 a 36 horas. Risco acrescido de hemorragia prolongada e formação de crostas. Tal como com outros AINE, o efeito na fixação da tinta não foi estudado.",
      piercing: "Hemorragia aumentada e formação de hematomas localizados em piercings recentes.",
      wait: "Evite-o 48 horas antes do procedimento se o tomar ocasionalmente para a dor. Se for prescrito, consulte o seu médico antes de suspender.",
    },
  },
  paracetamol: {
    fr: {
      tattoo: "N'inhibe PAS la fonction plaquettaire et n'augmente pas le saignement. Antalgique sûr et à privilégier pour la tension nerveuse avant l'intervention ou les douleurs après, aux doses thérapeutiques.",
      piercing: "Antalgique en vente libre idéal pour le gonflement ou la douleur après un piercing, car il ne favorise ni le saignement ni les ecchymoses.",
      wait: "Aucun délai requis avant l'intervention. Respectez les doses journalières recommandées.",
    },
    it: {
      tattoo: "NON inibisce la funzione piastrinica e non aumenta il sanguinamento. Analgesico sicuro e da preferire per la tensione nervosa prima della procedura o per il dolore dopo, alle dosi terapeutiche.",
      piercing: "Analgesico da banco ideale per il gonfiore o il dolore dopo un piercing, perché non favorisce sanguinamento né lividi.",
      wait: "Nessuna attesa richiesta prima della procedura. Rispetta le dosi giornaliere consigliate.",
    },
    es: {
      tattoo: "NO inhibe la función plaquetaria ni aumenta el sangrado. Analgésico seguro y preferible para la tensión nerviosa antes del procedimiento o el dolor posterior, a dosis terapéuticas.",
      piercing: "Analgésico de venta libre ideal para la hinchazón o el dolor tras un piercing, ya que no favorece el sangrado ni los hematomas.",
      wait: "No requiere espera antes del procedimiento. Respeta las dosis diarias recomendadas.",
    },
    de: {
      tattoo: "Hemmt die Thrombozytenfunktion NICHT und erhöht die Blutung nicht. Sicheres und bevorzugtes Schmerzmittel gegen Nervosität vor dem Eingriff oder Wundschmerz danach, in therapeutischer Dosierung.",
      piercing: "Ideales rezeptfreies Schmerzmittel bei Schwellung oder Wundschmerz nach einem Piercing, da es weder Blutung noch Blutergüsse begünstigt.",
      wait: "Keine Wartezeit vor dem Eingriff erforderlich. Bleiben Sie innerhalb der empfohlenen Tagesdosis.",
    },
    nl: {
      tattoo: "Remt de bloedplaatjesfunctie NIET en verhoogt de bloeding niet. Veilige en te verkiezen pijnstiller bij zenuwen vóór de ingreep of pijn erna, in therapeutische dosering.",
      piercing: "Ideale vrij verkrijgbare pijnstiller bij zwelling of pijn na een piercing, omdat het bloeding noch blauwe plekken bevordert.",
      wait: "Geen wachttijd nodig vóór de ingreep. Blijf binnen de aanbevolen dagdosis.",
    },
    pt: {
      tattoo: "NÃO inibe a função plaquetária nem aumenta a hemorragia. Analgésico seguro e preferível para a tensão nervosa antes do procedimento ou a dor depois, em doses terapêuticas.",
      piercing: "Analgésico de venda livre ideal para o inchaço ou a dor após um piercing, pois não favorece hemorragia nem equimoses.",
      wait: "Não é necessária qualquer espera antes do procedimento. Respeite as doses diárias recomendadas.",
    },
  },
  lidocaine_cream: {
    fr: {
      tattoo: "Modifie la texture de la peau en provoquant un œdème local et une densité spongieuse et caoutchouteuse. Peut gêner une pénétration nette de l'aiguille et la précision des lignes. Quand la crème cesse d'agir en pleine séance, un choc douloureux soudain peut survenir. Les crèmes très concentrées non réglementées présentent un risque de toxicité.",
      piercing: "Les crèmes anesthésiantes n'endorment que l'épiderme superficiel, pas le cartilage ni le tissu sous-cutané traversés. Peuvent provoquer un blanchiment et un gonflement localisés.",
      wait: "Informez toujours votre praticien avant d'appliquer une crème anesthésiante. De nombreux studios les interdisent en application par le client, en raison des risques de brûlure chimique et d'altération de la peau.",
    },
    it: {
      tattoo: "Modifica la consistenza della pelle provocando edema localizzato e una densità spugnosa e gommosa. Può ostacolare una penetrazione netta dell'ago e la precisione delle linee. Quando la crema smette di agire a metà seduta può insorgere uno shock doloroso improvviso. Le creme molto concentrate non regolamentate comportano rischi di tossicità.",
      piercing: "Le creme anestetiche addormentano solo l'epidermide superficiale, non la cartilagine né il tessuto sottocutaneo attraversati. Possono provocare sbiancamento e gonfiore localizzati.",
      wait: "Informa sempre il tuo operatore prima di applicare una crema anestetica. Molti studi ne vietano l'applicazione da parte del cliente, per il rischio di ustione chimica e di alterazione della pelle.",
    },
    es: {
      tattoo: "Modifica la textura de la piel provocando edema localizado y una densidad esponjosa y gomosa. Puede dificultar una penetración limpia de la aguja y la precisión de las líneas. Cuando la crema deja de hacer efecto a mitad de sesión puede aparecer un dolor intenso y repentino. Las cremas muy concentradas no reguladas conllevan riesgo de toxicidad.",
      piercing: "Las cremas anestésicas solo adormecen la epidermis superficial, no el cartílago ni el tejido subcutáneo atravesados. Pueden provocar palidez y hinchazón localizadas.",
      wait: "Informa siempre a tu profesional antes de aplicarte una crema anestésica. Muchos estudios prohíben que la aplique el cliente, por el riesgo de quemadura química y de alteración de la piel.",
    },
    de: {
      tattoo: "Verändert die Hautbeschaffenheit durch örtliche Schwellung und eine schwammig-gummiartige Dichte. Kann das saubere Eindringen der Nadel und die Linienpräzision behindern. Lässt die Creme mitten in der Sitzung nach, kann ein plötzlicher heftiger Schmerz auftreten. Unregulierte hochkonzentrierte Cremes bergen ein Vergiftungsrisiko.",
      piercing: "Betäubungscremes betäuben nur die oberflächliche Oberhaut, nicht den durchstochenen Knorpel oder das Unterhautgewebe. Können örtliches Abblassen und Schwellung verursachen.",
      wait: "Informieren Sie Ihren Piercer immer, bevor Sie eine Betäubungscreme auftragen. Viele Studios untersagen die Anwendung durch den Kunden wegen der Gefahr chemischer Verätzungen und veränderter Hautbeschaffenheit.",
    },
    nl: {
      tattoo: "Verandert de huidstructuur door plaatselijk oedeem en een sponzige, rubberachtige dichtheid. Kan een schone naaldpenetratie en de lijnprecisie belemmeren. Als de crème halverwege de sessie uitwerkt, kan een plotselinge hevige pijnschok optreden. Ongereguleerde hooggeconcentreerde crèmes brengen een toxiciteitsrisico met zich mee.",
      piercing: "Verdovende crèmes verdoven alleen de oppervlakkige opperhuid, niet het doorboorde kraakbeen of onderhuidse weefsel. Kunnen plaatselijke verbleking en zwelling geven.",
      wait: "Licht uw piercer altijd in voordat u verdovende crème aanbrengt. Veel studio's verbieden toepassing door de klant vanwege het risico op chemische brandwonden en veranderde huidstructuur.",
    },
    pt: {
      tattoo: "Altera a textura da pele provocando edema localizado e uma densidade esponjosa e borrachuda. Pode dificultar uma penetração limpa da agulha e a precisão das linhas. Quando o creme deixa de atuar a meio da sessão, pode surgir um choque de dor súbito. Os cremes muito concentrados não regulamentados apresentam risco de toxicidade.",
      piercing: "Os cremes anestésicos apenas adormecem a epiderme superficial, não a cartilagem nem o tecido subcutâneo atravessados. Podem provocar embranquecimento e inchaço localizados.",
      wait: "Informe sempre o seu profissional antes de aplicar um creme anestésico. Muitos estúdios proíbem a aplicação pelo cliente, pelo risco de queimadura química e de alteração da pele.",
    },
  },
  aspirin: {
    fr: {
      tattoo: "L'aspirine à faible dose augmente le saignement pendant l'intervention et les petites ecchymoses. Elle n'empêche généralement pas de se faire tatouer, mais votre tatoueur doit être informé afin d'adapter sa technique d'essuyage.",
      piercing: "Ecchymoses accrues et petits saignements. Ce n'est généralement pas une contre-indication à faible dose, mais informez votre perceur.",
      wait: "L'aspirine inhibe les plaquettes de façon irréversible : l'effet persiste 7 à 10 jours après la dernière prise. Discutez d'une pause temporaire avec votre médecin si cela se justifie.",
    },
    it: {
      tattoo: "L'aspirina a basso dosaggio aumenta il sanguinamento durante la procedura e i piccoli lividi. Di norma non impedisce di tatuarsi, ma il tuo tatuatore deve esserne informato per adattare la tecnica di pulizia.",
      piercing: "Lividi più marcati e piccoli sanguinamenti. Di solito non è una controindicazione a basse dosi, ma informa il tuo piercer.",
      wait: "L'aspirina inibisce le piastrine in modo irreversibile: l'effetto persiste 7-10 giorni dopo l'ultima dose. Valuta con il tuo medico una pausa temporanea se opportuno.",
    },
    es: {
      tattoo: "La aspirina en dosis bajas aumenta el sangrado durante el procedimiento y los hematomas leves. Normalmente no impide tatuarse, pero tu tatuador debe saberlo para adaptar la técnica de limpieza.",
      piercing: "Más hematomas y sangrados leves. En dosis bajas no suele ser una contraindicación, pero informa a tu perforador.",
      wait: "La aspirina inhibe las plaquetas de forma irreversible: el efecto persiste de 7 a 10 días tras la última dosis. Valora con tu médico una pausa temporal si procede.",
    },
    de: {
      tattoo: "Niedrig dosierte Acetylsalicylsäure erhöht die Blutung während des Eingriffs und leichte Blutergüsse. Sie schließt eine Tätowierung meist nicht aus, Ihr Tätowierer sollte es aber wissen, um die Wischtechnik anzupassen.",
      piercing: "Verstärkte Blutergüsse und leichte Blutungen. In niedriger Dosis meist keine Kontraindikation, informieren Sie aber Ihren Piercer.",
      wait: "Acetylsalicylsäure hemmt die Thrombozyten irreversibel: die Wirkung hält 7 bis 10 Tage nach der letzten Einnahme an. Besprechen Sie eine vorübergehende Pause mit Ihrem Arzt, wenn das sinnvoll ist.",
    },
    nl: {
      tattoo: "Aspirine in lage dosis verhoogt de bloeding tijdens de ingreep en lichte blauwe plekken. Het verhindert tatoeëren meestal niet, maar uw tatoeëerder moet het weten om de veegtechniek aan te passen.",
      piercing: "Meer blauwe plekken en lichte bloedingen. In lage dosis meestal geen contra-indicatie, maar licht uw piercer in.",
      wait: "Aspirine remt de bloedplaatjes onomkeerbaar: het effect houdt 7 tot 10 dagen na de laatste dosis aan. Bespreek zo nodig een tijdelijke pauze met uw arts.",
    },
    pt: {
      tattoo: "A aspirina em dose baixa aumenta a hemorragia durante o procedimento e as pequenas equimoses. Normalmente não impede tatuar, mas o seu tatuador deve ser informado para adaptar a técnica de limpeza.",
      piercing: "Mais equimoses e pequenas hemorragias. Em dose baixa não costuma ser contraindicação, mas informe o seu body piercer.",
      wait: "A aspirina inibe as plaquetas de forma irreversível: o efeito persiste 7 a 10 dias após a última dose. Avalie com o seu médico uma pausa temporária, se se justificar.",
    },
  },
  tretinoin: {
    fr: {
      tattoo: "Les rétinoïdes topiques appliqués sur la zone à tatouer affinent les couches supérieures de la peau et augmentent la sensibilité. Cessez l'application sur la zone concernée 2 à 4 semaines avant. L'absorption générale par voie cutanée est minime.",
      piercing: "Évitez d'appliquer des rétinoïdes topiques sur un piercing récent ou à proximité pendant la cicatrisation, afin de prévenir une irritation chimique.",
      wait: "Arrêtez la trétinoïne topique sur la zone concernée 2 à 4 semaines avant le tatouage.",
    },
    it: {
      tattoo: "I retinoidi topici applicati sull'area da tatuare assottigliano gli strati superiori della pelle e aumentano la sensibilità. Sospendi l'applicazione sull'area interessata 2-4 settimane prima. L'assorbimento sistemico per via cutanea è minimo.",
      piercing: "Evita di applicare retinoidi topici su un piercing recente o nelle vicinanze durante la guarigione, per prevenire irritazioni chimiche.",
      wait: "Sospendi la tretinoina topica sull'area interessata 2-4 settimane prima del tatuaggio.",
    },
    es: {
      tattoo: "Los retinoides tópicos aplicados en la zona del tatuaje adelgazan las capas superiores de la piel y aumentan la sensibilidad. Deja de aplicarlos en la zona 2-4 semanas antes. La absorción sistémica por vía cutánea es mínima.",
      piercing: "Evita aplicar retinoides tópicos sobre un piercing reciente o cerca de él durante la cicatrización, para prevenir irritación química.",
      wait: "Suspende la tretinoína tópica en la zona concreta 2-4 semanas antes del tatuaje.",
    },
    de: {
      tattoo: "Topische Retinoide auf der zu tätowierenden Stelle verdünnen die oberen Hautschichten und erhöhen die Empfindlichkeit. Setzen Sie die Anwendung auf der betroffenen Stelle 2 bis 4 Wochen vorher aus. Die systemische Aufnahme über die Haut ist minimal.",
      piercing: "Tragen Sie während der Heilung keine topischen Retinoide auf ein frisches Piercing oder in dessen Nähe auf, um chemische Reizungen zu vermeiden.",
      wait: "Setzen Sie topisches Tretinoin an der betreffenden Stelle 2 bis 4 Wochen vor dem Tätowieren ab.",
    },
    nl: {
      tattoo: "Lokale retinoïden op de te tatoeëren plek maken de bovenste huidlagen dunner en verhogen de gevoeligheid. Stop het gebruik op die plek 2 tot 4 weken vooraf. De systemische opname via de huid is minimaal.",
      piercing: "Breng tijdens de genezing geen lokale retinoïden aan op of nabij een verse piercing, om chemische irritatie te voorkomen.",
      wait: "Stop lokale tretinoïne op de betreffende plek 2 tot 4 weken vóór het tatoeëren.",
    },
    pt: {
      tattoo: "Os retinoides tópicos aplicados na zona a tatuar adelgaçam as camadas superiores da pele e aumentam a sensibilidade. Suspenda a aplicação na zona 2 a 4 semanas antes. A absorção sistémica por via cutânea é mínima.",
      piercing: "Evite aplicar retinoides tópicos sobre um piercing recente ou perto dele durante a cicatrização, para prevenir irritação química.",
      wait: "Suspenda a tretinoína tópica na zona específica 2 a 4 semanas antes da tatuagem.",
    },
  },
  adapalene: {
    fr: {
      tattoo: "Rétinoïde topique provoquant une sensibilité cutanée localisée et une desquamation. À arrêter sur la zone concernée avant le tatouage.",
      piercing: "À tenir éloigné des piercings récents pour prévenir une irritation sévère ou un retard d'épithélialisation.",
      wait: "Arrêtez l'application topique sur la zone concernée 2 semaines avant l'intervention.",
    },
    it: {
      tattoo: "Retinoide topico che provoca sensibilità cutanea localizzata e desquamazione. Da sospendere sull'area interessata prima del tatuaggio.",
      piercing: "Tienilo lontano dai piercing recenti per prevenire irritazioni gravi o un ritardo dell'epitelizzazione.",
      wait: "Sospendi l'applicazione topica sull'area interessata 2 settimane prima della procedura.",
    },
    es: {
      tattoo: "Retinoide tópico que provoca sensibilidad cutánea localizada y descamación. Suspéndelo en la zona antes del tatuaje.",
      piercing: "Mantenlo alejado de los piercings recientes para prevenir irritación grave o un retraso de la epitelización.",
      wait: "Suspende la aplicación tópica en la zona 2 semanas antes del procedimiento.",
    },
    de: {
      tattoo: "Topisches Retinoid, das örtliche Hautempfindlichkeit und Schuppung verursacht. An der betreffenden Stelle vor dem Tätowieren absetzen.",
      piercing: "Von frischen Piercings fernhalten, um starke Reizungen oder eine verzögerte Epithelisierung zu vermeiden.",
      wait: "Setzen Sie die topische Anwendung an der betreffenden Stelle 2 Wochen vor dem Eingriff ab.",
    },
    nl: {
      tattoo: "Lokaal retinoïde dat plaatselijke huidgevoeligheid en vervelling veroorzaakt. Stop het gebruik op de betreffende plek vóór het tatoeëren.",
      piercing: "Houd het weg van verse piercings om ernstige irritatie of vertraagde epithelialisatie te voorkomen.",
      wait: "Stop de lokale toepassing op de betreffende plek 2 weken vóór de ingreep.",
    },
    pt: {
      tattoo: "Retinoide tópico que provoca sensibilidade cutânea localizada e descamação. Suspenda-o na zona antes da tatuagem.",
      piercing: "Mantenha-o afastado de piercings recentes para prevenir irritação grave ou atraso da epitelização.",
      wait: "Suspenda a aplicação tópica na zona 2 semanas antes do procedimento.",
    },
  },
  tetracyclines: {
    fr: {
      tattoo: "Provoquent une photosensibilité importante : l'exposition aux UV d'un tatouage récent pendant le traitement peut déclencher des réactions allergiques douloureuses et une décoloration de l'encre. La minocycline peut rarement provoquer une pigmentation cutanée gris-bleu.",
      piercing: "Aucune interaction directe avec la cicatrisation, mais protégez le piercing récent du soleil.",
      wait: "Évitez toute exposition au soleil ou aux UV sur la zone concernée pendant un traitement par tétracyclines.",
    },
    it: {
      tattoo: "Provocano una fotosensibilità importante: l'esposizione ai raggi UV di un tatuaggio recente durante il trattamento può scatenare reazioni allergiche dolorose e uno sbiadimento dell'inchiostro. La minociclina può raramente causare una pigmentazione cutanea grigio-blu.",
      piercing: "Nessuna interazione diretta con la guarigione, ma proteggi dal sole il piercing recente.",
      wait: "Evita l'esposizione al sole o ai raggi UV sull'area interessata durante il trattamento con tetracicline.",
    },
    es: {
      tattoo: "Provocan una fotosensibilidad importante: la exposición a los UV de un tatuaje reciente durante el tratamiento puede desencadenar reacciones alérgicas dolorosas y decoloración de la tinta. La minociclina puede causar en raras ocasiones una pigmentación cutánea gris azulada.",
      piercing: "Ninguna interacción directa con la cicatrización, pero protege del sol el piercing reciente.",
      wait: "Evita la exposición al sol o a los UV en la zona mientras tomes tetraciclinas.",
    },
    de: {
      tattoo: "Verursachen eine deutliche Lichtempfindlichkeit: UV-Belastung einer frischen Tätowierung während der Behandlung kann schmerzhafte allergische Reaktionen und ein Ausbleichen der Farbe auslösen. Minocyclin kann selten eine blaugraue Hautpigmentierung hervorrufen.",
      piercing: "Keine direkte Wechselwirkung mit der Heilung, schützen Sie ein frisches Piercing aber vor Sonne.",
      wait: "Vermeiden Sie während der Einnahme von Tetrazyklinen Sonnen- und UV-Belastung der betreffenden Stelle.",
    },
    nl: {
      tattoo: "Veroorzaken sterke lichtgevoeligheid: UV-blootstelling van een verse tatoeage tijdens de behandeling kan pijnlijke allergische reacties en het vervagen van de inkt uitlokken. Minocycline kan zelden een blauwgrijze huidpigmentatie geven.",
      piercing: "Geen directe wisselwerking met de genezing, maar bescherm een verse piercing tegen de zon.",
      wait: "Vermijd zon- of UV-blootstelling van de betreffende plek tijdens gebruik van tetracyclines.",
    },
    pt: {
      tattoo: "Provocam uma fotossensibilidade importante: a exposição aos UV de uma tatuagem recente durante o tratamento pode desencadear reações alérgicas dolorosas e desvanecimento da tinta. A minociclina pode, raramente, causar uma pigmentação cutânea cinzento-azulada.",
      piercing: "Nenhuma interação direta com a cicatrização, mas proteja do sol o piercing recente.",
      wait: "Evite a exposição ao sol ou aos UV na zona enquanto tomar tetraciclinas.",
    },
  },
  antivirals_herpes: {
    fr: {
      tattoo: "ESSENTIEL POUR LES TATOUAGES DES LÈVRES ET LE MAQUILLAGE PERMANENT : le maquillage permanent des lèvres peut déclencher de fortes poussées d'HSV-1 (bouton de fièvre). Un traitement antiviral préventif est fortement recommandé avant tout tatouage des lèvres.",
      piercing: "Les piercings des lèvres ou de la bouche peuvent déclencher des poussées d'herpès chez les personnes porteuses du HSV. Un antiviral préventif évite des lésions herpétiques douloureuses sur un piercing récent.",
      wait: "Commencez l'antiviral préventif 2 jours avant un tatouage des lèvres ou un piercing buccal, selon les indications de votre médecin.",
    },
    it: {
      tattoo: "FONDAMENTALE PER I TATUAGGI DELLE LABBRA E IL TRUCCO PERMANENTE: il trucco permanente delle labbra può scatenare forti riacutizzazioni di HSV-1 (herpes labiale). Un trattamento antivirale preventivo è fortemente consigliato prima di tatuare le labbra.",
      piercing: "I piercing alle labbra o alla bocca possono scatenare episodi di herpes nelle persone portatrici di HSV. Un antivirale preventivo evita lesioni erpetiche dolorose su un piercing recente.",
      wait: "Inizia l'antivirale preventivo 2 giorni prima di un tatuaggio alle labbra o di un piercing orale, secondo le indicazioni del tuo medico.",
    },
    es: {
      tattoo: "ESENCIAL PARA LOS TATUAJES DE LABIOS Y EL MAQUILLAJE PERMANENTE: el maquillaje permanente de labios puede desencadenar brotes intensos de VHS-1 (herpes labial). Se recomienda encarecidamente un antiviral preventivo antes de tatuar los labios.",
      piercing: "Los piercings de labio o bucales pueden desencadenar brotes de herpes en personas portadoras del VHS. Un antiviral preventivo evita lesiones herpéticas dolorosas sobre un piercing reciente.",
      wait: "Empieza el antiviral preventivo 2 días antes de un tatuaje de labios o un piercing bucal, según las indicaciones de tu médico.",
    },
    de: {
      tattoo: "ENTSCHEIDEND BEI LIPPENTÄTOWIERUNGEN UND PERMANENT MAKE-UP: dauerhaftes Lippen-Make-up kann schwere HSV-1-Schübe (Lippenherpes) auslösen. Eine vorbeugende antivirale Behandlung wird vor dem Tätowieren der Lippen dringend empfohlen.",
      piercing: "Lippen- und Mundpiercings können bei HSV-positiven Kunden Herpesschübe auslösen. Ein vorbeugendes Virostatikum verhindert schmerzhafte Herpesläsionen an einem frischen Piercing.",
      wait: "Beginnen Sie die vorbeugende antivirale Einnahme 2 Tage vor einer Lippentätowierung oder einem Mundpiercing, nach Anweisung Ihres Arztes.",
    },
    nl: {
      tattoo: "CRUCIAAL BIJ LIPTATOEAGES EN PERMANENTE MAKE-UP: permanente lipmake-up kan hevige HSV-1-uitbraken (koortslip) uitlokken. Een preventieve antivirale behandeling wordt sterk aanbevolen vóór het tatoeëren van de lippen.",
      piercing: "Lip- of mondpiercings kunnen bij HSV-positieve klanten koortslipuitbraken uitlokken. Een preventief antiviraal middel voorkomt pijnlijke herpeslaesies op een verse piercing.",
      wait: "Begin het preventieve antivirale middel 2 dagen vóór een liptatoeage of mondpiercing, volgens voorschrift van uw arts.",
    },
    pt: {
      tattoo: "ESSENCIAL PARA TATUAGENS DOS LÁBIOS E MAQUILHAGEM PERMANENTE: a maquilhagem permanente dos lábios pode desencadear surtos fortes de HSV-1 (herpes labial). Recomenda-se vivamente um antiviral preventivo antes de tatuar os lábios.",
      piercing: "Os piercings no lábio ou na boca podem desencadear surtos de herpes em pessoas portadoras do HSV. Um antiviral preventivo evita lesões herpéticas dolorosas num piercing recente.",
      wait: "Inicie o antiviral preventivo 2 dias antes de uma tatuagem nos lábios ou de um piercing oral, conforme indicação do seu médico.",
    },
  },
  xanax: {
    fr: {
      tattoo: "Provoque une dépression du système nerveux central, de la somnolence et une baisse de la tension artérielle. Associé à la douleur ou à l'anxiété, cela peut declencher une chute brutale de tension ou un malaise. Prévenez votre tatoueur.",
      piercing: "Augmente le risque de syncope vasovagale (malaise) après la procédure. Restez assis ou allongé pendant 15 minutes après le piercing.",
      wait: "Prévenez votre praticien si vous en avez pris avant la séance pour l'anxiété. Ne conduisez pas pour vous rendre au rendez-vous ni pour en revenir si vous êtes sédaté.",
    },
    it: {
      tattoo: "Provoca depressione del sistema nervoso centrale, sonnolenza e abbassamento della pressione. Unita al dolore o all'ansia può causare cali improvvisi di pressione o svenimenti. Informi il tatuatore.",
      piercing: "Aumenta il rischio di sincope vasovagale (svenimento) dopo la procedura. Resti seduto o sdraiato per 15 minuti dopo il piercing.",
      wait: "Informi il professionista se l'ha assunta prima della seduta per l'ansia. Non guidi per andare all'appuntamento né per tornare se è sedato.",
    },
    es: {
      tattoo: "Provoca depresión del sistema nervioso central, somnolencia y descenso de la tensión arterial. Junto con el dolor o la ansiedad puede provocar bajadas bruscas de tensión o desmayos. Informe a su tatuador.",
      piercing: "Aumenta el riesgo de síncope vasovagal (desmayo) tras el procedimiento. Permanezca sentado o tumbado 15 minutos después del piercing.",
      wait: "Informe al profesional si la ha tomado antes de la sesión por ansiedad. No conduzca para ir a la cita ni para volver si está sedado.",
    },
    de: {
      tattoo: "Verursacht eine Dämpfung des zentralen Nervensystems, Schläfrigkeit und Blutdruckabfall. Zusammen mit Schmerz oder Angst kann es zu plötzlichem Blutdruckabfall oder Ohnmacht kommen. Informieren Sie Ihren Tätowierer.",
      piercing: "Erhöht das Risiko einer vasovagalen Synkope (Ohnmacht) nach dem Eingriff. Bleiben Sie nach dem Piercing 15 Minuten sitzen oder liegen.",
      wait: "Informieren Sie Ihren Piercer, wenn Sie das Mittel vor dem Termin gegen Angst eingenommen haben. Fahren Sie unter Sedierung weder hin noch zurück.",
    },
    nl: {
      tattoo: "Veroorzaakt onderdrukking van het centrale zenuwstelsel, sufheid en een lagere bloeddruk. In combinatie met pijn of angst kan dit een plotselinge bloeddrukdaling of flauwvallen uitlokken. Informeer je tatoeageartiest.",
      piercing: "Verhoogt het risico op een vasovagale syncope (flauwvallen) na de behandeling. Blijf 15 minuten na de piercing zitten of liggen.",
      wait: "Vertel het je piercer als je het voor de afspraak tegen angst hebt ingenomen. Rijd niet zelf naar of van de afspraak als je gesedeerd bent.",
    },
    pt: {
      tattoo: "Provoca depressão do sistema nervoso central, sonolência e descida da tensão arterial. Associado à dor ou à ansiedade, pode desencadear quedas bruscas de tensão ou desmaios. Informe o seu tatuador.",
      piercing: "Aumenta o risco de síncope vasovagal (desmaio) após o procedimento. Fique sentado ou deitado durante 15 minutos após o piercing.",
      wait: "Informe o profissional se o tomou antes da sessão por ansiedade. Não conduza para ir à consulta nem para regressar se estiver sedado.",
    },
  },
  propranolol: {
    fr: {
      tattoo: "Ralentit le rythme cardiaque et atténue la réponse normale au stress par l'adrénaline. Lors de longues séances ou en cas de douleur, le risque d'hypotension orthostatique et de malaise vagal est plus élevé.",
      piercing: "Risque de malaise plus élevé au moment de l'insertion rapide de l'aiguille. Le perceur doit réaliser la procédure avec le client allongé.",
      wait: "N'interrompez jamais un traitement cardiaque prescrit. Prévenez votre tatoueur ou votre perceur pour qu'il adapte votre position.",
    },
    it: {
      tattoo: "Riduce la frequenza cardiaca e attenua la normale risposta allo stress mediata dall'adrenalina. Nelle sedute lunghe o in caso di dolore aumenta il rischio di ipotensione ortostatica e di svenimento vagale.",
      piercing: "Rischio di svenimento più alto durante l'inserimento rapido dell'ago. Il piercer deve eseguire la procedura con il cliente sdraiato.",
      wait: "Non sospenda mai una terapia cardiaca prescritta. Informi il tatuatore o il piercer perché possa adattare la posizione.",
    },
    es: {
      tattoo: "Reduce la frecuencia cardíaca y amortigua la respuesta normal al estrés mediada por la adrenalina. En sesiones largas o con dolor, el riesgo de hipotensión ortostática y de desmayo vagal es mayor.",
      piercing: "Mayor riesgo de desmayo durante la inserción rápida de la aguja. El perforador debe realizar el procedimiento con el cliente tumbado.",
      wait: "Nunca interrumpa una medicación cardíaca prescrita. Informe a su tatuador o perforador para que adapte su posición.",
    },
    de: {
      tattoo: "Senkt die Herzfrequenz und dämpft die normale Stressreaktion über Adrenalin. Bei langen Sitzungen oder Schmerz besteht ein höheres Risiko für orthostatische Hypotonie und vagale Ohnmacht.",
      piercing: "Höheres Ohnmachtsrisiko beim schnellen Einstich. Der Piercer sollte den Eingriff im Liegen durchführen.",
      wait: "Setzen Sie verordnete Herzmedikamente nie ab. Informieren Sie Tätowierer oder Piercer, damit die Sitzposition angepasst wird.",
    },
    nl: {
      tattoo: "Verlaagt de hartslag en dempt de normale stressreactie via adrenaline. Bij lange sessies of pijn is het risico op orthostatische hypotensie en vasovagaal flauwvallen groter.",
      piercing: "Hoger risico op flauwvallen tijdens het snel inbrengen van de naald. De piercer moet de behandeling uitvoeren met de klant liggend.",
      wait: "Stop nooit met voorgeschreven hartmedicatie. Vertel het je tatoeageartiest of piercer zodat de houding kan worden aangepast.",
    },
    pt: {
      tattoo: "Reduz a frequência cardíaca e atenua a resposta normal ao stress mediada pela adrenalina. Em sessões longas ou com dor, o risco de hipotensão ortostática e de desmaio vagal é maior.",
      piercing: "Maior risco de desmaio durante a inserção rápida da agulha. O body piercer deve realizar o procedimento com o cliente deitado.",
      wait: "Nunca interrompa medicação cardíaca prescrita. Informe o seu tatuador ou body piercer para que adapte a sua posição.",
    },
  },
  hydroxyzine: {
    fr: {
      tattoo: "Utilisé contre l'anxiété légère ou l'urticaire. Provoque une légère somnolence et une bouche sèche. Interaction directe minime avec le tatouage.",
      piercing: "Effet sédatif léger. Restez bien hydraté pendant la séance.",
      wait: "Aucun délai d'arrêt nécessaire.",
    },
    it: {
      tattoo: "Usato per ansia lieve o orticaria. Provoca lieve sonnolenza e secchezza delle fauci. Interazione diretta minima con il tatuaggio.",
      piercing: "Lieve effetto sedativo. Si mantenga idratato durante la seduta.",
      wait: "Non serve alcun periodo di sospensione.",
    },
    es: {
      tattoo: "Se usa para la ansiedad leve o la urticaria. Provoca somnolencia leve y sequedad de boca. Interacción directa mínima con el tatuaje.",
      piercing: "Efecto sedante leve. Manténgase hidratado durante la sesión.",
      wait: "No se requiere periodo de retirada.",
    },
    de: {
      tattoo: "Wird bei leichter Angst oder Nesselsucht eingesetzt. Verursacht leichte Schläfrigkeit und Mundtrockenheit. Nur minimale direkte Wechselwirkung mit dem Tätowieren.",
      piercing: "Leichte sedierende Wirkung. Trinken Sie während der Sitzung ausreichend.",
      wait: "Keine Karenzzeit erforderlich.",
    },
    nl: {
      tattoo: "Wordt gebruikt bij lichte angst of netelroos. Veroorzaakt lichte sufheid en een droge mond. Minimale directe wisselwerking met tatoeëren.",
      piercing: "Licht kalmerend effect. Blijf goed drinken tijdens de sessie.",
      wait: "Geen stopperiode nodig.",
    },
    pt: {
      tattoo: "Usado para ansiedade ligeira ou urticária. Provoca sonolência ligeira e boca seca. Interação direta mínima com a tatuagem.",
      piercing: "Efeito sedativo ligeiro. Mantenha-se hidratado durante a sessão.",
      wait: "Não é necessário qualquer período de suspensão.",
    },
  },
  birth_control: {
    fr: {
      tattoo: "Les contraceptifs contenant des œstrogènes augmentent légèrement le risque de base d'hyperpigmentation (mélasma) en cas d'exposition au soleil pendant la cicatrisation. Impact minime sur le tatouage.",
      piercing: "Les progestatifs ou les œstrogènes peuvent provoquer une légère rétention d'eau ou une sensibilité au gonflement localisée.",
      wait: "Aucune modification nécessaire avant la procédure.",
    },
    it: {
      tattoo: "I contraccettivi contenenti estrogeni aumentano leggermente il rischio di base di iperpigmentazione (melasma) se la pelle viene esposta al sole durante la guarigione. Impatto minimo sul tatuaggio.",
      piercing: "Progestinici o estrogeni possono causare lieve ritenzione idrica o maggiore sensibilità al gonfiore localizzato.",
      wait: "Non serve alcuna modifica prima della procedura.",
    },
    es: {
      tattoo: "Los anticonceptivos con estrógenos aumentan ligeramente el riesgo basal de hiperpigmentación (melasma) si la piel se expone al sol durante la cicatrización. Impacto mínimo sobre el tatuaje.",
      piercing: "Los gestágenos o los estrógenos pueden causar leve retención de líquidos o mayor sensibilidad a la hinchazón localizada.",
      wait: "No se requiere ningún cambio antes del procedimiento.",
    },
    de: {
      tattoo: "Östrogenhaltige Verhütungsmittel erhöhen das Grundrisiko einer Hyperpigmentierung (Melasma) leicht, wenn die Haut während der Heilung der Sonne ausgesetzt wird. Minimaler Einfluss auf das Tätowieren.",
      piercing: "Gestagene oder Östrogene können leichte Wassereinlagerungen oder eine erhöhte Empfindlichkeit für örtliche Schwellungen verursachen.",
      wait: "Vor dem Eingriff sind keine Änderungen nötig.",
    },
    nl: {
      tattoo: "Anticonceptie met oestrogeen verhoogt het basisrisico op hyperpigmentatie (melasma) licht wanneer de huid tijdens de genezing in de zon komt. Minimale invloed op tatoeëren.",
      piercing: "Progestageen of oestrogeen kan lichte vochtophoping of meer gevoeligheid voor plaatselijke zwelling geven.",
      wait: "Geen aanpassingen nodig voor de behandeling.",
    },
    pt: {
      tattoo: "Os contracetivos com estrogénio aumentam ligeiramente o risco de base de hiperpigmentação (melasma) se a pele for exposta ao sol durante a cicatrização. Impacto mínimo na tatuagem.",
      piercing: "Progestativos ou estrogénios podem causar ligeira retenção de líquidos ou maior sensibilidade ao inchaço localizado.",
      wait: "Não é necessária qualquer alteração antes do procedimento.",
    },
  },
  hrt_testosterone: {
    fr: {
      tattoo: "Le traitement par testostérone peut augmenter la séborrhée, l'épaisseur de la peau et l'hématocrite (densité des globules rouges), ce qui peut rendre le sang légèrement plus épais pendant la séance. Généralement sans danger pour le tatouage.",
      piercing: "La testostérone peut épaissir la peau et augmenter la production de sébum autour des piercings du visage ou du corps. Maintenez une bonne hygiène.",
      wait: "Aucune modification nécessaire avant la procédure. Poursuivez votre traitement hormonal aux doses habituelles.",
    },
    it: {
      tattoo: "La terapia con testosterone può aumentare l'untuosità e lo spessore della pelle e l'ematocrito (densità dei globuli rossi), rendendo il sangue leggermente più denso durante la seduta. In genere sicura per il tatuaggio.",
      piercing: "Il testosterone può ispessire la pelle e aumentare la produzione di sebo attorno ai piercing del viso o del corpo. Mantenga una buona igiene.",
      wait: "Non serve alcuna modifica prima della procedura. Prosegua la terapia ormonale ai dosaggi abituali.",
    },
    es: {
      tattoo: "El tratamiento con testosterona puede aumentar la grasa y el grosor de la piel y el hematocrito (densidad de glóbulos rojos), lo que puede hacer que la sangre sea algo más espesa durante la sesión. En general es seguro para tatuar.",
      piercing: "La testosterona puede engrosar la piel y aumentar la producción de sebo alrededor de los piercings faciales o corporales. Mantenga una buena higiene.",
      wait: "No se requiere ningún cambio antes del procedimiento. Continúe con su tratamiento hormonal a las dosis habituales.",
    },
    de: {
      tattoo: "Eine Testosterontherapie kann Hautfett, Hautdicke und Hämatokrit (Dichte der roten Blutkörperchen) erhöhen, wodurch das Blut während der Sitzung etwas dickflüssiger sein kann. Für das Tätowieren in der Regel unbedenklich.",
      piercing: "Testosteron kann die Haut verdicken und die Talgproduktion rund um Gesichts- oder Körperpiercings steigern. Achten Sie auf gute Hygiene.",
      wait: "Vor dem Eingriff sind keine Änderungen nötig. Setzen Sie die Hormontherapie in gewohnter Dosierung fort.",
    },
    nl: {
      tattoo: "Testosterontherapie kan de huid vetter en dikker maken en de hematocriet (dichtheid van rode bloedcellen) verhogen, waardoor het bloed tijdens de sessie iets dikker kan zijn. Meestal veilig om te tatoeëren.",
      piercing: "Testosteron kan de huid verdikken en de talgproductie rond gezichts- of lichaamspiercings verhogen. Houd de hygiëne goed bij.",
      wait: "Geen aanpassingen nodig voor de behandeling. Ga door met je gebruikelijke hormoondosering.",
    },
    pt: {
      tattoo: "A terapia com testosterona pode aumentar a oleosidade e a espessura da pele e o hematócrito (densidade dos glóbulos vermelhos), o que pode tornar o sangue ligeiramente mais espesso durante a sessão. Em geral é segura para tatuar.",
      piercing: "A testosterona pode espessar a pele e aumentar a produção de sebo junto a piercings faciais ou corporais. Mantenha uma boa higiene.",
      wait: "Não é necessária qualquer alteração antes do procedimento. Mantenha as doses habituais da sua terapia hormonal.",
    },
  },
  hrt_estrogen: {
    fr: {
      tattoo: "Le traitement par œstrogènes affine légèrement le derme avec le temps et rend la peau plus souple. La spironolactone a un effet diurétique léger et abaisse un peu la tension : veillez à être bien hydraté.",
      piercing: "La spironolactone augmente la diurèse et déshydrate légèrement les tissus : buvez davantage avant le piercing.",
      wait: "Aucune modification nécessaire avant la procédure. Restez bien hydraté.",
    },
    it: {
      tattoo: "La terapia con estrogeni assottiglia leggermente il derma nel tempo e rende la pelle più morbida. Lo spironolattone ha un lieve effetto diuretico e abbassa un po' la pressione: si assicuri di essere ben idratato.",
      piercing: "Lo spironolattone aumenta la diuresi e disidrata leggermente i tessuti: beva di più prima del piercing.",
      wait: "Non serve alcuna modifica prima della procedura. Si mantenga ben idratato.",
    },
    es: {
      tattoo: "El tratamiento con estrógenos adelgaza ligeramente la dermis con el tiempo y ablanda la piel. La espironolactona tiene un leve efecto diurético y baja algo la tensión: asegúrese de estar bien hidratado.",
      piercing: "La espironolactona aumenta la diuresis y deshidrata levemente los tejidos: beba más líquido antes del piercing.",
      wait: "No se requiere ningún cambio antes del procedimiento. Manténgase bien hidratado.",
    },
    de: {
      tattoo: "Eine Östrogentherapie macht die Lederhaut mit der Zeit etwas dünner und die Haut weicher. Spironolacton wirkt leicht harntreibend und senkt den Blutdruck etwas: achten Sie auf ausreichend Flüssigkeit.",
      piercing: "Spironolacton steigert die Harnausscheidung und trocknet das Gewebe leicht aus: trinken Sie vor dem Piercing mehr.",
      wait: "Vor dem Eingriff sind keine Änderungen nötig. Bleiben Sie gut hydriert.",
    },
    nl: {
      tattoo: "Oestrogeentherapie maakt de lederhuid na verloop van tijd iets dunner en de huid zachter. Spironolacton werkt licht vochtafdrijvend en verlaagt de bloeddruk wat: zorg dat je goed gedronken hebt.",
      piercing: "Spironolacton verhoogt de urineproductie en droogt het weefsel licht uit: drink extra voor de piercing.",
      wait: "Geen aanpassingen nodig voor de behandeling. Blijf goed drinken.",
    },
    pt: {
      tattoo: "A terapia com estrogénio adelgaça ligeiramente a derme ao longo do tempo e torna a pele mais macia. A espironolactona tem um ligeiro efeito diurético e baixa um pouco a tensão: certifique-se de que está bem hidratado.",
      piercing: "A espironolactona aumenta a diurese e desidrata ligeiramente os tecidos: beba mais líquidos antes do piercing.",
      wait: "Não é necessária qualquer alteração antes do procedimento. Mantenha-se bem hidratado.",
    },
  },
  adhd_stimulants: {
    fr: {
      tattoo: "Les stimulants augmentent la fréquence cardiaque, la tension artérielle et l'éveil du système nerveux central. Ils peuvent rendre nerveux, abaisser la tolérance à la douleur lors de longues séances et accentuer la déshydratation. La glycémie chute plus vite.",
      piercing: "Tension nerveuse et raideur musculaire accrues pendant le piercing. Risque plus élevé d'étourdissement soudain lorsque l'adrénaline retombe.",
      wait: "Prenez un repas consistant et buvez beaucoup d'eau avant votre rendez-vous. Prévenez votre praticien.",
    },
    it: {
      tattoo: "Gli stimolanti aumentano frequenza cardiaca, pressione e attivazione del sistema nervoso centrale. Possono rendere agitati, abbassare la tolleranza al dolore nelle sedute lunghe e aumentare la disidratazione. La glicemia cala più rapidamente.",
      piercing: "Maggiore tensione nervosa e rigidità muscolare durante il piercing. Più alto il rischio di improvvisi capogiri quando l'adrenalina cala.",
      wait: "Faccia un pasto abbondante e beva molta acqua prima dell'appuntamento. Informi il professionista.",
    },
    es: {
      tattoo: "Los estimulantes elevan la frecuencia cardíaca, la tensión arterial y la activación del sistema nervioso central. Pueden provocar nerviosismo, reducir la tolerancia al dolor en sesiones largas y aumentar la deshidratación. La glucemia baja más deprisa.",
      piercing: "Mayor tensión nerviosa y rigidez muscular durante el piercing. Mayor riesgo de mareo repentino cuando baja la adrenalina.",
      wait: "Coma una comida abundante y beba mucha agua antes de la cita. Informe a su profesional.",
    },
    de: {
      tattoo: "Stimulanzien erhöhen Herzfrequenz, Blutdruck und die Erregung des zentralen Nervensystems. Sie können unruhig machen, die Schmerztoleranz in langen Sitzungen senken und die Austrocknung verstärken. Der Blutzucker fällt schneller.",
      piercing: "Stärkere nervöse Anspannung und Muskelverspannung während des Piercings. Höheres Risiko für plötzlichen Schwindel, wenn das Adrenalin abfällt.",
      wait: "Essen Sie vor dem Termin ausgiebig und trinken Sie viel Wasser. Informieren Sie Ihren Piercer oder Tätowierer.",
    },
    nl: {
      tattoo: "Stimulantia verhogen de hartslag, de bloeddruk en de prikkeling van het centrale zenuwstelsel. Ze kunnen je onrustig maken, de pijntolerantie tijdens lange sessies verlagen en uitdroging versterken. De bloedsuiker daalt sneller.",
      piercing: "Meer nerveuze spanning en spierspanning tijdens de piercing. Groter risico op plotselinge duizeligheid wanneer de adrenaline wegvalt.",
      wait: "Eet een stevige maaltijd en drink veel water voor je afspraak. Vertel het je piercer of tatoeageartiest.",
    },
    pt: {
      tattoo: "Os estimulantes aumentam a frequência cardíaca, a tensão arterial e a ativação do sistema nervoso central. Podem deixar a pessoa agitada, reduzir a tolerância à dor em sessões longas e agravar a desidratação. A glicemia desce mais depressa.",
      piercing: "Maior tensão nervosa e rigidez muscular durante o piercing. Maior risco de tontura repentina quando a adrenalina desce.",
      wait: "Faça uma refeição completa e beba muita água antes da marcação. Informe o seu profissional.",
    },
  },
  cannabis: {
    fr: {
      tattoo: "Le THC augmente la fréquence cardiaque de base, dilate les vaisseaux sanguins (ce qui accroît l'exsudation de plasma) et peut fortement amplifier l'anxiété ou la paranoïa pendant la perforation de la peau. Beaucoup de praticiens refusent un client sous influence.",
      piercing: "Augmente le risque de syncope vasovagale ou de panique soudaine lors de l'insertion du bijou. Modifie la perception de la douleur de façon imprévisible.",
      wait: "Évitez de fumer ou de consommer des comestibles au THC dans les 12 à 24 heures précédant votre rendez-vous.",
    },
    it: {
      tattoo: "Il THC aumenta la frequenza cardiaca di base, dilata i vasi sanguigni (aumentando l'essudato di plasma) e può amplificare molto ansia o paranoia durante la puntura della pelle. Molti professionisti rifiutano un cliente sotto effetto acuto.",
      piercing: "Aumenta il rischio di sincope vasovagale o di panico improvviso durante l'inserimento del gioiello. Altera in modo imprevedibile la percezione del dolore.",
      wait: "Eviti di fumare o di assumere edibili al THC nelle 12-24 ore prima dell'appuntamento.",
    },
    es: {
      tattoo: "El THC eleva la frecuencia cardíaca basal, dilata los vasos sanguíneos (lo que aumenta la exudación de plasma) y puede intensificar mucho la ansiedad o la paranoia durante la punción de la piel. Muchos profesionales rechazan a un cliente bajo efecto agudo.",
      piercing: "Aumenta el riesgo de síncope vasovagal o de pánico repentino durante la inserción de la joya. Altera la percepción del dolor de forma imprevisible.",
      wait: "Evite fumar o consumir comestibles con THC en las 12 a 24 horas previas a su cita.",
    },
    de: {
      tattoo: "THC erhöht die Ruheherzfrequenz, erweitert die Blutgefäße (mehr Plasmaaustritt) und kann Angst oder Paranoia während des Hautstichs deutlich verstärken. Viele Studios lehnen Kunden unter akutem Einfluss ab.",
      piercing: "Erhöht das Risiko einer vasovagalen Synkope oder einer plötzlichen Panikreaktion beim Einsetzen des Schmucks. Verändert das Schmerzempfinden unvorhersehbar.",
      wait: "Verzichten Sie 12 bis 24 Stunden vor dem Termin auf Rauchen und auf THC-haltige Esswaren.",
    },
    nl: {
      tattoo: "THC verhoogt de rusthartslag, verwijdt de bloedvaten (waardoor er meer plasma lekt) en kan angst of paranoia tijdens het doorprikken van de huid sterk versterken. Veel artiesten weigeren klanten die duidelijk onder invloed zijn.",
      piercing: "Verhoogt het risico op een vasovagale syncope of plotselinge paniek bij het inbrengen van het sieraad. Verandert de pijnbeleving op een onvoorspelbare manier.",
      wait: "Rook of eet geen THC-producten in de 12 tot 24 uur voor je afspraak.",
    },
    pt: {
      tattoo: "O THC aumenta a frequência cardíaca de base, dilata os vasos sanguíneos (aumentando o exsudado de plasma) e pode intensificar bastante a ansiedade ou a paranóia durante a punção da pele. Muitos profissionais recusam clientes sob efeito agudo.",
      piercing: "Aumenta o risco de síncope vasovagal ou de pânico repentino durante a inserção da joia. Altera a perceção da dor de forma imprevisível.",
      wait: "Evite fumar ou consumir comestíveis com THC nas 12 a 24 horas anteriores à marcação.",
    },
  },
  nicotine: {
    fr: {
      tattoo: "La nicotine est un puissant vasoconstricteur de la microcirculation. Elle rétrécit les capillaires, réduit l'apport de sang oxygéné vers la plaie fraîche du tatouage et retarde la fermeture du derme.",
      piercing: "Ralentit fortement la formation de la fistule, en particulier pour les piercings buccaux, les cartilages de l'oreille et les tétons.",
      wait: "Évitez de vapoter ou de fumer beaucoup juste avant la séance et pendant la phase initiale de cicatrisation.",
    },
    it: {
      tattoo: "La nicotina è un potente vasocostrittore del microcircolo. Restringe i capillari, riduce l'apporto di sangue ossigenato alla ferita fresca del tatuaggio e rallenta la chiusura del derma.",
      piercing: "Rallenta molto la formazione della fistola, soprattutto per piercing orali, cartilagine dell'orecchio e capezzoli.",
      wait: "Eviti di svapare o fumare molto subito prima della seduta e durante la fase iniziale di guarigione.",
    },
    es: {
      tattoo: "La nicotina es un potente vasoconstrictor de la microcirculación. Estrecha los capilares, reduce el aporte de sangre oxigenada a la herida reciente del tatuaje y retrasa el cierre de la dermis.",
      piercing: "Ralentiza mucho la formación de la fístula, sobre todo en piercings orales, de cartílago de la oreja y de pezón.",
      wait: "Evite vapear o fumar mucho justo antes de la sesión y durante la fase inicial de cicatrización.",
    },
    de: {
      tattoo: "Nikotin ist ein starker Vasokonstriktor der Mikrozirkulation. Es verengt die Kapillaren, verringert die Versorgung der frischen Tätowierwunde mit sauerstoffreichem Blut und verzögert den Verschluss der Lederhaut.",
      piercing: "Verlangsamt die Bildung der Fistel deutlich, besonders bei oralen Piercings, Ohrknorpel und Brustwarzen.",
      wait: "Vermeiden Sie starkes Dampfen oder Rauchen unmittelbar vor der Sitzung und während der ersten Heilungsphase.",
    },
    nl: {
      tattoo: "Nicotine is een sterke vaatvernauwer van de microcirculatie. Het vernauwt de haarvaten, vermindert de aanvoer van zuurstofrijk bloed naar de verse tatoeagewond en vertraagt het sluiten van de lederhuid.",
      piercing: "Vertraagt de vorming van de fistel sterk, vooral bij orale piercings, oorkraakbeen en tepels.",
      wait: "Vermijd veel dampen of roken vlak voor de sessie en tijdens de eerste genezingsfase.",
    },
    pt: {
      tattoo: "A nicotina é um potente vasoconstritor da microcirculação. Estreita os capilares, reduz o fornecimento de sangue oxigenado à ferida recente da tatuagem e atrasa o encerramento da derme.",
      piercing: "Atrasa bastante a formação da fístula, sobretudo em piercings orais, de cartilagem da orelha e do mamilo.",
      wait: "Evite vaporizar ou fumar muito imediatamente antes da sessão e durante a fase inicial de cicatrização.",
    },
  },
  glp1_agonists: {
    fr: {
      tattoo: "Les analogues du GLP-1 ralentissent la vidange gastrique et modifient la régulation de la glycémie. Lors de longues séances de tatouage, le risque d'hypoglycémie soudaine, de nausées et de malaise vagal est élevé si l'apport calorique est insuffisant.",
      piercing: "Risque accru de nausées, d'étourdissements ou de malaise pendant le piercing si la glycémie chute.",
      wait: "Prenez un repas léger et facile à digérer 1 à 2 heures avant la séance et emportez une boisson sucrée (jus, soda) pour maintenir votre glycémie.",
    },
    it: {
      tattoo: "Gli agonisti del GLP-1 rallentano lo svuotamento gastrico e modificano la regolazione della glicemia. Nelle sedute lunghe di tatuaggio c'è rischio di ipoglicemia improvvisa, nausea e svenimento vagale se non si sono assunte calorie sufficienti.",
      piercing: "Maggiore rischio di nausea, capogiri o svenimento durante il piercing se la glicemia cala.",
      wait: "Faccia un pasto leggero e digeribile 1-2 ore prima della seduta e porti con sé una bevanda zuccherata (succo, bibita) per mantenere la glicemia.",
    },
    es: {
      tattoo: "Los agonistas del GLP-1 retrasan el vaciado gástrico y alteran la regulación de la glucemia. En sesiones largas de tatuaje hay riesgo de hipoglucemia repentina, náuseas y desmayo vagal si no se han ingerido suficientes calorías.",
      piercing: "Mayor riesgo de náuseas, mareo o desmayo durante el piercing si baja la glucemia.",
      wait: "Tome una comida ligera y fácil de digerir 1 o 2 horas antes de la sesión y lleve una bebida azucarada (zumo, refresco) para mantener la glucosa.",
    },
    de: {
      tattoo: "GLP-1-Agonisten verzögern die Magenentleerung und verändern die Blutzuckerregulation. Bei langen Tätowiersitzungen besteht das Risiko einer plötzlichen Unterzuckerung, von Übelkeit und vagaler Ohnmacht, wenn zu wenig gegessen wurde.",
      piercing: "Erhöhtes Risiko für Übelkeit, Schwindel oder Ohnmacht während des Piercings, wenn der Blutzucker fällt.",
      wait: "Essen Sie 1 bis 2 Stunden vor der Sitzung eine kleine, leicht verdauliche Mahlzeit und bringen Sie ein gezuckertes Getränk (Saft, Limonade) mit, um den Blutzucker zu halten.",
    },
    nl: {
      tattoo: "GLP-1-agonisten vertragen de maaglediging en veranderen de bloedsuikerregulatie. Bij lange tatoeagesessies bestaat risico op plotselinge hypoglykemie, misselijkheid en vasovagaal flauwvallen als je te weinig hebt gegeten.",
      piercing: "Groter risico op misselijkheid, licht gevoel in het hoofd of flauwvallen tijdens de piercing als de bloedsuiker daalt.",
      wait: "Eet 1 à 2 uur voor de sessie een kleine, licht verteerbare maaltijd en neem een suikerhoudende drank (sap, frisdrank) mee om je bloedsuiker op peil te houden.",
    },
    pt: {
      tattoo: "Os agonistas do GLP-1 atrasam o esvaziamento gástrico e alteram a regulação da glicemia. Em sessões longas de tatuagem há risco de hipoglicemia repentina, náuseas e desmaio vagal se não se ingerirem calorias suficientes.",
      piercing: "Maior risco de náuseas, tonturas ou desmaio durante o piercing se a glicemia descer.",
      wait: "Faça uma refeição ligeira e de fácil digestão 1 a 2 horas antes da sessão e leve uma bebida açucarada (sumo, refrigerante) para manter a glicemia.",
    },
  },
  insulin: {
    fr: {
      tattoo: "Le diabète altère la microcirculation et la cicatrisation. Une réponse immunitaire plus faible augmente le risque d'infection et retarde la disparition des croûtes. Un diabète bien équilibré présente peu de risque ; un diabète mal équilibré augmente le risque d'infection.",
      piercing: "Risque d'infection plus élevé et formation de la fistule plus lente en cas de diabète mal équilibré. Les piercings des membres inférieurs (chevilles, par exemple) cicatrisent très lentement chez les personnes diabétiques.",
      wait: "Assurez-vous que votre glycémie est stable avant la séance. Emportez des comprimés de glucose ou une collation.",
    },
    it: {
      tattoo: "Il diabete compromette il microcircolo e la guarigione delle ferite. Una risposta immunitaria più debole aumenta il rischio di infezione e ritarda la caduta delle croste. Un diabete ben controllato comporta un rischio basso; se mal controllato aumenta il rischio di infezione.",
      piercing: "Rischio di infezione più alto e formazione della fistola più lenta se il diabete è mal controllato. I piercing degli arti inferiori (per esempio alle caviglie) guariscono molto lentamente nelle persone diabetiche.",
      wait: "Verifichi che la glicemia sia stabile prima della seduta. Porti con sé compresse di glucosio o uno spuntino.",
    },
    es: {
      tattoo: "La diabetes deteriora la microcirculación y la cicatrización. Una respuesta inmunitaria más débil aumenta el riesgo de infección y retrasa la caída de las costras. Una diabetes bien controlada supone poco riesgo; mal controlada aumenta el riesgo de infección.",
      piercing: "Mayor riesgo de infección y formación más lenta de la fístula si la diabetes está mal controlada. Los piercings de las extremidades inferiores (por ejemplo, los tobillos) cicatrizan muy despacio en personas diabéticas.",
      wait: "Asegúrese de que su glucemia esté estable antes de la sesión. Lleve pastillas de glucosa o un tentempié.",
    },
    de: {
      tattoo: "Diabetes beeinträchtigt die Mikrozirkulation und die Wundheilung. Eine schwächere Immunantwort erhöht das Infektionsrisiko und verzögert das Abheilen der Krusten. Gut eingestellter Diabetes ist risikoarm; schlecht eingestellter erhöht das Infektionsrisiko.",
      piercing: "Höheres Infektionsrisiko und langsamere Fistelbildung bei schlecht eingestelltem Diabetes. Piercings an den unteren Extremitäten (etwa an den Knöcheln) heilen bei Diabetikern sehr langsam.",
      wait: "Achten Sie darauf, dass Ihr Blutzucker vor der Sitzung stabil ist. Bringen Sie Traubenzucker oder einen Snack mit.",
    },
    nl: {
      tattoo: "Diabetes verstoort de microcirculatie en de wondgenezing. Een zwakkere afweer verhoogt het infectierisico en vertraagt het loslaten van de korstjes. Goed ingestelde diabetes geeft weinig risico; slecht ingestelde diabetes verhoogt het infectierisico.",
      piercing: "Hoger infectierisico en tragere vorming van de fistel bij slecht ingestelde diabetes. Piercings aan de onderste ledematen (bijvoorbeeld enkels) genezen bij mensen met diabetes erg langzaam.",
      wait: "Zorg dat je bloedsuiker stabiel is voor de sessie. Neem druivensuiker of een tussendoortje mee.",
    },
    pt: {
      tattoo: "A diabetes prejudica a microcirculação e a cicatrização. Uma resposta imunitária mais fraca aumenta o risco de infeção e atrasa a queda das crostas. Uma diabetes bem controlada tem risco baixo; mal controlada aumenta o risco de infeção.",
      piercing: "Maior risco de infeção e formação mais lenta da fístula se a diabetes estiver mal controlada. Os piercings dos membros inferiores (por exemplo, nos tornozelos) cicatrizam muito lentamente em pessoas diabéticas.",
      wait: "Certifique-se de que a glicemia está estável antes da sessão. Leve pastilhas de glicose ou um lanche.",
    },
  },
  prednisone: {
    fr: {
      tattoo: "Les corticoïdes par voie générale suppriment la réponse immunitaire nécessaire à une bonne cicatrisation. Risque d'infection plus élevé et phase inflammatoire modifiée. La peau devient fragile en traitement prolongé.",
      piercing: "L'immunosuppression augmente nettement le risque d'infection pendant la cicatrisation du piercing. La formation de la fistule est retardée.",
      wait: "Cures courtes (moins de 2 semaines) : attendez la fin de la cure. Corticothérapie au long cours : demandez l'accord de votre médecin traitant.",
    },
    it: {
      tattoo: "I corticosteroidi per via sistemica sopprimono la risposta immunitaria necessaria a una corretta guarigione. Rischio di infezione più alto e fase infiammatoria alterata. Nelle terapie croniche la pelle diventa fragile.",
      piercing: "L'immunosoppressione aumenta molto il rischio di infezione durante la guarigione del piercing. La formazione della fistola è ritardata.",
      wait: "Cicli brevi (meno di 2 settimane): attenda la fine del ciclo. Terapia steroidea a lungo termine: chieda l'autorizzazione al medico curante.",
    },
    es: {
      tattoo: "Los corticoides sistémicos suprimen la respuesta inmunitaria necesaria para una buena cicatrización. Mayor riesgo de infección y fase inflamatoria alterada. La piel se vuelve frágil con dosis crónicas.",
      piercing: "La inmunosupresión aumenta notablemente el riesgo de infección durante la cicatrización del piercing. La formación de la fístula se retrasa.",
      wait: "Ciclos cortos (menos de 2 semanas): espere a que termine el ciclo. Corticoterapia prolongada: obtenga la autorización de su médico.",
    },
    de: {
      tattoo: "Systemische Kortikosteroide unterdrücken die für eine ordentliche Wundheilung nötige Immunantwort. Höheres Infektionsrisiko und veränderte Entzündungsphase. Bei Dauertherapie wird die Haut brüchig.",
      piercing: "Die Immunsuppression erhöht das Infektionsrisiko während der Piercingheilung deutlich. Die Fistelbildung ist verzögert.",
      wait: "Kurze Behandlungen (unter 2 Wochen): warten Sie das Ende der Kur ab. Langfristige Steroidtherapie: holen Sie die Freigabe Ihres behandelnden Arztes ein.",
    },
    nl: {
      tattoo: "Systemische corticosteroïden onderdrukken de afweerreactie die nodig is voor goede wondgenezing. Hoger infectierisico en een veranderde ontstekingsfase. Bij langdurig gebruik wordt de huid kwetsbaar.",
      piercing: "De onderdrukte afweer verhoogt het infectierisico tijdens het genezen van de piercing aanzienlijk. De vorming van de fistel verloopt trager.",
      wait: "Korte kuren (minder dan 2 weken): wacht tot de kuur klaar is. Langdurige corticotherapie: vraag toestemming aan je behandelend arts.",
    },
    pt: {
      tattoo: "Os corticoides sistémicos suprimem a resposta imunitária necessária a uma boa cicatrização. Maior risco de infeção e fase inflamatória alterada. Em doses crónicas a pele fica frágil.",
      piercing: "A imunossupressão aumenta bastante o risco de infeção durante a cicatrização do piercing. A formação da fístula fica atrasada.",
      wait: "Ciclos curtos (menos de 2 semanas): aguarde o fim do ciclo. Corticoterapia prolongada: obtenha autorização do seu médico assistente.",
    },
  },
  inhaled_steroids: {
    fr: {
      tattoo: "Les corticoïdes inhalés ont un impact général minime. Les corticoïdes locaux appliqués sur la zone du tatouage amincissent la peau et doivent être arrêtés 2 semaines avant.",
      piercing: "Risque standard, sauf si un corticoïde local est appliqué directement sur la zone du piercing.",
      wait: "Arrêtez les corticoïdes locaux sur la zone concernée 2 semaines avant la procédure.",
    },
    it: {
      tattoo: "I corticosteroidi inalatori hanno un impatto sistemico minimo. I corticosteroidi topici applicati sull'area del tatuaggio assottigliano la pelle e vanno sospesi 2 settimane prima.",
      piercing: "Rischio standard, a meno che un corticosteroide topico non sia applicato direttamente sull'area del piercing.",
      wait: "Sospenda i corticosteroidi topici sull'area interessata 2 settimane prima della procedura.",
    },
    es: {
      tattoo: "Los corticoides inhalados tienen un impacto sistémico mínimo. Los corticoides tópicos aplicados en la zona del tatuaje adelgazan la piel y deben suspenderse 2 semanas antes.",
      piercing: "Riesgo estándar, salvo que se aplique un corticoide tópico directamente en la zona del piercing.",
      wait: "Suspenda los corticoides tópicos en la zona prevista 2 semanas antes del procedimiento.",
    },
    de: {
      tattoo: "Inhalative Kortikosteroide haben kaum systemische Wirkung. Örtlich auf die Tätowierstelle aufgetragene Kortikosteroide machen die Haut dünner und sollten 2 Wochen vorher abgesetzt werden.",
      piercing: "Normales Risiko, sofern kein topisches Kortikosteroid direkt auf die Piercingstelle aufgetragen wird.",
      wait: "Setzen Sie topische Kortikosteroide an der betreffenden Stelle 2 Wochen vor dem Eingriff ab.",
    },
    nl: {
      tattoo: "Inhalatiecorticosteroïden hebben nauwelijks effect op het hele lichaam. Lokale corticosteroïden op de tatoeageplek maken de huid dunner en moeten 2 weken van tevoren worden gestopt.",
      piercing: "Normaal risico, tenzij er een lokale corticosteroïde direct op de piercingplek wordt aangebracht.",
      wait: "Stop lokale corticosteroïden op de betreffende plek 2 weken voor de behandeling.",
    },
    pt: {
      tattoo: "Os corticoides inalados têm impacto sistémico mínimo. Os corticoides tópicos aplicados na zona da tatuagem adelgaçam a pele e devem ser suspensos 2 semanas antes.",
      piercing: "Risco normal, salvo se for aplicado um corticoide tópico diretamente na zona do piercing.",
      wait: "Suspenda os corticoides tópicos na zona prevista 2 semanas antes do procedimento.",
    },
  },
  fish_oil: {
    fr: {
      tattoo: "À doses élevées (plus de 2000 mg par jour), il inhibe légèrement l'agrégation plaquettaire et fluidifie le sang. Il provoque souvent un suintement de plasma plus important pendant le tatouage.",
      piercing: "Saignement et bleus initiaux légèrement augmentés.",
      wait: "Envisagez d'interrompre les fortes doses d'huile de poisson 5 à 7 jours avant la séance, avec l'accord de votre médecin.",
    },
    it: {
      tattoo: "A dosi elevate (oltre 2000 mg al giorno) inibisce lievemente l'aggregazione piastrinica e fluidifica il sangue. Spesso provoca un maggiore trasudato di plasma durante il tatuaggio.",
      piercing: "Sanguinamento e lividi iniziali lievemente aumentati.",
      wait: "Valuti di sospendere le dosi elevate di olio di pesce 5-7 giorni prima della seduta, con l'accordo del medico.",
    },
    es: {
      tattoo: "A dosis altas (más de 2000 mg al día) inhibe levemente la agregación plaquetaria y fluidifica la sangre. A menudo provoca mayor exudación de plasma durante el tatuaje.",
      piercing: "Sangrado y hematomas iniciales levemente aumentados.",
      wait: "Valore suspender las dosis altas de aceite de pescado 5 a 7 días antes de la sesión, con la aprobación de su médico.",
    },
    de: {
      tattoo: "In hohen Dosen (mehr als 2000 mg täglich) hemmt es die Blutplättchenverklumpung leicht und verdünnt das Blut. Häufig tritt beim Tätowieren mehr Wundwasser aus.",
      piercing: "Leicht verstärkte Blutung und anfängliche Blutergüsse.",
      wait: "Erwägen Sie, hoch dosiertes Fischöl 5 bis 7 Tage vor der Sitzung zu pausieren, sofern Ihr Arzt zustimmt.",
    },
    nl: {
      tattoo: "In hoge doses (meer dan 2000 mg per dag) remt het de bloedplaatjesklontering licht en verdunt het het bloed. Vaak lekt er tijdens het tatoeëren meer wondvocht.",
      piercing: "Licht verhoogde bloeding en beginnende blauwe plekken.",
      wait: "Overweeg hooggedoseerde visolie 5 tot 7 dagen voor de sessie te pauzeren, als je arts akkoord gaat.",
    },
    pt: {
      tattoo: "Em doses elevadas (mais de 2000 mg por dia) inibe ligeiramente a agregação plaquetária e fluidifica o sangue. Provoca muitas vezes maior exsudação de plasma durante a tatuagem.",
      piercing: "Hemorragia e hematomas iniciais ligeiramente aumentados.",
      wait: "Pondere suspender as doses elevadas de óleo de peixe 5 a 7 dias antes da sessão, com a aprovação do seu médico.",
    },
  },
  vitamin_e: {
    fr: {
      tattoo: "La vitamine E s'oppose aux facteurs de coagulation dépendants de la vitamine K. À doses élevées, elle augmente les saignements et les bleus pendant le tatouage.",
      piercing: "Bleus plus marqués au niveau du piercing.",
      wait: "Interrompez les compléments de vitamine E à forte dose 7 jours avant la procédure.",
    },
    it: {
      tattoo: "La vitamina E si oppone ai fattori della coagulazione dipendenti dalla vitamina K. A dosi elevate aumenta sanguinamento e lividi durante il tatuaggio.",
      piercing: "Lividi più marcati in corrispondenza del piercing.",
      wait: "Sospenda gli integratori di vitamina E ad alto dosaggio 7 giorni prima della procedura.",
    },
    es: {
      tattoo: "La vitamina E antagoniza los factores de coagulación dependientes de la vitamina K. A dosis altas aumenta el sangrado y los hematomas durante el tatuaje.",
      piercing: "Hematomas más marcados en la zona del piercing.",
      wait: "Suspenda los suplementos de vitamina E a dosis altas 7 días antes del procedimiento.",
    },
    de: {
      tattoo: "Vitamin E wirkt den Vitamin-K-abhängigen Gerinnungsfaktoren entgegen. In hohen Dosen verstärkt es Blutung und Blutergüsse beim Tätowieren.",
      piercing: "Stärkere Blutergüsse an der Piercingstelle.",
      wait: "Setzen Sie hoch dosierte Vitamin-E-Präparate 7 Tage vor dem Eingriff ab.",
    },
    nl: {
      tattoo: "Vitamine E werkt de vitamine K-afhankelijke stollingsfactoren tegen. In hoge doses verhoogt het bloeding en blauwe plekken tijdens het tatoeëren.",
      piercing: "Meer blauwe plekken op de piercingplek.",
      wait: "Stop hooggedoseerde vitamine E-supplementen 7 dagen voor de behandeling.",
    },
    pt: {
      tattoo: "A vitamina E antagoniza os fatores de coagulação dependentes da vitamina K. Em doses elevadas aumenta a hemorragia e os hematomas durante a tatuagem.",
      piercing: "Hematomas mais marcados na zona do piercing.",
      wait: "Suspenda os suplementos de vitamina E em dose elevada 7 dias antes do procedimento.",
    },
  },
  ginkgo_stjohns: {
    fr: {
      tattoo: "Le ginkgo biloba inhibe le PAF (facteur d'activation plaquettaire) et provoque des saignements excessifs pendant la procédure. Le millepertuis induit les enzymes hépatiques et augmente la photosensibilité.",
      piercing: "Risque de saignement accru avec le ginkgo ; photosensibilité avec le millepertuis.",
      wait: "Interrompez ces compléments à base de plantes 7 à 10 jours avant la procédure.",
    },
    it: {
      tattoo: "Il ginkgo biloba inibisce il PAF (fattore di attivazione piastrinica) e provoca sanguinamento eccessivo durante la procedura. L'iperico induce gli enzimi epatici e aumenta la fotosensibilità.",
      piercing: "Maggiore rischio di sanguinamento con il ginkgo; fotosensibilità con l'iperico.",
      wait: "Sospenda questi integratori a base di erbe 7-10 giorni prima della procedura.",
    },
    es: {
      tattoo: "El ginkgo biloba inhibe el PAF (factor activador de plaquetas) y provoca un sangrado excesivo durante el procedimiento. El hipérico induce las enzimas hepáticas y aumenta la fotosensibilidad.",
      piercing: "Mayor riesgo de sangrado con el ginkgo; fotosensibilidad con el hipérico.",
      wait: "Suspenda estos suplementos a base de plantas 7 a 10 días antes del procedimiento.",
    },
    de: {
      tattoo: "Ginkgo biloba hemmt den PAF (plättchenaktivierender Faktor) und verursacht übermäßige Blutung während des Eingriffs. Johanniskraut induziert Leberenzyme und erhöht die Lichtempfindlichkeit.",
      piercing: "Erhöhtes Blutungsrisiko durch Ginkgo; Lichtempfindlichkeit durch Johanniskraut.",
      wait: "Setzen Sie diese pflanzlichen Präparate 7 bis 10 Tage vor dem Eingriff ab.",
    },
    nl: {
      tattoo: "Ginkgo biloba remt de PAF (bloedplaatjes-activerende factor) en veroorzaakt overmatige bloeding tijdens de behandeling. Sint-janskruid stimuleert leverenzymen en verhoogt de lichtgevoeligheid.",
      piercing: "Verhoogd bloedingsrisico door ginkgo; lichtgevoeligheid door sint-janskruid.",
      wait: "Stop deze kruidensupplementen 7 tot 10 dagen voor de behandeling.",
    },
    pt: {
      tattoo: "O ginkgo biloba inibe o PAF (fator de ativação plaquetária) e provoca hemorragia excessiva durante o procedimento. O hipericão induz as enzimas hepáticas e aumenta a fotossensibilidade.",
      piercing: "Maior risco de hemorragia com o ginkgo; fotossensibilidade com o hipericão.",
      wait: "Suspenda estes suplementos à base de plantas 7 a 10 dias antes do procedimento.",
    },
  },
  turmeric_garlic: {
    fr: {
      tattoo: "La curcumine et les extraits d'ail à forte dose ont un effet antiplaquettaire. Ils peuvent provoquer un saignement et un suintement de plasma nettement plus importants.",
      piercing: "Légère augmentation du saignement pendant la perforation des tissus.",
      wait: "Interrompez les extraits concentrés 5 à 7 jours avant la procédure. L'ail et le curcuma consommés en cuisine sont parfaitement sans danger.",
    },
    it: {
      tattoo: "La curcumina e gli estratti di aglio ad alto dosaggio hanno un effetto antiaggregante. Possono causare un sanguinamento e un trasudato di plasma sensibilmente maggiori.",
      piercing: "Lieve aumento del sanguinamento durante la perforazione dei tessuti.",
      wait: "Sospenda gli estratti concentrati 5-7 giorni prima della procedura. Aglio e curcuma usati in cucina sono del tutto sicuri.",
    },
    es: {
      tattoo: "La curcumina y los extractos de ajo a dosis altas tienen efecto antiagregante. Pueden causar un sangrado y una exudación de plasma notablemente mayores.",
      piercing: "Ligero aumento del sangrado durante la perforación del tejido.",
      wait: "Suspenda los extractos concentrados 5 a 7 días antes del procedimiento. El ajo y la cúrcuma en la cocina son totalmente seguros.",
    },
    de: {
      tattoo: "Hoch dosiertes Curcumin und Knoblauchextrakte wirken hemmend auf die Blutplättchen. Sie können deutlich stärkere Blutung und mehr austretendes Wundwasser verursachen.",
      piercing: "Leicht verstärkte Blutung beim Durchstechen des Gewebes.",
      wait: "Setzen Sie hoch konzentrierte Extrakte 5 bis 7 Tage vor dem Eingriff ab. Knoblauch und Kurkuma als Gewürz sind völlig unbedenklich.",
    },
    nl: {
      tattoo: "Hooggedoseerde curcumine en knoflookextracten remmen de bloedplaatjes. Ze kunnen merkbaar meer bloeding en meer lekkend wondvocht geven.",
      piercing: "Licht verhoogde bloeding tijdens het doorprikken van het weefsel.",
      wait: "Stop geconcentreerde extracten 5 tot 7 dagen voor de behandeling. Knoflook en kurkuma in het eten zijn volledig veilig.",
    },
    pt: {
      tattoo: "A curcumina e os extratos de alho em dose elevada têm efeito antiagregante plaquetário. Podem causar hemorragia e exsudação de plasma bastante maiores.",
      piercing: "Ligeiro aumento da hemorragia durante a perfuração do tecido.",
      wait: "Suspenda os extratos concentrados 5 a 7 dias antes do procedimento. O alho e a curcuma usados na cozinha são totalmente seguros.",
    },
  },
};
