// "Find X nearby" -> a Google Maps search phrased in the language of WHERE THE
// USER IS, not the language they are reading the site in.
//
// WHY THAT DISTINCTION MATTERS: a French reader standing in Bangkok who
// searches "pharmacie" gets almost nothing. "ร้านขายยา" gets every chemist on
// the street. The button LABEL stays in the reader's language; only the QUERY
// is localised. That is the whole point of this file.
//
// HOW WE KNOW WHERE THEY ARE - and why we do NOT ask for geolocation:
//   - Google Maps already centres a "nearby" search on the device itself, so
//     we never need coordinates for the search to work.
//   - The only thing we need location for is choosing the query language, and
//     the browser timezone gives us that with no permission prompt, no API
//     key, no network call, and no personal data leaving the page.
//   - A permission dialog on a medical page costs trust, and everyone who
//     declines it loses the feature entirely. The timezone always answers.
// Cost: a VPN reports the wrong zone. That is what the override selector in
// the UI is for.
//
// RISK PROFILE, so nobody confuses this with the medication prose: a wrong
// word here produces an empty Maps result, not a medical error. It fails safe.
// The European terms are solid. The non-Latin sets (th, ja, ko, zh, ar, he,
// vi, id) are worth a native check when someone is available, but they are
// ordinary everyday words, not clinical vocabulary.
//
// Thai note, learned the hard way elsewhere in this project: bare "สัก" also
// means teak, so a search for it returns timber yards. Use "ร้านสัก".

