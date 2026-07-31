// Hand-written to match supabase/migrations/20260101000000_init.sql exactly.
//
// `supabase gen types typescript --linked` currently returns an empty schema
// for this project — the Management API's schema cache hasn't caught up with
// the migration yet. Once it does, regenerate the canonical version with:
//   npx supabase gen types typescript --linked --schema public > types/database.types.ts
// and diff against this file before replacing it.

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
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "customer" | "student" | "teacher" | "school_admin" | "staff" | "admin";
          phone: string | null;
          phone_verified: boolean;
          city: string | null;
          province: string | null;
          address: string | null;
          avatar_url: string | null;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "customer" | "student" | "teacher" | "school_admin" | "staff" | "admin";
          phone?: string | null;
          phone_verified?: boolean;
          city?: string | null;
          province?: string | null;
          address?: string | null;
          avatar_url?: string | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          province: string | null;
          contact_person: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          verified: boolean;
          billing_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city?: string | null;
          province?: string | null;
          contact_person?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          verified?: boolean;
          billing_address?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
        Relationships: [];
      };
      school_members: {
        Row: { school_id: string; user_id: string; role_in_school: string | null };
        Insert: { school_id: string; user_id: string; role_in_school?: string | null };
        Update: Partial<Database["public"]["Tables"]["school_members"]["Insert"]>;
        Relationships: [];
      };
      classrooms: {
        Row: {
          id: string;
          teacher_id: string | null;
          school_id: string | null;
          name: string | null;
          grade_level: string | null;
          join_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id?: string | null;
          school_id?: string | null;
          name?: string | null;
          grade_level?: string | null;
          join_code?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["classrooms"]["Insert"]>;
        Relationships: [];
      };
      classroom_students: {
        Row: { classroom_id: string; student_id: string; joined_at: string };
        Insert: { classroom_id: string; student_id: string; joined_at?: string };
        Update: Partial<Database["public"]["Tables"]["classroom_students"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string | null;
          name: string | null;
          name_ur: string | null;
          description: string | null;
          parent_id: string | null;
          color: string | null;
          order_index: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          name?: string | null;
          name_ur?: string | null;
          description?: string | null;
          parent_id?: string | null;
          color?: string | null;
          order_index?: number;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string | null;
          sku: string | null;
          name: string | null;
          name_ur: string | null;
          short_description: string | null;
          short_description_ur: string | null;
          long_description: string | null;
          long_description_ur: string | null;
          category_id: string | null;
          brand: string | null;
          product_type: "physical" | "digital" | null;
          price_pkr: number | null;
          compare_at_price_pkr: number | null;
          cost_pkr: number | null;
          weight_grams: number | null;
          cover_image: string | null;
          gallery: string[] | null;
          specs: Json | null;
          components: Json | null;
          age_min: number | null;
          age_max: number | null;
          grade_tags: string[] | null;
          difficulty: "beginner" | "intermediate" | "advanced" | null;
          featured: boolean;
          is_bestseller: boolean;
          is_new: boolean;
          inventory_count: number;
          low_stock_threshold: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          og_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          sku?: string | null;
          name?: string | null;
          name_ur?: string | null;
          short_description?: string | null;
          short_description_ur?: string | null;
          long_description?: string | null;
          long_description_ur?: string | null;
          category_id?: string | null;
          brand?: string | null;
          product_type?: "physical" | "digital" | null;
          price_pkr?: number | null;
          compare_at_price_pkr?: number | null;
          cost_pkr?: number | null;
          weight_grams?: number | null;
          cover_image?: string | null;
          gallery?: string[] | null;
          specs?: Json | null;
          components?: Json | null;
          age_min?: number | null;
          age_max?: number | null;
          grade_tags?: string[] | null;
          difficulty?: "beginner" | "intermediate" | "advanced" | null;
          featured?: boolean;
          is_bestseller?: boolean;
          is_new?: boolean;
          inventory_count?: number;
          low_stock_threshold?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      digital_files: {
        Row: {
          id: string;
          product_id: string | null;
          file_name: string | null;
          file_path: string | null;
          file_size_bytes: number | null;
          file_type: string | null;
          is_preview: boolean;
          order_index: number;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          file_name?: string | null;
          file_path?: string | null;
          file_size_bytes?: number | null;
          file_type?: string | null;
          is_preview?: boolean;
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["digital_files"]["Insert"]>;
        Relationships: [];
      };
      product_bundles: {
        Row: { bundle_id: string; included_product_id: string; discount_percent: number };
        Insert: { bundle_id: string; included_product_id: string; discount_percent?: number };
        Update: Partial<Database["public"]["Tables"]["product_bundles"]["Insert"]>;
        Relationships: [];
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["carts"]["Insert"]>;
        Relationships: [];
      };
      cart_items: {
        Row: { cart_id: string; product_id: string; quantity: number; price_at_add_pkr: number | null };
        Insert: { cart_id: string; product_id: string; quantity: number; price_at_add_pkr?: number | null };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string | null;
          user_id: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          guest_access_token: string;
          status:
            | "pending"
            | "phone_confirmed"
            | "payment_pending"
            | "paid"
            | "dispatched"
            | "delivered"
            | "completed"
            | "cancelled"
            | "refunded";
          payment_method: "cod" | "bank_transfer" | "invoice" | "stripe" | "telr" | "jazzcash" | null;
          payment_reference: string | null;
          subtotal_pkr: number | null;
          discount_pkr: number;
          discount_code: string | null;
          delivery_fee_pkr: number | null;
          total_pkr: number | null;
          currency: string;
          shipping_name: string | null;
          shipping_phone: string | null;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_province: string | null;
          notes: string | null;
          courier: string | null;
          tracking_number: string | null;
          is_school_order: boolean;
          school_id: string | null;
          po_number: string | null;
          internal_notes: string | null;
          confirmed_at: string | null;
          dispatched_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string | null;
          user_id?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          guest_access_token?: string;
          status?:
            | "pending"
            | "phone_confirmed"
            | "payment_pending"
            | "paid"
            | "dispatched"
            | "delivered"
            | "completed"
            | "cancelled"
            | "refunded";
          payment_method?: "cod" | "bank_transfer" | "invoice" | "stripe" | "telr" | "jazzcash" | null;
          payment_reference?: string | null;
          subtotal_pkr?: number | null;
          discount_pkr?: number;
          discount_code?: string | null;
          delivery_fee_pkr?: number | null;
          total_pkr?: number | null;
          currency?: string;
          shipping_name?: string | null;
          shipping_phone?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_province?: string | null;
          notes?: string | null;
          courier?: string | null;
          tracking_number?: string | null;
          is_school_order?: boolean;
          school_id?: string | null;
          po_number?: string | null;
          internal_notes?: string | null;
          confirmed_at?: string | null;
          dispatched_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          product_id: string | null;
          product_type: string | null;
          product_name_snapshot: string | null;
          quantity: number | null;
          unit_price_pkr: number | null;
          unit_cost_pkr: number | null;
          line_total_pkr: number | null;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          product_id?: string | null;
          product_type?: string | null;
          product_name_snapshot?: string | null;
          quantity?: number | null;
          unit_price_pkr?: number | null;
          unit_cost_pkr?: number | null;
          line_total_pkr?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      order_status_log: {
        Row: {
          id: string;
          order_id: string | null;
          from_status: string | null;
          to_status: string | null;
          actor_id: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          from_status?: string | null;
          to_status?: string | null;
          actor_id?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_status_log"]["Insert"]>;
        Relationships: [];
      };
      digital_grants: {
        Row: {
          id: string;
          user_id: string | null;
          product_id: string | null;
          order_id: string | null;
          granted_at: string;
          download_count: number;
          max_downloads: number;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          product_id?: string | null;
          order_id?: string | null;
          granted_at?: string;
          download_count?: number;
          max_downloads?: number;
        };
        Update: Partial<Database["public"]["Tables"]["digital_grants"]["Insert"]>;
        Relationships: [];
      };
      download_log: {
        Row: {
          id: string;
          grant_id: string | null;
          file_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          grant_id?: string | null;
          file_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          downloaded_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["download_log"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string | null;
          title: string | null;
          title_ur: string | null;
          description: string | null;
          description_ur: string | null;
          category: string | null;
          difficulty: string | null;
          duration_weeks: number | null;
          price_pkr: number | null;
          cover_image: string | null;
          intro_video_url: string | null;
          instructor_name: string | null;
          instructor_bio: string | null;
          instructor_photo: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          title?: string | null;
          title_ur?: string | null;
          description?: string | null;
          description_ur?: string | null;
          category?: string | null;
          difficulty?: string | null;
          duration_weeks?: number | null;
          price_pkr?: number | null;
          cover_image?: string | null;
          intro_video_url?: string | null;
          instructor_name?: string | null;
          instructor_bio?: string | null;
          instructor_photo?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      course_lessons: {
        Row: {
          id: string;
          course_id: string | null;
          order_index: number | null;
          title: string | null;
          content_md: string | null;
          video_url: string | null;
          duration_minutes: number | null;
          is_free_preview: boolean;
        };
        Insert: {
          id?: string;
          course_id?: string | null;
          order_index?: number | null;
          title?: string | null;
          content_md?: string | null;
          video_url?: string | null;
          duration_minutes?: number | null;
          is_free_preview?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["course_lessons"]["Insert"]>;
        Relationships: [];
      };
      course_enrollments: {
        Row: {
          user_id: string;
          course_id: string;
          enrolled_at: string;
          completed_at: string | null;
          progress_percent: number;
        };
        Insert: {
          user_id: string;
          course_id: string;
          enrolled_at?: string;
          completed_at?: string | null;
          progress_percent?: number;
        };
        Update: Partial<Database["public"]["Tables"]["course_enrollments"]["Insert"]>;
        Relationships: [];
      };
      service_inquiries: {
        Row: {
          id: string;
          service_type: string | null;
          school_name: string | null;
          contact_name: string | null;
          contact_role: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          city: string | null;
          student_count: number | null;
          grade_levels: string[] | null;
          interests: string[] | null;
          preferred_demo_at: string | null;
          message: string | null;
          status: string;
          assigned_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_type?: string | null;
          school_name?: string | null;
          contact_name?: string | null;
          contact_role?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          city?: string | null;
          student_count?: number | null;
          grade_levels?: string[] | null;
          interests?: string[] | null;
          preferred_demo_at?: string | null;
          message?: string | null;
          status?: string;
          assigned_to?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["service_inquiries"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          attribution: string;
          school_id: string | null;
          context: "home" | "schools" | "course";
          is_published: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          attribution: string;
          school_id?: string | null;
          context?: "home" | "schools" | "course";
          is_published?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
      wishlists: {
        Row: { user_id: string; product_id: string; added_at: string };
        Insert: { user_id: string; product_id: string; added_at?: string };
        Update: Partial<Database["public"]["Tables"]["wishlists"]["Insert"]>;
        Relationships: [];
      };
      product_reviews: {
        Row: {
          id: string;
          product_id: string | null;
          user_id: string | null;
          rating: number | null;
          title: string | null;
          body: string | null;
          is_verified_purchase: boolean;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          user_id?: string | null;
          rating?: number | null;
          title?: string | null;
          body?: string | null;
          is_verified_purchase?: boolean;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_reviews"]["Insert"]>;
        Relationships: [];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string | null;
          discount_type: "percent" | "fixed" | null;
          amount: number | null;
          min_order_pkr: number | null;
          max_uses: number | null;
          used_count: number;
          valid_from: string | null;
          valid_until: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          code?: string | null;
          discount_type?: "percent" | "fixed" | null;
          amount?: number | null;
          min_order_pkr?: number | null;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string | null;
          valid_until?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["discount_codes"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string | null;
          title: string | null;
          excerpt: string | null;
          cover_image: string | null;
          category: string | null;
          author_name: string | null;
          author_photo: string | null;
          content_md: string | null;
          read_minutes: number | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          title?: string | null;
          excerpt?: string | null;
          cover_image?: string | null;
          category?: string | null;
          author_name?: string | null;
          author_photo?: string | null;
          content_md?: string | null;
          read_minutes?: number | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
