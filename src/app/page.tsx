import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { BlogGrid } from '@/components/blog';

// Mock data based on original site content
const featuredPosts = [
  {
    title: 'Egg Powder for Cat Allergies',
    excerpt: 'Learn if egg powder can help with cat allergies, including how it works and how to use it.',
    image: '/images/cat-with-egg.png',
    imageAlt: 'Egg Powder for Cat Allergies',
    category: 'Cat Allergies',
    slug: 'egg-powder-for-cat-allergies',
    readTime: '5 min read'
  },
  {
    title: 'Understanding Fel d 1: The Cat Allergen',
    excerpt: 'A deep dive into the science of Fel d 1, the primary cat allergen responsible for the majority of allergic responses to cats.',
    image: '/images/cat-on-bed.png',
    imageAlt: 'Understanding Fel d 1: The Cat Allergen',
    category: 'Cat Allergies',
    slug: 'understanding-fel-d-1',
    readTime: '7 min read'
  },
  {
    title: 'Dust Mite Allergies: What You Need To Know',
    excerpt: 'Learn about dust mite allergies, including what they are, how they affect you, and how to manage them.',
    image: '/images/5.png',
    imageAlt: 'Dust Mite Allergies: What You Need To Know',
    category: 'Dust Mite Allergies',
    slug: 'dust-mite-allergies',
    readTime: '6 min read'
  },
  {
    title: 'How To Help Allergy Fatigue',
    excerpt: 'Practical tips and strategies to help you overcome allergy-induced fatigue, specifically focusing on cat allergies.',
    image: '/images/6.png',
    imageAlt: 'How To Help Allergy Fatigue',
    category: 'Allergy Fatigue',
    slug: 'how-to-help-allergy-fatigue',
    readTime: '4 min read'
  }
];

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Welcome to Allergy Health Daily
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Allergy Health Daily is a comprehensive resource for allergy information, tips, and health guidance. 
              A collaborative effort between vets and allergy experts, we&apos;re dedicated to providing the latest news 
              and information on allergies to help everyone live their best lives.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/home-dog-and-cat.png"
              alt="Dog and Cat"
              width={500}
              height={400}
              className="rounded-lg shadow-md"
              priority
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest Blog Posts */}
          <section>
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-primary mb-4">Latest Blog Posts</h3>
              <hr className="line-accent" />
            </div>
            
            <BlogGrid posts={featuredPosts} className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-1" />
          </section>

          {/* Quiz Section */}
          <section className="flex flex-col">
            <div className="mb-8">
              <Image
                src="/images/img-dog-silent.webp"
                alt="Dog Silent"
                width={500}
                height={300}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center text-center">
              <h3 className="text-3xl font-bold text-primary mb-4">
                Everyone deals with allergies differently
              </h3>
              <p className="text-lg text-primary mb-6">
                Take our quiz to find out how you deal with allergies
              </p>
              <Link
                href="/quiz"
                className="btn-primary inline-block text-center max-w-xs mx-auto"
              >
                Take the quiz
              </Link>
            </div>
          </section>
        </div>

        {/* Call to Action Section */}
        <section className="mt-16 bg-primary-light rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Get Expert Allergy Advice
          </h2>
          <p className="text-lg text-primary mb-6">
            Stay up to date with the latest allergy research, tips, and treatment options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="btn-primary"
            >
              Read Our Blog
            </Link>
            <Link
              href="/quiz"
              className="btn-secondary"
            >
              Take Allergy Quiz
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
