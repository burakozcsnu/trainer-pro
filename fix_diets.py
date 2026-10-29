with open('script.js', 'r') as f:
    content = f.read()

new_content = content.replace('state.dietPlans = results[7].data || [];', 'state.diets = results[7].data || [];')

with open('script.js', 'w') as f:
    f.write(new_content)
