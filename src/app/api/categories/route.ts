import { NextRequest, NextResponse } from 'next/server'
import { blogService, supabaseAdmin } from '@/lib/supabase'

// GET /api/categories - Get all categories
export async function GET() {
  try {
    console.log('[API /api/categories] Fetching categories')
    console.log('[API /api/categories] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30))

    const categories = await blogService.getCategories()

    console.log('[API /api/categories] Success, returned', categories?.length || 0, 'categories')
    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('[API /api/categories] Error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    return NextResponse.json(
      {
        error: 'Failed to fetch categories',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .trim()

    const { data, error } = await supabaseAdmin
      .from('blog_categories')
      .insert({
        name: body.name as string,
        slug: slug as string
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'A category with this name or slug already exists' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}