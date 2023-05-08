const fs = require('fs');
const path = require('path');
const txtPath = path.resolve(__dirname, 'text.txt');
const stream = fs.createReadStream(txtPath, { encoding: 'utf-8' });
const { stdout } = process;

stream.on('data', (data) => {
  stdout.write(data);
});
stream.on('end', () => {
  console.log();
});
stream.on('error', (err) => {
  console.error(`Произошла ошибка при чтении файла: ${err}`);
});
