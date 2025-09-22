/**
 * 测试博客编辑器功能
 * 运行方式: node scripts/test-blog-editor.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmobofxsmijpgwrrftsf.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtb2JvZnhzbWlqcGd3cnJmdHNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1NjU5NiwiZXhwIjoyMDc0MDMyNTk2fQ.aVOqBKrglts5CKivS5qM_9Pq08TwN3petFlbFavL7Ts'

// 创建 Supabase Admin 客户端
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testBlogEditor() {
  console.log('🧪 Testing blog editor functionality...')

  try {
    // 1. 测试获取分类
    console.log('📂 Testing categories API...')
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('blog_categories')
      .select('*')

    if (categoriesError) {
      throw categoriesError
    }

    console.log(`  ✅ Found ${categories.length} categories:`)
    categories.forEach(cat => {
      console.log(`     - ${cat.name} (${cat.slug})`)
    })

    // 2. 测试创建测试博客
    console.log('📝 Testing blog creation...')
    
    const testBlog = {
      title: 'Test Blog from Editor',
      slug: 'test-blog-from-editor-' + Date.now(),
      excerpt: 'This is a test blog created from the editor',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Test Blog Title' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'This is a test paragraph with some content.' }]
          }
        ]
      },
      category_id: categories[0]?.id || null,
      read_time: '2 min read',
      status: 'published'
    }

    const { data: newBlog, error: blogError } = await supabaseAdmin
      .from('blogs')
      .insert(testBlog)
      .select('*')
      .single()

    if (blogError) {
      throw blogError
    }

    console.log(`  ✅ Created test blog: "${newBlog.title}"`)
    console.log(`     - ID: ${newBlog.id}`)
    console.log(`     - Slug: ${newBlog.slug}`)
    console.log(`     - Status: ${newBlog.status}`)

    // 3. 测试获取博客
    console.log('📖 Testing blog retrieval...')
    const { data: retrievedBlog, error: retrieveError } = await supabaseAdmin
      .from('blogs')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('id', newBlog.id)
      .single()

    if (retrieveError) {
      throw retrieveError
    }

    console.log(`  ✅ Retrieved blog: "${retrievedBlog.title}"`)
    console.log(`     - Category: ${retrievedBlog.category?.name || 'None'}`)
    console.log(`     - Content type: ${typeof retrievedBlog.content}`)

    // 4. 测试更新博客
    console.log('✏️  Testing blog update...')
    const { data: updatedBlog, error: updateError } = await supabaseAdmin
      .from('blogs')
      .update({ 
        title: 'Updated Test Blog from Editor',
        status: 'draft'
      })
      .eq('id', newBlog.id)
      .select('*')
      .single()

    if (updateError) {
      throw updateError
    }

    console.log(`  ✅ Updated blog: "${updatedBlog.title}"`)
    console.log(`     - Status: ${updatedBlog.status}`)

    // 5. 清理 - 删除测试博客
    console.log('🗑️  Cleaning up test blog...')
    const { error: deleteError } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', newBlog.id)

    if (deleteError) {
      throw deleteError
    }

    console.log(`  ✅ Deleted test blog`)

    console.log('🎉 All blog editor tests passed!')

  } catch (error) {
    console.error('💥 Test failed:', error)
    process.exit(1)
  }
}

// 运行测试
testBlogEditor()
  .then(() => {
    console.log('✨ Blog editor test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Blog editor test failed:', error)
    process.exit(1)
  })