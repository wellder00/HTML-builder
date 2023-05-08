const fsProm = require('fs').promises;
const path = require('path');

async function collectingStyles() {
  try {
    const pathStyle = path.join(__dirname, 'styles');
    const files = await fsProm.readdir(pathStyle, { withFileTypes: true });
    console.log('Папка прочитана');

    const fileNames = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.isFile() && path.extname(file.name) === '.css') {
        fileNames.push(file.name);
      }
    }
    console.log(`Файлы: [${fileNames}] получены`);

    let content = '';
    for (let i = 0; i < fileNames.length; i++) {
      const index = fileNames[i];
      const styleFileContent = await fsProm.readFile(path.join(pathStyle, index), {
        encoding: 'utf-8',
      });
      content += styleFileContent;
    }
    console.log('Получили файл с содержимым всех стилей');

    const pathNewFolder = path.join(__dirname, 'project-dist', 'bundle.css');
    await fsProm.writeFile(pathNewFolder, content, { encoding: 'utf-8' });

    console.log('Записали все стили в bundle.css');
  } catch (err) {
    console.log(`Ой, а тут у нас ошибка: ${err}`);
  }
}

collectingStyles();
