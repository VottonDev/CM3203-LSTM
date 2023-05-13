import fs from 'fs';

// Process JSON file and remove extra [ ] from the beginning and end of the file
function processFile(filePath: string) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;

    // If there are two [[ at the beginning of the file, remove the first one and at the end of the file, remove the last one;
    const jsonData = data.replace(/^\s*\[\s*/, '').replace(/\s*\]\s*$/, '');

    // Parse the modified JSON data
    const obj = JSON.parse(jsonData);

    // Rewrite the file with the modified JSON data
    fs.writeFile(filePath, JSON.stringify(obj), function (err) {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File processed and saved!');
      }
    });
  });
}

export default processFile;
