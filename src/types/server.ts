
export interface Server {
  id: string;
  url: string;
  name: string | null;
  is_active: boolean;
  last_status_check: string | null;
  last_status_check_success: boolean;
}

export interface Browser {
  port: number;
  name: string;
  type: string;
}
