const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf-8');
const urlMatch = scriptContent.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = scriptContent.match(/SUPABASE_KEY:\s*'([^']+)'/);

if (urlMatch && keyMatch) {
    const url = urlMatch[1];
    const key = keyMatch[1];
    
    fetch(`${url}/rest/v1/?apikey=${key}`)
    .then(res => res.json())
    .then(data => {
        if(data && data.definitions && data.definitions.olcumler) {
            console.log("Olcumler schema properties:", Object.keys(data.definitions.olcumler.properties));
        } else {
             console.log(Object.keys(data.definitions || {}));
        }
    });
}
