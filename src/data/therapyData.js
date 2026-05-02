export const THERAPY_SERVER = 'http://localhost:4000'

export function pdfUrl(relPath) {
  return `${THERAPY_SERVER}/therapy-file?path=${encodeURIComponent(relPath)}`
}

export function filesUrl(relDir) {
  return `${THERAPY_SERVER}/therapy-files?dir=${encodeURIComponent(relDir)}`
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

export const VOCABULARY = [
  {
    id: 'fridge',
    label: 'Items in the Fridge',
    color: '#60a5fa',
    words: [
      'Watermelon', 'Sambar', 'Rasam', 'Cabbage', 'Beans',
      'Red Pepper', 'Bell Pepper', 'Blueberry', 'Strawberry', 'Tomato',
      'Banana', 'Pumpkin', 'Grapes', 'Cake', 'Chocolate',
      'Bread', 'Jam', 'Green Chutney', 'White Chutney', 'Molagootal',
      'Kheera Molagootal', 'White Rice', 'Vethakozhambu', 'Eggplant', 'Ice Cream',
      'Samosa', 'Small Samosa', 'Paruppu', 'Roti', 'Ice',
    ],
  },
  {
    id: 'living-room',
    label: 'Living Room',
    color: '#4ade80',
    words: [
      'Trash', 'Chair', 'Sofa', 'Roof', 'Floor',
      'Stuffed Toys', 'Fireplace', 'Towel', 'Pipe', 'TV',
      'Amazon Echo', 'Carpet', 'Wall', 'Light',
    ],
  },
]

// ── K5 Reading Levels ─────────────────────────────────────────────────────────

const KG  = 'English/k5-learning-kindergarten-reading-bundle-ihbscj'
const G1  = 'English/k5-learning-grade-1-reading-bundle-xyzzi0'
const G2  = 'English/k5-learning-grade-2-reading-bundle-tlo2b0'
const G3  = 'English/k5-learning-grade-3-reading-bundle-a9igxq'
const G4  = 'English/k5-learning-grade-4-reading-bundle-2mgyne'
const G5  = 'English/k5-learning-grade-5-reading-bundle-n9bafw'

export const READING_GRADES = [
  {
    grade: 'Kindergarten', color: '#4ade80',
    levels: [
      { level: 'A', file: `${KG}/k5-learning-reader-level-a.pdf` },
      { level: 'B', file: `${KG}/k5-learning-reader-level-b.pdf` },
      { level: 'C', file: `${KG}/k5-learning-reader-level-c.pdf` },
    ],
  },
  {
    grade: 'Grade 1', color: '#60a5fa',
    levels: [
      { level: 'D', file: `${G1}/k5-learning-reader-level-d.pdf` },
      { level: 'E', file: `${G1}/k5-learning-reader-level-e.pdf` },
      { level: 'F', file: `${G1}/k5-learning-reader-level-f.pdf` },
      { level: 'G', file: `${G1}/k5-learning-reader-level-g.pdf` },
      { level: 'H', file: `${G1}/k5-learning-reader-level-h.pdf` },
      { level: 'I', file: `${G1}/k5-learning-reader-level-i.pdf` },
    ],
  },
  {
    grade: 'Grade 2', color: '#f59e0b',
    levels: [
      { level: 'J1', file: `${G2}/k5-learning-reader-level-j1.pdf` },
      { level: 'J2', file: `${G2}/k5-learning-reader-level-j2.pdf` },
      { level: 'K1', file: `${G2}/k5-learning-reader-level-k1.pdf` },
      { level: 'K2', file: `${G2}/k5-learning-reader-level-k2.pdf` },
      { level: 'L1', file: `${G2}/k5-learning-reader-level-l1.pdf` },
      { level: 'L2', file: `${G2}/k5-learning-reader-level-l2.pdf` },
      { level: 'M1', file: `${G2}/k5-learning-reader-level-m1.pdf` },
      { level: 'M2', file: `${G2}/k5-learning-reader-level-m2.pdf` },
    ],
  },
  {
    grade: 'Grade 3', color: '#f87171',
    levels: [
      { level: 'N1', file: `${G3}/k5-learning-reader-level-n1.pdf` },
      { level: 'N2', file: `${G3}/k5-learning-reader-level-n2.pdf` },
      { level: 'O1', file: `${G3}/k5-learning-reader-level-o1.pdf` },
      { level: 'O2', file: `${G3}/k5-learning-reader-level-o2.pdf` },
      { level: 'P1', file: `${G3}/k5-learning-reader-level-p1.pdf` },
      { level: 'P2', file: `${G3}/k5-learning-reader-level-p2.pdf` },
    ],
  },
  {
    grade: 'Grade 4', color: '#a78bfa',
    levels: [
      { level: 'Q', file: `${G4}/k5-learning-reader-level-q.pdf` },
      { level: 'R', file: `${G4}/k5-learning-reader-level-r.pdf` },
      { level: 'S', file: `${G4}/k5-learning-reader-level-s.pdf` },
    ],
  },
  {
    grade: 'Grade 5', color: '#14b8a6',
    levels: [
      { level: 'T', file: `${G5}/k5-learning-reader-level-t.pdf` },
      { level: 'U', file: `${G5}/k5-learning-reader-level-u.pdf` },
      { level: 'V', file: `${G5}/k5-learning-reader-level-v.pdf` },
    ],
  },
]

// ── WH Questions ──────────────────────────────────────────────────────────────

const WH_DIR = 'WHQuestionsBundleSpecialEducationSpeechTherapyIEPGoalsVisuals'

export const WH_QUESTIONS = [
  {
    group: 'Standalone',
    items: [
      { name: 'Around the Community – WH Questions', file: 'Around the Community- WH Questions.pdf' },
      { name: 'WH Question Stories with Illustrations', file: 'WH Question Stories with Illustrations.pdf' },
    ],
  },
  {
    group: 'WH Questions Bundle',
    items: [
      { name: 'WH Question Cards & Visuals', file: `${WH_DIR}/1 - WH Question Cards Visuals _ WH Questions _ Speech Therapy _ Special Education.pdf` },
      { name: 'Real Pictures WH Questions (Dry Erase)', file: `${WH_DIR}/3 - REAL PICTURES WH Questions _ Dry Erase _ Special Education _ Speech Therapy.pdf` },
      { name: 'Simple Dry Erase – Flip Books & Task Cards', file: `${WH_DIR}/5 - Simple Dry Erase _ WH Questions _ Flip Books _ Task Cards _ Special Education.pdf` },
    ],
  },
]

// ── Social Skills ─────────────────────────────────────────────────────────────

const SS_DIR = 'SocialSkillsActivitiesPragmaticLanguageSpeechTherapyMiddleSchoolBUNDLE'

export const SOCIAL_SKILLS = [
  {
    group: 'Conversation Scripts & Role Play',
    items: [
      { name: 'Conversation Scripts – Role Play Scenarios', file: `${SS_DIR}/4 - Conversation Scripts Role Play Scenarios Social Language Activity Speech Therapy.pdf` },
    ],
  },
  {
    group: 'Conversation Turn-Taking',
    items: [
      { name: 'Color Version', file: `${SS_DIR}/Conversation Turn-Taking and Balance/COLOR Conversation Turn Taking and Balance.pdf` },
      { name: 'Black & White Version', file: `${SS_DIR}/Conversation Turn-Taking and Balance/BLACK AND WHITE Conversation Turn Taking and Balance.pdf` },
      { name: 'Digital Version', file: `${SS_DIR}/Conversation Turn-Taking and Balance/DIGITAL Conversation Turn Taking and Balance_new.pdf` },
    ],
  },
  {
    group: 'Identifying & Using Sarcasm',
    items: [
      { name: 'Color Version', file: `${SS_DIR}/Identifying and Using Sarcasm/COLOR Identifying and Using Sarcasm.pdf` },
      { name: 'Black & White Version', file: `${SS_DIR}/Identifying and Using Sarcasm/BW Identifying and Using Sarcasm.pdf` },
    ],
  },
  {
    group: 'Identifying Feelings & Emotions',
    items: [
      { name: 'Color Version', file: `${SS_DIR}/Identifying Feelings and Emotions Social Situations/COLOR Identifying Emotion and Responding in Social Situations.pdf` },
      { name: 'Black & White Version', file: `${SS_DIR}/Identifying Feelings and Emotions Social Situations/BLACK_WHITE Identifying Emotion and Responding in Social Situations.pdf` },
    ],
  },
  {
    group: 'Taking Turns in Conversation',
    items: [
      { name: 'Conversational Responses – Questions & Comments', file: `${SS_DIR}/Taking Turns in Conversation Questions and Comments/Conversational Responses Questions and Comments.pdf` },
    ],
  },
  {
    group: 'Body Language & Emotion',
    items: [
      { name: 'Color Version', file: `${SS_DIR}/Using Body Language To Identify Emotion/COLOR Using Body Language To Identify Emotion.pdf` },
      { name: 'Black & White Version', file: `${SS_DIR}/Using Body Language To Identify Emotion/BW Using Body Language To Identify Emotion.pdf` },
    ],
  },
]

// ── Following Directions ──────────────────────────────────────────────────────

const FD_DIR = 'FollowingDirectionsActivitiesandWorksheetsBundle-1'

export const FOLLOWING_DIRECTIONS = [
  { name: 'Following Directions Bundle', file: `${FD_DIR}/Following Directions BUNDLE.pdf` },
  { name: 'New Following Directions Worksheets', file: `${FD_DIR}/New Following Directions Worksheets.pdf` },
  { name: 'Task Cards – Get Students Moving', file: `${FD_DIR}/Following Direction Task Cards to Get Your Students Moving.pdf` },
  { name: 'Temporal Directions Visuals', file: `${FD_DIR}/Temporal Directions Visuals.pdf` },
  { name: 'Pretest & Posttest Pages', file: `${FD_DIR}/Pretest Posttest Pages.pdf` },
  { name: 'Data Sheet', file: `${FD_DIR}/Data Sheet.pdf` },
]

// ── Language Therapy ──────────────────────────────────────────────────────────

const LT_DIR = 'CompleteSchoolAgeLanguageTherapyToolkitElementaryMiddleSchoolSpeech'

export const LANGUAGE_THERAPY = [
  { name: 'Systematic Sentence Combining', file: `${LT_DIR}/01 - Systematic Sentence Combining _ Syntax, Conjunctions, Grammar _ Speech Therapy.pdf` },
  { name: 'Summarizing Stories & Narratives', file: `${LT_DIR}/08 - Summarizing Stories _ Narratives in Speech Therapy _ Somebody Wanted But So Then.pdf` },
  { name: 'Answering WH Questions from Short Text', file: `${LT_DIR}/10 - Answering WH Questions From Short Text _ Comprehension _ Speech Language Therapy.pdf` },
  { name: 'Identifying Story Grammar Parts (Expansion)', file: `${LT_DIR}/11 - Identifying Story Grammar Parts in Narratives Expansion Pack for Speech Therapy.pdf` },
  { name: 'Identifying Story Grammar Parts', file: `${LT_DIR}/15 - Learning Identifying Story Grammar Parts in Narratives, Stories _ Speech Therapy.pdf` },
  { name: 'Sequencing for Story Retell (3–6 Steps)', file: `${LT_DIR}/16 - Sequencing for Story Retell in Speech Therapy _ Printable, Digital _ 3-6 Steps.pdf` },
  { name: 'Creating Narratives with Real Pictures', file: `${LT_DIR}/17 - Creating Narratives w_ Real Pictures _ Story Elements _ Speech Language Therapy.pdf` },
  { name: 'Digital Describing & Defining', file: `${LT_DIR}/20 - Digital Describing and Defining for Speech Therapy.pdf` },
  { name: 'Vocabulary Worksheets with Real Pictures', file: `${LT_DIR}/21 - Vocabulary Worksheets _ Real Pictures, One Sheet _ Speech Language Therapy.pdf` },
  { name: 'Prefix & Suffix Activities', file: `${LT_DIR}/23 - Prefix + Suffix Activities _ Affix, Morphology, Syntax, Vocab _ Speech Language.pdf` },
  { name: 'One Sheet Real Picture Describing', file: `${LT_DIR}/24 - One Sheet Real Picture Describing _ Printable, No Print _ Vocabulary, Language.pdf` },
  { name: 'Daily Phonological Awareness Questions', file: `${LT_DIR}/26 - Daily Phonological Awareness Questions and Reference Lists _ Speech Language.pdf` },
  { name: 'Early Describing & Categorizing', file: `${LT_DIR}/27 - Early Describing and Categorizing Packet _ Visuals _ Speech Language Therapy.pdf` },
]

// ── ABA Resource Bundles (dynamically loaded) ─────────────────────────────────

export const ABA_BUNDLES = [
  {
    id: 'allday',
    name: 'AllDay ABA Full Store',
    dir: 'AllDayABAFullStoreGrowingBundleSpeechandABATherapyActivitiesforAutism',
    color: '#646cff',
    count: 379,
  },
  {
    id: 'autism',
    name: 'AUTISM Mega Bundle',
    dir: 'AUTISM Full Store GROWING MEGA Bundle Speech Therapy ABA Activity for Autism',
    color: '#f87171',
    count: 272,
  },
  {
    id: 'wholestore',
    name: 'Whole Store ABA Bundle (DTT)',
    dir: 'WholeStoreGrowingABABundleAutismDTTAppliedBehaviorAnalysis',
    color: '#f59e0b',
    count: 289,
  },
  {
    id: 'superginormous',
    name: 'Super Ginormous Classroom Bundle',
    dir: 'SuperGinormousBundleofHelpfulStufftoSetUpandRunYourAutismClassroom',
    color: '#4ade80',
    count: 108,
  },
]

// ── Utility ───────────────────────────────────────────────────────────────────

export function cleanPdfName(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/^\d{1,3} - /, '')
    .replace(/^(\d+) /, '')
    .replace(/-1$/, '')
    .replace(/ _ /g, ' · ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
