/**
 * Trainer Pro - Expert Architect SPA
 * Optimized for Batoner Mobile App Studios Standards
 * Version 1.3.35 - Modal Workout Edition
 */

 document.addEventListener('DOMContentLoaded', () => {
    // --- CACHE BUSTER ---
    const APP_VERSION = '1.3.50';
    const vTag = document.getElementById('version-tag');
    if (vTag) vTag.innerText = `v${APP_VERSION} - Realtime Sync`;
    try {
        localStorage.setItem('app_version', APP_VERSION);
    } catch(e) {
        console.warn("Could not save version to localStorage");
    }

    // --- CONFIGURATION ---
    const CONFIG = {
        SUPABASE_URL: 'https://mdcvljbbnoxqsfwcjvqz.supabase.co',
        SUPABASE_KEY: 'sb_publishable_cR0_yg6oxqfP4mAcPTL4Bw_ZhW16sSr',
        IS_DEV: true
    };

    const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

    let state = {
        members: [], exercises: [], programs: [], measurements: [], workouts: [], documents: [], cloudFiles: [],
        foods: [], diets: [],
        activeMemberId: null, undoStack: [], navHistory: ['members-view'],
        surveyAnswers: {}, currentStep: 0, measurementRequired: false
    };

    let workoutTimer = null;
    let seconds = 0;
    let chartObj = null;
    let realtimeChannel = null;
    let realtimeSyncTimer = null;
    let realtimeReconnectTimer = null;

    const REALTIME_TABLES = [
        'uyeler',
        'programlar',
        'olcumler',
        'antrenmanlar',
        'dokumanlar',
        'master_egzersizler',
        'master_besinler',
        'beslenme_planlari'
    ];

    const MEASUREMENT_FIELDS = [
        { key: 'weight', label: 'Kilo', unit: 'kg', direction: 'down-good' },
        { key: 'fat', label: 'Yağ Oranı', unit: '%', direction: 'down-good' },
        { key: 'neck', label: 'Boyun', unit: 'cm', direction: 'down-good' },
        { key: 'chest', label: 'Göğüs', unit: 'cm', direction: 'up-good' },
        { key: 'waist', label: 'Bel', unit: 'cm', direction: 'down-good' },
        { key: 'basen', label: 'Basen', unit: 'cm', direction: 'down-good' },
        { key: 'sol_onkol', label: 'Sol Önkol', unit: 'cm', direction: 'up-good' },
        { key: 'sag_onkol', label: 'Sağ Önkol', unit: 'cm', direction: 'up-good' },
        { key: 'l_arm', label: 'Sol Kol', unit: 'cm', direction: 'up-good' },
        { key: 'r_arm', label: 'Sağ Kol', unit: 'cm', direction: 'up-good' },
        { key: 'l_bacak', label: 'Sol Üst Bacak', unit: 'cm', direction: 'up-good' },
        { key: 'r_bacak', label: 'Sağ Üst Bacak', unit: 'cm', direction: 'up-good' },
        { key: 'l_kalf', label: 'Sol Kalf', unit: 'cm', direction: 'up-good' },
        { key: 'r_kalf', label: 'Sağ Kalf', unit: 'cm', direction: 'up-good' },
        { key: 'yas', label: 'Yaş', unit: 'yıl', direction: 'neutral' },
        { key: 'rhr', label: 'Dinlenik Nabız (RHR)', unit: 'bpm', direction: 'down-good' },
        { key: 'mhr', label: 'Maksimum Nabız (MHR)', unit: 'bpm', direction: 'neutral' },
        { key: 'hrr', label: 'Nabız Rezervi (HRR)', unit: 'bpm', direction: 'up-good' },
        { key: 'cooper', label: 'Test Sonu Nabız', unit: 'bpm', direction: 'down-good' },
        { key: 'vo2max', label: 'VO2 Max', unit: 'ml/kg/min', direction: 'up-good' },
        { key: 'bmr', label: 'Bazal Metabolizma (BMR)', unit: 'kcal', direction: 'neutral' }
    ];

    const getMeasurementDelta = (current, previous, key) => {
        const currentValue = parseFloat(current?.[key]);
        const previousValue = parseFloat(previous?.[key]);
        if (!Number.isFinite(currentValue) || !Number.isFinite(previousValue)) return null;
        return Number((currentValue - previousValue).toFixed(1));
    };

    const getDeltaClass = (delta, direction) => {
        if (delta === null || delta === 0) return 'delta-neutral';
        if (direction === 'neutral') return 'delta-neutral';
        const isPositive = direction === 'up-good' ? delta > 0 : delta < 0;
        return isPositive ? 'delta-positive' : 'delta-negative';
    };

    const formatDelta = (delta, unit = '') => {
        if (delta === null) return 'İlk ölçüm';
        if (delta === 0) return `= 0${unit}`;
        return `${delta > 0 ? '+' : ''}${delta}${unit}`;
    };

    const handleError = (err, context) => {
        console.error(`[${context}] Error:`, err);
    };

    // --- CRITICAL DATA SAFETY HELPER ---
    window.safeJSONParse = (data, fallback = null) => {
        if (!data) return fallback;
        if (typeof data !== 'string') return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.warn("JSON Parse Error on data:", data, e);
            return fallback;
        }
    };

    // --- GLOBAL MODAL & ACCORDION HELPERS ---

    window.openModal = (id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'block';
    };

    window.closeModal = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = 'none';
        if (id === 'modal-new-exercise') {
            document.getElementById('edit-ex-id').value = '';
            document.getElementById('new-ex-name').value = '';
            document.getElementById('group-body-part').value = '';
            document.getElementById('group-muscles-container').style.display = 'none';
            document.getElementById('ex-modal-title').innerText = 'Egzersiz Yönetimi';
        }
        if (id === 'modal-new-food') {
            document.getElementById('edit-f-id').value = '';
            document.getElementById('new-f-name').value = '';
            document.getElementById('new-f-portion').value = '';
            document.getElementById('new-f-cal').value = '';
            document.getElementById('new-f-pro').value = '';
            document.getElementById('new-f-carb').value = '';
            document.getElementById('new-f-fat').value = '';
            document.getElementById('f-modal-title').innerText = 'Besin Yönetimi';
        }
    };

    window.toggleAcc = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const isOpen = el.style.display === 'block';
        el.style.display = isOpen ? 'none' : 'block';
        el.parentElement.classList.toggle('active');
    };

    window.toggleSearchFilters = () => {
        const dropdown = document.getElementById('search-filters-dropdown');
        if (dropdown) dropdown.classList.toggle('active');
    };

    // --- TIME MACHINE (UNDO) LOGIC ---

    window.pushToUndoLog = (actionType, tableName, oldData, newData, description) => {
        if (!state.undoStack) state.undoStack = [];
        state.undoStack.unshift({
            id: Date.now(),
            type: actionType,
            table: tableName,
            oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
            newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
            desc: description,
            time: new Date().toLocaleTimeString('tr-TR')
        });
        if (state.undoStack.length > 20) state.undoStack.pop();

    };

    window.globalUndo = () => {
        window.renderUndoLog();
        window.openModal('modal-undo-log');
    };

    window.renderUndoLog = () => {
        const container = document.getElementById('undo-log-list');
        if (!container) return;
        if (!state.undoStack || state.undoStack.length === 0) {
            container.innerHTML = '<div class="no-results">İşlem geçmişi boş.</div>';
            return;
        }
        container.innerHTML = state.undoStack.map((item, index) => `
            <div class="card mt-1" onclick="window.revertTo(${index})" style="cursor:pointer; border-left: 4px solid var(--primary); padding: 1rem;">
                <div style="display:flex; justify-content:space-between;">
                    <strong>${item.desc}</strong>
                    <small style="color:var(--primary);">${item.time}</small>
                </div>
                <p style="font-size:0.75rem; color:var(--text-dim); margin-top:0.3rem;">Tablo: ${item.table} | Tip: ${item.type}</p>
                <div style="font-size:0.7rem; color:var(--accent); margin-top:0.5rem; text-align:right;">Bu adıma geri dönmek için dokunun ↩</div>
            </div>
        `).join('');
    };

    window.revertTo = async (index) => {
        if (!confirm("Seçilen işleme kadar olan tüm değişiklikler geri alınacak. Emin misiniz?")) return;
        window.closeModal('modal-undo-log');
        try {
            const actions = state.undoStack.slice(0, index + 1);
            for (const action of actions) {
                if (action.type === 'INSERT') await supabase.from(action.table).delete().eq('id', action.newData.id);
                else if (action.type === 'DELETE') await supabase.from(action.table).insert(action.oldData);
                else if (action.type === 'UPDATE') await supabase.from(action.table).upsert(action.oldData);
            }
            state.undoStack.splice(0, index + 1);
            await sync();
            alert("İşlemler geri alındı!");
        } catch (err) { handleError(err, "Revert"); }
    };

    // --- NAVIGATION ---

    window.nav = (id, saveHistory = true) => {
        if (saveHistory) {
            const currentTop = state.navHistory[state.navHistory.length - 1];
            if (currentTop !== id) state.navHistory.push(id);
        }
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
        refreshAll();
    };

    window.goBack = () => {
        if (state.navHistory.length > 1) {
            state.navHistory.pop();
            window.nav(state.navHistory[state.navHistory.length - 1], false);
        } else {
            window.nav('members-view', false);
        }
    };

    window.tab = (id) => {
        if (state.measurementRequired && id !== 'measurements') {
            alert("⚠️ Bu ay için ölçüm zorunludur! Lütfen önce ölçüm kaydedin.");
            return;
        }
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none';
        });
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

        const targetTab = document.getElementById(`tab-${id}`);
        const targetBtn = document.getElementById(`btn-tab-${id}`);
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
        }
        if (targetBtn) targetBtn.classList.add('active');
        if(id === 'analytics') window.loadMetricList();
        refreshAll();
    };

    // --- TIMER ---

    window.toggleWorkoutTimer = () => {
        const btn = document.getElementById('btn-timer-toggle');
        if (workoutTimer) {
            clearInterval(workoutTimer);
            workoutTimer = null;
            btn.innerText = '▶ Devam Et';
            btn.style.background = 'var(--accent)';
        } else {
            workoutTimer = setInterval(() => {
                seconds++;
                const hrs = Math.floor(seconds / 3600);
                const mins = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                document.getElementById('timer-val').innerText =
                    `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }, 1000);
            btn.innerText = '⏸ Durdur';
            btn.style.background = 'var(--danger)';
        }
    };

    window.resetWorkoutTimer = () => {
        clearInterval(workoutTimer); workoutTimer = null; seconds = 0;
        document.getElementById('timer-val').innerText = '00:00:00';
        const btn = document.getElementById('btn-timer-toggle');
        if (btn) btn.innerText = '▶ Antrenmanı Başlat';
    };

    window.stepValue = (id, amount) => {
        const input = document.getElementById(id);
        if (!input) return;
        let val = (parseFloat(input.value) || 0) + amount;
        input.value = val < 0 ? 0 : val.toFixed(1);
    };

    // --- DASHBOARD & ANALYTICS ---

    window.updateDashboardSummary = () => {
        if (!state.activeMemberId) return;
        const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b)=>new Date(b.tarih)-new Date(a.tarih));
        const myW = state.workouts.filter(w => w.member_id == state.activeMemberId);
        const myD = state.diets.filter(d => d.member_id == state.activeMemberId).sort((a,b)=>new Date(b.tarih)-new Date(a.tarih));

        document.getElementById('stat-weight').innerText = myM.length > 0 ? `${myM[0].weight} kg` : '--';
        document.getElementById('stat-fat').innerText = myM.length > 0 ? `%${myM[0].fat}` : '--';
        document.getElementById('stat-workouts').innerText = myW.length;

        if (myD.length > 0) {
            const lastDiet = myD[0];
            const meals = window.safeJSONParse(lastDiet.ogunler, []);
            let tCal = 0;
            meals.forEach(m => tCal += m.kalori || 0);
            document.getElementById('stat-cals').innerText = `${tCal.toFixed(0)} kcal`;
        } else {
            document.getElementById('stat-cals').innerText = '--';
        }

        window.updateChart();
    };

    window.loadMetricList = () => {
        const cat = document.getElementById('chart-cat').value;
        const sub = document.getElementById('chart-sub-cat');
        if (!sub) return;
        sub.innerHTML = '<option value="">Seçin...</option>';
        if(cat === 'olcum' || cat === 'testler') {
            const bodyMeasurementKeys = new Set([
                'weight', 'fat', 'neck', 'chest', 'waist', 'basen',
                'sol_onkol', 'sag_onkol', 'l_arm', 'r_arm',
                'l_bacak', 'r_bacak', 'l_kalf', 'r_kalf'
            ]);
            const bodyMeasurements = MEASUREMENT_FIELDS.filter(field => bodyMeasurementKeys.has(field.key));
            const testMeasurements = MEASUREMENT_FIELDS.filter(field => !bodyMeasurementKeys.has(field.key));

            if (cat === 'olcum') {
                sub.innerHTML += `<optgroup label="Vücut Ölçümleri">
                    ${bodyMeasurements.map(field => `<option value="${field.key}">${field.label}</option>`).join('')}
                </optgroup>`;
                sub.innerHTML += `<optgroup label="Test Değerleri">
                    ${testMeasurements.map(field => `<option value="${field.key}">${field.label}</option>`).join('')}
                </optgroup>`;
            } else {
                sub.innerHTML += `<optgroup label="Test Değerleri">
                    ${testMeasurements.map(field => `<option value="${field.key}">${field.label}</option>`).join('')}
                </optgroup>`;
            }
        } else if (cat === 'beslenme') {
            [['kalori', 'Toplam Kalori'], ['protein', 'Protein (g)'], ['karbonhidrat', 'Karbonhidrat (g)'], ['yag', 'Yağ (g)']].forEach(m => {
                sub.innerHTML += `<option value="${m[0]}">${m[1]}</option>`;
            });
        } else {
            const myW = state.workouts.filter(w => w.member_id == state.activeMemberId);
            const exercises = [...new Set(myW.flatMap(w => {
                const sets = window.safeJSONParse(w.setler, []);
                return sets.map(s => s.ad);
            }))];
            exercises.forEach(ex => sub.innerHTML += `<option value="${ex}">${ex}</option>`);
        }
    };

    window.updateChart = () => {
        const cat = document.getElementById('chart-cat').value;
        const metric = document.getElementById('chart-sub-cat').value;
        const chartCanvas = document.getElementById('mainChart');
        if(!chartCanvas || !metric) return;

        const ctx = chartCanvas.getContext('2d');
        let labels = [], data = [], chartDeltas = [];

        if(cat === 'olcum' || cat === 'testler') {
            const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b)=>new Date(a.tarih)-new Date(b.tarih));
            labels = myM.map(m => new Date(m.tarih).toLocaleDateString('tr-TR'));
            data = myM.map(m => {
                const value = parseFloat(m[metric]);
                return Number.isFinite(value) ? value : null;
            });
            chartDeltas = myM.map((m, index) => {
                const previous = index > 0 ? myM[index - 1] : null;
                return getMeasurementDelta(m, previous, metric);
            });
        } else if (cat === 'beslenme') {
            const myD = state.diets.filter(d => d.member_id == state.activeMemberId).sort((a,b)=>new Date(a.tarih)-new Date(b.tarih));
            myD.forEach(d => {
                const meals = window.safeJSONParse(d.ogunler, []);
                let total = 0;
                meals.forEach(m => total += m[metric] || 0);
                labels.push(new Date(d.tarih).toLocaleDateString('tr-TR'));
                data.push(total);
            });
        } else {
            const myW = state.workouts.filter(w => w.member_id == state.activeMemberId).sort((a,b)=>new Date(a.tarih)-new Date(b.tarih));
            myW.forEach(w => {
                const sets = window.safeJSONParse(w.setler, []);
                const s = sets.find(s => s.ad === metric);
                if(s) { labels.push(new Date(w.tarih).toLocaleDateString('tr-TR')); data.push(parseFloat(s.weight) || 0); }
            });
        }

        if(chartObj) chartObj.destroy();
        const measurementField = MEASUREMENT_FIELDS.find(field => field.key === metric);
        const chartUnit = measurementField?.unit || '';
        const chartLabel = measurementField?.label || metric.toUpperCase();

        chartObj = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: [{ label: chartLabel, data, borderColor: '#00f2fe', tension: 0.4, fill: true, backgroundColor: 'rgba(0, 242, 254, 0.1)' }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                const valueText = Number.isFinite(value) ? `${value}${chartUnit}` : '--';
                                if (cat !== 'olcum' && cat !== 'testler') return `${chartLabel}: ${valueText}`;
                                const delta = chartDeltas[context.dataIndex];
                                return [
                                    `${chartLabel}: ${valueText}`,
                                    `Değişim: ${formatDelta(delta, chartUnit)}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    };

    window.getLastPerformance = (exName) => {
        if (!state.activeMemberId) return null;
        const myW = state.workouts
            .filter(w => w.member_id == state.activeMemberId)
            .sort((a,b) => new Date(b.tarih) - new Date(a.tarih)); // FIX: sort descending logic via b-a date parse

        for (const w of myW) {
            const setler = window.safeJSONParse(w.setler, []);
            const set = setler.find(s => s.ad === exName);
            if (set) return { weight: set.weight, reps: set.reps, date: w.tarih };
        }
        return null;
    };

    window.updatePerfHint = (selectEl) => {
        const exName = selectEl.value;
        const hintDiv = selectEl.parentElement.nextElementSibling;
        const last = window.getLastPerformance(exName);
        if (last) {
            hintDiv.style.display = 'block';
            hintDiv.innerHTML = `💡 Son Performans: <b>${last.weight}kg x ${last.reps}</b> (${new Date(last.date).toLocaleDateString('tr-TR')})`;
        } else {
            hintDiv.style.display = 'none';
        }
    };

    // --- RENDERING ---

    window.renderFoods = () => {
        const container = document.getElementById('foods-grid');
        if (!container) return;

        const filterDropdown = document.getElementById('filter-food-type');
        const filterType = filterDropdown?.value || '';

        function getAnaGrup(tip) {
            if (!tip) return 'Yiyecekler';
            if (tip.includes('İçecek')) return 'İçecekler';
            const supTypes = ['💪 Protein Tozları', '🔋 Karbonhidratlar', '🧬 Amino Asitler', '⚡ Performans & Enerji', '🔥 Yağ Yakıcılar', '💊 Vitaminler', '🪨 Mineraller', '🌿 Sağlık & Wellness'];
            if (supTypes.includes(tip) || tip.includes('Supplement')) return 'Supplementler';
            return 'Yiyecekler';
        }

        const superGroups = {
            'Yiyecekler': {},
            'İçecekler': {},
            'Supplementler': {}
        };

        // Dynamically build available types
        const availableTypes = [...new Set(state.foods.map(f => f.tip || 'Yemek'))].sort();
        if (filterDropdown && filterDropdown.options.length <= 4) { // Initialize dropdown if not yet built dynamically
            const currVal = filterDropdown.value;
            filterDropdown.innerHTML = '<option value="">Tüm Tipler</option>' + availableTypes.map(t => `<option value="${t}">${t}</option>`).join('');
            filterDropdown.value = currVal;
        }

        state.foods.forEach(f => {
            if (filterType && f.tip !== filterType) return;
            const t = f.tip || 'Yemek';
            const ana = getAnaGrup(t);
            if (!superGroups[ana][t]) superGroups[ana][t] = [];
            superGroups[ana][t].push(f);
        });

        let html = '';

        Object.keys(superGroups).forEach(ana => {
            const altGruplar = superGroups[ana];
            const altGrupIsimleri = Object.keys(altGruplar).sort();
            if (altGrupIsimleri.length === 0) return;

            let anaIcon = ana === 'Yiyecekler' ? '🍽️' : (ana === 'İçecekler' ? '🥤' : '💊');
            html += `<h2 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--primary); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">${anaIcon} ${ana}</h2>`;

            altGrupIsimleri.forEach(alt => {
                const list = altGruplar[alt];
                if (list.length === 0) return;

                const displayList = list.slice(0, 100);
                const hiddenCount = list.length - displayList.length;
                const hiddenNote = hiddenCount > 0 ? `<div style="text-align:center; padding:1rem; color:var(--text-dim); font-size:0.8rem;">+ ${hiddenCount} besin daha var. Bulmak için Arama Çubuğunu kullanın.</div>` : '';

                html += `
                    <div class="accordion mt-1">
                        <div class="acc-header" onclick="window.toggleAcc('food-group-${alt.replace(/[^a-zA-Z0-9]/g, '')}')" style="background: rgba(255,255,255,0.03);">
                            <h3 style="font-size: 0.95rem;">${alt} (${list.length})</h3>
                            <span>▼</span>
                        </div>
                        <div id="food-group-${alt.replace(/[^a-zA-Z0-9]/g, '')}" class="acc-body grid">
                            ${displayList.map(f => `
                                <div class="card">
                                    <h3>${f.ad}</h3>
                                    <p style="font-size:0.8rem; color:var(--text-dim); margin-bottom:0.5rem;">${f.porsiyon}</p>
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:0.5rem; background:rgba(0,0,0,0.2); border-radius:4px;">
                                        <span>🔥 ${f.kalori} kcal</span>
                                        <span>P: ${f.protein}g</span>
                                        <span>C: ${f.karbonhidrat}g</span>
                                        <span>Y: ${f.yag}g</span>
                                    </div>
                                    <div class="card-actions mt-1">
                                        <button class="btn-edit" onclick="window.editFood(${f.id})">✎</button>
                                        <button class="btn-delete" onclick="window.deleteFood(${f.id})">🗑</button>
                                    </div>
                                </div>
                            `).join('')}
                            ${hiddenNote}
                        </div>
                    </div>
                `;
            });
        });

        container.innerHTML = html;

        if (container.innerHTML === '') {
            container.innerHTML = '<div class="no-results mt-1">Kriterlere uygun besin bulunamadı.</div>';
        }
    };

    window.editFood = (id) => {
        const f = state.foods.find(x => x.id == id);
        if (!f) return;
        document.getElementById('edit-f-id').value = f.id;
        document.getElementById('new-f-name').value = f.ad;
        document.getElementById('new-f-type').value = f.tip;
        document.getElementById('new-f-portion').value = f.porsiyon;
        document.getElementById('new-f-cal').value = f.kalori;
        document.getElementById('new-f-pro').value = f.protein;
        document.getElementById('new-f-carb').value = f.karbonhidrat;
        document.getElementById('new-f-fat').value = f.yag;
        document.getElementById('f-modal-title').innerText = 'Besini Düzenle';
        window.openModal('modal-new-food');
    };

    window.saveNewFood = async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('edit-f-id').value;
        const id = existingId || Date.now();
        const newData = {
            id,
            ad: document.getElementById('new-f-name').value,
            tip: document.getElementById('new-f-type').value,
            porsiyon: document.getElementById('new-f-portion').value,
            kalori: parseFloat(document.getElementById('new-f-cal').value) || 0,
            protein: parseFloat(document.getElementById('new-f-pro').value) || 0,
            karbonhidrat: parseFloat(document.getElementById('new-f-carb').value) || 0,
            yag: parseFloat(document.getElementById('new-f-fat').value) || 0
        };
        await supabase.from('master_besinler').upsert(newData);
        const oldData = existingId ? state.foods.find(f => f.id == existingId) : null;
        window.pushToUndoLog(existingId ? 'UPDATE' : 'INSERT', 'master_besinler', oldData, newData, `Besin: ${newData.ad}`);
        await sync();
        window.closeModal('modal-new-food');
    };

    window.deleteFood = async (id) => {
        if (confirm("Silinsin mi?")) {
            const oldData = state.foods.find(f => f.id == id);
            await supabase.from('master_besinler').delete().eq('id', id);
            window.pushToUndoLog('DELETE', 'master_besinler', oldData, null, `Besin Silindi: ${oldData.ad}`);
            await sync();
        }
    };

    window.renderDietHistory = () => {
        const container = document.getElementById('diet-history-tree');
        if (!container) return;
        const myDiets = state.diets.filter(d => d.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myDiets.length === 0) { container.innerHTML = '<div class="no-results mt-1">Beslenme planı bulunamadı.</div>'; return; }
        container.innerHTML = myDiets.map(d => {
            const meals = window.safeJSONParse(d.ogunler, []);
            let tCal = 0, tPro = 0, tCarb = 0, tFat = 0;
            meals.forEach(m => {
                tCal += m.kalori || 0; tPro += m.protein || 0; tCarb += m.karbonhidrat || 0; tFat += m.yag || 0;
            });
            return `
            <div class="card mt-1" onclick="window.showDietDetail(${d.id})" style="cursor:pointer;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div><div class="workout-meta">${new Date(d.tarih).toLocaleDateString('tr-TR')}</div><h3>${d.plan_adi}</h3></div>
                    <div class="card-actions">
                        <button class="btn-delete" onclick="event.stopPropagation(); window.deleteDietPlan(${d.id})">🗑</button>
                    </div>
                </div>
                <div style="display:flex; gap:0.5rem; font-size:0.8rem; margin-top:0.5rem; color:var(--text-dim);">
                    <span>🔥 ${tCal.toFixed(0)} kcal</span>|<span>P: ${tPro.toFixed(0)}g</span>|<span>C: ${tCarb.toFixed(0)}g</span>|<span>Y: ${tFat.toFixed(0)}g</span>
                </div>
            </div>
        `}).join('');
    };

    window.openDietModal = () => {
        document.getElementById('d-name').value = '';
        document.getElementById('meal-rows-container').innerHTML = '';
        const today = new Date();
        const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('d-date').value = dateString;
        window.updateDietTotals();
        window.openModal('modal-diet');
    };

    // --- YENİ BESLENME SİSTEMİ (ÖĞÜN GRUPLARI & KOPYALAMA) ---

    // 1. Tekil Besin Satırı (Kopyalama Özellikli)
    window.addSingleFoodRow = (container, vals = {}) => {
        const div = document.createElement('div');
        div.className = 'single-food-row';
        div.style.position = 'relative';
        div.style.marginBottom = '0.4rem';
        div.style.paddingBottom = '0.4rem';
        div.style.borderBottom = '1px dashed rgba(255,255,255,0.1)';

        div.innerHTML = `
            <div class="form-group" style="margin-bottom:0.5rem;">
                <div style="position:relative;">
                    <input type="text" class="ex-select m-search w-full" placeholder="Besin Ara (Örn: Tavuk, Yulaf)..." oninput="window.searchFoodForDiet(this)" autocomplete="off" value="${vals.searchName || ''}">
                    <input type="hidden" class="m-name" required value="${vals.foodId || ''}">
                    <div class="m-search-results" style="display:none; position:absolute; top:100%; left:0; width:100%; background:var(--bg); border:1px solid var(--border); border-radius:4px; max-height:200px; overflow-y:auto; z-index:1000; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>
                </div>
            </div>
            <div class="grid" style="grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr; gap:0.5rem; align-items:end;">
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Miktar</label>
                    <input type="number" step="0.1" class="m-qty w-full" value="${vals.qty || ''}" required oninput="window.updateMealRow(this)" style="padding:0.4rem; border-radius:4px;" ${vals.baseAmount ? `data-base-amount="${vals.baseAmount}" data-base-cal="${vals.baseCal}" data-base-pro="${vals.basePro}" data-base-carb="${vals.baseCarb}" data-base-fat="${vals.baseFat}"` : ''}>
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Kcal</label>
                    <input type="number" step="0.1" class="m-cal w-full" value="${vals.cal || ''}" required oninput="window.updateDietTotals()" style="padding:0.4rem; border-radius:4px;">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Pro(g)</label>
                    <input type="number" step="0.1" class="m-pro w-full" value="${vals.pro || ''}" required oninput="window.updateDietTotals()" style="padding:0.4rem; border-radius:4px;">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Karb(g)</label>
                    <input type="number" step="0.1" class="m-carb w-full" value="${vals.carb || ''}" required oninput="window.updateDietTotals()" style="padding:0.4rem; border-radius:4px;">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Yağ(g)</label>
                    <input type="number" step="0.1" class="m-fat w-full" value="${vals.fat || ''}" required oninput="window.updateDietTotals()" style="padding:0.4rem; border-radius:4px;">
                </div>
                <div class="form-group" style="margin:0; text-align:right; display:flex; justify-content:flex-end; gap:0.4rem;">
                    <button type="button" onclick="window.duplicateFoodRow(this)" style="background:transparent; border:none; color:var(--primary-color, #4CAF50); font-size:1.2rem; cursor:pointer; padding:0; line-height:1;" title="Bu besini kopyala">⧉</button>
                    <button type="button" onclick="this.parentElement.parentElement.parentElement.remove(); window.updateDietTotals();" style="background:transparent; border:none; color:#ff4444; font-size:1.2rem; cursor:pointer; padding:0; line-height:1;" title="Sil">×</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    };

    window.duplicateFoodRow = (btn) => {
        const row = btn.closest('.single-food-row');
        const container = row.parentElement;
        const qtyInput = row.querySelector('.m-qty');

        const vals = {
            searchName: row.querySelector('.m-search').value,
            foodId: row.querySelector('.m-name').value,
            qty: qtyInput.value,
            cal: row.querySelector('.m-cal').value,
            pro: row.querySelector('.m-pro').value,
            carb: row.querySelector('.m-carb').value,
            fat: row.querySelector('.m-fat').value,
            baseAmount: qtyInput.dataset.baseAmount,
            baseCal: qtyInput.dataset.baseCal,
            basePro: qtyInput.dataset.basePro,
            baseCarb: qtyInput.dataset.baseCarb,
            baseFat: qtyInput.dataset.baseFat
        };
        window.addSingleFoodRow(container, vals);
        window.updateDietTotals();
    };

    // 2. Ana Öğün Grubu (Kahvaltı, Öğle vs.)
    window.addMealRowToDiet = () => {
        const container = document.getElementById('meal-rows-container');
        const uniqueId = Date.now() + Math.random();

        const wrapper = document.createElement('div');
        wrapper.className = 'meal-group-wrapper';
        wrapper.style.marginBottom = '1rem';
        wrapper.style.padding = '1rem';
        wrapper.style.background = 'rgba(255,255,255,0.02)';
        wrapper.style.borderRadius = '8px';
        wrapper.style.position = 'relative';

        wrapper.innerHTML = `
            <button type="button" class="btn-delete" onclick="this.parentElement.remove(); window.updateDietTotals();" style="position:absolute; top:5px; right:5px; width:24px; height:24px; padding:0; display:flex; align-items:center; justify-content:center;">×</button>

            <div class="form-group" style="margin-bottom:0.8rem; padding-right: 30px;">
                <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Öğün Adı</label>
                <select class="m-meal-name w-full" required style="font-weight:bold;">
                    <option value="Kahvaltı">Kahvaltı</option>
                    <option value="Öğle Yemeği">Öğle Yemeği</option>
                    <option value="Akşam Yemeği">Akşam Yemeği</option>
                    <option value="Ara Öğün 1">Ara Öğün 1</option>
                    <option value="Ara Öğün 2">Ara Öğün 2</option>
                    <option value="Antrenman Öncesi">Antrenman Öncesi</option>
                    <option value="Antrenman Sonrası">Antrenman Sonrası</option>
                    <option value="Gece">Gece Öğünü</option>
                </select>
            </div>

            <div class="foods-container" id="foods-${uniqueId}"></div>

            <button type="button" class="btn-secondary mt-1" style="font-size:0.75rem; padding:0.4rem; background:transparent; border:1px dashed var(--border); width:100%; color:var(--text-dim);" onclick="window.addSingleFoodRow(this.previousElementSibling)">
                + Bu Öğüne Besin Ekle
            </button>
        `;

        container.appendChild(wrapper);
        window.addSingleFoodRow(wrapper.querySelector('.foods-container'));
    };

    window.searchFoodForDiet = (inputEl) => {
        const keyword = inputEl.value.toLowerCase();
        const resultsContainer = inputEl.nextElementSibling.nextElementSibling;

        if (keyword.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }
        const matches = state.foods.filter(f => f.ad.toLowerCase().includes(keyword) || (f.tip && f.tip.toLowerCase().includes(keyword))).slice(0, 50);
        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:0.5rem; color:var(--text-dim); font-size:0.8rem;">Sonuç bulunamadı.</div>';
        } else {
            resultsContainer.innerHTML = matches.map(f => `
                <div style="padding:0.5rem; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; font-size:0.8rem;" onclick="window.selectFoodForDiet(this, ${f.id}, '${f.ad.replace(/'/g, "\\'")}')">
                    <strong>${f.ad}</strong><br>
                    <span style="color:var(--text-dim); font-size:0.7rem;">${f.tip || 'Yemek'} - ${f.porsiyon} | 🔥${f.kalori} P:${f.protein} C:${f.karbonhidrat} Y:${f.yag}</span>
                </div>
            `).join('');
        }
        resultsContainer.style.display = 'block';
    };

    window.selectFoodForDiet = (itemEl, id, name) => {
        const wrapper = itemEl.closest('.form-group');
        const inputSearch = wrapper.querySelector('.m-search');
        const inputHidden = wrapper.querySelector('.m-name');
        const resultsContainer = wrapper.querySelector('.m-search-results');

        inputSearch.value = name;
        inputHidden.value = id;
        resultsContainer.style.display = 'none';

        window.fillMealData(inputHidden);
    };

    window.fillMealData = (hiddenInputEl) => {
        const id = hiddenInputEl.value;
        const wrapper = hiddenInputEl.closest('.single-food-row');
        const f = state.foods.find(x => x.id == id);
        const qtyInput = wrapper.querySelector('.m-qty');

        if (f) {
            const match = (f.porsiyon || '').match(/(\d+)\s*(g|ml)/i);
            const baseAmount = match ? parseFloat(match[1]) : 1;

            qtyInput.dataset.baseAmount = baseAmount;
            qtyInput.dataset.baseCal = f.kalori;
            qtyInput.dataset.basePro = f.protein;
            qtyInput.dataset.baseCarb = f.karbonhidrat;
            qtyInput.dataset.baseFat = f.yag;

            qtyInput.value = baseAmount;
            window.updateMealRow(qtyInput);
        } else {
            qtyInput.value = '';
            wrapper.querySelector('.m-cal').value = '';
            wrapper.querySelector('.m-pro').value = '';
            wrapper.querySelector('.m-carb').value = '';
            wrapper.querySelector('.m-fat').value = '';
            window.updateDietTotals();
        }
    };

    window.updateMealRow = (qtyInput) => {
        const wrapper = qtyInput.closest('.single-food-row');
        const val = parseFloat(qtyInput.value) || 0;
        const baseAmount = parseFloat(qtyInput.dataset.baseAmount) || 1;
        const multiplier = baseAmount > 0 ? (val / baseAmount) : 0;

        wrapper.querySelector('.m-cal').value = (parseFloat(qtyInput.dataset.baseCal || 0) * multiplier).toFixed(1);
        wrapper.querySelector('.m-pro').value = (parseFloat(qtyInput.dataset.basePro || 0) * multiplier).toFixed(1);
        wrapper.querySelector('.m-carb').value = (parseFloat(qtyInput.dataset.baseCarb || 0) * multiplier).toFixed(1);
        wrapper.querySelector('.m-fat').value = (parseFloat(qtyInput.dataset.baseFat || 0) * multiplier).toFixed(1);

        window.updateDietTotals();
    };

    window.updateDietTotals = () => {
        let tCal = 0, tPro = 0, tCarb = 0, tFat = 0;
        document.querySelectorAll('.single-food-row').forEach(row => {
            tCal += parseFloat(row.querySelector('.m-cal').value) || 0;
            tPro += parseFloat(row.querySelector('.m-pro').value) || 0;
            tCarb += parseFloat(row.querySelector('.m-carb').value) || 0;
            tFat += parseFloat(row.querySelector('.m-fat').value) || 0;
        });
        const elCal = document.getElementById('diet-total-cals');
        if(elCal) {
            elCal.innerText = tCal.toFixed(1);
            document.getElementById('diet-total-pro').innerText = tPro.toFixed(1);
            document.getElementById('diet-total-carb').innerText = tCarb.toFixed(1);
            document.getElementById('diet-total-fat').innerText = tFat.toFixed(1);
        }
    };

    window.saveDietPlan = async (e) => {
        e.preventDefault();
        const ogunler = [];

        // Ana Öğün Bloklarını Dön
        document.querySelectorAll('.meal-group-wrapper').forEach(mealWrapper => {
            const ogunAdi = mealWrapper.querySelector('.m-meal-name').value;

            // Öğünün içindeki alt besinleri dön
            mealWrapper.querySelectorAll('.single-food-row').forEach(row => {
                const fId = row.querySelector('.m-name').value;
                const f = state.foods.find(x => x.id == fId);
                if (f) {
                    ogunler.push({
                        ogun_adi: ogunAdi,
                        ad: f.ad,
                        porsiyon: f.porsiyon,
                        miktar: parseFloat(row.querySelector('.m-qty').value) || 0,
                        kalori: parseFloat(row.querySelector('.m-cal').value) || 0,
                        protein: parseFloat(row.querySelector('.m-pro').value) || 0,
                        karbonhidrat: parseFloat(row.querySelector('.m-carb').value) || 0,
                        yag: parseFloat(row.querySelector('.m-fat').value) || 0
                    });
                }
            });
        });

        const d = {
            id: Date.now(),
            member_id: state.activeMemberId,
            tarih: document.getElementById('d-date').value,
            plan_adi: document.getElementById('d-name').value,
            ogunler: JSON.stringify(ogunler)
        };
        await supabase.from('beslenme_planlari').upsert(d);
        window.pushToUndoLog('INSERT', 'beslenme_planlari', null, d, `Beslenme Planı: ${d.plan_adi}`);
        await sync();
        window.closeModal('modal-diet');
        alert("Beslenme planı başarıyla kaydedildi!");
    };

    window.showDietDetail = (id) => {
        try {
            const d = state.diets.find(x => x.id == id);
            if (!d) return;
            const meals = window.safeJSONParse(d.ogunler, []);

            let grandCal = 0, grandPro = 0, grandCarb = 0, grandFat = 0;

            // 1. Besinleri Öğün Adına (ogun_adi) Göre Grupla
            const groupedMeals = {};
            meals.forEach(m => {
                const mealName = m.ogun_adi || "Diğer / Tanımsız";
                if (!groupedMeals[mealName]) {
                    groupedMeals[mealName] = { items: [], tCal: 0, tPro: 0, tCarb: 0, tFat: 0 };
                }
                groupedMeals[mealName].items.push(m);
                groupedMeals[mealName].tCal += m.kalori || 0;
                groupedMeals[mealName].tPro += m.protein || 0;
                groupedMeals[mealName].tCarb += m.karbonhidrat || 0;
                groupedMeals[mealName].tFat += m.yag || 0;

                grandCal += m.kalori || 0;
                grandPro += m.protein || 0;
                grandCarb += m.karbonhidrat || 0;
                grandFat += m.yag || 0;
            });

            document.getElementById('detail-title').innerText = `${d.plan_adi} Detayı`;

            // 2. Gruplanmış Verileri Profesyonel UI ile Bas
            let html = `
                <div style="margin-bottom: 1.5rem; padding: 1.2rem; background: rgba(0, 242, 254, 0.05); border: 1px solid var(--primary); border-radius: 12px; text-align: center;">
                    <div style="color:var(--text-dim); font-size: 0.85rem; margin-bottom: 0.5rem;">Günlük Toplam Makrolar</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">
                        🔥 ${grandCal.toFixed(0)} <span style="font-size:0.8rem; color:var(--text-dim); font-weight:normal;">kcal</span> &nbsp;|&nbsp;
                        P: <span style="color:var(--primary);">${grandPro.toFixed(0)}g</span> &nbsp;|&nbsp;
                        C: <span style="color:var(--accent);">${grandCarb.toFixed(0)}g</span> &nbsp;|&nbsp;
                        Y: <span style="color:#ffb142;">${grandFat.toFixed(0)}g</span>
                    </div>
                </div>
                <div class="diet-summary-container">
            `;

            for (const [mealName, data] of Object.entries(groupedMeals)) {
                html += `
                <div class="meal-group" style="margin-bottom: 1.2rem; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden;">
                    <div style="background: rgba(255,255,255,0.03); padding: 0.7rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: var(--text);">🍽️ ${mealName}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-dim);">
                            🔥 ${data.tCal.toFixed(1)} | P: ${data.tPro.toFixed(1)} | C: ${data.tCarb.toFixed(1)} | Y: ${data.tFat.toFixed(1)}
                        </span>
                    </div>
                    <div style="padding: 0.5rem 1rem;">
                        <table style="width: 100%; font-size: 0.85rem; text-align: left; border-collapse: collapse;">
                            <thead>
                                <tr style="color: var(--text-dim); border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <th style="padding: 0.4rem 0; width: 45%;">Besin</th>
                                    <th style="padding: 0.4rem 0; width: 20%;">Miktar</th>
                                    <th style="padding: 0.4rem 0; width: 15%;">Kcal</th>
                                    <th style="padding: 0.4rem 0; width: 20%;">P / C / Y</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.items.forEach(m => {
                    html += `
                                <tr style="border-bottom: 1px dashed rgba(255,255,255,0.05);">
                                    <td style="padding: 0.6rem 0; color: #fff; font-weight: 500;">${m.ad}</td>
                                    <td style="padding: 0.6rem 0; color: var(--text-dim);">${m.miktar}</td>
                                    <td style="padding: 0.6rem 0; font-weight: bold; color: #fff;">${m.kalori}</td>
                                    <td style="padding: 0.6rem 0; font-size: 0.75rem; color: var(--text-dim);">${m.protein} / ${m.karbonhidrat} / ${m.yag}</td>
                                </tr>
                    `;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                </div>`;
            }

            html += '</div>';
            document.getElementById('detail-body').innerHTML = html;
            window.openModal('modal-detail');
        } catch (err) { console.error("Beslenme detayı açılırken hata:", err); }
    };

    window.deleteDietPlan = async (id) => {
        if (confirm("Silinsin mi?")) {
            const oldData = state.diets.find(d => d.id == id);
            await supabase.from('beslenme_planlari').delete().eq('id', id);
            window.pushToUndoLog('DELETE', 'beslenme_planlari', oldData, null, `Plan Silindi: ${oldData.plan_adi}`);
            await sync();
        }
    };

    function refreshAll() {
        try {
            renderMembers();
            renderWorkoutHistory();
            renderMeasurementHistory();
            if(typeof renderCardioHistory === 'function') renderCardioHistory();
            renderDocuments();
            renderPrograms();
            window.renderExercises();
            if (window.renderFoods) window.renderFoods();
            if (window.renderDietHistory) window.renderDietHistory();
            window.updateDashboardSummary();
            const loader = document.getElementById('form-template-loader');
            if(loader) loader.innerHTML = '<option value="">Şablon Seç...</option>' + state.programs.map(p=>`<option value="${p.id}">${p.program_adi}</option>`).join('');
        } catch (e) {
            console.error("RefreshAll Crash Protected:", e);
        }
    }

    function renderMembers() {
        const grid = document.getElementById('members-grid');
        if (!grid) return;
        const overview = document.getElementById('member-overview');
        if (overview) {
            const branchCount = new Set(state.members.map(member => member.brans).filter(Boolean)).size;
            const measuredCount = new Set(state.measurements.map(measurement => measurement.member_id)).size;
            overview.innerHTML = `
                <div class="member-overview-card">
                    <span>Toplam danışan</span>
                    <strong>${state.members.length}</strong>
                </div>
                <div class="member-overview-card">
                    <span>Aktif branş</span>
                    <strong>${branchCount}</strong>
                </div>
                <div class="member-overview-card">
                    <span>Ölçümü bulunan</span>
                    <strong>${measuredCount}</strong>
                </div>
            `;
        }
        const icons = { 'Fitness': '💪', 'Karate': '🥋', 'Basketbol': '🏀', 'Yoga': '🧘', 'Fonksiyonel Egzersiz': '⚡' };
        grid.innerHTML = state.members.length ? state.members.map(m => `
            <div class="card member-card" onclick="window.openProfile(${m.id})">
                <div class="member-card-top">
                    <div class="member-avatar">${icons[m.brans] || '👤'}</div>
                    <span class="member-card-arrow">→</span>
                </div>
                <h3>${m.ad_soyad}</h3>
                <p class="member-branch">${m.brans || 'Branş belirtilmemiş'}</p>
                <div class="card-actions">
                    <button class="btn-edit" onclick="event.stopPropagation(); window.editMember(${m.id})">Düzenle</button>
                    <button class="btn-delete" onclick="event.stopPropagation(); window.deleteMember(${m.id})">Sil</button>
                </div>
            </div>
        `).join('') : '<div class="empty-state"><strong>Henüz danışan yok</strong><span>İlk danışanı ekleyerek başlayın.</span></div>';
    }

    window.renderExercises = () => {
        const container = document.getElementById('exercises-grid');
        if (!container) return;

        const filterBodyPart = document.getElementById('filter-ex-bodypart')?.value || '';
        const filterMuscle = document.getElementById('filter-ex-muscle')?.value || '';
        const filterBranch = document.getElementById('filter-ex-branch')?.value || '';

        const groups = { 'Üst Ekstremite': [], 'Alt Ekstremite': [], 'Branşa Özel': [], 'Genel': [] };

        state.exercises.forEach(ex => {
            const g = window.safeJSONParse(ex.gruplar, {});
            const exBodyPart = g.bodyPart || '';
            const exMuscles = g.muscles || [];
            const exBranch = g.branch || ex.brans || 'Fitness';

            if (filterBodyPart && exBodyPart !== filterBodyPart) return;
            if (filterMuscle && !exMuscles.includes(filterMuscle)) return;
            if (filterBranch && exBranch !== filterBranch) return;

            if (exBodyPart === 'Üst Ekstremite') groups['Üst Ekstremite'].push(ex);
            else if (exBodyPart === 'Alt Ekstremite') groups['Alt Ekstremite'].push(ex);
            else if (exBranch !== 'Fitness') groups['Branşa Özel'].push(ex);
            else groups['Genel'].push(ex);
        });

        const isFiltered = filterBodyPart || filterMuscle || filterBranch;

        container.innerHTML = Object.entries(groups).map(([name, list]) => {
            if (list.length === 0) return '';
            const safeName = name.replace(/\s+/g, '-');
            const displayStyle = isFiltered ? 'block' : 'none';
            const activeClass = isFiltered ? 'active' : '';

            return `
                <div class="accordion mt-1 ${activeClass}">
                    <div class="acc-header" onclick="window.toggleAcc('ex-group-${safeName}')">
                        <h3>${name} (${list.length})</h3>
                        <span>▼</span>
                    </div>
                    <div id="ex-group-${safeName}" class="acc-body grid" style="display: ${displayStyle}">
                        ${list.map(ex => {
                            let tagsHtml = '';
                            const g = window.safeJSONParse(ex.gruplar, {});
                            if (g.bodyPart) tagsHtml += `<span class="tag">${g.bodyPart}</span>`;
                            if (g.muscles) g.muscles.forEach(m => tagsHtml += `<span class="tag secondary">${m}</span>`);
                            if (g.branch) tagsHtml += `<span class="tag accent">${g.branch}</span>`;
                            else if (ex.brans) tagsHtml += `<span class="tag accent">${ex.brans}</span>`;

                            return `
                            <div class="card">
                                <h3>${ex.ad}</h3>
                                <div class="tags-container">${tagsHtml}</div>
                                <div class="card-actions mt-1">
                                    <button class="btn-edit" onclick="window.editExercise(${ex.id})">✎</button>
                                    <button class="btn-delete" onclick="window.deleteExercise(${ex.id})">🗑</button>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
            `;
        }).join('');

        if (container.innerHTML === '') {
            container.innerHTML = '<div class="no-results mt-1">Kriterlere uygun egzersiz bulunamadı.</div>';
        }
    }

    function renderPrograms() {
        const container = document.getElementById('programs-by-branch');
        if (!container) return;
        const branches = [...new Set(state.exercises.map(e => e.brans).concat(['Fitness']))].filter(Boolean);
        container.innerHTML = branches.map(br => {
            const myProgs = state.programs.filter(p => {
                const details = window.safeJSONParse(p.detaylar, []);
                return details.some(ex => state.exercises.find(e => e.ad === ex.ad && e.brans === br));
            });
            if (myProgs.length === 0 && br !== 'Fitness') return '';

            return `
                <div class="accordion">
                    <div class="acc-header" onclick="window.toggleAcc('br-${br.replace(/\s+/g, '-')}')">
                        <h3>${br} Şablonları (${myProgs.length})</h3>
                        <span>▼</span>
                    </div>
                    <div id="br-${br.replace(/\s+/g, '-')}" class="acc-body grid">
                        ${myProgs.map(p => `
                            <div class="card" onclick="window.showProgramDetail(${p.id})">
                                <h3>${p.program_adi}</h3>
                                <div class="card-actions">
                                    <button class="btn-edit" onclick="event.stopPropagation(); window.editProgram(${p.id})">✎</button>
                                    <button class="btn-delete" onclick="event.stopPropagation(); window.deleteProgram(${p.id})">🗑 Sil</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }


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
                <p>VO2 Max: ${m.vo2max || '--'} ml/kg/min | RHR: ${m.rhr || '--'} bpm | MHR: ${m.mhr || '--'} bpm</p>
                <p>HRR: ${m.hrr || '--'} bpm | BMR: ${m.bmr || '--'} kcal | Test Sonu Nabız: ${m.cooper || '--'} bpm</p>
            </div>
        `).join('');
    }

    function renderMeasurementHistory() {
        const container = document.getElementById('m-history-tabs');
        const summaryContainer = document.getElementById('measurement-summary');
        if (!container) return;
        const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myM.length === 0) {
            container.innerHTML = '<div class="no-results mt-1">Ölçüm yok.</div>';
            if (summaryContainer) summaryContainer.innerHTML = '';
            return;
        }

        const latest = myM[0];
        const previous = myM[1] || null;
        if (summaryContainer) {
            const summaryFields = MEASUREMENT_FIELDS.slice(0, 4);
            summaryContainer.innerHTML = `
                <div class="measurement-summary-header">
                    <div>
                        <span class="summary-label">Son ölçüm</span>
                        <strong>${new Date(latest.tarih).toLocaleDateString('tr-TR')}</strong>
                    </div>
                    <span class="summary-label">${previous ? 'Önceki ölçüme göre' : 'İlk kayıt'}</span>
                </div>
                <div class="measurement-summary-grid">
                    ${summaryFields.map(field => {
                        const value = latest[field.key];
                        const delta = getMeasurementDelta(latest, previous, field.key);
                        return `<div class="measurement-summary-item">
                            <span>${field.label}</span>
                            <strong>${value ?? '--'} ${field.unit}</strong>
                            <small class="${getDeltaClass(delta, field.direction)}">${formatDelta(delta, field.unit)}</small>
                        </div>`;
                    }).join('')}
                </div>
            `;
        }

        container.innerHTML = myM.map((m, index) => {
            const previousMeasurement = myM[index + 1] || null;
            const keyFields = MEASUREMENT_FIELDS.slice(0, 2);
            const deltaHtml = keyFields.map(field => {
                const delta = getMeasurementDelta(m, previousMeasurement, field.key);
                return `<span class="measurement-delta ${getDeltaClass(delta, field.direction)}">
                    ${field.label}: ${formatDelta(delta, field.unit)}
                </span>`;
            }).join('');
            return `
            <div class="card mt-1 measurement-history-card" onclick="window.showMeasurementDetail(${m.id})">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>${new Date(m.tarih).toLocaleDateString('tr-TR')}</h3>
                    <div class="card-actions">
                        <button class="btn-edit" onclick="event.stopPropagation(); window.editMeasurement(${m.id})">✎</button>
                        <button class="btn-delete" onclick="event.stopPropagation(); window.deleteMeasurement(${m.id})">🗑</button>
                    </div>
                </div>
                <p>Kilo: ${m.weight}kg | Yağ: %${m.fat}</p>
                <div class="measurement-deltas">${deltaHtml}</div>
            </div>
        `;
        }).join('');
    }

    function renderWorkoutHistory() {
        const container = document.getElementById('workout-history-tree');
        if (!container) return;
        const myW = state.workouts.filter(w => w.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myW.length === 0) { container.innerHTML = '<div class="no-results mt-1">Antrenman yok.</div>'; return; }
        container.innerHTML = myW.map(w => `
            <div class="workout-item" onclick="window.showWorkoutDetail(${w.id})" style="cursor:pointer;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div><div class="workout-meta">${new Date(w.tarih).toLocaleDateString('tr-TR')}</div><h3>${w.sablon}</h3></div>
                    <div class="card-actions">
                        <button class="btn-delete" onclick="event.stopPropagation(); window.deleteWorkout(${w.id})">🗑</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderDocuments() {
        const container = document.getElementById('doc-list');
        if (!container) return;
        const myDocs = state.documents.filter(d => d.member_id == state.activeMemberId);
        const myCloudFiles = (state.cloudFiles || []).filter(f => !myDocs.some(d => d.yol === `${state.activeMemberId}/${f.name}`));

        let html = myDocs.map(d => `
            <div class="doc-card">
                <div class="doc-info"><h4>${d.adi}</h4><span>${d.tip || 'Dosya'}</span></div>
                <div class="doc-actions">
                    <button onclick="window.viewDocument('${d.yol}')" class="btn-view">👁</button>
                    <button onclick="window.deleteDocument(${d.id}, '${d.yol}')" class="btn-delete">🗑</button>
                </div>
            </div>
        `).join('');

        html += myCloudFiles.map(f => `
            <div class="doc-card">
                <div class="doc-info"><h4>${f.name.split('_').slice(1).join('_') || f.name}</h4><span>Bulut</span></div>
                <div class="doc-actions">
                    <button onclick="window.viewDocument('${state.activeMemberId}/${f.name}')" class="btn-view">👁</button>
                    <button onclick="window.deleteOnlyCloudDoc('${state.activeMemberId}/${f.name}')" class="btn-delete">🗑</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html || '<div class="no-results mt-1">Döküman bulunamadı.</div>';
    }

    // --- CRUD OPERATIONS ---

        window.editMember = (id) => {
        const m = state.members.find(x => x.id == id);
        if (!m) return;
        document.getElementById('edit-member-id').value = m.id;
        document.getElementById('m-name').value = m.ad_soyad;
        document.getElementById('m-branch').value = m.brans;
        if(document.getElementById('m-height')) { document.getElementById('m-height').value = m.boy || ''; }
        if(document.getElementById('m-gender')) { document.getElementById('m-gender').value = m.cinsiyet || 'Erkek'; }
        if(document.getElementById('m-reg-date')) { document.getElementById('m-reg-date').value = m.kayit_tarihi || ''; }
        window.openModal('modal-member');
    };

    window.handleMemberSubmit = async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('edit-member-id').value;
        const id = existingId || Date.now();
        const oldData = existingId ? state.members.find(m => m.id == existingId) : null;
        const heightVal = document.getElementById('m-height') ? parseFloat(document.getElementById('m-height').value) : null;
        const m = {
            id,
            ad_soyad: document.getElementById('m-name').value.trim(),
            brans: document.getElementById('m-branch').value,
            boy: heightVal || null,
            cinsiyet: document.getElementById('m-gender').value,
            kayit_tarihi: document.getElementById('m-reg-date').value
        };
        const { error } = await supabase.from('uyeler').upsert(m);
        if (error) {
            console.error('[Member save] Supabase error:', error);
            alert(`Üye kaydedilemedi: ${error.message}`);
            return;
        }
        window.pushToUndoLog(existingId ? 'UPDATE' : 'INSERT', 'uyeler', oldData, m, `Üye: ${m.ad_soyad}`);
        await sync();
        window.closeModal('modal-member');
    };

    window.editExercise = (id) => {
        const ex = state.exercises.find(e => e.id == id);
        if (!ex) return;
        document.getElementById('edit-ex-id').value = ex.id;
        document.getElementById('new-ex-name').value = ex.ad;
        document.getElementById('ex-modal-title').innerText = 'Egzersizi Düzenle';
        const g = window.safeJSONParse(ex.gruplar, {});
        document.getElementById('group-body-part').value = g.bodyPart || '';
        window.toggleBodyPartOptions(g.bodyPart || '', g.muscles || []);
        document.getElementById('new-ex-branch').value = g.branch || ex.brans || 'Fitness';
        window.openModal('modal-new-exercise');
    };

    window.toggleBodyPartOptions = (val, selectedMuscles = []) => {
        const container = document.getElementById('group-muscles-container');
        const grid = document.getElementById('muscles-checkboxes');
        grid.innerHTML = '';
        if (!val) { container.style.display = 'none'; return; }
        const options = { 'Üst Ekstremite': ['Göğüs', 'Omuz', 'Sırt', 'Biceps', 'Triceps', 'Ön Kol'], 'Alt Ekstremite': ['Glute', 'Hamstring', 'Quad', 'Calf'] };
        const muscles = options[val] || [];
        grid.innerHTML = muscles.map(m => `
            <label class="check-item">
                <input type="checkbox" name="muscle" value="${m}" ${selectedMuscles.includes(m) ? 'checked' : ''}>
                <span>${m}</span>
            </label>
        `).join('');
        container.style.display = 'block';
    };

    window.saveNewExercise = async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('edit-ex-id').value;
        const id = existingId || Date.now();
        const muscles = Array.from(document.querySelectorAll('input[name="muscle"]:checked')).map(cb => cb.value);
        const gruplar = { bodyPart: document.getElementById('group-body-part').value, branch: document.getElementById('new-ex-branch').value, muscles };
        const newData = { id, ad: document.getElementById('new-ex-name').value, brans: gruplar.branch, gruplar: JSON.stringify(gruplar) };
        await supabase.from('master_egzersizler').upsert(newData);
        const oldData = existingId ? state.exercises.find(ex => ex.id == existingId) : null;
        window.pushToUndoLog(existingId ? 'UPDATE' : 'INSERT', 'master_egzersizler', oldData, newData, `Egzersiz: ${newData.ad}`);
        await sync();
        window.closeModal('modal-new-exercise');
    };

        window.loadPreviousMeasurement = () => {
        const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myM.length > 0) {
            const last = myM[0];
            const pMap = {
                'm-weight': last.weight, 'm-fat': last.fat, 'm-neck': last.neck, 'm-chest': last.chest,
                'm-waist': last.waist, 'm-basen': last.basen, 'm-l-onkol': last.sol_onkol, 'm-r-onkol': last.sag_onkol,
                'm-l-arm': last.l_arm, 'm-r-arm': last.r_arm, 'm-l-bacak': last.l_bacak, 'm-r-bacak': last.r_bacak,
                'm-l-kalf': last.l_kalf, 'm-r-kalf': last.r_kalf,
                'm-age': last.yas, 'm-rhr': last.rhr, 'm-cooper': last.cooper,
                'm-bmr': last.bmr, 'm-mhr': last.mhr, 'm-hrr': last.hrr, 'm-vo2max': last.vo2max
            };
            for(let id in pMap) {
                const el = document.getElementById(id);
                if(el && pMap[id] !== null && pMap[id] !== undefined) {
                    el.value = pMap[id];
                }
            }
        } else {
            alert("Önceki bir ölçüm bulunamadı.");
        }
    };


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
        const datedMeasurement = state.measurements.find(x => x.member_id == state.activeMemberId && x.tarih == dateVal);
        let m = datedMeasurement;

        if (m) {
             m = { ...m, weight: parseFloat(document.getElementById('c-weight').value) || null };
             // VERY IMPORTANT: Strip out virtual frontend properties before sending to Supabase!
             delete m.yas; delete m.rhr; delete m.cooper;
             delete m.bmr; delete m.mhr; delete m.hrr; delete m.vo2max;
        } else {
             m = { id, member_id: state.activeMemberId, tarih: dateVal, weight: parseFloat(document.getElementById('c-weight').value) || null };
        }

        // Supabase schema strictness workaround:
        // We map the raw inputs into unused/legacy columns to avoid 400 Bad Request
        m.l_leg = parseFloat(document.getElementById('c-age').value) || null; // l_leg stores Age
        m.r_leg = parseFloat(document.getElementById('c-rhr').value) || null; // r_leg stores RHR
        m.hips = parseFloat(document.getElementById('c-cooper').value) || null; // hips stores Step Test HR

        await supabase.from('olcumler').upsert(m);
        const oldData = existingId || datedMeasurement ? state.measurements.find(x => x.id == (existingId || datedMeasurement.id)) : null;
        window.pushToUndoLog(oldData ? 'UPDATE' : 'INSERT', 'olcumler', oldData, m, `Kardiyo Testi: ${m.tarih}`);
        await sync();
        e.target.reset();
        window.closeModal('modal-cardio');
        alert("Test kaydedildi!");
    };

    window.openMeasurementModal = () => {
        document.getElementById('m-id').value = '';
        document.getElementById('m-modal-title').innerText = 'Yeni Ölçüm Al';

        // Formu temizle ve bugünün tarihini at
        const form = document.querySelector('#modal-measurement form');
        if (form) form.reset();

        // En son ölçümü bul ve placeholderlara at
        const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        if (myM.length > 0) {
            const last = myM[0];
            const pMap = {
                'm-weight': last.weight, 'm-fat': last.fat, 'm-neck': last.neck, 'm-chest': last.chest,
                'm-waist': last.waist, 'm-basen': last.basen, 'm-l-onkol': last.sol_onkol, 'm-r-onkol': last.sag_onkol,
                'm-l-arm': last.l_arm, 'm-r-arm': last.r_arm, 'm-l-bacak': last.l_bacak, 'm-r-bacak': last.r_bacak,
                'm-l-kalf': last.l_kalf, 'm-r-kalf': last.r_kalf,
                'm-age': last.yas, 'm-rhr': last.rhr, 'm-cooper': last.cooper,
                'm-bmr': last.bmr, 'm-mhr': last.mhr, 'm-hrr': last.hrr, 'm-vo2max': last.vo2max
            };
            for(let id in pMap) {
                const el = document.getElementById(id);
                if(el) {
                    el.placeholder = pMap[id] ? `Son: ${pMap[id]}` : '';
                }
            }
        } else {
            const pMap = ['m-weight','m-fat','m-neck','m-chest','m-waist','m-basen','m-l-onkol','m-r-onkol','m-l-arm','m-r-arm','m-l-bacak','m-r-bacak','m-l-kalf','m-r-kalf'];
            pMap.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.placeholder = '';
            });
        }

        // Tarih alanı için timezone offset düzeltmesiyle bugünü bul
        const today = new Date();
        const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('m-date').value = dateString;

        const member = state.members.find(m => m.id == state.activeMemberId);
        if (member && member.boy) {
            document.getElementById('m-height-measurement').value = member.boy;
        }

        window.openModal('modal-measurement');
    };



    window.calculateAdvancedMetrics = () => {
        const member = state.members.find(m => m.id == state.activeMemberId);
        const gender = member ? member.cinsiyet || 'Erkek' : 'Erkek';

        const weight = parseFloat(document.getElementById('c-weight').value);
        const height = parseFloat(document.getElementById('c-height').value);
        const age = parseFloat(document.getElementById('c-age').value);
        const rhr = parseFloat(document.getElementById('c-rhr').value);
        const cooperDistance = parseFloat(document.getElementById('c-cooper').value);

        // BMR Calculation (Mifflin-St Jeor Equation)
        if (weight && height && age) {
            let bmr = 0;
            if (gender === 'Kadın') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            }
            document.getElementById('c-bmr').value = Math.round(bmr);
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
    };

    window.calculateFatPercentage = () => {
        const member = state.members.find(m => m.id == state.activeMemberId);
        const gender = member ? member.cinsiyet || 'Erkek' : 'Erkek';

        const weight = parseFloat(document.getElementById('m-weight').value);
        const height = parseFloat(document.getElementById('m-height-measurement').value);
        const waist = parseFloat(document.getElementById('m-waist').value);
        const neck = parseFloat(document.getElementById('m-neck').value);
        const hip = parseFloat(document.getElementById('m-basen').value); // only needed for females

        if (!height || !waist || !neck) return; // not enough data

        let fat = 0;
        // US Navy Body Fat Formula
        if (gender === 'Kadın') {
            if (!hip) return; // Females require hip measurement
            fat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
        } else {
            fat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        }

        if (fat > 0 && fat < 100) {
            document.getElementById('m-fat').value = fat.toFixed(1);
        }
    };

window.editMeasurement = (id) => {
        const m = state.measurements.find(x => x.id == id);
        if (!m) return;
        const setField = (fieldId, value) => {
            const field = document.getElementById(fieldId);
            if (field) field.value = value ?? '';
        };
        document.getElementById('m-modal-title').innerText = 'Ölçümü Düzenle';
        setField('m-id', m.id);
        setField('m-date', m.tarih);
        setField('m-weight', m.weight);
        const member = state.members.find(memb => memb.id == state.activeMemberId);
        setField('m-height-measurement', member?.boy);
        setField('m-fat', m.fat);
        setField('m-waist', m.waist);
        setField('m-chest', m.chest);
        setField('m-neck', m.neck);
        setField('m-l-arm', m.l_arm);
        setField('m-r-arm', m.r_arm);
        setField('m-l-onkol', m.sol_onkol);
        setField('m-r-onkol', m.sag_onkol);
        setField('m-l-bacak', m.l_bacak);
        setField('m-r-bacak', m.r_bacak);
        setField('m-l-kalf', m.l_kalf);
        setField('m-r-kalf', m.r_kalf);
        setField('m-basen', m.basen);
        window.openModal('modal-measurement');
    };

    window.saveMeasurement = async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('m-id').value;
        const id = existingId || Date.now();
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

        await supabase.from('olcumler').upsert(m);
        const oldData = existingId ? state.measurements.find(x => x.id == existingId) : null;
        window.pushToUndoLog(existingId ? 'UPDATE' : 'INSERT', 'olcumler', oldData, m, `Ölçüm: ${m.tarih}`);
        state.measurementRequired = false;
        await sync();
        e.target.reset();
        window.closeModal('modal-measurement');
        alert("Ölçüm kaydedildi!");
    };

    window.openWorkoutModal = () => {
        document.getElementById('w-name').value = '';
        document.getElementById('set-rows-container').innerHTML = '';

        // Tarih alanı için bugünü bul
        const today = new Date();
        const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('w-date').value = dateString;

        const loader = document.getElementById('form-template-loader');
        if(loader) loader.value = '';

        window.openModal('modal-workout');
    };
    window.addSingleSet = (container, vals = {}) => {
        const setDiv = document.createElement('div');
        setDiv.className = 'single-set-row';
        setDiv.style.position = 'relative';
        setDiv.style.marginBottom = '0.4rem';
        setDiv.style.paddingBottom = '0.4rem';
        setDiv.style.borderBottom = '1px dashed rgba(255,255,255,0.1)';

        setDiv.innerHTML = `
            <div class="grid" style="grid-template-columns: 2fr 2fr 1.5fr 2fr 1.5fr; gap:0.5rem; align-items:end;">
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Ağırlık (kg)</label>
                    <input type="number" step="0.5" class="s-weight" required style="width:100%; text-align:center; padding:0.4rem; border-radius:4px;" value="${vals.weight || ''}">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Tekrar</label>
                    <input type="number" class="s-reps" required style="width:100%; text-align:center; padding:0.4rem; border-radius:4px;" value="${vals.reps || ''}">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Süre(sn)</label>
                    <input type="number" class="s-sure" style="width:100%; text-align:center; padding:0.4rem; border-radius:4px;" value="${vals.sure || ''}">
                </div>
                <div class="form-group" style="margin:0;">
                    <label style="display:block; margin-bottom:0.1rem; color:var(--text-dim); font-size:0.7rem;">Tip</label>
                    <select class="s-tip w-full" style="padding:0.4rem; font-size:0.75rem; border-radius:4px;">
                        <option value="Normal">Normal</option>
                        <option value="İzometrik">İzometrik</option>
                        <option value="Egzantrik">Egzantrik</option>
                        <option value="Dropset">Dropset</option>
                        <option value="Superset">Superset</option>
                        <option value="1RM">1RM</option>
                    </select>
                </div>
                <div class="form-group" style="margin:0; text-align:right; display:flex; justify-content:flex-end; gap:0.4rem;">
                    <button type="button" onclick="window.duplicateSet(this)" style="background:transparent; border:none; color:var(--primary-color, #4CAF50); font-size:1.2rem; cursor:pointer; padding:0; line-height:1;" title="Bu seti kopyala">⧉</button>
                    <button type="button" onclick="this.parentElement.parentElement.parentElement.remove()" style="background:transparent; border:none; color:#ff4444; font-size:1.2rem; cursor:pointer; padding:0; line-height:1;" title="Sil">×</button>
                </div>
            </div>
        `;
        container.appendChild(setDiv);

        // Eğer kopyalama işleminden (vals) tip değeri geldiyse onu seçili yap
        if (vals.tip) {
            setDiv.querySelector('.s-tip').value = vals.tip;
        }
    };

    // Kopyalama Butonunu Tetikleyen Fonksiyon
    window.duplicateSet = (btn) => {
        const row = btn.closest('.single-set-row');
        const container = row.parentElement;

        // Bulunduğu satırdaki mevcut değerleri al
        const vals = {
            weight: row.querySelector('.s-weight').value,
            reps: row.querySelector('.s-reps').value,
            sure: row.querySelector('.s-sure').value,
            tip: row.querySelector('.s-tip').value
        };

        // Aynı değerlerle yeni bir satır oluştur
        window.addSingleSet(container, vals);
    };
    window.addSetRowToWorkout = (exName = '') => {
        const container = document.getElementById('set-rows-container');
        const uniqueId = Date.now() + Math.random();

        const wrapper = document.createElement('div');
        wrapper.className = 'set-row-wrapper';
        wrapper.style.marginBottom = '1rem';
        wrapper.style.padding = '1rem';
        wrapper.style.background = 'rgba(255,255,255,0.02)';
        wrapper.style.borderRadius = '8px';
        wrapper.style.position = 'relative';

        wrapper.innerHTML = `
            <button type="button" class="btn-delete" onclick="this.parentElement.remove()" style="position:absolute; top:5px; right:5px; width:24px; height:24px; padding:0; display:flex; align-items:center; justify-content:center;">×</button>

            <div class="form-group" style="margin-bottom:0.8rem; padding-right: 30px;">
                <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Egzersiz</label>
                <select class="ex-select s-name w-full" required style="font-weight:bold;">
                    <option value="">Seç...</option>
                    ${state.exercises.map(ex => `<option value="${ex.ad}">${ex.ad}</option>`).join('')}
                </select>
            </div>

            <!-- İçine Setlerin Ekleneceği Alan -->
            <div class="sets-container" id="sets-${uniqueId}"></div>

            <button type="button" class="btn-secondary mt-1" style="font-size:0.75rem; padding:0.4rem; background:transparent; border:1px dashed var(--border); width:100%; color:var(--text-dim);" onclick="window.addSingleSet(this.previousElementSibling)">
                + Bu Harekete Set Ekle
            </button>
        `;

        container.appendChild(wrapper);

        if(exName) {
            const s = wrapper.querySelector('.s-name');
            s.value = exName;
        }

        // Blok oluşturulur oluşturulmaz varsayılan olarak 1. Seti içine ekle
        window.addSingleSet(wrapper.querySelector('.sets-container'));
    };

    window.saveWorkout = async (e) => {
        e.preventDefault();
        const setler = [];

        // 1. Ana egzersiz bloklarını dön
        document.querySelectorAll('.set-row-wrapper').forEach(wrapper => {
            const exName = wrapper.querySelector('.s-name').value;

            // 2. O egzersiz bloğunun içindeki TÜM set satırlarını bul ve sırayla ekle
            wrapper.querySelectorAll('.single-set-row').forEach((setRow, index) => {
                setler.push({
                    ad: exName,
                    set_no: index + 1, // Set numarasını 1, 2, 3 diye otomatik belirler
                    weight: setRow.querySelector('.s-weight').value,
                    reps: setRow.querySelector('.s-reps').value,
                    sure: setRow.querySelector('.s-sure').value,
                    tip: setRow.querySelector('.s-tip').value
                });
            });
        });

        const w = {
            id: Date.now(),
            member_id: state.activeMemberId,
            tarih: document.getElementById('w-date').value,
            sablon: document.getElementById('w-name').value,
            setler: JSON.stringify(setler)
        };

        await supabase.from('antrenmanlar').upsert(w);
        window.pushToUndoLog('INSERT', 'antrenmanlar', null, w, `Antrenman Kaydedildi: ${w.sablon}`);
        await sync();
        window.closeModal('modal-workout');
        alert("Antrenman kaydedildi!");
    };

    window.addExerciseRowToTemplate = (name = '') => {
        const container = document.getElementById('p-exercise-rows');
        const div = document.createElement('div');
        div.className = 'set-row-wrapper';
        div.innerHTML = `
            <div class="set-row">
                <select class="p-ex-name" required>
                    <option value="">Egzersiz Seç...</option>
                    ${state.exercises.map(ex => `<option value="${ex.ad}" ${ex.ad === name ? 'selected' : ''}>${ex.ad}</option>`).join('')}
                </select>
                <button type="button" class="btn-delete" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        container.appendChild(div);
    };

    window.handleProgramSubmit = async (e) => {
        e.preventDefault();
        const existingId = document.getElementById('edit-program-id').value;
        const id = existingId || Date.now();
        const name = document.getElementById('p-name').value;
        const details = [];
        document.querySelectorAll('.p-ex-name').forEach(sel => {
            if (sel.value) details.push({ ad: sel.value });
        });

        const p = { id, program_adi: name, detaylar: JSON.stringify(details) };
        const oldData = existingId ? state.programs.find(prog => prog.id == existingId) : null;

        await supabase.from('programlar').upsert(p);
        window.pushToUndoLog(existingId ? 'UPDATE' : 'INSERT', 'programlar', oldData, p, `Şablon: ${name}`);

        await sync();
        window.closeModal('modal-program');
        alert("Şablon kaydedildi!");
    };

    window.showProgramDetail = (id) => {
        try {
            const p = state.programs.find(x => x.id == id);
            if (!p) return;
            const details = window.safeJSONParse(p.detaylar, []);
            document.getElementById('detail-title').innerText = p.program_adi;
            document.getElementById('detail-body').innerHTML = `
                <ul class="m-list">
                    ${details.map(d => `<li>💪 ${d.ad}</li>`).join('')}
                </ul>
                <button class="btn-primary mt-1 w-full" onclick="window.loadProgramToWorkout(${p.id})">Bu Programı Başlat</button>
            `;
            window.openModal('modal-detail');
        } catch (err) { console.error(err); }
    };

    window.loadProgramToWorkout = (id) => {
        const p = state.programs.find(x => x.id == id);
        if (!p) return;
        window.closeModal('modal-detail');
        if (!state.activeMemberId) {
            alert("Lütfen önce bir üye seçin.");
            window.nav('members-view');
            return;
        }
        window.tab('workouts');
        document.getElementById('w-name').value = p.program_adi;
        document.getElementById('set-rows-container').innerHTML = '';
        const details = window.safeJSONParse(p.detaylar, []);
        details.forEach(d => window.addSetRowToWorkout(d.ad));
    };
    window.loadTemplateToForm = (programAdiVeyaId) => {
        // Boş seçim yapıldıysa durdur
        if (!programAdiVeyaId) return;

        // Şablonu state.programs içinden bul (Dropdown'dan id veya isim gelme ihtimaline karşı ikisini de kontrol ediyoruz)
        const p = state.programs.find(x => x.id == programAdiVeyaId || x.program_adi == programAdiVeyaId);
        if (!p) {
            console.error("Şablon bulunamadı:", programAdiVeyaId);
            return;
        }

        // 1. Antrenman adını forma yaz
        document.getElementById('w-name').value = p.program_adi;

        // 2. Önceki hareketleri temizle
        document.getElementById('set-rows-container').innerHTML = '';

        // 3. Şablon detaylarını (JSON) parse et ve her bir hareket için yeni satır oluştur
        const details = window.safeJSONParse(p.detaylar, []);
        details.forEach(d => {
            window.addSetRowToWorkout(d.ad);
        });
    };

    window.editProgram = (id) => {
        const p = state.programs.find(x => x.id == id);
        if (!p) return;
        document.getElementById('edit-program-id').value = p.id;
        document.getElementById('p-name').value = p.program_adi;
        document.getElementById('p-exercise-rows').innerHTML = '';
        const details = window.safeJSONParse(p.detaylar, []);
        details.forEach(d => window.addExerciseRowToTemplate(d.ad));
        window.openModal('modal-program');
    };

        window.showMeasurementDetail = (id) => {
        try {
            const myM = state.measurements.filter(m => m.member_id == state.activeMemberId).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
            const idx = myM.findIndex(x => x.id == id);
            if (idx === -1) return;
            const m = myM[idx];
            const prev = (idx < myM.length - 1) ? myM[idx + 1] : null;

            document.getElementById('detail-title').innerText = `${new Date(m.tarih).toLocaleDateString('tr-TR')} Ölçüm Detayları`;

            // Calculate advanced metrics
            const member = state.members.find(x => x.id == state.activeMemberId);
            let advancedHtml = '';

            // Kardiyo ve Metabolizma Analizi
            let cardioHtml = '';
            if (m.bmr || m.vo2max || m.rhr) {
                cardioHtml = `
                    <div style="margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--accent);">🫀 Kardiyo & Metabolizma</h4>
                        <div class="grid" style="grid-template-columns: 1fr 1fr; gap:0.5rem;">
                            ${m.bmr ? `<div class="stat-card"><span>BMR (Bazal Met.)</span><h3>${m.bmr} kcal</h3></div>` : ''}
                            ${m.vo2max ? `<div class="stat-card"><span>VO2 Max</span><h3>${m.vo2max}</h3></div>` : ''}
                            ${m.rhr ? `<div class="stat-card"><span>RHR (Dinlenik)</span><h3>${m.rhr} bpm</h3></div>` : ''}
                            ${m.hrr ? `<div class="stat-card"><span>HRR (Rezerv)</span><h3>${m.hrr} bpm</h3></div>` : ''}
                        </div>
                    </div>`;
            }

            if (m.weight && m.fat) {
                const fatMass = (m.weight * (m.fat / 100)).toFixed(1);
                const lbm = (m.weight - fatMass).toFixed(1);
                let bmiHtml = '';
                if (member && member.boy) {
                    const heightM = member.boy / 100;
                    const bmi = (m.weight / (heightM * heightM)).toFixed(1);
                    let bmiStatus = bmi < 18.5 ? "Zayıf" : (bmi < 25 ? "Normal" : (bmi < 30 ? "Fazla Kilolu" : "Obez"));
                    bmiHtml = `<div class="stat-card" style="grid-column: span 2; background: rgba(var(--accent-rgb), 0.1); border: 1px solid var(--accent);"><span>BMI (Vücut Kitle İndeksi)</span><h3 style="color:var(--accent);">${bmi} <small>(${bmiStatus})</small></h3></div>`;
                }

                advancedHtml = `
                    <div style="margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--accent);">📊 Analiz</h4>
                        <div class="grid" style="grid-template-columns: 1fr 1fr; gap:0.5rem;">
                            ${bmiHtml}
                            <div class="stat-card"><span>Yağ Kütlesi</span><h3>${fatMass} kg</h3></div>
                            <div class="stat-card"><span>Yağsız Kütle (LBM)</span><h3>${lbm} kg</h3></div>
                        </div>
                    </div>`;
            }

            // Render symmetry analysis for limbs
            let symmetryHtml = '';
            const symPairs = [
                { name: 'Kol', l: m.l_arm, r: m.r_arm },
                { name: 'Önkol', l: m.sol_onkol, r: m.sag_onkol },
                { name: 'Bacak', l: m.l_bacak, r: m.r_bacak },
                { name: 'Kalf', l: m.l_kalf, r: m.r_kalf }
            ];
            const asymmetries = symPairs.filter(p => p.l && p.r && Math.abs(p.l - p.r) > 0.5).map(p => {
                const diff = Math.abs(p.l - p.r).toFixed(1);
                const larger = p.l > p.r ? 'Sol' : 'Sağ';
                return `<li>${larger} ${p.name} <b>${diff}cm</b> daha büyük</li>`;
            });

            if (asymmetries.length > 0) {
                symmetryHtml = `
                    <div style="margin-top:1rem; padding: 1rem; background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 8px;">
                        <h4 style="color: orange; margin-bottom: 0.5rem;">⚠️ Simetri Analizi (>0.5cm)</h4>
                        <ul style="margin:0; padding-left: 1rem; font-size:0.9rem; color: var(--text);">${asymmetries.join('')}</ul>
                    </div>`;
            }

            const fields = MEASUREMENT_FIELDS;
            let gridHtml = `<div class="grid" style="grid-template-columns: 1fr 1fr;">`;
            fields.forEach(field => {
                const value = m[field.key];
                const delta = getMeasurementDelta(m, prev, field.key);
                gridHtml += `<div class="stat-card">
                    <span style="display:flex; justify-content:space-between; align-items:center;">
                        ${field.label}
                        <span class="measurement-delta ${getDeltaClass(delta, field.direction)}">${formatDelta(delta, field.unit)}</span>
                    </span>
                    <h3>${value ?? '--'} ${field.unit}</h3>
                </div>`;
            });
            gridHtml += `</div>`;

            document.getElementById('detail-body').innerHTML = advancedHtml + cardioHtml + gridHtml + symmetryHtml;
            window.openModal('modal-detail');
        } catch (err) { console.error(err); }
    };

  window.showWorkoutDetail = (id) => {
    try {
        // state.workouts veya state.antrenmanlar içinden tıklanan antrenmanı bul
        const w = state.workouts.find(x => x.id == id) || (state.antrenmanlar && state.antrenmanlar.find(x => x.id == id));
        if (!w) return;

        const setler = window.safeJSONParse(w.setler, []);

        // 1. Gelen tüm setleri egzersiz adına (ad) göre grupla
        const groupedSets = {};
        setler.forEach(s => {
            const egzersizAdi = s.ad || "İsimsiz Egzersiz";
            if (!groupedSets[egzersizAdi]) {
                groupedSets[egzersizAdi] = [];
            }
            groupedSets[egzersizAdi].push(s);
        });

        // 2. Başlığı modal içine yazdır
        document.getElementById('detail-title').innerText = `${w.sablon || 'Serbest Antrenman'} - ${new Date(w.tarih).toLocaleDateString('tr-TR')}`;

        // 3. Gruplanmış verileri profesyonel bir kart/tablo yapısına dönüştür
        let html = '<div class="workout-summary-container">';

        for (const [egzersizAdi, sets] of Object.entries(groupedSets)) {
            html += `
            <div class="exercise-group" style="margin-bottom: 1.2rem; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden;">
                <div style="background: rgba(255,255,255,0.03); padding: 0.7rem 1rem; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text);">
                    💪 ${egzersizAdi}
                </div>
                <div style="padding: 0.5rem 1rem;">
                    <table style="width: 100%; font-size: 0.85rem; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr style="color: var(--text-dim); border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <th style="padding: 0.4rem 0; width: 15%;">Set</th>
                                <th style="padding: 0.4rem 0; width: 30%;">Ağırlık</th>
                                <th style="padding: 0.4rem 0; width: 25%;">Tekrar</th>
                                <th style="padding: 0.4rem 0; width: 30%;">Ekstra</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            sets.forEach((s, index) => {
                const setNo = s.set_no || (index + 1);
                const tipBadge = (s.tip && s.tip !== 'Normal') ? `<span style="background:var(--primary-color, #4CAF50); color:#000; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:bold;">${s.tip}</span>` : '';
                const sureText = s.sure ? `<span style="color:var(--text-dim); font-size:0.75rem; margin-left: 4px;">⏱️ ${s.sure}s</span>` : '';

                html += `
                            <tr style="border-bottom: 1px dashed rgba(255,255,255,0.05);">
                                <td style="padding: 0.5rem 0; color: var(--text-dim);">${setNo}</td>
                                <td style="padding: 0.5rem 0; font-weight: bold; color: #fff;">${s.weight || '-'} kg</td>
                                <td style="padding: 0.5rem 0; font-weight: bold; color: #fff;">${s.reps || '-'}</td>
                                <td style="padding: 0.5rem 0;">${tipBadge}${sureText}</td>
                            </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        html += '</div>';

        // Modalın içine bas ve modalı aç
        document.getElementById('detail-body').innerHTML = html;
        window.openModal('modal-detail');

    } catch (err) {
        console.error("Antrenman detayı açılırken hata:", err);
    }
};

    // --- DELETES ---
    window.deleteWorkout = async (id) => { if (confirm("Silinsin mi?")) { const oldData = state.workouts.find(w => w.id == id); await supabase.from('antrenmanlar').delete().eq('id', id); window.pushToUndoLog('DELETE', 'antrenmanlar', oldData, null, `Antrenman Silindi: ${oldData.sablon}`); await sync(); } };
    window.deleteMeasurement = async (id) => { if (confirm("Silinsin mi?")) { const oldData = state.measurements.find(m => m.id == id); await supabase.from('olcumler').delete().eq('id', id); window.pushToUndoLog('DELETE', 'olcumler', oldData, null, `Ölçüm Silindi`); await sync(); } };
    window.deleteExercise = async (id) => { if (confirm("Silinsin mi?")) { const oldData = state.exercises.find(e => e.id == id); await supabase.from('master_egzersizler').delete().eq('id', id); window.pushToUndoLog('DELETE', 'master_egzersizler', oldData, null, `Egzersiz Silindi: ${oldData.ad}`); await sync(); } };
    window.deleteProgram = async (id) => { if (confirm("Silinsin mi?")) { const oldData = state.programs.find(p => p.id == id); await supabase.from('programlar').delete().eq('id', id); window.pushToUndoLog('DELETE', 'programlar', oldData, null, `Şablon Silindi: ${oldData.program_adi}`); await sync(); } };
    window.deleteMember = async (id) => { if (confirm("Bu üyeyi silmek istediğinize emin misiniz?")) { const oldData = state.members.find(m => m.id == id); await supabase.from('uyeler').delete().eq('id', id); window.pushToUndoLog('DELETE', 'uyeler', oldData, null, `Üye Silindi: ${oldData.ad_soyad}`); await sync(); } };

    // --- DOCUMENTS ---

    window.scanStorageForDocs = async () => {
        if (!state.activeMemberId) return;
        try {
            const { data, error } = await supabase.storage.from('dokumanlar').list(state.activeMemberId.toString());
            if (error) return { data: null, error: error };
            state.cloudFiles = data || [];
            renderDocuments();
        } catch (err) { handleError(err, 'ScanStorage'); }
    };

    window.deleteOnlyCloudDoc = async (path) => {
        if (!confirm("Buluttan silinsin mi?")) return;
        try {
            const encodedPath = path.split('/').map(seg => encodeURIComponent(seg)).join('/');
            await supabase.storage.from('dokumanlar').remove([encodedPath]);
            await window.scanStorageForDocs();
        } catch (e) { console.error(e); }
    };

    window.viewDocument = async (path) => {
        const win = window.open('', '_blank');
        try {
            const encodedPath = path.split('/').map(seg => encodeURIComponent(seg)).join('/');
            const { data, error } = await supabase.storage.from('dokumanlar').createSignedUrl(encodedPath, 60);
            if (data?.signedUrl) win.location.href = data.signedUrl;
            else { if(win) win.close(); alert("Hata: Dosya bulunamadı"); }
        } catch (e) { if(win) win.close(); }
    };

    window.uploadDocument = async (e) => {
        e.preventDefault();
        const file = document.getElementById('doc-file').files[0];
        const name = document.getElementById('doc-name').value;
        const type = document.getElementById('doc-type').value;
        const trMap = {'ç':'c','Ç':'C','ğ':'g','Ğ':'G','ı':'i','İ':'I','ö':'o','Ö':'O','ş':'s','Ş':'S','ü':'u','Ü':'U'};
        const cleanFileName = file.name.replace(/[çÇğĞıİöÖşŞüÜ]/g, m => trMap[m]).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filePath = `${state.activeMemberId}/${Date.now()}_${cleanFileName}`;
        try {
            const { error: uploadError } = await supabase.storage.from('dokumanlar').upload(filePath, file);
            if (uploadError) throw uploadError;
            const newData = { member_id: state.activeMemberId, adi: name, yol: filePath, tip: type };
            const { data, error: dbError } = await supabase.from('dokumanlar').insert(newData).select();
            if (dbError) throw dbError;
            window.pushToUndoLog('INSERT', 'dokumanlar', null, data[0], `Döküman Yüklendi: ${name}`);
            await sync();
            alert("Döküman yüklendi!");
            e.target.reset();
        } catch (err) { alert("Hata: " + err.message); }
    };

    window.deleteDocument = async (id, path) => {
        if (!confirm("Döküman silinsin mi?")) return;
        try {
            const oldData = state.documents.find(d => d.id == id);
            const encodedPath = path.split('/').map(seg => encodeURIComponent(seg)).join('/');
            await supabase.from('dokumanlar').delete().eq('id', id);
            await supabase.storage.from('dokumanlar').remove([encodedPath]);
            window.pushToUndoLog('DELETE', 'dokumanlar', oldData, null, `Döküman Silindi: ${oldData.adi}`);
            await sync();
        } catch (e) { handleError(e, "DeleteDoc"); }
    };

    // --- MEMBER PROFILE SYNC ---

    window.openProfile = (id) => {
        state.activeMemberId = id;
        const m = state.members.find(x => x.id == id);
        if (m) {
            document.getElementById('prof-name').innerText = m.ad_soyad;
            const meta = document.getElementById('prof-meta');
            if (meta) {
                const details = [m.brans, m.cinsiyet].filter(Boolean);
                meta.innerText = details.length ? details.join(' · ') : 'Profil detaylarını ve gelişimi yönetin.';
            }
        }

        const myM = state.measurements.filter(m => m.member_id == id).sort((a,b) => new Date(b.tarih) - new Date(a.tarih));
        const now = new Date();
        let needsMeasurement = false;

        if (myM.length === 0) {
            needsMeasurement = true;
        } else {
            const lastDate = new Date(myM[0].tarih);
            const diffTime = now.getTime() - lastDate.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);

            // Rolling Guard: Tam olarak 30 gün geçtiyse zorunlu kıl.
            if (diffDays >= 30) {
                needsMeasurement = true;
            }
        }

        if (needsMeasurement) {
            state.measurementRequired = true;
            alert("📅 Bu ay için ölçümünüz eksik! Lütfen devam etmeden önce güncel ölçümlerinizi girin.");
            window.nav('profile-view'); window.tab('measurements');
        } else {
            state.measurementRequired = false;
            window.nav('profile-view'); window.tab('analytics');
        }
        window.scanStorageForDocs();
    };

    window.editActiveMember = () => {
        if (state.activeMemberId) window.editMember(state.activeMemberId);
    };

    window.performGlobalSearch = () => {
        const keyword = document.getElementById('global-search-keyword').value.toLowerCase();
        if (!keyword) { window.nav(state.navHistory[state.navHistory.length - 2] || 'members-view'); return; }
        window.nav('search-results-view', false);
        const container = document.getElementById('search-results-content');
        container.innerHTML = '';
        const includeMembers = document.getElementById('f-cat-members').checked;
        const includeProgs = document.getElementById('f-cat-progs').checked;
        const includeWorkouts = document.getElementById('f-cat-workouts').checked;
        const exCheckbox = document.getElementById('f-cat-exercises');
        const includeExercises = exCheckbox ? exCheckbox.checked : true;
        const foodsCheckbox = document.getElementById('f-cat-foods');
        const includeFoods = foodsCheckbox ? foodsCheckbox.checked : true;

        let results = [];
        if (includeMembers) state.members.filter(m => m.ad_soyad.toLowerCase().includes(keyword) || m.brans.toLowerCase().includes(keyword)).forEach(m => results.push({ type: 'Member', data: m }));
        if (includeProgs) state.programs.filter(p => p.program_adi.toLowerCase().includes(keyword)).forEach(p => results.push({ type: 'Program', data: p }));
        if (includeWorkouts) state.workouts.filter(w => w.sablon.toLowerCase().includes(keyword)).forEach(w => results.push({ type: 'Workout', data: w }));

        if (includeExercises) {
            state.exercises.filter(ex => {
                const g = window.safeJSONParse(ex.gruplar, {});
                const searchString = `${ex.ad} ${g.bodyPart || ''} ${(g.muscles || []).join(' ')} ${g.branch || ex.brans || ''}`.toLowerCase();
                return searchString.includes(keyword);
            }).forEach(ex => results.push({ type: 'Exercise', data: ex }));
        }

        if (includeFoods) {
            state.foods.filter(f => {
                const searchString = `${f.ad} ${f.tip || ''}`.toLowerCase();
                return searchString.includes(keyword);
            }).forEach(f => results.push({ type: 'Food', data: f }));
        }

        const totalCount = results.length;
        results = results.slice(0, 100);

        if (results.length === 0) { container.innerHTML = '<div class="no-results">Eşleşen sonuç bulunamadı.</div>'; return; }

        let html = `<div class="grid">${results.map(r => {
            if (r.type === 'Member') return `<div class="card" onclick="window.openProfile(${r.data.id})"><h3>👤 ${r.data.ad_soyad}</h3><p>${r.data.brans}</p></div>`;
            if (r.type === 'Program') return `<div class="card" onclick="window.showProgramDetail(${r.data.id})"><h3>📋 ${r.data.program_adi}</h3></div>`;
            if (r.type === 'Workout') return `<div class="card" onclick="window.showWorkoutDetail(${r.data.id})"><h3>🏋️ ${r.data.sablon}</h3><p>${new Date(r.data.tarih).toLocaleDateString('tr-TR')}</p></div>`;
            if (r.type === 'Exercise') {
                const g = window.safeJSONParse(r.data.gruplar, {});
                return `<div class="card" onclick="window.editExercise(${r.data.id})"><h3>💪 ${r.data.ad}</h3><p>${g.bodyPart || ''} ${g.muscles ? '- ' + g.muscles.join(', ') : ''}</p></div>`;
            }
            if (r.type === 'Food') {
                return `<div class="card" onclick="window.editFood(${r.data.id})"><h3>🍏 ${r.data.ad}</h3><p>${r.data.tip || 'Yemek'} - 🔥 ${r.data.kalori} kcal</p></div>`;
            }
        }).join('')}</div>`;

        if (totalCount > 100) {
            html += `<div style="text-align:center; padding:1rem; color:var(--text-dim); font-size:0.8rem; grid-column: 1 / -1;">⚠️ Çok fazla sonuç bulundu (${totalCount}). Sadece ilk 100 sonuç gösteriliyor. Lütfen aramanızı daraltın.</div>`;
        }

        container.innerHTML = html;
    };

    // --- SYNC & INITIALIZATION ---

    async function fetchAll(table) {
        let allData = [];
        let from = 0;
        const step = 1000;
        while (true) {
            const { data, error } = await supabase.from(table).select('*').range(from, from + step - 1);
            if (error) return { data: null, error: error };
            if (data && data.length > 0) {
                allData = allData.concat(data);
                from += step;
                if (data.length < step) break;
            } else {
                break;
            }
        }
        return { data: allData, error: null };
    }

    async function sync() {
        try {

            const results = await Promise.all([
                supabase.from('uyeler').select('*'),
                supabase.from('programlar').select('*'),
                supabase.from('olcumler').select('*'),
                supabase.from('antrenmanlar').select('*'),
                supabase.from('dokumanlar').select('*'),
                fetchAll('master_egzersizler'),
                fetchAll('master_besinler'),
                supabase.from('beslenme_planlari').select('*')
            ]);




            const errIndex = results.findIndex(r => r.error);
            if (errIndex !== -1) {
                console.error("Supabase Error Data:", results[errIndex].error);
                throw new Error("Veritabanı hatası at index " + errIndex + ": " + results[errIndex].error.message);
            }

            state.members = results[0].data || [];
            state.programs = results[1].data || [];
                        state.measurements = (results[2].data || []).map(m => {
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
            });
            state.workouts = results[3].data || [];
            state.documents = results[4].data || [];
            state.exercises = results[5].data || [];
            state.foods = results[6].data || [];
            state.diets = results[7].data || [];


            refreshAll();
        } catch (error) {
            console.error("SYNC CATCH BLOCK:", error);
            alert("Senkronizasyon hatası! Konsolu kontrol edin.");
        }
    }

    function scheduleRealtimeSync(reason = 'database-change') {
        window.clearTimeout(realtimeSyncTimer);
        realtimeSyncTimer = window.setTimeout(() => {
            sync().catch(error => handleError(error, `Realtime sync (${reason})`));
        }, 300);
    }

    function scheduleRealtimeReconnect() {
        if (realtimeReconnectTimer) return;
        realtimeReconnectTimer = window.setTimeout(() => {
            realtimeReconnectTimer = null;
            subscribeToRealtime();
        }, 5000);
    }

    function subscribeToRealtime() {
        if (realtimeChannel) return;

        const channel = supabase.channel('trainer-pro-live-sync');
        REALTIME_TABLES.forEach(table => {
            channel.on(
                'postgres_changes',
                { event: '*', schema: 'public', table },
                payload => {
                    console.info(`[Realtime] ${payload.eventType} ${table}`);
                    scheduleRealtimeSync(`${table}:${payload.eventType}`);
                }
            );
        });

        realtimeChannel = channel;
        channel.subscribe((status, error) => {
            if (status === 'SUBSCRIBED') {
                console.info('[Realtime] Live sync connected');
                return;
            }

            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                console.error('[Realtime] Live sync disconnected', { status, error });
                realtimeChannel = null;
                scheduleRealtimeReconnect();
            }
        });
    }

    window.sync = sync;

    async function init() {
        await sync();
        subscribeToRealtime();

        window.addEventListener('online', () => {
            subscribeToRealtime();
            scheduleRealtimeSync('browser-online');
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                subscribeToRealtime();
                scheduleRealtimeSync('page-visible');
            }
        });

        // Setup fab (floating action button)
        const fab = document.createElement('button');
        fab.className = 'fab';
        fab.innerHTML = '➕';
        fab.onclick = () => state.activeMemberId ? window.tab('measurements') : window.openModal('modal-member');
        document.body.appendChild(fab);
    }

    init();
});
