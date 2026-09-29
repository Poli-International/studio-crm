// Common Professional Formulas Database
// Organized by category: skin tones, portrait details, grays, landscape

const commonFormulas = {
  // SKIN TONES
  skin_tones: {
    light_caucasian: {
      name: 'Light Caucasian - Base',
      formula: [
        {color: 'white', parts: 10},
        {color: 'yellow', parts: 3},
        {color: 'red', parts: 1},
        {color: 'blue', parts: 0.25}
      ],
      ratio: '10:3:1:0.25',
      description: 'Base for light skin tones',
      notes: 'Adjust yellow for warmth, red for rosiness',
      tags: ['portrait', 'skin', 'realism']
    },

    medium_caucasian: {
      name: 'Medium Caucasian - Base',
      formula: [
        {color: 'white', parts: 8},
        {color: 'yellow', parts: 4},
        {color: 'red', parts: 2},
        {color: 'brown', parts: 0.5},
        {color: 'blue', parts: 0.25}
      ],
      ratio: '8:4:2:0.5:0.25',
      description: 'Versatile medium skin base',
      notes: 'Most common starting point for portraits',
      tags: ['portrait', 'skin', 'realism']
    },

    olive: {
      name: 'Olive Skin Tone',
      formula: [
        {color: 'white', parts: 6},
        {color: 'yellow', parts: 5},
        {color: 'red', parts: 1},
        {color: 'black', parts: 0.5},
        {color: 'green', parts: 0.25}
      ],
      ratio: '6:5:1:0.5:0.25',
      description: 'Mediterranean/olive skin tones',
      notes: 'Green is key for olive undertone',
      tags: ['portrait', 'skin', 'realism']
    },

    asian: {
      name: 'East Asian Skin Tone',
      formula: [
        {color: 'white', parts: 8},
        {color: 'yellow', parts: 5},
        {color: 'red', parts: 1.5},
        {color: 'brown', parts: 0.5},
        {color: 'green', parts: 0.1}
      ],
      ratio: '8:5:1.5:0.5:0.1',
      description: 'Yellow-based with subtle coolness',
      notes: 'Adjust yellow-to-red ratio for variation',
      tags: ['portrait', 'skin', 'realism']
    },

    dark_brown: {
      name: 'Dark Brown Skin',
      formula: [
        {color: 'brown', parts: 8},
        {color: 'red', parts: 3},
        {color: 'yellow', parts: 2},
        {color: 'black', parts: 1},
        {color: 'white', parts: 1}
      ],
      ratio: '8:3:2:1:1',
      description: 'Deep brown skin tones',
      notes: 'Adjust red for warmth, black for depth',
      tags: ['portrait', 'skin', 'realism']
    },

    hispanic_latino: {
      name: 'Hispanic/Latino Skin',
      formula: [
        {color: 'white', parts: 7},
        {color: 'yellow', parts: 4},
        {color: 'red', parts: 2},
        {color: 'brown', parts: 1},
        {color: 'orange', parts: 0.5}
      ],
      ratio: '7:4:2:1:0.5',
      description: 'Warm golden-brown undertones',
      notes: 'More orange for Caribbean, more brown for Central/South American',
      tags: ['portrait', 'skin', 'realism']
    },

    south_asian: {
      name: 'South Asian Skin',
      formula: [
        {color: 'white', parts: 6},
        {color: 'yellow', parts: 4},
        {color: 'red', parts: 2},
        {color: 'brown', parts: 1.5},
        {color: 'orange', parts: 0.5}
      ],
      ratio: '6:4:2:1.5:0.5',
      description: 'Golden-brown with warm undertones',
      notes: 'Adjust yellow-red ratio for regional variation',
      tags: ['portrait', 'skin', 'realism']
    },

    light_brown: {
      name: 'Light Brown Skin',
      formula: [
        {color: 'white', parts: 5},
        {color: 'brown', parts: 4},
        {color: 'yellow', parts: 3},
        {color: 'red', parts: 2},
        {color: 'orange', parts: 1}
      ],
      ratio: '5:4:3:2:1',
      description: 'Medium-light brown tones',
      notes: 'Versatile base for many ethnicities',
      tags: ['portrait', 'skin', 'realism']
    }
  },

  // PORTRAIT DETAILS
  portrait: {
    rosy_cheeks: {
      name: 'Rosy Cheeks/Flush',
      formula: [
        {color: 'red', parts: 3},
        {color: 'magenta', parts: 1},
        {color: 'white', parts: 2}
      ],
      ratio: '3:1:2',
      description: 'Natural flush for cheeks, nose, ears',
      notes: 'Mix with base skin tone for natural look',
      tags: ['portrait', 'realism']
    },

    natural_lips: {
      name: 'Natural Lip Color',
      formula: [
        {color: 'red', parts: 8},
        {color: 'magenta', parts: 3},
        {color: 'white', parts: 2},
        {color: 'brown', parts: 0.5}
      ],
      ratio: '8:3:2:0.5',
      description: 'Natural lip color base',
      notes: 'Adjust for cool/warm, light/dark',
      tags: ['portrait', 'realism']
    },

    shadow_tone: {
      name: 'Portrait Shadow Tone',
      formula: [
        {color: 'brown', parts: 4},
        {color: 'purple', parts: 2},
        {color: 'blue', parts: 1},
        {color: 'black', parts: 0.5}
      ],
      ratio: '4:2:1:0.5',
      description: 'Natural shadow color for portraits',
      notes: 'Mix with skin tone for realistic shadows',
      tags: ['portrait', 'realism', 'shading']
    },

    highlight_tone: {
      name: 'Portrait Highlight',
      formula: [
        {color: 'white', parts: 10},
        {color: 'yellow', parts: 1},
        {color: 'blue', parts: 0.1}
      ],
      ratio: '10:1:0.1',
      description: 'Subtle highlight for skin',
      notes: 'Tiny bit of blue prevents flatness',
      tags: ['portrait', 'realism', 'highlights']
    },

    vein_blue: {
      name: 'Vein/Undertone Blue',
      formula: [
        {color: 'blue', parts: 4},
        {color: 'purple', parts: 2},
        {color: 'white', parts: 1},
        {color: 'green', parts: 0.5}
      ],
      ratio: '4:2:1:0.5',
      description: 'Visible veins and cool undertones',
      notes: 'Very subtle - use sparingly',
      tags: ['portrait', 'realism', 'details']
    }
  },

  // GRAYS & NEUTRALS
  grays: {
    neutral_gray_10: {
      name: '10% Neutral Gray',
      formula: [
        {color: 'black', parts: 1},
        {color: 'white', parts: 9}
      ],
      ratio: '1:9',
      description: 'Very light gray wash',
      notes: 'Lightest shading, subtle gradients',
      tags: ['black_and_grey', 'shading']
    },

    neutral_gray_30: {
      name: '30% Neutral Gray',
      formula: [
        {color: 'black', parts: 3},
        {color: 'white', parts: 7}
      ],
      ratio: '3:7',
      description: 'Light-medium gray',
      notes: 'Light shading, soft shadows',
      tags: ['black_and_grey', 'shading']
    },

    neutral_gray_50: {
      name: '50% Neutral Gray',
      formula: [
        {color: 'black', parts: 1},
        {color: 'white', parts: 1}
      ],
      ratio: '1:1',
      description: 'Medium gray',
      notes: 'Medium shadows, general shading',
      tags: ['black_and_grey', 'shading']
    },

    warm_gray: {
      name: 'Warm Gray',
      formula: [
        {color: 'black', parts: 1},
        {color: 'white', parts: 10},
        {color: 'yellow', parts: 0.25},
        {color: 'red', parts: 0.1}
      ],
      ratio: '1:10:0.25:0.1',
      description: 'Warm-toned gray for portraits',
      notes: 'For warm shadows in skin',
      tags: ['black_and_grey', 'portrait']
    },

    cool_gray: {
      name: 'Cool Gray',
      formula: [
        {color: 'black', parts: 1},
        {color: 'white', parts: 10},
        {color: 'blue', parts: 0.25}
      ],
      ratio: '1:10:0.25',
      description: 'Cool-toned gray',
      notes: 'For cool shadows, machinery',
      tags: ['black_and_grey', 'realism']
    }
  },

  // LANDSCAPE COLORS
  landscape: {
    grass_green: {
      name: 'Natural Grass Green',
      formula: [
        {color: 'yellow', parts: 6},
        {color: 'blue', parts: 3},
        {color: 'black', parts: 0.5}
      ],
      ratio: '6:3:0.5',
      description: 'Natural grass color',
      notes: 'More yellow = spring, more blue+black = forest',
      tags: ['landscape', 'nature']
    },

    sky_blue: {
      name: 'Sky Blue',
      formula: [
        {color: 'blue', parts: 8},
        {color: 'white', parts: 10},
        {color: 'red', parts: 0.1}
      ],
      ratio: '8:10:0.1',
      description: 'Natural sky blue',
      notes: 'Tiny bit of red prevents flat look',
      tags: ['landscape', 'nature']
    },

    sunset_orange: {
      name: 'Sunset Orange',
      formula: [
        {color: 'yellow', parts: 6},
        {color: 'red', parts: 4},
        {color: 'white', parts: 0.5}
      ],
      ratio: '6:4:0.5',
      description: 'Warm sunset orange',
      notes: 'Adjust intensity with white',
      tags: ['landscape', 'nature']
    },

    ocean_blue: {
      name: 'Ocean Blue',
      formula: [
        {color: 'blue', parts: 6},
        {color: 'green', parts: 2},
        {color: 'white', parts: 1},
        {color: 'black', parts: 0.25}
      ],
      ratio: '6:2:1:0.25',
      description: 'Deep ocean water',
      notes: 'More green for tropical, less for deep ocean',
      tags: ['landscape', 'nature', 'water']
    },

    tree_bark_brown: {
      name: 'Tree Bark Brown',
      formula: [
        {color: 'brown', parts: 8},
        {color: 'black', parts: 2},
        {color: 'orange', parts: 1},
        {color: 'green', parts: 0.5}
      ],
      ratio: '8:2:1:0.5',
      description: 'Natural wood/bark color',
      notes: 'Adjust green for moss/lichen',
      tags: ['landscape', 'nature']
    },

    forest_green: {
      name: 'Forest/Dark Green',
      formula: [
        {color: 'green', parts: 8},
        {color: 'black', parts: 3},
        {color: 'blue', parts: 1},
        {color: 'yellow', parts: 0.5}
      ],
      ratio: '8:3:1:0.5',
      description: 'Deep forest green',
      notes: 'Rich, dark green for foliage',
      tags: ['landscape', 'nature']
    }
  },

  // VIBRANT/SPECIAL COLORS
  vibrant: {
    neon_pink: {
      name: 'Vibrant Pink',
      formula: [
        {color: 'magenta', parts: 8},
        {color: 'red', parts: 2},
        {color: 'white', parts: 1}
      ],
      ratio: '8:2:1',
      description: 'Bright, vivid pink',
      notes: 'High saturation for colorful work',
      tags: ['vibrant', 'colorful']
    },

    royal_purple: {
      name: 'Royal Purple',
      formula: [
        {color: 'purple', parts: 8},
        {color: 'blue', parts: 2},
        {color: 'red', parts: 1}
      ],
      ratio: '8:2:1',
      description: 'Rich, deep purple',
      notes: 'Jewel-tone purple',
      tags: ['vibrant', 'colorful']
    },

    true_orange: {
      name: 'True Orange',
      formula: [
        {color: 'orange', parts: 8},
        {color: 'red', parts: 2},
        {color: 'yellow', parts: 1}
      ],
      ratio: '8:2:1',
      description: 'Bold, saturated orange',
      notes: 'Adjust red-yellow for warm/cool',
      tags: ['vibrant', 'colorful']
    },

    turquoise: {
      name: 'Turquoise',
      formula: [
        {color: 'blue', parts: 5},
        {color: 'green', parts: 5},
        {color: 'white', parts: 2}
      ],
      ratio: '5:5:2',
      description: 'Bright blue-green',
      notes: 'Popular for tropical/beach themes',
      tags: ['vibrant', 'colorful', 'nature']
    }
  }
};

// Get all formulas from a specific category
function getFormulasCategory(category) {
  return commonFormulas[category] || {};
}

// Get a specific formula by category and name
function getFormula(category, formulaKey) {
  if (commonFormulas[category] && commonFormulas[category][formulaKey]) {
    return commonFormulas[category][formulaKey];
  }
  return null;
}

window.commonFormulas = commonFormulas;
window.getFormulasCategory = getFormulasCategory;
window.getFormula = getFormula;
