const path = require('path');
const { readdir, appendFile, open } = require('fs').promises;

const inputFolder = path.resolve(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  const files = await readdir(inputFolder, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.name.endsWith('.css')) {
      const fd = await open(path.join(inputFolder, file.name));
      const stream = fd.createReadStream();
      stream.on('data', async (data) => {
        await appendFile(outputFile, data);
      });
    }
  });
}

mergeStyles().catch(console.error);
