
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 left-4 z-10">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
    </div>
  );
};
