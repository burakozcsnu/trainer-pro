with open('script.js', 'r') as f:
    lines = f.readlines()

print("File has", len(lines), "lines.")
print("Last 30 lines:")
for line in lines[-30:]:
    print(repr(line))
