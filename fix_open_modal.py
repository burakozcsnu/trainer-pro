with open('script.js', 'r') as f:
    content = f.read()

# Update openMeasurementModal to prefill height if possible
open_mod_target = """        const today = new Date();
        const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('m-date').value = dateString;
        
        window.openModal('modal-measurement');"""

open_mod_replace = """        const today = new Date();
        const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('m-date').value = dateString;
        
        const member = state.members.find(m => m.id == state.activeMemberId);
        if (member && member.boy) {
            document.getElementById('m-height-measurement').value = member.boy;
        }

        window.openModal('modal-measurement');"""
        
content = content.replace(open_mod_target, open_mod_replace)

edit_mod_target = """        document.getElementById('m-id').value = m.id;
        document.getElementById('m-date').value = m.tarih;
        document.getElementById('m-weight').value = m.weight;"""

edit_mod_replace = """        document.getElementById('m-id').value = m.id;
        document.getElementById('m-date').value = m.tarih;
        document.getElementById('m-weight').value = m.weight;
        const member = state.members.find(memb => memb.id == state.activeMemberId);
        document.getElementById('m-height-measurement').value = (member && member.boy) ? member.boy : '';"""
        
content = content.replace(edit_mod_target, edit_mod_replace)

with open('script.js', 'w') as f:
    f.write(content)
