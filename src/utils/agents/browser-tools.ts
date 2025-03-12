
import { StructuredTool } from "@langchain/core/tools";
import { SupabaseClient } from "@supabase/supabase-js";
import { Page } from "playwright";
import { z } from "zod";

class NavigateTool extends StructuredTool {
  name = "navigate";
  description = "Navigate to a specified URL";
  schema = z.object({
    url: z.string().describe("The URL to navigate to"),
  });
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call(args: { url: string }) {
    await this.page.goto(args.url);
    return `Navigated to ${args.url}`;
  }
}

class ClickTool extends StructuredTool {
  name = "click";
  description = "Click on an element identified by a selector";
  schema = z.object({
    selector: z.string().describe("CSS selector of the element to click"),
  });
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call(args: { selector: string }) {
    await this.page.click(args.selector);
    return `Clicked element ${args.selector}`;
  }
}

class TypeTool extends StructuredTool {
  name = "type";
  description = "Type text into an input element";
  schema = z.object({
    selector: z.string().describe("CSS selector of the input element"),
    text: z.string().describe("Text to type into the element"),
  });
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call(args: { selector: string; text: string }) {
    await this.page.fill(args.selector, args.text);
    return `Typed "${args.text}" into ${args.selector}`;
  }
}

class ExtractTool extends StructuredTool {
  name = "extract";
  description = "Extract content from elements on the page";
  schema = z.object({
    selector: z.string().describe("CSS selector of elements to extract content from"),
  });
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call(args: { selector: string }) {
    const content = await this.page.$eval(args.selector, (el) => el.textContent);
    return content || "No content found";
  }
}

class ScrapePageTool extends StructuredTool {
  name = "scrapePage";
  description = "Extract all visible text content from the current page";
  schema = z.object({});
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call() {
    const content = await this.page.evaluate(() => {
      const getText = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() || '';
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const style = window.getComputedStyle(node as Element);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return '';
          }
          
          const childTexts = Array.from(node.childNodes).map(getText);
          return childTexts.join(' ').trim();
        }
        
        return '';
      };
      
      return getText(document.body);
    });
    
    return content;
  }
}

export const getBrowserTools = (page: Page) => {
  return [
    new NavigateTool(page),
    new ClickTool(page),
    new TypeTool(page),
    new ExtractTool(page),
    new ScrapePageTool(page),
  ];
};
