const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

const readDir = async (path) => {
  try {
    return await readdir(path, {withFileTypes: true});
  } catch (err) {
    console.error(err);
  }
}

const mergePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(mergePath);

const getData = (chunk) => writeStream.write(`${chunk}\n`);
const showError = (error) => console.log('Error:', error.message);

const mergeStyles = async () => {
  const basePath = path.join(__dirname, 'styles');
  const styles = await readDir(basePath);

  styles.forEach((style) => {
    const filePath = path.join(basePath, style.name);
    const { ext } = path.parse(filePath);
    const fileExtension = ext.slice(1);

    if (style.isFile() && fileExtension === 'css') {
      readableStream = fs.createReadStream(filePath, 'utf-8');
      readableStream.on('data', getData);
      readableStream.on('error', showError);
    }
  }); 
};

mergeStyles();