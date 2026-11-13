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
  prerequisiteNote: string;
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
    id: 'ch2',
    chapterNumber: 2,
    priorityRank: 1,
    title: 'Chapter 2: Writing Systems',
    shortTitle: 'Ch 2 · Writing Systems',
    prerequisiteNote: 'Step 1 (Orthography & Scripts): Letters, Syllables & Glyphs → Unlocks Ch 4 (Phonology)',
    problemCount: 4,
    shareOfCorpus: '6.2% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Starts with how languages are written and segmented into visual units—covering 2D Braille matrices (Tenji), featural triangle blocks (Ditema tsa Dinoko), polyvalent abjad + Aramaic heterograms (IOL 2019 Book Pahlavi), and Old Persian cuneiform.',
    theorySections: [
      {
        sectionCode: '2.1–2.9',
        title: 'Abjads, Heterograms (Ideograms), Syllabaries & Featural Systems',
        pages: 'pp. 11–26 [PDF pp. 35–50]',
        keyTakeaway: 'Spot frozen Aramaic heterograms vs. polyvalent phonetic spellings (Book Pahlavi), featural stroke geometry (Ditema), and semi-alphabetic cuneiform.'
      },
      {
        sectionCode: '2.11',
        title: 'Braille Alphabet & Compositional Matrix Scripts',
        pages: 'pp. 27–29 [PDF pp. 51–53]',
        keyTakeaway: 'Decompose 6-dot cells into vowel sub-grids, consonant sub-grids, and spatial shift modifiers (voicing/palatalisation prefixes).'
      }
    ]
  },
  {
    id: 'ch4',
    chapterNumber: 4,
    priorityRank: 2,
    title: 'Chapter 4: Phonology',
    shortTitle: 'Ch 4 · Phonology',
    prerequisiteNote: 'Step 2 (Sound Systems): Builds on Ch 2 (Scripts) → Unlocks Ch 5 (Nouns & Morphology)',
    problemCount: 6,
    shareOfCorpus: '10.0% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Moves from written symbols to the sound system and phonological rules—covering Rendaku voicing dissimilation (Japanese), rule ordering (Valley Yokuts), autosegmental High-tone mora counting (IOL 2025 Kuria), iambic stress & gemination (IOL 2026 Central Yup’ik), and sibilant harmony (Barbareño).',
    theorySections: [
      {
        sectionCode: '3.2, 3.5–3.6 & 4.1–4.3',
        title: 'Articulatory Features, Stress Windows, Tone & Complementary Distribution',
        pages: 'pp. 50–58, 69–74, 91–100 [PDF pp. 74–82, 93–98, 115–124]',
        keyTakeaway: 'Group sounds by natural classes, count moras for autosegmental tone targets (Kuria), and parse left-to-right iambic feet (Central Yup’ik).'
      },
      {
        sectionCode: '4.4–4.6',
        title: 'Phonological Processes, Vowel Harmony & Consonant Mutation',
        pages: 'pp. 101–124 [PDF pp. 125–148]',
        keyTakeaway: 'Check feeding vs. bleeding rule order when vowel harmony, epenthesis, syncope, and sibilant/voicing dissimilation interact.'
      }
    ]
  },
  {
    id: 'ch5',
    chapterNumber: 5,
    priorityRank: 3,
    title: 'Chapter 5: Noun and Noun Phrase',
    shortTitle: 'Ch 5 · Noun & NP',
    prerequisiteNote: 'Step 3 (Nominal Morphology): Builds on Ch 4 (Phonology) → Required before Ch 6 (Verbs) & Ch 7 (Syntax)',
    problemCount: 11,
    shareOfCorpus: '14.4% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Essential prerequisite before Verbs (Ch 6) and Syntax (Ch 7): introduces how nouns inflect for case, number, gender/noun classes, and possession. Directly targets Alienable vs. Inalienable Possession (Fijian, Iaai, Nanti, Terêna), Infixes & Transfixes (Ulwa, Terêna, Maltese, Ilocano), and multi-target classifiers (Kilivila).',
    theorySections: [
      {
        sectionCode: '5.1–5.2',
        title: 'Morpheme Types: Infix, Circumfix, Transfix & Autosegmental Spread',
        pages: 'pp. 145–152 [PDF pp. 169–176]',
        keyTakeaway: 'Isolate discontinuous root consonants (Semitic C1-C2-C3 transfixes), prosodic infix landing sites (Ulwa), and autosegmental nasal/harmony spread (Terêna).'
      },
      {
        sectionCode: '5.3–5.6',
        title: 'Nominal Variables, Multi-Slot Classifiers, Reduplication & Suppletion',
        pages: 'pp. 153–164 [PDF pp. 177–188]',
        keyTakeaway: 'Track Bantu singular/plural class pairs, multi-target sortal classifiers across NP constituents (Kilivila), and partial CV/CVC reduplication.'
      },
      {
        sectionCode: '5.7–5.8',
        title: 'Alienable vs. Inalienable Possession & Colour Hierarchy',
        pages: 'pp. 164–179 [PDF pp. 188–203]',
        keyTakeaway: 'Inalienable nouns (kin, body parts) take direct affixes/infixes; alienable nouns and loanwords require possessive classifiers or helper roots.'
      }
    ]
  },
  {
    id: 'ch6',
    chapterNumber: 6,
    priorityRank: 4,
    title: 'Chapter 6: Verb and Verb Phrase',
    shortTitle: 'Ch 6 · Verb & VP',
    prerequisiteNote: 'Step 4 (Verbal Morphology): Builds on Ch 5 (Nouns & NP) → Required before Ch 7 (Syntax)',
    problemCount: 15,
    shareOfCorpus: '18.2% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Builds on nominal person/number/class (from Ch 5) and is required before tackling full clause Syntax (Ch 7). Directly targets TAM (hodiernal/hesternal/market-week tenses in Nooni & Mee), Pronoun Hierarchy (2>1>3 in Plains Cree and 1>2>3 in Hakhun), Evidentiality, and pluractional infixation (Alabama).',
    theorySections: [
      {
        sectionCode: '6.1–6.3.4',
        title: 'Transitivity, Valency & TAM (Tense, Aspect, Mood)',
        pages: 'pp. 199–203 [PDF pp. 223–227]',
        keyTakeaway: 'Distinguish hodiernal/hesternal/crastinal tense, perfective/imperfective/semelfactive aspect, and realis/irrealis/optative mood.'
      },
      {
        sectionCode: '6.3.5',
        title: 'Evidentiality Systems',
        pages: 'p. 204 [PDF p. 228]',
        keyTakeaway: 'Separate information source (visual, non-visual sensory, inferential from traces, reportative/hearsay) from tense.'
      },
      {
        sectionCode: '6.4–6.7',
        title: 'Verb Templates, Argument Patterns & Pronoun Hierarchy',
        pages: 'pp. 205–228 [PDF pp. 229–252]',
        keyTakeaway: 'In 1>2>3 (Hakhun) or 2>1>3 (Plains Cree) hierarchies, one person slot indexes the higher-ranked participant while a Direct/Inverse marker encodes direction of action.'
      },
      {
        sectionCode: '6.8',
        title: 'Verb Semantics, Pluractionality & Fluid-S Alignment',
        pages: 'pp. 229–232 [PDF pp. 253–256]',
        keyTakeaway: 'Track causatives, middle/passive valency operations (Alabama), and active/stative (volitional vs. accidental) intransitive subject marking.'
      }
    ]
  },
  {
    id: 'ch7',
    chapterNumber: 7,
    priorityRank: 5,
    title: 'Chapter 7: Syntax',
    shortTitle: 'Ch 7 · Syntax',
    prerequisiteNote: 'Step 5 (Clause Syntax): Combines Ch 5 (Nouns & NP) + Ch 6 (Verbs & VP) into Full Sentences',
    problemCount: 14,
    shareOfCorpus: '15.3% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Combines Noun case marking (Ch 5) and Verb agreement/TAM (Ch 6) to solve full sentences. Directly targets Morphosyntactic Alignment (Dyirbal ergative + antipassive pivot, Wambaya & Wiradjuri split ergativity, Dhivehi dative subjects), Wackernagel 2nd-position clitics (Luiseño & Wambaya), V2 dislocation (Iquito), and switch-reference (Amele).',
    theorySections: [
      {
        sectionCode: '7.1–7.3',
        title: 'Word Order, V2 Dislocation & Focusing',
        pages: 'pp. 257–268 [PDF pp. 281–292]',
        keyTakeaway: 'Correlate SOV/VSO with postpositions/prepositions, mood-conditioned V2 fronting (Iquito), and polarity-driven inversion (Epun).'
      },
      {
        sectionCode: '7.4',
        title: 'Morphosyntactic Alignment & Antipassive Voice',
        pages: 'pp. 269–273 [PDF pp. 293–297]',
        keyTakeaway: 'Compare intransitive (S) with transitive agent (A) and patient (P): Nominative-Accusative (S=A≠P), Ergative-Absolutive (S=P≠A, plus Dyirbal antipassive -ŋay-).'
      },
      {
        sectionCode: '7.5',
        title: 'Split Alignment & Second-Position Clitics',
        pages: 'pp. 274–275 [PDF pp. 298–299]',
        keyTakeaway: '1st/2nd pronouns favour accusative while common nouns favour ergative (Wiradjuri); Wackernagel auxiliary clusters attach after the first constituent (Wambaya, Luiseño).'
      }
    ]
  },
  {
    id: 'ch9',
    chapterNumber: 9,
    priorityRank: 6,
    title: 'Chapter 9: Number Systems',
    shortTitle: 'Ch 9 · Number Systems',
    prerequisiteNote: 'Step 6 (Numeral Systems): Applies Compounding & Syntax (Ch 5–7) to Base/Subtractive Arithmetic',
    problemCount: 13,
    shareOfCorpus: '17.2% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Applies morphological compounding and constituent order to numeral systems—covering base-20/sub-base-5 structures, overcounting (Umbu-Ungu & Dzongkha), subtraction & exponentiation (Birom & Jowulu), body-part tallies (Tifal), and time reckoning (Swahili).',
    theorySections: [
      {
        sectionCode: '9.1',
        title: 'Introduction: Bases, Sub-bases, Orders & Carryovers',
        pages: 'pp. 321–331 [PDF pp. 345–355]',
        keyTakeaway: 'Identify constituent order (multiplier × base + unit) and morphological linkers via digit-frequency analysis.'
      },
      {
        sectionCode: '9.2',
        title: 'Overcounting Systems',
        pages: 'pp. 332–341 [PDF pp. 356–365]',
        keyTakeaway: 'Recognize "4 towards the 2nd twenty" (= 24, not 44) or fractional step overcounting (Dzongkha) by checking whether the multiplier increments one step early.'
      },
      {
        sectionCode: '9.3',
        title: 'Subtractive Systems',
        pages: 'pp. 342–344 [PDF pp. 366–368]',
        keyTakeaway: 'Spot sudden morpheme changes at 8–9, 10–11 (Birom), or 15–19 signaling back-counting from the next threshold.'
      },
      {
        sectionCode: '9.4–9.5',
        title: 'Body-Part Counting & Time Reckoning',
        pages: 'pp. 345–352 [PDF pp. 369–376]',
        keyTakeaway: 'Map anatomical symmetry axes (midpoint = nose/chest) and equatorial 6-hour clock offsets.'
      }
    ]
  },
  {
    id: 'ch8',
    chapterNumber: 8,
    priorityRank: 7,
    title: 'Chapter 8: Semantics',
    shortTitle: 'Ch 8 · Semantics',
    prerequisiteNote: 'Step 7 (Meaning & Kinship): Synthesizes Morphology, Syntax & Lexical Networks',
    problemCount: 9,
    shareOfCorpus: '11.5% (PLOs + IOL 2003–2026)',
    whyIncluded:
      'Synthesizes nominal possession (Ch 5) and clause structure (Ch 7) to solve metaphorical compounding networks (Basque, Kubeo, Karuk, Tlingit, Malagasy), NLP vector embeddings (Twisted Translations), topographical spatial deixis (Aralle-Tabulahan), and kinship exchange graphs (Komnzo).',
    theorySections: [
      {
        sectionCode: '8.1 & 10.1',
        title: 'Semantic Fields, Metaphorical Calques & Topographical Deixis',
        pages: 'p. 299 & pp. 365–368 [PDF p. 323 & pp. 389–392]',
        keyTakeaway: 'Recognize cross-linguistic calques ("eye of water" = spring) and riverine/elevation coordinate axes (upriver vs. downriver, uphill vs. downhill in Aralle-Tabulahan).'
      },
      {
        sectionCode: '8.2 & 10.2',
        title: 'The Graph Method for Gloss Matrices & Kinship Trees',
        pages: 'pp. 300–310 & pp. 369–379 [PDF pp. 324–334 & pp. 393–403]',
        keyTakeaway: 'Match nodes uniquely by degree sequences, cycle lengths, and symmetrical marriage/exchange cycles (Komnzo sister-exchange).'
      }
    ]
  }
];

