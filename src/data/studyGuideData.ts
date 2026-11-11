export type ProblemStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Review Needed';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type DivisionType = 'Senior' | 'All';

export type ChapterId = 'ch9' | 'ch6' | 'ch7' | 'ch5' | 'ch8' | 'ch4' | 'ch2';

export type WeakAreaTag =
  | 'Morphosyntactic Alignment'
  | 'Pronoun Hierarchy'
  | 'Evidentiality'
  | 'Infixes & Transfixes'
  | 'Alienable vs. Inalienable Possession'
  | 'TAM (Tense, Aspect, Mood)';

export interface StudyProblem {
  id: number;
  exactName: string;
  alias?: string;
  sourceAndYear: string;
  pdfUrl: string;
  pdfLabel: string;
  division: DivisionType;
  difficulty: DifficultyLevel;
  chapterId: ChapterId;
  chapterNumber: number;
  scheduledDay: number;
  isMockPaper?: boolean;
  mockPaperName?: string;
  uniqueSkillTaught: string;
  chapterPlacementReason?: string;
  weakAreasTargeted: WeakAreaTag[];
}

export interface ChapterMeta {
  id: ChapterId;
  chapterNumber: number;
  priorityRank: number;
  title: string;
  shortTitle: string;
  problemCount: number;
  shareOfCorpus: string;
  whyIncluded: string;
  theorySections: {
    sectionCode: string;
    title: string;
    pages: string;
    keyTakeaway: string;
  }[];
}

export interface ScheduleDay {
  day: number;
  dateLabel: string;
  focusTitle: string;
  theoryReading: string;
  timeBreakdown: string;
  problemIds: number[];
  isMockExamDay: boolean;
  mockNote?: string;
}

export interface PatternLandscapeRow {
  rank: number;
  problemType: string;
  count: number;
  share: string;
  typicalDifficulty: string;
  yellowBookChapter: string;
  category: 'High-Frequency Core' | 'Medium-Frequency Anchor' | 'Wildcard';
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'ch9',
    chapterNumber: 9,
    priorityRank: 1,
    title: 'Chapter 9: Number Systems',
    shortTitle: 'Ch 9 · Number Systems',
    problemCount: 13,
    shareOfCorpus: '17.2% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Number systems offer the fastest, most deterministic marks in PLO Round 1 (~20% of historical papers). Mastering base-20/sub-base-5 structures, overcounting (Umbu-Ungu & Dzongkha), subtraction & exponentiation (Birom & Jowulu), body-part tallies, non-linear equations, and modular time reckoning locks in rapid full marks on exam day.',
    theorySections: [
      {
        sectionCode: '9.1',
        title: 'Introduction: Bases, Sub-bases, Orders & Carryovers',
        pages: 'pp. 321–326',
        keyTakeaway: 'Identify constituent order (multiplier × base + unit) and morphological linkers via digit-frequency analysis.'
      },
      {
        sectionCode: '9.2',
        title: 'Overcounting Systems',
        pages: 'pp. 326–329',
        keyTakeaway: 'Recognize "4 towards the 2nd twenty" (= 24, not 44) or fractional step overcounting (Dzongkha) by checking whether the multiplier increments one step early.'
      },
      {
        sectionCode: '9.3',
        title: 'Subtractive Systems',
        pages: 'pp. 329–331',
        keyTakeaway: 'Spot sudden morpheme changes at 8–9, 10–11 (Birom), or 15–19 signaling back-counting from the next threshold.'
      },
      {
        sectionCode: '9.4–9.5',
        title: 'Body-Part Counting & Time Reckoning',
        pages: 'pp. 331–335',
        keyTakeaway: 'Map anatomical symmetry axes (midpoint = nose/chest) and equatorial 6-hour clock offsets.'
      }
    ]
  },
  {
    id: 'ch6',
    chapterNumber: 6,
    priorityRank: 2,
    title: 'Chapter 6: Verb and Verb Phrase',
    shortTitle: 'Ch 6 · Verb & VP',
    problemCount: 15,
    shareOfCorpus: '18.2% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Directly targets four of your primary weak areas: TAM (hodiernal/hesternal/market-week tenses in Nooni & Mee), Pronoun Hierarchy (2>1>3 in Plains Cree and 1>2>3 in Hakhun), Evidentiality (witness, inferential, reportative, sensory), and non-concatenative pluractional infixation/gemination (Alabama).',
    theorySections: [
      {
        sectionCode: '6.1–6.3.4',
        title: 'Transitivity, Valency & TAM (Tense, Aspect, Mood)',
        pages: 'pp. 199–207',
        keyTakeaway: 'Distinguish hodiernal/hesternal/crastinal tense, perfective/imperfective/semelfactive aspect, and realis/irrealis/optative mood.'
      },
      {
        sectionCode: '6.3.5',
        title: 'Evidentiality Systems',
        pages: 'pp. 207–209',
        keyTakeaway: 'Separate information source (visual, non-visual sensory, inferential from traces, reportative/hearsay) from tense.'
      },
      {
        sectionCode: '6.4–6.7',
        title: 'Verb Templates & Pronoun Hierarchy',
        pages: 'pp. 209–218',
        keyTakeaway: 'In 1>2>3 (Hakhun) or 2>1>3 (Plains Cree) hierarchies, one person slot indexes the higher-ranked participant while a Direct/Inverse marker encodes direction of action.'
      },
      {
        sectionCode: '6.8',
        title: 'Verb Semantics, Pluractionality & Fluid-S Alignment',
        pages: 'pp. 218–221',
        keyTakeaway: 'Track causatives, middle/passive valency operations (Alabama), and active/stative (volitional vs. accidental) intransitive subject marking.'
      }
    ]
  },
  {
    id: 'ch7',
    chapterNumber: 7,
    priorityRank: 3,
    title: 'Chapter 7: Syntax',
    shortTitle: 'Ch 7 · Syntax',
    problemCount: 14,
    shareOfCorpus: '15.3% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Directly targets your #1 weak area—Morphosyntactic Alignment (Dyirbal ergative + antipassive pivot, Wambaya & Wiradjuri split ergativity, Dhivehi dative subjects)—plus Wackernagel 2nd-position clitics (Luiseño & Wambaya), irrealis V2 dislocation (Iquito), switch-reference (Amele), and Polish notation logic.',
    theorySections: [
      {
        sectionCode: '7.1–7.3',
        title: 'Word Order, V2 Dislocation & Focusing',
        pages: 'pp. 257–263',
        keyTakeaway: 'Correlate SOV/VSO with postpositions/prepositions, mood-conditioned V2 fronting (Iquito), and polarity-driven inversion (Epun).'
      },
      {
        sectionCode: '7.4',
        title: 'Morphosyntactic Alignment & Antipassive Voice',
        pages: 'pp. 263–266',
        keyTakeaway: 'Compare intransitive (S) with transitive agent (A) and patient (P): Nominative-Accusative (S=A≠P), Ergative-Absolutive (S=P≠A, plus Dyirbal antipassive -ŋay-).'
      },
      {
        sectionCode: '7.5',
        title: 'Split Alignment & Second-Position Clitics',
        pages: 'pp. 266–269',
        keyTakeaway: '1st/2nd pronouns favour accusative while common nouns favour ergative (Wiradjuri); Wackernagel auxiliary clusters attach after the first constituent (Wambaya, Luiseño).'
      }
    ]
  },
  {
    id: 'ch5',
    chapterNumber: 5,
    priorityRank: 4,
    title: 'Chapter 5: Noun and Noun Phrase',
    shortTitle: 'Ch 5 · Noun & NP',
    problemCount: 11,
    shareOfCorpus: '14.4% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Directly targets your weak areas in Alienable vs. Inalienable Possession (Fijian, Iaai, Nanti, Terêna), Infixes & Transfixes (Ulwa prosodic infixes, Terêna vowel-harmony infixes & nasal spread, Maltese broken plurals, Ilocano), multi-target classifiers (Kilivila), and Bantu noun classes.',
    theorySections: [
      {
        sectionCode: '5.1–5.2',
        title: 'Morpheme Types: Infix, Circumfix, Transfix & Autosegmental Spread',
        pages: 'pp. 145–151',
        keyTakeaway: 'Isolate discontinuous root consonants (Semitic C1-C2-C3 transfixes), prosodic infix landing sites (Ulwa), and autosegmental nasal/harmony spread (Terêna).'
      },
      {
        sectionCode: '5.3–5.6',
        title: 'Nominal Variables, Multi-Slot Classifiers & Reduplication',
        pages: 'pp. 151–164',
        keyTakeaway: 'Track Bantu singular/plural class pairs, multi-target sortal classifiers across NP constituents (Kilivila), and partial CV/CVC reduplication.'
      },
      {
        sectionCode: '5.7–5.8',
        title: 'Alienable vs. Inalienable Possession & Colour Hierarchy',
        pages: 'pp. 164–168',
        keyTakeaway: 'Inalienable nouns (kin, body parts) take direct affixes/infixes; alienable nouns and loanwords require possessive classifiers or helper roots.'
      }
    ]
  },
  {
    id: 'ch8',
    chapterNumber: 8,
    priorityRank: 5,
    title: 'Chapter 8: Semantics',
    shortTitle: 'Ch 8 · Semantics',
    problemCount: 9,
    shareOfCorpus: '11.5% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Covers metaphorical compounding networks (Basque, Kubeo, Karuk, Tlingit, Malagasy), NLP vector embeddings (Twisted Translations), plus two high-yield IOL semantic archetypes: topographical/riverine spatial deixis (Aralle-Tabulahan) and kinship exchange graphs (Komnzo).',
    theorySections: [
      {
        sectionCode: '8.1 & 10.1',
        title: 'Semantic Fields, Metaphorical Calques & Topographical Deixis',
        pages: 'pp. 299–302, 365–370',
        keyTakeaway: 'Recognize cross-linguistic calques ("eye of water" = spring) and riverine/elevation coordinate axes (upriver vs. downriver, uphill vs. downhill in Aralle-Tabulahan).'
      },
      {
        sectionCode: '8.2 & 10.2',
        title: 'The Graph Method for Gloss Matrices & Kinship Trees',
        pages: 'pp. 302–307, 371–377',
        keyTakeaway: 'Match nodes uniquely by degree sequences, cycle lengths, and symmetrical marriage/exchange cycles (Komnzo sister-exchange).'
      }
    ]
  },
  {
    id: 'ch4',
    chapterNumber: 4,
    priorityRank: 6,
    title: 'Chapter 4: Phonology',
    shortTitle: 'Ch 4 · Phonology',
    problemCount: 6,
    shareOfCorpus: '10.0% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Essential for dedicated phonology/prosody problems—including autosegmental High-tone mora counting (IOL 2025 Kuria), iterative iambic stress & gemination (IOL 2026 Central Yup’ik), Irish slender/broad orthography (GaeilGo), rule ordering (Valley Yokuts), and long-distance sibilant harmony (Barbareño).',
    theorySections: [
      {
        sectionCode: '3.2, 3.5 & 4.1–4.3',
        title: 'Articulatory Features, Tone Mora-Counting & Stress Windows',
        pages: 'pp. 49–58, 70–74, 91–96',
        keyTakeaway: 'Group sounds by natural classes, count moras for autosegmental tone targets (Kuria), and parse left-to-right iambic feet (Central Yup’ik).'
      },
      {
        sectionCode: '4.4–4.6',
        title: 'Assimilation, Dissimilation, Vowel Harmony & Rule Ordering',
        pages: 'pp. 96–107',
        keyTakeaway: 'Check feeding vs. bleeding rule order when vowel harmony, epenthesis, syncope, and sibilant/voicing dissimilation interact.'
      }
    ]
  },
  {
    id: 'ch2',
    chapterNumber: 2,
    priorityRank: 7,
    title: 'Chapter 2: Writing Systems',
    shortTitle: 'Ch 2 · Writing Systems',
    problemCount: 4,
    shareOfCorpus: '6.2% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Since you have already solved 5 script problems (Hmong Daw, Luwian, Aksara Sunda Kuna, Brahmi, Ire-Lined), these 4 problems cover the remaining Senior archetypes: 2D Braille matrices (Tenji), featural triangle blocks (Ditema tsa Dinoko), polyvalent abjad + Aramaic heterograms (IOL 2019 Book Pahlavi), and Old Persian cuneiform.',
    theorySections: [
      {
        sectionCode: '2.4, 2.7–2.9',
        title: 'Abjads, Heterograms (Ideograms), Syllabaries & Featural Systems',
        pages: 'pp. 15–24',
        keyTakeaway: 'Spot frozen Aramaic heterograms vs. polyvalent phonetic spellings (Book Pahlavi), featural stroke geometry (Ditema), and semi-alphabetic cuneiform.'
      },
      {
        sectionCode: '2.11',
        title: 'Braille & Compositional Matrix Scripts',
        pages: 'pp. 25–26',
        keyTakeaway: 'Decompose 6-dot cells into vowel sub-grids, consonant sub-grids, and spatial shift modifiers (voicing/palatalisation prefixes).'
      }
    ]
  }
];

