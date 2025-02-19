
export interface Server {
  id: string;
  name: string | null;
  url: string;
  is_active: boolean;
  last_status_check: string | null;
  last_status_check_success: boolean;
}
