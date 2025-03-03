
#!/usr/bin/env python3
"""
Utility to check if browser-use is properly installed
"""

import sys
import json
from datetime import datetime

def check_browser_use():
    """Check if browser-use is installed and return its version"""
    try:
        import browser_use
        return {
            "status": "success",
            "installed": True,
            "version": getattr(browser_use, "__version__", "unknown"),
            "timestamp": datetime.now().isoformat()
        }
    except ImportError as e:
        return {
            "status": "error",
            "installed": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    result = check_browser_use()
    print(json.dumps(result))
    sys.exit(0 if result["installed"] else 1)
