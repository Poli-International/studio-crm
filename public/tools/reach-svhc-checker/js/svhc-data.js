/*
  REACH SVHC Candidate List - Body Art Curated Edition
  Poli International | 2026
  Snapshot date: 27 June 2024 (ECHA Candidate List release)
  Source: ECHA Candidate List (https://echa.europa.eu/candidate-list-table)
  Curated subset of 51 substances, selected from the Candidate List as of 27 June 2024
  (253 entries as of 4 February 2026),
  selected specifically for relevance to body art (tattoo inks, PMU pigments,
  body jewelry alloys, and studio consumables).
  Always verify against the official ECHA Candidate List for legally binding information.
*/

const SVHC_METADATA = {
  listDate: '27 June 2024',
  snapshotIso: '2024-06-27',
  // Verified 2026-09-15 by the site's REACH Monitor: 253 entries since ECHA's 4 February 2026
  // update. The curated subset below was selected from the list as of listDate and has not yet
  // been re-screened for later additions; the stale banner tells readers to check ECHA.
  officialTotal: 253,
  subsetCount: 51,
  sourceUrl: 'https://echa.europa.eu/candidate-list-table'
};

const SVHC_LIST_DATE = SVHC_METADATA.listDate;
const SVHC_TOTAL_OFFICIAL = SVHC_METADATA.officialTotal;
const SVHC_SUBSET_COUNT = SVHC_METADATA.subsetCount;

function isSnapshotStale() {
  const snapTime = new Date(SVHC_METADATA.snapshotIso).getTime();
  const now = Date.now();
  const daysOld = (now - snapTime) / (1000 * 60 * 60 * 24);
  return {
    isStale: daysOld > 180,
    daysOld: Math.floor(daysOld),
    monthsOld: Math.floor(daysOld / 30.44)
  };
}

