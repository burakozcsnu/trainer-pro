with open('script.js', 'r') as f:
    content = f.read()

new_content = content.replace('''            if (error) throw error;''', '''            if (error) return { data: null, error: error };''')

with open('script.js', 'w') as f:
    f.write(new_content)
