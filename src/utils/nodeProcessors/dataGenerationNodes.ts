
import { FlowNodeWithData } from '@/types/flow';
import { fakerEN } from '@faker-js/faker';

export const processGeneratePersonNode = (node: FlowNodeWithData): string => {
  const settings = node.data.settings || {};
  const faker = fakerEN;

  return `
    try {
      // Generate person data
      const gender = '${settings.gender || 'male'}';
      const personData = {
        firstName: faker.person.firstName(gender),
        lastName: faker.person.lastName(),
        middleName: faker.person.middleName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
        coordinates: \`\${faker.location.latitude()},\${faker.location.longitude()}\`
      };

      // Store generated data in global context
      global.nodeOutputs['${node.id}'] = personData;
      
      console.log('Generated person data:', personData);
    } catch (error) {
      console.error('Error generating person data:', error);
      throw error;
    }
  `;
};
