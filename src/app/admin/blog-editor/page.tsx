'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { ImageUpload } from '@/components/editor/ImageUpload'
import { BlogFormData, BlogCategory } from '@/types/blog'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { Editor } from '@tiptap/react'

const CACHE_KEY = 'blog-editor-draft'
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

export default function BlogEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const blogId = searchParams.get('id')
  const isEditMode = !!blogId
  
  // Use different cache keys for create vs edit modes
  const cacheKey = isEditMode ? `${CACHE_KEY}-edit-${blogId}` : CACHE_KEY
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: null,
    category_id: '',
    image_url: '',
    image_alt: '',
    read_time: '5 min read',
    status: 'draft'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const editorRef = useRef<Editor | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 加载分类和数据
  useEffect(() => {
    loadCategories()
    if (isEditMode && blogId) {
      loadBlogData(blogId)
    } else {
      loadFromCache()
    }
  }, [blogId])

  // 自动保存
  useEffect(() => {
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current)
    }

    autoSaveRef.current = setInterval(() => {
      saveToCache()
    }, AUTO_SAVE_INTERVAL)

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current)
      }
    }
  }, [formData])

  // 页面卸载时保存到缓存
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToCache()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [formData])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadBlogData = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/blogs/${id}?includeAll=true`)
      if (response.ok) {
        const blog = await response.json()
        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || null,
          category_id: blog.category_id || '',
          image_url: blog.image_url || '',
          image_alt: blog.image_alt || '',
          read_time: blog.read_time || '5 min read',
          status: blog.status || 'draft'
        })
      } else {
        throw new Error('Failed to load blog')
      }
    } catch (error) {
      console.error('Error loading blog:', error)
      alert('Failed to load blog for editing')
      router.push('/admin/blogs')
    } finally {
      setIsLoading(false)
    }
  }

  // 自动生成 slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleContentChange = (content: any) => {
    setFormData(prev => ({ ...prev, content }))
  }

  // 保存到本地存储
  const saveToCache = useCallback(() => {
    // 在编辑模式下不使用缓存功能
    if (isEditMode) return
    
    try {
      const contentToSave = editorRef.current?.getJSON() || formData.content
      const dataToCache = {
        ...formData,
        content: contentToSave,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving to cache:', error)
    }
  }, [formData, cacheKey, isEditMode])

  // 从本地存储加载
  const loadFromCache = useCallback(() => {
    // 在编辑模式下不从缓存加载
    if (isEditMode) return
    
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const cachedData = JSON.parse(cached)
        // 只在有内容时恢复
        if (cachedData.title || cachedData.content) {
          setFormData({
            title: cachedData.title || '',
            slug: cachedData.slug || '',
            excerpt: cachedData.excerpt || '',
            content: cachedData.content || null,
            category_id: cachedData.category_id || '',
            image_url: cachedData.image_url || '',
            image_alt: cachedData.image_alt || '',
            read_time: cachedData.read_time || '5 min read',
            status: 'draft'
          })
          if (cachedData.timestamp) {
            setLastSaved(new Date(cachedData.timestamp))
          }
        }
      }
    } catch (error) {
      console.error('Error loading from cache:', error)
    }
  }, [cacheKey, isEditMode])

  // 清除缓存
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey)
      setLastSaved(null)
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }, [cacheKey])

  // 手动保存草稿
  const handleSaveDraft = useCallback(() => {
    if (isEditMode) {
      alert('Changes are automatically saved when editing. Use "Save Changes" to persist updates.')
    } else {
      saveToCache()
      alert('Draft saved locally!')
    }
  }, [saveToCache, isEditMode])

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleSave = async (status: 'draft' | 'published') => {
    // 从编辑器获取最新内容
    const currentContent = editorRef.current?.getJSON() || formData.content
    const updatedFormData = { ...formData, content: currentContent }

    // 验证表单
    const newErrors: Record<string, string> = {}

    if (!updatedFormData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!updatedFormData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(updatedFormData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (!updatedFormData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    if (!updatedFormData.content) {
      newErrors.content = 'Content is required'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSaving(true)

    try {
      const blogData = {
        ...updatedFormData,
        status,
        category_id: updatedFormData.category_id || null
      }

      let response
      if (isEditMode && blogId) {
        // 更新现有博客
        response = await fetch(`/api/blogs/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blogData),
        })
      } else {
        // 创建新博客
        response = await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blogData),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save blog')
      }

      const result = await response.json()
      
      // 保存成功后清除缓存 (只在非编辑模式下)
      if (!isEditMode) {
        clearCache()
      }
      
      const action = isEditMode ? 'updated' : (status === 'published' ? 'published' : 'saved')
      alert(`Blog ${action} successfully!`)
      
      // 重定向到博客详情页或列表页
      if (status === 'published' && !isEditMode) {
        router.push(`/blog/${result.slug}`)
      } else {
        // 重定向到管理页面
        router.push('/admin/blogs')
      }
    } catch (error: any) {
      console.error('Error saving blog:', error)
      alert(error.message || 'Failed to save blog')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-gray-600">
                {isEditMode ? 'Update your blog article' : 'Write and publish a new blog article'}
              </p>
            </div>
            <div className="text-right">
              {lastSaved && !isEditMode && (
                <p className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Save Draft Locally
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter blog title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /blog/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-dark ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="url-friendly-slug"
                />
              </div>
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the blog post"
              />
              {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
            </div>

            {/* Category and Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="5 min read"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />
              {formData.image_url && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.image_alt}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_alt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <SimpleEditor 
                initialContent={formData.content}
                onEditorReady={(editor) => {
                  editorRef.current = editor
                }}
                onChange={handleContentChange}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : isEditMode ? 'Update & Publish' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}