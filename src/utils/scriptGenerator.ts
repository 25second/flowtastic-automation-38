
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processNode } from './nodeProcessors';
import { generateBrowserConnectionCode } from './script/browserConnection';
import { generatePageStoreCode } from './script/pageStore';
import { generateGlobalStateCode } from './script/globalState';
import { generateWorkflowExecutionCode } from './script/workflowExecution';

export const generateScript = (nodes: FlowNodeWithData[], edges: Edge[], browserPort?: number) => {
  const script = `
const { chromium } = require('playwright');

// Configuration
let browser;
let context;
let page;

${generatePageStoreCode()}

${generateBrowserConnectionCode(browserPort)}

${generateGlobalStateCode()}

${generateWorkflowExecutionCode(nodes, edges)}

// Run the workflow
main()
  .then(result => {
    console.log('Workflow completed:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Workflow failed:', error);
    process.exit(1);
  });`;

  return script;
};
