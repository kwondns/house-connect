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
      chat_room: {
        Row: {
          created_at: string
          id: string
          last_message: string
          last_message_date: string
          users: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message: string
          last_message_date: string
          users?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string
          last_message_date?: string
          users?: string[] | null
        }
        Relationships: []
      }
      house: {
        Row: {
          bookmark: number
          created_at: string
          deposit_price: number
          describe: string
          district: string
          floor: number
          house_appeal: string[]
          house_img: string[]
          house_size: number
          house_type: number
          id: string
          manage_price: number
          monthly_price: number
          post_title: string
          region: string
          rental_type: number
          representative_img: string
          room_num: number
          temporary: number
          term: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          bookmark: number
          created_at?: string
          deposit_price: number
          describe: string
          district: string
          floor?: number
          house_appeal: string[]
          house_img: string[]
          house_size: number
          house_type: number
          id?: string
          manage_price: number
          monthly_price: number
          post_title: string
          region: string
          rental_type: number
          representative_img: string
          room_num: number
          temporary: number
          term: number[]
          updated_at?: string
          user_id?: string
        }
        Update: {
          bookmark?: number
          created_at?: string
          deposit_price?: number
          describe?: string
          district?: string
          floor?: number
          house_appeal?: string[]
          house_img?: string[]
          house_size?: number
          house_type?: number
          id?: string
          manage_price?: number
          monthly_price?: number
          post_title?: string
          region?: string
          rental_type?: number
          representative_img?: string
          room_num?: number
          temporary?: number
          term?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_user_id_fkey2"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_lifestyle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_user_id_fkey3"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_mate_style"
            referencedColumns: ["id"]
          },
        ]
      }
      house_comment: {
        Row: {
          content: string
          created_at: string
          house_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          house_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          house_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_commet_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_commet_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      house_reply: {
        Row: {
          comment_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_reply_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "house_comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_reply_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_room_id: string
          created_at: string
          from_user: string
          id: string
          message: string
        }
        Insert: {
          chat_room_id?: string
          created_at?: string
          from_user?: string
          id?: string
          message: string
        }
        Update: {
          chat_room_id?: string
          created_at?: string
          from_user?: string
          id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          avatar: string | null
          birth: number | null
          created_at: string
          email: string | null
          gender: number
          id: string
          name: string
          nickname: string | null
          status: number
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          birth?: number | null
          created_at?: string
          email?: string | null
          gender?: number
          id: string
          name: string
          nickname?: string | null
          status?: number
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          birth?: number | null
          created_at?: string
          email?: string | null
          gender?: number
          id?: string
          name?: string
          nickname?: string | null
          status?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          category: number
          content: string
          content_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: number
          content: string
          content_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: number
          content?: string
          content_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_alarm: {
        Row: {
          alarm_by_who: string
          alarm_content: string
          alarm_type: number
          created_at: string
          id: string
          is_checked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          alarm_by_who: string
          alarm_content: string
          alarm_type: number
          created_at?: string
          id?: string
          is_checked: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          alarm_by_who?: string
          alarm_content?: string
          alarm_type?: number
          created_at?: string
          id?: string
          is_checked?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alarm_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_alarm_setting: {
        Row: {
          chat_alarm_1: boolean
          created_at: string
          house_alarm_1: boolean
          house_alarm_2: boolean
          house_alarm_3: boolean
          id: string
          lounge_alarm_1: boolean
          lounge_alarm_2: boolean
          updated_at: string
        }
        Insert: {
          chat_alarm_1: boolean
          created_at?: string
          house_alarm_1: boolean
          house_alarm_2: boolean
          house_alarm_3: boolean
          id: string
          lounge_alarm_1: boolean
          lounge_alarm_2: boolean
          updated_at?: string
        }
        Update: {
          chat_alarm_1?: boolean
          created_at?: string
          house_alarm_1?: boolean
          house_alarm_2?: boolean
          house_alarm_3?: boolean
          id?: string
          lounge_alarm_1?: boolean
          lounge_alarm_2?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alarm_setting_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_block: {
        Row: {
          block_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          block_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_block_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bookmark: {
        Row: {
          created_at: string
          house_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          house_id: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          house_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmark_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmark_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_chat: {
        Row: {
          chat_id: string
          id: string
          last_read: string
        }
        Insert: {
          chat_id: string
          id?: string
          last_read?: string
        }
        Update: {
          chat_id?: string
          id?: string
          last_read?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chat_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat_room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chat_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_friend: {
        Row: {
          created_at: string
          friend_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          friend_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_friend_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_friend_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_house_status: {
        Row: {
          created_at: string
          house_id: string
          house_status: number
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          house_id?: string
          house_status?: number
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          house_id?: string
          house_status?: number
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_house_status_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lifestyle: {
        Row: {
          appeals: string[] | null
          created_at: string
          id: string
          pet: number
          smoking: boolean
          updated_at: string | null
        }
        Insert: {
          appeals?: string[] | null
          created_at?: string
          id: string
          pet: number
          smoking: boolean
          updated_at?: string | null
        }
        Update: {
          appeals?: string[] | null
          created_at?: string
          id?: string
          pet?: number
          smoking?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lifestyle_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lifestyle_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_looking_house: {
        Row: {
          created_at: string
          deposit_price: number[]
          id: string
          monthly_rental_price: number[]
          regions: string[] | null
          rental_type: number
          term: number[]
          type: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deposit_price: number[]
          id: string
          monthly_rental_price: number[]
          regions?: string[] | null
          rental_type: number
          term: number[]
          type: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deposit_price?: number[]
          id?: string
          monthly_rental_price?: number[]
          regions?: string[] | null
          rental_type?: number
          term?: number[]
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_looking_house_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_looking_house_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mate_style: {
        Row: {
          created_at: string
          id: string
          mate_appeals: string[] | null
          mate_gender: number
          mate_number: number
          prefer_mate_age: number[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id: string
          mate_appeals?: string[] | null
          mate_gender: number
          mate_number: number
          prefer_mate_age?: number[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mate_appeals?: string[] | null
          mate_gender?: number
          mate_number?: number
          prefer_mate_age?: number[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mate_style_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mate_style_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_send_friend: {
        Row: {
          created_at: string
          from_id: string
          id: string
          to_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_id: string
          id?: string
          to_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_id?: string
          id?: string
          to_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_send_friend_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_send_friend_to_id_fkey"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_theme: {
        Row: {
          created_at: string
          font_size: number
          id: string
          languague: number
          theme: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          font_size: number
          id: string
          languague: number
          theme: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          font_size?: number
          id?: string
          languague?: number
          theme?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_theme_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
