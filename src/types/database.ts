export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          currency: string
          donated_at: string | null
          donor_country: string | null
          donor_name: string | null
          equipment_need_id: string | null
          id: string
          is_public: boolean | null
          is_verified: boolean | null
          payment_provider: string | null
          type: string | null
        }
        Insert: {
          amount: number
          currency: string
          donated_at?: string | null
          donor_country?: string | null
          donor_name?: string | null
          equipment_need_id?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          payment_provider?: string | null
          type?: string | null
        }
        Update: {
          amount?: number
          currency?: string
          donated_at?: string | null
          donor_country?: string | null
          donor_name?: string | null
          equipment_need_id?: string | null
          id?: string
          is_public?: boolean | null
          is_verified?: boolean | null
          payment_provider?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_equipment_need_id_fkey"
            columns: ["equipment_need_id"]
            isOneToOne: false
            referencedRelation: "equipment_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_needs: {
        Row: {
          category: Database["public"]["Enums"]["equipment_category"]
          cover_image_url: string | null
          created_at: string | null
          description_en: string | null
          description_es: string | null
          estimated_cost_mxn: number | null
          estimated_cost_usd: number | null
          featured: boolean | null
          gallery: Json | null
          id: string
          priority: Database["public"]["Enums"]["priority_level"]
          published: boolean | null
          quantity_needed: number
          quantity_received: number | null
          slug: string
          specifications: string | null
          title_en: string
          title_es: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["equipment_category"]
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          estimated_cost_mxn?: number | null
          estimated_cost_usd?: number | null
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          priority: Database["public"]["Enums"]["priority_level"]
          published?: boolean | null
          quantity_needed: number
          quantity_received?: number | null
          slug: string
          specifications?: string | null
          title_en: string
          title_es: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["equipment_category"]
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          estimated_cost_mxn?: number | null
          estimated_cost_usd?: number | null
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          published?: boolean | null
          quantity_needed?: number
          quantity_received?: number | null
          slug?: string
          specifications?: string | null
          title_en?: string
          title_es?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          cover_image_url: string | null
          created_at: string | null
          description_en: string | null
          description_es: string | null
          ends_at: string | null
          gallery: Json | null
          id: string
          location: string | null
          published: boolean | null
          registration_url: string | null
          slug: string
          starts_at: string | null
          title_en: string
          title_es: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          ends_at?: string | null
          gallery?: Json | null
          id?: string
          location?: string | null
          published?: boolean | null
          registration_url?: string | null
          slug: string
          starts_at?: string | null
          title_en: string
          title_es: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          ends_at?: string | null
          gallery?: Json | null
          id?: string
          location?: string | null
          published?: boolean | null
          registration_url?: string | null
          slug?: string
          starts_at?: string | null
          title_en?: string
          title_es?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_name: string | null
          content_en: string | null
          content_es: string | null
          cover_image_url: string | null
          created_at: string | null
          excerpt_en: string | null
          excerpt_es: string | null
          gallery: Json | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title_en: string
          title_es: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          content_en?: string | null
          content_es?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          gallery?: Json | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title_en: string
          title_es: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          content_en?: string | null
          content_es?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          gallery?: Json | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title_en?: string
          title_es?: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          bank_info: Json | null
          contact_email: string | null
          contact_phone: string | null
          emergency_phone: string | null
          id: number
          maps_url: string | null
          social_links: Json | null
          stripe_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bank_info?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          emergency_phone?: string | null
          id?: number
          maps_url?: string | null
          social_links?: Json | null
          stripe_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bank_info?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          emergency_phone?: string | null
          id?: number
          maps_url?: string | null
          social_links?: Json | null
          stripe_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      station_stats: {
        Row: {
          active_volunteers: number | null
          calls_attended: number | null
          community_events: number | null
          created_at: string | null
          id: string
          training_hours: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          active_volunteers?: number | null
          calls_attended?: number | null
          community_events?: number | null
          created_at?: string | null
          id?: string
          training_hours?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          active_volunteers?: number | null
          calls_attended?: number | null
          community_events?: number | null
          created_at?: string | null
          id?: string
          training_hours?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          admin_notes: string | null
          age: number | null
          availability: string | null
          city: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          motivation: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          skills: string[] | null
          status: Database["public"]["Enums"]["volunteer_status"] | null
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          motivation?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["volunteer_status"] | null
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          availability?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          motivation?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["volunteer_status"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      equipment_category:
        | "epp"
        | "tools"
        | "vehicles"
        | "medical"
        | "communications"
        | "station"
        | "other"
      event_type: "fundraiser" | "course" | "community" | "training"
      post_type: "news" | "incident" | "thanks" | "announcement"
      priority_level: "critical" | "high" | "medium" | "low"
      volunteer_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      equipment_category: [
        "epp",
        "tools",
        "vehicles",
        "medical",
        "communications",
        "station",
        "other",
      ],
      event_type: ["fundraiser", "course", "community", "training"],
      post_type: ["news", "incident", "thanks", "announcement"],
      priority_level: ["critical", "high", "medium", "low"],
      volunteer_status: ["pending", "approved", "rejected"],
    },
  },
} as const
