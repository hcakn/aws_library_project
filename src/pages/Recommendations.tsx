import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getBooks } from '@/services/api';
import { Book } from '@/types';
import { handleApiError } from '@/utils/errorHandling';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface AIRecommendation {
  title: string;
  author: string;
  description: string;
  reason: string;
}

interface EnrichedRecommendation extends AIRecommendation {
  matchedBook?: Book;
  inDatabase: boolean;
}

/**
 * Recommendations page component with AI-powered suggestions
 */
export function Recommendations() {
  const { user } = useAuth();
  const [genre, setGenre] = useState('science fiction');
  const [recommendations, setRecommendations] = useState<EnrichedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const exampleQueries = [
    'I love mystery novels with strong female protagonists',
    'Looking for science fiction books about space exploration and AI',
    'Recommend me some feel-good romance novels set in small towns',
    'I want to read about personal development and building good habits',
  ];

  const handleGetRecommendations = async () => {
    if (!genre.trim()) {
      alert('Please enter a genre');
      return;
    }

    setIsLoading(true);
    try {
      const userId = user?.id || 'guest';

      // Get AI recommendations
      const response = await fetch(
        `https://ups86wch5d.execute-api.us-east-1.amazonaws.com/dev/recommendations?userId=${userId}&genre=${encodeURIComponent(genre)}&limit=5`
      );

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      const aiRecs: AIRecommendation[] = data.recommendations || [];

      // Get all books from database
      const allBooks = await getBooks();

      // Match AI recommendations with database books
      const enrichedRecs: EnrichedRecommendation[] = aiRecs.map((rec) => {
        // Try to find matching book in database (by title or author)
        const matchedBook = allBooks.find(
          (book) =>
            book.title.toLowerCase().includes(rec.title.toLowerCase()) ||
            rec.title.toLowerCase().includes(book.title.toLowerCase()) ||
            book.author.toLowerCase() === rec.author.toLowerCase()
        );

        return {
          ...rec,
          matchedBook,
          inDatabase: !!matchedBook,
        };
      });

      setRecommendations(enrichedRecs);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">AI-Powered Recommendations</span>
          </h1>
        </div>

        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            What genre are you interested in?
          </label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Science Fiction, Fantasy, Mystery..."
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4"
          />

          <div className="mt-6">
            <p className="text-sm text-slate-700 font-semibold mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setGenre(example)}
                  className="text-sm bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-slate-800 px-4 py-2 rounded-xl transition-all border border-violet-200 hover:border-violet-300 font-medium hover:shadow-md"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetRecommendations}
              disabled={isLoading}
              className="w-full"
            >
              <svg
                className="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {isLoading ? 'Getting AI Recommendations...' : 'Get AI Recommendations'}
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              <span className="gradient-text">Recommended for You</span>
            </h2>

            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="glass-effect rounded-2xl shadow-xl border border-white/20 p-6 hover-glow transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    {/* Book Cover - if in database */}
                    {rec.inDatabase && rec.matchedBook && (
                      <img
                        src={rec.matchedBook.coverImage}
                        alt={rec.title}
                        className="w-28 h-40 object-cover rounded-xl shadow-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/112x160?text=No+Cover';
                        }}
                      />
                    )}

                    {/* AI Placeholder - if not in database */}
                    {!rec.inDatabase && (
                      <div className="w-28 h-40 rounded-xl shadow-lg flex-shrink-0 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center border-2 border-violet-200">
                        <svg
                          className="w-12 h-12 text-violet-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-slate-900">{rec.title}</h3>
                        {rec.inDatabase && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                            In Library
                          </span>
                        )}
                        {!rec.inDatabase && (
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200">
                            AI Suggestion
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 mb-3 font-medium">by {rec.author}</p>
                      <p className="text-slate-700 mb-4 leading-relaxed">{rec.description}</p>

                      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-xl border border-violet-200 mb-4">
                        <p className="text-sm text-violet-900 font-medium">
                          <strong>Why you'll like it:</strong> {rec.reason}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-gradient-to-r from-violet-100 to-indigo-100 px-3 py-1.5 rounded-xl border border-violet-200 text-sm text-violet-700 font-semibold">
                          Confidence: 90%
                        </span>

                        {rec.inDatabase && rec.matchedBook && (
                          <Link
                            to={`/books/${rec.matchedBook.id}`}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1.5 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all text-sm font-semibold"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && recommendations.length === 0 && (
          <div className="text-center py-12 glass-effect rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-violet-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="text-slate-700 text-lg font-medium mb-2">
              Ready to discover your next favorite book?
            </p>
            <p className="text-slate-600">
              Enter a genre and click "Get AI Recommendations" to see personalized suggestions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
