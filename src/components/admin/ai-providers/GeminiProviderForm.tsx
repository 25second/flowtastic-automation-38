
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { AIProviderConfig } from '@/hooks/admin/ai-providers/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeminiProviderFormProps {
  config: AIProviderConfig;
  onChange: (config: AIProviderConfig) => void;
  onSave: (provider: AIProviderConfig) => Promise<void>;
  isSubmitting: boolean;
}

export function GeminiProviderForm({ 
  config, 
  onChange, 
  onSave, 
  isSubmitting 
}: GeminiProviderFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="gemini-api-key">Gemini API Key</Label>
        <Input 
          id="gemini-api-key" 
          type="password"
          value={config.api_key} 
          onChange={(e) => onChange({...config, api_key: e.target.value})}
          placeholder="AIza..." 
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Enter your Google Gemini API key to use models like Gemini Pro.
        </p>
      </div>
      
      <div>
        <Label htmlFor="gemini-model">Model</Label>
        <Select 
          value={config.model || 'gemini-pro'} 
          onValueChange={(value) => onChange({...config, model: value})}
        >
          <SelectTrigger id="gemini-model" className="w-full">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          Select the Gemini model to use for AI tasks
        </p>
      </div>
      
      <Button 
        onClick={() => onSave(config)} 
        disabled={isSubmitting || !config.api_key}
        className="mt-4"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Gemini Configuration
      </Button>
    </div>
  );
}
