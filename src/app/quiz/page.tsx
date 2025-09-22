'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    personality: string;
  }[];
}

interface QuizResult {
  personality: string;
  title: string;
  description: string;
  image: string;
  tips: string[];
}

// Simplified quiz data based on original site
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How do you typically react when you're around cats?",
    options: [
      { id: 'a', text: 'I love being around cats and actively seek them out', personality: 'cat-lover' },
      { id: 'b', text: 'I try to avoid cats when possible', personality: 'cat-avoidant' },
      { id: 'c', text: 'I tolerate cats but keep my distance', personality: 'cat-silent' }
    ]
  },
  {
    id: 2,
    question: "How do you typically react when you're around dogs?",
    options: [
      { id: 'a', text: 'I love dogs and enjoy their company', personality: 'dog-lover' },
      { id: 'b', text: 'I actively avoid dogs due to allergies', personality: 'dog-avoidant' },
      { id: 'c', text: 'I like dogs but am cautious around them', personality: 'dog-silent' }
    ]
  },
  {
    id: 3,
    question: "How do you handle dust in your home?",
    options: [
      { id: 'a', text: 'I have a regular cleaning routine and dust frequently', personality: 'dust-cleaner' },
      { id: 'b', text: 'I notice dust bothers me, especially at bedtime', personality: 'dust-bedtime' },
      { id: 'c', text: 'I\'m very aware of dust and allergens in my environment', personality: 'dust-aware' }
    ]
  },
  {
    id: 4,
    question: "How do you deal with seasonal allergies?",
    options: [
      { id: 'a', text: 'I watch pollen counts and plan accordingly', personality: 'pollen-watcher' },
      { id: 'b', text: 'I rely on medication during allergy season', personality: 'pollen-medicator' },
      { id: 'c', text: 'I adapt my activities based on seasons', personality: 'pollen-seasonal' }
    ]
  }
];

const quizResults: Record<string, QuizResult> = {
  'cat-lover': {
    personality: 'The Cat Lover',
    title: 'You love cats despite your allergies!',
    description: 'You\'re someone who can\'t resist the charm of cats, even if they make you sneeze. You likely have strategies for managing your symptoms while still enjoying feline companionship.',
    image: '/images/img-cat-lover.webp',
    tips: [
      'Consider hypoallergenic cat breeds',
      'Use air purifiers in your home',
      'Regular grooming can reduce allergens',
      'Keep cats out of bedrooms'
    ]
  },
  'cat-avoidant': {
    personality: 'The Cat Avoider',
    title: 'You know your limits with cats.',
    description: 'You\'ve learned that it\'s best to keep your distance from cats to avoid uncomfortable allergy symptoms. You\'re practical about managing your health.',
    image: '/images/img-cat-avoidant.webp',
    tips: [
      'Carry antihistamines when visiting cat owners',
      'Inform hosts about your cat allergies',
      'Consider allergy shots if symptoms are severe',
      'Use HEPA filters in your home'
    ]
  },
  'dog-lover': {
    personality: 'The Dog Enthusiast',
    title: 'Dogs are your best friend!',
    description: 'You love dogs and have found ways to manage any allergy symptoms. You probably know which breeds work best for you.',
    image: '/images/img-dog-lover.webp',
    tips: [
      'Look into hypoallergenic dog breeds',
      'Regular bathing reduces dog allergens',
      'Keep dogs well-groomed',
      'Use allergen-reducing sprays'
    ]
  },
  'dust-cleaner': {
    personality: 'The Dust Buster',
    title: 'You\'re proactive about cleanliness!',
    description: 'You understand that regular cleaning is key to managing dust allergies. You likely have a good routine for keeping allergens at bay.',
    image: '/images/img-dust-cleaner.webp',
    tips: [
      'Use microfiber cloths for dusting',
      'Vacuum with HEPA filters regularly',
      'Wash bedding in hot water weekly',
      'Consider dust mite covers for mattresses'
    ]
  }
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleAnswer = (personality: string) => {
    const newAnswers = [...answers, personality];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result based on most common personality type
      const personalityCounts: Record<string, number> = {};
      newAnswers.forEach(p => {
        personalityCounts[p] = (personalityCounts[p] || 0) + 1;
      });

      const topPersonality = Object.keys(personalityCounts).reduce((a, b) => 
        personalityCounts[a] > personalityCounts[b] ? a : b
      );

      const quizResult = quizResults[topPersonality] || quizResults['cat-lover'];
      setResult(quizResult);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResult(null);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showResults ? (
          <div className="text-center">
            {/* Quiz Header */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Discover Your Allergy Personality
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Find out how you deal with allergies and get personalized tips!
            </p>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2 mb-8">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-primary mb-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                {quizQuestions[currentQuestion].question}
              </p>

              {/* Answer Options */}
              <div className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.personality)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-primary-light hover:text-primary rounded-lg transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Results */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
              Your Allergy Personality
            </h1>

            <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-primary mb-8">
              <div className="mb-6">
                <Image
                  src={result?.image || '/images/img-cat-lover.webp'}
                  alt={result?.personality || 'Quiz Result'}
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg"
                />
              </div>

              <h2 className="text-3xl font-bold text-primary mb-4">
                {result?.personality}
              </h2>
              <h3 className="text-xl text-primary mb-6">
                {result?.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                {result?.description}
              </p>

              {/* Tips */}
              <div className="bg-primary-light rounded-lg p-6">
                <h4 className="text-xl font-bold text-primary mb-4">
                  Personalized Tips for You:
                </h4>
                <ul className="text-left space-y-2">
                  {result?.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="btn-primary"
              >
                Take Quiz Again
              </button>
              <Link
                href="/blog"
                className="btn-secondary"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}