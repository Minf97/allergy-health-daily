import { NextRequest, NextResponse } from 'next/server'
import { blogService, adminBlogService } from '@/lib/supabase'
import { BlogFormData } from '@/types/blog'

interface RouteParams {
  params: { id: string }
}

// GET /api/blogs/[id] - 获取单个博客
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('includeAll') === 'true'

    let result

    if (includeAll) {
      // 管理员获取 (包括草稿)
      result = await adminBlogService.getBlogById(id)
    } else {
      // 公开获取 (只有已发布的)
      result = await blogService.getBlogBySlug(id) // 这里假设传入的是 slug
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[id] - 更新博客
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const body: Partial<BlogFormData> = await request.json()

    // 准备更新数据
    const updateData: any = {}
    
    if (body.title) updateData.title = body.title
    if (body.slug) updateData.slug = body.slug
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content) updateData.content = body.content
    if (body.category_id !== undefined) updateData.category_id = body.category_id
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.image_alt !== undefined) updateData.image_alt = body.image_alt
    if (body.read_time) updateData.read_time = body.read_time
    if (body.status) updateData.status = body.status

    const result = await adminBlogService.updateBlog(id, updateData)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error updating blog:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[id] - 删除博客
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    await adminBlogService.deleteBlog(id)

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}