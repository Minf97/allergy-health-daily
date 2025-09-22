import { createClient } from '@supabase/supabase-js'
import { Database, BlogPost } from '@/types/blog'

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建 Supabase 客户端
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// 管理员客户端 (用于服务端操作)
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

// 博客相关的 Supabase 工具函数
export const blogService = {
  // 获取所有已发布的博客
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

  // 根据 slug 获取博客
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

  // 获取所有分类
  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // 根据分类获取博客
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

// 管理员博客操作 (需要认证)
export const adminBlogService = {
  // 创建博客
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

  // 更新博客
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

  // 删除博客
  async deleteBlog(id: string) {
    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // 获取所有博客 (包括草稿)
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

  // 根据 ID 获取博客 (包括草稿)
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

// 存储相关工具
export const storageService = {
  // 上传图片
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

  // 获取图片公共 URL
  getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(path)

    return data.publicUrl
  },

  // 删除图片
  async deleteImage(path: string) {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([path])

    if (error) throw error
  }
}