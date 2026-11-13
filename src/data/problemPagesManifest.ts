export interface ProblemPdfAsset {
  singlePdfUrl: string;
  fullPdfPageUrl: string;
  startPage: number;
  endPage: number;
  pageCount: number;
  pageImages: string[];
  extraPages?: { pdfPath: string; page: number }[];
}

export const PROBLEM_PDF_MANIFEST: Record<number, ProblemPdfAsset> = {
  1: {
    singlePdfUrl: 'problems/pdf/problem-01.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf#page=3',
    startPage: 3,
    endPage: 4,
    pageCount: 2,
    pageImages: ["problems/pages/problem-01-1.png","problems/pages/problem-01-2.png"]
  },
  2: {
    singlePdfUrl: 'problems/pdf/problem-02.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf#page=52',
    startPage: 52,
    endPage: 53,
    pageCount: 2,
    pageImages: ["problems/pages/problem-02-1.png","problems/pages/problem-02-2.png"]
  },
  3: {
    singlePdfUrl: 'problems/pdf/problem-03.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=103',
    startPage: 103,
    endPage: 104,
    pageCount: 2,
    pageImages: ["problems/pages/problem-03-1.png","problems/pages/problem-03-2.png"]
  },
  4: {
    singlePdfUrl: 'problems/pdf/problem-04.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf#page=8',
    startPage: 8,
    endPage: 10,
    pageCount: 3,
    pageImages: ["problems/pages/problem-04-1.png","problems/pages/problem-04-2.png","problems/pages/problem-04-3.png"]
  },
  5: {
    singlePdfUrl: 'problems/pdf/problem-05.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=12',
    startPage: 12,
    endPage: 13,
    pageCount: 2,
    pageImages: ["problems/pages/problem-05-1.png","problems/pages/problem-05-2.png"]
  },
  6: {
    singlePdfUrl: 'problems/pdf/problem-06.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=135',
    startPage: 135,
    endPage: 136,
    pageCount: 2,
    pageImages: ["problems/pages/problem-06-1.png","problems/pages/problem-06-2.png"]
  },
  7: {
    singlePdfUrl: 'problems/pdf/problem-07.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=157',
    startPage: 157,
    endPage: 157,
    pageCount: 1,
    pageImages: ["problems/pages/problem-07-1.png"]
  },
  8: {
    singlePdfUrl: 'problems/pdf/problem-08.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf#page=3',
    startPage: 3,
    endPage: 4,
    pageCount: 2,
    pageImages: ["problems/pages/problem-08-1.png","problems/pages/problem-08-2.png"]
  },
  9: {
    singlePdfUrl: 'problems/pdf/problem-09.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=171',
    startPage: 171,
    endPage: 172,
    pageCount: 2,
    pageImages: ["problems/pages/problem-09-1.png","problems/pages/problem-09-2.png"]
  },
  10: {
    singlePdfUrl: 'problems/pdf/problem-10.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf#page=9',
    startPage: 9,
    endPage: 10,
    pageCount: 2,
    pageImages: ["problems/pages/problem-10-1.png","problems/pages/problem-10-2.png"]
  },
  11: {
    singlePdfUrl: 'problems/pdf/problem-11.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf#page=1',
    startPage: 1,
    endPage: 1,
    pageCount: 1,
    pageImages: ["problems/pages/problem-11-1.png"]
  },
  12: {
    singlePdfUrl: 'problems/pdf/problem-12.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=188',
    startPage: 188,
    endPage: 190,
    pageCount: 3,
    pageImages: ["problems/pages/problem-12-1.png","problems/pages/problem-12-2.png","problems/pages/problem-12-3.png"]
  },
  13: {
    singlePdfUrl: 'problems/pdf/problem-13.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=115',
    startPage: 115,
    endPage: 115,
    pageCount: 1,
    pageImages: ["problems/pages/problem-13-1.png"]
  },
  14: {
    singlePdfUrl: 'problems/pdf/problem-14.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=204',
    startPage: 204,
    endPage: 204,
    pageCount: 1,
    pageImages: ["problems/pages/problem-14-1.png"]
  },
  15: {
    singlePdfUrl: 'problems/pdf/problem-15.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=207',
    startPage: 207,
    endPage: 208,
    pageCount: 2,
    pageImages: ["problems/pages/problem-15-1.png","problems/pages/problem-15-2.png"]
  },
  16: {
    singlePdfUrl: 'problems/pdf/problem-16.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=209',
    startPage: 209,
    endPage: 209,
    pageCount: 1,
    pageImages: ["problems/pages/problem-16-1.png"]
  },
  17: {
    singlePdfUrl: 'problems/pdf/problem-17.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=98',
    startPage: 98,
    endPage: 98,
    pageCount: 1,
    pageImages: ["problems/pages/problem-17-1.png"]
  },
  18: {
    singlePdfUrl: 'problems/pdf/problem-18.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf#page=3',
    startPage: 3,
    endPage: 4,
    pageCount: 2,
    pageImages: ["problems/pages/problem-18-1.png","problems/pages/problem-18-2.png"]
  },
  19: {
    singlePdfUrl: 'problems/pdf/problem-19.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf#page=4',
    startPage: 4,
    endPage: 5,
    pageCount: 2,
    pageImages: ["problems/pages/problem-19-1.png","problems/pages/problem-19-2.png"]
  },
  20: {
    singlePdfUrl: 'problems/pdf/problem-20.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf#page=7',
    startPage: 7,
    endPage: 8,
    pageCount: 2,
    pageImages: ["problems/pages/problem-20-1.png","problems/pages/problem-20-2.png"]
  },
  21: {
    singlePdfUrl: 'problems/pdf/problem-21.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=210',
    startPage: 210,
    endPage: 212,
    pageCount: 3,
    pageImages: ["problems/pages/problem-21-1.png","problems/pages/problem-21-2.png","problems/pages/problem-21-3.png"]
  },
  22: {
    singlePdfUrl: 'problems/pdf/problem-22.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=20',
    startPage: 20,
    endPage: 20,
    pageCount: 1,
    pageImages: ["problems/pages/problem-22-1.png"]
  },
  23: {
    singlePdfUrl: 'problems/pdf/problem-23.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=23',
    startPage: 23,
    endPage: 23,
    pageCount: 1,
    pageImages: ["problems/pages/problem-23-1.png"]
  },
  24: {
    singlePdfUrl: 'problems/pdf/problem-24.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=7',
    startPage: 7,
    endPage: 8,
    pageCount: 2,
    pageImages: ["problems/pages/problem-24-1.png","problems/pages/problem-24-2.png"]
  },
  25: {
    singlePdfUrl: 'problems/pdf/problem-25.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf#page=4',
    startPage: 4,
    endPage: 4,
    pageCount: 2,
    pageImages: ["problems/pages/problem-25-1.png","problems/pages/problem-25-2.png"],
    extraPages: [{"pdfPath":"assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf","page":14}]
  },
  26: {
    singlePdfUrl: 'problems/pdf/problem-26.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=258',
    startPage: 258,
    endPage: 260,
    pageCount: 3,
    pageImages: ["problems/pages/problem-26-1.png","problems/pages/problem-26-2.png","problems/pages/problem-26-3.png"]
  },
  27: {
    singlePdfUrl: 'problems/pdf/problem-27.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=243',
    startPage: 243,
    endPage: 243,
    pageCount: 1,
    pageImages: ["problems/pages/problem-27-1.png"]
  },
  28: {
    singlePdfUrl: 'problems/pdf/problem-28.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=139',
    startPage: 139,
    endPage: 139,
    pageCount: 1,
    pageImages: ["problems/pages/problem-28-1.png"]
  },
  29: {
    singlePdfUrl: 'problems/pdf/problem-29.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=254',
    startPage: 254,
    endPage: 255,
    pageCount: 2,
    pageImages: ["problems/pages/problem-29-1.png","problems/pages/problem-29-2.png"]
  },
  30: {
    singlePdfUrl: 'problems/pdf/problem-30.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=24',
    startPage: 24,
    endPage: 24,
    pageCount: 1,
    pageImages: ["problems/pages/problem-30-1.png"]
  },
  31: {
    singlePdfUrl: 'problems/pdf/problem-31.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=105',
    startPage: 105,
    endPage: 106,
    pageCount: 2,
    pageImages: ["problems/pages/problem-31-1.png","problems/pages/problem-31-2.png"]
  },
  32: {
    singlePdfUrl: 'problems/pdf/problem-32.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=261',
    startPage: 261,
    endPage: 262,
    pageCount: 2,
    pageImages: ["problems/pages/problem-32-1.png","problems/pages/problem-32-2.png"]
  },
  33: {
    singlePdfUrl: 'problems/pdf/problem-33.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=97',
    startPage: 97,
    endPage: 97,
    pageCount: 1,
    pageImages: ["problems/pages/problem-33-1.png"]
  },
  34: {
    singlePdfUrl: 'problems/pdf/problem-34.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=124',
    startPage: 124,
    endPage: 124,
    pageCount: 1,
    pageImages: ["problems/pages/problem-34-1.png"]
  },
  35: {
    singlePdfUrl: 'problems/pdf/problem-35.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=264',
    startPage: 264,
    endPage: 265,
    pageCount: 2,
    pageImages: ["problems/pages/problem-35-1.png","problems/pages/problem-35-2.png"]
  },
  36: {
    singlePdfUrl: 'problems/pdf/problem-36.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf#page=34',
    startPage: 34,
    endPage: 34,
    pageCount: 1,
    pageImages: ["problems/pages/problem-36-1.png"]
  },
  37: {
    singlePdfUrl: 'problems/pdf/problem-37.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=39',
    startPage: 39,
    endPage: 39,
    pageCount: 1,
    pageImages: ["problems/pages/problem-37-1.png"]
  },
  38: {
    singlePdfUrl: 'problems/pdf/problem-38.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf#page=3',
    startPage: 3,
    endPage: 4,
    pageCount: 2,
    pageImages: ["problems/pages/problem-38-1.png","problems/pages/problem-38-2.png"]
  },
  39: {
    singlePdfUrl: 'problems/pdf/problem-39.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=293',
    startPage: 293,
    endPage: 294,
    pageCount: 2,
    pageImages: ["problems/pages/problem-39-1.png","problems/pages/problem-39-2.png"]
  },
  40: {
    singlePdfUrl: 'problems/pdf/problem-40.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf#page=1',
    startPage: 1,
    endPage: 2,
    pageCount: 2,
    pageImages: ["problems/pages/problem-40-1.png","problems/pages/problem-40-2.png"]
  },
  41: {
    singlePdfUrl: 'problems/pdf/problem-41.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf#page=7',
    startPage: 7,
    endPage: 8,
    pageCount: 2,
    pageImages: ["problems/pages/problem-41-1.png","problems/pages/problem-41-2.png"]
  },
  42: {
    singlePdfUrl: 'problems/pdf/problem-42.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf#page=9',
    startPage: 9,
    endPage: 10,
    pageCount: 2,
    pageImages: ["problems/pages/problem-42-1.png","problems/pages/problem-42-2.png"]
  },
  43: {
    singlePdfUrl: 'problems/pdf/problem-43.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf#page=6',
    startPage: 6,
    endPage: 6,
    pageCount: 1,
    pageImages: ["problems/pages/problem-43-1.png"]
  },
  44: {
    singlePdfUrl: 'problems/pdf/problem-44.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_23__Senior_dab9c4d4.pdf#page=7',
    startPage: 7,
    endPage: 8,
    pageCount: 2,
    pageImages: ["problems/pages/problem-44-1.png","problems/pages/problem-44-2.png"]
  },
  45: {
    singlePdfUrl: 'problems/pdf/problem-45.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf#page=6',
    startPage: 6,
    endPage: 7,
    pageCount: 2,
    pageImages: ["problems/pages/problem-45-1.png","problems/pages/problem-45-2.png"]
  },
  46: {
    singlePdfUrl: 'problems/pdf/problem-46.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=300',
    startPage: 300,
    endPage: 300,
    pageCount: 1,
    pageImages: ["problems/pages/problem-46-1.png"]
  },
  47: {
    singlePdfUrl: 'problems/pdf/problem-47.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=50',
    startPage: 50,
    endPage: 51,
    pageCount: 2,
    pageImages: ["problems/pages/problem-47-1.png","problems/pages/problem-47-2.png"]
  },
  48: {
    singlePdfUrl: 'problems/pdf/problem-48.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=78',
    startPage: 78,
    endPage: 78,
    pageCount: 1,
    pageImages: ["problems/pages/problem-48-1.png"]
  },
  49: {
    singlePdfUrl: 'problems/pdf/problem-49.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=175',
    startPage: 175,
    endPage: 175,
    pageCount: 1,
    pageImages: ["problems/pages/problem-49-1.png"]
  },
  50: {
    singlePdfUrl: 'problems/pdf/problem-50.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf#page=36',
    startPage: 36,
    endPage: 37,
    pageCount: 2,
    pageImages: ["problems/pages/problem-50-1.png","problems/pages/problem-50-2.png"]
  },
  51: {
    singlePdfUrl: 'problems/pdf/problem-51.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=65',
    startPage: 65,
    endPage: 65,
    pageCount: 1,
    pageImages: ["problems/pages/problem-51-1.png"]
  },
  52: {
    singlePdfUrl: 'problems/pdf/problem-52.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_20__Senior_Junior_e80ce274.pdf#page=5',
    startPage: 5,
    endPage: 6,
    pageCount: 2,
    pageImages: ["problems/pages/problem-52-1.png","problems/pages/problem-52-2.png"]
  },
  53: {
    singlePdfUrl: 'problems/pdf/problem-53.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf#page=5',
    startPage: 5,
    endPage: 6,
    pageCount: 2,
    pageImages: ["problems/pages/problem-53-1.png","problems/pages/problem-53-2.png"]
  },
  54: {
    singlePdfUrl: 'problems/pdf/problem-54.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=28',
    startPage: 28,
    endPage: 28,
    pageCount: 1,
    pageImages: ["problems/pages/problem-54-1.png"]
  },
  55: {
    singlePdfUrl: 'problems/pdf/problem-55.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=52',
    startPage: 52,
    endPage: 52,
    pageCount: 1,
    pageImages: ["problems/pages/problem-55-1.png"]
  },
  56: {
    singlePdfUrl: 'problems/pdf/problem-56.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=367',
    startPage: 367,
    endPage: 367,
    pageCount: 1,
    pageImages: ["problems/pages/problem-56-1.png"]
  },
  57: {
    singlePdfUrl: 'problems/pdf/problem-57.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=382',
    startPage: 382,
    endPage: 383,
    pageCount: 2,
    pageImages: ["problems/pages/problem-57-1.png","problems/pages/problem-57-2.png"]
  },
  58: {
    singlePdfUrl: 'problems/pdf/problem-58.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf#page=14',
    startPage: 14,
    endPage: 14,
    pageCount: 1,
    pageImages: ["problems/pages/problem-58-1.png"]
  },
  59: {
    singlePdfUrl: 'problems/pdf/problem-59.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=91',
    startPage: 91,
    endPage: 91,
    pageCount: 1,
    pageImages: ["problems/pages/problem-59-1.png"]
  },
  60: {
    singlePdfUrl: 'problems/pdf/problem-60.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf#page=9',
    startPage: 9,
    endPage: 9,
    pageCount: 1,
    pageImages: ["problems/pages/problem-60-1.png"]
  },
  61: {
    singlePdfUrl: 'problems/pdf/problem-61.pdf',
    fullPdfPageUrl: 'assets/aistudio/Yellow_Book__Linguistics_Olympiad_Training_Guide___1__d490d1a9.pdf#page=381',
    startPage: 381,
    endPage: 382,
    pageCount: 2,
    pageImages: ["problems/pages/problem-61-1.png","problems/pages/problem-61-2.png"]
  },
  62: {
    singlePdfUrl: 'problems/pdf/problem-62.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=155',
    startPage: 155,
    endPage: 155,
    pageCount: 1,
    pageImages: ["problems/pages/problem-62-1.png"]
  },
  63: {
    singlePdfUrl: 'problems/pdf/problem-63.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf#page=3',
    startPage: 3,
    endPage: 3,
    pageCount: 1,
    pageImages: ["problems/pages/problem-63-1.png"]
  },
  64: {
    singlePdfUrl: 'problems/pdf/problem-64.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Easy_Problems__1__c3f35e58.pdf#page=68',
    startPage: 68,
    endPage: 68,
    pageCount: 1,
    pageImages: ["problems/pages/problem-64-1.png"]
  },
  65: {
    singlePdfUrl: 'problems/pdf/problem-65.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf#page=1',
    startPage: 1,
    endPage: 2,
    pageCount: 2,
    pageImages: ["problems/pages/problem-65-1.png","problems/pages/problem-65-2.png"]
  },
  66: {
    singlePdfUrl: 'problems/pdf/problem-66.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=85',
    startPage: 85,
    endPage: 86,
    pageCount: 2,
    pageImages: ["problems/pages/problem-66-1.png","problems/pages/problem-66-2.png"]
  },
  67: {
    singlePdfUrl: 'problems/pdf/problem-67.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_21__Senior_Junior_f1cb5bd2.pdf#page=7',
    startPage: 7,
    endPage: 8,
    pageCount: 2,
    pageImages: ["problems/pages/problem-67-1.png","problems/pages/problem-67-2.png"]
  },
  68: {
    singlePdfUrl: 'problems/pdf/problem-68.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_26__Senior_Junior_11665a6e.pdf#page=7',
    startPage: 7,
    endPage: 8,
    pageCount: 2,
    pageImages: ["problems/pages/problem-68-1.png","problems/pages/problem-68-2.png"]
  },
  69: {
    singlePdfUrl: 'problems/pdf/problem-69.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_24__Senior_76504da1.pdf#page=5',
    startPage: 5,
    endPage: 6,
    pageCount: 2,
    pageImages: ["problems/pages/problem-69-1.png","problems/pages/problem-69-2.png"]
  },
  70: {
    singlePdfUrl: 'problems/pdf/problem-70.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Medium_Hard_Expert_Problems__1__4210d91e.pdf#page=9',
    startPage: 9,
    endPage: 9,
    pageCount: 1,
    pageImages: ["problems/pages/problem-70-1.png"]
  },
  71: {
    singlePdfUrl: 'problems/pdf/problem-71.pdf',
    fullPdfPageUrl: 'assets/aistudio/IOL_2003-2026_Individual_Problems_7bbe0dda.pdf#page=144',
    startPage: 144,
    endPage: 144,
    pageCount: 1,
    pageImages: ["problems/pages/problem-71-1.png"]
  },
  72: {
    singlePdfUrl: 'problems/pdf/problem-72.pdf',
    fullPdfPageUrl: 'assets/aistudio/PLO_Camp_26__c6119aea.pdf#page=44',
    startPage: 44,
    endPage: 45,
    pageCount: 2,
    pageImages: ["problems/pages/problem-72-1.png","problems/pages/problem-72-2.png"]
  }
};
