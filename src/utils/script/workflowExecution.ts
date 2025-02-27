
import { Edge } from '@xyflow/react';
import { FlowNodeWithData } from '@/types/flow';
import { processNode } from '../nodeProcessors';

export const generateWorkflowExecutionCode = (nodes: FlowNodeWithData[], edges: Edge[]) => {
  // Предварительно отфильтруем ноды
  const generatePersonNodes = nodes.filter(node => node.type === 'generate-person');
  const remainingNodes = nodes.filter(node => node.type !== 'generate-person');
  const startNodes = remainingNodes.filter(node => !edges.some(edge => edge.target === node.id));
  
  return `
async function main() {
  const results = [];
  
  try {
    console.log('Starting workflow execution...');
    
    await connectToBrowser();
    global.browser = browser;
    global.context = context;
    global.page = page;
    
    // Execute generate-person nodes first
    console.log('Executing generate-person nodes...');
    
    ${generatePersonNodes
      .map(node => `
        try {
          console.log('Executing generate-person node: ${node.id}');
          // Используем faker для генерации данных
          const { faker } = require('@faker-js/faker');
          
          // Получаем настройки генерации
          const settings = ${JSON.stringify(node.data?.settings || {})};
          console.log('Generation settings:', settings);
          
          // Настраиваем локаль и страну если указаны
          ${node.data?.settings?.country ? 
            `faker.location.setDefaultSetup({ country: '${node.data.settings.country}' });` : 
            ''}
          
          // Генерируем только выбранные поля
          const selectedOutputs = ${JSON.stringify(node.data?.settings?.selectedOutputs || [])};
          console.log('Selected outputs:', selectedOutputs);
          
          const personData = {};
          
          if (selectedOutputs.includes('firstName')) {
            personData.firstName = faker.person.firstName(${
              node.data?.settings?.gender === 'male' ? 
                '{ sex: "male" }' : 
              node.data?.settings?.gender === 'female' ? 
                '{ sex: "female" }' : 
                ''
            });
          }
          
          if (selectedOutputs.includes('lastName')) {
            personData.lastName = faker.person.lastName();
          }
          
          if (selectedOutputs.includes('email') && selectedOutputs.includes('firstName') && selectedOutputs.includes('lastName')) {
            personData.email = \`\${personData.firstName}.\${personData.lastName}\${faker.number.int(99)}@${node.data?.settings?.emailDomain || 'example.com'}\`;
          }
          
          if (selectedOutputs.includes('phone')) {
            personData.phone = faker.phone.number();
          }
          
          if (selectedOutputs.includes('password')) {
            personData.password = faker.internet.password({ length: 12, memorable: true });
          }
          
          if (selectedOutputs.includes('username')) {
            personData.username = faker.internet.userName();
          }

          // Сохраняем сгенерированные данные
          if (!global.nodeOutputs) {
            global.nodeOutputs = {};
          }
          global.nodeOutputs['${node.id}'] = personData;
          
          console.log('Generated person data:', personData);
          console.log('Current global.nodeOutputs:', global.nodeOutputs);
          
          results.push({ nodeId: '${node.id}', success: true });
        } catch (error) {
          console.error('Generate-person node execution error:', error);
          results.push({ nodeId: '${node.id}', success: false, error: error.message });
          throw error;
        }
      `)
      .join('\n')}
    
    // Execute remaining nodes in order
    const processedNodes = new Set();
    
    const traverse = async (nodeId) => {
      if (processedNodes.has(nodeId)) return;
      processedNodes.add(nodeId);
      
      try {
        global.page = pageStore.getCurrentPage();
        
        ${remainingNodes
          .map(node => {
            // Находим все входящие соединения для текущей ноды
            const nodeConnections = edges
              .filter(edge => edge.target === node.id)
              .map(edge => ({
                sourceNode: nodes.find(n => n.id === edge.source),
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle
              }));

            return `
              if (nodeId === '${node.id}') {
                console.log('Executing node: ${node.type}');
                ${processNode(node, nodeConnections)}
                results.push({ nodeId: '${node.id}', success: true });
                
                // Process child nodes
                ${edges
                  .filter(edge => edge.source === node.id)
                  .map(edge => `await traverse('${edge.target}');`)
                  .join('\n')}
              }
            `;
          })
          .join('\n')}
      } catch (error) {
        console.error('Node execution error:', error);
        results.push({ nodeId: nodeId, success: false, error: error.message });
        throw error;
      }
    };
    
    // Start from initial nodes
    ${startNodes
      .map(node => `await traverse('${node.id}');`)
      .join('\n')}
    
    return { success: true, results };
  } catch (error) {
    console.error('Workflow execution error:', error);
    return { success: false, error: error.message, results };
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Successfully disconnected from browser');
      } catch (error) {
        console.error('Error disconnecting from browser:', error);
      }
    }
  }
}`;
};