const GEO_SEARCH_TERMS = {
  en: { studio: 'tattoo and piercing studio', doctor: 'doctor', hospital: 'hospital', pharmacy: 'pharmacy' },
  fr: { studio: 'salon de tatouage et piercing', doctor: 'médecin généraliste', hospital: 'hôpital', pharmacy: 'pharmacie' },
  it: { studio: 'studio di tatuaggi e piercing', doctor: 'medico di base', hospital: 'ospedale', pharmacy: 'farmacia' },
  es: { studio: 'estudio de tatuajes y piercings', doctor: 'médico de cabecera', hospital: 'hospital', pharmacy: 'farmacia' },
  de: { studio: 'Tattoo- und Piercingstudio', doctor: 'Hausarzt', hospital: 'Krankenhaus', pharmacy: 'Apotheke' },
  nl: { studio: 'tattoo- en piercingstudio', doctor: 'huisarts', hospital: 'ziekenhuis', pharmacy: 'apotheek' },
  pt: { studio: 'estúdio de tatuagem e piercing', doctor: 'médico de família', hospital: 'hospital', pharmacy: 'farmácia' },
  th: { studio: 'ร้านสักและเจาะ', doctor: 'คลินิก', hospital: 'โรงพยาบาล', pharmacy: 'ร้านขายยา' },
  ja: { studio: 'タトゥースタジオ', doctor: '内科クリニック', hospital: '病院', pharmacy: '薬局' },
  ko: { studio: '타투샵', doctor: '의원', hospital: '병원', pharmacy: '약국' },
  zhs: { studio: '纹身店', doctor: '诊所', hospital: '医院', pharmacy: '药店' },
  zht: { studio: '刺青店', doctor: '診所', hospital: '醫院', pharmacy: '藥局' },
  id: { studio: 'studio tato dan tindik', doctor: 'klinik dokter', hospital: 'rumah sakit', pharmacy: 'apotek' },
  ms: { studio: 'kedai tatu', doctor: 'klinik', hospital: 'hospital', pharmacy: 'farmasi' },
  vi: { studio: 'tiệm xăm', doctor: 'phòng khám', hospital: 'bệnh viện', pharmacy: 'nhà thuốc' },
  tr: { studio: 'dövme ve piercing stüdyosu', doctor: 'aile hekimi', hospital: 'hastane', pharmacy: 'eczane' },
  el: { studio: 'στούντιο τατουάζ', doctor: 'ιατρείο', hospital: 'νοσοκομείο', pharmacy: 'φαρμακείο' },
  pl: { studio: 'studio tatuażu i piercingu', doctor: 'przychodnia', hospital: 'szpital', pharmacy: 'apteka' },
  cs: { studio: 'tetovací studio', doctor: 'praktický lékař', hospital: 'nemocnice', pharmacy: 'lékárna' },
  sk: { studio: 'tetovacie štúdio', doctor: 'praktický lekár', hospital: 'nemocnica', pharmacy: 'lekáreň' },
  hu: { studio: 'tetováló szalon', doctor: 'orvosi rendelő', hospital: 'kórház', pharmacy: 'gyógyszertár' },
  ro: { studio: 'salon de tatuaje', doctor: 'cabinet medical', hospital: 'spital', pharmacy: 'farmacie' },
  bg: { studio: 'студио за татуировки', doctor: 'лекарски кабинет', hospital: 'болница', pharmacy: 'аптека' },
  hr: { studio: 'tattoo studio', doctor: 'liječnik', hospital: 'bolnica', pharmacy: 'ljekarna' },
  sr: { studio: 'тату студио', doctor: 'лекар', hospital: 'болница', pharmacy: 'апотека' },
  sl: { studio: 'tattoo studio', doctor: 'zdravnik', hospital: 'bolnišnica', pharmacy: 'lekarna' },
  ru: { studio: 'тату салон', doctor: 'поликлиника', hospital: 'больница', pharmacy: 'аптека' },
  uk: { studio: 'тату салон', doctor: 'поліклініка', hospital: 'лікарня', pharmacy: 'аптека' },
  sv: { studio: 'tatueringsstudio', doctor: 'vårdcentral', hospital: 'sjukhus', pharmacy: 'apotek' },
  no: { studio: 'tatoveringsstudio', doctor: 'legekontor', hospital: 'sykehus', pharmacy: 'apotek' },
  da: { studio: 'tatoveringsstudie', doctor: 'lægehus', hospital: 'hospital', pharmacy: 'apotek' },
  fi: { studio: 'tatuointistudio', doctor: 'lääkäriasema', hospital: 'sairaala', pharmacy: 'apteekki' },
  is: { studio: 'húðflúrsstofa', doctor: 'læknir', hospital: 'sjúkrahús', pharmacy: 'apótek' },
  et: { studio: 'tätoveerimisstuudio', doctor: 'perearst', hospital: 'haigla', pharmacy: 'apteek' },
  lv: { studio: 'tetovējumu salons', doctor: 'ārsts', hospital: 'slimnīca', pharmacy: 'aptieka' },
  lt: { studio: 'tatuiruočių salonas', doctor: 'gydytojas', hospital: 'ligoninė', pharmacy: 'vaistinė' },
  he: { studio: 'מכון קעקועים', doctor: 'רופא משפחה', hospital: 'בית חולים', pharmacy: 'בית מרקחת' },
  ar: { studio: 'استوديو وشم', doctor: 'عيادة طبيب', hospital: 'مستشفى', pharmacy: 'صيدلية' },
};

// Endonyms, so the override selector reads correctly to whoever opens it.
const GEO_SEARCH_LANG_NAMES = {
  en: 'English', fr: 'Français', it: 'Italiano', es: 'Español', de: 'Deutsch',
  nl: 'Nederlands', pt: 'Português', th: 'ไทย', ja: '日本語', ko: '한국어',
  zhs: '简体中文', zht: '繁體中文', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu',
  vi: 'Tiếng Việt', tr: 'Türkçe', el: 'Ελληνικά', pl: 'Polski', cs: 'Čeština',
  sk: 'Slovenčina', hu: 'Magyar', ro: 'Română', bg: 'Български', hr: 'Hrvatski',
  sr: 'Српски', sl: 'Slovenščina', ru: 'Русский', uk: 'Українська',
  sv: 'Svenska', no: 'Norsk', da: 'Dansk', fi: 'Suomi', is: 'Íslenska',
  et: 'Eesti', lv: 'Latviešu', lt: 'Lietuvių', he: 'עברית', ar: 'العربية',
};

