import re

with open('script.js', 'r') as f:
    content = f.read()

target = "const m = state.measurements.find(x => x.id == id);"
replacement = "const m = state.measurements.find(x => x.id == id);\n        if (!m) return;"
content = content.replace(target, replacement)

with open('script.js', 'w') as f:
    f.write(content)