export const PROBLEMS: StudyProblem[] = [
  {
    "id": 1,
    "exactName": "Problem 3: Tenji Braille",
    "alias": "Compare Yellow Book Problem 2.4 (Japanese Braille, p. 27 [PDF p. 51])",
    "sourceAndYear": "PLO 2020 Round 1 (PLO_20'_Senior_Junior.pdf, pp. 3–4 / PLO_Easy_Problems.pdf, pp. 26–27)",
    "pdfUrl": "assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf",
    "pdfLabel": "PLO_20'_Senior_Junior.pdf (pp. 3–4)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch2",
    "chapterNumber": 2,
    "scheduledDay": 1,
    "uniqueSkillTaught": "Compositional 2D matrix encoding in Japanese Braille, where vowel dot-patterns (top-left) and consonant dot-patterns (bottom-right) combine with spatial shifts for yōon palatalisation and dakuten voicing.",
    "weakAreasTargeted": []
  },
  {
    "id": 2,
    "exactName": "Problem 78. Buginese",
    "alias": "Lontara Abugida Script (PLO Camp 26', formerly listed as Problem 78. Ditema tsa Dinoko)",
    "sourceAndYear": "PLO Camp 2026 (PLO_Camp_26'.pdf, pp. 52–53 — MSK 2022)",
    "pdfUrl": "assets/aistudio/PLO_Camp_26__c6119aea.pdf",
    "pdfLabel": "PLO_Camp_26'.pdf (pp. 52–53)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch2",
    "chapterNumber": 2,
    "scheduledDay": 1,
    "uniqueSkillTaught": "Deciphering a Brahmic-derived Lontara abugida script where vowel diacritics attach around consonant bases while syllable-final nasals (-ng) and glottal stops (-q) are systematically unwritten (defective orthography).",
    "weakAreasTargeted": []
  },
  {
    "id": 3,
    "exactName": "IOL 2019 Problem 3: Book Pahlavi (Middle Persian)",
    "sourceAndYear": "IOL 2019 Individual (IOL_2003-2026_Individual_Problems.pdf, pp. 103–104)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (pp. 103–104)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch2",
    "chapterNumber": 2,
    "scheduledDay": 1,
    "uniqueSkillTaught": "Deciphering a right-to-left polyvalent consonantal abjad (where single glyphs merged multiple Aramaic letters) alongside frozen Aramaic heterograms (ideograms) read as Persian words.",
    "weakAreasTargeted": []
  },
  {
    "id": 4,
    "exactName": "5. Old Persian",
    "sourceAndYear": "PLO 2023 Round 1 (PLO_23'_Senior.pdf, pp. 8–10)",
    "pdfUrl": "assets/aistudio/PLO_23__Senior_dab9c4d4.pdf",
    "pdfLabel": "PLO_23'_Senior.pdf (pp. 8–10)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch2",
    "chapterNumber": 2,
    "scheduledDay": 15,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 2 (PLO 2023 Senior)",
    "uniqueSkillTaught": "Combining semi-alphabetic cuneiform decipherment (where consonant signs depend on following vowels /a, i, u/) with Achaemenid royal family tree reconstruction and genitive case inflection.",
    "weakAreasTargeted": []
  },
  {
    "id": 5,
    "exactName": "Problem #5: Japanese Compound Words",
    "sourceAndYear": "PLO 2015 Round 1 (PLO_Easy_Problems.pdf, pp. 12–13)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (pp. 12–13)",
    "division": "Senior",
    "difficulty": "Easy",
    "chapterId": "ch4",
    "chapterNumber": 4,
    "scheduledDay": 2,
    "uniqueSkillTaught": "Rendaku (sequential voicing) in compounds blocked by Lyman's Law (long-distance voicing dissimilation when the second root contains a voiced obstruent) and branching constituent trees.",
    "weakAreasTargeted": []
  },
  {
    "id": 6,
    "exactName": "Problem 4.4 (Valley Yokuts)",
    "sourceAndYear": "Yellow Book Ch 4 Worked Example (RoLO 2019, p. 111 [PDF p. 135])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 111 [PDF p. 135])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch4",
    "chapterNumber": 4,
    "scheduledDay": 2,
    "uniqueSkillTaught": "Strict phonological rule ordering (feeding/bleeding) across height-conditioned rounding vowel harmony, vowel epenthesis in CCC clusters, and closed-syllable vowel shortening.",
    "weakAreasTargeted": []
  },
  {
    "id": 7,
    "exactName": "IOL 2025 Problem 3: Kuria",
    "sourceAndYear": "IOL 2025 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 157)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 157)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch4",
    "chapterNumber": 4,
    "scheduledDay": 2,
    "uniqueSkillTaught": "Autosegmental High-tone mora counting in Bantu verb TAM: determining which tense/aspect prefix assigns a High tone to the 1st, 3rd, or 4th mora of the macrostem with bounded tone spreading.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 8,
    "exactName": "2. GaeilGo Doesn’t Go",
    "sourceAndYear": "PLO 2024 Round 1 (PLO_24'_Senior.pdf, pp. 3–4)",
    "pdfUrl": "assets/aistudio/PLO_24__Senior_76504da1.pdf",
    "pdfLabel": "PLO_24'_Senior.pdf (pp. 3–4)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch4",
    "chapterNumber": 4,
    "scheduledDay": 16,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 3 (PLO 2024 Senior)",
    "uniqueSkillTaught": "Deriving bidirectional orthography-to-IPA rules for Irish palatalised (\"slender\" /Cʲ/) vs. velarised (\"broad\" /Cˠ/) consonants and silent orthographic vowel markers.",
    "weakAreasTargeted": []
  },
  {
    "id": 9,
    "exactName": "IOL 2026 Problem 1: Central Yup’ik",
    "sourceAndYear": "IOL 2026 Individual (IOL_2003-2026_Individual_Problems.pdf, pp. 171–172)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (pp. 171–172)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch4",
    "chapterNumber": 4,
    "scheduledDay": 2,
    "uniqueSkillTaught": "Iterative left-to-right iambic stress assignment, rhythmic vowel lengthening, onset gemination before CVV syllables, and Norton Sound vs. General Central Yup’ik consonant assimilation.",
    "weakAreasTargeted": []
  },
  {
    "id": 10,
    "exactName": "Problem 12. Barbareño",
    "sourceAndYear": "PLO Camp 2026 (PLO_Camp_26'.pdf, pp. 9–10 — MSK 2021)",
    "pdfUrl": "assets/aistudio/PLO_Camp_26__c6119aea.pdf",
    "pdfLabel": "PLO_Camp_26'.pdf (pp. 9–10)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch4",
    "chapterNumber": 4,
    "scheduledDay": 2,
    "uniqueSkillTaught": "Long-distance regressive sibilant harmony (s vs. š), glottalization, vowel syncope, and CVC reduplication / infixation interacting across multiple prefix slots.",
    "weakAreasTargeted": [
      "Infixes & Transfixes"
    ]
  },
  {
    "id": 11,
    "exactName": "Problem 1: Estonian Word Forms",
    "sourceAndYear": "PLO 2020 Round 1 (PLO_20'_Senior_Junior.pdf, p. 1)",
    "pdfUrl": "assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf",
    "pdfLabel": "PLO_20'_Senior_Junior.pdf (p. 1)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 3,
    "uniqueSkillTaught": "Recursive derivational morphology (agentive, instrumental, abstract state, diminutive, and adjectival suffixes) and stem-vowel truncation rules.",
    "weakAreasTargeted": []
  },
  {
    "id": 12,
    "exactName": "Problem 5.6 (Fijian)",
    "sourceAndYear": "Yellow Book Ch 5 Worked Example (UKLO 2018, pp. 164–166 [PDF pp. 188–190])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (pp. 164–166 [PDF pp. 188–190])",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 3,
    "uniqueSkillTaught": "The three-way Oceanic possession system: inalienable direct suffixation (body parts/kin) vs. alienable possession split into edible (ke-), drinkable (me-), and general (no-) classifiers.",
    "weakAreasTargeted": [
      "Alienable vs. Inalienable Possession"
    ]
  },
  {
    "id": 13,
    "exactName": "IOL 2021 Problem 3: Kilivila",
    "alias": "Replaces Sixteen Japanese Phrases with multi-slot IOL classifier concord",
    "sourceAndYear": "IOL 2021 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 115)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 115)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 3,
    "uniqueSkillTaught": "Multi-target sortal numeral classifiers in Oceanic, where the exact same semantic classifier stem infixes/prefixes into numerals, demonstratives, and adjectives alike.",
    "weakAreasTargeted": []
  },
  {
    "id": 14,
    "exactName": "Problem 5.9 (Ulwa)",
    "sourceAndYear": "Yellow Book Ch 5 Practice (TurLom 2003, p. 180 [PDF p. 204])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 180 [PDF p. 204])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 3,
    "uniqueSkillTaught": "Prosodically anchored possessive infixes vs. suffixes, where the possessive marker infixes immediately after the first iambic foot / heavy syllable of the noun stem.",
    "weakAreasTargeted": [
      "Infixes & Transfixes",
      "Alienable vs. Inalienable Possession"
    ]
  },
  {
    "id": 15,
    "exactName": "Problem 5.13 (Maltese)",
    "sourceAndYear": "Yellow Book Ch 5 Practice (LLO 2020, p. 183 [PDF p. 207])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 183 [PDF p. 207])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 3,
    "uniqueSkillTaught": "Semitic non-concatenative root-and-pattern transfixes (broken plurals) interacting with Berlin & Kay colour-hierarchy loanword invariance.",
    "chapterPlacementReason": "Placed in Chapter 5 because broken plural transfixation and adjectival number agreement are nominal morphology.",
    "weakAreasTargeted": [
      "Infixes & Transfixes"
    ]
  },
  {
    "id": 16,
    "exactName": "Problem 5.15 (Ilocano)",
    "sourceAndYear": "Yellow Book Ch 5 Practice (NACLO 2008, p. 185 [PDF p. 209])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 185 [PDF p. 209])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 4,
    "uniqueSkillTaught": "CVC partial reduplication for plurals and verbal actor-focus infixation (-um-) paired with Baybayin abugida script transcription.",
    "chapterPlacementReason": "Placed in Chapter 5 because Austronesian infixation and partial reduplication are the primary morphological mechanisms.",
    "weakAreasTargeted": [
      "Infixes & Transfixes"
    ]
  },
  {
    "id": 17,
    "exactName": "IOL 2018 Problem 3: Terêna",
    "sourceAndYear": "IOL 2018 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 98)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 98)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 4,
    "uniqueSkillTaught": "Autosegmental 1st-person nasal spread (which nasalises vowels/sonorants until blocked and prenasalised by a voiceless stop/fricative) vs. 2nd-person vowel-harmony infixation and alienable loanword possession.",
    "weakAreasTargeted": [
      "Infixes & Transfixes",
      "Alienable vs. Inalienable Possession"
    ]
  },
  {
    "id": 18,
    "exactName": "1. Nanti",
    "sourceAndYear": "PLO 2023 Round 1 (PLO_23'_Senior.pdf, pp. 3–4 — Senior version with Assignment 3)",
    "pdfUrl": "assets/aistudio/PLO_23__Senior_dab9c4d4.pdf",
    "pdfLabel": "PLO_23'_Senior.pdf (pp. 3–4)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 15,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 2 (PLO 2023 Senior)",
    "uniqueSkillTaught": "Alienable vs. inalienable possession with prefix nasal-place assimilation, voice assimilation, and diachronic socio-cultural shifts (why \"land\" shifted from inalienable to alienable).",
    "weakAreasTargeted": [
      "Alienable vs. Inalienable Possession"
    ]
  },
  {
    "id": 19,
    "exactName": "2. Romanian",
    "sourceAndYear": "PLO 2023 Round 1 (PLO_23'_Senior.pdf, pp. 4–5)",
    "pdfUrl": "assets/aistudio/PLO_23__Senior_dab9c4d4.pdf",
    "pdfLabel": "PLO_23'_Senior.pdf (pp. 4–5)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 15,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 2 (PLO 2023 Senior)",
    "uniqueSkillTaught": "Enclitic definite articles that jump onto fronted adjectives, 2-case × 2-gender × 2-number concord, and the possessive/genitive article (al/a/ai/ale) agreeing with the possessed head noun.",
    "weakAreasTargeted": []
  },
  {
    "id": 20,
    "exactName": "5. When it clicks…",
    "alias": "Xhosa Noun Classes",
    "sourceAndYear": "PLO 2024 Round 1 (PLO_24'_Senior.pdf, pp. 7–8)",
    "pdfUrl": "assets/aistudio/PLO_24__Senior_76504da1.pdf",
    "pdfLabel": "PLO_24'_Senior.pdf (pp. 7–8)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 16,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 3 (PLO 2024 Senior)",
    "uniqueSkillTaught": "Bantu noun class singular/plural pairings and multi-morpheme numeral concord prefixes with vowel coalescence and click-consonant phonology.",
    "weakAreasTargeted": []
  },
  {
    "id": 21,
    "exactName": "Problem 5.17 (Iaai)",
    "sourceAndYear": "Yellow Book Ch 5 Practice (APLO 2020, pp. 186–188 [PDF pp. 210–212])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (pp. 186–188 [PDF pp. 210–212])",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch5",
    "chapterNumber": 5,
    "scheduledDay": 4,
    "uniqueSkillTaught": "Fine-grained Melanesian possession classification (distinguishing body parts, kin across generations, food, drinks, chewing items, plants, animals, and shelter) with stem vowel mutations.",
    "weakAreasTargeted": [
      "Alienable vs. Inalienable Possession"
    ]
  },
  {
    "id": 22,
    "exactName": "Problem no 3. Simte Verbs",
    "sourceAndYear": "PLO 2013 Round 1 (PLO_Easy_Problems.pdf, p. 20)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 20)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 5,
    "uniqueSkillTaught": "Rapidly separating proclitic subject agreement from post-verbal tense/aspect particles and copular predication in Kuki-Chin.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 23,
    "exactName": "Problem #4: Turkish News and Conversations",
    "sourceAndYear": "PLO 2015 Round 1 (PLO_Easy_Problems.pdf, p. 23)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 23)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 5,
    "uniqueSkillTaught": "Pragmatic deduction of direct witness (-DI) vs. indirect/hearsay reportative (-mIş) evidentiality from conversational context and news sourcing.",
    "weakAreasTargeted": [
      "Evidentiality",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 24,
    "exactName": "3. The Matses Hunter Boy",
    "sourceAndYear": "PLO 2018 Round 1 (PLO_Easy_Problems.pdf, pp. 7–8)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (pp. 7–8)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 5,
    "uniqueSkillTaught": "Two-dimensional evidentiality fused with temporal distance (direct experience, inferential evidence from physical traces, and conjecture across recent vs. distant past).",
    "weakAreasTargeted": [
      "Evidentiality",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 25,
    "exactName": "Problem no 3. Tangkhul Verbs",
    "alias": "Akham goes Shopping",
    "sourceAndYear": "PLO 2013 Round 1 (PLO_Medium_Hard_Expert_Problems.pdf, p. 4 & PLO_Easy_Problems.pdf, p. 14)",
    "pdfUrl": "assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf",
    "pdfLabel": "PLO_Medium_Hard_Expert_Problems.pdf (p. 4)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 5,
    "uniqueSkillTaught": "Agglutinative TAM slot ordering (future, permissive/hortative, desiderative, negative capability, and deictic motion) applied to dialogue completion.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 26,
    "exactName": "Problem 6.8 (Tariana)",
    "sourceAndYear": "Yellow Book Ch 6 Practice (ČLO 2019, p. 234 [PDF p. 258])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 234 [PDF p. 258])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 5,
    "uniqueSkillTaught": "Formal 4-way grammatical evidentiality (visual, non-visual sensory, inferential, reportative) crossed with tense in an Amazonian verb template.",
    "weakAreasTargeted": [
      "Evidentiality",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 27,
    "exactName": "Problem 6.4 (Itelmen)",
    "sourceAndYear": "Yellow Book Ch 6 Worked Example (MSK 1998, p. 219 [PDF p. 243])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 219 [PDF p. 243])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 6,
    "uniqueSkillTaught": "TAM-conditioned split subject/object indexing, where the verb prefix tracks the subject in one tense/mood set and switches paradigm in another.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)",
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 28,
    "exactName": "IOL 2023 Problem 4: Plains Cree",
    "alias": "Replaces short Proto-Algonquian snippet with full IOL Direct/Inverse problem",
    "sourceAndYear": "IOL 2023 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 139)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 139)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 6,
    "uniqueSkillTaught": "Mastering the Algonquian 2 > 1 > 3 pronoun hierarchy, Direct (-aa/-e) vs. Inverse (-ikw) theme signs, and Independent vs. Conjunct clause verb orders.",
    "weakAreasTargeted": [
      "Pronoun Hierarchy",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 29,
    "exactName": "Problem 6.6 (Tabasaran)",
    "sourceAndYear": "Yellow Book Ch 6 Worked Example (MSK 1998, p. 230 [PDF p. 254])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 230 [PDF p. 254])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 6,
    "uniqueSkillTaught": "Fluid-S (active/stative) alignment driven by volition, where intransitive subjects take ergative marking when acting intentionally and absolutive when accidental.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 30,
    "exactName": "Problem No. 4 (25 Points): Tiwa",
    "sourceAndYear": "PLO Round 1 (PLO_Easy_Problems.pdf, p. 24)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 24)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 6,
    "uniqueSkillTaught": "Polysynthetic noun incorporation, where direct objects and possessors fuse inside the portmanteau person/number/noun-class verb prefix complex.",
    "weakAreasTargeted": [
      "Pronoun Hierarchy",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 31,
    "exactName": "IOL 2019 Problem 5: Nooni",
    "sourceAndYear": "IOL 2019 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 105)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 105)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 6,
    "uniqueSkillTaught": "Untangling a multi-tiered Bantoid temporal distance system (hodiernal, near past/future, distant past/future, and progressive/perfective) anchored to an 8-day market week.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 32,
    "exactName": "Problem 6.10 (Gyarung)",
    "sourceAndYear": "Yellow Book Ch 6 Practice (MSK 1998, p. 237 [PDF p. 261])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 237 [PDF p. 261])",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 7,
    "uniqueSkillTaught": "Pronoun hierarchy with summative number marking, where dual/plural suffixes encode the combined number of participants rather than subject or object alone.",
    "weakAreasTargeted": [
      "Pronoun Hierarchy"
    ]
  },
  {
    "id": 33,
    "exactName": "IOL 2018 Problem 2: Hakhun",
    "alias": "Yellow Book Problem 6.11 (Hakhun, p. 239 [PDF p. 263])",
    "sourceAndYear": "IOL 2018 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 97 / Yellow Book p. 239 [PDF p. 263])",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 97)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 7,
    "uniqueSkillTaught": "1 > 2 > 3 hierarchical agreement interacting simultaneously with past vs. present tense and affirmative vs. negative polarity portmanteaus.",
    "weakAreasTargeted": [
      "Pronoun Hierarchy",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 34,
    "exactName": "IOL 2022 Problem 2: Alabama",
    "sourceAndYear": "IOL 2022 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 124)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 124)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 7,
    "uniqueSkillTaught": "Non-concatenative internal consonant gemination and syllable infixation encoding verbal pluractionality and middle/passive valency operations in Muskogean.",
    "weakAreasTargeted": [
      "Infixes & Transfixes",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 35,
    "exactName": "Problem 6.13 (Ainu)",
    "alias": "PLO Camp 26' Problem 40. Ainu",
    "sourceAndYear": "Yellow Book Ch 6 Practice (RoLO 2021, p. 240 [PDF p. 264] / PLO_Camp_26'.pdf, p. 25)",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 240 [PDF p. 264])",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 7,
    "uniqueSkillTaught": "Ergative verbal pluractionality (where the verb stem itself changes for plural S and plural P) combined with causative, reflexive, intensifier, and mitigator affixes.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 36,
    "exactName": "Problem 44. Mee",
    "sourceAndYear": "PLO Camp 2026 (PLO_Camp_26'.pdf, p. 34 — APLO 2019)",
    "pdfUrl": "assets/aistudio/PLO_Camp_26__c6119aea.pdf",
    "pdfLabel": "PLO_Camp_26'.pdf (p. 34)",
    "division": "Senior",
    "difficulty": "Expert",
    "chapterId": "ch6",
    "chapterNumber": 6,
    "scheduledDay": 7,
    "uniqueSkillTaught": "Multi-layered hodiernal (today's past) vs. distant past tense, aspect, and bi-personal object/subject inflection with morphophonemic stem alternations.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 37,
    "exactName": "5. Kurmali",
    "sourceAndYear": "PLO 2018 Round 1 (PLO_Easy_Problems.pdf, p. 39)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 39)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 8,
    "uniqueSkillTaught": "Clean SOV ditransitive case alignment and differential object marking combined with verb agreement in an eastern Indo-Aryan language.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 38,
    "exactName": "Problem 2: Kholosi",
    "sourceAndYear": "PLO 2021 Round 1 (PLO_21'_Senior_Junior.pdf, pp. 3–4)",
    "pdfUrl": "assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf",
    "pdfLabel": "PLO_21'_Senior_Junior.pdf (pp. 3–4)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 8,
    "uniqueSkillTaught": "Separating enclitic pronominal argument markers from postpositions and aspectual stems in an endangered Indo-Iranian SOV clause structure.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 39,
    "exactName": "Problem 7.2 (Morphosyntactic alignments)",
    "sourceAndYear": "Yellow Book Ch 7 Worked Example (RoLO 2016: Dyirbal, Tahitian, Nez-Perce, Wappo, pp. 269–270 [PDF pp. 293–294])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (pp. 269–270 [PDF pp. 293–294])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 8,
    "uniqueSkillTaught": "The definitive diagnostic grid for distinguishing Nominative-Accusative, Ergative-Absolutive, Tripartite (S ≠ A ≠ P), and Direct alignments side-by-side.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 40,
    "exactName": "Problem 1: A Polished Weather Forecast",
    "sourceAndYear": "PLO 2021 Round 1 (PLO_21'_Senior_Junior.pdf, pp. 1–2 / PLO_Medium_Hard_Expert_Problems.pdf, pp. 2–3)",
    "pdfUrl": "assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf",
    "pdfLabel": "PLO_21'_Senior_Junior.pdf (pp. 1–2)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 8,
    "uniqueSkillTaught": "Parsing bracket-free Polish (prefix) formal logic notation by tracking operator arity (unary vs. binary connectives)—the #1 formal-grammar wildcard in PLO.",
    "chapterPlacementReason": "Placed in Chapter 7 because operator-argument constituency and scope tree parsing are fundamentally syntactic.",
    "weakAreasTargeted": []
  },
  {
    "id": 41,
    "exactName": "Problem 6: Altai-ed up",
    "sourceAndYear": "PLO 2020 Round 1 (PLO_20'_Senior_Junior.pdf, pp. 7–8)",
    "pdfUrl": "assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf",
    "pdfLabel": "PLO_20'_Senior_Junior.pdf (pp. 7–8)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 8,
    "uniqueSkillTaught": "SOV case/possessive stacking and participial clause ordering in Altai where every suffix undergoes 2-dimensional (backness + rounding) vowel harmony.",
    "chapterPlacementReason": "Placed in Chapter 7 rather than Chapter 4 because constituent case syntax is the primary frame while vowel harmony governs suffix allomorphy.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 42,
    "exactName": "Problem 5: Dhivehi",
    "sourceAndYear": "PLO 2026 Round 1 (PLO_26'_Senior_Junior.pdf, pp. 9–10)",
    "pdfUrl": "assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf",
    "pdfLabel": "PLO_26'_Senior_Junior.pdf (pp. 9–10)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 14,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 1 (PLO 2026 Senior & Junior)",
    "uniqueSkillTaught": "Volitional vs. involuntary/accidental syntax, where changing the verb to the involuntary stem flips the agent into the dative case and alters TAM marking.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 43,
    "exactName": "3. Icari Dargwa",
    "sourceAndYear": "PLO 2023 Round 1 (PLO_23'_Senior.pdf, p. 6 — 12-sentence Senior version)",
    "pdfUrl": "assets/aistudio/PLO_23__Senior_dab9c4d4.pdf",
    "pdfLabel": "PLO_23'_Senior.pdf (p. 6)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 15,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 2 (PLO 2023 Senior)",
    "uniqueSkillTaught": "Ergative-absolutive nominal case (where S and P are unmarked absolutive and A takes ergative) paired with 1st/2nd > 3rd person hierarchical verb agreement.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "Pronoun Hierarchy",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 44,
    "exactName": "4. Epun",
    "sourceAndYear": "PLO 2023 Round 1 (PLO_23'_Senior.pdf, pp. 7–8 — 14-sentence Senior version)",
    "pdfUrl": "assets/aistudio/PLO_23__Senior_dab9c4d4.pdf",
    "pdfLabel": "PLO_23'_Senior.pdf (pp. 7–8)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 15,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 2 (PLO 2023 Senior)",
    "uniqueSkillTaught": "Polarity-conditioned word-order inversion (OVS in affirmative clauses vs. SVO in negative clauses), ergative-absolutive determiners, and wh-question fronting.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 45,
    "exactName": "4. Wiradjuri",
    "sourceAndYear": "PLO 2024 Round 1 (PLO_24'_Senior.pdf, pp. 6–7)",
    "pdfUrl": "assets/aistudio/PLO_24__Senior_76504da1.pdf",
    "pdfLabel": "PLO_24'_Senior.pdf (pp. 6–7)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 16,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 3 (PLO 2024 Senior)",
    "uniqueSkillTaught": "Classic NP-based split ergativity (full nouns follow an ergative-absolutive pattern while 1st/2nd person pronouns follow a nominative-accusative pattern), plus passive voice.",
    "chapterPlacementReason": "Placed in Chapter 7 because split ergative case alignment and passive voice argument demotion are clause-level syntax.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 46,
    "exactName": "Problem 7.3 (Luiseño)",
    "sourceAndYear": "Yellow Book Ch 7 Practice (UKLO 2012, p. 276 [PDF p. 300])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 276 [PDF p. 300])",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 9,
    "uniqueSkillTaught": "Wackernagel's Law (second-position clitic clusters) for tense/evidentiality/person and unspaced word-boundary segmentation in flexible word-order syntax.",
    "weakAreasTargeted": [
      "Evidentiality",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 47,
    "exactName": "IOL 2012 Problem #1: Dyirbal",
    "sourceAndYear": "IOL 2012 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 50)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 50)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 9,
    "uniqueSkillTaught": "The gold-standard Ergative-Absolutive syntax problem: syntactic ergativity, antipassive voice (-ŋay-) for clause coordination, and 4 semantically rich noun classes.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 48,
    "exactName": "IOL 2015 Problem 4: Wambaya",
    "sourceAndYear": "IOL 2015 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 78)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 78)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 9,
    "uniqueSkillTaught": "Combining Australian ergative case/gender concord with a mandatory Wackernagel second-position auxiliary clitic cluster encoding subject, object, direction, and tense.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 49,
    "exactName": "IOL 2026 Problem 3: Iquito",
    "sourceAndYear": "IOL 2026 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 175)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 175)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 9,
    "uniqueSkillTaught": "Mood-driven word order: Realis SVO vs. Irrealis V2 syntax where an object or postpositional phrase must front before the verb to satisfy an irrealis template.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment",
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 50,
    "exactName": "Problem 49. Dorumi-Koki",
    "alias": "PLO Camp 26' Switch-Reference Medial Verbs (formerly listed as Problem 52. Amele)",
    "sourceAndYear": "PLO Camp 2026 (PLO_Camp_26'.pdf, pp. 36–37 — MSK 2023)",
    "pdfUrl": "assets/aistudio/PLO_Camp_26__c6119aea.pdf",
    "pdfLabel": "PLO_Camp_26'.pdf (pp. 36–37)",
    "division": "Senior",
    "difficulty": "Expert",
    "chapterId": "ch7",
    "chapterNumber": 7,
    "scheduledDay": 9,
    "uniqueSkillTaught": "Switch-reference clause chaining (medial verbs marking Same-Subject vs. Different-Subject for the following clause) and simultaneous vs. sequential event syntax.",
    "weakAreasTargeted": [
      "TAM (Tense, Aspect, Mood)"
    ]
  },
  {
    "id": 51,
    "exactName": "Problem 4: Divehi Numerals",
    "sourceAndYear": "PLO 2016 Round 1 (PLO_Easy_Problems.pdf, p. 65)",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 65)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 10,
    "uniqueSkillTaught": "Deciphering an Indo-Aryan decimal system with preserved duodecimal (base-12 dholhas) and vigesimal breaks using unit-morpheme frequency.",
    "weakAreasTargeted": []
  },
  {
    "id": 52,
    "exactName": "Problem 5: Bahinemo",
    "sourceAndYear": "PLO 2020 Round 1 (PLO_20'_Senior_Junior.pdf, pp. 5–6)",
    "pdfUrl": "assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf",
    "pdfLabel": "PLO_20'_Senior_Junior.pdf (pp. 5–6)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 10,
    "uniqueSkillTaught": "Breaking into an ungrouped quinary/tally numeral system by tracking compound word length and additive linkers across unordered sets.",
    "weakAreasTargeted": []
  },
  {
    "id": 53,
    "exactName": "Problem 3: Cistercian Numerals",
    "sourceAndYear": "PLO 2021 Round 1 (PLO_21'_Senior_Junior.pdf, pp. 5–6)",
    "pdfUrl": "assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf",
    "pdfLabel": "PLO_21'_Senior_Junior.pdf (pp. 5–6)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 10,
    "uniqueSkillTaught": "Decomposing 2D positional glyph quadrants (units, tens, hundreds, thousands) via rotation and reflection around a central vertical stave.",
    "chapterPlacementReason": "Placed in Chapter 9 rather than Chapter 2 because the core mechanism is positional place-value encoding of 4-digit integers.",
    "weakAreasTargeted": []
  },
  {
    "id": 54,
    "exactName": "Problem #4: Telling Time in Swahili",
    "alias": "Yellow Book Problem 9.8 (Swahili, p. 349 [PDF p. 373])",
    "sourceAndYear": "PLO 2014 Round 1 (PLO_Easy_Problems.pdf, p. 28 / Yellow Book p. 349 [PDF p. 373])",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 28)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 10,
    "uniqueSkillTaught": "Solving the 6-hour equatorial clock phase shift (where 7:00 AM is \"hour 1\") alongside additive and subtractive quarter/minute expressions.",
    "weakAreasTargeted": []
  },
  {
    "id": 55,
    "exactName": "IOL 2012 Problem #2: Umbu-Ungu",
    "alias": "Yellow Book Problem 9.4 (Umbu-Ungu, p. 332 [PDF p. 356])",
    "sourceAndYear": "IOL 2012 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 52 / Yellow Book p. 332 [PDF p. 356])",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 52)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 10,
    "uniqueSkillTaught": "Recognizing and formalizing overcounting (\"towards the next group of 24, X units of 4\") in a Papuan base-24 / sub-base-4 numeral system.",
    "weakAreasTargeted": []
  },
  {
    "id": 56,
    "exactName": "Problem 9.6 (Yoruba)",
    "sourceAndYear": "Yellow Book Ch 9 Worked Example (UKLO 2020, p. 343 [PDF p. 367])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 343 [PDF p. 367])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 10,
    "uniqueSkillTaught": "Multi-tier subtractive arithmetic where vigesimal (base-20) multiples are modified simultaneously by \"-5\" and \"-1 to -4\" operations.",
    "weakAreasTargeted": []
  },
  {
    "id": 57,
    "exactName": "Problem 9.16 (Tifal)",
    "alias": "PLO Camp 26' Problem 67. Tifal",
    "sourceAndYear": "Yellow Book Ch 9 Practice (MSK 2017, p. 358 [PDF p. 382] / PLO_Camp_26'.pdf, p. 44)",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (p. 358 [PDF p. 382])",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 11,
    "uniqueSkillTaught": "Symmetrical body-part counting centered on the nose (14), distinguishing \"other side of the body\" markers in multi-person tallies above 27.",
    "weakAreasTargeted": []
  },
  {
    "id": 58,
    "exactName": "Problem No. 3 (20 Points): Bariai",
    "alias": "Bariai Squares",
    "sourceAndYear": "PLO 2017 Round 1 (PLO_Medium_Hard_Expert_Problems.pdf, p. 14)",
    "pdfUrl": "assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf",
    "pdfLabel": "PLO_Medium_Hard_Expert_Problems.pdf (p. 14)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 11,
    "uniqueSkillTaught": "Using quadratic growth (n² vs. n) and compound-length bounds to crack a quinary-decimal numeral system embedded in squaring equations.",
    "weakAreasTargeted": []
  },
  {
    "id": 59,
    "exactName": "IOL 2017 Problem 1: Birom",
    "sourceAndYear": "IOL 2017 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 91)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 91)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 11,
    "uniqueSkillTaught": "Cracking a duodecimal (base-12) Plateau Niger-Congo numeral system with subtractive compounding at 10–11 (gwɛ̄) and exponentiation equations (a^b = c).",
    "weakAreasTargeted": []
  },
  {
    "id": 60,
    "exactName": "Problem 5: Esimbi",
    "sourceAndYear": "PLO 2021 Round 1 (PLO_21'_Senior_Junior.pdf, p. 9)",
    "pdfUrl": "assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf",
    "pdfLabel": "PLO_21'_Senior_Junior.pdf (p. 9)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 11,
    "uniqueSkillTaught": "Exploiting multiplicative chains (a × b = c, b × c = d) and phonological vowel elision across compound boundaries in algebraic equations.",
    "weakAreasTargeted": []
  },
  {
    "id": 61,
    "exactName": "Problem 9.15 (Chabu)",
    "sourceAndYear": "Yellow Book Ch 9 Practice (UkrLO 2018, pp. 357–358 [PDF pp. 381–382])",
    "pdfUrl": "assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf",
    "pdfLabel": "Yellow_Book.pdf (pp. 357–358 [PDF pp. 381–382])",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 11,
    "uniqueSkillTaught": "Meta-mathematical number puzzles where the data states divisor counts and multiple relationships in prose rather than standard + / - symbols.",
    "weakAreasTargeted": []
  },
  {
    "id": 62,
    "exactName": "IOL 2025 Problem 1: Dzongkha Numerals",
    "sourceAndYear": "IOL 2025 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 155)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 155)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 11,
    "uniqueSkillTaught": "Aligning two parallel numeral registers in the same language: System A (vigesimal base-20 with fractional 1/2 and 3/4 step overcounting) vs. System B (decimal contraction).",
    "weakAreasTargeted": []
  },
  {
    "id": 63,
    "exactName": "1. Jowulu",
    "sourceAndYear": "PLO 2024 Round 1 (PLO_24'_Senior.pdf, p. 3)",
    "pdfUrl": "assets/aistudio/PLO_24__Senior_76504da1.pdf",
    "pdfLabel": "PLO_24'_Senior.pdf (p. 3)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch9",
    "chapterNumber": 9,
    "scheduledDay": 16,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 3 (PLO 2024 Senior)",
    "uniqueSkillTaught": "Identifying exponentiation (a^b) alongside addition, subtraction, and multiplication in equations with tonal sandhi on compound numerals.",
    "weakAreasTargeted": []
  },
  {
    "id": 64,
    "exactName": "Problem No. 1 (20 Points): Basque",
    "alias": "Yellow Book Problem 8.3 (Basque, p. 311 [PDF p. 335])",
    "sourceAndYear": "PLO Round 1 (PLO_Easy_Problems.pdf, p. 68 / Yellow Book p. 311 [PDF p. 335])",
    "pdfUrl": "assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf",
    "pdfLabel": "PLO_Easy_Problems.pdf (p. 68)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 12,
    "uniqueSkillTaught": "Constructing a bipartite morpheme-connection graph (roots × derivational suffixes for place -tegi, tool -gailu, group -talde, companion -kide, keeper -zain) to solve an unordered matrix without guessing.",
    "weakAreasTargeted": []
  },
  {
    "id": 65,
    "exactName": "Problem 1: miks salat",
    "sourceAndYear": "PLO 2026 Round 1 (PLO_26'_Senior_Junior.pdf, pp. 1–2)",
    "pdfUrl": "assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf",
    "pdfLabel": "PLO_26'_Senior_Junior.pdf (pp. 1–2)",
    "division": "All",
    "difficulty": "Easy",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 14,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 1 (PLO 2026 Senior & Junior)",
    "uniqueSkillTaught": "Comparative creole lexical semantics and calquing across Nigerian Pidgin (Naijá) and Tok Pisin (\"eye-water\" = tear, \"grass belong head\" = hair).",
    "weakAreasTargeted": []
  },
  {
    "id": 66,
    "exactName": "IOL 2016 Problem 1: Aralle-Tabulahan",
    "alias": "Yellow Book Problem 10.8 (Aralle-Tabulahan, p. 388 [PDF p. 412])",
    "sourceAndYear": "IOL 2016 Individual (IOL_2003-2026_Individual_Problems.pdf, pp. 85–86 / Yellow Book p. 388 [PDF p. 412])",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (pp. 85–86)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 12,
    "uniqueSkillTaught": "Topographical and riverine spatial deixis (upriver vs. downriver, uphill vs. downhill, and level/across-stream motion verbs) used to reconstruct a 9-village elevation map.",
    "weakAreasTargeted": []
  },
  {
    "id": 67,
    "exactName": "Problem 4: Kubeo",
    "sourceAndYear": "PLO 2021 Round 1 (PLO_21'_Senior_Junior.pdf, pp. 7–8)",
    "pdfUrl": "assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf",
    "pdfLabel": "PLO_21'_Senior_Junior.pdf (pp. 7–8)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 12,
    "uniqueSkillTaught": "Combining shape/material noun-classifier suffixes (spherical, hollow, tree/wood, filamentous, liquid) with metaphorical compound heads in an Amazonian lexicon.",
    "weakAreasTargeted": []
  },
  {
    "id": 68,
    "exactName": "Problem 4: Karuk",
    "sourceAndYear": "PLO 2026 Round 1 (PLO_26'_Senior_Junior.pdf, pp. 7–8)",
    "pdfUrl": "assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf",
    "pdfLabel": "PLO_26'_Senior_Junior.pdf (pp. 7–8)",
    "division": "All",
    "difficulty": "Medium",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 14,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 1 (PLO 2026 Senior & Junior)",
    "uniqueSkillTaught": "Cross-domain semantic compounding linking animal metaphors, months of the year, and body-part numerals into a single integrated lexical network.",
    "weakAreasTargeted": []
  },
  {
    "id": 69,
    "exactName": "3. Singing it in Tlingit",
    "sourceAndYear": "PLO 2024 Round 1 (PLO_24'_Senior.pdf, pp. 5–6)",
    "pdfUrl": "assets/aistudio/PLO_24__Senior_76504da1.pdf",
    "pdfLabel": "PLO_24'_Senior.pdf (pp. 5–6)",
    "division": "Senior",
    "difficulty": "Medium",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 16,
    "isMockPaper": true,
    "mockPaperName": "Mock Paper 3 (PLO 2024 Senior)",
    "uniqueSkillTaught": "Decomposing multi-word descriptive compounds and anatomical/technological metaphors in Tlingit (\"ear-ring\", \"foot-cousin\", \"mouth-hair\").",
    "weakAreasTargeted": []
  },
  {
    "id": 70,
    "exactName": "Problem No. 6 (25 Points): Malagasy",
    "alias": "Cheesy Malagasy / Yellow Book Problem 8.8 (Malagasy, p. 314 [PDF p. 338])",
    "sourceAndYear": "PLO Round 1 (PLO_Medium_Hard_Expert_Problems.pdf, p. 9 / Yellow Book p. 314 [PDF p. 338])",
    "pdfUrl": "assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf",
    "pdfLabel": "PLO_Medium_Hard_Expert_Problems.pdf (p. 9)",
    "division": "All",
    "difficulty": "Hard",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 12,
    "uniqueSkillTaught": "Multi-part idiomatic compound phrases where literal constituent meanings (\"sun's eye\", \"water's child\", \"frog's thigh\") map simultaneously to figurative glosses and possession rules.",
    "weakAreasTargeted": []
  },
  {
    "id": 71,
    "exactName": "IOL 2024 Problem 3: Komnzo Kinship",
    "sourceAndYear": "IOL 2024 Individual (IOL_2003-2026_Individual_Problems.pdf, p. 144)",
    "pdfUrl": "assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf",
    "pdfLabel": "IOL_2003-2026_Individual_Problems.pdf (p. 144)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 12,
    "uniqueSkillTaught": "Solving a Papuan direct sister-exchange marriage kinship system where maternal and paternal cross-cousin/in-law terms merge symmetrically alongside ergative/possessive cases.",
    "weakAreasTargeted": [
      "Morphosyntactic Alignment"
    ]
  },
  {
    "id": 72,
    "exactName": "Problem 7: Twisted Translations",
    "alias": "PLO Camp 26' Problem 64. Word Embeddings (PLO, 2020)",
    "sourceAndYear": "PLO 2020 Round 1 (PLO_Camp_26'.pdf, pp. 44–45 / PLO_20'_Senior_Junior.pdf, pp. 11–12)",
    "pdfUrl": "assets/aistudio/PLO_Camp_26__c6119aea.pdf",
    "pdfLabel": "PLO_Camp_26'.pdf (pp. 44–45)",
    "division": "Senior",
    "difficulty": "Hard",
    "chapterId": "ch8",
    "chapterNumber": 8,
    "scheduledDay": 12,
    "uniqueSkillTaught": "Solving an NLP vector-space / distributional semantics wildcard using semantic proximity clues and morphological paradigms to align an obfuscated Hrangkhol corpus.",
    "weakAreasTargeted": []
  }
];

export const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    "day": 1,
    "dateLabel": "Fri, 13 Nov 2026",
    "focusTitle": "Ch 1 Intro + Ch 2: Writing Systems — Braille, Featural Blocks & IOL Book Pahlavi Heterograms",
    "theoryReading": "Yellow Book Ch 1 (1.1–1.5, pp. 1–10 [PDF pp. 25–34]) & Ch 2 (2.1–2.11, pp. 11–29 [PDF pp. 35–53])",
    "timeBreakdown": "1.0h Theory + 3.0h Problems (3)",
    "problemIds": [
      1,
      2,
      3
    ],
    "isMockExamDay": false,
    "mockNote": "Problem #04 (Old Persian) is held for Day 15 Timed Mock Paper 2."
  },
  {
    "day": 2,
    "dateLabel": "Sat, 14 Nov 2026",
    "focusTitle": "Ch 4: Phonology — Rendaku, Rule Ordering, IOL Kuria Tone & IOL Central Yup’ik Stress",
    "theoryReading": "Yellow Book Ch 3 (3.2 & 3.5–3.6, pp. 50–58, 69–74 [PDF pp. 74–82, 93–98]) & Ch 4 (4.1–4.6, pp. 91–124 [PDF pp. 115–148])",
    "timeBreakdown": "1.0h Theory + 3.0h Problems (5)",
    "problemIds": [
      5,
      6,
      7,
      9,
      10
    ],
    "isMockExamDay": false,
    "mockNote": "Problem #08 (GaeilGo Doesn’t Go) is held for Day 16 Timed Mock Paper 3."
  },
  {
    "day": 3,
    "dateLabel": "Sun, 15 Nov 2026",
    "focusTitle": "Ch 5: Noun & NP — Possession, IOL Kilivila Classifiers & Infixes/Transfixes (Part 1)",
    "theoryReading": "Yellow Book Ch 5 (5.1–5.8, pp. 145–179 [PDF pp. 169–203])",
    "timeBreakdown": "1.0h Theory + 3.0h Problems (5)",
    "problemIds": [
      11,
      12,
      13,
      14,
      15
    ],
    "isMockExamDay": false
  },
  {
    "day": 4,
    "dateLabel": "Mon, 16 Nov 2026",
    "focusTitle": "Ch 5: Noun & NP — Ilocano Reduplication, IOL Terêna Nasal Spread & Iaai Possession (Part 2)",
    "theoryReading": "Yellow Book Ch 5 Practice & Solutions (5.9–5.10, pp. 180–198 [PDF pp. 204–222])",
    "timeBreakdown": "0.75h Review + 3.25h Problems (3)",
    "problemIds": [
      16,
      17,
      21
    ],
    "isMockExamDay": false,
    "mockNote": "Problems #18 (Nanti), #19 (Romanian), and #20 (When it clicks…) are held for Days 15–16 Mocks."
  },
  {
    "day": 5,
    "dateLabel": "Tue, 17 Nov 2026",
    "focusTitle": "Ch 6: Verb & VP — TAM & Evidentiality (Part 1 — Builds on Ch 5 Nouns)",
    "theoryReading": "Yellow Book Ch 6 (6.1–6.6, pp. 199–222 [PDF pp. 223–246])",
    "timeBreakdown": "1.0h Theory + 3.0h Problems (5)",
    "problemIds": [
      22,
      23,
      24,
      25,
      26
    ],
    "isMockExamDay": false
  },
  {
    "day": 6,
    "dateLabel": "Wed, 18 Nov 2026",
    "focusTitle": "Ch 6: Verb & VP — IOL Plains Cree Hierarchy, Fluid-S & IOL Nooni (Part 2)",
    "theoryReading": "Yellow Book Ch 6 (6.7–6.8, pp. 223–232 [PDF pp. 247–256])",
    "timeBreakdown": "0.75h Theory + 3.25h Problems (5)",
    "problemIds": [
      27,
      28,
      29,
      30,
      31
    ],
    "isMockExamDay": false
  },
  {
    "day": 7,
    "dateLabel": "Thu, 19 Nov 2026",
    "focusTitle": "Ch 6: Verb & VP — IOL Hakhun, IOL Alabama & Expert Synthesis (Part 3)",
    "theoryReading": "Yellow Book Ch 6 Practice & Solutions (6.9–6.10, pp. 233–256 [PDF pp. 257–280])",
    "timeBreakdown": "4.0h Deep Problem Solving (5)",
    "problemIds": [
      32,
      33,
      34,
      35,
      36
    ],
    "isMockExamDay": false
  },
  {
    "day": 8,
    "dateLabel": "Fri, 20 Nov 2026",
    "focusTitle": "Ch 7: Syntax — Alignment & Polish Logic (Part 1 — Combines Ch 5 Nouns + Ch 6 Verbs)",
    "theoryReading": "Yellow Book Ch 7 (7.1–7.5, pp. 257–275 [PDF pp. 281–299])",
    "timeBreakdown": "1.0h Theory + 3.0h Problems (5)",
    "problemIds": [
      37,
      38,
      39,
      40,
      41
    ],
    "isMockExamDay": false
  },
  {
    "day": 9,
    "dateLabel": "Sat, 21 Nov 2026",
    "focusTitle": "Ch 7: Syntax — IOL Dyirbal, IOL Wambaya, IOL Iquito & Switch-Ref (Part 2)",
    "theoryReading": "Yellow Book Ch 7 Alignment & Practice (7.4–7.7, pp. 269–298 [PDF pp. 293–322])",
    "timeBreakdown": "0.5h Review + 3.5h Problems (5)",
    "problemIds": [
      46,
      47,
      48,
      49,
      50
    ],
    "isMockExamDay": false,
    "mockNote": "Problems #42 (Dhivehi), #43 (Icari Dargwa), #44 (Epun), and #45 (Wiradjuri) are held for Days 14–16 Mocks."
  },
  {
    "day": 10,
    "dateLabel": "Sun, 22 Nov 2026",
    "focusTitle": "Ch 9: Number Systems (Part 1 — Bases, Overcounting & Subtraction)",
    "theoryReading": "Yellow Book Ch 9 (9.1–9.5, pp. 321–352 [PDF pp. 345–376])",
    "timeBreakdown": "1.0h Theory + 3.0h Problems (6)",
    "problemIds": [
      51,
      52,
      53,
      54,
      55,
      56
    ],
    "isMockExamDay": false
  },
  {
    "day": 11,
    "dateLabel": "Mon, 23 Nov 2026",
    "focusTitle": "Ch 9: Number Systems (Part 2 — Tallies, IOL Birom, Equations & IOL Dzongkha)",
    "theoryReading": "Yellow Book Ch 9 Practice & Solutions (9.6–9.7, pp. 353–364 [PDF pp. 377–388])",
    "timeBreakdown": "0.5h Review + 3.5h Problems (6)",
    "problemIds": [
      57,
      58,
      59,
      60,
      61,
      62
    ],
    "isMockExamDay": false,
    "mockNote": "Problem #63 (Jowulu) is held unseen for Day 16 Timed Mock Paper 3."
  },
  {
    "day": 12,
    "dateLabel": "Tue, 24 Nov 2026",
    "focusTitle": "Ch 8: Semantics — Basque, IOL Aralle-Tabulahan, Kubeo, Malagasy, IOL Komnzo & Vectors",
    "theoryReading": "Yellow Book Ch 8 (8.1–8.3, pp. 299–314 [PDF pp. 323–338]) & Ch 10 (10.1–10.2, pp. 365–379 [PDF pp. 389–403])",
    "timeBreakdown": "0.75h Theory + 3.25h Problems (6)",
    "problemIds": [
      64,
      66,
      67,
      70,
      71,
      72
    ],
    "isMockExamDay": false,
    "mockNote": "Problems #65 (miks salat), #68 (Karuk), and #69 (Singing it in Tlingit) are held for Days 14 & 16 Mocks."
  },
  {
    "day": 13,
    "dateLabel": "Wed, 25 Nov 2026",
    "focusTitle": "Wildcard Insurance & Weak-Area Error-Log Redo",
    "theoryReading": "Re-read personal notes & redo every problem flagged \"Review Needed\"",
    "timeBreakdown": "1.5h Weak-Area Synthesis + 2.5h Error-Log Redo",
    "problemIds": [],
    "isMockExamDay": false,
    "mockNote": "Dedicated buffer day to re-solve all problems marked \"Review Needed\" before entering the 3-day timed mock block."
  },
  {
    "day": 14,
    "dateLabel": "Thu, 26 Nov 2026",
    "focusTitle": "Timed Mock Paper 1: PLO 2026 Senior & Junior Round 1",
    "theoryReading": "Strict exam simulation (PLO_26'_Senior_Junior.pdf — Mongolian skipped as already solved)",
    "timeBreakdown": "3.0h Timed Paper + 1.0h Post-Mortem Grading",
    "problemIds": [
      65,
      68,
      42
    ],
    "isMockExamDay": true
  },
  {
    "day": 15,
    "dateLabel": "Fri, 27 Nov 2026",
    "focusTitle": "Timed Mock Paper 2: PLO 2023 Senior Round 1",
    "theoryReading": "Strict 5-problem Senior paper simulation (PLO_23'_Senior.pdf)",
    "timeBreakdown": "3.0h Timed Paper + 1.0h Post-Mortem Grading",
    "problemIds": [
      18,
      19,
      43,
      44,
      4
    ],
    "isMockExamDay": true
  },
  {
    "day": 16,
    "dateLabel": "Sat, 28 Nov 2026",
    "focusTitle": "Timed Mock Paper 3: PLO 2024 Senior Round 1",
    "theoryReading": "Strict 5-problem Senior paper simulation (PLO_24'_Senior.pdf)",
    "timeBreakdown": "3.0h Timed Paper + 1.0h Final Checklist Review",
    "problemIds": [
      63,
      8,
      69,
      45,
      20
    ],
    "isMockExamDay": true
  }
];

export const PATTERN_LANDSCAPE: PatternLandscapeRow[] = [
  {
    "rank": 1,
    "problemType": "Verbal Morphology (TAM, Argument Indexing, Pronoun Hierarchy, Evidentiality, Valence)",
    "count": 38,
    "share": "18.2%",
    "typicalDifficulty": "Medium – Hard",
    "yellowBookChapter": "Chapter 6 (Verb and verb phrase)",
    "category": "High-Frequency Core"
  },
  {
    "rank": 2,
    "problemType": "Number Systems, Arithmetic Equations & Calendar/Time Reckoning",
    "count": 36,
    "share": "17.2%",
    "typicalDifficulty": "Easy – Medium",
    "yellowBookChapter": "Chapter 9 (Number systems)",
    "category": "High-Frequency Core"
  },
  {
    "rank": 3,
    "problemType": "Clause Syntax, Morphosyntactic Alignment (Ergative / Split), Word Order & Clitics",
    "count": 32,
    "share": "15.3%",
    "typicalDifficulty": "Medium – Expert",
    "yellowBookChapter": "Chapter 7 (Syntax)",
    "category": "High-Frequency Core"
  },
  {
    "rank": 4,
    "problemType": "Nominal Morphology (Noun Classes, Possession, Case, Number, Reduplication, Infixes/Transfixes)",
    "count": 30,
    "share": "14.4%",
    "typicalDifficulty": "Easy – Hard",
    "yellowBookChapter": "Chapter 5 (Noun and noun phrase)",
    "category": "High-Frequency Core"
  },
  {
    "rank": 5,
    "problemType": "Lexical Semantics, Compounding, Spatial Deixis, Kinship & Word Embeddings",
    "count": 24,
    "share": "11.5%",
    "typicalDifficulty": "Easy – Hard",
    "yellowBookChapter": "Chapter 8 (Semantics) + Ch 10",
    "category": "High-Frequency Core"
  },
  {
    "rank": 6,
    "problemType": "Phonological Alternations (Assimilation, Vowel Harmony, Autosegmental Tone, Stress, Orthography)",
    "count": 21,
    "share": "10.0%",
    "typicalDifficulty": "Medium – Hard",
    "yellowBookChapter": "Chapter 4 (Phonology) + Ch 3",
    "category": "Medium-Frequency Anchor"
  },
  {
    "rank": 7,
    "problemType": "Writing Systems (Abugidas, Abjads/Heterograms, Cuneiform, Braille & Featural Scripts)",
    "count": 13,
    "share": "6.2%",
    "typicalDifficulty": "Easy – Hard",
    "yellowBookChapter": "Chapter 2 (Writing systems)",
    "category": "Medium-Frequency Anchor"
  },
  {
    "rank": 8,
    "problemType": "Suprasegmental Phonetics (Iambic Stress Windows, Syllable Weight & Poetic Metre)",
    "count": 8,
    "share": "3.8%",
    "typicalDifficulty": "Medium – Hard",
    "yellowBookChapter": "Chapter 3 (Covered via IOL 2026 Central Yup’ik in Ch 4)",
    "category": "Wildcard"
  },
  {
    "rank": 9,
    "problemType": "Kinship Systems & Spatial/Topographic Orientation",
    "count": 7,
    "share": "3.3%",
    "typicalDifficulty": "Medium – Hard",
    "yellowBookChapter": "Chapter 10 (Covered via IOL 2016 Aralle-Tabulahan & IOL 2024 Komnzo in Ch 8)",
    "category": "Wildcard"
  }
];

export const DROPPED_CHAPTERS = [
  {
    "chapter": "Chapter 1: Introduction to linguistics problems (pp. 1–10 [PDF pp. 25–34])",
    "reason": "Contains 0 problems—it is purely a 10-page methodological introduction covering Rosetta Stone vs. Chaos-and-Order structures, solution writing, and the zero morpheme (∅). Assigned as a 30-minute theory warm-up on Day 1."
  },
  {
    "chapter": "Chapter 3: Phonetics — Folded into Chapter 4 via IOL 2025 Kuria & IOL 2026 Central Yup’ik (pp. 49–89 [PDF pp. 73–113])",
    "reason": "Instead of a separate low-yield chapter, articulatory features (§3.2, pp. 50–58), stress windows (§3.5, pp. 69–73), and autosegmental tone (§3.6, p. 74) are integrated directly into Chapter 4 via IOL 2025 Kuria (#07) and IOL 2026 Central Yup’ik (#09)."
  },
  {
    "chapter": "Chapter 10: Other types of problems — Folded into Chapter 8 via IOL 2016 Aralle-Tabulahan & IOL 2024 Komnzo (pp. 365–396 [PDF pp. 389–420])",
    "reason": "Topographical/riverine orientation (§10.1, pp. 365–368) and kinship exchange graphs (§10.2, pp. 369–379) are now directly trained inside Chapter 8 via IOL 2016 Problem 1: Aralle-Tabulahan (#66, YB Problem 10.8 on p. 388) and IOL 2024 Problem 3: Komnzo Kinship (#71), plus royal genealogy in Problem #04 (Old Persian)."
  }
];

export const CORPUS_FLAGS = [
  {
    "title": "IOL 2003–2026 Individual Problems Integrated (72-Problem Expanded Edition)",
    "detail": "7 overlapping regional/textbook exercises (Yup’ik 9.3, Proto-Algonquian 6.5, Arabic 7.7, Sixteen Japanese Phrases, Turkish 8.4, Nasal Consonants 4.3, and Javanese 2.10) were swapped out and replaced with 15 gold-standard IOL Individual Problems (2012–2026) from IOL_2003-2026_Individual_Problems.pdf, bringing the curriculum to 72 problems."
  },
  {
    "title": "PLO 2026 Senior & Junior Paper (PLO_26'_Senior_Junior.pdf)",
    "detail": "The booklet PLO_26'_Senior_Junior.pdf is labelled PLO 2026 Senior & Junior and serves as Timed Mock Paper 1 on Day 14 (Problems #65 miks salat, #68 Karuk, and #42 Dhivehi; Problem 3 Mongolian and Problem 2 Luwian are skipped as already solved)."
  },
  {
    "title": "Three Separate PLO 2023 PDFs Attached",
    "detail": "Always use PLO_23'_Senior.pdf for your study and Day 15 Mock. In 2023, the Senior versions of Nanti, Icari Dargwa, and Epun include additional data sentences and harder sub-assignments omitted from the Junior booklet, plus Old Persian (Senior-only)."
  },
  {
    "title": "Font-Encoding / Caesar-Shift Corruption on Specific Compilation Pages",
    "detail": "Pages 6–9 and 12–14 of PLO_Medium_Hard_Expert_Problems.pdf and Pages 80–87 of PLO_Easy_Problems.pdf suffer from corrupted PDF font-subset tables. Every affected problem included in this 72-problem guide points to its clean, uncorrupted source file (e.g., Altai-ed up in PLO_20'_Senior_Junior.pdf p. 9; Ditema tsa Dinoko in PLO_Camp_26'.pdf p. 51; Bariai in PLO_Medium_Hard_Expert_Problems.pdf p. 15)."
  },
  {
    "title": "Blank Scanned Tables on Two Pages of PLO_Easy_Problems.pdf",
    "detail": "Page 18 (Problem No. 5: Amharic) and Page 69 (Problem No. 4: Coptic) in PLO_Easy_Problems.pdf have missing/blank scanned script images and have been excluded from the 72-problem set."
  },
  {
    "title": "Cross-File Problem Aliases Deduplicated",
    "detail": "Twisted Translations (PLO 2020) ≡ Word Embeddings (Camp #64); Triangle Script (PLO 2017) ≡ Ditema tsa Dinoko (Camp #78); Tangkhul Verbs (PLO 2013) ≡ Akham goes Shopping; Telling Time in Swahili ≡ YB 9.8; Umbu-Ungu (IOL 2012) ≡ YB 9.4; Hakhun (IOL 2018) ≡ YB 6.11; Cheesy Malagasy ≡ YB 8.8; Basque ≡ YB 8.3."
  }
];
