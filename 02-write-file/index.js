const path = require('path');
const fs = require('fs');
const source = path.resolve(__dirname, 'destination.txt');
const output = fs.createWriteStream(source);
const { stdin, stdout } = process;

function exitNode() {
  stdout.write('Goodbye');
  process.exit();
}

stdout.write('Please, enter your message\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exitNode();
  }
  output.write(data);
});

process.on('SIGINT', exitNode);
