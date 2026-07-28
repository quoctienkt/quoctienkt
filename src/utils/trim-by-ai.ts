import { removeBackground } from '@imgly/background-removal-node';
import { pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

/**
 * Recursively find all PNG files in a directory
 */
function getPngFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getPngFiles(filePath, fileList);
    } else if (path.extname(file).toLowerCase() === '.png') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

/**
 * Process an image to remove background using AI
 */
async function processImage(filePath: string) {
  try {
    const fileName = path.basename(filePath);
    console.log(`Processing with AI: ${fileName}...`);

    // Convert absolute path to file:// URL for the library to correctly handle it on Windows
    const fileUrl = pathToFileURL(path.resolve(filePath)).href;

    // removeBackground handles the AI detection and background removal.
    const blob = await removeBackground(fileUrl);
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Overwrite the original
    fs.writeFileSync(filePath, buffer);

    console.log(`✅ AI Refined: ${fileName}`);
  } catch (error) {
    console.error(`❌ AI Error processing ${filePath}:`, error);
  }
}

async function main() {
  const targetDir = process.argv[2];

  if (!targetDir) {
    console.error('Please provide a target directory.');
    process.exit(1);
  }

  const absoluteDir = path.resolve(process.cwd(), targetDir);

  if (!fs.existsSync(absoluteDir)) {
    console.error(`Directory not found: ${absoluteDir}`);
    process.exit(1);
  }

  console.log(`Searching for PNGs in: ${absoluteDir}`);
  const files = getPngFiles(absoluteDir);
  console.log(`Found ${files.length} PNG images.`);

  // Process sequentially to avoid memory issues with AI models
  for (const file of files) {
    await processImage(file);
  }

  console.log('\nDone! All images refined by AI.');
}

main();
