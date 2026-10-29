export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          detail: Json;
          icon: string;
          id: string;
          sort_order: number;
          title: Json;
        };
        Insert: {
          detail: Json;
          icon: string;
          id?: string;
          sort_order?: number;
          title: Json;
        };
        Update: {
          detail?: Json;
          icon?: string;
          id?: string;
          sort_order?: number;
          title?: Json;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          created_at: string;
          email: string;
        };
        Insert: {
          created_at?: string;
          email: string;
        };
        Update: {
          created_at?: string;
          email?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          credential_url: string | null;
          id: string;
          image_path: string | null;
          is_published: boolean;
          issuer: string;
          sort_order: number;
          title: Json;
          year: number;
        };
        Insert: {
          credential_url?: string | null;
          id?: string;
          image_path?: string | null;
          is_published?: boolean;
          issuer: string;
          sort_order?: number;
          title: Json;
          year: number;
        };
        Update: {
          credential_url?: string | null;
          id?: string;
          image_path?: string | null;
          is_published?: boolean;
          issuer?: string;
          sort_order?: number;
          title?: Json;
          year?: number;
        };
        Relationships: [];
      };
      education: {
        Row: {
          degree: Json;
          icon: string;
          id: string;
          institution: string;
          period: Json;
          sort_order: number;
        };
        Insert: {
          degree: Json;
          icon: string;
          id?: string;
          institution: string;
          period: Json;
          sort_order?: number;
        };
        Update: {
          degree?: Json;
          icon?: string;
          id?: string;
          institution?: string;
          period?: Json;
          sort_order?: number;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          description: Json;
          id: string;
          period: Json;
          place: Json;
          sort_order: number;
          title: Json;
        };
        Insert: {
          description: Json;
          id?: string;
          period: Json;
          place: Json;
          sort_order?: number;
          title: Json;
        };
        Update: {
          description?: Json;
          id?: string;
          period?: Json;
          place?: Json;
          sort_order?: number;
          title?: Json;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          id: string;
          ip_hash: string;
          is_approved: boolean;
          message: string;
          name: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at?: string;
          id?: string;
          ip_hash: string;
          is_approved?: boolean;
          message: string;
          name: string;
        };
        Update: {
          avatar_path?: string | null;
          created_at?: string;
          id?: string;
          ip_hash?: string;
          is_approved?: boolean;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          body: string;
          created_at: string;
          email: string;
          id: string;
          ip_hash: string;
          is_read: boolean;
          name: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          email: string;
          id?: string;
          ip_hash: string;
          is_read?: boolean;
          name: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          email?: string;
          id?: string;
          ip_hash?: string;
          is_read?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          description: Json;
          id: string;
          organization: string;
          period: Json;
          role: Json;
          sort_order: number;
        };
        Insert: {
          description: Json;
          id?: string;
          organization: string;
          period: Json;
          role: Json;
          sort_order?: number;
        };
        Update: {
          description?: Json;
          id?: string;
          organization?: string;
          period?: Json;
          role?: Json;
          sort_order?: number;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          alt: Json;
          id: string;
          path: string;
          project_id: string;
          sort_order: number;
        };
        Insert: {
          alt: Json;
          id?: string;
          path: string;
          project_id: string;
          sort_order?: number;
        };
        Update: {
          alt?: Json;
          id?: string;
          path?: string;
          project_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_steps: {
        Row: {
          description: Json;
          id: string;
          project_id: string;
          sort_order: number;
          title: Json;
        };
        Insert: {
          description: Json;
          id?: string;
          project_id: string;
          sort_order?: number;
          title: Json;
        };
        Update: {
          description?: Json;
          id?: string;
          project_id?: string;
          sort_order?: number;
          title?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "project_steps_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          category: Database["public"]["Enums"]["project_category"];
          color: string;
          created_at: string;
          demo_url: string | null;
          description: Json;
          features: Json;
          id: string;
          is_published: boolean;
          label: Json;
          repo_url: string | null;
          slug: string;
          sort_order: number;
          tagline: Json;
          technologies: string[];
          thumbnail: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["project_category"];
          color: string;
          created_at?: string;
          demo_url?: string | null;
          description: Json;
          features: Json;
          id?: string;
          is_published?: boolean;
          label: Json;
          repo_url?: string | null;
          slug: string;
          sort_order?: number;
          tagline: Json;
          technologies?: string[];
          thumbnail: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["project_category"];
          color?: string;
          created_at?: string;
          demo_url?: string | null;
          description?: Json;
          features?: Json;
          id?: string;
          is_published?: boolean;
          label?: Json;
          repo_url?: string | null;
          slug?: string;
          sort_order?: number;
          tagline?: Json;
          technologies?: string[];
          thumbnail?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_stats: {
        Row: {
          id: number;
          updated_at: string;
          visits: number;
        };
        Insert: {
          id?: number;
          updated_at?: string;
          visits?: number;
        };
        Update: {
          id?: number;
          updated_at?: string;
          visits?: number;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category: Json;
          icon: string;
          id: string;
          items: string[];
          sort_order: number;
        };
        Insert: {
          category: Json;
          icon: string;
          id?: string;
          items?: string[];
          sort_order?: number;
        };
        Update: {
          category?: Json;
          icon?: string;
          id?: string;
          items?: string[];
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_visit: { Args: never; Returns: number };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      project_category: "uiux" | "web" | "data" | "qa";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      project_category: ["uiux", "web", "data", "qa"],
    },
  },
} as const;
