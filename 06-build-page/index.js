const path = require('path');
const { readdir, mkdir, rm, copyFile, readFile } = require('fs/promises');
const fs = require('fs');

const bundlePath = path.join(__dirname, 'project-dist');
const baseHtmlPath = path.join(__dirname, 'template.html');
const htmlTemplatePath = path.join(__dirname, 'components');
const copyHtmlPath = path.join(bundlePath, 'index.html');
const baseAssetsPath = path.join(__dirname, 'assets');
const copyAssetsPath = path.join(bundlePath, 'assets');

const readDir = async (path) => {
  try {
    return await readdir(path, {withFileTypes: true});
  } catch (err) {
    console.error(err);
  }
}

const showError = (error) => console.log('Error:', error.message);

const replaceTemplate = async () => {
  try {
    const htmlTemplates = await readDir(htmlTemplatePath, {withFileTypes: true});
    let htmlData = await readFile(baseHtmlPath, 'utf-8');

    for (let htmlTemplate of htmlTemplates) {
      const filePath = path.join(htmlTemplatePath, htmlTemplate.name);
      const { name } = path.parse(filePath);
      
      if (htmlData.includes(`{{${name}}}`)) {
        const htmlTemplateData = await readFile(filePath, 'utf-8');
    
        const regExp = new RegExp(`{{${name}}}`);
  
        htmlData = htmlData.replace(regExp, htmlTemplateData);
      }
    }
  
    const htmlWriteStream = fs.createWriteStream(copyHtmlPath);
    htmlWriteStream.write(htmlData);
  } catch (err) {
    console.error(err);
  }
}

const mergePath = path.join(bundlePath, 'style.css');
const styleWriteStream = fs.createWriteStream(mergePath);

const getStyleData = (chunk) => styleWriteStream.write(`${chunk}\n`);

const mergeStyles = async () => {
  const basePath = path.join(__dirname, 'styles');
  const styles = await readDir(basePath);

  styles.forEach((style) => {
    const filePath = path.join(basePath, style.name);
    const { ext } = path.parse(filePath);
    const fileExtension = ext.slice(1);

    if (style.isFile() && fileExtension === 'css') {
      readableStream = fs.createReadStream(filePath, 'utf-8');
      readableStream.on('data', getStyleData);
      readableStream.on('error', showError);
    }
  }); 
};

const copyFiles = async (basePath, copyPath) => {  
  try {
    const baseFiles = await readDir(basePath);

    baseFiles.forEach(async (file) => {
      const filePath = path.join(basePath, file.name);
      const copyFilePath = path.join(copyPath, file.name);

      if (file.isFile()) {
        copyFile(filePath, copyFilePath);
      } else {
        await mkdir(copyFilePath, {recursive: true});
        copyFiles(filePath, copyFilePath);
      }
    })
  } catch (err) {
    console.error(err);
  }
}

const copyDirectory = async () => {
  await rm(copyAssetsPath, {force: true, recursive: true});
  await mkdir(copyAssetsPath, {recursive: true});
  
  copyFiles(baseAssetsPath, copyAssetsPath);
};

(async () => {
  await mkdir(bundlePath, {recursive: true});

  replaceTemplate();
  mergeStyles();
  copyDirectory();
})()