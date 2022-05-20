const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = process;

const rl = readline.createInterface({ input, output });

const realPath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(realPath);

rl.write('Hello! Start typing the message!\n');

rl.on('line', (data) => {
  if (data.trim() === 'exit') {
    showMessage();
  } else {
    writeStream.write(`${data}\n`);
  }
});

const showMessage = () => {
  output.write('Bye!\n');
  rl.close();
};

rl.on('SIGINT', showMessage);
