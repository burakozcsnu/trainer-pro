import re

with open('script.js', 'r') as f:
    content = f.read()

# Since `olcumler` does not have columns for the cardiovascular tests and we cannot create them via the REST API, 
# and since this is a Pure Vanilla JS app relying on this specific backend, 
# we need to map our cardio values into the UNUSED columns of `olcumler` that already exist.
# Let's see the unused/redundant columns:
# 'hips' (we use 'basen' instead)
# 'l_leg' (we use 'l_bacak' instead)
# 'r_leg' (we use 'r_bacak' instead)
# That's 3 columns. We need 7 (yas, rhr, cooper, bmr, mhr, hrr, vo2max).

# Wait! BMR, MHR, HRR, and VO2MAX are CALCULATED values. They do NOT need to be saved in the database!
# They can be recalculated on the fly every time we render them, as long as we save the RAW inputs:
# 1. Age (yas)
# 2. RHR (rhr)
# 3. Cooper/Step Test HR (cooper)
#
# If we only need to save 3 raw inputs, we can map them perfectly into the 3 unused columns!
# yas -> l_leg
# rhr -> r_leg
# cooper -> hips

target_save = """        m.yas = parseFloat(document.getElementById('c-age').value) || null;
        m.rhr = parseFloat(document.getElementById('c-rhr').value) || null;
        m.cooper = parseFloat(document.getElementById('c-cooper').value) || null;
        m.bmr = parseFloat(document.getElementById('c-bmr').value) || null;
        m.mhr = parseFloat(document.getElementById('c-mhr').value) || null;
        m.hrr = parseFloat(document.getElementById('c-hrr').value) || null;
        m.vo2max = parseFloat(document.getElementById('c-vo2max').value) || null;"""

replace_save = """        // We must map test inputs to unused legacy schema columns because we can't alter DB from client
        m.l_leg = parseFloat(document.getElementById('c-age').value) || null;
        m.r_leg = parseFloat(document.getElementById('c-rhr').value) || null;
        m.hips = parseFloat(document.getElementById('c-cooper').value) || null;"""

content = content.replace(target_save, replace_save)


# Now update the UI mapping when rendering and calculating.
# We will inject a helper to map these back in JS memory so the rest of the app doesn't break.
sync_target = "state.measurements = results[2].data || [];"
sync_replace = """            state.measurements = (results[2].data || []).map(m => {
                // Map legacy DB columns back to our frontend cardio keys
                m.yas = m.l_leg;
                m.rhr = m.r_leg;
                m.cooper = m.hips;
                
                // Recalculate derived metrics on the fly so they don't need to be saved in DB
                if (m.weight && m.yas) {
                    const gender = (state.members.find(x => x.id == m.member_id) || {}).cinsiyet || 'Erkek';
                    m.bmr = Math.round(gender === 'Kadın' ? (10 * m.weight) + (6.25 * m.l_leg /*height missing, assume avg or skip? Oh wait, BMR needs height!*/) : 0);
                    // Actually, we can just run the calculateAdvancedMetrics logic here, but we don't have height unless we fetch it.
                    // Let's rely on the on-the-fly render function for BMR, or just approximate it.
                }
                
                return m;
            });"""
# Wait, let's just do it in the render logic!
