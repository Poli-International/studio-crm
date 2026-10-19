// The built-in aftercare sheets in the CRM's other languages (the English is in server.js). A studio
// edits any of them in Settings, Aftercare sheets; addAftercareTranslations() only fills a language a
// sheet does not have yet, so the studio's own wording is never replaced.
// Translated by Claude, not yet checked by native speakers.
export const AFTERCARE_TRANSLATIONS = {
  tattoo: {
    fr: { title: 'Soins du tatouage : cicatrisation et nettoyage', description: 'Consignes de cicatrisation sur 14 jours pour les tatouages en noir et gris et en couleur.', steps: [
      'Gardez le film ou le pansement de protection 2 à 4 heures après la séance.',
      'Lavez doucement à l\'eau tiède avec un savon antibactérien sans parfum, les mains propres.',
      'Séchez en tamponnant avec un essuie-tout propre : NE frottez PAS et n\'utilisez pas de serviette en tissu.',
      'Appliquez une couche très fine de la crème de soin recommandée 2 à 3 fois par jour pendant les 3 premiers jours.',
      'Ne plongez pas le tatouage dans l\'eau (piscine, jacuzzi, bain, mer) pendant au moins 2 semaines.',
      'Évitez le soleil et les UV. Ne grattez, n\'arrachez et ne décollez jamais les croûtes pendant la cicatrisation.'] },
    it: { title: 'Cura del tatuaggio: guarigione e pulizia', description: 'Istruzioni di guarigione di 14 giorni per tatuaggi in bianco e nero e a colori.', steps: [
      'Lasciate la pellicola o la medicazione protettiva per 2-4 ore dopo la seduta.',
      'Lavate delicatamente con acqua tiepida e sapone antibatterico senza profumo, con le mani pulite.',
      'Asciugate tamponando con carta pulita: NON strofinate e non usate asciugamani di stoffa.',
      'Applicate uno strato sottilissimo della crema per tatuaggi consigliata 2-3 volte al giorno per i primi 3 giorni.',
      'Non immergete il tatuaggio in acqua (piscina, idromassaggio, vasca, mare) per almeno 2 settimane.',
      'Evitate il sole e i raggi UV. Non grattate, non staccate e non tirate mai le croste durante la guarigione.'] },
    de: { title: 'Tattoo-Pflege: Heilung und Reinigung', description: 'Heilungsanleitung für 14 Tage für Schwarz-Grau- und Farbtattoos.', steps: [
      'Lassen Sie die Schutzfolie oder den Verband 2 bis 4 Stunden nach der Sitzung darauf.',
      'Waschen Sie sanft mit lauwarmem Wasser und parfümfreier antibakterieller Seife, mit sauberen Händen.',
      'Tupfen Sie mit einem sauberen Papiertuch trocken: NICHT reiben und kein Stoffhandtuch verwenden.',
      'Tragen Sie in den ersten 3 Tagen 2 bis 3 Mal täglich eine hauchdünne Schicht der empfohlenen Tattoo-Pflegecreme auf.',
      'Tauchen Sie das Tattoo mindestens 2 Wochen nicht in Wasser (Schwimmbad, Whirlpool, Badewanne, Meer).',
      'Meiden Sie Sonne und UV-Strahlung. Kratzen, zupfen oder lösen Sie während der Heilung nie den Schorf.'] },
    es: { title: 'Cuidado del tatuaje: cicatrización y limpieza', description: 'Instrucciones de cicatrización de 14 días para tatuajes en negro y gris y a color.', steps: [
      'Deje el film o el vendaje protector de 2 a 4 horas después de la sesión.',
      'Lave con suavidad con agua tibia y jabón antibacteriano sin perfume, con las manos limpias.',
      'Seque a toques con papel de cocina limpio: NO frote ni use toallas de tela.',
      'Aplique una capa muy fina de la crema para tatuajes recomendada 2 o 3 veces al día durante los 3 primeros días.',
      'No sumerja el tatuaje en agua (piscina, jacuzzi, bañera, mar) durante al menos 2 semanas.',
      'Evite el sol y los rayos UV. No rasque, arranque ni levante nunca las costras durante la cicatrización.'] },
    nl: { title: 'Tattoo-verzorging: genezing en reiniging', description: 'Genezingsinstructies voor 14 dagen voor zwart-grijze en gekleurde tattoos.', steps: [
      'Laat de beschermende folie of het verband 2 tot 4 uur na de sessie zitten.',
      'Was voorzichtig met lauw water en ongeparfumeerde antibacteriële zeep, met schone handen.',
      'Dep droog met schoon keukenpapier: NIET wrijven en geen stoffen handdoek gebruiken.',
      'Breng de eerste 3 dagen 2 tot 3 keer per dag een flinterdunne laag van de aanbevolen tattoocrème aan.',
      'Dompel de tattoo minstens 2 weken niet onder in water (zwembad, bubbelbad, bad, zee).',
      'Vermijd zon en uv-licht. Krab, pulk of trek tijdens de genezing nooit aan korstjes.'] },
    pt: { title: 'Cuidados com a tatuagem: cicatrização e limpeza', description: 'Instruções de cicatrização de 14 dias para tatuagens a preto e cinzento e a cores.', steps: [
      'Mantenha a película ou o penso de proteção 2 a 4 horas depois da sessão.',
      'Lave com cuidado com água morna e sabão antibacteriano sem perfume, com as mãos limpas.',
      'Seque com toques de papel de cozinha limpo: NÃO esfregue nem use toalhas de tecido.',
      'Aplique uma camada muito fina do creme para tatuagens recomendado 2 a 3 vezes por dia nos primeiros 3 dias.',
      'Não mergulhe a tatuagem em água (piscina, jacuzzi, banheira, mar) durante pelo menos 2 semanas.',
      'Evite o sol e os raios UV. Nunca coce, arranque nem levante as crostas durante a cicatrização.'] },
    th: { title: 'การดูแลรอยสัก: การสมานแผลและการทำความสะอาด', description: 'คำแนะนำการสมานแผล 14 วันสำหรับรอยสักขาวดำและรอยสักสี', steps: [
      'ปิดฟิล์มหรือผ้าพันแผลไว้ 2 ถึง 4 ชั่วโมงหลังสัก',
      'ล้างเบา ๆ ด้วยน้ำอุ่นและสบู่ต้านแบคทีเรียที่ไม่มีน้ำหอม โดยล้างมือให้สะอาดก่อน',
      'ซับให้แห้งด้วยกระดาษทิชชูที่สะอาด ห้ามถู และห้ามใช้ผ้าขนหนู',
      'ทาครีมดูแลรอยสักที่แนะนำบาง ๆ วันละ 2-3 ครั้งในช่วง 3 วันแรก',
      'ห้ามแช่รอยสักในน้ำ (สระว่ายน้ำ อ่างน้ำร้อน อ่างอาบน้ำ ทะเล) อย่างน้อย 2 สัปดาห์',
      'หลีกเลี่ยงแสงแดดและรังสียูวี ห้ามแกะ เกา หรือลอกสะเก็ดระหว่างที่แผลกำลังสมาน'] },
  },
  piercing: {
    fr: { title: 'Piercing : routine de lavage au sérum physiologique', description: 'Routine de lavage au sérum physiologique pour piercings du lobe, du cartilage, du nez et du corps.', steps: [
      'Vaporisez le piercing 2 fois par jour avec une solution saline stérile à 0,9 %.',
      'Lavez-vous bien les mains à l\'eau et au savon avant de toucher ou de nettoyer le piercing.',
      'Ne tournez pas, ne faites pas pivoter et ne forcez pas le bijou pendant la cicatrisation.',
      'Évitez de dormir sur un piercing d\'oreille récent : utilisez un coussin de voyage si besoin.',
      'Vérifiez doucement les embouts du bijou (vissés ou à pression), les mains propres, une fois par semaine.'] },
    it: { title: 'Piercing: lavaggio con soluzione salina', description: 'Routine di lavaggio con soluzione salina per piercing al lobo, alla cartilagine, al naso e al corpo.', steps: [
      'Spruzzate il piercing 2 volte al giorno con soluzione salina sterile allo 0,9%.',
      'Lavatevi bene le mani con acqua e sapone prima di toccare o pulire il piercing.',
      'Non girate, non ruotate e non forzate il gioiello durante la guarigione.',
      'Evitate di dormire su un piercing all\'orecchio appena fatto: usate un cuscino da viaggio se serve.',
      'Controllate delicatamente, con le mani pulite, le chiusure del gioiello una volta alla settimana.'] },
    de: { title: 'Piercing: Spülung mit Kochsalzlösung', description: 'Reinigung mit Kochsalzlösung für Ohrläppchen-, Knorpel-, Nasen- und Körperpiercings.', steps: [
      'Sprühen Sie das Piercing 2 Mal täglich mit steriler 0,9 % Kochsalzlösung ein.',
      'Waschen Sie sich gründlich die Hände mit Wasser und Seife, bevor Sie das Piercing berühren oder reinigen.',
      'Drehen, bewegen oder schieben Sie den Schmuck während der Heilung nicht.',
      'Schlafen Sie nicht auf einem frischen Ohrpiercing: nutzen Sie bei Bedarf ein Reise-Nackenkissen.',
      'Prüfen Sie einmal pro Woche mit sauberen Händen vorsichtig die Verschlüsse des Schmucks.'] },
    es: { title: 'Piercing: rutina de lavado con suero salino', description: 'Rutina de lavado con suero salino para piercings en el lóbulo, el cartílago, la nariz y el cuerpo.', steps: [
      'Rocíe el piercing 2 veces al día con solución salina estéril al 0,9 %.',
      'Lávese bien las manos con agua y jabón antes de tocar o limpiar el piercing.',
      'No gire, no rote ni fuerce la joya durante la cicatrización.',
      'Evite dormir sobre un piercing de oreja reciente: use una almohada de viaje si hace falta.',
      'Revise con suavidad, con las manos limpias, los cierres de la joya una vez por semana.'] },
    nl: { title: 'Piercing: spoelen met zoutoplossing', description: 'Spoelroutine met zoutoplossing voor oorlel-, kraakbeen-, neus- en lichaamspiercings.', steps: [
      'Spray de piercing 2 keer per dag met steriele 0,9% zoutoplossing.',
      'Was uw handen goed met water en zeep voordat u de piercing aanraakt of schoonmaakt.',
      'Draai, roteer of forceer het sieraad niet tijdens de genezing.',
      'Slaap niet op een verse oorpiercing: gebruik zo nodig een reiskussen.',
      'Controleer eens per week voorzichtig, met schone handen, de sluitingen van het sieraad.'] },
    pt: { title: 'Piercing: rotina de lavagem com soro fisiológico', description: 'Rotina de lavagem com soro fisiológico para piercings no lóbulo, na cartilagem, no nariz e no corpo.', steps: [
      'Borrife o piercing 2 vezes por dia com solução salina estéril a 0,9%.',
      'Lave bem as mãos com água e sabão antes de tocar ou limpar o piercing.',
      'Não gire, não rode nem force a joia durante a cicatrização.',
      'Evite dormir sobre um piercing de orelha recente: use uma almofada de viagem se for preciso.',
      'Verifique com cuidado, com as mãos limpas, os fechos da joia uma vez por semana.'] },
    th: { title: 'การดูแลรอยเจาะ: ล้างด้วยน้ำเกลือ', description: 'วิธีล้างด้วยน้ำเกลือสำหรับรอยเจาะติ่งหู กระดูกอ่อน จมูก และร่างกาย', steps: [
      'ฉีดน้ำเกลือปลอดเชื้อ 0.9% ที่รอยเจาะวันละ 2 ครั้ง',
      'ล้างมือให้สะอาดด้วยน้ำและสบู่ก่อนจับหรือทำความสะอาดรอยเจาะ',
      'ห้ามบิด หมุน หรือดันจิวเวลรี่ในช่วงที่แผลกำลังสมาน',
      'หลีกเลี่ยงการนอนทับรอยเจาะหูใหม่ ใช้หมอนรองคอแบบเดินทางหากจำเป็น',
      'ตรวจตัวล็อกของจิวเวลรี่เบา ๆ ด้วยมือที่สะอาดสัปดาห์ละครั้ง'] },
  },
  'fine-line': {
    fr: { title: 'Soins des tatouages en trait fin et micro-réalisme', description: 'Guide de soin pour garder des traits fins nets.', steps: [
      'Gardez le film de protection 24 à 48 heures, sauf s\'il s\'y accumule beaucoup de liquide.',
      'Retirez le film sous l\'eau tiède en le tirant doucement à plat, parallèlement à la peau.',
      'Utilisez une lotion très légère sans parfum, avec parcimonie : les traits fins ont besoin de peu de crème.',
      'Évitez les vêtements synthétiques serrés qui frottent sur les traits fins.',
      'Une fois bien cicatrisé, appliquez un écran solaire SPF 50+ pour garder des traits nets.'] },
    it: { title: 'Cura dei tatuaggi a linea sottile e micro-realismo', description: 'Guida di cura per mantenere nitide le linee sottili.', steps: [
      'Lasciate la pellicola protettiva per 24-48 ore, a meno che non si raccolga molto liquido.',
      'Togliete la pellicola sotto l\'acqua tiepida tirandola piano, parallela alla pelle.',
      'Usate poca lozione leggerissima senza profumo: le linee sottili vogliono poca crema.',
      'Evitate abiti sintetici stretti che sfregano sulle linee sottili.',
      'Una volta guarito, applicate una protezione solare SPF 50+ per mantenere le linee nitide.'] },
    de: { title: 'Pflege für Fine-Line- und Mikro-Realismus-Tattoos', description: 'Pflegeanleitung, damit feine Linien scharf bleiben.', steps: [
      'Lassen Sie die Schutzfolie 24 bis 48 Stunden darauf, außer wenn sich viel Flüssigkeit sammelt.',
      'Ziehen Sie die Folie unter lauwarmem Wasser vorsichtig flach, parallel zur Haut, ab.',
      'Verwenden Sie sparsam eine sehr leichte, parfümfreie Lotion: feine Linien brauchen wenig Creme.',
      'Meiden Sie enge synthetische Kleidung, die über die feinen Linien reibt.',
      'Wenn alles verheilt ist, schützen Sie das Tattoo mit Sonnenschutz LSF 50+, damit die Linien scharf bleiben.'] },
    es: { title: 'Cuidado de tatuajes de línea fina y micro-realismo', description: 'Guía de cuidado para mantener nítidas las líneas finas.', steps: [
      'Deje el film protector de 24 a 48 horas, salvo que se acumule mucho líquido.',
      'Retire el film bajo agua tibia tirando con suavidad, paralelo a la piel.',
      'Use poca loción muy ligera sin perfume: las líneas finas necesitan poca crema.',
      'Evite la ropa sintética ajustada que roce las líneas finas.',
      'Cuando esté curado, aplique protector solar SPF 50+ para mantener las líneas nítidas.'] },
    nl: { title: 'Verzorging van fine-line- en micro-realisme-tattoos', description: 'Verzorgingsgids om fijne lijnen scherp te houden.', steps: [
      'Laat de beschermfolie 24 tot 48 uur zitten, tenzij er veel vocht onder komt.',
      'Verwijder de folie onder lauw water door hem voorzichtig vlak, evenwijdig aan de huid, weg te trekken.',
      'Gebruik spaarzaam een zeer lichte, ongeparfumeerde lotion: fijne lijnen hebben weinig crème nodig.',
      'Vermijd strakke synthetische kleding die over de fijne lijnen schuurt.',
      'Gebruik na volledige genezing zonnebrand SPF 50+ om de lijnen scherp te houden.'] },
    pt: { title: 'Cuidados com tatuagens de traço fino e micro-realismo', description: 'Guia de cuidados para manter nítidos os traços finos.', steps: [
      'Mantenha a película protetora 24 a 48 horas, salvo se acumular muito líquido.',
      'Retire a película debaixo de água morna, puxando com cuidado, paralela à pele.',
      'Use pouca loção muito leve sem perfume: os traços finos precisam de pouco creme.',
      'Evite roupa sintética apertada que roce nos traços finos.',
      'Depois de cicatrizar, aplique protetor solar FPS 50+ para manter os traços nítidos.'] },
    th: { title: 'การดูแลรอยสักลายเส้นบางและไมโครเรียลลิสม์', description: 'คู่มือการดูแลเพื่อให้ลายเส้นบางคมชัด', steps: [
      'ปิดฟิล์มป้องกันไว้ 24 ถึง 48 ชั่วโมง เว้นแต่มีน้ำเหลืองสะสมมาก',
      'ลอกฟิล์มออกใต้น้ำอุ่น โดยค่อย ๆ ดึงขนานกับผิว',
      'ใช้โลชั่นบางเบาไม่มีน้ำหอมเพียงเล็กน้อย ลายเส้นบางไม่ต้องการครีมมาก',
      'หลีกเลี่ยงเสื้อผ้าใยสังเคราะห์ที่รัดแน่นและเสียดสีลายเส้น',
      'เมื่อแผลหายสนิทแล้ว ทาครีมกันแดด SPF 50+ เพื่อรักษาลายเส้นให้คมชัด'] },
  },
  pmu: {
    fr: { title: 'Soins après maquillage permanent : sourcils poudrés et lèvres', description: 'Consignes pour bien garder le pigment après microblading, sourcils poudrés et lip blush.', steps: [
      'Épongez doucement l\'excès de liquide avec un mouchoir propre et stérile toutes les heures pendant les 6 premières heures.',
      'Gardez la zone au sec (eau, transpiration, vapeur) pendant 7 jours.',
      'Appliquez 2 fois par jour une quantité grande comme un grain de riz du baume fourni, avec un coton-tige propre.',
      'Pas de maquillage, de sérum ni d\'exfoliant AHA/BHA près de la zone pendant 10 jours.',
      'Une légère desquamation et un éclaircissement la première semaine sont normaux : la couleur revient entre la 2e et la 4e semaine.'] },
    it: { title: 'Cura dopo il trucco permanente: sopracciglia e labbra', description: 'Indicazioni per mantenere il pigmento dopo microblading, sopracciglia polverose e lip blush.', steps: [
      'Tamponate delicatamente il liquido in eccesso con un fazzoletto pulito e sterile ogni ora per le prime 6 ore.',
      'Tenete la zona asciutta (acqua, sudore, vapore) per 7 giorni.',
      'Applicate 2 volte al giorno una quantità grande come un chicco di riso del balsamo fornito, con un cotton fioc pulito.',
      'Niente trucco, sieri o esfolianti AHA/BHA vicino alla zona per 10 giorni.',
      'Una leggera desquamazione e uno schiarimento nella prima settimana sono normali: il colore torna tra la 2ª e la 4ª settimana.'] },
    de: { title: 'Pflege nach Permanent Make-up: Powder Brows und Lippen', description: 'Hinweise für gute Pigmenthaltung nach Microblading, Powder Brows und Lip Blush.', steps: [
      'Tupfen Sie in den ersten 6 Stunden stündlich überschüssige Flüssigkeit vorsichtig mit einem sauberen, sterilen Tuch ab.',
      'Halten Sie den Bereich 7 Tage trocken (Wasser, Schweiß, Dampf).',
      'Tragen Sie 2 Mal täglich eine reiskorngroße Menge des mitgegebenen Balsams mit einem sauberen Wattestäbchen auf.',
      'Kein Make-up, keine Seren und keine AHA/BHA-Peelings in der Nähe des Bereichs für 10 Tage.',
      'Leichtes Schuppen und Verblassen in der ersten Woche ist normal: die Farbe kommt in Woche 2 bis 4 zurück.'] },
    es: { title: 'Cuidados tras la micropigmentación: cejas y labios', description: 'Pautas para conservar el pigmento tras microblading, cejas empolvadas y lip blush.', steps: [
      'Seque a toques el exceso de líquido con un pañuelo limpio y estéril cada hora durante las primeras 6 horas.',
      'Mantenga la zona seca (agua, sudor, vapor) durante 7 días.',
      'Aplique 2 veces al día una cantidad del tamaño de un grano de arroz del bálsamo entregado, con un bastoncillo limpio.',
      'Nada de maquillaje, sérums ni exfoliantes AHA/BHA cerca de la zona durante 10 días.',
      'Una ligera descamación y aclarado en la primera semana es normal: el color vuelve entre la 2.ª y la 4.ª semana.'] },
    nl: { title: 'Nazorg na permanente make-up: powder brows en lippen', description: 'Richtlijnen voor goed pigmentbehoud na microblading, powder brows en lip blush.', steps: [
      'Dep de eerste 6 uur elk uur voorzichtig overtollig vocht weg met een schoon, steriel doekje.',
      'Houd het gebied 7 dagen droog (water, zweet, stoom).',
      'Breng 2 keer per dag een rijstkorrelgrote hoeveelheid van de meegegeven balsem aan met een schoon wattenstaafje.',
      'Geen make-up, serums of AHA/BHA-peelings bij het gebied gedurende 10 dagen.',
      'Licht vervellen en verbleken in de eerste week is normaal: de kleur komt terug in week 2 tot 4.'] },
    pt: { title: 'Cuidados após maquilhagem permanente: sobrancelhas e lábios', description: 'Orientações para manter o pigmento após microblading, sobrancelhas em pó e lip blush.', steps: [
      'Seque com toques o excesso de líquido com um lenço limpo e esterilizado de hora a hora nas primeiras 6 horas.',
      'Mantenha a zona seca (água, suor, vapor) durante 7 dias.',
      'Aplique 2 vezes por dia uma quantidade do tamanho de um grão de arroz do bálsamo fornecido, com um cotonete limpo.',
      'Sem maquilhagem, séruns nem esfoliantes AHA/BHA perto da zona durante 10 dias.',
      'Uma ligeira descamação e um clareamento na primeira semana são normais: a cor volta entre a 2.ª e a 4.ª semana.'] },
    th: { title: 'การดูแลหลังสักคิ้วและสักปากแบบถาวร', description: 'แนวทางให้สีติดทนหลังไมโครเบลดดิ้ง คิ้วฝุ่น และสักปาก', steps: [
      'ซับน้ำเหลืองส่วนเกินเบา ๆ ด้วยทิชชูสะอาดปลอดเชื้อทุกชั่วโมงในช่วง 6 ชั่วโมงแรก',
      'อย่าให้บริเวณที่ทำโดนน้ำ เหงื่อ หรือไอน้ำเป็นเวลา 7 วัน',
      'ทาบาล์มที่ให้ไปปริมาณเท่าเม็ดข้าววันละ 2 ครั้ง ด้วยคอตตอนบัดที่สะอาด',
      'งดแต่งหน้า เซรั่ม และสครับ AHA/BHA ใกล้บริเวณที่ทำเป็นเวลา 10 วัน',
      'ผิวลอกและสีจางเล็กน้อยในสัปดาห์แรกเป็นเรื่องปกติ สีจะกลับมาในสัปดาห์ที่ 2 ถึง 4'] },
  },
};

export const AFTERCARE_LANGS = ['en', 'fr', 'it', 'de', 'es', 'nl', 'pt', 'th'];

// Fills each built-in sheet's missing languages; never replaces a language the sheet has.
export function addAftercareTranslations(templates) {
  let changed = 0;
  for (const t of templates) {
    const seed = AFTERCARE_TRANSLATIONS[t.id];
    if (!seed) continue;
    t.translations = t.translations || {};
    for (const [lang, text] of Object.entries(seed)) {
      if (!t.translations[lang]) { t.translations[lang] = JSON.parse(JSON.stringify(text)); changed++; }
    }
  }
  return changed;
}

// A sheet's text in a language: that language's version, or the English one.
export function aftercareText(t, lang) {
  const tr = lang && lang !== 'en' && t.translations && t.translations[lang];
  return {
    title: (tr && tr.title) || t.title,
    description: (tr && tr.description !== undefined ? tr.description : t.description) || '',
    steps: tr && Array.isArray(tr.steps) && tr.steps.length ? tr.steps : t.steps || [],
  };
}
