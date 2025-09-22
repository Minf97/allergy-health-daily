import { NextRequest, NextResponse } from 'next/server'
import { blogService, adminBlogService } from '@/lib/supabase'
import { BlogFormData } from '@/types/blog'

// GET /api/blogs - 获取博客列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status') // admin 用来获取草稿
    const includeAll = searchParams.get('includeAll') === 'true'

    let result

    if (includeAll) {
      // 管理员获取所有博客 (包括草稿)
      result = await adminBlogService.getAllBlogs(page, pageSize)
    } else if (category) {
      // 根据分类获取博客
      result = await blogService.getBlogsByCategory(category, page, pageSize)
    } else {
      // 获取已发布的博客
      result = await blogService.getPublishedBlogs(page, pageSize)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST /api/blogs - 创建新博客
export async function POST(request: NextRequest) {
  try {
    const body: BlogFormData = await request.json()
    
    // 验证必填字段
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // 准备博客数据
    const blogData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      category_id: body.category_id || null,
      image_url: body.image_url || null,
      image_alt: body.image_alt || null,
      read_time: body.read_time || '5 min read',
      status: body.status || 'draft'
    }

    const result = await adminBlogService.createBlog(blogData)

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error creating blog:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}