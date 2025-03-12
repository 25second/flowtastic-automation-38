import { StructuredTool } from "@langchain/core/tools";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

class NavigateTool extends StructuredTool {
  name = "navigate";
  description = "Navigate to a specified URL";
  schema = z.object({
    url: z.string().describe("The URL to navigate to"),
  });
  
  browserInstance: any;
  
  constructor(browserInstance: any) {
    super();
    this.browserInstance = browserInstance;
  }
  
  async _call(args: { url: string }) {
    return await this.browserInstance.navigate(args.url);
  }
}

class ClickTool extends StructuredTool {
  name = "click";
  description = "Click on an element identified by a selector";
  schema = z.object({
    selector: z.string().describe("CSS selector or XPath of the element to click"),
  });
  
  browserInstance: any;
  
  constructor(browserInstance: any) {
    super();
    this.browserInstance = browserInstance;
  }
  
  async _call(args: { selector: string }) {
    return await this.browserInstance.click(args.selector);
  }
}

class TypeTool extends StructuredTool {
  name = "type";
  description = "Type text into an input element";
  schema = z.object({
    selector: z.string().describe("CSS selector or XPath of the input element"),
    text: z.string().describe("Text to type into the element"),
  });
  
  browserInstance: any;
  
  constructor(browserInstance: any) {
    super();
    this.browserInstance = browserInstance;
  }
  
  async _call(args: { selector: string; text: string }) {
    return await this.browserInstance.type(args.selector, args.text);
  }
}

class ExtractTool extends StructuredTool {
  name = "extract";
  description = "Extract content from an element identified by a selector";
  schema = z.object({
    selector: z.string().describe("CSS selector or XPath of the element to extract content from"),
  });
  
  browserInstance: any;
  
  constructor(browserInstance: any) {
    super();
    this.browserInstance = browserInstance;
  }
  
  async _call(args: { selector: string }) {
    return await this.browserInstance.extract(args.selector);
  }
}

class WaitTool extends StructuredTool {
  name = "wait";
  description = "Wait for an element to appear on the page";
  schema = z.object({
    selector: z.string().describe("CSS selector or XPath of the element to wait for"),
    timeout: z.number().optional().describe("Maximum time to wait in milliseconds (default: 30000)"),
  });
  
  browserInstance: any;
  
  constructor(browserInstance: any) {
    super();
    this.browserInstance = browserInstance;
  }
  
  async _call(args: { selector: string; timeout?: number }) {
    return await this.browserInstance.waitForSelector(args.selector, args.timeout || 30000);
  }
}

class ScreenshotTool extends StructuredTool {
  name = "screenshot";
  description = "Take a screenshot of the current page";
  schema = z.object({});
  
  browserInstance: any;
  saveScreenshot: (data: string) => Promise<string>;
  
  constructor(browserInstance: any, saveScreenshot: (data: string) => Promise<string>) {
    super();
    this.browserInstance = browserInstance;
    this.saveScreenshot = saveScreenshot;
  }
  
  async _call() {
    const data = await this.browserInstance.screenshot();
    const path = await this.saveScreenshot(data);
    return `Screenshot saved to ${path}`;
  }
}

export class TableOperationTool extends StructuredTool {
  name = "table";
  schema = z.object({
    operation: z.string().describe("Operation to perform: 'read', 'write', 'update', or 'delete'"),
    data: z.record(z.any()).optional().describe("Data to write or update"),
    query: z.record(z.any()).optional().describe("Query conditions")
  });
  
  tableId: string;
  supabase: SupabaseClient;
  browserInstance: any;
  saveScreenshot: (data: string) => Promise<string>;
  
  constructor(
    tableId: string, 
    supabase: SupabaseClient, 
    browserInstance: any,
    saveScreenshot: (data: string) => Promise<string>
  ) {
    super();
    this.tableId = tableId;
    this.supabase = supabase;
    this.browserInstance = browserInstance;
    this.saveScreenshot = saveScreenshot;
  }
  
  async _call(args: { operation: string; data?: any; query?: any }) {
    const { operation, data, query } = args;
    
    if (!this.tableId) {
      throw new Error("No table ID provided for table operation");
    }
    
    switch (operation) {
      case "read":
        return await this._readFromTable(query);
      case "write":
        return await this._writeToTable(data);
      case "update":
        return await this._updateTable(data, query);
      case "delete":
        return await this._deleteFromTable(query);
      default:
        throw new Error(`Unsupported table operation: ${operation}`);
    }
  }
  
  private async _readFromTable(query: any) {
    try {
      let request = this.supabase.from(this.tableId).select();
      
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          request = request.eq(key, value);
        });
      }
      
      const { data, error } = await request;
      
      if (error) throw error;
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error reading from table:", error);
      throw error;
    }
  }
  
  private async _writeToTable(data: any) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableId)
        .insert(data)
        .select();
      
      if (error) throw error;
      return `Successfully inserted data with id: ${result[0].id}`;
    } catch (error) {
      console.error("Error writing to table:", error);
      throw error;
    }
  }
  
  private async _updateTable(data: any, query: any) {
    try {
      let request = this.supabase.from(this.tableId).update(data);
      
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          request = request.eq(key, value);
        });
      }
      
      const { data: result, error } = await request.select();
      
      if (error) throw error;
      return `Successfully updated ${result.length} records`;
    } catch (error) {
      console.error("Error updating table:", error);
      throw error;
    }
  }
  
  private async _deleteFromTable(query: any) {
    try {
      let request = this.supabase.from(this.tableId).delete();
      
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          request = request.eq(key, value);
        });
      }
      
      const { data: result, error } = await request;
      
      if (error) throw error;
      return `Successfully deleted records`;
    } catch (error) {
      console.error("Error deleting from table:", error);
      throw error;
    }
  }
}

export const getBrowserTools = (
  browserInstance: any,
  saveScreenshot: (data: string) => Promise<string>,
  tableId?: string,
  supabase?: SupabaseClient
) => {
  const tools = [
    new NavigateTool(browserInstance),
    new ClickTool(browserInstance),
    new TypeTool(browserInstance),
    new ExtractTool(browserInstance),
    new WaitTool(browserInstance),
    new ScreenshotTool(browserInstance, saveScreenshot),
  ];
  
  if (tableId && supabase) {
    tools.push(new TableOperationTool(tableId, supabase, browserInstance, saveScreenshot));
  }
  
  return tools;
};