// IANA timezone -> query language. Only zones that are NOT English are listed;
// everything else falls through to 'en', which Google Maps handles well
// worldwide. That keeps this table to the entries that actually change a
// result rather than restating the default a few hundred times.
const GEO_SEARCH_ZONES = {
  // Europe
  'Europe/Amsterdam': 'nl', 'Europe/Brussels': 'fr', 'Europe/Luxembourg': 'fr',
  'Europe/Paris': 'fr', 'Europe/Monaco': 'fr', 'Europe/Madrid': 'es',
  'Europe/Andorra': 'es', 'Europe/Lisbon': 'pt', 'Europe/Rome': 'it',
  'Europe/San_Marino': 'it', 'Europe/Vatican': 'it',
  'Europe/Berlin': 'de', 'Europe/Vienna': 'de', 'Europe/Zurich': 'de',
  'Europe/Vaduz': 'de', 'Europe/Busingen': 'de', 'Europe/Copenhagen': 'da',
  'Europe/Oslo': 'no', 'Europe/Stockholm': 'sv', 'Europe/Helsinki': 'fi',
  'Europe/Mariehamn': 'fi', 'Europe/Tallinn': 'et', 'Europe/Riga': 'lv',
  'Europe/Vilnius': 'lt', 'Europe/Warsaw': 'pl', 'Europe/Prague': 'cs',
  'Europe/Bratislava': 'sk', 'Europe/Budapest': 'hu', 'Europe/Bucharest': 'ro',
  'Europe/Chisinau': 'ro', 'Europe/Sofia': 'bg', 'Europe/Athens': 'el',
  'Europe/Nicosia': 'el', 'Europe/Zagreb': 'hr', 'Europe/Sarajevo': 'hr',
  'Europe/Belgrade': 'sr', 'Europe/Podgorica': 'sr', 'Europe/Ljubljana': 'sl',
  'Europe/Istanbul': 'tr', 'Europe/Moscow': 'ru', 'Europe/Kaliningrad': 'ru',
  'Europe/Samara': 'ru', 'Europe/Volgograd': 'ru', 'Europe/Saratov': 'ru',
  'Europe/Astrakhan': 'ru', 'Europe/Ulyanovsk': 'ru', 'Europe/Kirov': 'ru',
  'Europe/Minsk': 'ru', 'Europe/Simferopol': 'ru', 'Europe/Kiev': 'uk',
  'Europe/Kyiv': 'uk', 'Europe/Uzhgorod': 'uk', 'Europe/Zaporozhye': 'uk',
  'Atlantic/Reykjavik': 'is', 'Atlantic/Canary': 'es', 'Atlantic/Madeira': 'pt',
  'Atlantic/Azores': 'pt', 'Atlantic/Faroe': 'da',

  // Americas
  'America/Montreal': 'fr', 'America/Mexico_City': 'es', 'America/Cancun': 'es',
  'America/Monterrey': 'es', 'America/Tijuana': 'es', 'America/Merida': 'es',
  'America/Chihuahua': 'es', 'America/Mazatlan': 'es', 'America/Hermosillo': 'es',
  'America/Matamoros': 'es', 'America/Ojinaga': 'es', 'America/Bahia_Banderas': 'es',
  'America/Guatemala': 'es', 'America/Tegucigalpa': 'es', 'America/Managua': 'es',
  'America/El_Salvador': 'es', 'America/Costa_Rica': 'es', 'America/Panama': 'es',
  'America/Havana': 'es', 'America/Santo_Domingo': 'es', 'America/Puerto_Rico': 'es',
  'America/Bogota': 'es', 'America/Lima': 'es', 'America/La_Paz': 'es',
  'America/Santiago': 'es', 'America/Montevideo': 'es', 'America/Asuncion': 'es',
  'America/Caracas': 'es', 'America/Guayaquil': 'es', 'Pacific/Galapagos': 'es',
  'America/Argentina/Buenos_Aires': 'es', 'America/Argentina/Cordoba': 'es',
  'America/Argentina/Mendoza': 'es', 'America/Argentina/Salta': 'es',
  'America/Argentina/Tucuman': 'es', 'America/Argentina/Ushuaia': 'es',
  'America/Sao_Paulo': 'pt', 'America/Bahia': 'pt', 'America/Fortaleza': 'pt',
  'America/Recife': 'pt', 'America/Manaus': 'pt', 'America/Belem': 'pt',
  'America/Cuiaba': 'pt', 'America/Campo_Grande': 'pt', 'America/Porto_Velho': 'pt',
  'America/Rio_Branco': 'pt', 'America/Boa_Vista': 'pt', 'America/Santarem': 'pt',
  'America/Maceio': 'pt', 'America/Araguaina': 'pt', 'America/Noronha': 'pt',
  'America/Paramaribo': 'nl', 'America/Curacao': 'nl', 'America/Aruba': 'nl',
  'America/Cayenne': 'fr', 'America/Guadeloupe': 'fr', 'America/Martinique': 'fr',
  'America/Port-au-Prince': 'fr', 'America/Miquelon': 'fr',

  // Asia and the Middle East
  'Asia/Bangkok': 'th', 'Asia/Tokyo': 'ja', 'Asia/Seoul': 'ko',
  'Asia/Pyongyang': 'ko', 'Asia/Shanghai': 'zhs', 'Asia/Chongqing': 'zhs',
  'Asia/Urumqi': 'zhs', 'Asia/Harbin': 'zhs', 'Asia/Taipei': 'zht',
  'Asia/Hong_Kong': 'zht', 'Asia/Macau': 'zht', 'Asia/Jakarta': 'id',
  'Asia/Makassar': 'id', 'Asia/Jayapura': 'id', 'Asia/Pontianak': 'id',
  'Asia/Kuala_Lumpur': 'ms', 'Asia/Kuching': 'ms', 'Asia/Ho_Chi_Minh': 'vi',
  'Asia/Saigon': 'vi', 'Asia/Hanoi': 'vi', 'Asia/Jerusalem': 'he',
  'Asia/Tel_Aviv': 'he', 'Asia/Baghdad': 'ar', 'Asia/Dubai': 'ar',
  'Asia/Qatar': 'ar', 'Asia/Riyadh': 'ar', 'Asia/Kuwait': 'ar',
  'Asia/Bahrain': 'ar', 'Asia/Muscat': 'ar', 'Asia/Amman': 'ar',
  'Asia/Beirut': 'ar', 'Asia/Damascus': 'ar', 'Asia/Gaza': 'ar',
  'Asia/Hebron': 'ar', 'Asia/Aden': 'ar', 'Asia/Nicosia': 'el',
  'Asia/Famagusta': 'el', 'Asia/Istanbul': 'tr', 'Asia/Almaty': 'ru',
  'Asia/Tashkent': 'ru', 'Asia/Bishkek': 'ru', 'Asia/Ashgabat': 'ru',
  'Asia/Dushanbe': 'ru', 'Asia/Vladivostok': 'ru', 'Asia/Novosibirsk': 'ru',
  'Asia/Yekaterinburg': 'ru', 'Asia/Krasnoyarsk': 'ru', 'Asia/Irkutsk': 'ru',
  'Asia/Yakutsk': 'ru', 'Asia/Omsk': 'ru', 'Asia/Magadan': 'ru',
  'Asia/Kamchatka': 'ru', 'Asia/Sakhalin': 'ru', 'Asia/Chita': 'ru',
  'Asia/Barnaul': 'ru', 'Asia/Tomsk': 'ru', 'Asia/Novokuznetsk': 'ru',
  'Asia/Anadyr': 'ru',

  // Africa
  'Africa/Cairo': 'ar', 'Africa/Tripoli': 'ar', 'Africa/Khartoum': 'ar',
  'Africa/Nouakchott': 'ar', 'Africa/Casablanca': 'fr', 'Africa/Algiers': 'fr',
  'Africa/Tunis': 'fr', 'Africa/Abidjan': 'fr', 'Africa/Dakar': 'fr',
  'Africa/Bamako': 'fr', 'Africa/Ouagadougou': 'fr', 'Africa/Niamey': 'fr',
  'Africa/Ndjamena': 'fr', 'Africa/Libreville': 'fr', 'Africa/Brazzaville': 'fr',
  'Africa/Kinshasa': 'fr', 'Africa/Lubumbashi': 'fr', 'Africa/Douala': 'fr',
  'Africa/Bangui': 'fr', 'Africa/Djibouti': 'fr', 'Africa/Kigali': 'fr',
  'Africa/Bujumbura': 'fr', 'Africa/Conakry': 'fr', 'Africa/Lome': 'fr',
  'Africa/Porto-Novo': 'fr', 'Indian/Antananarivo': 'fr', 'Indian/Reunion': 'fr',
  'Indian/Mauritius': 'fr', 'Indian/Comoro': 'fr', 'Indian/Mayotte': 'fr',
  'Africa/Maputo': 'pt', 'Africa/Luanda': 'pt', 'Africa/Bissau': 'pt',
  'Africa/Sao_Tome': 'pt', 'Atlantic/Cape_Verde': 'pt', 'Africa/Malabo': 'es',
  'Africa/Ceuta': 'es',

  // Pacific
  'Pacific/Tahiti': 'fr', 'Pacific/Noumea': 'fr', 'Pacific/Marquesas': 'fr',
  'Pacific/Gambier': 'fr', 'Pacific/Wallis': 'fr',
};

