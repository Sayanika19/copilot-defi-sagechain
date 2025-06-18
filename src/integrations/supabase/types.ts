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
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          intent: string | null
          requires_web3: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          intent?: string | null
          requires_web3?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          intent?: string | null
          requires_web3?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          description: string | null
          id: string
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      cross_chain_transactions: {
        Row: {
          amount: number
          asset_id: string
          bridge_fee: number | null
          confirmed_at: string | null
          created_at: string
          from_chain_id: string | null
          gas_fee: number | null
          id: string
          status: string
          to_chain_id: string | null
          transaction_hash: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          asset_id: string
          bridge_fee?: number | null
          confirmed_at?: string | null
          created_at?: string
          from_chain_id?: string | null
          gas_fee?: number | null
          id?: string
          status?: string
          to_chain_id?: string | null
          transaction_hash?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_id?: string
          bridge_fee?: number | null
          confirmed_at?: string | null
          created_at?: string
          from_chain_id?: string | null
          gas_fee?: number | null
          id?: string
          status?: string
          to_chain_id?: string | null
          transaction_hash?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_chain_transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "lending_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_chain_transactions_from_chain_id_fkey"
            columns: ["from_chain_id"]
            isOneToOne: false
            referencedRelation: "supported_chains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cross_chain_transactions_to_chain_id_fkey"
            columns: ["to_chain_id"]
            isOneToOne: false
            referencedRelation: "supported_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_assets: {
        Row: {
          borrowing_apy: number
          chain_id: string
          created_at: string
          decimals: number
          id: string
          is_active: boolean
          lending_apy: number
          max_ltv: number
          token_address: string
          token_name: string
          token_symbol: string
        }
        Insert: {
          borrowing_apy?: number
          chain_id: string
          created_at?: string
          decimals?: number
          id?: string
          is_active?: boolean
          lending_apy?: number
          max_ltv?: number
          token_address: string
          token_name: string
          token_symbol: string
        }
        Update: {
          borrowing_apy?: number
          chain_id?: string
          created_at?: string
          decimals?: number
          id?: string
          is_active?: boolean
          lending_apy?: number
          max_ltv?: number
          token_address?: string
          token_name?: string
          token_symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "lending_assets_chain_id_fkey"
            columns: ["chain_id"]
            isOneToOne: false
            referencedRelation: "supported_chains"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_positions: {
        Row: {
          accrued_interest: number
          amount: number
          apy_rate: number
          asset_id: string
          created_at: string
          id: string
          initial_amount: number
          position_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accrued_interest?: number
          amount?: number
          apy_rate: number
          asset_id: string
          created_at?: string
          id?: string
          initial_amount?: number
          position_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accrued_interest?: number
          amount?: number
          apy_rate?: number
          asset_id?: string
          created_at?: string
          id?: string
          initial_amount?: number
          position_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lending_positions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "lending_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          content: string
          course_id: string
          id: string
          order: number
          title: string
          "video-url": string
        }
        Insert: {
          content: string
          course_id?: string
          id?: string
          order: number
          title: string
          "video-url": string
        }
        Update: {
          content?: string
          course_id?: string
          id?: string
          order?: number
          title?: string
          "video-url"?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          correct_answer: number
          id: string
          module_id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          id?: string
          module_id?: string
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          id?: string
          module_id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          request_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          endpoint: string
          id?: string
          request_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          endpoint?: string
          id?: string
          request_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      supported_chains: {
        Row: {
          chain_id: number
          chain_name: string
          created_at: string
          explorer_url: string
          id: string
          is_active: boolean
          native_token: string
          rpc_url: string
        }
        Insert: {
          chain_id: number
          chain_name: string
          created_at?: string
          explorer_url: string
          id?: string
          is_active?: boolean
          native_token: string
          rpc_url: string
        }
        Update: {
          chain_id?: number
          chain_name?: string
          created_at?: string
          explorer_url?: string
          id?: string
          is_active?: boolean
          native_token?: string
          rpc_url?: string
        }
        Relationships: []
      }
      user_portfolio: {
        Row: {
          asset_id: string
          available_balance: number
          id: string
          last_updated: string
          locked_balance: number
          user_id: string
        }
        Insert: {
          asset_id: string
          available_balance?: number
          id?: string
          last_updated?: string
          locked_balance?: number
          user_id: string
        }
        Update: {
          asset_id?: string
          available_balance?: number
          id?: string
          last_updated?: string
          locked_balance?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolio_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "lending_assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
