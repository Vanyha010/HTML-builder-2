const path = require('path');
const fs = require('fs');
const { mkdir, readdir, open, writeFile, appendFile } = require('fs').promises;

const componentsDir = path.join(__dirname, 'components');
const destinaionDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const outputStyles = path.join(destinaionDir, 'style.css');
const initialAssetsFolder = path.join(__dirname, 'assets');
const copyAssetsFolder = path.join(destinaionDir, 'assets');

async function createDirectory() {
  await mkdir(destinaionDir, { recursive: true });
}

async function bundleHTML() {
  const components = await readdir(componentsDir);
  const template = await open(path.join(__dirname, 'template.html'));
  const stream = template.createReadStream({ encoding: 'utf-8' });
  stream.on('data', async (chunk) => {
    for (let component of components) {
      const componentName = component.split('.')[0];
      const componentFd = await open(
        path.join(componentsDir, `${componentName}.html`),
      );
      const componentStream = componentFd.createReadStream({
        encoding: 'utf-8',
      });
      componentStream.on('data', (componentCode) => {
        chunk = chunk.replace(`{{${componentName}}}`, componentCode);
        writeFile(path.join(destinaionDir, 'index.html'), chunk);
      });
    }
  });
}

async function mergeStyles() {
  const files = await readdir(stylesDir, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.name.endsWith('.css')) {
      const fd = await open(path.join(stylesDir, file.name));
      const stream = fd.createReadStream();
      stream.on('data', async (data) => {
        await appendFile(outputStyles, data);
      });
    }
  });
}

async function deepCopyAssets(sourceFolder, destinationFolder) {
  await mkdir(destinationFolder, { recursive: true });

  const items = await readdir(sourceFolder, { withFileTypes: true });
  for (let item of items) {
    if (item.isDirectory()) {
      const newSourceFolder = path.join(sourceFolder, item.name);
      const newDestinationFolder = path.join(destinationFolder, item.name);
      deepCopyAssets(newSourceFolder, newDestinationFolder);
    }

    if (item.isFile()) {
      const input = fs.createReadStream(path.resolve(sourceFolder, item.name));
      const output = fs.createWriteStream(
        path.resolve(destinationFolder, item.name),
      );
      input.pipe(output);
    }
  }
}

function buildPage() {
  createDirectory().catch(console.error);
  bundleHTML().catch(console.error);
  mergeStyles().catch(console.error);
  deepCopyAssets(initialAssetsFolder, copyAssetsFolder).catch(console.error);
}

buildPage();
