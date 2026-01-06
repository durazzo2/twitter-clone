const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(process.cwd(), '.env');

const secret = crypto.randomBytes(32).toString('hex');

fs.readFile(envPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading .env file:', err);
    return;
  }

  if (data.includes('JWT_SECRET=')) {
    console.log('JWT_SECRET already exists in .env file. Skipping append.');
    return;
  }

  const newLine = `\nJWT_SECRET=${secret}`;
  fs.appendFile(envPath, newLine, 'utf8', err => {
    if (err) {
      console.error('Error writing to .env file:', err);
      return;
    }
    console.log('JWT_SECRET successfully appended to .env file.');
    console.log('Generated secret:', secret);
  });
});