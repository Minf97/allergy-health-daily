import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-4">
          <p className="text-lg mb-2">&copy; 2025 Allergy Health Daily. All rights reserved.</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link 
              href="/privacy-policy" 
              className="hover:text-secondary-light transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link 
              href="/terms-of-service"
              className="hover:text-secondary-light transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>
            Allergy Health Daily is a comprehensive resource for allergy information, tips, and health guidance.
            <br />
            A collaborative effort between vets and allergy experts to help everyone live their best lives.
          </p>
        </div>
      </div>
    </footer>
  );
}