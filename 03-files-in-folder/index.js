const path = require('path');
const { stat } = require('fs');
const { readdir } = require('fs/promises');

const realPath = path.join(__dirname, 'secret-folder');

async function readFiles () {
  try {
    const files = await readdir(realPath, {withFileTypes: true});
    
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const { name: fileName, ext } = path.parse(filePath);
        const fileExtension = ext.slice(1);

        stat(filePath, (err, stats) => {
          const fileSize = `${stats.size / 1000} kb`;

          console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

readFiles();