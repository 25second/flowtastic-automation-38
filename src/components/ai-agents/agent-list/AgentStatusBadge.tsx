
import React from 'react';

interface AgentStatusBadgeProps {
  status: 'idle' | 'running' | 'completed' | 'error';
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'running' 
        ? 'bg-orange-100 text-orange-700'
        : status === 'completed'
        ? 'bg-[#D3E4FD] text-blue-700' 
        : status === 'error'
        ? 'bg-red-100 text-red-700'
        : 'bg-[#F2FCE2] text-green-700'
    }`}>
      {status === 'running' && (
        <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
