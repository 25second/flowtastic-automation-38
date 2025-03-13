
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { AIProviderConfig } from '@/hooks/admin/ai-providers/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OpenAIProviderFormProps {
  config: AIProviderConfig;
  onChange: (config: AIProviderConfig) => void;
  onSave: (provider: AIProviderConfig) => Promise<void>;
  isSubmitting: boolean;
}

export function OpenAIProviderForm({ 
  config, 
  onChange, 
  onSave, 
  isSubmitting 
}: OpenAIProviderFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="openai-api-key">OpenAI API Key</Label>
        <Input 
          id="openai-api-key" 
          type="password"
          value={config.api_key} 
          onChange={(e) => onChange({...config, api_key: e.target.value})}
          placeholder="sk-..." 
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Enter your OpenAI API key to use models like GPT-4o, GPT-4o-mini.
        </p>
      </div>
      
      <div>
        <Label htmlFor="openai-model">Model</Label>
        <Select 
          value={config.model || 'gpt-4o-mini'} 
          onValueChange={(value) => onChange({...config, model: value})}
        >
          <SelectTrigger id="openai-model" className="w-full">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          Select the OpenAI model to use for AI tasks
        </p>
      </div>
      
      <Button 
        onClick={() => onSave(config)} 
        disabled={isSubmitting || !config.api_key}
        className="mt-4"
      >
        <Save className="mr-2 h-4 w-4" />
        Save OpenAI Configuration
      </Button>
    </div>
  );
}
