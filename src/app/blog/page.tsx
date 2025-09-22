import { MainLayout } from '@/components/layout';
import { BlogGrid, CategoryTag } from '@/components/blog';
import { blogService } from '@/lib/supabase';
import { BlogPost, BlogCategory } from '@/types/blog';

// Get blog data and categories
async function getBlogData() {
  try {
    const [blogsResponse, categories] = await Promise.all([
      blogService.getPublishedBlogs(1, 50), // Get first 50 blogs
      blogService.getCategories()
    ]);

    // Transform data format to adapt existing components
    const transformedBlogs = blogsResponse.blogs.map(blog => ({
      title: blog.title,
      excerpt: blog.excerpt || '',
      image: blog.image_url || '/images/default-blog.png',
      imageAlt: blog.image_alt || blog.title,
      category: blog.category?.name || 'Uncategorized',
      slug: blog.slug,
      readTime: blog.read_time
    }));

    const categoryNames = ['All Posts', ...categories.map(cat => cat.name)];

    return {
      blogs: transformedBlogs,
      categories: categoryNames
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    // Return empty data to avoid page crash
    return {
      blogs: [],
      categories: ['All Posts']
    };
  }
}

export default async function BlogPage() {
  const { blogs, categories } = await getBlogData();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Allergy Health Blog
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Browse all allergy health articles, tips, and guides. Comprehensive information about 
            managing allergies, treatments, and prevention strategies from our team of experts.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <CategoryTag
                key={category}
                category={category}
                isActive={category === 'All Posts'}
              />
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <BlogGrid posts={blogs} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts found.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
          </div>
        )}

        {/* Load More Button - can implement pagination later */}
        {blogs.length >= 50 && (
          <div className="text-center mt-12">
            <button className="btn-primary">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}