export const PROBLEMS: StudyProblem[] = [
  // ================= PRIORITY 1: CHAPTER 9 (13 Problems) =================
  {
    id: 1,
    exactName: 'Problem 4: Divehi Numerals',
    sourceAndYear: 'PLO 2016 Round 1 (PLO_Easy_Problems.pdf, p. 33)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 33)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 1,
    uniqueSkillTaught:
      'Deciphering an Indo-Aryan decimal system with preserved duodecimal (base-12 dholhas) and vigesimal breaks using unit-morpheme frequency.',
    weakAreasTargeted: []
  },
  {
    id: 2,
    exactName: 'Problem 5: Bahinemo',
    sourceAndYear: 'PLO 2020 Round 1 (PLO_20\'_Senior_Junior.pdf, p. 8)',
    pdfUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf',
    pdfLabel: 'PLO_20\'_Senior_Junior.pdf (p. 8)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 1,
    uniqueSkillTaught:
      'Breaking into an ungrouped quinary/tally numeral system by tracking compound word length and additive linkers across unordered sets.',
    weakAreasTargeted: []
  },
  {
    id: 3,
    exactName: 'Problem 3: Cistercian Numerals',
    sourceAndYear: 'PLO 2021 Round 1 (PLO_21\'_Senior_Junior.pdf, p. 5)',
    pdfUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf',
    pdfLabel: 'PLO_21\'_Senior_Junior.pdf (p. 5)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 1,
    uniqueSkillTaught:
      'Decomposing 2D positional glyph quadrants (units, tens, hundreds, thousands) via rotation and reflection around a central vertical stave.',
    chapterPlacementReason:
      'Placed in Chapter 9 rather than Chapter 2 because the core mechanism is positional place-value encoding of 4-digit integers.',
    weakAreasTargeted: []
  },
  {
    id: 4,
    exactName: 'Problem #4: Telling Time in Swahili',
    alias: 'Yellow Book Problem 9.8 (Swahili)',
    sourceAndYear: 'PLO 2014 Round 1 (PLO_Easy_Problems.pdf, p. 11 / Yellow Book p. 335)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 11)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 1,
    uniqueSkillTaught:
      'Solving the 6-hour equatorial clock phase shift (where 7:00 AM is "hour 1") alongside additive and subtractive quarter/minute expressions.',
    weakAreasTargeted: []
  },
  {
    id: 5,
    exactName: 'IOL 2012 Problem #2: Umbu-Ungu',
    alias: 'Yellow Book Problem 9.4 (Umbu-Ungu, p. 327)',
    sourceAndYear: 'IOL 2012 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 52 / Yellow Book p. 327)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 52)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 1,
    uniqueSkillTaught:
      'Recognizing and formalizing overcounting ("towards the next group of 24, X units of 4") in a Papuan base-24 / sub-base-4 numeral system.',
    weakAreasTargeted: []
  },
  {
    id: 6,
    exactName: 'Problem 9.6 (Yoruba)',
    sourceAndYear: 'Yellow Book Ch 9 Worked Example (UKLO 2020, p. 330)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 330)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 1,
    uniqueSkillTaught:
      'Multi-tier subtractive arithmetic where vigesimal (base-20) multiples are modified simultaneously by "-5" and "-1 to -4" operations.',
    weakAreasTargeted: []
  },
  {
    id: 7,
    exactName: 'Problem 9.16 (Tifal)',
    alias: 'PLO Camp 26\' Problem 67. Tifal',
    sourceAndYear: 'Yellow Book Ch 9 Practice (MSK 2017, p. 355 / PLO_Camp_26\'.pdf, p. 44)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 355)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 2,
    uniqueSkillTaught:
      'Symmetrical body-part counting centered on the nose (14), distinguishing "other side of the body" markers in multi-person tallies above 27.',
    weakAreasTargeted: []
  },
  {
    id: 8,
    exactName: 'Problem No. 3 (20 Points): Bariai',
    alias: 'Bariai Squares',
    sourceAndYear: 'PLO 2017 Round 1 (PLO_Medium_Hard_Expert_Problems.pdf, p. 15)',
    pdfUrl: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf',
    pdfLabel: 'PLO_Medium_Hard_Expert_Problems.pdf (p. 15)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 2,
    uniqueSkillTaught:
      'Using quadratic growth (n² vs. n) and compound-length bounds to crack a quinary-decimal numeral system embedded in squaring equations.',
    weakAreasTargeted: []
  },
  {
    id: 9,
    exactName: 'IOL 2017 Problem 1: Birom',
    sourceAndYear: 'IOL 2017 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 91)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 91)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 2,
    uniqueSkillTaught:
      'Cracking a duodecimal (base-12) Plateau Niger-Congo numeral system with subtractive compounding at 10–11 (gwɛ̄) and exponentiation equations (a^b = c).',
    weakAreasTargeted: []
  },
  {
    id: 10,
    exactName: 'Problem 5: Esimbi',
    sourceAndYear: 'PLO 2021 Round 1 (PLO_21\'_Senior_Junior.pdf, p. 8)',
    pdfUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf',
    pdfLabel: 'PLO_21\'_Senior_Junior.pdf (p. 8)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 2,
    uniqueSkillTaught:
      'Exploiting multiplicative chains (a × b = c, b × c = d) and phonological vowel elision across compound boundaries in algebraic equations.',
    weakAreasTargeted: []
  },
  {
    id: 11,
    exactName: 'Problem 9.15 (Chabu)',
    sourceAndYear: 'Yellow Book Ch 9 Practice (UkrLO 2018, p. 354)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 354)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 2,
    uniqueSkillTaught:
      'Meta-mathematical number puzzles where the data states divisor counts and multiple relationships in prose rather than standard + / - symbols.',
    weakAreasTargeted: []
  },
  {
    id: 12,
    exactName: 'IOL 2025 Problem 1: Dzongkha Numerals',
    sourceAndYear: 'IOL 2025 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 155)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 155)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 2,
    uniqueSkillTaught:
      'Aligning two parallel numeral registers in the same language: System A (vigesimal base-20 with fractional 1/2 and 3/4 step overcounting) vs. System B (decimal contraction).',
    weakAreasTargeted: []
  },
  {
    id: 13,
    exactName: '1. Jowulu',
    sourceAndYear: 'PLO 2024 Round 1 (PLO_24\'_Senior.pdf, p. 2)',
    pdfUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf',
    pdfLabel: 'PLO_24\'_Senior.pdf (p. 2)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch9',
    chapterNumber: 9,
    scheduledDay: 16,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 3 (PLO 2024 Senior)',
    uniqueSkillTaught:
      'Identifying exponentiation (a^b) alongside addition, subtraction, and multiplication in equations with tonal sandhi on compound numerals.',
    weakAreasTargeted: []
  },

  // ================= PRIORITY 2: CHAPTER 6 (15 Problems) =================
  {
    id: 14,
    exactName: 'Problem no 3. Simte Verbs',
    sourceAndYear: 'PLO 2013 Round 1 (PLO_Easy_Problems.pdf, p. 8)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 8)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 3,
    uniqueSkillTaught:
      'Rapidly separating proclitic subject agreement from post-verbal tense/aspect particles and copular predication in Kuki-Chin.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)']
  },
  {
    id: 15,
    exactName: 'Problem #4: Turkish News and Conversations',
    sourceAndYear: 'PLO 2015 Round 1 (PLO_Easy_Problems.pdf, p. 9 & p. 30)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 9 & 30)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 3,
    uniqueSkillTaught:
      'Pragmatic deduction of direct witness (-DI) vs. indirect/hearsay reportative (-mIş) evidentiality from conversational context and news sourcing.',
    weakAreasTargeted: ['Evidentiality', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 16,
    exactName: '3. The Matses Hunter Boy',
    sourceAndYear: 'PLO 2018 Round 1 (PLO_Easy_Problems.pdf, p. 3)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 3)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 3,
    uniqueSkillTaught:
      'Two-dimensional evidentiality fused with temporal distance (direct experience, inferential evidence from physical traces, and conjecture across recent vs. distant past).',
    weakAreasTargeted: ['Evidentiality', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 17,
    exactName: 'Problem no 3. Tangkhul Verbs',
    alias: 'Akham goes Shopping',
    sourceAndYear: 'PLO 2013 Round 1 (PLO_Medium_Hard_Expert_Problems.pdf, p. 3 / PLO_Easy_Problems.pdf, p. 5)',
    pdfUrl: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf',
    pdfLabel: 'PLO_Medium_Hard_Expert_Problems.pdf (p. 3)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 3,
    uniqueSkillTaught:
      'Agglutinative TAM slot ordering (future, permissive/hortative, desiderative, negative capability, and deictic motion) applied to dialogue completion.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)']
  },
  {
    id: 18,
    exactName: 'Problem 6.8 (Tariana)',
    sourceAndYear: 'Yellow Book Ch 6 Practice (ČLO 2019, p. 227)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 227)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 3,
    uniqueSkillTaught:
      'Formal 4-way grammatical evidentiality (visual, non-visual sensory, inferential, reportative) crossed with tense in an Amazonian verb template.',
    weakAreasTargeted: ['Evidentiality', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 19,
    exactName: 'Problem 6.4 (Itelmen)',
    sourceAndYear: 'Yellow Book Ch 6 Worked Example (MSK 1998, p. 214)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 214)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 4,
    uniqueSkillTaught:
      'TAM-conditioned split subject/object indexing, where the verb prefix tracks the subject in one tense/mood set and switches paradigm in another.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)', 'Morphosyntactic Alignment']
  },
  {
    id: 20,
    exactName: 'IOL 2023 Problem 4: Plains Cree',
    alias: 'Replaces short Proto-Algonquian snippet with full IOL Direct/Inverse problem',
    sourceAndYear: 'IOL 2023 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 139)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 139)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 4,
    uniqueSkillTaught:
      'Mastering the Algonquian 2 > 1 > 3 pronoun hierarchy, Direct (-aa/-e) vs. Inverse (-ikw) theme signs, and Independent vs. Conjunct clause verb orders.',
    weakAreasTargeted: ['Pronoun Hierarchy', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 21,
    exactName: 'Problem 6.6 (Tabasaran)',
    sourceAndYear: 'Yellow Book Ch 6 Worked Example (MSK 1998, p. 219)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 219)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 4,
    uniqueSkillTaught:
      'Fluid-S (active/stative) alignment driven by volition, where intransitive subjects take ergative marking when acting intentionally and absolutive when accidental.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 22,
    exactName: 'Problem No. 4 (25 Points): Tiwa',
    sourceAndYear: 'PLO Round 1 (PLO_Easy_Problems.pdf, p. 10)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 10)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 4,
    uniqueSkillTaught:
      'Polysynthetic noun incorporation, where direct objects and possessors fuse inside the portmanteau person/number/noun-class verb prefix complex.',
    weakAreasTargeted: ['Pronoun Hierarchy', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 23,
    exactName: 'IOL 2019 Problem 5: Nooni',
    sourceAndYear: 'IOL 2019 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 105)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 105)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 4,
    uniqueSkillTaught:
      'Untangling a multi-tiered Bantoid temporal distance system (hodiernal, near past/future, distant past/future, and progressive/perfective) anchored to an 8-day market week.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)']
  },
  {
    id: 24,
    exactName: 'Problem 6.10 (Gyarung)',
    sourceAndYear: 'Yellow Book Ch 6 Practice (MSK 1998, p. 229)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 229)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 5,
    uniqueSkillTaught:
      'Pronoun hierarchy with summative number marking, where dual/plural suffixes encode the combined number of participants rather than subject or object alone.',
    weakAreasTargeted: ['Pronoun Hierarchy']
  },
  {
    id: 25,
    exactName: 'IOL 2018 Problem 2: Hakhun',
    alias: 'Yellow Book Problem 6.11 (Hakhun, p. 230)',
    sourceAndYear: 'IOL 2018 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 97 / Yellow Book p. 230)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 97)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 5,
    uniqueSkillTaught:
      '1 > 2 > 3 hierarchical agreement interacting simultaneously with past vs. present tense and affirmative vs. negative polarity portmanteaus.',
    weakAreasTargeted: ['Pronoun Hierarchy', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 26,
    exactName: 'IOL 2022 Problem 2: Alabama',
    sourceAndYear: 'IOL 2022 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 124)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 124)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 5,
    uniqueSkillTaught:
      'Non-concatenative internal consonant gemination and syllable infixation encoding verbal pluractionality and middle/passive valency operations in Muskogean.',
    weakAreasTargeted: ['Infixes & Transfixes', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 27,
    exactName: 'Problem 6.13 (Ainu)',
    alias: 'PLO Camp 26\' Problem 40. Ainu',
    sourceAndYear: 'Yellow Book Ch 6 Practice (RoLO 2021, p. 233 / PLO_Camp_26\'.pdf, p. 25)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 233)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 5,
    uniqueSkillTaught:
      'Ergative verbal pluractionality (where the verb stem itself changes for plural S and plural P) combined with causative, reflexive, intensifier, and mitigator affixes.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 28,
    exactName: 'Problem 44. Mee',
    sourceAndYear: 'PLO Camp 2026 (PLO_Camp_26\'.pdf, p. 28 — IOL 2021)',
    pdfUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf',
    pdfLabel: 'PLO_Camp_26\'.pdf (p. 28)',
    division: 'Senior',
    difficulty: 'Expert',
    chapterId: 'ch6',
    chapterNumber: 6,
    scheduledDay: 5,
    uniqueSkillTaught:
      'Multi-layered hodiernal (today\'s past) vs. distant past tense, aspect, and bi-personal object/subject inflection with morphophonemic stem alternations.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)']
  },

  // ================= PRIORITY 3: CHAPTER 7 (14 Problems) =================
  {
    id: 29,
    exactName: '5. Kurmali',
    sourceAndYear: 'PLO 2018 Round 1 (PLO_Easy_Problems.pdf, p. 16)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 16)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 6,
    uniqueSkillTaught:
      'Clean SOV ditransitive case alignment and differential object marking combined with verb agreement in an eastern Indo-Aryan language.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 30,
    exactName: 'Problem 2: Kholosi',
    sourceAndYear: 'PLO 2021 Round 1 (PLO_21\'_Senior_Junior.pdf, p. 4)',
    pdfUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf',
    pdfLabel: 'PLO_21\'_Senior_Junior.pdf (p. 4)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 6,
    uniqueSkillTaught:
      'Separating enclitic pronominal argument markers from postpositions and aspectual stems in an endangered Indo-Iranian SOV clause structure.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 31,
    exactName: 'Problem 7.2 (Morphosyntactic alignments)',
    sourceAndYear: 'Yellow Book Ch 7 Worked Example (RoLO 2016: Dyirbal, Tahitian, Nez-Perce, Wappo, p. 265)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 265)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 6,
    uniqueSkillTaught:
      'The definitive diagnostic grid for distinguishing Nominative-Accusative, Ergative-Absolutive, Tripartite (S ≠ A ≠ P), and Direct alignments side-by-side.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 32,
    exactName: 'Problem 1: A Polished Weather Forecast',
    sourceAndYear: 'PLO 2021 Round 1 (PLO_21\'_Senior_Junior.pdf, p. 2 / PLO_Medium_Hard_Expert_Problems.pdf, p. 1)',
    pdfUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf',
    pdfLabel: 'PLO_21\'_Senior_Junior.pdf (p. 2)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 6,
    uniqueSkillTaught:
      'Parsing bracket-free Polish (prefix) formal logic notation by tracking operator arity (unary vs. binary connectives)—the #1 formal-grammar wildcard in PLO.',
    chapterPlacementReason:
      'Placed in Chapter 7 because operator-argument constituency and scope tree parsing are fundamentally syntactic.',
    weakAreasTargeted: []
  },
  {
    id: 33,
    exactName: 'Problem 6: Altai-ed up',
    sourceAndYear: 'PLO 2020 Round 1 (PLO_20\'_Senior_Junior.pdf, p. 9)',
    pdfUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf',
    pdfLabel: 'PLO_20\'_Senior_Junior.pdf (p. 9)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 6,
    uniqueSkillTaught:
      'SOV case/possessive stacking and participial clause ordering in Altai where every suffix undergoes 2-dimensional (backness + rounding) vowel harmony.',
    chapterPlacementReason:
      'Placed in Chapter 7 rather than Chapter 4 because constituent case syntax is the primary frame while vowel harmony governs suffix allomorphy.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 34,
    exactName: 'Problem 5: Dhivehi',
    sourceAndYear: 'PLO 2022 Round 1 (PLO_26\'_Senior_Junior.pdf [2022 paper], p. 9)',
    pdfUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf',
    pdfLabel: 'PLO_26\'_Senior_Junior.pdf [2022] (p. 9)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 14,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 1 (PLO 2022 Round 1)',
    uniqueSkillTaught:
      'Volitional vs. involuntary/accidental syntax, where changing the verb to the involuntary stem flips the agent into the dative case and alters TAM marking.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 35,
    exactName: '3. Icari Dargwa',
    sourceAndYear: 'PLO 2023 Round 1 (PLO_23\'_Senior.pdf, p. 5 — 12-sentence Senior version)',
    pdfUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf',
    pdfLabel: 'PLO_23\'_Senior.pdf (p. 5)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 15,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 2 (PLO 2023 Senior)',
    uniqueSkillTaught:
      'Ergative-absolutive nominal case (where S and P are unmarked absolutive and A takes ergative) paired with 1st/2nd > 3rd person hierarchical verb agreement.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'Pronoun Hierarchy', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 36,
    exactName: '4. Epun',
    sourceAndYear: 'PLO 2023 Round 1 (PLO_23\'_Senior.pdf, p. 7 — 14-sentence Senior version)',
    pdfUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf',
    pdfLabel: 'PLO_23\'_Senior.pdf (p. 7)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 15,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 2 (PLO 2023 Senior)',
    uniqueSkillTaught:
      'Polarity-conditioned word-order inversion (OVS in affirmative clauses vs. SVO in negative clauses), ergative-absolutive determiners, and wh-question fronting.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 37,
    exactName: '4. Wiradjuri',
    sourceAndYear: 'PLO 2024 Round 1 (PLO_24\'_Senior.pdf, p. 5)',
    pdfUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf',
    pdfLabel: 'PLO_24\'_Senior.pdf (p. 5)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 16,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 3 (PLO 2024 Senior)',
    uniqueSkillTaught:
      'Classic NP-based split ergativity (full nouns follow an ergative-absolutive pattern while 1st/2nd person pronouns follow a nominative-accusative pattern), plus passive voice.',
    chapterPlacementReason:
      'Placed in Chapter 7 because split ergative case alignment and passive voice argument demotion are clause-level syntax.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 38,
    exactName: 'Problem 7.3 (Luiseño)',
    sourceAndYear: 'Yellow Book Ch 7 Practice (UKLO 2012, p. 272)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 272)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 7,
    uniqueSkillTaught:
      'Wackernagel\'s Law (second-position clitic clusters) for tense/evidentiality/person and unspaced word-boundary segmentation in flexible word-order syntax.',
    weakAreasTargeted: ['Evidentiality', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 39,
    exactName: 'IOL 2012 Problem #1: Dyirbal',
    sourceAndYear: 'IOL 2012 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 50)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 50)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 7,
    uniqueSkillTaught:
      'The gold-standard Ergative-Absolutive syntax problem: syntactic ergativity, antipassive voice (-ŋay-) for clause coordination, and 4 semantically rich noun classes.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 40,
    exactName: 'IOL 2015 Problem 4: Wambaya',
    sourceAndYear: 'IOL 2015 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 78)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 78)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 7,
    uniqueSkillTaught:
      'Combining Australian ergative case/gender concord with a mandatory Wackernagel second-position auxiliary clitic cluster encoding subject, object, direction, and tense.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 41,
    exactName: 'IOL 2026 Problem 3: Iquito',
    sourceAndYear: 'IOL 2026 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 175)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 175)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 7,
    uniqueSkillTaught:
      'Mood-driven word order: Realis SVO vs. Irrealis V2 syntax where an object or postpositional phrase must front before the verb to satisfy an irrealis template.',
    weakAreasTargeted: ['Morphosyntactic Alignment', 'TAM (Tense, Aspect, Mood)']
  },
  {
    id: 42,
    exactName: 'Problem 52. Amele',
    sourceAndYear: 'PLO Camp 2026 (PLO_Camp_26\'.pdf, p. 34 — IOL 2016)',
    pdfUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf',
    pdfLabel: 'PLO_Camp_26\'.pdf (p. 34)',
    division: 'Senior',
    difficulty: 'Expert',
    chapterId: 'ch7',
    chapterNumber: 7,
    scheduledDay: 7,
    uniqueSkillTaught:
      'Switch-reference clause chaining (medial verbs marking Same-Subject vs. Different-Subject for the following clause) and simultaneous vs. sequential event syntax.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)']
  },

  // ================= PRIORITY 4: CHAPTER 5 (11 Problems) =================
  {
    id: 43,
    exactName: 'Problem 1: Estonian Word Forms',
    sourceAndYear: 'PLO 2020 Round 1 (PLO_20\'_Senior_Junior.pdf, p. 2)',
    pdfUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf',
    pdfLabel: 'PLO_20\'_Senior_Junior.pdf (p. 2)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 8,
    uniqueSkillTaught:
      'Recursive derivational morphology (agentive, instrumental, abstract state, diminutive, and adjectival suffixes) and stem-vowel truncation rules.',
    weakAreasTargeted: []
  },
  {
    id: 44,
    exactName: 'Problem 5.6 (Fijian)',
    sourceAndYear: 'Yellow Book Ch 5 Worked Example (UKLO 2018, p. 165)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 165)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 8,
    uniqueSkillTaught:
      'The three-way Oceanic possession system: inalienable direct suffixation (body parts/kin) vs. alienable possession split into edible (ke-), drinkable (me-), and general (no-) classifiers.',
    weakAreasTargeted: ['Alienable vs. Inalienable Possession']
  },
  {
    id: 45,
    exactName: 'IOL 2021 Problem 3: Kilivila',
    alias: 'Replaces Sixteen Japanese Phrases with multi-slot IOL classifier concord',
    sourceAndYear: 'IOL 2021 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 115)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 115)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 8,
    uniqueSkillTaught:
      'Multi-target sortal numeral classifiers in Oceanic, where the exact same semantic classifier stem infixes/prefixes into numerals, demonstratives, and adjectives alike.',
    weakAreasTargeted: []
  },
  {
    id: 46,
    exactName: 'Problem 5.9 (Ulwa)',
    sourceAndYear: 'Yellow Book Ch 5 Practice (TurLom 2003, p. 174)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 174)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 8,
    uniqueSkillTaught:
      'Prosodically anchored possessive infixes vs. suffixes, where the possessive marker infixes immediately after the first iambic foot / heavy syllable of the noun stem.',
    weakAreasTargeted: ['Infixes & Transfixes', 'Alienable vs. Inalienable Possession']
  },
  {
    id: 47,
    exactName: 'Problem 5.13 (Maltese)',
    sourceAndYear: 'Yellow Book Ch 5 Practice (LLO 2020, p. 178)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 178)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 8,
    uniqueSkillTaught:
      'Semitic non-concatenative root-and-pattern transfixes (broken plurals) interacting with Berlin & Kay colour-hierarchy loanword invariance.',
    chapterPlacementReason:
      'Placed in Chapter 5 because broken plural transfixation and adjectival number agreement are nominal morphology.',
    weakAreasTargeted: ['Infixes & Transfixes']
  },
  {
    id: 48,
    exactName: 'Problem 5.15 (Ilocano)',
    sourceAndYear: 'Yellow Book Ch 5 Practice (NACLO 2008, p. 180)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 180)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 9,
    uniqueSkillTaught:
      'CVC partial reduplication for plurals and verbal actor-focus infixation (-um-) paired with Baybayin abugida script transcription.',
    chapterPlacementReason:
      'Placed in Chapter 5 because Austronesian infixation and partial reduplication are the primary morphological mechanisms.',
    weakAreasTargeted: ['Infixes & Transfixes']
  },
  {
    id: 49,
    exactName: 'IOL 2018 Problem 3: Terêna',
    sourceAndYear: 'IOL 2018 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 98)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 98)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 9,
    uniqueSkillTaught:
      'Autosegmental 1st-person nasal spread (which nasalises vowels/sonorants until blocked and prenasalised by a voiceless stop/fricative) vs. 2nd-person vowel-harmony infixation and alienable loanword possession.',
    weakAreasTargeted: ['Infixes & Transfixes', 'Alienable vs. Inalienable Possession']
  },
  {
    id: 50,
    exactName: '1. Nanti',
    sourceAndYear: 'PLO 2023 Round 1 (PLO_23\'_Senior.pdf, p. 2 — Senior version with Assignment 3)',
    pdfUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf',
    pdfLabel: 'PLO_23\'_Senior.pdf (p. 2)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 15,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 2 (PLO 2023 Senior)',
    uniqueSkillTaught:
      'Alienable vs. inalienable possession with prefix nasal-place assimilation, voice assimilation, and diachronic socio-cultural shifts (why "land" shifted from inalienable to alienable).',
    weakAreasTargeted: ['Alienable vs. Inalienable Possession']
  },
  {
    id: 51,
    exactName: '2. Romanian',
    sourceAndYear: 'PLO 2023 Round 1 (PLO_23\'_Senior.pdf, p. 3)',
    pdfUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf',
    pdfLabel: 'PLO_23\'_Senior.pdf (p. 3)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 15,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 2 (PLO 2023 Senior)',
    uniqueSkillTaught:
      'Enclitic definite articles that jump onto fronted adjectives, 2-case × 2-gender × 2-number concord, and the possessive/genitive article (al/a/ai/ale) agreeing with the possessed head noun.',
    weakAreasTargeted: []
  },
  {
    id: 52,
    exactName: '5. When it clicks…',
    alias: 'Xhosa Noun Classes',
    sourceAndYear: 'PLO 2024 Round 1 (PLO_24\'_Senior.pdf, p. 7)',
    pdfUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf',
    pdfLabel: 'PLO_24\'_Senior.pdf (p. 7)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 16,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 3 (PLO 2024 Senior)',
    uniqueSkillTaught:
      'Bantu noun class singular/plural pairings and multi-morpheme numeral concord prefixes with vowel coalescence and click-consonant phonology.',
    weakAreasTargeted: []
  },
  {
    id: 53,
    exactName: 'Problem 5.17 (Iaai)',
    sourceAndYear: 'Yellow Book Ch 5 Practice (APLO 2020, p. 183)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 183)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch5',
    chapterNumber: 5,
    scheduledDay: 9,
    uniqueSkillTaught:
      'Fine-grained Melanesian possession classification (distinguishing body parts, kin across generations, food, drinks, chewing items, plants, animals, and shelter) with stem vowel mutations.',
    weakAreasTargeted: ['Alienable vs. Inalienable Possession']
  },

  // ================= PRIORITY 5: CHAPTER 8 (9 Problems) =================
  {
    id: 54,
    exactName: 'Problem No. 1 (20 Points): Basque',
    alias: 'Yellow Book Problem 8.3 (Basque)',
    sourceAndYear: 'PLO Round 1 (PLO_Easy_Problems.pdf, p. 36 / Yellow Book p. 308)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 36)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 9,
    uniqueSkillTaught:
      'Constructing a bipartite morpheme-connection graph (roots × derivational suffixes for place -tegi, tool -gailu, group -talde, companion -kide, keeper -zain) to solve an unordered matrix without guessing.',
    weakAreasTargeted: []
  },
  {
    id: 55,
    exactName: 'Problem 1: miks salat',
    sourceAndYear: 'PLO 2022 Round 1 (PLO_26\'_Senior_Junior.pdf [2022 paper], p. 2)',
    pdfUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf',
    pdfLabel: 'PLO_26\'_Senior_Junior.pdf [2022] (p. 2)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 14,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 1 (PLO 2022 Round 1)',
    uniqueSkillTaught:
      'Comparative creole lexical semantics and calquing across Nigerian Pidgin (Naijá) and Tok Pisin ("eye-water" = tear, "grass belong head" = hair).',
    weakAreasTargeted: []
  },
  {
    id: 56,
    exactName: 'IOL 2016 Problem 1: Aralle-Tabulahan',
    sourceAndYear: 'IOL 2016 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 85)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 85)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 9,
    uniqueSkillTaught:
      'Topographical and riverine spatial deixis (upriver vs. downriver, uphill vs. downhill, and level/across-stream motion verbs) used to reconstruct a 9-village elevation map.',
    weakAreasTargeted: []
  },
  {
    id: 57,
    exactName: 'Problem 4: Kubeo',
    sourceAndYear: 'PLO 2021 Round 1 (PLO_21\'_Senior_Junior.pdf, p. 7)',
    pdfUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf',
    pdfLabel: 'PLO_21\'_Senior_Junior.pdf (p. 7)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 10,
    uniqueSkillTaught:
      'Combining shape/material noun-classifier suffixes (spherical, hollow, tree/wood, filamentous, liquid) with metaphorical compound heads in an Amazonian lexicon.',
    weakAreasTargeted: []
  },
  {
    id: 58,
    exactName: 'Problem 4: Karuk',
    sourceAndYear: 'PLO 2022 Round 1 (PLO_26\'_Senior_Junior.pdf [2022 paper], p. 7)',
    pdfUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf',
    pdfLabel: 'PLO_26\'_Senior_Junior.pdf [2022] (p. 7)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 14,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 1 (PLO 2022 Round 1)',
    uniqueSkillTaught:
      'Cross-domain semantic compounding linking animal metaphors, months of the year, and body-part numerals into a single integrated lexical network.',
    weakAreasTargeted: []
  },
  {
    id: 59,
    exactName: '3. Singing it in Tlingit',
    sourceAndYear: 'PLO 2024 Round 1 (PLO_24\'_Senior.pdf, p. 4)',
    pdfUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf',
    pdfLabel: 'PLO_24\'_Senior.pdf (p. 4)',
    division: 'Senior',
    difficulty: 'Medium',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 16,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 3 (PLO 2024 Senior)',
    uniqueSkillTaught:
      'Decomposing multi-word descriptive compounds and anatomical/technological metaphors in Tlingit ("ear-ring", "foot-cousin", "mouth-hair").',
    weakAreasTargeted: []
  },
  {
    id: 60,
    exactName: 'Problem No. 6 (25 Points): Malagasy',
    alias: 'Cheesy Malagasy / Yellow Book Problem 8.8 (Malagasy)',
    sourceAndYear: 'PLO Round 1 (PLO_Medium_Hard_Expert_Problems.pdf, p. 10 / Yellow Book p. 313)',
    pdfUrl: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf',
    pdfLabel: 'PLO_Medium_Hard_Expert_Problems.pdf (p. 10)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 10,
    uniqueSkillTaught:
      'Multi-part idiomatic compound phrases where literal constituent meanings ("sun\'s eye", "water\'s child", "frog\'s thigh") map simultaneously to figurative glosses and possession rules.',
    weakAreasTargeted: []
  },
  {
    id: 61,
    exactName: 'IOL 2024 Problem 3: Komnzo Kinship',
    sourceAndYear: 'IOL 2024 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 144)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 144)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 10,
    uniqueSkillTaught:
      'Solving a Papuan direct sister-exchange marriage kinship system where maternal and paternal cross-cousin/in-law terms merge symmetrically alongside ergative/possessive cases.',
    weakAreasTargeted: ['Morphosyntactic Alignment']
  },
  {
    id: 62,
    exactName: 'Problem 7: Twisted Translations',
    alias: 'PLO Camp 26\' Problem 64. Word Embeddings (PLO, 2020)',
    sourceAndYear: 'PLO 2020 Round 1 (PLO_20\'_Senior_Junior.pdf, p. 10 / PLO_Camp_26\'.pdf, p. 41)',
    pdfUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf',
    pdfLabel: 'PLO_20\'_Senior_Junior.pdf (p. 10)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch8',
    chapterNumber: 8,
    scheduledDay: 10,
    uniqueSkillTaught:
      'Solving an NLP vector-space / distributional semantics wildcard using semantic proximity clues and morphological paradigms to align an obfuscated Hrangkhol corpus.',
    weakAreasTargeted: []
  },

  // ================= PRIORITY 6: CHAPTER 4 (6 Problems) =================
  {
    id: 63,
    exactName: 'Problem #5: Japanese Compound Words',
    sourceAndYear: 'PLO 2015 Round 1 (PLO_Easy_Problems.pdf, p. 5)',
    pdfUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf',
    pdfLabel: 'PLO_Easy_Problems.pdf (p. 5)',
    division: 'Senior',
    difficulty: 'Easy',
    chapterId: 'ch4',
    chapterNumber: 4,
    scheduledDay: 11,
    uniqueSkillTaught:
      'Rendaku (sequential voicing) in compounds blocked by Lyman\'s Law (long-distance voicing dissimilation when the second root contains a voiced obstruent) and branching constituent trees.',
    weakAreasTargeted: []
  },
  {
    id: 64,
    exactName: 'Problem 4.4 (Valley Yokuts)',
    sourceAndYear: 'Yellow Book Ch 4 Worked Example (RoLO 2019, p. 101)',
    pdfUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf',
    pdfLabel: 'Yellow_Book.pdf (p. 101)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch4',
    chapterNumber: 4,
    scheduledDay: 11,
    uniqueSkillTaught:
      'Strict phonological rule ordering (feeding/bleeding) across height-conditioned rounding vowel harmony, vowel epenthesis in CCC clusters, and closed-syllable vowel shortening.',
    weakAreasTargeted: []
  },
  {
    id: 65,
    exactName: 'IOL 2025 Problem 3: Kuria',
    sourceAndYear: 'IOL 2025 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 157)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 157)',
    division: 'All',
    difficulty: 'Hard',
    chapterId: 'ch4',
    chapterNumber: 4,
    scheduledDay: 11,
    uniqueSkillTaught:
      'Autosegmental High-tone mora counting in Bantu verb TAM: determining which tense/aspect prefix assigns a High tone to the 1st, 3rd, or 4th mora of the macrostem with bounded tone spreading.',
    weakAreasTargeted: ['TAM (Tense, Aspect, Mood)']
  },
  {
    id: 66,
    exactName: '2. GaeilGo Doesn’t Go',
    sourceAndYear: 'PLO 2024 Round 1 (PLO_24\'_Senior.pdf, p. 3)',
    pdfUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf',
    pdfLabel: 'PLO_24\'_Senior.pdf (p. 3)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch4',
    chapterNumber: 4,
    scheduledDay: 16,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 3 (PLO 2024 Senior)',
    uniqueSkillTaught:
      'Deriving bidirectional orthography-to-IPA rules for Irish palatalised ("slender" /Cʲ/) vs. velarised ("broad" /Cˠ/) consonants and silent orthographic vowel markers.',
    weakAreasTargeted: []
  },
  {
    id: 67,
    exactName: 'IOL 2026 Problem 1: Central Yup’ik',
    sourceAndYear: 'IOL 2026 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 171)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 171)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch4',
    chapterNumber: 4,
    scheduledDay: 11,
    uniqueSkillTaught:
      'Iterative left-to-right iambic stress assignment, rhythmic vowel lengthening, onset gemination before CVV syllables, and Norton Sound vs. General Central Yup’ik consonant assimilation.',
    weakAreasTargeted: []
  },
  {
    id: 68,
    exactName: 'Problem 12. Barbareño',
    sourceAndYear: 'PLO Camp 2026 (PLO_Camp_26\'.pdf, p. 8 — IOL 2018)',
    pdfUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf',
    pdfLabel: 'PLO_Camp_26\'.pdf (p. 8)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch4',
    chapterNumber: 4,
    scheduledDay: 11,
    uniqueSkillTaught:
      'Long-distance regressive sibilant harmony (s vs. š), glottalization, vowel syncope, and CVC reduplication / infixation interacting across multiple prefix slots.',
    weakAreasTargeted: ['Infixes & Transfixes']
  },

  // ================= PRIORITY 7: CHAPTER 2 (4 Problems) =================
  {
    id: 69,
    exactName: 'Problem 3: Tenji Braille',
    alias: 'Compare Yellow Book Problem 2.4 (Japanese Braille)',
    sourceAndYear: 'PLO 2020 Round 1 (PLO_20\'_Senior_Junior.pdf, p. 5)',
    pdfUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf',
    pdfLabel: 'PLO_20\'_Senior_Junior.pdf (p. 5)',
    division: 'All',
    difficulty: 'Easy',
    chapterId: 'ch2',
    chapterNumber: 2,
    scheduledDay: 12,
    uniqueSkillTaught:
      'Compositional 2D matrix encoding in Japanese Braille, where vowel dot-patterns (top-left) and consonant dot-patterns (bottom-right) combine with spatial shifts for yōon palatalisation and dakuten voicing.',
    weakAreasTargeted: []
  },
  {
    id: 70,
    exactName: 'Problem 78. Ditema tsa Dinoko',
    alias: 'PLO 2017 Triangle Script',
    sourceAndYear: 'PLO Camp 2026 (PLO_Camp_26\'.pdf, p. 51 — PLO 2017 Round 1)',
    pdfUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf',
    pdfLabel: 'PLO_Camp_26\'.pdf (p. 51)',
    division: 'All',
    difficulty: 'Medium',
    chapterId: 'ch2',
    chapterNumber: 2,
    scheduledDay: 12,
    uniqueSkillTaught:
      'Featural syllable blocks where triangle apex orientation encodes vowel quality and internal/external line strokes systematically encode consonant place, manner, voicing, and prenasalisation.',
    weakAreasTargeted: []
  },
  {
    id: 71,
    exactName: 'IOL 2019 Problem 3: Book Pahlavi (Middle Persian)',
    sourceAndYear: 'IOL 2019 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 103)',
    pdfUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf',
    pdfLabel: 'IOL_2003-2026_Individual_Problems.pdf (p. 103)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch2',
    chapterNumber: 2,
    scheduledDay: 12,
    uniqueSkillTaught:
      'Deciphering a right-to-left polyvalent consonantal abjad (where single glyphs merged multiple Aramaic letters) alongside frozen Aramaic heterograms (ideograms) read as Persian words.',
    weakAreasTargeted: []
  },
  {
    id: 72,
    exactName: '5. Old Persian',
    sourceAndYear: 'PLO 2023 Round 1 (PLO_23\'_Senior.pdf, p. 9)',
    pdfUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf',
    pdfLabel: 'PLO_23\'_Senior.pdf (p. 9)',
    division: 'Senior',
    difficulty: 'Hard',
    chapterId: 'ch2',
    chapterNumber: 2,
    scheduledDay: 15,
    isMockPaper: true,
    mockPaperName: 'Mock Paper 2 (PLO 2023 Senior)',
    uniqueSkillTaught:
      'Combining semi-alphabetic cuneiform decipherment (where consonant signs depend on following vowels /a, i, u/) with Achaemenid royal family tree reconstruction and genitive case inflection.',
    weakAreasTargeted: []
  }
];

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    day: 1,
    dateLabel: 'Fri, 13 Nov 2026',
    focusTitle: 'Ch 1 Intro + Ch 9: Number Systems (Part 1 — Bases, Overcounting & Subtraction)',
    theoryReading: 'Yellow Book Ch 1 (1.4–1.5, pp. 5–10) & Ch 9 (9.1–9.5, pp. 321–335)',
    timeBreakdown: '1.0h Theory + 3.0h Problems (6)',
    problemIds: [1, 2, 3, 4, 5, 6],
    isMockExamDay: false
  },
  {
    day: 2,
    dateLabel: 'Sat, 14 Nov 2026',
    focusTitle: 'Ch 9: Number Systems (Part 2 — Tallies, IOL Birom, Equations & IOL Dzongkha)',
    theoryReading: 'Review Ch 9 Worked Solutions (pp. 336–348)',
    timeBreakdown: '0.5h Review + 3.5h Problems (6)',
    problemIds: [7, 8, 9, 10, 11, 12],
    isMockExamDay: false,
    mockNote: 'Problem #13 (Jowulu) is held unseen for Day 16 Timed Mock Paper 3.'
  },
  {
    day: 3,
    dateLabel: 'Sun, 15 Nov 2026',
    focusTitle: 'Ch 6: Verb & VP — TAM & Evidentiality (Part 1)',
    theoryReading: 'Yellow Book Ch 6 (6.1–6.6, pp. 199–215)',
    timeBreakdown: '1.0h Theory + 3.0h Problems (5)',
    problemIds: [14, 15, 16, 17, 18],
    isMockExamDay: false
  },
  {
    day: 4,
    dateLabel: 'Mon, 16 Nov 2026',
    focusTitle: 'Ch 6: Verb & VP — IOL Plains Cree Hierarchy, Fluid-S & IOL Nooni (Part 2)',
    theoryReading: 'Yellow Book Ch 6 (6.7–6.8, pp. 215–226)',
    timeBreakdown: '0.75h Theory + 3.25h Problems (5)',
    problemIds: [19, 20, 21, 22, 23],
    isMockExamDay: false
  },
  {
    day: 5,
    dateLabel: 'Tue, 17 Nov 2026',
    focusTitle: 'Ch 6: Verb & VP — IOL Hakhun, IOL Alabama & Expert Synthesis (Part 3)',
    theoryReading: 'Review Ch 6 Pronoun Hierarchy & Pluractionality notes',
    timeBreakdown: '4.0h Deep Problem Solving (5)',
    problemIds: [24, 25, 26, 27, 28],
    isMockExamDay: false
  },
  {
    day: 6,
    dateLabel: 'Wed, 18 Nov 2026',
    focusTitle: 'Ch 7: Syntax — Alignment & Polish Logic (Part 1)',
    theoryReading: 'Yellow Book Ch 7 (7.1–7.5, pp. 257–272)',
    timeBreakdown: '1.0h Theory + 3.0h Problems (5)',
    problemIds: [29, 30, 31, 32, 33],
    isMockExamDay: false
  },
  {
    day: 7,
    dateLabel: 'Thu, 19 Nov 2026',
    focusTitle: 'Ch 7: Syntax — IOL Dyirbal, IOL Wambaya, IOL Iquito & Switch-Ref (Part 2)',
    theoryReading: 'Review Ergative / Split-Ergative & V2 diagrams (pp. 263–269)',
    timeBreakdown: '0.5h Review + 3.5h Problems (5)',
    problemIds: [38, 39, 40, 41, 42],
    isMockExamDay: false,
    mockNote: 'Problems #34 (Dhivehi), #35 (Icari Dargwa), #36 (Epun), and #37 (Wiradjuri) are held for Days 14–16 Mocks.'
  },
  {
    day: 8,
    dateLabel: 'Fri, 20 Nov 2026',
    focusTitle: 'Ch 5: Noun & NP — Possession, IOL Kilivila Classifiers & Infixes/Transfixes (Part 1)',
    theoryReading: 'Yellow Book Ch 5 (5.1–5.8, pp. 145–170)',
    timeBreakdown: '1.0h Theory + 3.0h Problems (5)',
    problemIds: [43, 44, 45, 46, 47],
    isMockExamDay: false
  },
  {
    day: 9,
    dateLabel: 'Sat, 21 Nov 2026',
    focusTitle: 'Ch 5: Noun & NP (IOL Terêna & Iaai) + Ch 8: Semantics (Basque & IOL Aralle-Tabulahan)',
    theoryReading: 'Yellow Book Ch 8 (8.1–8.2, pp. 299–307) & Ch 10 (10.1, pp. 365–370)',
    timeBreakdown: '0.75h Theory + 3.25h Problems (5)',
    problemIds: [48, 49, 53, 54, 56],
    isMockExamDay: false,
    mockNote: 'Problems #50 (Nanti), #51 (Romanian), and #52 (When it clicks…) are held for Days 15–16 Mocks.'
  },
  {
    day: 10,
    dateLabel: 'Sun, 22 Nov 2026',
    focusTitle: 'Ch 8: Semantics — Kubeo, Malagasy, IOL Komnzo Kinship & Vector Embeddings (Part 2)',
    theoryReading: 'Review Graph Method degree-counting (pp. 302–307) & Kinship (pp. 371–377)',
    timeBreakdown: '0.5h Review + 3.5h Problems (4)',
    problemIds: [57, 60, 61, 62],
    isMockExamDay: false,
    mockNote: 'Problems #55 (miks salat), #58 (Karuk), and #59 (Singing it in Tlingit) are held for Days 14 & 16 Mocks.'
  },
  {
    day: 11,
    dateLabel: 'Mon, 23 Nov 2026',
    focusTitle: 'Ch 4: Phonology — Rendaku, Rule Ordering, IOL Kuria Tone & IOL Central Yup’ik Stress',
    theoryReading: 'Yellow Book Ch 3 (3.2 & 3.5, pp. 49–58, 70–74) & Ch 4 (4.1–4.6, pp. 91–107)',
    timeBreakdown: '1.0h Theory + 3.0h Problems (5)',
    problemIds: [63, 64, 65, 67, 68],
    isMockExamDay: false,
    mockNote: 'Problem #66 (GaeilGo Doesn’t Go) is held for Day 16 Timed Mock Paper 3.'
  },
  {
    day: 12,
    dateLabel: 'Tue, 24 Nov 2026',
    focusTitle: 'Ch 2: Writing Systems — Braille, Featural Blocks & IOL Book Pahlavi Heterograms',
    theoryReading: 'Yellow Book Ch 2 (2.1–2.11, pp. 11–26)',
    timeBreakdown: '1.0h Theory + 3.0h Problems (3)',
    problemIds: [69, 70, 71],
    isMockExamDay: false,
    mockNote: 'Problem #72 (Old Persian) is held for Day 15 Timed Mock Paper 2.'
  },
  {
    day: 13,
    dateLabel: 'Wed, 25 Nov 2026',
    focusTitle: 'Wildcard Insurance & Weak-Area Error-Log Redo',
    theoryReading: 'Re-read personal notes & redo every problem flagged "Review Needed"',
    timeBreakdown: '1.5h Weak-Area Synthesis + 2.5h Error-Log Redo',
    problemIds: [],
    isMockExamDay: false,
    mockNote: 'Dedicated buffer day to re-solve all problems marked "Review Needed" before entering the 3-day timed mock block.'
  },
  {
    day: 14,
    dateLabel: 'Thu, 26 Nov 2026',
    focusTitle: 'Timed Mock Paper 1: PLO 2022 Round 1 (File labelled 2026)',
    theoryReading: 'Strict exam simulation (Mongolian skipped as already solved)',
    timeBreakdown: '3.0h Timed Paper + 1.0h Post-Mortem Grading',
    problemIds: [55, 58, 34],
    isMockExamDay: true
  },
  {
    day: 15,
    dateLabel: 'Fri, 27 Nov 2026',
    focusTitle: 'Timed Mock Paper 2: PLO 2023 Senior Round 1',
    theoryReading: 'Strict 5-problem Senior paper simulation (PLO_23\'_Senior.pdf)',
    timeBreakdown: '3.0h Timed Paper + 1.0h Post-Mortem Grading',
    problemIds: [50, 51, 35, 36, 72],
    isMockExamDay: true
  },
  {
    day: 16,
    dateLabel: 'Sat, 28 Nov 2026',
    focusTitle: 'Timed Mock Paper 3: PLO 2024 Senior Round 1',
    theoryReading: 'Strict 5-problem Senior paper simulation (PLO_24\'_Senior.pdf)',
    timeBreakdown: '3.0h Timed Paper + 1.0h Final Checklist Review',
    problemIds: [13, 66, 59, 37, 52],
    isMockExamDay: true
  }
];

