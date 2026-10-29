import re

with open('index.html', 'r') as f:
    content = f.read()

target1 = """                        <p style="margin-bottom: 0.5rem;"><b>VO2 Max (Cooper Testi):</b> Düz bir zeminde (tercihen atletizm pisti) 12 dakika boyunca koşulan mesafeyi (metre) ölçün.</p>"""
replace1 = """                        <p style="margin-bottom: 0.5rem;"><b>VO2 Max (Queen's College Step Testi):</b> Üye 41.3 cm yüksekliğindeki bir basamağa metronom eşliğinde 3 dakika boyunca inip çıkar (Erkekler: 24 adım/dk, Kadınlar: 22 adım/dk). Test bittikten hemen sonra 5 saniye bekleyip 15 saniyelik nabız sayılır ve 4 ile çarpılarak test sonu nabzı (bpm) girilir.</p>"""

content = content.replace(target1, replace1)

target2 = """                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Cooper Testi (12 Dk Koşulan Metre)</label>
                            <input type="number" id="m-cooper" class="w-full" placeholder="Örn: 2400" oninput="window.calculateAdvancedMetrics()">
                        </div>"""
replace2 = """                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Queen's Step Testi (Test Sonu Nabız - bpm)</label>
                            <input type="number" id="m-cooper" class="w-full" placeholder="Örn: 156" oninput="window.calculateAdvancedMetrics()">
                        </div>"""

content = content.replace(target2, replace2)

with open('index.html', 'w') as f:
    f.write(content)
