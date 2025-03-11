
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { AIProviderConfig } from '@/hooks/admin/types';

interface AnthropicProviderFormProps {
  config: AIProviderConfig;
  onChange: (config: AIProviderConfig) => void;
  onSave: (provider: AIProviderConfig) => Promise<void>;
  isSubmitting: boolean;
}

export function AnthropicProviderForm({ 
  config, 
  onChange, 
  onSave, 
  isSubmitting 
}: AnthropicProviderFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
        <Input 
          id="anthropic-api-key" 
          type="password"
          value={config.api_key} 
          onChange={(e) => onChange({...config, api_key: e.target.value})}
          placeholder="sk-ant-..." 
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Enter your Anthropic API key to use Claude models.
        </p>
      </div>
      <Button 
        onClick={() => onSave(config)} 
        disabled={isSubmitting || !config.api_key}
        className="mt-4"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Anthropic Configuration
      </Button>
    </div>
  );
}