export const PATTERN_LANDSCAPE: PatternLandscapeRow[] = [
  {
    rank: 1,
    problemType: 'Verbal Morphology (TAM, Argument Indexing, Pronoun Hierarchy, Evidentiality, Valence)',
    count: 38,
    share: '18.2%',
    typicalDifficulty: 'Medium – Hard',
    yellowBookChapter: 'Chapter 6 (Verb and verb phrase)',
    category: 'High-Frequency Core'
  },
  {
    rank: 2,
    problemType: 'Number Systems, Arithmetic Equations & Calendar/Time Reckoning',
    count: 36,
    share: '17.2%',
    typicalDifficulty: 'Easy – Medium',
    yellowBookChapter: 'Chapter 9 (Number systems)',
    category: 'High-Frequency Core'
  },
  {
    rank: 3,
    problemType: 'Clause Syntax, Morphosyntactic Alignment (Ergative / Split), Word Order & Clitics',
    count: 32,
    share: '15.3%',
    typicalDifficulty: 'Medium – Expert',
    yellowBookChapter: 'Chapter 7 (Syntax)',
    category: 'High-Frequency Core'
  },
  {
    rank: 4,
    problemType: 'Nominal Morphology (Noun Classes, Possession, Case, Number, Reduplication, Infixes/Transfixes)',
    count: 30,
    share: '14.4%',
    typicalDifficulty: 'Easy – Hard',
    yellowBookChapter: 'Chapter 5 (Noun and noun phrase)',
    category: 'High-Frequency Core'
  },
  {
    rank: 5,
    problemType: 'Lexical Semantics, Compounding, Spatial Deixis, Kinship & Word Embeddings',
    count: 24,
    share: '11.5%',
    typicalDifficulty: 'Easy – Hard',
    yellowBookChapter: 'Chapter 8 (Semantics) + Ch 10',
    category: 'High-Frequency Core'
  },
  {
    rank: 6,
    problemType: 'Phonological Alternations (Assimilation, Vowel Harmony, Autosegmental Tone, Stress, Orthography)',
    count: 21,
    share: '10.0%',
    typicalDifficulty: 'Medium – Hard',
    yellowBookChapter: 'Chapter 4 (Phonology) + Ch 3',
    category: 'Medium-Frequency Anchor'
  },
  {
    rank: 7,
    problemType: 'Writing Systems (Abugidas, Abjads/Heterograms, Cuneiform, Braille & Featural Scripts)',
    count: 13,
    share: '6.2%',
    typicalDifficulty: 'Easy – Hard',
    yellowBookChapter: 'Chapter 2 (Writing systems)',
    category: 'Medium-Frequency Anchor'
  },
  {
    rank: 8,
    problemType: 'Suprasegmental Phonetics (Iambic Stress Windows, Syllable Weight & Poetic Metre)',
    count: 8,
    share: '3.8%',
    typicalDifficulty: 'Medium – Hard',
    yellowBookChapter: 'Chapter 3 (Covered via IOL 2026 Central Yup’ik in Ch 4)',
    category: 'Wildcard'
  },
  {
    rank: 9,
    problemType: 'Kinship Systems & Spatial/Topographic Orientation',
    count: 7,
    share: '3.3%',
    typicalDifficulty: 'Medium – Hard',
    yellowBookChapter: 'Chapter 10 (Covered via IOL 2016 Aralle-Tabulahan & IOL 2024 Komnzo in Ch 8)',
    category: 'Wildcard'
  }
];

