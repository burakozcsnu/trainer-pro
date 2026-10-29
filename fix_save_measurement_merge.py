import re

with open('script.js', 'r') as f:
    content = f.read()

# I also need to make sure saveMeasurement respects existing data and strips virtual properties if we merge it in the future,
# But currently saveMeasurement creates a new object entirely (`const m = { ... }`). Wait! 
# If it creates a new object, it will OVERWRITE the test data (hips, l_leg, r_leg) because it doesn't include them in the upsert!
# We MUST merge it just like saveCardioTest!

target_save_meas = """        const id = existingId || Date.now();
        const m = { 
            id, 
            member_id: state.activeMemberId, 
            tarih: document.getElementById('m-date').value, 
            weight: parseFloat(document.getElementById('m-weight').value) || null, 
            fat: parseFloat(document.getElementById('m-fat').value) || null,
            waist: parseFloat(document.getElementById('m-waist').value) || null,
            chest: parseFloat(document.getElementById('m-chest').value) || null,
            neck: parseFloat(document.getElementById('m-neck').value) || null,
            l_arm: parseFloat(document.getElementById('m-l-arm').value) || null,
            r_arm: parseFloat(document.getElementById('m-r-arm').value) || null,
            sol_onkol: parseFloat(document.getElementById('m-l-onkol').value) || null,
            sag_onkol: parseFloat(document.getElementById('m-r-onkol').value) || null,
            l_bacak: parseFloat(document.getElementById('m-l-bacak').value) || null,
            r_bacak: parseFloat(document.getElementById('m-r-bacak').value) || null,
            l_kalf: parseFloat(document.getElementById('m-l-kalf').value) || null,
            r_kalf: parseFloat(document.getElementById('m-r-kalf').value) || null,
            basen: parseFloat(document.getElementById('m-basen').value) || null
        };
        await supabase.from('olcumler').upsert(m);"""

replace_save_meas = """        const id = existingId || Date.now();
        const dateVal = document.getElementById('m-date').value;
        let m = state.measurements.find(x => x.member_id == state.activeMemberId && x.tarih == dateVal);
        
        const freshData = {
            id, 
            member_id: state.activeMemberId, 
            tarih: dateVal, 
            weight: parseFloat(document.getElementById('m-weight').value) || null, 
            fat: parseFloat(document.getElementById('m-fat').value) || null,
            waist: parseFloat(document.getElementById('m-waist').value) || null,
            chest: parseFloat(document.getElementById('m-chest').value) || null,
            neck: parseFloat(document.getElementById('m-neck').value) || null,
            l_arm: parseFloat(document.getElementById('m-l-arm').value) || null,
            r_arm: parseFloat(document.getElementById('m-r-arm').value) || null,
            sol_onkol: parseFloat(document.getElementById('m-l-onkol').value) || null,
            sag_onkol: parseFloat(document.getElementById('m-r-onkol').value) || null,
            l_bacak: parseFloat(document.getElementById('m-l-bacak').value) || null,
            r_bacak: parseFloat(document.getElementById('m-r-bacak').value) || null,
            l_kalf: parseFloat(document.getElementById('m-l-kalf').value) || null,
            r_kalf: parseFloat(document.getElementById('m-r-kalf').value) || null,
            basen: parseFloat(document.getElementById('m-basen').value) || null
        };

        if (m) {
            m = { ...m, ...freshData };
            // VERY IMPORTANT: Strip out virtual frontend properties before sending to Supabase!
            delete m.yas; delete m.rhr; delete m.cooper; 
            delete m.bmr; delete m.mhr; delete m.hrr; delete m.vo2max;
        } else {
            m = freshData;
        }

        await supabase.from('olcumler').upsert(m);"""
        
content = content.replace(target_save_meas, replace_save_meas)

with open('script.js', 'w') as f:
    f.write(content)
