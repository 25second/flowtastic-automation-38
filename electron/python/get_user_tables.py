
#!/usr/bin/env python3
"""
Script to retrieve all tables of a user from Supabase
"""

import sys
import json
import argparse
import requests
from datetime import datetime

def log(message):
    """Log a message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Get User Tables')
    parser.add_argument('--url', type=str, required=True, help='Supabase URL')
    parser.add_argument('--key', type=str, required=True, help='Supabase Anon Key')
    parser.add_argument('--jwt', type=str, help='User JWT token (optional)')
    parser.add_argument('--category', type=str, help='Filter by category ID (optional)')
    parser.add_argument('--search', type=str, help='Search term for table name (optional)')
    parser.add_argument('--limit', type=int, default=100, help='Maximum number of tables to return (default: 100)')
    return parser.parse_args()

def get_user_tables(supabase_url, supabase_key, jwt=None, category=None, search=None, limit=100):
    """Get all tables for a user from Supabase"""
    try:
        # Prepare headers
        headers = {
            'apikey': supabase_key,
            'Content-Type': 'application/json'
        }
        
        # Add authorization header if JWT is provided
        if jwt:
            headers['Authorization'] = f'Bearer {jwt}'
        
        # Prepare payload with optional filters
        payload = {
            "limit": limit
        }
        
        if category:
            payload["category"] = category
            
        if search:
            payload["search"] = search
        
        # Construct the endpoint URL for get-tables operation
        endpoint = f"{supabase_url}/functions/v1/table-api/get-tables"
        
        log(f"Making request to: {endpoint}")
        log(f"With payload: {json.dumps(payload)}")
        
        # Make the request
        response = requests.post(
            endpoint,
            headers=headers,
            json=payload
        )
        
        # Check if the request was successful
        if response.status_code == 200:
            tables = response.json()
            log(f"Successfully retrieved {len(tables)} tables")
            return {
                "status": "success",
                "tables": tables,
                "timestamp": datetime.now().isoformat()
            }
        else:
            error_msg = f"Error: {response.status_code} - {response.text}"
            log(error_msg)
            return {
                "status": "error",
                "error": error_msg,
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
        result = get_user_tables(
            args.url, 
            args.key, 
            args.jwt, 
            args.category, 
            args.search, 
            args.limit
        )
        print(json.dumps(result, indent=2))
        return 0 if result["status"] == "success" else 1
    
    except Exception as e:
        error = {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error, indent=2), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
