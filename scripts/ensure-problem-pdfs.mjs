import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'data', 'problemPagesManifest.ts');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OUTPUT_PDF_DIR = path.join(PUBLIC_DIR, 'problems', 'pdf');

async function parseManifest() {
  const source = await fs.readFile(MANIFEST_PATH, 'utf8');
  const entries = [];
  const blockRegex = /(\d+):\s*\{([\s\S]*?)\n\s*\}/g;
  let match;
  while ((match = blockRegex.exec(source)) !== null) {
    const id = Number(match[1]);
    const body = match[2];
    const singleMatch = body.match(/singlePdfUrl:\s*'([^']+)'/);
    const fullMatch = body.match(/fullPdfPageUrl:\s*'([^']+)'/);
    const startMatch = body.match(/startPage:\s*(\d+)/);
    const endMatch = body.match(/endPage:\s*(\d+)/);
    if (!singleMatch || !fullMatch || !startMatch || !endMatch) continue;

    const singlePdfUrl = singleMatch[1];
    const fullPdfPageUrl = fullMatch[1].split('#')[0];
    const startPage = Number(startMatch[1]);
    const endPage = Number(endMatch[1]);

    const extraPages = [];
    const extraRegex = /\{\s*pdfPath:\s*'([^']+)',\s*page:\s*(\d+)\s*\}/g;
    let em;
    while ((em = extraRegex.exec(body)) !== null) {
      extraPages.push({ pdfPath: em[1], page: Number(em[2]) });
    }

    entries.push({ id, singlePdfUrl, fullPdfPageUrl, startPage, endPage, extraPages });
  }
  return entries;
}

async function fileExistsNonEmpty(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile() && stat.size > 500;
  } catch {
    return false;
  }
}

async function main() {
  const force = process.argv.includes('--force');
  await fs.mkdir(OUTPUT_PDF_DIR, { recursive: true });
  const entries = await parseManifest();
  if (entries.length !== 72) {
    throw new Error(`Expected 72 entries in problemPagesManifest.ts, found ${entries.length}`);
  }

  if (!force) {
    let missingCount = 0;
    for (const entry of entries) {
      const outPath = path.join(PUBLIC_DIR, entry.singlePdfUrl);
      if (!(await fileExistsNonEmpty(outPath))) {
        missingCount++;
      }
    }
    if (missingCount === 0) {
      console.log('[ensure-problem-pdfs] All 72 standalone problem PDFs are present.');
      return;
    }
    console.log(`[ensure-problem-pdfs] Generating ${missingCount} standalone problem PDFs...`);
  } else {
    console.log('[ensure-problem-pdfs] Force-regenerating all 72 standalone problem PDFs...');
  }

  const sourcePdfCache = new Map();
  async function getSourceDoc(relPath) {
    const fullPath = path.join(PUBLIC_DIR, relPath);
    let doc = sourcePdfCache.get(fullPath);
    if (!doc) {
      const bytes = await fs.readFile(fullPath);
      doc = await PDFDocument.load(bytes);
      sourcePdfCache.set(fullPath, doc);
    }
    return doc;
  }

  for (const entry of entries) {
    const outPath = path.join(PUBLIC_DIR, entry.singlePdfUrl);
    if (!force && (await fileExistsNonEmpty(outPath))) {
      continue;
    }

    const srcDoc = await getSourceDoc(entry.fullPdfPageUrl);
    const outDoc = await PDFDocument.create();
    const totalPages = srcDoc.getPageCount();
    const pageIndices = [];
    for (let p = entry.startPage; p <= entry.endPage; p++) {
      const idx = Math.max(0, Math.min(totalPages - 1, p - 1));
      pageIndices.push(idx);
    }

    const copiedPages = await outDoc.copyPages(srcDoc, pageIndices);
    for (const page of copiedPages) {
      outDoc.addPage(page);
    }

    for (const extra of entry.extraPages) {
      const extraDoc = await getSourceDoc(extra.pdfPath);
      const extraTotal = extraDoc.getPageCount();
      const extraIdx = Math.max(0, Math.min(extraTotal - 1, extra.page - 1));
      const [copiedExtra] = await outDoc.copyPages(extraDoc, [extraIdx]);
      outDoc.addPage(copiedExtra);
    }

    const pdfBytes = await outDoc.save();
    await fs.writeFile(outPath, pdfBytes);
  }

  console.log('[ensure-problem-pdfs] Successfully generated all 72 standalone problem PDFs.');
}

main().catch((err) => {
  console.error('[ensure-problem-pdfs] Error:', err);
  process.exit(1);
});
