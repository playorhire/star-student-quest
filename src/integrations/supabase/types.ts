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
      badges: {
        Row: {
          created_at: string
          description: string | null
          emoji: string
          id: string
          name: string
          required_points: number
          school_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          name: string
          required_points: number
          school_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          name?: string
          required_points?: number
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
          school_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          school_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          school_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          name: string
          school_id: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          name: string
          school_id?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          name?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
          student_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
          student_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      parent_student_links: {
        Row: {
          created_at: string
          id: string
          parent_user_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_user_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_user_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_student_links_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      point_rules: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          max_marks: number | null
          min_marks: number | null
          multiplier: number
          passing_marks: number
          school_id: string | null
          subject_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          max_marks?: number | null
          min_marks?: number | null
          multiplier?: number
          passing_marks?: number
          school_id?: string | null
          subject_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          max_marks?: number | null
          min_marks?: number | null
          multiplier?: number
          passing_marks?: number
          school_id?: string | null
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_rules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_rules_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_rules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: true
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          marks_entered: number
          multiplier: number
          notes: string | null
          passing_marks: number
          points_awarded: number
          reward_id: string | null
          school_id: string | null
          student_id: string
          subject_id: string
          teacher_id: string
          transaction_type: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          marks_entered: number
          multiplier: number
          notes?: string | null
          passing_marks: number
          points_awarded: number
          reward_id?: string | null
          school_id?: string | null
          student_id: string
          subject_id: string
          teacher_id: string
          transaction_type?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          marks_entered?: number
          multiplier?: number
          notes?: string | null
          passing_marks?: number
          points_awarded?: number
          reward_id?: string | null
          school_id?: string | null
          student_id?: string
          subject_id?: string
          teacher_id?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          branch_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          school_id: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      redemptions: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          points_spent: number
          reward_id: string
          school_id: string | null
          status: string
          student_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          points_spent: number
          reward_id: string
          school_id?: string | null
          status?: string
          student_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          points_spent?: number
          reward_id?: string
          school_id?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          branch_id: string | null
          category: string
          created_at: string
          description: string | null
          emoji: string
          id: string
          name: string
          point_cost: number
          school_id: string | null
          stock: number
        }
        Insert: {
          branch_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          name: string
          point_cost: number
          school_id?: string | null
          stock?: number
        }
        Update: {
          branch_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          name?: string
          point_cost?: number
          school_id?: string | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "rewards_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          student_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          student_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_badges_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          avatar_emoji: string
          branch_id: string | null
          class_id: string
          created_at: string
          email: string | null
          id: string
          lifetime_points: number
          name: string
          qr_code: string
          roll_number: string
          school_id: string | null
          section: string
          student_code: string
          total_points: number
          user_id: string | null
        }
        Insert: {
          avatar_emoji?: string
          branch_id?: string | null
          class_id: string
          created_at?: string
          email?: string | null
          id?: string
          lifetime_points?: number
          name: string
          qr_code?: string
          roll_number: string
          school_id?: string | null
          section?: string
          student_code: string
          total_points?: number
          user_id?: string | null
        }
        Update: {
          avatar_emoji?: string
          branch_id?: string | null
          class_id?: string
          created_at?: string
          email?: string | null
          id?: string
          lifetime_points?: number
          name?: string
          qr_code?: string
          roll_number?: string
          school_id?: string | null
          section?: string
          student_code?: string
          total_points?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          branch_id: string | null
          class_id: string
          created_at: string
          id: string
          name: string
          school_id: string | null
        }
        Insert: {
          branch_id?: string | null
          class_id: string
          created_at?: string
          id?: string
          name: string
          school_id?: string | null
        }
        Update: {
          branch_id?: string | null
          class_id?: string
          created_at?: string
          id?: string
          name?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_assignments: {
        Row: {
          branch_id: string | null
          class_id: string
          created_at: string
          id: string
          school_id: string | null
          section: string | null
          subject_id: string
          teacher_id: string
        }
        Insert: {
          branch_id?: string | null
          class_id: string
          created_at?: string
          id?: string
          school_id?: string | null
          section?: string | null
          subject_id: string
          teacher_id: string
        }
        Update: {
          branch_id?: string | null
          class_id?: string
          created_at?: string
          id?: string
          school_id?: string | null
          section?: string | null
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_assignments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          avatar_emoji: string
          branch_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          school_id: string | null
          user_id: string | null
        }
        Insert: {
          avatar_emoji?: string
          branch_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          school_id?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_emoji?: string
          branch_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          school_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          branch_id: string | null
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string | null
          role: Database["public"]["Enums"]["app_role"]
          school_id: string | null
          tenant_role: Database["public"]["Enums"]["tenant_role"] | null
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string | null
          role: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          tenant_role?: Database["public"]["Enums"]["tenant_role"] | null
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          tenant_role?: Database["public"]["Enums"]["tenant_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_branch: { Args: { _branch_id: string }; Returns: boolean }
      belongs_to_school: { Args: { _school_id: string }; Returns: boolean }
      current_user_school_id: { Args: never; Returns: string }
      generate_student_code: { Args: never; Returns: string }
      get_my_branch_id: { Args: never; Returns: string }
      get_my_branch_id_safe: { Args: never; Returns: string }
      get_my_linked_children: {
        Args: never
        Returns: {
          avatar_emoji: string
          branch_name: string
          class_id: string
          class_name: string
          id: string
          name: string
          roll_number: string
          school_name: string
          total_points: number
        }[]
      }
      get_my_primary_role: {
        Args: never
        Returns: Database["public"]["Enums"]["tenant_role"]
      }
      get_my_school_id: { Args: never; Returns: string }
      get_my_school_id_safe: { Args: never; Returns: string }
      get_my_teacher_id: { Args: never; Returns: string }
      get_my_tenant_role: { Args: never; Returns: string }
      get_parents_for_branch_admin: {
        Args: { p_branch_id: string }
        Returns: {
          created_at: string
          email: string
          id: string
          linked_students: Json
          name: string
          phone: string
          user_id: string
        }[]
      }
      get_user_branch: { Args: never; Returns: string }
      get_user_role: { Args: never; Returns: string }
      get_user_school: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_tenant_role: { Args: { _role: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_super_admin_safe: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      redeem_reward: {
        Args: {
          p_points_spent: number
          p_reward_id: string
          p_student_id: string
        }
        Returns: Json
      }
      search_student_for_parent: {
        Args: { p_name: string; p_roll: string }
        Returns: {
          already_linked: boolean
          avatar_emoji: string
          branch_name: string
          class_name: string
          id: string
          name: string
          roll_number: string
          school_name: string
        }[]
      }
      update_student_user_id: {
        Args: { new_user_id: string; student_id: string }
        Returns: undefined
      }
      update_teacher_user_id: {
        Args: { new_user_id: string; teacher_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "teacher"
        | "student"
        | "parent"
        | "super_admin"
        | "school_admin"
        | "branch_admin"
      tenant_role:
        | "super_admin"
        | "school_admin"
        | "branch_admin"
        | "teacher"
        | "student"
        | "parent"
      user_role:
        | "super_admin"
        | "school_admin"
        | "branch_admin"
        | "teacher"
        | "student"
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
      app_role: [
        "admin",
        "teacher",
        "student",
        "parent",
        "super_admin",
        "school_admin",
        "branch_admin",
      ],
      tenant_role: [
        "super_admin",
        "school_admin",
        "branch_admin",
        "teacher",
        "student",
        "parent",
      ],
      user_role: [
        "super_admin",
        "school_admin",
        "branch_admin",
        "teacher",
        "student",
      ],
    },
  },
} as const
