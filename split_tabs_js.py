import re

with open('script.js', 'r') as f:
    content = f.read()

# 1. Update calculateAdvancedMetrics references to point to new 'c-' IDs
target_calc = """    window.calculateAdvancedMetrics = () => {
        const member = state.members.find(m => m.id == state.activeMemberId);
        const gender = member ? member.cinsiyet || 'Erkek' : 'Erkek';
        
        const weight = parseFloat(document.getElementById('m-weight').value);
        const height = parseFloat(document.getElementById('m-height-measurement').value);
        const age = parseFloat(document.getElementById('m-age').value);
        const rhr = parseFloat(document.getElementById('m-rhr').value);
        const cooperDistance = parseFloat(document.getElementById('m-cooper').value);"""

replace_calc = """    window.calculateAdvancedMetrics = () => {
        const member = state.members.find(m => m.id == state.activeMemberId);
        const gender = member ? member.cinsiyet || 'Erkek' : 'Erkek';
        
        const weight = parseFloat(document.getElementById('c-weight').value);
        const height = parseFloat(document.getElementById('c-height').value);
        const age = parseFloat(document.getElementById('c-age').value);
        const rhr = parseFloat(document.getElementById('c-rhr').value);
        const cooperDistance = parseFloat(document.getElementById('c-cooper').value);"""
content = content.replace(target_calc, replace_calc)

target_calc2 = """            document.getElementById('m-bmr').value = Math.round(bmr);
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

        // VO2 Max (Queen's College Step Test Formula)
        if (cooperDistance) { // cooperDistance represents the Post-Test Heart Rate in bpm here
            let vo2max = 0;
            if (gender === 'Kadın') {
                vo2max = 65.81 - (0.1847 * cooperDistance);
            } else {
                vo2max = 111.33 - (0.42 * cooperDistance);
            }
            document.getElementById('m-vo2max').value = vo2max.toFixed(1);
        }
    };"""

replace_calc2 = """            document.getElementById('c-bmr').value = Math.round(bmr);
        }

        // MHR and HRR (Tanaka formula for MHR)
        if (age) {
            const mhr = Math.round(208 - (0.7 * age));
            document.getElementById('c-mhr').value = mhr;
            
            if (rhr) {
                const hrr = mhr - rhr;
                document.getElementById('c-hrr').value = hrr;
            }
        }

        // VO2 Max (Queen's College Step Test Formula)
        if (cooperDistance) { 
            let vo2max = 0;
            if (gender === 'Kadın') {
                vo2max = 65.81 - (0.1847 * cooperDistance);
            } else {
                vo2max = 111.33 - (0.42 * cooperDistance);
            }
            document.getElementById('c-vo2max').value = vo2max.toFixed(1);
        }
    };"""
content = content.replace(target_calc2, replace_calc2)