export const DROPPED_CHAPTERS = [
  {
    chapter: 'Chapter 1: Introduction to linguistics problems (pp. 1–10)',
    reason:
      'Contains 0 problems—it is purely a 10-page methodological introduction covering Rosetta Stone vs. Chaos-and-Order structures, solution writing, and the zero morpheme (∅). Assigned as a 30-minute theory warm-up on Day 1.'
  },
  {
    chapter: 'Chapter 3: Phonetics — Folded into Chapter 4 via IOL 2025 Kuria & IOL 2026 Central Yup’ik (pp. 49–89)',
    reason:
      'Instead of a separate low-yield chapter, articulatory features (§3.2), autosegmental tone mora-counting, and iambic stress windows (§3.5) are integrated directly into Chapter 4 via IOL 2025 Kuria (#65) and IOL 2026 Central Yup’ik (#67).'
  },
  {
    chapter: 'Chapter 10: Other types of problems — Folded into Chapter 8 via IOL 2016 Aralle-Tabulahan & IOL 2024 Komnzo (pp. 365–396)',
    reason:
      'Topographical/riverine orientation (§10.1) and kinship exchange graphs (§10.2) are now directly trained inside Chapter 8 via IOL 2016 Problem 1: Aralle-Tabulahan (#56) and IOL 2024 Problem 3: Komnzo Kinship (#61), plus royal genealogy in Problem #72 (Old Persian).'
  }
];

