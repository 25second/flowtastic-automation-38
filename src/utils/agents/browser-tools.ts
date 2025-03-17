
import { Page } from "playwright";
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";

/**
 * Create a tool that allows the agent to navigate to a URL
 */
const createGoToUrlTool = (page: Page) => {
  return new DynamicStructuredTool({
    name: "go_to_url",
    description: "Navigate the browser to a specific URL",
    schema: z.object({
      url: z.string().describe("The URL to navigate to"),
    }),
    func: async ({ url }) => {
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      console.log(`Navigating to: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        return `Successfully navigated to ${url}`;
      } catch (error) {
        console.error(`Error navigating to ${url}:`, error);
        return `Failed to navigate to ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
};

/**
 * Create a tool that allows the agent to click on elements
 */
const createClickTool = (page: Page) => {
  return new DynamicStructuredTool({
    name: "click_element",
    description: "Click on an element identified by CSS selector or text content",
    schema: z.object({
      selector: z.string().describe("CSS selector or text content of the element to click"),
      isSelectorText: z.boolean().optional().describe("If true, will search for elements containing the specified text"),
    }),
    func: async ({ selector, isSelectorText = false }) => {
      try {
        if (isSelectorText) {
          await page.getByText(selector).first().click();
          return `Clicked on element with text "${selector}"`;
        } else {
          await page.click(selector);
          return `Clicked on element with selector "${selector}"`;
        }
      } catch (error) {
        console.error(`Error clicking element:`, error);
        return `Failed to click on element: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  });
};

/**
 * Create tools for browser interaction
 */
export const getBrowserTools = (page: Page) => {
  return [
    createGoToUrlTool(page),
    createClickTool(page),
    // Add more tools as needed
  ];
};