# 2. Add Cardio Modal JS handlers
cardio_js = """
    window.openCardioModal = () => {
        document.getElementById('c-id').value = '';
        document.getElementById('c-modal-title').innerText = 'Yeni Test Al';
        const form = document.querySelector('#modal-cardio form');
        if (form) form.reset();
        
        const today = new Date();
        const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('c-date').value = dateString;
        
        const member = state.members.find(m => m.id == state.activeMemberId);
        if (member && member.boy) document.getElementById('c-height').value = member.boy;
        
        // Auto-fill weight from latest measurement if available
        const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myM.length > 0 && myM[0].weight) document.getElementById('c-weight').value = myM[0].weight;

        window.openModal('modal-cardio');
    };

    window.editCardioTest = (id) => {
        const m = state.measurements.find(x => x.id == id);
        if (!m) return;
        document.getElementById('c-modal-title').innerText = 'Testi Düzenle';
        document.getElementById('c-id').value = m.id;
        document.getElementById('c-date').value = m.tarih;
        document.getElementById('c-weight').value = m.weight || '';
        const member = state.members.find(memb => memb.id == state.activeMemberId);
        document.getElementById('c-height').value = (member && member.boy) ? member.boy : '';
        document.getElementById('c-age').value = m.yas || '';
        document.getElementById('c-rhr').value = m.rhr || '';
        document.getElementById('c-cooper').value = m.cooper || '';
        document.getElementById('c-bmr').value = m.bmr || '';
        document.getElementById('c-mhr').value = m.mhr || '';
        document.getElementById('c-hrr').value = m.hrr || '';
        document.getElementById('c-vo2max').value = m.vo2max || '';
        window.openModal('modal-cardio');
    };

    window.saveCardioTest = async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('c-id').value;
        const id = existingId || Date.now();
        // Check if there is an existing measurement on this date to merge, or create new
        const dateVal = document.getElementById('c-date').value;
        let m = state.measurements.find(x => x.member_id == state.activeMemberId && x.tarih == dateVal);
        
        if (m) {
             m = { ...m, weight: parseFloat(document.getElementById('c-weight').value) || null };
        } else {
             m = { id, member_id: state.activeMemberId, tarih: dateVal, weight: parseFloat(document.getElementById('c-weight').value) || null };
        }
        
        m.yas = parseFloat(document.getElementById('c-age').value) || null;
        m.rhr = parseFloat(document.getElementById('c-rhr').value) || null;
        m.cooper = parseFloat(document.getElementById('c-cooper').value) || null;
        m.bmr = parseFloat(document.getElementById('c-bmr').value) || null;
        m.mhr = parseFloat(document.getElementById('c-mhr').value) || null;
        m.hrr = parseFloat(document.getElementById('c-hrr').value) || null;
        m.vo2max = parseFloat(document.getElementById('c-vo2max').value) || null;

        await supabase.from('olcumler').upsert(m);
        const oldData = existingId ? state.measurements.find(x => x.id == existingId) : null;
        window.pushToUndoLog(existingId ? 'UPDATE' : 'INSERT', 'olcumler', oldData, m, `Kardiyo Testi: ${m.tarih}`);
        await sync();
        e.target.reset();
        window.closeModal('modal-cardio');
        alert("Test kaydedildi!");
    };
"""
content = content.replace("window.openMeasurementModal = () => {", cardio_js + "\n    window.openMeasurementModal = () => {")


# 3. Add to UI Renderer
cardio_renderer = """
    function renderCardioHistory() {
        const container = document.getElementById('c-history-tabs');
        if (!container) return;
        const myM = state.measurements.filter(m => m.member_id == state.activeMemberId && (m.vo2max || m.rhr || m.bmr)).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myM.length === 0) { container.innerHTML = '<div class="no-results mt-1">Test verisi yok.</div>'; return; }
        container.innerHTML = myM.map(m => `
            <div class="card mt-1" onclick="window.showMeasurementDetail(${m.id})" style="cursor:pointer; background: rgba(0, 128, 255, 0.05); border: 1px solid rgba(0, 128, 255, 0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="color: var(--accent);">🫀 ${new Date(m.tarih).toLocaleDateString('tr-TR')}</h3>
                    <div class="card-actions">
                        <button class="btn-edit" onclick="event.stopPropagation(); window.editCardioTest(${m.id})">✎</button>
                        <button class="btn-delete" onclick="event.stopPropagation(); window.deleteMeasurement(${m.id})">🗑</button>
                    </div>
                </div>
                <p>VO2 Max: ${m.vo2max || '--'} | RHR: ${m.rhr || '--'} | BMR: ${m.bmr || '--'}</p>
            </div>
        `).join('');
    }
"""
content = content.replace("function renderMeasurementHistory() {", cardio_renderer + "\n    function renderMeasurementHistory() {")
content = content.replace("renderMeasurementHistory();", "renderMeasurementHistory();\n            if(typeof renderCardioHistory === 'function') renderCardioHistory();")

with open('script.js', 'w') as f:
    f.write(content)
