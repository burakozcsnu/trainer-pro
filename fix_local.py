with open('script.js', 'r') as f:
    content = f.read()

new_content = content.replace('loadFromLocal();', '')
new_content = new_content.replace('saveToLocal();', '')

with open('script.js', 'w') as f:
    f.write(new_content)
