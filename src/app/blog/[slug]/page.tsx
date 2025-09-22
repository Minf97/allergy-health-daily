import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { CategoryTag } from '@/components/blog';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/supabase';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamically generate metadata
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await blogService.getBlogBySlug(slug);
    
    if (!post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.'
      };
    }

    return {
      title: `${post.title} | Allergy Health Daily`,
      description: post.excerpt || `Read ${post.title} on Allergy Health Daily`,
      keywords: `allergy, health, ${post.category?.name || ''}`,
      openGraph: {
        title: post.title,
        description: post.excerpt || `Read ${post.title} on Allergy Health Daily`,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: ['Allergy Health Daily'],
        section: post.category?.name || 'Health',
        tags: [post.category?.name || 'Health', 'Allergy', 'Wellness'],
        images: post.image_url ? [{
          url: post.image_url,
          width: 800,
          height: 500,
          alt: post.image_alt || post.title
        }] : undefined
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || `Read ${post.title} on Allergy Health Daily`,
        images: post.image_url ? [post.image_url] : undefined
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Allergy Health Daily',
      description: 'Read the latest health and allergy information on Allergy Health Daily'
    };
  }
}

// Convert Tiptap JSON content to HTML
function tiptapToHtml(content: any): string {
  if (!content || !content.content) return '';
  
  function processNode(node: any): string {
    if (node.type === 'text') {
      let text = node.text || '';
      if (node.marks) {
        node.marks.forEach((mark: any) => {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`;
              break;
            case 'italic':
              text = `<em>${text}</em>`;
              break;
            case 'code':
              text = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">${text}</code>`;
              break;
            case 'underline':
              text = `<u>${text}</u>`;
              break;
            case 'strike':
              text = `<s>${text}</s>`;
              break;
            case 'superscript':
              text = `<sup>${text}</sup>`;
              break;
            case 'subscript':
              text = `<sub>${text}</sub>`;
              break;
            case 'highlight':
              const highlightColor = mark.attrs?.color || '#fef08a';
              text = `<mark style="background-color: ${highlightColor}">${text}</mark>`;
              break;
            case 'link':
              const href = mark.attrs?.href || '#';
              const target = mark.attrs?.target || '_self';
              const rel = target === '_blank' ? 'noopener noreferrer' : '';
              text = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:underline">${text}</a>`;
              break;
          }
        });
      }
      return text;
    }
    
    const children = node.content?.map(processNode).join('') || '';
    
    switch (node.type) {
      case 'paragraph':
        return `<p class="mb-4 leading-relaxed text-xl">${children}</p>`;
      case 'heading':
        const level = node.attrs?.level || 2;
        let className = '';
        switch (level) {
          case 1:
            className = 'text-4xl font-bold mb-6 mt-8 text-primary';
            break;
          case 2:
            className = 'text-3xl font-bold mb-4 mt-8 text-primary';
            break;
          case 3:
            className = 'text-2xl font-bold mb-3 mt-6 text-gray-800';
            break;
          case 4:
            className = 'text-xl font-bold mb-3 mt-4 text-gray-800';
            break;
          default:
            className = 'text-xl font-bold mb-2 mt-4 text-gray-800';
        }
        return `<h${level} class="${className}">${children}</h${level}>`;
      case 'bulletList':
        return `<ul class="list-disc pl-6 mb-4 space-y-2">${children}</ul>`;
      case 'orderedList':
        const start = node.attrs?.start ? ` start="${node.attrs.start}"` : '';
        return `<ol class="list-decimal pl-6 mb-4 space-y-2"${start}>${children}</ol>`;
      case 'listItem':
        return `<li class="leading-relaxed">${children}</li>`;
      case 'taskList':
        return `<ul class="space-y-2 mb-4">${children}</ul>`;
      case 'taskItem':
        const checked = node.attrs?.checked ? 'checked' : '';
        return `<li class="flex items-start gap-2"><input type="checkbox" ${checked} disabled class="mt-1" /><span class="flex-1">${children}</span></li>`;
      case 'codeBlock':
        const language = node.attrs?.language || '';
        return `<pre class="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto border"><code class="language-${language}">${children}</code></pre>`;
      case 'blockquote':
        return `<blockquote class="border-l-4 border-primary pl-4 py-2 bg-gray-50 italic mb-4 rounded-r">${children}</blockquote>`;
      case 'image':
        const src = node.attrs?.src || '';
        const alt = node.attrs?.alt || '';
        const title = node.attrs?.title || '';
        return `<div class="mb-6"><img src="${src}" alt="${alt}" title="${title}" class="rounded-lg max-w-full h-auto mx-auto shadow-sm" /></div>`;
      case 'horizontalRule':
        return '<hr class="my-8 border-gray-300" />';
      case 'hardBreak':
        return '<br />';
      default:
        return children;
    }
  }
  
  return content.content.map(processNode).join('');
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  try {
    const post = await blogService.getBlogBySlug(slug);
    
    if (!post) {
      notFound();
    }

    // Convert content format
    const htmlContent = post.html_content || tiptapToHtml(post.content);
    const publishDate = new Date(post.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{post.title}</span>
            </div>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            {post.category && (
              <div className="mb-4">
                <CategoryTag category={post.category.name} />
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span>{publishDate}</span>
              <span>•</span>
              <span>{post.read_time}</span>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                <p>Published on {publishDate}</p>
                <p>Last updated: {new Date(post.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              
              <Link
                href="/blog"
                className="px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
          </footer>

          {/* Related Posts Section */}
          <RelatedPosts categoryId={post.category_id} currentSlug={post.slug} />
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}

// Related articles component
async function RelatedPosts({ categoryId, currentSlug }: { 
  categoryId: string | null; 
  currentSlug: string;
}) {
  if (!categoryId) return null;

  try {
    // Get other articles in the same category
    const { blogs } = await blogService.getPublishedBlogs(1, 10);
    const relatedPosts = blogs
      .filter(blog => blog.category_id === categoryId && blog.slug !== currentSlug)
      .slice(0, 3);

    if (relatedPosts.length === 0) return null;

    return (
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-primary mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              {post.image_url && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={post.image_url}
                    alt={post.image_alt || post.title}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.read_time}</span>
                  {post.category && (
                    <CategoryTag category={post.category.name} size="sm" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return null;
  }
}

// Generate static paths - now from database
export async function generateStaticParams() {
  try {
    const { blogs } = await blogService.getPublishedBlogs(1, 100); // Get first 100 articles
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}