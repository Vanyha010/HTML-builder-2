const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;

const inputFolder = path.resolve(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  const files = await readdir(inputFolder, { withFileTypes: true });
  const outputStream = fs.createWriteStream(outputFile);
  files.forEach(async (file) => {
    if (file.name.endsWith('.css')) {
      const inputStream = fs.createReadStream(
        path.join(inputFolder, file.name),
      );
      await inputStream.pipe(outputStream);
    }
  });
}

mergeStyles().catch(console.error);
