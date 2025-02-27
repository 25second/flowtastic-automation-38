
export const generateGlobalStateCode = () => `
const global = {
  browser: null,
  context: null,
  page: null,
  extractedData: null,
  lastApiResponse: null,
  lastScriptResult: null,
  lastTableRead: null,
  nodeOutputs: {},
  getNodeOutput: function(nodeId, output) {
    return this.nodeOutputs[nodeId]?.[output];
  }
};`;
