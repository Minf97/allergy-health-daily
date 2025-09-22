-- Supabase Storage 策略设置脚本
-- 在 Supabase Dashboard > SQL Editor 中运行

-- 删除现有的存储策略（如果存在）
DROP POLICY IF EXISTS "Allow public read access to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to blog-images" ON storage.objects;

-- 为 blog-images 存储桶创建公共访问策略

-- 1. 允许所有人读取 blog-images 存储桶中的文件
CREATE POLICY "Allow public read access to blog-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- 2. 允许所有人上传到 blog-images 存储桶
CREATE POLICY "Allow public upload to blog-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- 3. 允许所有人删除 blog-images 存储桶中的文件（可选）
CREATE POLICY "Allow public delete from blog-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');

-- 4. 允许所有人更新 blog-images 存储桶中的文件（可选）
CREATE POLICY "Allow public update to blog-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- 确保 blog-images 存储桶存在且为公共存储桶
-- 注意：如果存储桶不存在，需要先在 Storage > Create bucket 中创建

-- 检查存储桶是否为公共存储桶
UPDATE storage.buckets 
SET public = true 
WHERE id = 'blog-images';