const SVHC_DATA = [

  // ═══════════════════════════════════════════════════════
  // METALS & INORGANIC COMPOUNDS
  // ═══════════════════════════════════════════════════════
  {
    id: 'nickel',
    name: 'Nickel',
    cas: ['7440-02-0'],
    ec: '231-111-4',
    reason: 'Carcinogenic (Cat. 1A), Mutagenic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'high',
    found_in: ['piercing jewelry (low-grade alloys)', 'tattoo inks (trace)', 'studio tools & needles'],
    also_known_as: ['Ni', 'nickel metal', 'nickel powder'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7440-02-0',
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    cas: ['7440-48-4'],
    ec: '231-158-0',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 2), Reprotoxic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'high',
    found_in: ['cobalt blue / cobalt violet tattoo pigments', 'some black inks'],
    also_known_as: ['Co', 'cobalt metal', 'cobalt powder'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7440-48-4',
  },
  {
    id: 'cobalt_dichloride',
    name: 'Cobalt dichloride',
    cas: ['7646-79-9', '69872-05-5'],
    ec: '231-589-4',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 2), Reprotoxic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['cobalt pigment manufacture', 'humidity indicators'],
    also_known_as: ['cobalt chloride', 'cobalt(II) chloride', 'CoCl2'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7646-79-9',
  },
  {
    id: 'cobalt_sulfate',
    name: 'Cobalt(II) sulphate',
    cas: ['10124-43-3'],
    ec: '233-334-2',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 2), Reprotoxic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['cobalt pigment manufacture', 'electroplating'],
    also_known_as: ['cobalt sulfate', 'cobaltous sulfate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=10124-43-3',
  },
  {
    id: 'cadmium',
    name: 'Cadmium',
    cas: ['7440-43-9'],
    ec: '231-152-8',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'high',
    found_in: ['Pigment Yellow 35 (Cadmium Yellow)', 'orange/red cadmium pigments', 'warm-toned tattoo inks'],
    also_known_as: ['Cd', 'cadmium metal'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7440-43-9',
  },
  {
    id: 'cadmium_sulfide',
    name: 'Cadmium sulphide',
    cas: ['1306-23-6'],
    ec: '215-147-8',
    reason: 'Carcinogenic (Cat. 2), Mutagenic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'high',
    found_in: ['Pigment Yellow 35', 'Pigment Orange 20', 'yellow/orange tattoo inks'],
    also_known_as: ['cadmium yellow', 'CI Pigment Yellow 35', 'CdS'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=1306-23-6',
  },
  {
    id: 'cadmium_chloride',
    name: 'Cadmium chloride',
    cas: ['10108-64-2'],
    ec: '233-296-7',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 1B), Reprotoxic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['cadmium pigment manufacture'],
    also_known_as: ['cadmium(II) chloride', 'CdCl2'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=10108-64-2',
  },
  {
    id: 'lead',
    name: 'Lead',
    cas: ['7439-92-1'],
    ec: '231-100-4',
    reason: 'Reprotoxic (Cat. 1A)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'high',
    found_in: ['lead white pigment', 'older/low-grade ink formulations', 'some lead-based stabilisers'],
    also_known_as: ['Pb', 'lead metal'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7439-92-1',
  },
  {
    id: 'lead_chromate',
    name: 'Lead chromate',
    cas: ['7758-97-6'],
    ec: '231-846-0',
    reason: 'Carcinogenic (Cat. 1A/1B), Reprotoxic (Cat. 1A)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['Pigment Yellow 34 (Chrome Yellow)', 'chrome-yellow tattoo pigments'],
    also_known_as: ['chrome yellow', 'CI Pigment Yellow 34', 'PbCrO4'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7758-97-6',
  },
  {
    id: 'lead_sulfochromate',
    name: 'Lead sulfochromate yellow',
    cas: ['1344-37-2'],
    ec: '215-693-7',
    reason: 'Carcinogenic (Cat. 1A/1B), Reprotoxic (Cat. 1A)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['CI Pigment Yellow 34 variant', 'chrome yellow pigments'],
    also_known_as: ['CI Pigment Yellow 34', 'chrome yellow sulphate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=1344-37-2',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    cas: ['7439-97-6'],
    ec: '231-106-7',
    reason: 'PBT (Persistent, Bioaccumulative, Toxic)',
    reason_short: 'PBT',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['mercuric sulphide (Vermilion - historic red pigment)', 'historically in some red tattoo inks'],
    also_known_as: ['Hg', 'quicksilver', 'mercury metal'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7439-97-6',
  },
  {
    id: 'chromium_trioxide',
    name: 'Chromium trioxide',
    cas: ['1333-82-0'],
    ec: '215-607-8',
    reason: 'Carcinogenic (Cat. 1A), Mutagenic (Cat. 1B)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['chrome green pigments (chrome oxide)', 'some equipment surface treatments'],
    also_known_as: ['chromic acid anhydride', 'chromic trioxide', 'CrO3'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=1333-82-0',
  },
  {
    id: 'potassium_dichromate',
    name: 'Potassium dichromate',
    cas: ['7778-50-9'],
    ec: '231-906-6',
    reason: 'Carcinogenic (Cat. 1A), Mutagenic (Cat. 1B), Reprotoxic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['chrome-based pigment production', 'metal treatment'],
    also_known_as: ['potassium bichromate', 'K2Cr2O7'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7778-50-9',
  },
  {
    id: 'sodium_dichromate',
    name: 'Sodium dichromate',
    cas: ['10588-01-9', '7789-12-0'],
    ec: '234-190-3',
    reason: 'Carcinogenic (Cat. 1A), Mutagenic (Cat. 1B), Reprotoxic (Cat. 2)',
    reason_short: 'CMR',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['chrome pigment production', 'metal surface treatment'],
    also_known_as: ['sodium bichromate', 'Na2Cr2O7'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=10588-01-9',
  },
  {
    id: 'strontium_chromate',
    name: 'Strontium chromate',
    cas: ['7789-06-2'],
    ec: '232-142-6',
    reason: 'Carcinogenic (Cat. 1A)',
    reason_short: 'Carcinogenic',
    category: 'metal',
    body_art_relevance: 'low',
    found_in: ['anticorrosive pigments', 'some primers'],
    also_known_as: ['strontium chromate(VI)', 'SrCrO4'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=7789-06-2',
  },
  {
    id: 'diarsenic_trioxide',
    name: 'Diarsenic trioxide',
    cas: ['1327-53-3'],
    ec: '215-481-4',
    reason: 'Carcinogenic (Cat. 1A)',
    reason_short: 'Carcinogenic',
    category: 'metal',
    body_art_relevance: 'medium',
    found_in: ['arsenical pigments (Paris Green historical)', 'trace contaminant in some raw materials'],
    also_known_as: ['arsenic trioxide', 'arsenic(III) oxide', 'white arsenic', 'As2O3'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=1327-53-3',
  },

  // ═══════════════════════════════════════════════════════
  // POLYCYCLIC AROMATIC HYDROCARBONS (PAHs)
  // Critical for carbon black-based inks (black/dark colours)
  // ═══════════════════════════════════════════════════════
  {
    id: 'anthracene',
    name: 'Anthracene',
    cas: ['120-12-7'],
    ec: '204-371-1',
    reason: 'PBT (Persistent, Bioaccumulative, Toxic)',
    reason_short: 'PBT',
    category: 'pah',
    body_art_relevance: 'high',
    found_in: ['carbon black (black tattoo inks)', 'coal tar-derived dark pigments'],
    also_known_as: ['anthracin', 'paranaphthalene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=120-12-7',
  },
  {
    id: 'bap',
    name: 'Benzo[a]pyrene',
    cas: ['50-32-8'],
    ec: '200-028-5',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 1B)',
    reason_short: 'CMR',
    category: 'pah',
    body_art_relevance: 'high',
    found_in: ['carbon black (Pigment Black 7)', 'black and dark grey tattoo inks'],
    also_known_as: ['benzo(a)pyrene', 'BaP', '3,4-benzopyrene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=50-32-8',
  },
  {
    id: 'bep',
    name: 'Benzo[e]pyrene',
    cas: ['192-97-2'],
    ec: '205-892-7',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'high',
    found_in: ['carbon black impurity', 'dark pigments from coal tar sources'],
    also_known_as: ['benzo(e)pyrene', 'BeP', '4,5-benzopyrene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=192-97-2',
  },
  {
    id: 'baa',
    name: 'Benzo[a]anthracene',
    cas: ['56-55-3'],
    ec: '200-280-6',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'high',
    found_in: ['carbon black impurity', 'coal tar-derived pigments'],
    also_known_as: ['benz[a]anthracene', 'BaA', '1,2-benzanthracene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=56-55-3',
  },
  {
    id: 'chrysene',
    name: 'Chrysene',
    cas: ['218-01-9'],
    ec: '205-923-4',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'medium',
    found_in: ['carbon black impurity', 'coal tar pigments'],
    also_known_as: ['benz[a]phenanthrene', '1,2-benzphenanthrene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=218-01-9',
  },
  {
    id: 'benzo_b_fluoranthene',
    name: 'Benzo[b]fluoranthene',
    cas: ['205-99-2'],
    ec: '205-911-9',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'medium',
    found_in: ['carbon black impurity'],
    also_known_as: ['benz[j]fluoranthene', 'B[b]F', '2,3-benzofluoranthene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=205-99-2',
  },
  {
    id: 'benzo_j_fluoranthene',
    name: 'Benzo[j]fluoranthene',
    cas: ['205-97-0'],
    ec: '205-910-3',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'medium',
    found_in: ['carbon black impurity', 'PAH contaminant in dark inks'],
    also_known_as: ['dibenzo[a,l]fluoranthene', 'B[j]F'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=205-97-0',
  },
  {
    id: 'benzo_k_fluoranthene',
    name: 'Benzo[k]fluoranthene',
    cas: ['207-08-9'],
    ec: '205-916-6',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'medium',
    found_in: ['carbon black impurity'],
    also_known_as: ['11,12-benzofluoranthene', 'B[k]F'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=207-08-9',
  },
  {
    id: 'dibenzo_ah_anthracene',
    name: 'Dibenzo[a,h]anthracene',
    cas: ['53-70-3'],
    ec: '200-179-4',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'medium',
    found_in: ['carbon black impurity', 'coal tar-derived dark pigments'],
    also_known_as: ['DBA', '1,2:5,6-dibenzanthracene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=53-70-3',
  },
  {
    id: 'indeno_pyrene',
    name: 'Indeno[1,2,3-cd]pyrene',
    cas: ['193-39-5'],
    ec: '205-893-2',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'pah',
    body_art_relevance: 'medium',
    found_in: ['carbon black impurity'],
    also_known_as: ['IP', '2,3-phthaloylpyrene', 'o-phenylenepyrene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=193-39-5',
  },

  // ═══════════════════════════════════════════════════════
  // PHTHALATES (Plasticizers)
  // Found in ink packaging, vinyl gloves, aprons, plastic containers
  // ═══════════════════════════════════════════════════════
  {
    id: 'dehp',
    name: 'Bis(2-ethylhexyl) phthalate (DEHP)',
    cas: ['117-81-7'],
    ec: '204-211-0',
    reason: 'Reprotoxic (Cat. 1B), Endocrine Disruptor',
    reason_short: 'CMR + ED',
    category: 'plasticizer',
    body_art_relevance: 'high',
    found_in: ['PVC ink packaging', 'vinyl gloves', 'plastic aprons', 'tattoo ink bottles (PVC caps)'],
    also_known_as: ['dioctyl phthalate', 'DOP', 'di(2-ethylhexyl) phthalate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=117-81-7',
  },
  {
    id: 'dbp',
    name: 'Dibutyl phthalate (DBP)',
    cas: ['84-74-2'],
    ec: '201-557-4',
    reason: 'Reprotoxic (Cat. 1B)',
    reason_short: 'Reprotoxic',
    category: 'plasticizer',
    body_art_relevance: 'high',
    found_in: ['solvent in some ink formulations', 'plasticizer in packaging', 'nail products'],
    also_known_as: ['di-n-butyl phthalate', 'n-butyl phthalate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=84-74-2',
  },
  {
    id: 'bbp',
    name: 'Benzyl butyl phthalate (BBP)',
    cas: ['85-68-7'],
    ec: '201-622-7',
    reason: 'Reprotoxic (Cat. 1B)',
    reason_short: 'Reprotoxic',
    category: 'plasticizer',
    body_art_relevance: 'medium',
    found_in: ['vinyl flooring (studio floors)', 'some plastic packaging', 'fragrances'],
    also_known_as: ['butyl benzyl phthalate', 'benzyl n-butyl phthalate', 'Santicizer 160'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=85-68-7',
  },
  {
    id: 'dibp',
    name: 'Diisobutyl phthalate (DIBP)',
    cas: ['84-69-5'],
    ec: '201-553-2',
    reason: 'Reprotoxic (Cat. 1B)',
    reason_short: 'Reprotoxic',
    category: 'plasticizer',
    body_art_relevance: 'medium',
    found_in: ['plasticizer substitute for DBP', 'sealants', 'inks and coatings'],
    also_known_as: ['di-iso-butyl phthalate', 'diisobutyl benzene-1,2-dicarboxylate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=84-69-5',
  },
  {
    id: 'dipp',
    name: 'Bis(2-methoxyethyl) phthalate (DMEP)',
    cas: ['117-82-8'],
    ec: '204-212-6',
    reason: 'Reprotoxic (Cat. 1B)',
    reason_short: 'Reprotoxic',
    category: 'plasticizer',
    body_art_relevance: 'low',
    found_in: ['plasticizer in some formulations'],
    also_known_as: ['di(methoxyethyl) phthalate', 'dimethylcellosolve phthalate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=117-82-8',
  },

  // ═══════════════════════════════════════════════════════
  // AROMATIC AMINES & AZO DYE PRECURSORS
  // Critical: azo dyes in tattoo inks can release primary aromatic amines
  // which are carcinogenic when reduced by skin enzymes or laser treatment
  // ═══════════════════════════════════════════════════════
  {
    id: 'aminoazobenzene',
    name: '4-aminoazobenzene',
    cas: ['60-09-3'],
    ec: '200-453-6',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'high',
    found_in: ['azo dye intermediate (yellow/orange tattoo inks)', 'Solvent Yellow 1 precursor'],
    also_known_as: ['p-aminoazobenzene', 'aminobenzeneazobenzene', 'aniline yellow'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=60-09-3',
  },
  {
    id: 'aminoazotoluene',
    name: 'o-aminoazotoluene',
    cas: ['97-56-3'],
    ec: '202-591-2',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'high',
    found_in: ['azo dye precursor (orange/brown inks)', 'CI Solvent Yellow 3'],
    also_known_as: ['4-amino-2,3-dimethylazobenzene', 'CI Solvent Yellow 3', 'butter yellow 2'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=97-56-3',
  },
  {
    id: 'benzidine',
    name: 'Benzidine',
    cas: ['92-87-5'],
    ec: '202-199-1',
    reason: 'Carcinogenic (Cat. 1A)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'high',
    found_in: ['azo dye precursor (yellow/orange pigments)', 'released by benzidine-based azo dyes'],
    also_known_as: ['4,4\'-diaminobiphenyl', '[1,1\'-biphenyl]-4,4\'-diamine', 'p-diaminobiphenyl'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=92-87-5',
  },
  {
    id: 'aminobiphenyl',
    name: '4-aminobiphenyl',
    cas: ['92-67-1'],
    ec: '202-177-1',
    reason: 'Carcinogenic (Cat. 1A)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'high',
    found_in: ['azo dye impurity', 'released by certain azo dyes on reduction'],
    also_known_as: ['4-biphenylamine', 'xenylamine', 'p-aminobiphenyl'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=92-67-1',
  },
  {
    id: 'naphthylamine',
    name: '2-naphthylamine',
    cas: ['91-59-8'],
    ec: '202-080-4',
    reason: 'Carcinogenic (Cat. 1A)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'high',
    found_in: ['azo dye precursor', 'released by azo red/orange dyes on reduction'],
    also_known_as: ['beta-naphthylamine', 'beta-naphthylamine', '2-aminonaphthalene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=91-59-8',
  },
  {
    id: 'mda',
    name: '4,4\'-methylenedianiline (MDA)',
    cas: ['101-77-9'],
    ec: '202-974-4',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'medium',
    found_in: ['dye intermediate', 'epoxy hardener systems', 'polyurethane production'],
    also_known_as: ['MDA', '4,4\'-diaminodiphenylmethane', 'methylenedianiline'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=101-77-9',
  },
  {
    id: 'toluenediamine',
    name: '2,4-diaminotoluene (toluene-2,4-diamine)',
    cas: ['95-80-7'],
    ec: '202-453-1',
    reason: 'Carcinogenic (Cat. 1B)',
    reason_short: 'Carcinogenic',
    category: 'amine',
    body_art_relevance: 'high',
    found_in: ['azo dye precursor', 'hair dye component', 'some yellow/brown pigments'],
    also_known_as: ['toluene-2,4-diamine', '4-methyl-m-phenylenediamine', 'TDA'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=95-80-7',
  },

  // ═══════════════════════════════════════════════════════
  // SOLVENTS & CHEMICAL INTERMEDIATES
  // ═══════════════════════════════════════════════════════
  {
    id: 'trichloroethylene',
    name: 'Trichloroethylene',
    cas: ['79-01-6'],
    ec: '201-167-4',
    reason: 'Carcinogenic (Cat. 1A)',
    reason_short: 'Carcinogenic',
    category: 'solvent',
    body_art_relevance: 'medium',
    found_in: ['metal degreasing (used on jewelry/equipment)', 'solvent in some industrial cleaners'],
    also_known_as: ['TCE', 'trichloroethene', '1,1,2-trichloroethylene', 'trilene'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=79-01-6',
  },
  {
    id: 'acrylamide',
    name: 'Acrylamide',
    cas: ['79-06-1'],
    ec: '201-173-7',
    reason: 'Carcinogenic (Cat. 1B), Mutagenic (Cat. 1B)',
    reason_short: 'CMR',
    category: 'solvent',
    body_art_relevance: 'low',
    found_in: ['polyacrylamide gels (residual monomer)', 'grouting agents'],
    also_known_as: ['2-propenamide', 'prop-2-enamide', 'vinyl amide'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=79-06-1',
  },

  // ═══════════════════════════════════════════════════════
  // ENDOCRINE DISRUPTORS (Phenols & Surfactants)
  // Found in cleaning products, skin care, antiseptics
  // ═══════════════════════════════════════════════════════
  {
    id: 'bpa',
    name: 'Bisphenol A (BPA)',
    cas: ['80-05-7'],
    ec: '201-245-8',
    reason: 'Endocrine Disruptor, Reprotoxic (Cat. 1B)',
    reason_short: 'ED + CMR',
    category: 'endocrine',
    body_art_relevance: 'high',
    found_in: ['epoxy-lined containers', 'polycarbonate packaging', 'thermal paper (receipts)', 'some vinyl products'],
    also_known_as: ['2,2-bis(4-hydroxyphenyl)propane', '4,4\'-isopropylidenediphenol', 'BPA'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=80-05-7',
  },
  {
    id: 'tert_butylphenol',
    name: '4-tert-butylphenol',
    cas: ['98-54-4'],
    ec: '202-679-0',
    reason: 'Endocrine Disruptor (equivalent concern)',
    reason_short: 'Endocrine Disruptor',
    category: 'endocrine',
    body_art_relevance: 'medium',
    found_in: ['fragrance ingredient (aftercare products)', 'adhesive additive', 'some disinfectants'],
    also_known_as: ['p-tert-butylphenol', 'PTBP', '4-(1,1-dimethylethyl)phenol'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=98-54-4',
  },
  {
    id: 'nonylphenol',
    name: 'Nonylphenol (branched), ethoxylates',
    cas: ['84852-15-3', '9016-45-9'],
    ec: '284-325-5',
    reason: 'Endocrine Disruptor (equivalent concern)',
    reason_short: 'Endocrine Disruptor',
    category: 'endocrine',
    body_art_relevance: 'medium',
    found_in: ['surfactants in cleaning products', 'some emulsifiers in cosmetic bases', 'ink dispersants'],
    also_known_as: ['NPE', 'nonylphenol ethoxylate', 'NP'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=84852-15-3',
  },
  {
    id: 'octylphenol',
    name: '4-(1,1,3,3-tetramethylbutyl)phenol',
    cas: ['140-66-9'],
    ec: '205-426-2',
    reason: 'Endocrine Disruptor (equivalent concern)',
    reason_short: 'Endocrine Disruptor',
    category: 'endocrine',
    body_art_relevance: 'low',
    found_in: ['surfactant in cleaning products', 'emulsifier'],
    also_known_as: ['4-tert-octylphenol', 'para-tert-octylphenol', 'OPE'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=140-66-9',
  },

  // ═══════════════════════════════════════════════════════
  // HALOGENATED / PERFLUORINATED COMPOUNDS
  // ═══════════════════════════════════════════════════════
  {
    id: 'pfos',
    name: 'Perfluorooctane sulphonate (PFOS)',
    cas: ['1763-23-1'],
    ec: '217-179-8',
    reason: 'PBT, vPvB, Endocrine Disruptor',
    reason_short: 'PBT + vPvB + ED',
    category: 'pfas',
    body_art_relevance: 'medium',
    found_in: ['fire-fighting foams', 'stain-resistant coatings', 'some cleaning products'],
    also_known_as: ['perfluorooctylsulfonate', 'PFOS acid'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=1763-23-1',
  },
  {
    id: 'pfoa',
    name: 'Perfluorooctanoic acid (PFOA)',
    cas: ['335-67-1'],
    ec: '206-397-9',
    reason: 'PBT, Carcinogenic (Cat. 1B)',
    reason_short: 'PBT + Carcinogenic',
    category: 'pfas',
    body_art_relevance: 'medium',
    found_in: ['non-stick coatings (equipment)', 'some water-resistant textiles'],
    also_known_as: ['C8', 'pentadecafluorooctanoic acid', 'perfluorooctanoate'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=335-67-1',
  },
  {
    id: 'sccp',
    name: 'Alkanes, C10–13, chloro (short-chain chlorinated paraffins)',
    cas: ['85535-84-8'],
    ec: '287-476-5',
    reason: 'PBT, vPvB',
    reason_short: 'PBT + vPvB',
    category: 'halogenated',
    body_art_relevance: 'low',
    found_in: ['lubricant additives in metal-working fluids', 'PVC plasticiser'],
    also_known_as: ['SCCP', 'chlorinated paraffins C10-13', 'short-chain paraffins'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=85535-84-8',
  },

  // ═══════════════════════════════════════════════════════
  // BORON / REPROTOXIC COMPOUNDS
  // ═══════════════════════════════════════════════════════
  {
    id: 'boric_acid',
    name: 'Boric acid',
    cas: ['10043-35-3', '11113-50-1'],
    ec: '233-139-2',
    reason: 'Reprotoxic (Cat. 1B)',
    reason_short: 'Reprotoxic',
    category: 'borate',
    body_art_relevance: 'low',
    found_in: ['antiseptic solutions', 'eye washes', 'some preservatives'],
    also_known_as: ['orthoboric acid', 'boracic acid', 'H3BO3'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=10043-35-3',
  },
  {
    id: 'borax',
    name: 'Disodium tetraborate (Borax)',
    cas: ['1303-96-4', '1330-43-4', '12179-04-3'],
    ec: '215-540-4',
    reason: 'Reprotoxic (Cat. 1B)',
    reason_short: 'Reprotoxic',
    category: 'borate',
    body_art_relevance: 'low',
    found_in: ['cleaning products', 'flux in jewellery making'],
    also_known_as: ['sodium borate', 'sodium tetraborate decahydrate', 'borax'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=1303-96-4',
  },

  // ═══════════════════════════════════════════════════════
  // SILICONES (PBT/vPvB)
  // ═══════════════════════════════════════════════════════
  {
    id: 'd4',
    name: 'Octamethylcyclotetrasiloxane (D4)',
    cas: ['556-67-2'],
    ec: '209-136-7',
    reason: 'PBT, vPvB, Endocrine Disruptor',
    reason_short: 'PBT + ED',
    category: 'siloxane',
    body_art_relevance: 'medium',
    found_in: ['silicone-based aftercare products', 'cosmetic silicone ingredients', 'some tattoo aftercare creams'],
    also_known_as: ['cyclic octamethylsiloxane', 'cyclotetrasiloxane', 'D4 silicone'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=556-67-2',
  },
  {
    id: 'd5',
    name: 'Decamethylcyclopentasiloxane (D5)',
    cas: ['541-02-6'],
    ec: '208-764-9',
    reason: 'PBT, vPvB',
    reason_short: 'PBT + vPvB',
    category: 'siloxane',
    body_art_relevance: 'medium',
    found_in: ['silicone aftercare products', 'cosmetic creams and serums', 'skin barrier products'],
    also_known_as: ['cyclic decamethylsiloxane', 'cyclomethicone', 'D5 silicone'],
    echa_url: 'https://echa.europa.eu/search-for-chemicals?p_p_id=dissadvancedsearch_WAR_dissadvancedsearchportlet&_dissadvancedsearch_WAR_dissadvancedsearchportlet_searchString=541-02-6',
  },

];

// ── Search & Matching Engine ──────────────────────────────────────

const CAS_PATTERN = /\b(\d{1,7}-\d{2}-\d)\b/g;

function normalizeName(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/[^a-z0-9\-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractAliasesFromName(name) {
  const aliases = [];
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    aliases.push(parenMatch[1].trim());
    const withoutParen = name.replace(/\([^)]+\)/, '').trim();
    if (withoutParen) aliases.push(withoutParen);
  }
  return aliases;
}

function buildSearchIndex(list) {
  return list.map(s => {
    const rawName = s.name || '';
    const nameNorm = normalizeName(rawName);
    const extraAliases = extractAliasesFromName(rawName);
    const allAliases = [
      ...(s.also_known_as || []),
      ...(s.ci_mappings || []),
      ...extraAliases
    ];
    const aliasesNorm = allAliases.map(a => normalizeName(a)).filter(Boolean);
    const casSet = new Set((s.cas || []).map(c => c.trim()));
    const ec = (s.ec || '').trim().toLowerCase();

    // Significant keywords of length >= 3
    const significantWords = nameNorm
      .split(/\s+/)
      .filter(w => w.length >= 3 && !['and', 'for', 'the', 'with', 'cat'].includes(w));

    return {
      substance: s,
      nameNorm,
      aliasesNorm,
      casSet,
      ec,
      significantWords
    };
  });
}

const SEARCH_INDEX = buildSearchIndex(SVHC_DATA);

/**
 * Searches for a match against the SVHC database.
 * Returns an object with { substance, confidence, matchType, matchedToken } or null.
 * Confidence: 'high' | 'medium'
 */
function findByQuery(query) {
  if (!query || typeof query !== 'string') return null;
  const raw = query.trim();
  const cleanedRaw = raw
    .replace(/\s*(?:[<>≤≥~]?\s*\d+(?:\.\d+)?\s*(?:-\s*\d+(?:\.\d+)?)?\s*(?:%|wt%|w\/w|ppm))\s*$/i, '')
    .trim();
  const qNorm = normalizeName(cleanedRaw || raw);
  if (!qNorm && !raw) return null;

  // 1. Direct CAS match (high confidence)
  const directCas = cleanedRaw.match(/^\d{1,7}-\d{2}-\d$/) || raw.match(/^\d{1,7}-\d{2}-\d$/);
  if (directCas) {
    const found = SVHC_DATA.find(s => s.cas && s.cas.includes(directCas[0]));
    if (found) {
      return {
        substance: found,
        confidence: 'high',
        matchType: 'cas',
        matchedToken: directCas[0]
      };
    }
  }

  // 2. Exact name match (high confidence)
  for (const entry of SEARCH_INDEX) {
    if (entry.nameNorm === qNorm) {
      return {
        substance: entry.substance,
        confidence: 'high',
        matchType: 'exact_name',
        matchedToken: entry.substance.name
      };
    }
  }

  // 3. Exact alias match (high confidence)
  for (const entry of SEARCH_INDEX) {
    for (const alias of entry.aliasesNorm) {
      if (alias === qNorm) {
        return {
          substance: entry.substance,
          confidence: 'high',
          matchType: 'alias',
          matchedToken: alias
        };
      }
    }
  }

  // 4. Word boundary regex match on substance name or significant alias (medium confidence)
  for (const entry of SEARCH_INDEX) {
    if (entry.nameNorm.length >= 3) {
      const boundaryRegex = new RegExp('(?:^|\\b)' + escapeRegex(entry.nameNorm) + '(?:\\b|$)', 'i');
      if (boundaryRegex.test(qNorm)) {
        return {
          substance: entry.substance,
          confidence: 'medium',
          matchType: 'boundary',
          matchedToken: entry.substance.name
        };
      }
    }

    for (const alias of entry.aliasesNorm) {
      if (alias.length >= 3) {
        const aliasRegex = new RegExp('(?:^|\\b)' + escapeRegex(alias) + '(?:\\b|$)', 'i');
        if (aliasRegex.test(qNorm)) {
          return {
            substance: entry.substance,
            confidence: 'medium',
            matchType: 'boundary',
            matchedToken: alias
          };
        }
      }
    }
  }

  // 5. Multi-token keyword overlap (medium confidence)
  for (const entry of SEARCH_INDEX) {
    if (entry.significantWords.length >= 2) {
      const allWordsPresent = entry.significantWords.every(word => {
        const wRegex = new RegExp('(?:^|\\b)' + escapeRegex(word) + '(?:\\b|$)', 'i');
        return wRegex.test(qNorm);
      });
      if (allWordsPresent) {
        return {
          substance: entry.substance,
          confidence: 'medium',
          matchType: 'token_overlap',
          matchedToken: entry.significantWords.join(' ')
        };
      }
    }
  }

  return null;
}

const CONCENTRATION_PATTERN = /(?:[<>≤≥~]?\s*\d+(?:\.\d+)?\s*(?:-\s*\d+(?:\.\d+)?)?\s*(?:%|wt%|w\/w|ppm))/i;

function parseConcentrationToken(text) {
  if (!text) return null;
  const match = text.match(CONCENTRATION_PATTERN);
  if (!match) return null;
  const rawToken = match[0].trim();
  
  // Try to parse numeric value or range
  const numMatches = rawToken.match(/\d+(?:\.\d+)?/g);
  if (!numMatches || numMatches.length === 0) {
    return { token: rawToken, value: null, status: 'ambiguous' };
  }

  // Handle ppm conversion to %
  const isPpm = /ppm/i.test(rawToken);
  let values = numMatches.map(n => parseFloat(n));
  if (isPpm) {
    values = values.map(v => v / 10000); // 10,000 ppm = 1%
  }

  // If range, take maximum concentration in range
  const maxVal = Math.max(...values);
  
  // Check against REACH Art 33 threshold: 0.1% w/w
  let status = 'ambiguous';
  if (rawToken.includes('<') || rawToken.includes('≤')) {
    if (maxVal <= 0.1) status = 'below';
    else status = 'ambiguous';
  } else if (rawToken.includes('>') || rawToken.includes('≥')) {
    if (maxVal >= 0.1) status = 'above';
    else status = 'ambiguous';
  } else {
    status = maxVal > 0.1 ? 'above' : 'below';
  }

  return {
    token: rawToken,
    value: maxVal,
    status
  };
}

function parseIngredientBlock(text) {
  const results = [];
  const seenCas = new Set();
  const seenNames = new Set();

  // Split text by lines first to preserve per-line concentration context
  const rawLines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);

  // 1. Line-by-line inspection
  for (const line of rawLines) {
    const conc = parseConcentrationToken(line);
    const inlineCas = line.match(CAS_PATTERN);

    if (inlineCas) {
      for (const cas of inlineCas) {
        if (seenCas.has(cas)) continue;
        seenCas.add(cas);
        const found = SVHC_DATA.find(s => s.cas && s.cas.includes(cas));
        results.push({
          query: cas,
          type: 'cas',
          substance: found || null,
          confidence: found ? 'high' : null,
          matchType: 'cas',
          matchedToken: cas,
          concentration: conc
        });
      }
    }

    // Try name extraction after cleaning out CAS and concentration
    const cleaned = line
      .replace(CAS_PATTERN, ' ')
      .replace(CONCENTRATION_PATTERN, ' ')
      .replace(/[\(\)\[\]:,;]/g, ' ')
      .trim();

    if (cleaned.length >= 3 && !/^\d+$/.test(cleaned)) {
      const segments = cleaned.split(/\s{2,}|\t+/).map(s => s.trim()).filter(s => s.length >= 3);
      const candidates = segments.length > 0 ? segments : [cleaned];

      for (const cand of candidates) {
        if (/^\d+(\.\d+)?%?$/.test(cand)) continue;
        const normKey = normalizeName(cand);
        if (seenNames.has(normKey)) continue;
        seenNames.add(normKey);

        const match = findByQuery(cand);
        if (match) {
          results.push({
            query: cand,
            type: 'name',
            substance: match.substance,
            confidence: match.confidence,
            matchType: match.matchType,
            matchedToken: match.matchedToken,
            concentration: conc
          });
        }
      }
    }
  }

  // 2. Fallback sweep over comma-delimited tokens if no results from lines
  if (results.length === 0) {
    const tokens = text.split(/[,;]+/).map(t => t.trim()).filter(t => t.length >= 3);
    for (const tok of tokens) {
      const conc = parseConcentrationToken(tok);
      const cleaned = tok.replace(CONCENTRATION_PATTERN, '').trim();
      const casMatches = cleaned.match(CAS_PATTERN);
      if (casMatches) {
        for (const cas of casMatches) {
          if (seenCas.has(cas)) continue;
          seenCas.add(cas);
          const found = SVHC_DATA.find(s => s.cas && s.cas.includes(cas));
          results.push({
            query: cas,
            type: 'cas',
            substance: found || null,
            confidence: found ? 'high' : null,
            matchType: 'cas',
            matchedToken: cas,
            concentration: conc
          });
        }
      } else {
        const normKey = normalizeName(cleaned);
        if (seenNames.has(normKey)) continue;
        seenNames.add(normKey);
        const match = findByQuery(cleaned);
        results.push({
          query: cleaned,
          type: 'name',
          substance: match ? match.substance : null,
          confidence: match ? match.confidence : null,
          matchType: match ? match.matchType : null,
          matchedToken: match ? match.matchedToken : null,
          concentration: conc
        });
      }
    }
  }

  return results;
}

// Environment exports
if (typeof window !== 'undefined') {
  window.SVHC_METADATA = SVHC_METADATA;
  window.SVHC_LIST_DATE = SVHC_LIST_DATE;
  window.SVHC_TOTAL_OFFICIAL = SVHC_TOTAL_OFFICIAL;
  window.SVHC_SUBSET_COUNT = SVHC_SUBSET_COUNT;
  window.SVHC_DATA = SVHC_DATA;
  window.SEARCH_INDEX = SEARCH_INDEX;
  window.CAS_PATTERN = CAS_PATTERN;
  window.CONCENTRATION_PATTERN = CONCENTRATION_PATTERN;
  window.parseConcentrationToken = parseConcentrationToken;
  window.isSnapshotStale = isSnapshotStale;
  window.findByQuery = findByQuery;
  window.parseIngredientBlock = parseIngredientBlock;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SVHC_METADATA,
    SVHC_LIST_DATE,
    SVHC_TOTAL_OFFICIAL,
    SVHC_SUBSET_COUNT,
    SVHC_DATA,
    SEARCH_INDEX,
    CAS_PATTERN,
    CONCENTRATION_PATTERN,
    parseConcentrationToken,
    isSnapshotStale,
    findByQuery,
    parseIngredientBlock
  };
}
