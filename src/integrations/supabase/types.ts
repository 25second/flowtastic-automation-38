export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      active_sessions: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          last_active: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_active?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          last_active?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          ai_provider: string | null
          category_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_favorite: boolean | null
          model: string | null
          name: string
          script: string | null
          status: string | null
          table_id: string | null
          take_screenshots: boolean | null
          task_description: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_provider?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          model?: string | null
          name: string
          script?: string | null
          status?: string | null
          table_id?: string | null
          take_screenshots?: boolean | null
          task_description?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_provider?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          model?: string | null
          name?: string
          script?: string | null
          status?: string | null
          table_id?: string | null
          take_screenshots?: boolean | null
          task_description?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "agent_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "custom_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_instances: {
        Row: {
          cost_per_hour: number
          created_at: string
          deploy_started_at: number | null
          gpu_type: string
          id: string
          ip_address: string | null
          name: string
          provider: string
          status: string
          updated_at: string
        }
        Insert: {
          cost_per_hour?: number
          created_at?: string
          deploy_started_at?: number | null
          gpu_type: string
          id?: string
          ip_address?: string | null
          name: string
          provider: string
          status: string
          updated_at?: string
        }
        Update: {
          cost_per_hour?: number
          created_at?: string
          deploy_started_at?: number | null
          gpu_type?: string
          id?: string
          ip_address?: string | null
          name?: string
          provider?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_providers: {
        Row: {
          api_key: string
          created_at: string
          endpoint_url: string | null
          id: string
          is_custom: boolean
          model: string | null
          name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_custom?: boolean
          model?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_custom?: boolean
          model?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      aiproviders: {
        Row: {
          api_key: string
          cost_per_million_tokens: number | null
          created_at: string
          endpoint_url: string | null
          id: string
          is_primary: boolean | null
          model: string | null
          name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          cost_per_million_tokens?: number | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_primary?: boolean | null
          model?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          cost_per_million_tokens?: number | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_primary?: boolean | null
          model?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      custom_tables: {
        Row: {
          category: string | null
          cell_status: Json | null
          columns: Json
          created_at: string
          data: Json
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cell_status?: Json | null
          columns?: Json
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string | null
          cell_status?: Json | null
          columns?: Json
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_tables_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "table_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_instances: {
        Row: {
          created_at: string
          id: string
          instance_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string
          user_id?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_url: string
          referrer: string | null
          time_spent: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_url: string
          referrer?: string | null
          time_spent?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_url?: string
          referrer?: string | null
          time_spent?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          id: string
          is_deleted: boolean | null
          telegram: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          id: string
          is_deleted?: boolean | null
          telegram?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          telegram?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      servers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_status_check: string | null
          last_status_check_success: boolean | null
          name: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_status_check?: string | null
          last_status_check_success?: boolean | null
          name?: string | null
          updated_at?: string
          url: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_status_check?: string | null
          last_status_check_success?: boolean | null
          name?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      shared_resources: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          resource_type: string
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          resource_type: string
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          resource_type?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_resources_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      table_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          browser_sessions: Json
          category: string | null
          color: string
          created_at: string
          id: string
          name: string
          repeat_count: number | null
          run_immediately: boolean
          servers: string[]
          start_time: string | null
          status: Database["public"]["Enums"]["task_status"]
          updated_at: string
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          browser_sessions?: Json
          category?: string | null
          color: string
          created_at?: string
          id?: string
          name: string
          repeat_count?: number | null
          run_immediately?: boolean
          servers?: string[]
          start_time?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          updated_at?: string
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          browser_sessions?: Json
          category?: string | null
          color?: string
          created_at?: string
          id?: string
          name?: string
          repeat_count?: number | null
          run_immediately?: boolean
          servers?: string[]
          start_time?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          updated_at?: string
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_totp_secrets: {
        Row: {
          created_at: string
          id: string
          last_used_at: string | null
          secret: string
          updated_at: string
          user_id: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_used_at?: string | null
          secret: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_used_at?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: []
      }
      vast_ai_keys: {
        Row: {
          api_key: string
          created_at: string | null
          credit: number | null
          id: string
          last_updated: string | null
          total_spend: number | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          credit?: number | null
          id?: string
          last_updated?: string | null
          total_spend?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          credit?: number | null
          id?: string
          last_updated?: string | null
          total_spend?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      workflow_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          edges: Json
          id: string
          is_favorite: boolean | null
          name: string
          nodes: Json
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          edges: Json
          id?: string
          is_favorite?: boolean | null
          name: string
          nodes: Json
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          edges?: Json
          id?: string
          is_favorite?: boolean | null
          name?: string
          nodes?: Json
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_column_if_not_exists: {
        Args: {
          p_table_name: string
          p_column_name: string
          p_column_type: string
        }
        Returns: undefined
      }
      column_exists: {
        Args: {
          p_table_name: string
          p_column_name: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          requested_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_vast_ai_user_info: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      task_status: "pending" | "in_process" | "done" | "error"
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
