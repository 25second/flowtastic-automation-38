
import { FlowNode } from '@/types/flow';

export const dataGenerationNodes: FlowNode[] = [
  {
    type: "generate-person",
    label: "Generate Person",
    description: "Generates complete person data with multiple output points",
    color: "#6366F1",
    icon: "UserRound",
    settings: {
      gender: "male" as "male" | "female",
      nationality: "",
      country: "",
      emailDomain: "",
      selectedOutputs: ['firstName', 'lastName', 'email', 'phone']
    },
    outputs: [
      { id: "firstName", label: "First Name" },
      { id: "lastName", label: "Last Name" },
      { id: "middleName", label: "Middle Name" },
      { id: "email", label: "Email" },
      { id: "phone", label: "Phone" },
      { id: "address", label: "Address" },
      { id: "country", label: "Country" },
      { id: "zipCode", label: "Zip Code" },
      { id: "coordinates", label: "Coordinates" }
    ]
  }
];
