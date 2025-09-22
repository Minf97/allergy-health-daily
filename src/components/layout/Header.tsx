'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/allergyhealthdailylogo.png"
              alt="Allergy Health Daily Logo"
              width={150}
              height={95}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <ul className="flex gap-8">
            <li>
              <Link
                href="/blog"
                className={`font-medium transition-colors duration-300 hover:text-secondary-light ${
                  isActive('/blog') ? 'text-secondary-light font-bold' : ''
                }`}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/quiz"
                className={`font-medium transition-colors duration-300 hover:text-secondary-light ${
                  isActive('/quiz') ? 'text-secondary-light font-bold' : ''
                }`}
              >
                Your Allergy Personality
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}