export const CORPUS_FLAGS = [
  {
    title: 'IOL 2003–2026 Individual Problems Integrated (72-Problem Expanded Edition)',
    detail:
      '7 overlapping regional/textbook exercises (Yup’ik 9.3, Proto-Algonquian 6.5, Arabic 7.7, Sixteen Japanese Phrases, Turkish 8.4, Nasal Consonants 4.3, and Javanese 2.10) were swapped out and replaced with 15 gold-standard IOL Individual Problems (2012–2026) from IOL_2003-2026_Individual_Problems.pdf, bringing the curriculum to 72 problems.'
  },
  {
    title: 'Mislabelled PLO 2022 Paper (PLO_26\'_Senior_Junior.pdf)',
    detail:
      'The file named PLO_26\'_Senior_Junior.pdf has a header typo reading "Panini Linguistics Olympiad 2026", but it is the official PLO 2022 Round 1 paper (Problem 3 Mongolian explicitly references the 2022 Beijing Winter Olympics). All problems from this file are labelled PLO 2022.'
  },
  {
    title: 'Three Separate PLO 2023 PDFs Attached',
    detail:
      'Always use PLO_23\'_Senior.pdf for your study and Day 15 Mock. In 2023, the Senior versions of Nanti, Icari Dargwa, and Epun include additional data sentences and harder sub-assignments omitted from the Junior booklet, plus Old Persian (Senior-only).'
  },
  {
    title: 'Font-Encoding / Caesar-Shift Corruption on Specific Compilation Pages',
    detail:
      'Pages 6–9 and 12–14 of PLO_Medium_Hard_Expert_Problems.pdf and Pages 80–87 of PLO_Easy_Problems.pdf suffer from corrupted PDF font-subset tables. Every affected problem included in this 72-problem guide points to its clean, uncorrupted source file (e.g., Altai-ed up in PLO_20\'_Senior_Junior.pdf p. 9; Ditema tsa Dinoko in PLO_Camp_26\'.pdf p. 51; Bariai in PLO_Medium_Hard_Expert_Problems.pdf p. 15).'
  },
  {
    title: 'Blank Scanned Tables on Two Pages of PLO_Easy_Problems.pdf',
    detail:
      'Page 18 (Problem No. 5: Amharic) and Page 69 (Problem No. 4: Coptic) in PLO_Easy_Problems.pdf have missing/blank scanned script images and have been excluded from the 72-problem set.'
  },
  {
    title: 'Cross-File Problem Aliases Deduplicated',
    detail:
      'Twisted Translations (PLO 2020) ≡ Word Embeddings (Camp #64); Triangle Script (PLO 2017) ≡ Ditema tsa Dinoko (Camp #78); Tangkhul Verbs (PLO 2013) ≡ Akham goes Shopping; Telling Time in Swahili ≡ YB 9.8; Umbu-Ungu (IOL 2012) ≡ YB 9.4; Hakhun (IOL 2018) ≡ YB 6.11; Cheesy Malagasy ≡ YB 8.8; Basque ≡ YB 8.3.'
  }
];
