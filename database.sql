-- Supabase 数据库设置脚本
-- 请在 Supabase Dashboard > SQL Editor 中运行

-- 创建博客分类表
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建博客表
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB NOT NULL, -- Tiptap JSON 格式
  html_content TEXT,      -- 渲染后的 HTML (可选，用于 SEO)
  category_id UUID REFERENCES blog_categories(id),
  image_url TEXT,
  image_alt TEXT,
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认分类
INSERT INTO blog_categories (name, slug) VALUES 
  ('Cat Allergies', 'cat-allergies'),
  ('Dog Allergies', 'dog-allergies'),
  ('Dust Mite Allergies', 'dust-mite-allergies'),
  ('Allergy Symptoms', 'allergy-symptoms'),
  ('Air Quality', 'air-quality'),
  ('Allergy Fatigue', 'allergy-fatigue')
ON CONFLICT (slug) DO NOTHING;

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 blogs 表创建触发器
CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON blogs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 为 blog_categories 表创建触发器
CREATE TRIGGER update_blog_categories_updated_at 
  BEFORE UPDATE ON blog_categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- 设置 RLS (Row Level Security) 策略
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取已发布的博客
CREATE POLICY "Allow public read published blogs" ON blogs
  FOR SELECT USING (status = 'published');

-- 允许所有人读取分类
CREATE POLICY "Allow public read categories" ON blog_categories
  FOR SELECT USING (true);

-- 管理员可以进行所有操作 (需要认证后设置)
CREATE POLICY "Allow admin all operations on blogs" ON blogs
  FOR ALL USING (true);

CREATE POLICY "Allow admin all operations on categories" ON blog_categories
  FOR ALL USING (true);

-- 创建存储桶用于图片上传 (需要在 Supabase Storage 界面创建)
-- Bucket 名称: blog-images
-- 公共访问: 是
-- 允许的文件类型: image/*