
import { useState } from 'react';
import { toast } from 'sonner';

export const useWorkflowListState = (workflows: any[] | undefined, onDelete?: (ids: string[]) => void) => {
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkflows = workflows?.filter(workflow => {
    if (!workflow) return false;

    const searchLower = searchQuery.toLowerCase();
    const name = workflow.name?.toLowerCase() || '';
    const description = workflow.description?.toLowerCase() || '';
    const tags = workflow.tags || [];

    const matchesSearch = 
      name.includes(searchLower) || 
      description.includes(searchLower) || 
      tags.some((tag: string) => tag.toLowerCase().includes(searchLower));
    
    return matchesSearch;
  });

  const filteredByCategory = (categoryId: string | null) => {
    return filteredWorkflows?.filter(workflow => {
      return !categoryId || workflow.category === categoryId;
    });
  };

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows?.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows?.map(w => w.id) || []);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedWorkflows.length === 0) {
      toast.error("Please select workflows to delete");
      return;
    }
    onDelete?.(selectedWorkflows);
    setSelectedWorkflows([]);
  };

  return {
    selectedWorkflows,
    searchQuery,
    setSearchQuery,
    filteredWorkflows,
    filteredByCategory,
    handleSelectAll,
    handleSelect,
    handleBulkDelete
  };
};
