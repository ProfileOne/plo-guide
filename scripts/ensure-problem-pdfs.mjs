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
  const entryRegex = /(\d+):\s*\{\s*singlePdfUrl:\s*'([^']+)',\s*fullPdfPageUrl:\s*'([^']+)',\s*startPage:\s*(\d+),\s*endPage:\s*(\d+)/g;
  let match;
  while ((match = entryRegex.exec(source)) !== null) {
    const id = Number(match[1]);
    const singlePdfUrl = match[2];
    const fullPdfPageUrl = match[3].split('#')[0];
    const startPage = Number(match[4]);
    const endPage = Number(match[5]);
    entries.push({ id, singlePdfUrl, fullPdfPageUrl, startPage, endPage });
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
  await fs.mkdir(OUTPUT_PDF_DIR, { recursive: true });
  const entries = await parseManifest();
  if (entries.length !== 72) {
    throw new Error(`Expected 72 entries in problemPagesManifest.ts, found ${entries.length}`);
  }

  // Check if all 72 PDFs already exist
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

  // Cache loaded source PDFs
  const sourcePdfCache = new Map();

  for (const entry of entries) {
    const outPath = path.join(PUBLIC_DIR, entry.singlePdfUrl);
    if (await fileExistsNonEmpty(outPath)) {
      continue;
    }

    const srcPdfPath = path.join(PUBLIC_DIR, entry.fullPdfPageUrl);
    let srcDoc = sourcePdfCache.get(srcPdfPath);
    if (!srcDoc) {
      const bytes = await fs.readFile(srcPdfPath);
      srcDoc = await PDFDocument.load(bytes);
      sourcePdfCache.set(srcPdfPath, srcDoc);
    }

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

    const pdfBytes = await outDoc.save();
    await fs.writeFile(outPath, pdfBytes);
  }

  console.log('[ensure-problem-pdfs] Successfully generated all 72 standalone problem PDFs.');
}

main().catch((err) => {
  console.error('[ensure-problem-pdfs] Error:', err);
  process.exit(1);
});
