
import { useState } from "react";
import type { Task } from "@/types/task";

export function useTaskLogs() {
  const [selectedTaskLogs, setSelectedTaskLogs] = useState<{ id: string; logs: string[] } | null>(null);

  const generateLogs = (task: Task) => {
    return [
      `[${new Date().toISOString()}] === Task Execution Start ===`,
      `[${new Date().toISOString()}] Task ID: ${task.id}`,
      `[${new Date().toISOString()}] Task Name: ${task.name}`,
      `[${new Date().toISOString()}] Status: ${task.status}`,
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] === Browser Sessions ===`,
      ...task.browser_sessions.map(session => 
        `[${new Date().toISOString()}] Session ${session.id}: ${session.type} (Port: ${session.port || 'N/A'})`
      ),
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] === Server Configuration ===`,
      ...task.servers.map(server => 
        `[${new Date().toISOString()}] Server: ${server}`
      ),
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] === Workflow Execution Details ===`,
      `[${new Date().toISOString()}] 1. Initializing browser automation`,
      `[${new Date().toISOString()}] • Connecting to browser via WebSocket endpoint`,
      `[${new Date().toISOString()}] • Setting up Puppeteer configuration`,
      `[${new Date().toISOString()}] • Establishing connection with remote debugging port`,
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] 2. Executing workflow steps`,
      `[${new Date().toISOString()}] • Loading initial page`,
      `[${new Date().toISOString()}] • Setting up page event listeners`,
      `[${new Date().toISOString()}] • Injecting custom JavaScript context`,
      `[${new Date().toISOString()}] • Running workflow node operations`,
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] 3. Network activity`,
      `[${new Date().toISOString()}] • Intercepting network requests`,
      `[${new Date().toISOString()}] • Monitoring WebSocket connections`,
      `[${new Date().toISOString()}] • Handling response data`,
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] 4. Resource management`,
      `[${new Date().toISOString()}] • Memory usage monitoring`,
      `[${new Date().toISOString()}] • CPU utilization tracking`,
      `[${new Date().toISOString()}] • Connection pool status`,
      `[${new Date().toISOString()}] `,
      `[${new Date().toISOString()}] === Execution Result ===`,
      `[${new Date().toISOString()}] Status: ${task.status}`,
      `[${new Date().toISOString()}] Start Time: ${task.start_time || 'Immediate'}`,
      `[${new Date().toISOString()}] Repeat Count: ${task.repeat_count}`,
      `[${new Date().toISOString()}] Last Updated: ${task.updated_at}`,
    ];
  };

  const handleViewLogs = (task: Task) => {
    const logs = generateLogs(task);
    setSelectedTaskLogs({ id: task.id, logs });
  };

  return {
    selectedTaskLogs,
    handleViewLogs,
    closeLogs: () => setSelectedTaskLogs(null)
  };
}
