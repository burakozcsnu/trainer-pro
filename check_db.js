const fs = require('fs');
const content = fs.readFileSync('script.js', 'utf-8');
const match = content.match(/olcumler.*?upsert\((.*?)\)/);
console.log("Upsert object:", match ? match[1] : 'Not found');
