
export const availableOutputs = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'middleName', label: 'Middle Name' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'address', label: 'Address' },
  { id: 'streetAddress', label: 'Street Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'country', label: 'Country' },
  { id: 'zipCode', label: 'Zip Code' },
  { id: 'coordinates', label: 'Coordinates' },
  { id: 'timezone', label: 'Timezone' },
  { id: 'birthDate', label: 'Birth Date' },
  { id: 'age', label: 'Age' },
  { id: 'nationality', label: 'Nationality' },
  { id: 'occupation', label: 'Occupation' },
  { id: 'username', label: 'Username' },
  { id: 'password', label: 'Password' }
];

export const settingOptions = {
  gender: ['male', 'female', 'any'],
  nationality: ['US', 'UK', 'CA', 'AU', 'FR', 'DE', 'ES', 'IT', 'BR', 'RU'],
  country: ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'Spain', 'Italy', 'Brazil', 'Russia']
};

export const defaultMathSettings = {
  'math-add': { value1: 0, value2: 0 },
  'math-subtract': { value1: 0, value2: 0 },
  'math-multiply': { value1: 0, value2: 0 },
  'math-divide': { value1: 0, value2: 0 },
  'math-random': { min: 0, max: 100 }
};
