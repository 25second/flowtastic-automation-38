
#!/usr/bin/env python3
"""
Task Runner script for automating browser interactions
"""

import sys
import json
import time
import argparse
from datetime import datetime

def log(message):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Task Runner for browser automation')
    parser.add_argument('--task', type=str, help='Task JSON data or path to JSON file')
    parser.add_argument('--browser', type=str, default='chrome', help='Browser to use')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    return parser.parse_args()

def run_task(task_data, browser, debug=False):
    """Run a task with the specified parameters"""
    log(f"Starting task: {task_data.get('name', 'Unnamed task')}")
    log(f"Using browser: {browser}")
    
    if debug:
        log("Debug mode enabled")
    
    # Simulate task execution
    steps = task_data.get('steps', [])
    for i, step in enumerate(steps):
        log(f"Executing step {i+1}/{len(steps)}: {step.get('name', 'Unnamed step')}")
        # Simulate step execution time
        time.sleep(0.5)
    
    log("Task completed successfully")
    return {
        "status": "success",
        "task_id": task_data.get("id"),
        "completed_at": datetime.now().isoformat()
    }

def main():
    """Main entry point"""
    args = parse_arguments()
    
    try:
        # Parse task data
        if not args.task:
            raise ValueError("No task data provided")
        
        if args.task.startswith('{'):
            # Treat as JSON string
            task_data = json.loads(args.task)
        else:
            # Treat as file path
            with open(args.task, 'r') as f:
                task_data = json.load(f)
        
        # Run the task
        result = run_task(task_data, args.browser, args.debug)
        
        # Output the result as JSON
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
