import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Add Cardio Tab Button
target_btn = """                    <button onclick="tab('measurements')" class="tab-btn" id="btn-tab-measurements">📏 Ölçümler</button>"""
replace_btn = """                    <button onclick="tab('measurements')" class="tab-btn" id="btn-tab-measurements">📏 Ölçümler</button>
                    <button onclick="tab('cardio')" class="tab-btn" id="btn-tab-cardio">🫀 Testler</button>"""
content = content.replace(target_btn, replace_btn)

# 2. Extract Cardio Section from modal and move to standalone modal
target_cardio_section = """                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
                    <h3 style="margin-bottom: 0.5rem; color: var(--accent); font-size: 1rem;">🫀 Kardiyo & Metabolizma Testleri</h3>
                    
                    <div style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-dim);">
                        <p style="margin-bottom: 0.5rem;"><b>RHR (Dinlenik Nabız):</b> Sabah uyanır uyanmaz 1 dakika boyunca nabzı sayın.</p>
                        <p style="margin-bottom: 0.5rem;"><b>VO2 Max (Queen's College Step Testi):</b> Üye 41.3 cm yüksekliğindeki bir basamağa metronom eşliğinde 3 dakika boyunca inip çıkar (Erkekler: 24 adım/dk, Kadınlar: 22 adım/dk). Test bittikten hemen sonra 5 saniye bekleyip 15 saniyelik nabız sayılır ve 4 ile çarpılarak test sonu nabzı (bpm) girilir.</p>
                        <p>MHR, HRR ve BMR sistem tarafından yaş, kilo ve nabız verilerinize göre otomatik hesaplanır.</p>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Yaş</label>
                            <input type="number" id="m-age" class="w-full" placeholder="Örn: 30" oninput="window.calculateAdvancedMetrics()">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">RHR (Dinlenik Nabız - bpm)</label>
                            <input type="number" id="m-rhr" class="w-full" placeholder="Örn: 60" oninput="window.calculateAdvancedMetrics()">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Queen's Step Testi (Test Sonu Nabız - bpm)</label>
                            <input type="number" id="m-cooper" class="w-full" placeholder="Örn: 156" oninput="window.calculateAdvancedMetrics()">
                        </div>
                        
                        <!-- Auto Calc Fields (Readonly ideally, but let's just make them visual) -->
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">BMR (Bazal Metabolizma)</label>
                            <input type="number" id="m-bmr" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">MHR (Maks Nabız)</label>
                            <input type="number" id="m-mhr" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">HRR (Nabız Rezervi)</label>
                            <input type="number" id="m-hrr" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">VO2 Max (ml/kg/min)</label>
                            <input type="number" step="0.1" id="m-vo2max" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                    </div>
                </div>"""
content = content.replace(target_cardio_section, "")

# Add standalone Cardio Tab content
target_measurements_tab = """                    <!-- TAB: Ölçümler -->
                    <div id="tab-measurements" class="tab-content">
                        <div
                            style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                            <h3>📊 Ölçüm Geçmişi</h3>
                            <button class="btn-primary" onclick="window.openMeasurementModal()">+ Yeni Ölçüm
                                Ekle</button>
                        </div>
                        <div id="m-history-tabs" class="history-tabs"></div>
                    </div>"""

cardio_tab = """
                    <!-- TAB: Testler -->
                    <div id="tab-cardio" class="tab-content">
                        <div
                            style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                            <h3>🫀 Test Geçmişi</h3>
                            <button class="btn-primary" onclick="window.openCardioModal()">+ Yeni Test
                                Ekle</button>
                        </div>
                        <div id="c-history-tabs" class="history-tabs"></div>
                    </div>"""
content = content.replace(target_measurements_tab, target_measurements_tab + cardio_tab)

# Add new Modal for Cardio
cardio_modal = """
    <!-- MODAL: Kardiyo Testi -->
    <div id="modal-cardio" class="modal">
        <div class="modal-content wide">
            <span class="close" onclick="closeModal('modal-cardio')">&times;</span>
            <h2 id="c-modal-title">Kardiyo & Metabolizma Testi</h2>
            <form onsubmit="saveCardioTest(event)">
                <input type="hidden" id="c-id">
                <div class="form-group">
                    <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Tarih</label>
                    <input type="date" id="c-date" required class="w-full">
                </div>
                
                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
                    <div style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-dim);">
                        <p style="margin-bottom: 0.5rem;"><b>RHR (Dinlenik Nabız):</b> Sabah uyanır uyanmaz 1 dakika boyunca nabzı sayın.</p>
                        <p style="margin-bottom: 0.5rem;"><b>VO2 Max (Queen's College Step Testi):</b> Üye 41.3 cm yüksekliğindeki bir basamağa metronom eşliğinde 3 dakika boyunca inip çıkar (Erkekler: 24 adım/dk, Kadınlar: 22 adım/dk). Test bittikten hemen sonra 5 saniye bekleyip 15 saniyelik nabız sayılır ve 4 ile çarpılarak test sonu nabzı (bpm) girilir.</p>
                        <p>MHR, HRR ve BMR sistem tarafından hesaplanır.</p>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Kilo (kg) (Gerekli)</label>
                            <input type="number" step="0.1" id="c-weight" class="w-full" required oninput="window.calculateAdvancedMetrics()">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Boy (cm) (Gerekli)</label>
                            <input type="number" step="0.1" id="c-height" class="w-full" required oninput="window.calculateAdvancedMetrics()">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Yaş</label>
                            <input type="number" id="c-age" class="w-full" placeholder="Örn: 30" oninput="window.calculateAdvancedMetrics()">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">RHR (Dinlenik Nabız - bpm)</label>
                            <input type="number" id="c-rhr" class="w-full" placeholder="Örn: 60" oninput="window.calculateAdvancedMetrics()">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Queen's Step Testi (Test Sonu Nabız - bpm)</label>
                            <input type="number" id="c-cooper" class="w-full" placeholder="Örn: 156" oninput="window.calculateAdvancedMetrics()">
                        </div>
                        
                        <!-- Auto Calc Fields -->
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">BMR (Bazal Metabolizma)</label>
                            <input type="number" id="c-bmr" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">MHR (Maks Nabız)</label>
                            <input type="number" id="c-mhr" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">HRR (Nabız Rezervi)</label>
                            <input type="number" id="c-hrr" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--accent); font-size:0.8rem;">VO2 Max (ml/kg/min)</label>
                            <input type="number" step="0.1" id="c-vo2max" class="w-full" readonly style="background: rgba(255,255,255,0.05);">
                        </div>
                    </div>
                </div>
                <div class="modal-btns mt-1">
                    <button type="submit" class="btn-primary w-full">Testi Kaydet</button>
                </div>
            </form>
        </div>
    </div>
"""
content = content.replace('<!-- MODAL: Yeni/Düzenle Ölçüm -->', cardio_modal + '\n    <!-- MODAL: Yeni/Düzenle Ölçüm -->')

with open('index.html', 'w') as f:
    f.write(content)
