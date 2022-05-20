const path = require('path');
const { readdir, mkdir, rm, copyFile } = require('fs/promises');

const readDir = async (path) => {
  try {
    const files = await readdir(path, {withFileTypes: true});
    return files;
  } catch (err) {
    console.error(err);
  }
}

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
  const basePath = path.join(__dirname, 'files');
  const copyPath = path.join(__dirname, 'files-copy');

  await rm(copyPath, {force: true, recursive: true});
  await mkdir(copyPath, {recursive: true});
  
  copyFiles(basePath, copyPath);
};

copyDirectory();


