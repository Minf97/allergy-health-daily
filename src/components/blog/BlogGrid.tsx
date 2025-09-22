import BlogCard from './BlogCard';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  slug: string;
  readTime?: string;
}

interface BlogGridProps {
  posts: BlogPost[];
  className?: string;
}

export default function BlogGrid({ posts, className = "" }: BlogGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 ${className}`}>
      {posts.map((post, index) => (
        <BlogCard
          key={index}
          title={post.title}
          excerpt={post.excerpt}
          image={post.image}
          imageAlt={post.imageAlt}
          category={post.category}
          slug={post.slug}
          readTime={post.readTime}
        />
      ))}
    </div>
  );
}