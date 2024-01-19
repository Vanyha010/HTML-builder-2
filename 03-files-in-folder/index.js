const path = require('path');
const { readdir, stat } = require('fs').promises;

const source = path.resolve(__dirname, 'secret-folder');

async function readFolder() {
  try {
    const files = await readdir(source, { withFileTypes: true });
    for (const file of files) {
      try {
        const fileStat = await stat(path.join(source, file.name));
        if (file.isFile()) {
          console.log(
            `${file.name.split('.')[0]} - ${path
              .extname(file.name)
              .replace('.', '')} - ${(fileStat.size / 1024).toFixed(2)}kB`,
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readFolder();
