const path = require('path');
const fs = require('fs').promises;

const COMPONENTS = path.join(__dirname, 'components');
const PROJECT_DIST = path.join(__dirname, 'project-dist');
const STYLES = path.join(__dirname, 'styles');
const ASSETS = path.join(__dirname, 'assets');
const HTML_TEMPLATE = path.join(__dirname, 'template.html');
const HTML_INDEX = path.join(PROJECT_DIST, 'index.html');
const CSS_STYLE = path.join(PROJECT_DIST, 'style.css');

async function iterateOverFolder(fileBaseName) {
  const PATH = path.join(COMPONENTS, fileBaseName);
  const CONTENT = await fs.readFile(PATH, { encoding: 'utf-8' });
  return { [path.parse(fileBaseName).name]: CONTENT };
}

async function recordHtml(content) {
  let templateContent = await fs.readFile(HTML_TEMPLATE, { encoding: 'utf-8' });
  const keys = Object.keys(content);
  for (const name of keys) {
    const REG_EXP = new RegExp(`{{${name}}}`, 'g');
    templateContent = templateContent.replace(REG_EXP, content[name]);
  }
  try {
    await fs.writeFile(HTML_INDEX, templateContent);
  } catch (err) {
    console.log(`Ой, а у нас тут ошибка: ${err}`);
  }
}

async function makeBundle() {
  const readStyles = await fs.readdir(STYLES, { withFileTypes: true });
  const cssFiles = readStyles.filter((f) => f.isFile() && path.extname(f.name) === '.css');
  let bundleEntrails = '';
  for (const file of cssFiles) {
    const cont = await fs.readFile(path.join(STYLES, file.name), { encoding: 'utf-8' });
    bundleEntrails = bundleEntrails + cont;
  }
  try {
    await fs.writeFile(CSS_STYLE, bundleEntrails);
  } catch (err) {
    console.log(`Ой, а у нас тут ошибка: ${err}`);
  }
}

async function deepCopy(src, targetDir) {
  try {
    await fs.mkdir(targetDir, { recursive: true });
  } catch (err) {
    console.log(`Ой, а у нас тут ошибка: ${err}`);
  }
  const COPY = await fs.readdir(src, { withFileTypes: true });
  for (const VALUE of COPY) {
    if (VALUE.isFile()) {
      try {
        await fs.copyFile(path.join(src, VALUE.name), path.join(targetDir, VALUE.name));
      } catch (err) {
        console.log(`Ой, а у нас тут ошибка: ${err}`);
      }
    } else {
      try {
        await deepCopy(path.join(src, VALUE.name), path.join(targetDir, VALUE.name));
      } catch (err) {
        console.log(`Ой, а у нас тут ошибка: ${err}`);
      }
    }
  }
}

(async () => {
  try {
    await fs.rm(PROJECT_DIST, { force: true, recursive: true });
    console.log('-- Удалили старую папку проекта (если она была)');
    const COMPONENT = await fs.readdir(COMPONENTS, { withFileTypes: true });
    console.log('-- Получили содержимое папки components');
    const componentFiles = COMPONENT.filter((x) => x.isFile() && path.extname(x.name) === '.html');
    const contentPromises = componentFiles.map((x) => iterateOverFolder(x.name));
    let contentArray = [];
    try {
      contentArray = await Promise.all(contentPromises);
    } catch (err) {
      console.log(`Ой, а у нас тут ошибка: ${err}`);
    }
    let content = Object.assign({}, ...contentArray);
    console.log('-- Собираем компоненты');

    await fs.mkdir(PROJECT_DIST, { recursive: true });
    console.log('-- Создали папку проекта');
    await recordHtml(content);
    console.log('-- Создали файл index.html с компонентами');
    await makeBundle();
    console.log('-- Создали файл style.css со всеми стилями');
    await deepCopy(ASSETS, path.join(PROJECT_DIST, 'assets'));
    console.log('-- Скопировали папку assets в новую директорию');
    console.log('-- Поздравляю, сборка прошла успешно!');
  } catch (err) {
    console.log(`Ой, а у нас тут ошибка: ${err}`);
  }
})();
