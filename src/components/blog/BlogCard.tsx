import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  slug: string;
  readTime?: string;
}

export default function BlogCard({
  title,
  excerpt,
  image,
  imageAlt,
  category,
  slug,
  readTime
}: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary">
      {/* Category Badge */}
      <div className="flex justify-between items-center mb-4">
        <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-semibold">
          {category}
        </span>
        {readTime && (
          <span className="text-gray-500 text-sm">{readTime}</span>
        )}
      </div>

      {/* Image */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          width={400}
          height={250}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-3 text-primary hover:text-primary transition-colors duration-300">
        <Link href={`/blog/${slug}`} className="no-underline">
          {title}
        </Link>
      </h3>

      <p className="text-gray-600 mb-4 line-height-6 leading-relaxed">
        {excerpt}
      </p>

      {/* Read More Link */}
      <Link
        href={`/blog/${slug}`}
        className="inline-block text-primary font-bold hover:text-primary transition-colors duration-300"
      >
        Read Full Article →
      </Link>
    </article>
  );
}