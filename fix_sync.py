with open('script.js', 'r') as f:
    content = f.read()

new_content = content.replace('if (results.some(r => r.error)) throw new Error("Veritabanı hatası");', '''
            const errIndex = results.findIndex(r => r.error);
            if (errIndex !== -1) {
                console.error("Supabase Error Data:", results[errIndex].error);
                throw new Error("Veritabanı hatası at index " + errIndex + ": " + results[errIndex].error.message);
            }
''')

with open('script.js', 'w') as f:
    f.write(new_content)
