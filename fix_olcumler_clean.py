import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. FIX THE SAVE PAYLOAD (Avoid 400 Bad Request by using existing schema)
target_save = """        m.yas = parseFloat(document.getElementById('c-age').value) || null;
        m.rhr = parseFloat(document.getElementById('c-rhr').value) || null;
        m.cooper = parseFloat(document.getElementById('c-cooper').value) || null;
        m.bmr = parseFloat(document.getElementById('c-bmr').value) || null;
        m.mhr = parseFloat(document.getElementById('c-mhr').value) || null;
        m.hrr = parseFloat(document.getElementById('c-hrr').value) || null;
        m.vo2max = parseFloat(document.getElementById('c-vo2max').value) || null;"""

replace_save = """        // Supabase schema strictness workaround: 
        // We map the raw inputs into unused/legacy columns to avoid 400 Bad Request
        m.l_leg = parseFloat(document.getElementById('c-age').value) || null; // l_leg stores Age
        m.r_leg = parseFloat(document.getElementById('c-rhr').value) || null; // r_leg stores RHR
        m.hips = parseFloat(document.getElementById('c-cooper').value) || null; // hips stores Step Test HR"""

content = content.replace(target_save, replace_save)


# 2. UPDATE SYNC TO MAP THESE TO VIRTUAL FIELDS
target_sync = "state.measurements = results[2].data || [];"
replace_sync = """            state.measurements = (results[2].data || []).map(m => {
                // Restore test values from legacy columns
                m.yas = m.l_leg;
                m.rhr = m.r_leg;
                m.cooper = m.hips;
                
                // Recalculate derived metrics (BMR, MHR, HRR, VO2) so they exist in state for the dashboard
                if (m.yas) {
                    m.mhr = Math.round(208 - (0.7 * m.yas));
                    if (m.rhr) m.hrr = m.mhr - m.rhr;
                }
                
                if (m.cooper) {
                    const member = results[0].data.find(x => x.id == m.member_id);
                    const gender = member ? member.cinsiyet || 'Erkek' : 'Erkek';
                    if (gender === 'Kadın') {
                        m.vo2max = (65.81 - (0.1847 * m.cooper)).toFixed(1);
                    } else {
                        m.vo2max = (111.33 - (0.42 * m.cooper)).toFixed(1);
                    }
                }
                
                if (m.weight && m.yas) {
                    const member = results[0].data.find(x => x.id == m.member_id);
                    if (member && member.boy) {
                        const gender = member.cinsiyet || 'Erkek';
                        let bmr = 0;
                        if (gender === 'Kadın') {
                            bmr = (10 * m.weight) + (6.25 * member.boy) - (5 * m.yas) - 161;
                        } else {
                            bmr = (10 * m.weight) + (6.25 * member.boy) - (5 * m.yas) + 5;
                        }
                        m.bmr = Math.round(bmr);
                    }
                }
                
                return m;
            });"""
content = content.replace(target_sync, replace_sync)

with open('script.js', 'w') as f:
    f.write(content)
