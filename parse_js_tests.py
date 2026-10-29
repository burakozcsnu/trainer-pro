import re

with open('script.js', 'r') as f:
    content = f.read()

formula = """
    window.calculateAdvancedMetrics = () => {
        const member = state.members.find(m => m.id == state.activeMemberId);
        const gender = member ? member.cinsiyet || 'Erkek' : 'Erkek';
        
        const weight = parseFloat(document.getElementById('m-weight').value);
        const height = parseFloat(document.getElementById('m-height-measurement').value);
        const age = parseFloat(document.getElementById('m-age').value);
        const rhr = parseFloat(document.getElementById('m-rhr').value);
        const cooperDistance = parseFloat(document.getElementById('m-cooper').value);

        // BMR Calculation (Mifflin-St Jeor Equation)
        if (weight && height && age) {
            let bmr = 0;
            if (gender === 'Kadın') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            }
            document.getElementById('m-bmr').value = Math.round(bmr);
        }

        // MHR and HRR (Tanaka formula for MHR)
        if (age) {
            const mhr = Math.round(208 - (0.7 * age));
            document.getElementById('m-mhr').value = mhr;
            
            if (rhr) {
                const hrr = mhr - rhr;
                document.getElementById('m-hrr').value = hrr;
            }
        }

        // VO2 Max (Cooper Test Formula: (Distance in meters - 504.9) / 44.73)
        if (cooperDistance) {
            const vo2max = (cooperDistance - 504.9) / 44.73;
            document.getElementById('m-vo2max').value = vo2max.toFixed(1);
        }
    };
"""

content = content.replace("window.calculateFatPercentage = () => {", formula + "\n    window.calculateFatPercentage = () => {")

# Update saveMeasurement to include new fields
target_save = """            basen: parseFloat(document.getElementById('m-basen').value) || null"""
replace_save = target_save + """,
            yas: parseFloat(document.getElementById('m-age').value) || null,
            rhr: parseFloat(document.getElementById('m-rhr').value) || null,
            cooper: parseFloat(document.getElementById('m-cooper').value) || null,
            bmr: parseFloat(document.getElementById('m-bmr').value) || null,
            mhr: parseFloat(document.getElementById('m-mhr').value) || null,
            hrr: parseFloat(document.getElementById('m-hrr').value) || null,
            vo2max: parseFloat(document.getElementById('m-vo2max').value) || null"""
content = content.replace(target_save, replace_save)

# Update editMeasurement
target_edit = """        document.getElementById('m-basen').value = m.basen || '';"""
replace_edit = target_edit + """
        document.getElementById('m-age').value = m.yas || '';
        document.getElementById('m-rhr').value = m.rhr || '';
        document.getElementById('m-cooper').value = m.cooper || '';
        document.getElementById('m-bmr').value = m.bmr || '';
        document.getElementById('m-mhr').value = m.mhr || '';
        document.getElementById('m-hrr').value = m.hrr || '';
        document.getElementById('m-vo2max').value = m.vo2max || '';"""
content = content.replace(target_edit, replace_edit)

# Update loadPreviousMeasurement
target_prev = """                'm-l-kalf': last.l_kalf, 'm-r-kalf': last.r_kalf"""
replace_prev = target_prev + """,
                'm-age': last.yas, 'm-rhr': last.rhr, 'm-cooper': last.cooper,
                'm-bmr': last.bmr, 'm-mhr': last.mhr, 'm-hrr': last.hrr, 'm-vo2max': last.vo2max"""
content = content.replace(target_prev, replace_prev)

with open('script.js', 'w') as f:
    f.write(content)
