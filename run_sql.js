const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf-8');
const urlMatch = scriptContent.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = scriptContent.match(/SUPABASE_KEY:\s*'([^']+)'/);

if (urlMatch && keyMatch) {
    const url = urlMatch[1];
    const key = keyMatch[1];
    
    // We cannot execute raw DDL (schema changes) via PostgREST (the REST API).
    // The only way to save this data without altering the schema via dashboard is if there's an unused column, or if we can use another table.
    
    fetch(`${url}/rest/v1/olcumler?limit=1`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    })
    .then(res => res.json())
    .then(data => console.log("Current olcumler object:", data[0]));
}
