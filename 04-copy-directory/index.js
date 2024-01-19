const { mkdir, readdir } = require('fs').promises;
const fs = require('fs');
const path = require('path');

async function copyDir() {
  const initialFolder = path.join(__dirname, 'files');
  const copyFolder = path.join(__dirname, 'files-copy');
  await mkdir(copyFolder, { recursive: true });

  const files = await readdir(initialFolder, { withFileTypes: true });
  for (let file of files) {
    // Option 1
    // const input = fs.createReadStream(path.resolve(initialFolder, file.name));
    // const output = fs.createWriteStream(path.resolve(copyFolder, file.name));
    // input.pipe(output);

    // Option 2
    const fileToCopy = path.resolve(initialFolder, file.name);
    const fileToPaste = path.resolve(copyFolder, file.name);
    fs.copyFile(fileToCopy, fileToPaste, (err) => {
      if (err) throw err;
    });
  }
}

copyDir().catch(console.error);
