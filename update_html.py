import re

with open('index.html', 'r') as f:
    content = f.read()

# Add height input
target = '''<div class="form-group"><label
                            style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Kilo
                            (kg)</label><input type="number" step="0.1" id="m-weight" required class="w-full"></div>'''

replacement = '''<div class="form-group"><label
                            style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Kilo
                            (kg)</label><input type="number" step="0.1" id="m-weight" required class="w-full" oninput="window.calculateFatPercentage()"></div>
                    <div class="form-group"><label
                            style="display:block; margin-bottom:0.2rem; color:var(--text-dim); font-size:0.8rem;">Boy
                            (cm)</label><input type="number" step="0.1" id="m-height-measurement" class="w-full" oninput="window.calculateFatPercentage()"></div>'''

content = content.replace(target, replacement)

# Add oninput triggers to waist and neck
content = content.replace('id="m-waist" class="w-full"', 'id="m-waist" class="w-full" oninput="window.calculateFatPercentage()"')
content = content.replace('id="m-neck" class="w-full"', 'id="m-neck" class="w-full" oninput="window.calculateFatPercentage()"')
content = content.replace('id="m-basen" class="w-full"', 'id="m-basen" class="w-full" oninput="window.calculateFatPercentage()"')


with open('index.html', 'w') as f:
    f.write(content)