/** The language a Maps query should be phrased in, from the device timezone. */
function geoSearchDetectLang() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return GEO_SEARCH_ZONES[tz] || 'en';
  } catch (e) {
    return 'en';
  }
}

/** Google Maps search URL for one term. Sends a search word and nothing else. */
function geoSearchUrl(kind, lang) {
  const set = GEO_SEARCH_TERMS[lang] || GEO_SEARCH_TERMS.en;
  const term = set[kind] || GEO_SEARCH_TERMS.en[kind];
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(term);
}

// ---------------------------------------------------------------------------
// LOCAL EMERGENCY NUMBER
//
// The emergency guide used to print "911 / 112" for everyone. That is wrong in
// Thailand (medical line 1669), the UK (999), Australia (000) and plenty more,
// and this tool is read in seven languages by people who travel.
//
// RISK PROFILE - THE OPPOSITE OF THE MAPS TABLE ABOVE. A wrong Maps query just
// returns nothing. A wrong emergency number costs time in the one situation
// where time is the whole problem. So this fails safe in three ways:
//   1. only well-established numbers are listed, nothing guessed;
//   2. anything unmapped falls back to "112 / 911", which between them reach a
//      dispatcher across Europe, North America and most GSM mobiles;
//   3. the UI always prints the "confirm your own local number" line beside it,
//      because a studio sits in ONE country and should have that number on the
//      wall rather than trusting a timezone guess.
//
// Where a country runs a dedicated ambulance line separate from the police one
// (Norway 113, Switzerland 144, Brazil 192, Russia 103), the MEDICAL number is
// listed: this guide is opened for anaphylaxis and bleeding, not for a crime.
//
// Grouped by number rather than by zone so it can be read and checked at a
// glance; it is inverted into a lookup at load.
const GEO_EMERGENCY_BY_NUMBER = {
  '911': [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Phoenix', 'America/Anchorage', 'America/Adak', 'America/Detroit',
    'America/Boise', 'America/Juneau', 'America/Sitka', 'America/Nome',
    'America/Menominee', 'America/Indiana/Indianapolis', 'America/Kentucky/Louisville',
    'America/North_Dakota/Center', 'America/Toronto', 'America/Montreal',
    'America/Vancouver', 'America/Edmonton', 'America/Winnipeg', 'America/Halifax',
    'America/St_Johns', 'America/Regina', 'America/Whitehorse', 'America/Yellowknife',
    'America/Iqaluit', 'America/Moncton', 'America/Mexico_City', 'America/Cancun',
    'America/Monterrey', 'America/Tijuana', 'America/Merida', 'America/Chihuahua',
    'America/Mazatlan', 'America/Hermosillo', 'America/Matamoros', 'America/Ojinaga',
    'America/Bahia_Banderas', 'America/Panama', 'Asia/Manila', 'America/Puerto_Rico',
  ],
  '112': [
    'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Luxembourg', 'Europe/Paris',
    'Europe/Monaco', 'Europe/Madrid', 'Europe/Andorra', 'Europe/Lisbon',
    'Europe/Rome', 'Europe/San_Marino', 'Europe/Vatican', 'Europe/Malta',
    'Europe/Berlin', 'Europe/Vienna', 'Europe/Vaduz', 'Europe/Busingen',
    'Europe/Copenhagen', 'Europe/Stockholm', 'Europe/Helsinki', 'Europe/Mariehamn',
    'Europe/Tallinn', 'Europe/Riga', 'Europe/Vilnius', 'Europe/Warsaw',
    'Europe/Prague', 'Europe/Bratislava', 'Europe/Budapest', 'Europe/Bucharest',
    'Europe/Chisinau', 'Europe/Sofia', 'Europe/Athens', 'Europe/Nicosia',
    'Europe/Zagreb', 'Europe/Sarajevo', 'Europe/Belgrade', 'Europe/Podgorica',
    'Europe/Ljubljana', 'Europe/Istanbul', 'Europe/Dublin', 'Atlantic/Reykjavik',
    'Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores', 'Europe/Isle_of_Man',
    'Europe/Guernsey', 'Europe/Jersey', 'Asia/Istanbul', 'Asia/Nicosia',
    'Asia/Famagusta', 'Asia/Kolkata', 'Asia/Jakarta', 'Asia/Makassar',
    'Asia/Jayapura', 'Asia/Pontianak', 'Africa/Johannesburg',
  ],
  '999': ['Europe/London', 'Asia/Hong_Kong', 'Asia/Kuala_Lumpur', 'Asia/Kuching'],
  '000': [
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Perth', 'Australia/Adelaide', 'Australia/Hobart',
    'Australia/Darwin', 'Australia/Canberra',
  ],
  '111': ['Pacific/Auckland'],
  '1669': ['Asia/Bangkok'],
  '119': ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Taipei'],
  '120': ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Urumqi', 'Asia/Harbin', 'Asia/Macau'],
  '995': ['Asia/Singapore'],
  '115': ['Asia/Ho_Chi_Minh', 'Asia/Saigon', 'Asia/Hanoi'],
  '192': [
    'America/Sao_Paulo', 'America/Bahia', 'America/Fortaleza', 'America/Recife',
    'America/Manaus', 'America/Belem', 'America/Cuiaba', 'America/Campo_Grande',
    'America/Porto_Velho', 'America/Rio_Branco', 'America/Boa_Vista',
    'America/Santarem', 'America/Maceio', 'America/Araguaina', 'America/Noronha',
  ],
  '107': [
    'America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba',
    'America/Argentina/Mendoza', 'America/Argentina/Salta',
    'America/Argentina/Tucuman', 'America/Argentina/Ushuaia',
  ],
  '131': ['America/Santiago'],
  '113': ['Europe/Oslo'],
  '144': ['Europe/Zurich'],
  '101': ['Asia/Jerusalem', 'Asia/Tel_Aviv'],
  '103': [
    'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd',
    'Europe/Saratov', 'Europe/Astrakhan', 'Europe/Ulyanovsk', 'Europe/Kirov',
    'Europe/Kiev', 'Europe/Kyiv', 'Europe/Minsk', 'Asia/Vladivostok',
    'Asia/Novosibirsk', 'Asia/Yekaterinburg', 'Asia/Krasnoyarsk', 'Asia/Irkutsk',
    'Asia/Yakutsk', 'Asia/Omsk', 'Asia/Magadan', 'Asia/Kamchatka', 'Asia/Sakhalin',
  ],
  '998': ['Asia/Dubai'],
  '997': ['Asia/Riyadh'],
};

