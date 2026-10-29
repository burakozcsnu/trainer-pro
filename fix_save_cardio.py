import re

with open('script.js', 'r') as f:
    content = f.read()

# Let's check `m` in saveCardioTest.
# If `m` was fetched from `state.measurements`, it CONTAINS `m.yas`, `m.rhr`, `m.cooper`, `m.bmr`, `m.mhr`, `m.hrr`, `m.vo2max` 
# because we map these virtual properties in the sync() function!
# And when we do `{ ...m }`, we pass ALL those virtual properties to the Supabase upsert!
# That is exactly why it STILL throws 400 Bad Request! We are sending virtual properties that don't exist in the database!

target_cardio_merge = """        if (m) {
             m = { ...m, weight: parseFloat(document.getElementById('c-weight').value) || null };
        } else {
             m = { id, member_id: state.activeMemberId, tarih: dateVal, weight: parseFloat(document.getElementById('c-weight').value) || null };
        }"""
        
replace_cardio_merge = """        if (m) {
             m = { ...m, weight: parseFloat(document.getElementById('c-weight').value) || null };
             // VERY IMPORTANT: Strip out virtual frontend properties before sending to Supabase!
             delete m.yas; delete m.rhr; delete m.cooper; 
             delete m.bmr; delete m.mhr; delete m.hrr; delete m.vo2max;
        } else {
             m = { id, member_id: state.activeMemberId, tarih: dateVal, weight: parseFloat(document.getElementById('c-weight').value) || null };
        }"""
        
content = content.replace(target_cardio_merge, replace_cardio_merge)

with open('script.js', 'w') as f:
    f.write(content)
