
interface AgentScriptParams {
  name: string;
  description: string;
  taskDescription: string;
  takeScreenshots: boolean;
  selectedTable: string;
  color: string;
}

/**
 * Generates a browser-use script for an AI agent
 */
export function generateAgentScript(params: AgentScriptParams): string {
  const { 
    name, 
    description, 
    taskDescription,
    takeScreenshots,
    selectedTable,
    color
  } = params;

  // Clean up task description for inclusion in the script
  const cleanTaskDescription = taskDescription
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return `
// AI Agent: ${name}
// Description: ${description}
// Generated on: ${new Date().toISOString()}

const { browserUse } = require('browser-use');

async function runAgent() {
  console.log('Starting AI Agent: ${name}');
  
  // Configure browser-use
  const browser = await browserUse({
    headless: false,
    screenshots: ${takeScreenshots},
    ${selectedTable ? `tableId: "${selectedTable}",` : ''}
    metadata: {
      type: "ai-agent",
      name: "${name}",
      color: "${color}"
    }
  });

  try {
    // Execute the agent's task
    await browser.execute(\`
      ${cleanTaskDescription}
    \`);

    // Example task execution
    await browser.goto('https://example.com');
    await browser.waitForSelector('h1');
    
    // Take a screenshot if enabled
    ${takeScreenshots ? `
    await browser.screenshot({
      path: "agent-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-\${Date.now()}.png"
    });` : '// Screenshot capture disabled'}
    
    // Additional agent-specific logic can be added here
    
    console.log('Agent task completed successfully');
  } catch (error) {
    console.error('Agent encountered an error:', error);
  } finally {
    await browser.close();
  }
}

// Run the agent
runAgent().catch(console.error);
`;
}
