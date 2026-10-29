import re

with open('index.html', 'r') as f:
    content = f.read()

target = '''<div class="form-group"><label
                            style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Basen
                            (cm)</label><input type="number" step="0.1" id="m-basen" class="w-full" oninput="window.calculateFatPercentage()"></div>'''

# We will inject the new tests after basen
replacement = target + '''
                </div>

                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;">
                    <h3 style="margin-bottom: 0.5rem; color: var(--accent); font-size: 1rem;">🫀 Kardiyo & Metabolizma Testleri</h3>
                    
                    <div style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-dim);">
                        <p style="margin-bottom: 0.5rem;"><b>RHR (Dinlenik Nabız):</b> Sabah uyanır uyanmaz 1 dakika boyunca nabzı sayın.</p>
                        <p style="margin-bottom: 0.5rem;"><b>VO2 Max (Cooper Testi):</b> Düz bir zeminde (tercihen atletizm pisti) 12 dakika boyunca koşulan mesafeyi (metre) ölçün.</p>
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
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Cooper Testi (12 Dk Koşulan Metre)</label>
                            <input type="number" id="m-cooper" class="w-full" placeholder="Örn: 2400" oninput="window.calculateAdvancedMetrics()">
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
                </div>

                <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem;">
'''

new_content = content.replace(target, replacement)

with open('index.html', 'w') as f:
    f.write(new_content)
