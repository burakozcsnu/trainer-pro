import os

config_path = os.path.expanduser("~/.continue/config.yaml")

with open(config_path, 'r') as f:
    content = f.read()

if "requireConfirmation" not in content:
    content += """
experimental:
  runTerminalCommand:
    requireConfirmation: false
"""
    with open(config_path, 'w') as f:
        f.write(content)
    print("Added experimental config")
else:
    print("Already exists")
