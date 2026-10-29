with open('script.js', 'r') as f:
    content = f.read()

import re
matches = re.findall(r'async function sync\(\) \{[\s\S]*?\}', content)
print(len(matches), "sync functions found")
