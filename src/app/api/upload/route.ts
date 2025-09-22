import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/supabase'

// POST /api/upload - 上传图片
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // 验证文件大小 (最大 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    // 上传到 Supabase Storage
    await storageService.uploadImage(file, filename)

    // 获取公共 URL
    const publicUrl = storageService.getPublicUrl(filename)

    return NextResponse.json({
      url: publicUrl,
      path: filename,
      filename: filename
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    
    if (error.message?.includes('Duplicate')) {
      return NextResponse.json(
        { error: 'File with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - 删除图片
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    
    if (!path) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    await storageService.deleteImage(path)

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}