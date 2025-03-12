
import { StructuredTool } from "@langchain/core/tools";
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

class CaptureScreenshotTool extends StructuredTool {
  name = "captureScreenshot";
  description = "Capture a screenshot of the current page";
  schema = z.object({});
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call() {
    const screenshot = await this.page.screenshot({ type: 'jpeg', quality: 80 });
    const base64Image = screenshot.toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
  }
}

class GetPageInfoTool extends StructuredTool {
  name = "getPageInfo";
  description = "Get information about the current page (URL, title)";
  schema = z.object({});
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call() {
    const url = this.page.url();
    const title = await this.page.title();
    return JSON.stringify({ url, title });
  }
}

class WaitForNavigationTool extends StructuredTool {
  name = "waitForNavigation";
  description = "Wait for the page to navigate to a new URL";
  schema = z.object({
    timeout: z.number().optional().describe("Maximum time to wait in milliseconds")
  });
  
  page: Page;
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  async _call(args: { timeout?: number }) {
    await this.page.waitForNavigation({ 
      timeout: args.timeout || 30000,
      waitUntil: 'networkidle' 
    });
    return `Waited for navigation to complete. Current URL: ${this.page.url()}`;
  }
}

export const getBrowserTools = (page: Page) => {
  return [
    new NavigateTool(page),
    new ClickTool(page),
    new TypeTool(page),
    new ExtractTool(page),
    new ScrapePageTool(page),
    new CaptureScreenshotTool(page),
    new GetPageInfoTool(page),
    new WaitForNavigationTool(page),
  ];
};
