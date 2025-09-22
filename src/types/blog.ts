// Supabase 数据库类型定义
export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: any // Tiptap JSON
          html_content: string | null
          category_id: string | null
          image_url: string | null
          image_alt: string | null
          read_time: string
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: any
          html_content?: string | null
          category_id?: string | null
          image_url?: string | null
          image_alt?: string | null
          read_time?: string
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: any
          html_content?: string | null
          category_id?: string | null
          image_url?: string | null
          image_alt?: string | null
          read_time?: string
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// 博客相关类型
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: any // Tiptap JSON
  html_content: string | null
  category: BlogCategory | null
  category_id: string | null
  image_url: string | null
  image_alt: string | null
  read_time: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

// API 响应类型
export interface BlogsResponse {
  blogs: BlogPost[]
  total: number
  page: number
  pageSize: number
}

// 创建/编辑博客的表单数据
export interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: any // Tiptap JSON
  category_id: string
  image_url?: string
  image_alt?: string
  read_time: string
  status: 'draft' | 'published'
}