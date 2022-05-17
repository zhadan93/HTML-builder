const path = require('path');
const fs = require('fs');

const realPath = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(realPath);

let data = '';

const getData = (chunk) => data += chunk;
const showData = () => console.log(data);
const showError = (error) => console.log('Error:', error.message);

readableStream.on('data', getData);
readableStream.on('end', showData);
readableStream.on('error', showError);

