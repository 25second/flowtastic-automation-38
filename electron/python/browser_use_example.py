
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Example script demonstrating the use of browser-use library with extensions
"""

import sys
import json
import argparse
from datetime import datetime

try:
    import browser_use
    from browser_use_extensions import BrowserUseExtensions
    BROWSER_USE_AVAILABLE = True
except ImportError:
    BROWSER_USE_AVAILABLE = False
    print("Warning: browser-use library not found, some features will be disabled")

def log(message):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Browser-Use Example')
    parser.add_argument('--url', type=str, default='https://example.com',
                       help='URL to open')
    parser.add_argument('--port', type=int, default=9222,
                       help='Chrome debugging port')
    parser.add_argument('--debug', action='store_true',
                       help='Enable debug mode')
    parser.add_argument('--table-id', type=str,
                       help='Table ID for table operations')
    parser.add_argument('--table-action', type=str,
                       choices=['read', 'write', 'update'],
                       help='Action to perform on table')
    return parser.parse_args()

def run_browser_example(url, port, debug=False, table_id=None,
                       table_action=None):
    """Run a browser automation example using browser-use with extensions"""
    if not BROWSER_USE_AVAILABLE:
        return {
            "status": "error",
            "error": "browser-use library not available",
            "timestamp": datetime.now().isoformat()
        }
    
    log(f"Connecting to Chrome on port {port}")
    log(f"Opening URL: {url}")
    
    try:
        # Use browser-use to connect to Chrome and perform actions
        if debug:
            browser_use.set_debug(True)
            
        # Connect to browser
        browser = browser_use.connect(port)
        
        # Create extensions instance
        extensions = BrowserUseExtensions(browser)
        
        # Open URL
        page = browser.new_page()
        page.goto(url)
        
        # Handle table operations if requested
        if table_id and table_action:
            log(f"Performing {table_action} operation on table {table_id}")
            result = extensions.interact_with_table(
                table_id,
                table_action,
                data={'example': 'data'} if table_action != 'read' else None
            )
            log(f"Table operation result: {result}")
        
        # Get page title
        title = page.title()
        log(f"Page title: {title}")
        
        # Take screenshot
        screenshot_data = page.screenshot_base64()
        
        # Close browser
        browser.close()
        
        return {
            "status": "success",
            "title": title,
            "screenshot": screenshot_data[:100] + "..." if screenshot_data else None,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        log(f"Error: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

def main():
    """Main entry point"""
    args = parse_arguments()
    
    try:
        result = run_browser_example(
            args.url,
            args.port,
            args.debug,
            args.table_id,
            args.table_action
        )
        print(json.dumps(result))
        return 0
    
    except Exception as e:
        error = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())

