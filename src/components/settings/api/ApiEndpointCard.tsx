
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiEndpointCardProps {
  name: string;
  description: string;
  endpoint: string;
  method: string;
}

export function ApiEndpointCard({ name, description, endpoint, method }: ApiEndpointCardProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(endpoint);
    toast({
      title: t('app.copied'),
      description: "API endpoint copied to clipboard",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              {method}
            </span>
            <code className="text-xs break-all">{endpoint}</code>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleCopyEndpoint}
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
