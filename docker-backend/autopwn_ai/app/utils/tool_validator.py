from typing import Dict, List, Optional, Any, Union, Set
import re
import shlex
import os
from pydantic import BaseModel, validator

# =====================================
# Command Blacklisting System
# =====================================

# Commands that are completely forbidden
BLACKLISTED_COMMANDS = {
    # System manipulation
    "shutdown", "reboot", "halt", "poweroff", "init", "telinit",
    
    # Container escape attempts 
    "docker", "kubectl", "podman", "lxc", "systemctl", "systemd",
    
    # Process/service manipulation
    "kill", "killall", "pkill", "service",
    
    # Privilege escalation
    "sudo", "su", "passwd", "chown", "chmod", "setuid", "setgid", 
    
    # System configuration
    "mount", "umount", "fdisk", "mkfs", "mkswap", "swapon", "swapoff",
    "useradd", "userdel", "usermod", "groupadd", "groupdel", "groupmod",
    
    # Network configuration
    "ifconfig", "ip", "route", "iptables", "ufw", "firewall-cmd",
    
    # Package management
    "apt", "apt-get", "dpkg", "yum", "dnf", "rpm", "pacman", "snap", "flatpak",
    
    # File system operations that could affect container
    "rm -rf /", "rm -rf /*", "rm -rf ~", "rm -rf .", "> /dev/sda",
    
    # Fork bombs and resource exhaustion
    ":(){ :|:& };:", "perl -e 'fork while fork'", "python -c 'import os; os.fork()'",
    
    # Generic escape patterns
    "`", "$(", "$(...)", 
    
    # Breaking out of intended directory
    "../", "/.."
}

# Dangerous arguments/flags that should be blocked for any command
BLACKLISTED_ARGS = [
    "--root", "--system", "--privileged", "--host", "--network=host",
    "-privileged", "-network=host", "-v /:/mnt", "--volume /:/mnt",
    "-cap-add=SYS_ADMIN", "--cap-add=SYS_ADMIN"
]

# Regular expressions for identifying potentially dangerous command patterns
DANGEROUS_PATTERNS = [
    # Attempts to break out of restricted shells
    r"python\s+-c\s+.*?os\s*\.\s*(system|popen|exec)",
    r"perl\s+-e\s+.*?(system|exec|`)",
    r"ruby\s+-e\s+.*?(system|exec|`)",
    r"php\s+-r\s+.*?(system|exec|shell_exec|passthru)",
    
    # Command injection
    r"(;|&&|\|\||\|)\s*(rm|wget|curl|bash|sh|nc|ncat|python|perl|ruby)",
    
    # Directory traversal
    r"(\.\.\/){2,}",  # Multiple directory traversals
    
    # Writing to sensitive locations
    r">\s*/etc/(passwd|shadow|sudoers)",
    r">\s*/root/\.ssh/authorized_keys",
    
    # Loading kernel modules
    r"(insmod|modprobe|rmmod|lsmod)",
    
    # Cron manipulation
    r"(>\s*|>>\s*)/etc/cron",
    
    # Common reverse shells
    r"bash\s+-i\s+>\s*&\s*/dev/tcp/",
    r"nc\s+(-e\s+|-.+?e.+?\s+).*?\s+\d{1,5}",
    r"python\s+-c\s+.*?socket\.socket",
    r"perl\s+-e\s+.*?socket\s*\(",
    r"sh\s+-i\s+\d{1,5}",
    
    # Misc escapes and bypasses
    r"\$\(\s*.*?\s*\)",  # Command substitution
]

# =====================================
# Command Validation Classes
# =====================================
class CommandRequest(BaseModel):
    command: str
    timeout: Optional[int] = 300
    
    @validator('command')
    def validate_command(cls, v):
        # Check if command is empty
        if not v.strip():
            raise ValueError("Command cannot be empty")
            
        # Check command length (prevent extremely long commands)
        if len(v) > 8192:
            raise ValueError(f"Command too long: {len(v)} characters. Maximum allowed: 8192")
        
        # Try to parse the command using shlex to get the base command
        try:
            args = shlex.split(v)
            base_command = os.path.basename(args[0]) if args else ""
        except:
            # If parsing fails, use a simple split
            base_command = v.split()[0].split('/')[-1]
        
        # Check for blacklisted commands
        if base_command.lower() in BLACKLISTED_COMMANDS:
            raise ValueError(f"Command '{base_command}' is blacklisted")
        
        # Check for blacklisted arguments
        for arg in BLACKLISTED_ARGS:
            if arg in v:
                raise ValueError(f"Argument '{arg}' is not allowed")
        
        # Check for dangerous patterns
        for pattern in DANGEROUS_PATTERNS:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError(f"Command matches dangerous pattern: {pattern}")
        
        return v
    
    @validator('timeout')
    def validate_timeout(cls, v):
        if v is not None:
            if v < 1:
                raise ValueError("Timeout must be at least 1 second")
            if v > 3600:
                raise ValueError("Timeout cannot exceed 3600 seconds (1 hour)")
        return v

def is_command_safe(command: str) -> bool:
    """
    Check if a command is safe to execute.
    Returns True if safe, False if potentially dangerous.
    """
    try:
        CommandRequest(command=command)
        return True
    except ValueError:
        return False

def get_validation_error(command: str) -> str:
    """
    Get the validation error for an unsafe command.
    Returns an empty string if the command is safe.
    """
    try:
        CommandRequest(command=command)
        return ""
    except ValueError as e:
        return str(e)