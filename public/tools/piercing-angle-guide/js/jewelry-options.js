/**
 * Piercing Angle & Depth Guide - Multi-Jewelry Profiles Database
 * Comprehensive jewelry profiles and alternative choices for all piercings.
 * All standards: ASTM F-136, ASTM F-138, BioFlex® body jewelry.
 */

(function () {
  'use strict';

  function t(key, fallback) {
    return (typeof window !== 'undefined' && window.translate) ? window.translate(key, null, fallback) : fallback;
  }

  var jewelryData = {
    'earlobe': [
      {
        id: 'labret',
        get name() { return t('jewelry.earlobe.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.earlobe.labret.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.earlobe.labret.length', "6.0-8.0mm wearable post"); },
        get downsize() { return t('jewelry.earlobe.labret.downsize', "5.0-6.0mm after 4-6 weeks"); },
        get description() { return t('jewelry.earlobe.labret.description', "Gold standard for initial healing. Flat base prevents posterior pressure necrosis and hair snagging; rigid straight post prevents rotational friction during healing."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.earlobe.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.earlobe.cbr.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.earlobe.cbr.length', "8.0-10.0mm inner diameter"); },
        get downsize() { return t('jewelry.earlobe.cbr.downsize', "7.0-8.0mm snug ring once fully healed"); },
        get description() { return t('jewelry.earlobe.cbr.description', "Classic captive bead ring. Ring curvature distributes radial contact; ideal once initial tissue canalization is fully established."); },
        isInitialStandard: false
      },
      {
        id: 'straight',
        get name() { return t('jewelry.earlobe.straight.name', "Straight Barbell with Beads"); },
        category: 'straight',
        get gauge() { return t('jewelry.earlobe.straight.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.earlobe.straight.length', "6.0-8.0mm post"); },
        get downsize() { return t('jewelry.earlobe.straight.downsize', "5.0-6.0mm after edema subsides"); },
        get description() { return t('jewelry.earlobe.straight.description', "Dual spherical bead configuration providing equal front and rear clearance for easy saline irrigation."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.earlobe.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.earlobe.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.earlobe.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.earlobe.circular.downsize', "8.0mm diameter after full maturity"); },
        get description() { return t('jewelry.earlobe.circular.description', "Open horseshoe ring with dual screw-on balls offering generous clearance around thick earlobes."); },
        isInitialStandard: false
      }
    ],
    'helix': [
      {
        id: 'labret',
        get name() { return t('jewelry.helix.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.helix.labret.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.helix.labret.length', "8.0mm initial post"); },
        get downsize() { return t('jewelry.helix.labret.downsize', "6.0mm flush post at 6-8 weeks"); },
        get description() { return t('jewelry.helix.labret.description', "Clinical standard for initial cartilage piercing. Minimizes friction against hair and eliminates rotational torque."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.helix.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.helix.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.helix.cbr.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.helix.cbr.downsize', "7.0-8.0mm snug fit once mature (6-9 mos)"); },
        get description() { return t('jewelry.helix.cbr.description', "Captive bead ring. Must not be worn in fresh piercings to prevent continuous rotation and hypertrophic collagen bumps."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.helix.clicker.name', "Seamless Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.helix.clicker.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.helix.clicker.length', "8.0mm inner diameter"); },
        get downsize() { return t('jewelry.helix.clicker.downsize', "6.5-8.0mm fitted ring"); },
        get description() { return t('jewelry.helix.clicker.description', "Hinged segment ring providing a continuous smooth circumference without exterior beads."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.helix.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.helix.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.helix.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.helix.circular.downsize', "8.0mm diameter"); },
        get description() { return t('jewelry.helix.circular.description', "Horseshoe ring providing easy anterior and posterior access during cleaning."); },
        isInitialStandard: false
      }
    ],
    'forward-helix': [
      {
        id: 'labret',
        get name() { return t('jewelry.forward_helix.labret.name', "Micro Flat-Back Labret"); },
        category: 'labret',
        get gauge() { return t('jewelry.forward_helix.labret.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.forward_helix.labret.length', "6.0-8.0mm post (2-2.5mm disc)"); },
        get downsize() { return t('jewelry.forward_helix.labret.downsize', "5.0-6.0mm after 6-8 weeks"); },
        get description() { return t('jewelry.forward_helix.labret.description', "Small 2-2.5mm posterior disc sits cleanly in the narrow anterior fossa without crowding the tragus."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.forward_helix.cbr.name', "Micro Ball Closure Ring (BCR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.forward_helix.cbr.gauge', "16g (1.2mm) or 18g (1.0mm)"); },
        get length() { return t('jewelry.forward_helix.cbr.length', "6.0-7.0mm diameter"); },
        get downsize() { return t('jewelry.forward_helix.cbr.downsize', "5.0-6.0mm once fully mature"); },
        get description() { return t('jewelry.forward_helix.cbr.description', "Small diameter captive ring for fully mature forward helix piercings."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.forward_helix.clicker.name', "Seamless Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.forward_helix.clicker.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.forward_helix.clicker.length', "6.0mm diameter"); },
        get downsize() { return t('jewelry.forward_helix.clicker.downsize', "5.0-6.0mm snug fit"); },
        get description() { return t('jewelry.forward_helix.clicker.description', "Smooth hinged ring providing a minimalist profile without snagging."); },
        isInitialStandard: false
      }
    ],
    'tragus': [
      {
        id: 'labret',
        get name() { return t('jewelry.tragus.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.tragus.labret.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.tragus.labret.length', "6.0-8.0mm post (3mm disc)"); },
        get downsize() { return t('jewelry.tragus.labret.downsize', "5.0-6.0mm after 6-8 weeks"); },
        get description() { return t('jewelry.tragus.labret.description', "Smooth 3mm flat disc leaves the ear canal open and prevents interference with earphones."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.tragus.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.tragus.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.tragus.cbr.length', "6.0-8.0mm diameter"); },
        get downsize() { return t('jewelry.tragus.cbr.downsize', "6.0mm snug ring once healed"); },
        get description() { return t('jewelry.tragus.cbr.description', "Captive bead ring for healed tragus placements. Requires full fistula maturation."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.tragus.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.tragus.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.tragus.circular.length', "6.0-8.0mm diameter"); },
        get downsize() { return t('jewelry.tragus.circular.downsize', "6.0mm diameter"); },
        get description() { return t('jewelry.tragus.circular.description', "Small horseshoe barbell providing a bold aesthetic on the outer ear."); },
        isInitialStandard: false
      }
    ],
    'anti-tragus': [
      {
        id: 'curved',
        get name() { return t('jewelry.anti_tragus.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.anti_tragus.curved.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.anti_tragus.curved.length', "8.0-10.0mm curved post"); },
        get downsize() { return t('jewelry.anti_tragus.curved.downsize', "6.0-8.0mm after 8 weeks"); },
        get description() { return t('jewelry.anti_tragus.curved.description', "Accommodates the thick triangular cartilage projection and follows the natural curvature of the conchal bowl."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.anti_tragus.cbr.name', "Ball Closure Ring (BCR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.anti_tragus.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.anti_tragus.cbr.length', "8.0mm diameter"); },
        get downsize() { return t('jewelry.anti_tragus.cbr.downsize', "6.0-7.0mm once fully mature"); },
        get description() { return t('jewelry.anti_tragus.cbr.description', "Captive bead ring worn after complete cartilage stabilization."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.anti_tragus.circular.name', "Circular Barbell"); },
        category: 'circular',
        get gauge() { return t('jewelry.anti_tragus.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.anti_tragus.circular.length', "8.0mm diameter"); },
        get downsize() { return t('jewelry.anti_tragus.circular.downsize', "6.0-8.0mm"); },
        get description() { return t('jewelry.anti_tragus.circular.description', "Open horseshoe ring for alternative healed styling."); },
        isInitialStandard: false
      }
    ],
    'conch': [
      {
        id: 'labret',
        get name() { return t('jewelry.conch.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.conch.labret.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.conch.labret.length', "8.0-10.0mm post (4mm disc)"); },
        get downsize() { return t('jewelry.conch.labret.downsize', "6.0-8.0mm after 6-8 weeks"); },
        get description() { return t('jewelry.conch.labret.description', "Essential for initial healing. Eliminates the severe lateral torque caused by hoop jewelry across the deep conchal bowl."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.conch.cbr.name', "Large Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.conch.cbr.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.conch.cbr.length', "10.0-14.0mm inner diameter"); },
        get downsize() { return t('jewelry.conch.cbr.downsize', "10.0-12.0mm snug ring once healed"); },
        get description() { return t('jewelry.conch.cbr.description', "Large diameter ring encircling the outer ear rim. Only suitable after 6-12 months of complete healing."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.conch.clicker.name', "Conch Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.conch.clicker.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.conch.clicker.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.conch.clicker.downsize', "10.0-12.0mm"); },
        get description() { return t('jewelry.conch.clicker.description', "Continuous hinged clicker offering seamless wrap-around conch styling."); },
        isInitialStandard: false
      }
    ],
    'rook': [
      {
        id: 'curved',
        get name() { return t('jewelry.rook.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.rook.curved.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.rook.curved.length', "8.0mm curved post (3mm micro-balls)"); },
        get downsize() { return t('jewelry.rook.curved.downsize', "6.0mm after 8-10 weeks"); },
        get description() { return t('jewelry.rook.curved.description', "Matches the vertical curvature of the antihelix ridge, allowing top and bottom beads to rest without tension."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.rook.cbr.name', "Micro Ball Closure Ring (BCR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.rook.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.rook.cbr.length', "6.0-8.0mm diameter"); },
        get downsize() { return t('jewelry.rook.cbr.downsize', "6.0mm diameter"); },
        get description() { return t('jewelry.rook.cbr.description', "Small diameter captive ring hanging vertically from the rook shelf once healed."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.rook.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.rook.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.rook.circular.length', "6.0-8.0mm diameter"); },
        get downsize() { return t('jewelry.rook.circular.downsize', "6.0mm"); },
        get description() { return t('jewelry.rook.circular.description', "Micro horseshoe barbell for healed rook placements."); },
        isInitialStandard: false
      }
    ],
    'daith': [
      {
        id: 'cbr',
        get name() { return t('jewelry.daith.cbr.name', "Captive Bead Ring (CBR / BCR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.daith.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.daith.cbr.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.daith.cbr.downsize', "8.0mm fitted ring"); },
        get description() { return t('jewelry.daith.cbr.description', "The standard choice for daith piercings. Ring curvature aligns naturally with the crus of the helix."); },
        isInitialStandard: true
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.daith.clicker.name', "Decorative / Heart Clicker Ring"); },
        category: 'clicker',
        get gauge() { return t('jewelry.daith.clicker.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.daith.clicker.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.daith.clicker.downsize', "8.0-9.0mm fitted ring"); },
        get description() { return t('jewelry.daith.clicker.description', "Hinged decorative clicker ring designed to sit flat inside the ear aperture."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.daith.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.daith.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.daith.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.daith.circular.downsize', "8.0mm diameter"); },
        get description() { return t('jewelry.daith.circular.description', "Circular barbell with forward-facing spherical beads."); },
        isInitialStandard: false
      },
      {
        id: 'curved',
        get name() { return t('jewelry.daith.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.daith.curved.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.daith.curved.length', "8.0-10.0mm curved post"); },
        get downsize() { return t('jewelry.daith.curved.downsize', "6.0-8.0mm post"); },
        get description() { return t('jewelry.daith.curved.description', "Curved banana bar alternative for discreet healing."); },
        isInitialStandard: false
      }
    ],
    'industrial': [
      {
        id: 'straight',
        get name() { return t('jewelry.industrial.straight.name', "Long Straight Scaffold Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.industrial.straight.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.industrial.straight.length', "32.0-38.0mm straight bar"); },
        get downsize() { return t('jewelry.industrial.straight.downsize', "30.0-34.0mm after 8-12 weeks"); },
        get description() { return t('jewelry.industrial.straight.description', "Single rigid barbell connecting both helix rims. Requires exact coplanar alignment to avoid cartilage distortion."); },
        isInitialStandard: true
      },
      {
        id: 'labret',
        get name() { return t('jewelry.industrial.labret.name', "Dual Individual Labrets (Split Healing)"); },
        category: 'labret',
        get gauge() { return t('jewelry.industrial.labret.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.industrial.labret.length', "8.0mm each post"); },
        get downsize() { return t('jewelry.industrial.labret.downsize', "6.0mm each post"); },
        get description() { return t('jewelry.industrial.labret.description', "Two separate flat-back labrets used to heal difficult anatomy independently before linking with chain or bar."); },
        isInitialStandard: false
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.industrial.cbr.name', "Dual Ball Closure Rings (BCR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.industrial.cbr.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.industrial.cbr.length', "8.0-10.0mm each ring"); },
        get downsize() { return t('jewelry.industrial.cbr.downsize', "8.0mm rings"); },
        get description() { return t('jewelry.industrial.cbr.description', "Two individual captive bead rings worn at each helix hole."); },
        isInitialStandard: false
      }
    ],
    'nostril': [
      {
        id: 'labret',
        get name() { return t('jewelry.nostril.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.nostril.labret.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.nostril.labret.length', "6.5-8.0mm post (initial edema)"); },
        get downsize() { return t('jewelry.nostril.labret.downsize', "5.0-6.0mm after 4-6 weeks"); },
        get description() { return t('jewelry.nostril.labret.description', "Gold standard for initial healing. Flat base sits flush against nasal mucosa without snagging, while rigid post prevents torque on healing cartilage."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.nostril.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.nostril.cbr.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.nostril.cbr.length', "8.0-10.0mm inner diameter"); },
        get downsize() { return t('jewelry.nostril.cbr.downsize', "7.0-8.0mm fitted ring once fully healed (4-6 months)"); },
        get description() { return t('jewelry.nostril.cbr.description', "Classic captive bead ring. Not recommended for fresh initial piercings due to continuous rotation, but ideal after full fistula maturation."); },
        isInitialStandard: false
      },
      {
        id: 'stud',
        get name() { return t('jewelry.nostril.stud.name', "Curved Nose Stud (Nostril Screw)"); },
        category: 'curved-stud',
        get gauge() { return t('jewelry.nostril.stud.gauge', "18g (1.0mm) or 20g (0.8mm)"); },
        get length() { return t('jewelry.nostril.stud.length', "6.0-6.5mm wearable stem"); },
        get downsize() { return t('jewelry.nostril.stud.downsize', "Custom contoured bend"); },
        get description() { return t('jewelry.nostril.stud.description', "Curved nostril screw or L-bend stud. Provides secure mechanical retention inside the nasal cavity with a low-profile decorative bezel top."); },
        isInitialStandard: false
      },
      {
        id: 'straight-barbell',
        get name() { return t('jewelry.nostril.straight_barbell.name', "Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.nostril.straight_barbell.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.nostril.straight_barbell.length', "6.5-8.0mm post"); },
        get downsize() { return t('jewelry.nostril.straight_barbell.downsize', "5.0-6.0mm after edema subsides"); },
        get description() { return t('jewelry.nostril.straight_barbell.description', "Micro straight barbell with dual threaded spherical beads, providing balanced front and mucosal clearance."); },
        isInitialStandard: false
      },
      {
        id: 'curved-barbell',
        get name() { return t('jewelry.nostril.curved_barbell.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.nostril.curved_barbell.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.nostril.curved_barbell.length', "8.0mm arc length"); },
        get downsize() { return t('jewelry.nostril.curved_barbell.downsize', "6.0mm arc length"); },
        get description() { return t('jewelry.nostril.curved_barbell.description', "Curved banana barbell profile suitable for anatomical contour variations."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.nostril.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.nostril.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.nostril.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.nostril.circular.downsize', "8.0mm after full maturity"); },
        get description() { return t('jewelry.nostril.circular.description', "Dual-ball open horseshoe hoop. Allows easy cleaning clearance around the nasal ala, worn primarily as a healed aesthetic variation."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.nostril.clicker.name', "Seamless Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.nostril.clicker.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.nostril.clicker.length', "7.0-8.0mm diameter"); },
        get downsize() { return t('jewelry.nostril.clicker.downsize', "Fitted snug clicker"); },
        get description() { return t('jewelry.nostril.clicker.description', "Hinged continuous hoop with internal click-lock. Provides a smooth continuous aesthetic without external beads."); },
        isInitialStandard: false
      }
    ],
    'high-nostril': [
      {
        id: 'labret',
        get name() { return t('jewelry.high_nostril.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.high_nostril.labret.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.high_nostril.labret.length', "8.0-10.0mm post"); },
        get downsize() { return t('jewelry.high_nostril.labret.downsize', "6.0-7.0mm after 6-8 weeks"); },
        get description() { return t('jewelry.high_nostril.labret.description', "Essential for high nasal vault cartilage. Rigid straight post prevents angular distortion from thick upper ala tissue."); },
        isInitialStandard: true
      },
      {
        id: 'stud',
        get name() { return t('jewelry.high_nostril.stud.name', "Nostril Bone / Screw Stud"); },
        category: 'stud',
        get gauge() { return t('jewelry.high_nostril.stud.gauge', "18g (1.0mm)"); },
        get length() { return t('jewelry.high_nostril.stud.length', "6.5-8.0mm stem"); },
        get downsize() { return t('jewelry.high_nostril.stud.downsize', "Custom fit"); },
        get description() { return t('jewelry.high_nostril.stud.description', "Low profile stud option for fully healed high nostril piercings."); },
        isInitialStandard: false
      },
      {
        id: 'straight',
        get name() { return t('jewelry.high_nostril.straight.name', "Micro Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.high_nostril.straight.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.high_nostril.straight.length', "8.0mm post"); },
        get downsize() { return t('jewelry.high_nostril.straight.downsize', "6.0mm post"); },
        get description() { return t('jewelry.high_nostril.straight.description', "Micro barbell with threaded interior and exterior beads."); },
        isInitialStandard: false
      }
    ],
    'septum': [
      {
        id: 'circular',
        get name() { return t('jewelry.septum.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.septum.circular.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.septum.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.septum.circular.downsize', "8.0mm diameter once healed"); },
        get description() { return t('jewelry.septum.circular.description', "Standard initial jewelry. Can be flipped up into nostrils during initial healing to protect from movement and trauma."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.septum.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.septum.cbr.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.septum.cbr.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.septum.cbr.downsize', "8.0mm snug ring"); },
        get description() { return t('jewelry.septum.cbr.description', "Classic captive bead ring hanging smoothly from the membranous sweet spot."); },
        isInitialStandard: false
      },
      {
        id: 'retainer',
        get name() { return t('jewelry.septum.retainer.name', "Septum Retainer / U-Pincher"); },
        category: 'retainer',
        get gauge() { return t('jewelry.septum.retainer.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.septum.retainer.length', "8.0-10.0mm legs"); },
        get downsize() { return t('jewelry.septum.retainer.downsize', "Snug retainer"); },
        get description() { return t('jewelry.septum.retainer.description', "Discreet U-shaped staple retainer that hides completely inside nasal vestibule."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.septum.clicker.name', "Seamless Septum Clicker"); },
        category: 'clicker',
        get gauge() { return t('jewelry.septum.clicker.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.septum.clicker.length', "8.0mm diameter"); },
        get downsize() { return t('jewelry.septum.clicker.downsize', "6.5-8.0mm fitted ring"); },
        get description() { return t('jewelry.septum.clicker.description', "Hinged ornate clicker offering seamless closure without loose balls."); },
        isInitialStandard: false
      }
    ],
    'bridge': [
      {
        id: 'straight',
        get name() { return t('jewelry.bridge.straight.name', "Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.bridge.straight.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.bridge.straight.length', "12.0-14.0mm straight post"); },
        get downsize() { return t('jewelry.bridge.straight.downsize', "10.0-12.0mm after 6-8 weeks"); },
        get description() { return t('jewelry.bridge.straight.description', "Mandatory standard. A straight bar aligns with the planar nasal skin bridge. Curved barbells must never be used as they cause inward torque and rapid rejection."); },
        isInitialStandard: true
      },
      {
        id: 'curved',
        get name() { return t('jewelry.bridge.curved.name', "Curved Barbell (Anatomical Variant Only)"); },
        category: 'curved',
        get gauge() { return t('jewelry.bridge.curved.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.bridge.curved.length', "12.0-14.0mm curved post"); },
        get downsize() { return t('jewelry.bridge.curved.downsize', "10.0-12.0mm"); },
        get description() { return t('jewelry.bridge.curved.description', "Used only in rare high-profile bridge variations with prominent curved nasal bone ridges."); },
        isInitialStandard: false
      }
    ],
    'eyebrow': [
      {
        id: 'curved',
        get name() { return t('jewelry.eyebrow.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.eyebrow.curved.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.eyebrow.curved.length', "8.0-10.0mm curved post (3mm micro-balls)"); },
        get downsize() { return t('jewelry.eyebrow.curved.downsize', "6.0-8.0mm after 4-6 weeks"); },
        get description() { return t('jewelry.eyebrow.curved.description', "Matches the convex curvature of the supraorbital ridge. Reduces surface tension and minimizes migration risk."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.eyebrow.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.eyebrow.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.eyebrow.cbr.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.eyebrow.cbr.downsize', "8.0mm diameter once mature"); },
        get description() { return t('jewelry.eyebrow.cbr.description', "Captive bead ring for healed eyebrow piercings."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.eyebrow.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.eyebrow.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.eyebrow.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.eyebrow.circular.downsize', "8.0mm diameter"); },
        get description() { return t('jewelry.eyebrow.circular.description', "Horseshoe ring providing a prominent multi-bead aesthetic."); },
        isInitialStandard: false
      }
    ],
    'labret': [
      {
        id: 'labret',
        get name() { return t('jewelry.labret.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.labret.labret.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.labret.labret.length', "10.0-12.0 mm initial post (4 mm wide base)"); },
        get downsize() { return t('jewelry.labret.labret.downsize', "7.0-8.0mm flush post after 4-6 weeks"); },
        get description() { return t('jewelry.labret.labret.description', "Standard initial jewelry. Wide 4mm smooth base disc prevents tissue embedding during acute lip swelling."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.labret.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.labret.cbr.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.labret.cbr.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.labret.cbr.downsize', "8.0-10.0mm fitted ring once mature"); },
        get description() { return t('jewelry.labret.cbr.description', "Captive bead ring encircling the lower lip vermilion border once fully healed."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.labret.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.labret.circular.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.labret.circular.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.labret.circular.downsize', "8.0-10.0mm diameter"); },
        get description() { return t('jewelry.labret.circular.description', "Horseshoe ring wrapping around the lip with dual spherical beads."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.labret.clicker.name', "Seamless Lip Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.labret.clicker.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.labret.clicker.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.labret.clicker.downsize', "8.0mm snug clicker"); },
        get description() { return t('jewelry.labret.clicker.description', "Continuous smooth lip hoop without external beads."); },
        isInitialStandard: false
      }
    ],
    'vertical-labret': [
      {
        id: 'curved',
        get name() { return t('jewelry.vertical_labret.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.vertical_labret.curved.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.vertical_labret.curved.length', "8.0-10.0mm curved post"); },
        get downsize() { return t('jewelry.vertical_labret.curved.downsize', "6.0-8.0mm post after 4-6 weeks"); },
        get description() { return t('jewelry.vertical_labret.curved.description', "Curved bar follows vertical lip anatomy from sublabial crease through vermilion lip surface without oral contact."); },
        isInitialStandard: true
      },
      {
        id: 'circular',
        get name() { return t('jewelry.vertical_labret.circular.name', "Micro Circular Barbell"); },
        category: 'circular',
        get gauge() { return t('jewelry.vertical_labret.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.vertical_labret.circular.length', "8.0mm diameter"); },
        get downsize() { return t('jewelry.vertical_labret.circular.downsize', "6.0-8.0mm"); },
        get description() { return t('jewelry.vertical_labret.circular.description', "Alternative curved option for distinctive healed aesthetics."); },
        isInitialStandard: false
      }
    ],
    'medusa': [
      {
        id: 'labret',
        get name() { return t('jewelry.medusa.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.medusa.labret.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.medusa.labret.length', "10.0-12.0mm post (4mm base disc)"); },
        get downsize() { return t('jewelry.medusa.labret.downsize', "7.0-8.0mm post after 4-6 weeks"); },
        get description() { return t('jewelry.medusa.labret.description', "Centrally aligned in the philtrum column. Flat base prevents dental enamel wear and gum irritation."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.medusa.cbr.name', "Ball Closure Ring (BCR - Healed Only)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.medusa.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.medusa.cbr.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.medusa.cbr.downsize', "8.0-10.0mm"); },
        get description() { return t('jewelry.medusa.cbr.description', "Rare healed styling option wrapping from upper lip philtrum around upper vermilion."); },
        isInitialStandard: false
      }
    ],
    'monroe': [
      {
        id: 'labret',
        get name() { return t('jewelry.monroe.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.monroe.labret.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.monroe.labret.length', "10.0-12.0mm initial post"); },
        get downsize() { return t('jewelry.monroe.labret.downsize', "6.0-8.0mm after 4-6 weeks"); },
        get description() { return t('jewelry.monroe.labret.description', "Off-center upper lip placement. Flat internal base protects upper canine and gingival tissue."); },
        isInitialStandard: true
      },
      {
        id: 'stud',
        get name() { return t('jewelry.monroe.stud.name', "Low-Profile Disc Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.monroe.stud.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.monroe.stud.length', "6.0-8.0mm post"); },
        get downsize() { return t('jewelry.monroe.stud.downsize', "6.0mm flush post"); },
        get description() { return t('jewelry.monroe.stud.description', "Ultra-low profile top disc creating a classic beauty mark aesthetic."); },
        isInitialStandard: false
      }
    ],
    'tongue': [
      {
        id: 'straight',
        get name() { return t('jewelry.tongue.straight.name', "Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.tongue.straight.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.tongue.straight.length', "18.0-22.0mm initial post"); },
        get downsize() { return t('jewelry.tongue.straight.downsize', "14.0-16.0mm after 2-3 weeks"); },
        get description() { return t('jewelry.tongue.straight.description', "Mandatory straight bar. Initial length accommodates massive lingual swelling; prompt downsizing is critical to prevent tooth chipping."); },
        isInitialStandard: true
      },
      {
        id: 'flat-top',
        get name() { return t('jewelry.tongue.flat_top.name', "Flat-Top Low Profile Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.tongue.flat_top.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.tongue.flat_top.length', "14.0-16.0mm post (flat upper disc)"); },
        get downsize() { return t('jewelry.tongue.flat_top.downsize', "12.0-14.0mm post"); },
        get description() { return t('jewelry.tongue.flat_top.description', "Flat top disc sits flush with tongue dorsum to eliminate roof-of-mouth contact."); },
        isInitialStandard: false
      }
    ],
    'navel': [
      {
        id: 'curved',
        get name() { return t('jewelry.navel.curved.name', "Curved Barbell (Navel Banana)"); },
        category: 'curved',
        get gauge() { return t('jewelry.navel.curved.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.navel.curved.length', "10.0-12.0mm curved post (top ball + bottom gem)"); },
        get downsize() { return t('jewelry.navel.curved.downsize', "8.0-10.0mm post after 8-12 weeks"); },
        get description() { return t('jewelry.navel.curved.description', "Classic navel standard. Top ball sits above upper rim while larger decorative bottom bead rests in navel cavity."); },
        isInitialStandard: true
      },
      {
        id: 'floating',
        get name() { return t('jewelry.navel.floating.name', "Floating Navel Curve (Flat Disc Base)"); },
        category: 'curved',
        get gauge() { return t('jewelry.navel.floating.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.navel.floating.length', "10.0-12.0mm curved post (small bottom disc)"); },
        get downsize() { return t('jewelry.navel.floating.downsize', "8.0-10.0mm post"); },
        get description() { return t('jewelry.navel.floating.description', "Engineered for collapsing navel cavities when seated. Flat bottom disc prevents tissue irritation from large beads."); },
        isInitialStandard: false
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.navel.cbr.name', "Large Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.navel.cbr.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.navel.cbr.length', "12.0-14.0mm diameter"); },
        get downsize() { return t('jewelry.navel.cbr.downsize', "10.0-12.0mm once fully mature"); },
        get description() { return t('jewelry.navel.cbr.description', "Captive bead ring encircling the upper navel lip once fistula is fully mature (6-9 months)."); },
        isInitialStandard: false
      }
    ],
    'nipple': [
      {
        id: 'straight',
        get name() { return t('jewelry.nipple.straight.name', "Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.nipple.straight.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.nipple.straight.length', "14.0-18.0mm straight bar"); },
        get downsize() { return t('jewelry.nipple.straight.downsize', "12.0-14.0mm after 6-8 weeks"); },
        get description() { return t('jewelry.nipple.straight.description', "The standard initial choice. Rings and curved bars move more and put outward pressure on a fresh channel, which slows healing and can cause migration."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.nipple.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.nipple.cbr.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.nipple.cbr.length', "12.0-16.0mm diameter"); },
        get downsize() { return t('jewelry.nipple.cbr.downsize', "12.0-14.0mm once fully healed (9-12 mos)"); },
        get description() { return t('jewelry.nipple.cbr.description', "Captive bead ring for healed nipples. Must have ample diameter to prevent edge pressure on the areola."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.nipple.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.nipple.circular.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.nipple.circular.length', "12.0-16.0mm diameter"); },
        get downsize() { return t('jewelry.nipple.circular.downsize', "12.0-14.0mm"); },
        get description() { return t('jewelry.nipple.circular.description', "Horseshoe barbell for fully mature healed nipple piercings."); },
        isInitialStandard: false
      }
    ],
    'surface': [
      {
        id: 'surface',
        get name() { return t('jewelry.surface.surface.name', "90° Flat Surface Barbell"); },
        category: 'surface',
        get gauge() { return t('jewelry.surface.surface.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.surface.surface.length', "16.0-22.0mm flat bar with dual 90° rises"); },
        get downsize() { return t('jewelry.surface.surface.downsize', "Fixed rise geometry"); },
        get description() { return t('jewelry.surface.surface.description', "Rigid flat surface bar with dual 90° vertical rises. Never use flexible PTFE or curved barbells which cause rapid rejection."); },
        isInitialStandard: true
      },
      {
        id: 'surface-disc',
        get name() { return t('jewelry.surface.surface_disc.name', "Surface Bar with Low-Profile Discs"); },
        category: 'surface',
        get gauge() { return t('jewelry.surface.surface_disc.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.surface.surface_disc.length', "16.0-20.0mm surface bar with 4mm flat discs"); },
        get downsize() { return t('jewelry.surface.surface_disc.downsize', "Flush disc tops"); },
        get description() { return t('jewelry.surface.surface_disc.description', "Ultra flat disc tops to minimize surface snagging on clothing."); },
        isInitialStandard: false
      }
    ],
    'dermal': [
      {
        id: 'dermal',
        get name() { return t('jewelry.dermal.dermal.name', "Single-Point Dermal Anchor (Flat Disc)"); },
        category: 'dermal',
        get gauge() { return t('jewelry.dermal.dermal.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.dermal.dermal.length', "2.0-2.5mm rise post with perforated foot base"); },
        get downsize() { return t('jewelry.dermal.dermal.downsize', "Fixed anchor foot"); },
        get description() { return t('jewelry.dermal.dermal.description', "Perforated titanium foot base anchored in the subdermal plane with interchangeable threaded/threadless top disc."); },
        isInitialStandard: true
      },
      {
        id: 'dermal-gem',
        get name() { return t('jewelry.dermal.dermal_gem.name', "Dermal Anchor (Bezel Gem Top)"); },
        category: 'dermal',
        get gauge() { return t('jewelry.dermal.dermal_gem.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.dermal.dermal_gem.length', "2.0-2.5mm rise with 4-5mm bezel gem"); },
        get downsize() { return t('jewelry.dermal.dermal_gem.downsize', "Interchangeable top"); },
        get description() { return t('jewelry.dermal.dermal_gem.description', "Low-profile bezel set synthetic opal or crystal gem top."); },
        isInitialStandard: false
      },
      {
        id: 'dermal-dome',
        get name() { return t('jewelry.dermal.dermal_dome.name', "Dermal Anchor (Smooth Dome Ball)"); },
        category: 'dermal',
        get gauge() { return t('jewelry.dermal.dermal_dome.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.dermal.dermal_dome.length', "2.0-2.5mm rise with 4mm dome top"); },
        get downsize() { return t('jewelry.dermal.dermal_dome.downsize', "Interchangeable top"); },
        get description() { return t('jewelry.dermal.dermal_dome.description', "Smooth dome top reducing snagging vectors."); },
        isInitialStandard: false
      }
    ],
    'prince-albert': [
      {
        id: 'curved',
        get name() { return t('jewelry.prince_albert.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.prince_albert.curved.gauge', "12g (2.0mm) or 10g (2.4mm)"); },
        get length() { return t('jewelry.prince_albert.curved.length', "16.0-19.0mm curved bar"); },
        get downsize() { return t('jewelry.prince_albert.curved.downsize', "14.0-16.0mm after 4-6 weeks"); },
        get description() { return t('jewelry.prince_albert.curved.description', "Comfortable initial healing jewelry extending from urethral meatus through sub-coronal tissue."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.prince_albert.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.prince_albert.cbr.gauge', "12g (2.0mm) or 10g (2.4mm)"); },
        get length() { return t('jewelry.prince_albert.cbr.length', "16.0-22.0mm diameter"); },
        get downsize() { return t('jewelry.prince_albert.cbr.downsize', "16.0-19.0mm ring"); },
        get description() { return t('jewelry.prince_albert.cbr.description', "Classic captive bead ring wrapping around the glans."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.prince_albert.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.prince_albert.circular.gauge', "12g (2.0mm) or 10g (2.4mm)"); },
        get length() { return t('jewelry.prince_albert.circular.length', "16.0-19.0mm diameter"); },
        get downsize() { return t('jewelry.prince_albert.circular.downsize', "16.0mm diameter"); },
        get description() { return t('jewelry.prince_albert.circular.description', "Horseshoe ring providing easy hygiene access."); },
        isInitialStandard: false
      }
    ],
    'vch': [
      {
        id: 'curved',
        get name() { return t('jewelry.vch.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.vch.curved.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.vch.curved.length', "10.0-12.0mm curved post (top & bottom beads)"); },
        get downsize() { return t('jewelry.vch.curved.downsize', "8.0-10.0mm post after 4-6 weeks"); },
        get description() { return t('jewelry.vch.curved.description', "Follows the anatomical contour of the prepuce (clitoral hood) without resting on the clitoral glans."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.vch.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.vch.cbr.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.vch.cbr.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.vch.cbr.downsize', "8.0-10.0mm ring once healed"); },
        get description() { return t('jewelry.vch.cbr.description', "Captive bead ring alternative for healed VCH piercings."); },
        isInitialStandard: false
      },
      {
        id: 'straight',
        get name() { return t('jewelry.vch.straight.name', "Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.vch.straight.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.vch.straight.length', "10.0-12.0mm straight post"); },
        get downsize() { return t('jewelry.vch.straight.downsize', "8.0-10.0mm post"); },
        get description() { return t('jewelry.vch.straight.description', "Straight post option for specific thin prepuce anatomies."); },
        isInitialStandard: false
      }
    ],
    'christina': [
      {
        id: 'surface',
        get name() { return t('jewelry.christina.surface.name', "L-Shaped Christina Surface Bar"); },
        category: 'surface',
        get gauge() { return t('jewelry.christina.surface.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.christina.surface.length', "Custom L-shaped surface barbell"); },
        get downsize() { return t('jewelry.christina.surface.downsize', "Snug rise post"); },
        get description() { return t('jewelry.christina.surface.description', "Specially engineered L-shaped bar conforming to the pubic mound and entering the superior clitoral hood notch."); },
        isInitialStandard: true
      },
      {
        id: 'curved',
        get name() { return t('jewelry.christina.curved.name', "Long Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.christina.curved.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.christina.curved.length', "14.0-18.0mm curved post"); },
        get downsize() { return t('jewelry.christina.curved.downsize', "12.0-16.0mm post"); },
        get description() { return t('jewelry.christina.curved.description', "Curved barbell used only in anatomies with deep pubic folds."); },
        isInitialStandard: false
      }
    ],
    'frenum': [
      {
        id: 'straight',
        get name() { return t('jewelry.frenum.straight.name', "Straight Barbell"); },
        category: 'straight',
        get gauge() { return t('jewelry.frenum.straight.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.frenum.straight.length', "12.0-16.0mm straight post"); },
        get downsize() { return t('jewelry.frenum.straight.downsize', "10.0-12.0mm after 3-4 weeks"); },
        get description() { return t('jewelry.frenum.straight.description', "Straight barbell passing perpendicularly through the penile shaft skin."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.frenum.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.frenum.cbr.gauge', "14g (1.6mm) or 12g (2.0mm)"); },
        get length() { return t('jewelry.frenum.cbr.length', "12.0-16.0mm diameter"); },
        get downsize() { return t('jewelry.frenum.cbr.downsize', "10.0-14.0mm ring"); },
        get description() { return t('jewelry.frenum.cbr.description', "Captive bead ring alternative once healed."); },
        isInitialStandard: false
      },
      {
        id: 'curved',
        get name() { return t('jewelry.frenum.curved.name', "Curved Barbell"); },
        category: 'curved',
        get gauge() { return t('jewelry.frenum.curved.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.frenum.curved.length', "12.0-14.0mm curved post"); },
        get downsize() { return t('jewelry.frenum.curved.downsize', "10.0-12.0mm post"); },
        get description() { return t('jewelry.frenum.curved.description', "Curved barbell contouring around the shaft."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.frenum.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.frenum.circular.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.frenum.circular.length', "12.0-14.0mm diameter"); },
        get downsize() { return t('jewelry.frenum.circular.downsize', "10.0-12.0mm"); },
        get description() { return t('jewelry.frenum.circular.description', "Horseshoe ring providing dual spherical bead aesthetics."); },
        isInitialStandard: false
      }
    ],
    'lip': [
      {
        id: 'labret',
        get name() { return t('jewelry.lip.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.lip.labret.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.lip.labret.length', "10.0-12.0 mm initial post (4 mm wide base)"); },
        get downsize() { return t('jewelry.lip.labret.downsize', "7.0-8.0mm flush post after 4-6 weeks"); },
        get description() { return t('jewelry.lip.labret.description', "Standard initial jewelry. Wide 4mm smooth base disc prevents tissue embedding during acute lip swelling."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.lip.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.lip.cbr.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.lip.cbr.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.lip.cbr.downsize', "8.0-10.0mm fitted ring once mature"); },
        get description() { return t('jewelry.lip.cbr.description', "Captive bead ring encircling the lower lip vermilion border once fully healed."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.lip.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.lip.circular.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.lip.circular.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.lip.circular.downsize', "8.0-10.0mm diameter"); },
        get description() { return t('jewelry.lip.circular.description', "Horseshoe ring wrapping around the lip with dual spherical beads."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.lip.clicker.name', "Seamless Lip Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.lip.clicker.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.lip.clicker.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.lip.clicker.downsize', "8.0mm snug clicker"); },
        get description() { return t('jewelry.lip.clicker.description', "Continuous smooth lip hoop without external beads."); },
        isInitialStandard: false
      }
    ],
    'philtrum': [
      {
        id: 'labret',
        get name() { return t('jewelry.philtrum.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.philtrum.labret.gauge', "16g (1.2mm) or 14g (1.6mm)"); },
        get length() { return t('jewelry.philtrum.labret.length', "10.0-12.0mm post (4mm base disc)"); },
        get downsize() { return t('jewelry.philtrum.labret.downsize', "7.0-8.0mm post after 4-6 weeks"); },
        get description() { return t('jewelry.philtrum.labret.description', "Centrally aligned in the philtrum column. Flat base prevents dental enamel wear and gum irritation."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.philtrum.cbr.name', "Ball Closure Ring (BCR - Healed Only)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.philtrum.cbr.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.philtrum.cbr.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.philtrum.cbr.downsize', "8.0-10.0mm"); },
        get description() { return t('jewelry.philtrum.cbr.description', "Rare healed styling option wrapping from upper lip philtrum around upper vermilion."); },
        isInitialStandard: false
      }
    ],
    'forehead': [
      {
        id: 'dermal',
        get name() { return t('jewelry.forehead.dermal.name', "Single-Point Dermal Anchor (Flat Disc)"); },
        category: 'dermal',
        get gauge() { return t('jewelry.forehead.dermal.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.forehead.dermal.length', "2.0-2.5mm rise post with perforated foot base"); },
        get downsize() { return t('jewelry.forehead.dermal.downsize', "Fixed anchor foot"); },
        get description() { return t('jewelry.forehead.dermal.description', "Perforated titanium foot base anchored in the subdermal plane with interchangeable threaded/threadless top disc."); },
        isInitialStandard: true
      },
      {
        id: 'dermal-gem',
        get name() { return t('jewelry.forehead.dermal_gem.name', "Dermal Anchor (Bezel Gem Top)"); },
        category: 'dermal',
        get gauge() { return t('jewelry.forehead.dermal_gem.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.forehead.dermal_gem.length', "2.0-2.5mm rise with 4-5mm bezel gem"); },
        get downsize() { return t('jewelry.forehead.dermal_gem.downsize', "Interchangeable top"); },
        get description() { return t('jewelry.forehead.dermal_gem.description', "Low-profile bezel set synthetic opal or crystal gem top."); },
        isInitialStandard: false
      },
      {
        id: 'dermal-dome',
        get name() { return t('jewelry.forehead.dermal_dome.name', "Dermal Anchor (Smooth Dome Ball)"); },
        category: 'dermal',
        get gauge() { return t('jewelry.forehead.dermal_dome.gauge', "14g (1.6mm)"); },
        get length() { return t('jewelry.forehead.dermal_dome.length', "2.0-2.5mm rise with 4mm dome top"); },
        get downsize() { return t('jewelry.forehead.dermal_dome.downsize', "Interchangeable top"); },
        get description() { return t('jewelry.forehead.dermal_dome.description', "Smooth dome top reducing snagging vectors."); },
        isInitialStandard: false
      }
    ],
    'snake-bites': [
      {
        id: 'labret',
        get name() { return t('jewelry.snake_bites.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.snake_bites.labret.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.snake_bites.labret.length', "10.0-12.0 mm initial post (4 mm wide base)"); },
        get downsize() { return t('jewelry.snake_bites.labret.downsize', "7.0-8.0mm flush post after 4-6 weeks"); },
        get description() { return t('jewelry.snake_bites.labret.description', "Standard initial jewelry. Wide 4mm smooth base disc prevents tissue embedding during acute lip swelling."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.snake_bites.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.snake_bites.cbr.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.snake_bites.cbr.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.snake_bites.cbr.downsize', "8.0-10.0mm fitted ring once mature"); },
        get description() { return t('jewelry.snake_bites.cbr.description', "Captive bead ring encircling the lower lip vermilion border once fully healed."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.snake_bites.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.snake_bites.circular.gauge', "14g (1.6mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.snake_bites.circular.length', "10.0-12.0mm diameter"); },
        get downsize() { return t('jewelry.snake_bites.circular.downsize', "8.0-10.0mm diameter"); },
        get description() { return t('jewelry.snake_bites.circular.description', "Horseshoe ring wrapping around the lip with dual spherical beads."); },
        isInitialStandard: false
      },
      {
        id: 'clicker',
        get name() { return t('jewelry.snake_bites.clicker.name', "Seamless Lip Clicker Hoop"); },
        category: 'clicker',
        get gauge() { return t('jewelry.snake_bites.clicker.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.snake_bites.clicker.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.snake_bites.clicker.downsize', "8.0mm snug clicker"); },
        get description() { return t('jewelry.snake_bites.clicker.description', "Continuous smooth lip hoop without external beads."); },
        isInitialStandard: false
      }
    ],
    'upper-lobe': [
      {
        id: 'labret',
        get name() { return t('jewelry.upper_lobe.labret.name', "Flat-Back Labret Stud"); },
        category: 'labret',
        get gauge() { return t('jewelry.upper_lobe.labret.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.upper_lobe.labret.length', "6.0-8.0mm wearable post"); },
        get downsize() { return t('jewelry.upper_lobe.labret.downsize', "5.0-6.0mm after 4-6 weeks"); },
        get description() { return t('jewelry.upper_lobe.labret.description', "Gold standard for initial healing. Flat base prevents posterior pressure necrosis and hair snagging; rigid straight post prevents rotational friction during healing."); },
        isInitialStandard: true
      },
      {
        id: 'cbr',
        get name() { return t('jewelry.upper_lobe.cbr.name', "Ball Closure Ring (BCR / CBR)"); },
        category: 'cbr',
        get gauge() { return t('jewelry.upper_lobe.cbr.gauge', "18g (1.0mm) or 16g (1.2mm)"); },
        get length() { return t('jewelry.upper_lobe.cbr.length', "8.0-10.0mm inner diameter"); },
        get downsize() { return t('jewelry.upper_lobe.cbr.downsize', "7.0-8.0mm snug ring once fully healed"); },
        get description() { return t('jewelry.upper_lobe.cbr.description', "Classic captive bead ring. Ring curvature distributes radial contact; ideal once initial tissue canalization is fully established."); },
        isInitialStandard: false
      },
      {
        id: 'straight',
        get name() { return t('jewelry.upper_lobe.straight.name', "Straight Barbell with Beads"); },
        category: 'straight',
        get gauge() { return t('jewelry.upper_lobe.straight.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.upper_lobe.straight.length', "6.0-8.0mm post"); },
        get downsize() { return t('jewelry.upper_lobe.straight.downsize', "5.0-6.0mm after edema subsides"); },
        get description() { return t('jewelry.upper_lobe.straight.description', "Dual spherical bead configuration providing equal front and rear clearance for easy saline irrigation."); },
        isInitialStandard: false
      },
      {
        id: 'circular',
        get name() { return t('jewelry.upper_lobe.circular.name', "Circular Barbell (Horseshoe)"); },
        category: 'circular',
        get gauge() { return t('jewelry.upper_lobe.circular.gauge', "16g (1.2mm)"); },
        get length() { return t('jewelry.upper_lobe.circular.length', "8.0-10.0mm diameter"); },
        get downsize() { return t('jewelry.upper_lobe.circular.downsize', "8.0mm diameter after full maturity"); },
        get description() { return t('jewelry.upper_lobe.circular.description', "Open horseshoe ring with dual screw-on balls offering generous clearance around thick earlobes."); },
        isInitialStandard: false
      }
    ]
  };

  // Expose globally to window
  if (typeof window !== 'undefined') {
    window.PIERCING_JEWELRY_OPTIONS = jewelryData;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = jewelryData;
  }
})();
