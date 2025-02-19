
export interface Task {
  id: string;
  name: string;
  status: "pending" | "in_process" | "done" | "error";
  startTime: Date;
  endTime: Date | null;
}
