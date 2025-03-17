import { FlowNodeWithData } from '@/types/flow';
import { processTabNode } from './tabNodes';
import { processKeyboardNode } from './keyboardNodes';
import { processReadTableNode, processWriteTableNode } from './tableNodes';
import { 
  processWaitTimeoutNode,
  processWaitElementNode,
  processWaitElementHiddenNode,
  processWaitFunctionNode,
  processWaitNavigationNode,
  processWaitLoadNode,
  processWaitNetworkIdleNode,
  processWaitDomLoadedNode
} from './timerNodes';
import { 
  processMathAddNode,
  processMathSubtractNode,
  processMathMultiplyNode,
  processMathDivideNode,
  processMathRandomNode
} from './mathNodes';
import { processLinkenSphereStopSessionNode } from './linkenSphereNodes';
import { processAIActionNode, processAIBrowserActionNode } from './aiNodes';
import { processRunScriptNode } from './scriptNodes';
import { processHttpRequestNode } from './apiNodes';
import { processOpenPageNode, processNavigateNode, processCloseTabNode } from './browserNodes';
import { handleJavaScriptNode } from '@/utils/nodeHandlers/javascriptNodes';

export const processNode = (
  node: FlowNodeWithData,
  connections: Array<{
    sourceNode?: FlowNodeWithData;
    sourceHandle?: string | null;
    targetHandle?: string | null;
  }> = []
): string => {
  const { type } = node;

  // Специальная обработка для generate-person ноды
  if (type === 'generate-person') {
    console.log('Processing generate-person node:', node.id);
    return `
      console.log('Executing generate-person node');
      (() => {
        const { faker } = require('@faker-js/faker');
        
        // Настройки генерации
        const gender = '${node.data.settings?.gender || 'male'}';
        const nationality = '${node.data.settings?.nationality || ''}';
        const country = '${node.data.settings?.country || ''}';
        const emailDomain = '${node.data.settings?.emailDomain || ''}';
        
        console.log('Generation settings:', { gender, nationality, country, emailDomain });
        
        // Генерация данных
        const firstName = faker.person.firstName({ sex: gender });
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName, provider: emailDomain || undefined });
        const phone = faker.phone.number();
        
        // Инициализация global.nodeOutputs если не существует
        if (typeof global.nodeOutputs !== 'object' || global.nodeOutputs === null) {
          console.log('Initializing global.nodeOutputs');
          global.nodeOutputs = {};
        }
        
        // Сохраняем данные в global.nodeOutputs
        global.nodeOutputs['${node.id}'] = {
          firstName,
          lastName,
          email,
          phone
        };
        
        console.log('Generated person data:', global.nodeOutputs['${node.id}']);
        console.log('Current global.nodeOutputs:', global.nodeOutputs);
        
        return global.nodeOutputs['${node.id}'];
      })();
    `;
  }

  // Handle different node categories
  if (type?.startsWith('new-tab') || type?.startsWith('switch-tab') || 
      type?.startsWith('wait-for-tab') || type?.startsWith('close-tab') || 
      type?.startsWith('reload-page')) {
    return processTabNode(node);
  }

  if (type?.startsWith('keyboard-')) {
    return processKeyboardNode(node, connections);
  }

  if (type?.startsWith('table-')) {
    if (type === 'table-read') {
      return processReadTableNode(node);
    }
    if (type === 'table-write') {
      return processWriteTableNode(node);
    }
  }

  if (type?.startsWith('wait-')) {
    switch (type) {
      case 'wait-timeout':
        return processWaitTimeoutNode(node);
      case 'wait-element':
        return processWaitElementNode(node);
      case 'wait-element-hidden':
        return processWaitElementHiddenNode(node);
      case 'wait-function':
        return processWaitFunctionNode(node);
      case 'wait-navigation':
        return processWaitNavigationNode(node);
      case 'wait-load':
        return processWaitLoadNode(node);
      case 'wait-network-idle':
        return processWaitNetworkIdleNode(node);
      case 'wait-dom-loaded':
        return processWaitDomLoadedNode(node);
    }
  }

  if (type?.startsWith('math-')) {
    switch (type) {
      case 'math-add':
        return processMathAddNode(node);
      case 'math-subtract':
        return processMathSubtractNode(node);
      case 'math-multiply':
        return processMathMultiplyNode(node);
      case 'math-divide':
        return processMathDivideNode(node);
      case 'math-random':
        return processMathRandomNode(node);
    }
  }

  if (type?.startsWith('linken-sphere-')) {
    if (type === 'linken-sphere-stop-session') {
      return processLinkenSphereStopSessionNode(node);
    }
  }

  if (type?.startsWith('ai-')) {
    if (type === 'ai-action') {
      return processAIActionNode(node);
    }
    if (type === 'ai-browser-action') {
      return processAIBrowserActionNode(node);
    }
  }

  // Add handling for script nodes
  if (type === 'run-script') {
    return processRunScriptNode(node);
  }

  // Add handling for HTTP request nodes
  if (type === 'http-request') {
    return processHttpRequestNode(node);
  }

  // Add handling for browser nodes
  if (type === 'open-page') {
    return processOpenPageNode(node);
  }
  
  if (type === 'navigate') {
    return processNavigateNode(node);
  }
  
  if (type === 'close-tab') {
    return processCloseTabNode();
  }

  // Handle JavaScript nodes
  if (type?.startsWith('js-')) {
    return handleJavaScriptNode(node);
  }

  // Handle unknown node types
  console.warn(`Unknown node type: ${type}`);
  return '';
};
