import { Tool } from "@langchain/core/tools";
import { isElectronApp } from "@/electron";
import { toast } from "sonner";

export class NavigateTool extends Tool {
  name = "navigate";
  description = "Navigate to a specific URL in the browser";
  
  constructor(private browserInstance: any) {
    super();
  }
  
  async _call(url: string): Promise<string> {
    try {
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      
      await this.browserInstance.navigate(url);
      return `Successfully navigated to ${url}`;
    } catch (error) {
      return `Error navigating to ${url}: ${error.message}`;
    }
  }
}

export class ClickTool extends Tool {
  name = "click";
  description = "Click on an element in the page by CSS selector or text content";
  
  constructor(private browserInstance: any) {
    super();
  }
  
  async _call(target: string): Promise<string> {
    try {
      const result = await this.browserInstance.click(target);
      return `Successfully clicked on ${target}`;
    } catch (error) {
      return `Error clicking on ${target}: ${error.message}`;
    }
  }
}

export class TypeTool extends Tool {
  name = "type";
  description = "Type text into an input field specified by selector";
  
  constructor(private browserInstance: any) {
    super();
  }
  
  async _call(args: string): Promise<string> {
    try {
      const [selector, text] = args.split(",").map(arg => arg.trim());
      
      if (!selector || !text) {
        return "Error: Both selector and text are required. Format: 'selector, text'";
      }
      
      await this.browserInstance.type(selector, text);
      return `Successfully typed "${text}" into ${selector}`;
    } catch (error) {
      return `Error typing text: ${error.message}`;
    }
  }
}

export class ExtractTool extends Tool {
  name = "extract";
  description = "Extract text content from elements matching a selector";
  
  constructor(private browserInstance: any) {
    super();
  }
  
  async _call(selector: string): Promise<string> {
    try {
      const result = await this.browserInstance.extract(selector);
      return `Extracted content: ${JSON.stringify(result)}`;
    } catch (error) {
      return `Error extracting content: ${error.message}`;
    }
  }
}

export class WaitTool extends Tool {
  name = "wait";
  description = "Wait for a specified time in milliseconds or for an element to appear";
  
  constructor(private browserInstance: any) {
    super();
  }
  
  async _call(input: string): Promise<string> {
    try {
      // If input is a number, wait for that many milliseconds
      if (!isNaN(Number(input))) {
        const ms = Number(input);
        await new Promise(resolve => setTimeout(resolve, ms));
        return `Waited for ${ms}ms`;
      }
      
      // Otherwise, treat as a selector and wait for element
      await this.browserInstance.waitForSelector(input);
      return `Successfully waited for element: ${input}`;
    } catch (error) {
      return `Error waiting: ${error.message}`;
    }
  }
}

export class ScreenshotTool extends Tool {
  name = "screenshot";
  description = "Take a screenshot of the current page";
  
  constructor(private browserInstance: any, private saveScreenshot: (data: string) => Promise<string>) {
    super();
  }
  
  async _call(_: string): Promise<string> {
    try {
      const screenshotData = await this.browserInstance.screenshot();
      const path = await this.saveScreenshot(screenshotData);
      return `Screenshot taken and saved to ${path}`;
    } catch (error) {
      return `Error taking screenshot: ${error.message}`;
    }
  }
}

export class TableOperationTool extends Tool {
  name = "table";
  description = "Perform operations on application tables (read/write data)";
  
  constructor(private tableId: string, private supabaseClient: any) {
    super();
  }
  
  async _call(args: string): Promise<string> {
    try {
      const [operation, ...params] = args.split(",").map(arg => arg.trim());
      
      if (operation === "read") {
        const { data, error } = await this.supabaseClient
          .from('custom_tables')
          .select('*')
          .eq('id', this.tableId)
          .single();
          
        if (error) throw error;
        
        return `Table data: ${JSON.stringify(data)}`;
      } else if (operation === "write") {
        // Implement write logic here
        return "Write operation not implemented yet";
      } else {
        return `Unknown operation: ${operation}. Supported operations: read, write`;
      }
    } catch (error) {
      return `Error performing table operation: ${error.message}`;
    }
  }
}

export const getBrowserTools = (
  browserInstance: any, 
  saveScreenshot: (data: string) => Promise<string>,
  tableId?: string,
  supabaseClient?: any
) => {
  const tools = [
    new NavigateTool(browserInstance),
    new ClickTool(browserInstance),
    new TypeTool(browserInstance),
    new ExtractTool(browserInstance),
    new WaitTool(browserInstance),
    new ScreenshotTool(browserInstance, saveScreenshot)
  ];
  
  if (tableId && supabaseClient) {
    tools.push(new TableOperationTool(tableId, supabaseClient));
  }
  
  return tools;
};
