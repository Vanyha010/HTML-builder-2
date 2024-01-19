const path = require('path');
const fs = require('fs');
const source = path.resolve(__dirname, 'text.txt');
const readableStream = fs.createReadStream(source, 'utf-8');
readableStream.on('data', (chunk) => console.log(chunk));
