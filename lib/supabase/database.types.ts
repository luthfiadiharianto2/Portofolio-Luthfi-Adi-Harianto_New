// File ini dibuat otomatis oleh supabase/types/generate.ts dari supabase/migrations.
// Jangan diedit langsung. Jalankan `pnpm db:types` setelah mengubah migrasi.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string;
          title: Json;
          detail: Json;
          icon: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          title: Json;
          detail: Json;
          icon: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          title?: Json;
          detail?: Json;
          icon?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          email: string;
          created_at: string;
        };
        Insert: {
          email: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title: Json;
          issuer: string;
          year: number;
          image_path: string | null;
          credential_url: string | null;
          sort_order: number;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          title: Json;
          issuer: string;
          year: number;
          image_path?: string | null;
          credential_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          title?: Json;
          issuer?: string;
          year?: number;
          image_path?: string | null;
          credential_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: Json;
          period: Json;
          icon: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: Json;
          period: Json;
          icon: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: Json;
          period?: Json;
          icon?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          title: Json;
          place: Json;
          period: Json;
          description: Json;
          sort_order: number;
        };
        Insert: {
          id?: string;
          title: Json;
          place: Json;
          period: Json;
          description: Json;
          sort_order?: number;
        };
        Update: {
          id?: string;
          title?: Json;
          place?: Json;
          period?: Json;
          description?: Json;
          sort_order?: number;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          id: string;
          name: string;
          message: string;
          avatar_path: string | null;
          ip_hash: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          message: string;
          avatar_path?: string | null;
          ip_hash: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          message?: string;
          avatar_path?: string | null;
          ip_hash?: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          body: string;
          ip_hash: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          body: string;
          ip_hash: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          body?: string;
          ip_hash?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          role: Json;
          organization: string;
          period: Json;
          description: Json;
          sort_order: number;
        };
        Insert: {
          id?: string;
          role: Json;
          organization: string;
          period: Json;
          description: Json;
          sort_order?: number;
        };
        Update: {
          id?: string;
          role?: Json;
          organization?: string;
          period?: Json;
          description?: Json;
          sort_order?: number;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          path: string;
          alt: Json;
          sort_order: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          path: string;
          alt: Json;
          sort_order?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          path?: string;
          alt?: Json;
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
          id: string;
          project_id: string;
          title: Json;
          description: Json;
          sort_order: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: Json;
          description: Json;
          sort_order?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: Json;
          description?: Json;
          sort_order?: number;
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
          id: string;
          slug: string;
          category: Database["public"]["Enums"]["project_category"];
          color: string;
          thumbnail: string;
          title: string;
          label: Json;
          tagline: Json;
          description: Json;
          features: Json;
          technologies: string[];
          demo_url: string | null;
          repo_url: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          category: Database["public"]["Enums"]["project_category"];
          color: string;
          thumbnail: string;
          title: string;
          label: Json;
          tagline: Json;
          description: Json;
          features: Json;
          technologies?: string[];
          demo_url?: string | null;
          repo_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          category?: Database["public"]["Enums"]["project_category"];
          color?: string;
          thumbnail?: string;
          title?: string;
          label?: Json;
          tagline?: Json;
          description?: Json;
          features?: Json;
          technologies?: string[];
          demo_url?: string | null;
          repo_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_stats: {
        Row: {
          id: number;
          visits: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          visits?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          visits?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          category: Json;
          icon: string;
          items: string[];
          sort_order: number;
        };
        Insert: {
          id?: string;
          category: Json;
          icon: string;
          items?: string[];
          sort_order?: number;
        };
        Update: {
          id?: string;
          category?: Json;
          icon?: string;
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
      increment_visit: {
        Args: never;
        Returns: number;
      };
    };
    Enums: {
      project_category: "uiux" | "web" | "data" | "qa";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
