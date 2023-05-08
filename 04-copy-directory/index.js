const fs = require('fs').promises;
const path = require('path');
const folderFilesCopy = path.join(__dirname, 'files-copy');

async function createFolderAndCopyFiles() {
  try {
    try {
      await fs.rm(folderFilesCopy, { recursive: true, force: true });
      console.log('Папку удалили');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('Папка нет');
      } else {
        throw err;
      }
    }
    await fs.mkdir(folderFilesCopy, { recursive: true, force: true });
    console.log('Папку создали');
    const files = await fs.readdir(path.join(__dirname, 'files'));
    for (const file of files) {
      const source = path.join(__dirname, 'files', file);
      const dest = path.join(folderFilesCopy, file);
      const fileData = await fs.readFile(source);
      await fs.writeFile(dest, fileData);
      console.log(`Файл ${file} скопирован`);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createFolderAndCopyFiles();
