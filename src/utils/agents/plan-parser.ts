
import { v4 as uuidv4 } from 'uuid';
import { AgentStep } from './types';

/**
 * Parses a plan text from LLM into structured steps
 */
export const parsePlanIntoSteps = (planText: string): AgentStep[] => {
  // Simple regex to extract numbered steps
  const stepRegex = /(\d+)[.)\s]+(.+?)(?=\s*\d+[.)\s]+|$)/gs;
  const steps: AgentStep[] = [];
  
  let match;
  while ((match = stepRegex.exec(planText)) !== null) {
    const stepDescription = match[2].trim();
    steps.push({
      id: uuidv4(),
      description: stepDescription,
      status: 'pending'
    });
  }
  
  // If no steps were parsed, create a single step with the entire text
  if (steps.length === 0 && planText.trim()) {
    steps.push({
      id: uuidv4(),
      description: planText.trim(),
      status: 'pending'
    });
  }
  
  return steps;
};
