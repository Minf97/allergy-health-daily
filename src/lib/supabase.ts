import { createClient } from '@supabase/supabase-js'
import { Database, BlogPost } from '@/types/blog'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Admin client (for server-side operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Blog-related Supabase utility functions
export const blogService = {
  // Get all published blogs
  async getPublishedBlogs(page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('blogs')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      blogs: data || [],
      total: count || 0,
      page,
      pageSize
    }
  },

  // Get blog by slug
  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw error
    }
    return data as BlogPost
  },

  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get blogs by category
  async getBlogsByCategory(categorySlug: string, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('blogs')
      .select(`
        *,
        category:blog_categories!inner(*)
      `)
      .eq('status', 'published')
      .eq('category.slug', categorySlug)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      blogs: data || [],
      total: count || 0,
      page,
      pageSize
    }
  }
}

// Admin blog operations (requires authentication)
export const adminBlogService = {
  // Create blog
  async createBlog(blogData: Database['public']['Tables']['blogs']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert(blogData)
      .select(`
        *,
        category:blog_categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Update blog
  async updateBlog(id: string, blogData: Database['public']['Tables']['blogs']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select(`
        *,
        category:blog_categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Delete blog
  async deleteBlog(id: string) {
    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get all blogs (including drafts)
  async getAllBlogs(page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabaseAdmin
      .from('blogs')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      blogs: data || [],
      total: count || 0,
      page,
      pageSize
    }
  },

  // Get blog by ID (including drafts)
  async getBlogById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}

// Storage-related utilities
export const storageService = {
  // Upload image
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    return data
  },

  // Get image public URL
  getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(path)

    return data.publicUrl
  },

  // Delete image
  async deleteImage(path: string) {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([path])

    if (error) throw error
  }
}