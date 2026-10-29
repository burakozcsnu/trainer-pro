import re

with open('script.js', 'r') as f:
    content = f.read()

# I modified saveCardioTest earlier, but forgot to revert saveMeasurement!
# saveMeasurement is still passing yas, rhr, cooper, etc. which don't exist, causing the 400 Bad Request error.

target_save = """            basen: parseFloat(document.getElementById('m-basen').value) || null,
            yas: parseFloat(document.getElementById('m-age').value) || null,
            rhr: parseFloat(document.getElementById('m-rhr').value) || null,
            cooper: parseFloat(document.getElementById('m-cooper').value) || null,
            bmr: parseFloat(document.getElementById('m-bmr').value) || null,
            mhr: parseFloat(document.getElementById('m-mhr').value) || null,
            hrr: parseFloat(document.getElementById('m-hrr').value) || null,
            vo2max: parseFloat(document.getElementById('m-vo2max').value) || null
        };"""

replace_save = """            basen: parseFloat(document.getElementById('m-basen').value) || null
        };"""

content = content.replace(target_save, replace_save)

with open('script.js', 'w') as f:
    f.write(content)
