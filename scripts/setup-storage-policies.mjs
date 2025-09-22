/**
 * 设置 Supabase Storage 访问策略
 * 运行方式: node scripts/setup-storage-policies.mjs
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

const BUCKET_NAME = 'blog-images'

async function setupStoragePolicies() {
  console.log('🚀 Setting up Supabase Storage policies...')

  try {
    // 1. 确保存储桶存在
    console.log('📂 Checking storage bucket...')
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`)
    }

    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)

    if (!bucketExists) {
      console.log(`📦 Creating storage bucket: ${BUCKET_NAME}`)
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/*']
      })

      if (createBucketError) {
        throw new Error(`Failed to create bucket: ${createBucketError.message}`)
      }
      console.log(`  ✅ Created bucket: ${BUCKET_NAME}`)
    } else {
      console.log(`  ✅ Bucket "${BUCKET_NAME}" already exists`)
    }

    // 2. 删除现有的策略（如果存在）
    console.log('🗑️  Removing existing policies...')
    
    const existingPolicies = [
      'Allow public uploads to blog-images',
      'Allow public access to blog-images',
      'Allow public read access to blog-images',
      'Allow public upload to blog-images'
    ]

    for (const policyName of existingPolicies) {
      try {
        const { error } = await supabaseAdmin.rpc('drop_storage_policy', {
          policy_name: policyName,
          bucket_name: BUCKET_NAME
        })
        if (!error) {
          console.log(`  ✅ Removed policy: ${policyName}`)
        }
      } catch (e) {
        // Policy might not exist, continue
      }
    }

    // 3. 创建新的访问策略
    console.log('📋 Creating storage policies...')

    // 允许所有人读取 blog-images 存储桶中的文件
    const { error: readPolicyError } = await supabaseAdmin.rpc('create_storage_policy', {
      policy_name: 'Allow public read access to blog-images',
      bucket_name: BUCKET_NAME,
      definition: 'true',
      operation: 'SELECT'
    })

    if (readPolicyError) {
      console.error('Error creating read policy:', readPolicyError)
    } else {
      console.log('  ✅ Created read policy')
    }

    // 允许所有人上传到 blog-images 存储桶
    const { error: uploadPolicyError } = await supabaseAdmin.rpc('create_storage_policy', {
      policy_name: 'Allow public upload to blog-images',
      bucket_name: BUCKET_NAME,
      definition: 'true',
      operation: 'INSERT'
    })

    if (uploadPolicyError) {
      console.error('Error creating upload policy:', uploadPolicyError)
    } else {
      console.log('  ✅ Created upload policy')
    }

    // 允许所有人删除 blog-images 存储桶中的文件
    const { error: deletePolicyError } = await supabaseAdmin.rpc('create_storage_policy', {
      policy_name: 'Allow public delete from blog-images',
      bucket_name: BUCKET_NAME,
      definition: 'true',
      operation: 'DELETE'
    })

    if (deletePolicyError) {
      console.error('Error creating delete policy:', deletePolicyError)
    } else {
      console.log('  ✅ Created delete policy')
    }

    console.log('🎉 Storage policies setup completed successfully!')

    // 4. 验证设置
    console.log('🔍 Verifying setup...')
    
    // 测试上传一个小文件
    const testContent = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]) // PNG header
    const testFile = new File([testContent], 'test.png', { type: 'image/png' })
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload('test-file.png', testFile, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('  ❌ Upload test failed:', uploadError)
    } else {
      console.log('  ✅ Upload test successful')
      
      // 清理测试文件
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove(['test-file.png'])
      console.log('  ✅ Test file cleaned up')
    }

  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

// 运行设置
setupStoragePolicies()
  .then(() => {
    console.log('✨ Storage setup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Storage setup script failed:', error)
    process.exit(1)
  })