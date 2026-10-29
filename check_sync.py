const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf-8');

const target = "state.measurements = (results[2].data || []).map(m => {";
if (scriptContent.includes(target)) {
    console.log("SYNC still has the proper sync code - NO SQL IMPROPER INJECTION");
    process.exit(0);
}

const alternate = "state.measurements = results[2].data || [];";
if (scriptContent.includes(alternate)) {
    console.log("ERROR: SYNC WAS OVERWRITTEN AND REMOVED THE FIX");
}
