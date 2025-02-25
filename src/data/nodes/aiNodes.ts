
import { FlowNode } from '@/types/flow';
import { Brain } from 'lucide-react';

export const aiNodes: FlowNode[] = [
  {
    type: 'ai-action',
    label: 'AI Action',
    description: 'Execute actions using natural language',
    color: '#FF6B6B',
    icon: Brain,
    settings: {
      action: '',
      description: 'Describe what you want to do in natural language'
    }
  },
  {
    type: "generate-person",
    label: "Generate Person",
    description: "Generates complete person data with multiple output points",
    color: "#6366F1",
    icon: "UserRound",
    settings: {
      gender: "",
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
