
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Extensions for browser-use library to handle captcha solving and table operations
"""

import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BrowserUseExtensions:
    """Extended functionality for browser-use automation"""
    
    def __init__(self, browser_automation):
        """Initialize with existing BrowserAutomation instance"""
        self.browser = browser_automation
        self.page = browser_automation.page
    
    async def solve_recaptcha(self, frame_selector: str = None) -> bool:
        """
        Solve reCAPTCHA on the page
        Args:
            frame_selector: Optional CSS selector for captcha iframe
        Returns:
            bool: True if solved successfully
        """
        try:
            logger.info("Attempting to solve reCAPTCHA")
            
            # Find captcha iframe if not provided
            if not frame_selector:
                frame_selector = 'iframe[src*="recaptcha"]'
            
            # Wait for captcha iframe
            frame = await self.page.wait_for_selector(frame_selector)
            if not frame:
                raise Exception("Captcha iframe not found")
                
            # Get frame content
            frame_content = await frame.content_frame()
            if not frame_content:
                raise Exception("Could not access captcha iframe content")
            
            # Click on checkbox
            checkbox = await frame_content.wait_for_selector('.recaptcha-checkbox')
            if checkbox:
                await checkbox.click()
                logger.info("Clicked captcha checkbox")
                
                # Wait for verification
                await self.page.wait_for_selector('.recaptcha-success', 
                                                timeout=10000)
                logger.info("Captcha solved successfully")
                return True
                
            return False
            
        except Exception as e:
            logger.error(f"Failed to solve captcha: {str(e)}")
            return False
    
    async def interact_with_table(self, table_id: str, action: str,
                                data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Interact with custom tables in the application
        Args:
            table_id: ID of the table to interact with
            action: Type of interaction ('read', 'write', 'update')
            data: Optional data for write/update operations
        Returns:
            Dict containing operation result
        """
        try:
            logger.info(f"Table operation: {action} on table {table_id}")
            
            # Validate table exists
            table_selector = f'#table-{table_id}'
            table_element = await self.page.wait_for_selector(table_selector)
            if not table_element:
                raise Exception(f"Table with ID {table_id} not found")
            
            if action == 'read':
                # Extract table data
                table_data = await self.page.evaluate(f'''
                    () => {{
                        const table = document.querySelector('{table_selector}');
                        const rows = Array.from(table.querySelectorAll('tr'));
                        return rows.map(row => 
                            Array.from(row.querySelectorAll('td,th'))
                                .map(cell => cell.textContent)
                        );
                    }}
                ''')
                return {'success': True, 'data': table_data}
                
            elif action in ['write', 'update']:
                if not data:
                    raise Exception("Data required for write/update operations")
                    
                # Convert data to JSON string
                data_str = json.dumps(data)
                
                # Update table via custom event
                await self.page.evaluate(f'''
                    (data) => {{
                        const event = new CustomEvent('table-operation', {{
                            detail: {{
                                tableId: '{table_id}',
                                action: '{action}',
                                data: data
                            }}
                        }});
                        document.dispatchEvent(event);
                    }}
                ''', data_str)
                
                # Wait for confirmation
                await self.page.wait_for_selector('.table-update-success',
                                                timeout=5000)
                return {'success': True, 'message': f'Table {action} completed'}
                
            else:
                raise Exception(f"Unsupported table action: {action}")
                
        except Exception as e:
            logger.error(f"Table operation failed: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

    async def wait_for_table_update(self, table_id: str,
                                  timeout: int = 5000) -> bool:
        """
        Wait for table update to complete
        Args:
            table_id: ID of the table
            timeout: Maximum time to wait in milliseconds
        Returns:
            bool: True if update completed successfully
        """
        try:
            await self.page.wait_for_selector(
                '.table-update-success',
                timeout=timeout
            )
            return True
        except Exception as e:
            logger.error(f"Timeout waiting for table update: {str(e)}")
            return False

