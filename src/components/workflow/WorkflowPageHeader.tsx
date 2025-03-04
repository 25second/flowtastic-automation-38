import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
interface WorkflowPageHeaderProps {
  onAddWorkflow: () => void;
}
export const WorkflowPageHeader = ({
  onAddWorkflow
}: WorkflowPageHeaderProps) => {
  return <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Workflows</h1>
      
    </div>;
};