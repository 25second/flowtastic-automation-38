
interface AgentScriptParams {
  name: string;
  description: string;
  taskDescription: string;
  takeScreenshots: boolean;
  selectedTable: string;
  color: string;
  aiProvider?: string;
  model?: string;
}

/**
 * Generates a Python script for an AI agent
 */
export function generateAgentScript(params: AgentScriptParams): string {
  const { 
    name, 
    description, 
    taskDescription,
    takeScreenshots,
    selectedTable,
    color,
    aiProvider = 'OpenAI',
    model = 'gpt-4o-mini'
  } = params;

  if (!name || !taskDescription) {
    throw new Error('Name and task description are required for script generation');
  }

  // Clean up task description for inclusion in the script
  const cleanTaskDescription = taskDescription
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/'''/g, "\\'\\'\\'");

  // Add validation to ensure script template is valid
  try {
    return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AI Agent: ${name}
Description: ${description || 'No description provided'}
AI Provider: ${aiProvider}
AI Model: ${model}
Generated on: ${new Date().toISOString()}
"""

import sys
import json
import time
import logging
from datetime import datetime
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("agent-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}")

class BrowserAutomation:
    """Browser automation utility for AI agent tasks."""
    
    def __init__(self, headless: bool = False, screenshots: bool = ${takeScreenshots}, 
                 table_id: Optional[str] = ${selectedTable ? `"${selectedTable}"` : 'None'}, 
                 metadata: Optional[Dict[str, Any]] = None):
        """Initialize the browser automation."""
        self.headless = headless
        self.screenshots = screenshots
        self.table_id = table_id
        self.metadata = metadata or {}
        self.browser = None
        self.page = None
        self.ai_provider = "${aiProvider}"
        self.ai_model = "${model}"
        logger.info("Initializing browser automation")
        
    async def start(self):
        """Start the browser session."""
        try:
            # Here we would initialize the actual browser
            # This is a placeholder for the actual implementation
            logger.info(f"Starting browser session with AI provider: {self.ai_provider}, model: {self.ai_model}")
            return True
        except Exception as e:
            logger.error(f"Failed to start browser: {str(e)}")
            return False
    
    async def execute(self, script: str):
        """Execute the given script in the browser context."""
        try:
            logger.info("Executing task")
            # Here we would execute the actual script in the browser
            # This is a placeholder for the actual implementation
            
            # Execute the custom task logic
            '''
${cleanTaskDescription.split('\n').map(line => '            ' + line).join('\n')}
            '''
            
            return True
        except Exception as e:
            logger.error(f"Error executing script: {str(e)}")
            return False
    
    async def take_screenshot(self, path: str = None):
        """Take a screenshot of the current page."""
        if not self.screenshots:
            logger.info("Screenshots are disabled")
            return False
            
        try:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            path = path or f"agent-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-{timestamp}.png"
            logger.info(f"Taking screenshot: {path}")
            # Here we would take the actual screenshot
            # This is a placeholder for the actual implementation
            return True
        except Exception as e:
            logger.error(f"Failed to take screenshot: {str(e)}")
            return False
    
    async def close(self):
        """Close the browser session."""
        try:
            logger.info("Closing browser session")
            # Here we would close the actual browser session
            # This is a placeholder for the actual implementation
            return True
        except Exception as e:
            logger.error(f"Error closing browser: {str(e)}")
            return False

async def run_agent():
    """Main function to run the agent."""
    logger.info("Starting AI Agent: ${name}")
    
    browser = BrowserAutomation(
        headless=False,
        screenshots=${takeScreenshots},
        ${selectedTable ? `table_id="${selectedTable}",` : ''}
        metadata={
            "type": "ai-agent",
            "name": "${name}",
            "color": "${color}",
            "ai_provider": "${aiProvider}",
            "ai_model": "${model}"
        }
    )
    
    try:
        # Start the browser
        if not await browser.start():
            raise Exception("Failed to start browser")
        
        # Execute the agent's task
        if not await browser.execute(""):
            raise Exception("Failed to execute task")
        
        # Take a screenshot if enabled
        ${takeScreenshots ? 'await browser.take_screenshot()' : '# Screenshot capture disabled'}
        
        logger.info("Agent task completed successfully")
    except Exception as e:
        logger.error(f"Agent encountered an error: {str(e)}")
        raise
    finally:
        await browser.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_agent())
`;
  } catch (error) {
    console.error('Error generating agent script:', error);
    throw new Error('Failed to generate agent script: ' + (error instanceof Error ? error.message : String(error)));
  }
}
