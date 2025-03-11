
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { AIProviderConfig } from '@/hooks/admin/types';

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
