
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, Trash } from "lucide-react";
import { AIProviderConfig } from '@/hooks/admin/types';

interface CustomProvidersFormProps {
  customProviders: AIProviderConfig[];
  onSave: (provider: AIProviderConfig) => Promise<void>;
  onDelete: (providerId: string) => Promise<void>;
  onAddProvider: (provider: AIProviderConfig) => void;
  isSubmitting: boolean;
}

export function CustomProvidersForm({ 
  customProviders, 
  onSave, 
  onDelete, 
  onAddProvider,
  isSubmitting 
}: CustomProvidersFormProps) {
  const [newCustomProvider, setNewCustomProvider] = useState<AIProviderConfig>({
    name: "",
    api_key: "",
    endpoint_url: "",
    is_custom: true
  });

  const handleAddProvider = () => {
    onAddProvider({ ...newCustomProvider });
    setNewCustomProvider({
      name: "",
      api_key: "",
      endpoint_url: "",
      is_custom: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-medium">Add Custom Provider</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="custom-name">Provider Name</Label>
            <Input 
              id="custom-name" 
              value={newCustomProvider.name} 
              onChange={(e) => setNewCustomProvider({...newCustomProvider, name: e.target.value})}
              placeholder="Custom LLM" 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="custom-api-key">API Key</Label>
            <Input 
              id="custom-api-key" 
              type="password"
              value={newCustomProvider.api_key} 
              onChange={(e) => setNewCustomProvider({...newCustomProvider, api_key: e.target.value})}
              placeholder="Enter API key" 
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="custom-endpoint">Endpoint URL</Label>
            <Input 
              id="custom-endpoint" 
              value={newCustomProvider.endpoint_url} 
              onChange={(e) => setNewCustomProvider({...newCustomProvider, endpoint_url: e.target.value})}
              placeholder="https://api.example.com/v1/chat/completions" 
              className="mt-1"
            />
          </div>
        </div>
        <Button 
          onClick={handleAddProvider} 
          disabled={!newCustomProvider.name || !newCustomProvider.api_key || !newCustomProvider.endpoint_url}
          className="mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>
      
      {customProviders.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Custom Providers</h3>
          {customProviders.map((provider, index) => (
            <Card key={provider.id || index} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-semibold">{provider.name}</h4>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    Endpoint: {provider.endpoint_url}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSave(provider)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => provider.id && onDelete(provider.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-muted-foreground">No custom providers added yet.</p>
        </div>
      )}
    </div>
  );
}
