import Link from 'next/link';

interface CategoryTagProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CategoryTag({
  category,
  isActive = false,
  onClick,
  href,
  size = 'md'
}: CategoryTagProps) {
  const baseClasses = "rounded-full font-medium transition-all duration-300 border-2";
  const inactiveClasses = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-secondary hover:text-white hover:border-secondary";
  const activeClasses = "bg-secondary text-white border-secondary";
  
  // Size variants
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };

  const className = `${baseClasses} ${sizeClasses[size]} ${isActive ? activeClasses : inactiveClasses}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {category}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
    >
      {category}
    </button>
  );
}