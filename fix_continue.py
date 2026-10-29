import yaml
import os

config_path = os.path.expanduser("~/.continue/config.yaml")

with open(config_path, 'r') as f:
    config = yaml.safe_load(f)

# If 'allow' doesn't exist, we'll create it. Or if it exists but is a list, we need to restructure it.
# Usually 'allow' for continue.dev is not a list, but wait - let's check continue documentation.

# Continue uses a 'allowAnonymousTelemetry' and experimental 'allow' settings.
# For run_terminal_command to auto-approve, the setting in Continue is often:
# terminalCommands: 
#   requireConfirmation: false
# Let's try adding this.

config['experimental'] = config.get('experimental', {})
config['experimental']['runTerminalCommand'] = {'requireConfirmation': False}

with open(config_path, 'w') as f:
    yaml.dump(config, f, default_flow_style=False)
