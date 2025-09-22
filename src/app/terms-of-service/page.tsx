import { MainLayout } from '@/components/layout';

export default function TermsOfServicePage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg mb-6">
            <strong>Last updated:</strong> March 18, 2025
          </p>
          
          <p className="mb-6">
            Welcome to Allergy Health Daily. These Terms of Service govern your use of our website and services.
          </p>
          
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">
            Acceptance of Terms
          </h2>
          <p className="mb-6">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">
            Medical Disclaimer
          </h2>
          <p className="mb-6">
            The information provided on this website is for educational purposes only and is not intended as medical advice. 
            Always consult with a qualified healthcare provider before making any health-related decisions.
          </p>
          
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">
            Use License
          </h2>
          <p className="mb-6">
            Permission is granted to temporarily download one copy of the materials on Allergy Health Daily&apos;s website 
            for personal, non-commercial transitory viewing only.
          </p>
          
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">
            Contact Information
          </h2>
          <p className="mb-6">
            For questions about these Terms of Service, please contact us at terms@allergyhealthdaily.com
          </p>
        </div>
      </div>
    </MainLayout>
  );
}