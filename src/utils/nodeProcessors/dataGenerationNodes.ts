
import { FlowNodeWithData } from '@/types/flow';
import { fakerEN, fakerDE, fakerES, fakerFR, fakerIT, fakerRU, fakerJA, fakerKO, fakerZH_CN } from '@faker-js/faker';

const getFakerInstance = (locale?: string) => {
  switch (locale?.toLowerCase()) {
    case 'de': return fakerDE;
    case 'es': return fakerES;
    case 'fr': return fakerFR;
    case 'it': return fakerIT;
    case 'ru': return fakerRU;
    case 'ja': return fakerJA;
    case 'ko': return fakerKO;
    case 'zh': return fakerZH_CN;
    default: return fakerEN;
  }
};

export const processGeneratePersonNode = (node: FlowNodeWithData) => {
  const settings = node.data.settings || {};
  const faker = getFakerInstance(settings.nationality);

  const gender = settings.gender || faker.person.sex();
  const firstName = faker.person.firstName(gender as 'male' | 'female');
  const lastName = faker.person.lastName();
  const middleName = faker.person.middleName();
  const phone = settings.country ? 
    `+${faker.phone.number({ style: 'international' })}` : 
    faker.phone.number({ style: 'national' });
  const email = settings.emailDomain ? 
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${settings.emailDomain}` :
    faker.internet.email({ firstName, lastName });
  const country = settings.country || faker.location.country();
  const address = faker.location.streetAddress({ useFullAddress: true });
  const zipCode = faker.location.zipCode();
  const coordinates = {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude()
  };

  return `
    // Generate person data variables
    global.generatedPerson = {
      firstName: "${firstName}",
      lastName: "${lastName}",
      middleName: "${middleName}",
      phone: "${phone}",
      email: "${email}",
      country: "${country}",
      address: "${address}",
      zipCode: "${zipCode}",
      coordinates: ${JSON.stringify(coordinates)},
      gender: "${gender}"
    };
    
    // Set individual output variables
    global.generatedPersonFirstName = "${firstName}";
    global.generatedPersonLastName = "${lastName}";
    global.generatedPersonMiddleName = "${middleName}";
    global.generatedPersonPhone = "${phone}";
    global.generatedPersonEmail = "${email}";
    global.generatedPersonCountry = "${country}";
    global.generatedPersonAddress = "${address}";
    global.generatedPersonZipCode = "${zipCode}";
    global.generatedPersonCoordinates = ${JSON.stringify(coordinates)};
    global.generatedPersonGender = "${gender}";
    
    console.log('Generated person data:', global.generatedPerson);`;
};
