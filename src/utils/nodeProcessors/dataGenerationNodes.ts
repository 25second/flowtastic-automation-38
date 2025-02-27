
import { faker } from '@faker-js/faker';
import { FlowNodeWithData } from '@/types/flow';

export const processDataGenerationNode = (node: FlowNodeWithData): string => {
  const { type, data } = node;
  const settings = data.settings || {};

  switch (type) {
    case 'generate-person':
      return `
        console.log('Executing generate-person node');
        const generationSettings = ${JSON.stringify(settings)};
        console.log('Generation settings:', generationSettings);
        
        // Configure faker based on settings
        ${settings.country ? `faker.location.setDefaultSetup({ country: '${settings.country}' });` : ''}
        
        // Generate only selected outputs
        const selectedOutputs = ${JSON.stringify(settings.selectedOutputs || ['firstName', 'lastName', 'email', 'phone'])};
        console.log('Selected outputs to generate:', selectedOutputs);
        
        const personData = {};
        
        if (selectedOutputs.includes('firstName')) {
          personData.firstName = faker.person.firstName(${settings.gender === 'male' ? "'male'" : settings.gender === 'female' ? "'female'" : undefined});
        }
        if (selectedOutputs.includes('lastName')) {
          personData.lastName = faker.person.lastName();
        }
        if (selectedOutputs.includes('email')) {
          const firstName = personData.firstName || faker.person.firstName();
          const lastName = personData.lastName || faker.person.lastName();
          personData.email = \`\${firstName}.\${lastName}\${faker.number.int(99)}@${settings.emailDomain || 'example.com'}\`;
        }
        if (selectedOutputs.includes('phone')) {
          personData.phone = faker.phone.number();
        }
        if (selectedOutputs.includes('password')) {
          personData.password = faker.internet.password({ length: 12 });
        }
        if (selectedOutputs.includes('username')) {
          personData.username = faker.internet.userName();
        }
        
        console.log('Generated person data:', personData);
        
        // Save to global state
        global.nodeOutputs['${node.id}'] = personData;
        console.log('Current global.nodeOutputs:', global.nodeOutputs);
      `;

    default:
      throw new Error(`Unknown data generation node type: ${type}`);
  }
};
