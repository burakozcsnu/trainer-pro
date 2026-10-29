const fs = require('fs');
const scriptContent = fs.readFileSync('script.js', 'utf-8');

// Search for our legacy visual fields being passed to supabase in saveCardioTest
target1 = "delete m.yas; delete m.rhr; delete m.cooper;"; 
target2 = "delete m.bmr; delete m.mhr; delete m.hrr; delete m.vo2max;"; 

if (scriptContent.includes(target1) && scriptContent.includes(target2)) {
    console.log("SUCCESS: Visual fields are stripped in cardio save.");
} else {
    console.log("ERROR: Visual fields are NOT stripped or missing!");
}
