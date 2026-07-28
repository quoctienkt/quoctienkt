import sharp from 'sharp';
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
 * Process an image to remove white background using color threshold
 * This version preserves original image dimensions.
 */
async function processImage(filePath: string) {
  try {
    const fileName = path.basename(filePath);
    console.log(`Processing with Color Threshold: ${fileName}...`);

    // Use readFileSync to avoid file locking issues on Windows
    const inputBuffer = fs.readFileSync(filePath);
    const img = sharp(inputBuffer);
    const { data, info } = await img
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Convert near-white pixels to transparent
    const threshold = 230;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r > threshold && g > threshold && b > threshold) {
        const diffRG = Math.abs(r - g);
        const diffGB = Math.abs(g - b);
        const diffRB = Math.abs(r - b);

        // Checks if R, G, and B are close to each other (neutral gray/white)
        if (diffRG < 15 && diffGB < 15 && diffRB < 15) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
          count++;
        }
      }
    }

    const processedBuffer = await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();

    // Use writeFileSync to ensure the write is clean
    fs.writeFileSync(filePath, processedBuffer);

    console.log(`✅ Color Fixed: ${fileName} (${count} pixels cleared)`);
  } catch (error) {
    console.error(`❌ Color Error processing ${filePath}:`, error);
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

  for (const file of files) {
    await processImage(file);
  }

  console.log('\nDone! All images processed by color logic.');
}

main();
