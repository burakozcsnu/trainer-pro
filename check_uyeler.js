const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf-8');
const urlMatch = scriptContent.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = scriptContent.match(/SUPABASE_KEY:\s*'([^']+)'/);

if (urlMatch && keyMatch) {
    const url = urlMatch[1];
    const key = keyMatch[1];
    fetch(`${url}/rest/v1/uyeler?limit=1`, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } })
    .then(res => res.json())
    .then(data => console.log("Current uyeler object:", data[0]));
}