const GEO_EMERGENCY_FALLBACK = '112 / 911';

const GEO_EMERGENCY_ZONES = (function () {
  const out = {};
  Object.keys(GEO_EMERGENCY_BY_NUMBER).forEach(function (num) {
    GEO_EMERGENCY_BY_NUMBER[num].forEach(function (zone) { out[zone] = num; });
  });
  return out;
})();

/** Best-guess local emergency number, or the 112/911 fallback. */
function geoEmergencyNumber() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return GEO_EMERGENCY_ZONES[tz] || GEO_EMERGENCY_FALLBACK;
  } catch (e) {
    return GEO_EMERGENCY_FALLBACK;
  }
}

/* Offline self-check: node js/geo-search.js */
if (typeof module !== 'undefined' && require.main === module) {
  const assert = require('assert');
  const KINDS = ['studio', 'doctor', 'hospital', 'pharmacy'];
  Object.keys(GEO_SEARCH_TERMS).forEach((l) => {
    KINDS.forEach((k) => assert(GEO_SEARCH_TERMS[l][k], 'missing ' + l + '.' + k));
    assert(GEO_SEARCH_LANG_NAMES[l], 'missing endonym for ' + l);
  });
  Object.entries(GEO_SEARCH_ZONES).forEach(([z, l]) =>
    assert(GEO_SEARCH_TERMS[l], z + ' points at unknown language ' + l));
  // The Thai teak trap: the studio query must be the shop compound, never bare สัก.
  assert(GEO_SEARCH_TERMS.th.studio !== 'สัก', 'bare Thai สัก also means teak');
  assert(geoSearchUrl('pharmacy', 'th').includes(encodeURIComponent('ร้านขายยา')));
  assert(geoSearchUrl('pharmacy', 'xx') === geoSearchUrl('pharmacy', 'en'), 'unknown lang must fall back');
  // Emergency numbers. A wrong one here is the dangerous failure, so the
  // checks are stricter than for the Maps terms.
  const seen = {};
  Object.entries(GEO_EMERGENCY_BY_NUMBER).forEach(([num, zones]) => {
    assert(/^[0-9]{3,4}$/.test(num), 'implausible emergency number: ' + num);
    zones.forEach((z) => {
      assert(!seen[z], z + ' listed under both ' + seen[z] + ' and ' + num);
      seen[z] = num;
    });
  });
  assert(GEO_EMERGENCY_ZONES['Asia/Bangkok'] === '1669', 'Thailand must be 1669');
  assert(GEO_EMERGENCY_ZONES['Europe/London'] === '999', 'UK must be 999');
  assert(GEO_EMERGENCY_ZONES['Australia/Sydney'] === '000', 'Australia must be 000');
  assert(GEO_EMERGENCY_ZONES['Pacific/Auckland'] === '111', 'NZ must be 111');
  assert(GEO_EMERGENCY_ZONES['Nowhere/Nothing'] === undefined, 'unknown zone must be unmapped');
  console.log('emergency numbers OK:', Object.keys(seen).length, 'zones,',
    Object.keys(GEO_EMERGENCY_BY_NUMBER).length, 'distinct numbers, fallback',
    GEO_EMERGENCY_FALLBACK);
  console.log('geo-search self-check OK:',
    Object.keys(GEO_SEARCH_TERMS).length, 'languages,',
    Object.keys(GEO_SEARCH_ZONES).length, 'mapped zones');
}
