import re

with open('script.js', 'r') as f:
    content = f.read()

target = """        // VO2 Max (Cooper Test Formula: (Distance in meters - 504.9) / 44.73)
        if (cooperDistance) {
            const vo2max = (cooperDistance - 504.9) / 44.73;
            document.getElementById('m-vo2max').value = vo2max.toFixed(1);
        }"""
        
replace = """        // VO2 Max (Queen's College Step Test Formula)
        if (cooperDistance) { // cooperDistance represents the Post-Test Heart Rate in bpm here
            let vo2max = 0;
            if (gender === 'Kadın') {
                vo2max = 65.81 - (0.1847 * cooperDistance);
            } else {
                vo2max = 111.33 - (0.42 * cooperDistance);
            }
            document.getElementById('m-vo2max').value = vo2max.toFixed(1);
        }"""

content = content.replace(target, replace)

with open('script.js', 'w') as f:
    f.write(content)
