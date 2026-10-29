with open('script.js', 'r') as f:
    content = f.read()

new_content = content.replace('''        } catch (error) {
            console.error(error);
            alert("Senkronizasyon hatası!");
        }''', '''        } catch (error) {
            console.error("SYNC CATCH BLOCK:", error);
            alert("Senkronizasyon hatası! Konsolu kontrol edin.");
        }''')

with open('script.js', 'w') as f:
    f.write(new_content)
