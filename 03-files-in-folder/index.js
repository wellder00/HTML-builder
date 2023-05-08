const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');
fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  console.log('\nCurrent directory files:');
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (file.isFile()) {
        const currentFile = path.join(folder, file.name);
        fs.stat(currentFile, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            const extension = path.extname(file.name);
            const fileName = path.basename(file.name, extension);
            const fileSize = stats.size / 1024;
            console.log(`${fileName} - ${extension.substring(1)} - ${fileSize.toFixed(3)}Kb`);
          }
        });
      }
    });
  }
});
