const path = require('path');
const fs = require('fs');
const pdfs = [];
const errs = [];

function throughDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const absolute = path.join(directory, file);
    try {
      if (fs.statSync(absolute).isDirectory()) {
        return throughDirectory(absolute);
      }
      if (file.includes('.pdf')) {
        return pdfs.push(absolute);
      }
    } catch (error) {
      errs.push(error);
    }
  });
}

function fontCheck(font, param) {
  const mappedForReadStream = pdfs.map((pdf) => fs.createReadStream(pdf, 'utf-8'));
  
  mappedForReadStream.forEach((stream, index) => {
    let foundFont = false;
    
    stream.on('data', (chunk) => {
      const rx = /[a-zA-Z]{6}\+\S+/g;
      let arr;
      
      while ((arr = rx.exec(chunk)) !== null && !foundFont) {
        if (arr[0].includes(font)) {
          console.log(pdfs[index])
          foundFont = true;
          fs.appendFileSync('pdfWithFontLog.txt', `${pdfs[index]}\n`);
        }
      }
    })
  })
}

throughDirectory('../');
fontCheck('Times');
