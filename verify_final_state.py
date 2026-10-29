import re

with open('script.js', 'r') as f:
    content = f.read()

# Final verification: remove any leftover virtual fields in saveMeasurement
target = """            l_kalf: parseFloat(document.getElementById('m-l-kalf').value) || null,
            r_kalf: parseFloat(document.getElementById('m-r-kalf').value) || null,
            basen: parseFloat(document.getElementById('m-basen').value) || null,
            yas: parseFloat(document.getElementById('m-age').value) || null,
            rhr: parseFloat(document.getElementById('m-rhr').value) || null,
            cooper: parseFloat(document.getElementById('m-cooper').value) || null,
            bmr: parseFloat(document.getElementById('m-bmr').value) || null,
            mhr: parseFloat(document.getElementById('m-mhr').value) || null,
            hrr: parseFloat(document.getElementById('m-hrr').value) || null,
            vo2max: parseFloat(document.getElementById('m-vo2max').value) || null"""

if (content.includes(target)) {
    print("ERROR: Virtual fields still present in saveMeasurement")
} else {
    print("SUCCESS: Virtual fields cleaned up in saveMeasurement")
}

# Ensure saveCardioTest still has proper schema handling
target2 = """// Supabase schema strictness workaround: 
        // We map the raw inputs into unused/legacy columns to avoid 400 Bad Request
        m.l_leg = parseFloat(document.getElementById('c-age').value) || null; // l_leg stores Age
        m.r_leg = parseFloat(document.getElementById('c-rhr').value) || null; // r_leg stores RHR
        m.hips = parseFloat(document.getElementById('c-cooper').value) || null; // hips stores Step Test HR"""
if (content.includes(target2)) {
    print("SUCCESS: Cardio test payload uses legacy columns")
} else {
    print("WARNING: Cardio test payload may not be using legacy columns")
}
