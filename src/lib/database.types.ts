export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string | null
        }
        Insert: {
          id: string
          username: string
          email: string
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          email?: string
          created_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          icon: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color: string
          icon?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string | null
          user_id?: string | null
          created_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          title: string
          amount: number
          type: string
          date: string
          category_id: string | null
          user_id: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          amount: number
          type: string
          date: string
          category_id?: string | null
          user_id?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          type?: string
          date?: string
          category_id?: string | null
          user_id?: string | null
          notes?: string | null
          created_at?: string | null
        }
      }
      budgets: {
        Row: {
          id: string
          month: number
          year: number
          amount: number
          category_id: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          month: number
          year: number
          amount: number
          category_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          month?: number
          year?: number
          amount?: number
          category_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
      }
    }
  }
}