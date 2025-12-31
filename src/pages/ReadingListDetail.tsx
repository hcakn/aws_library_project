import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getReadingListById, getBook, updateReadingList, deleteReadingList } from '@/services/api';
import { ReadingList, Book } from '@/types';
import { handleApiError } from '@/utils/errorHandling';
import { useAuth } from '@/contexts/AuthContext';

export function ReadingListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [list, setList] = useState<ReadingList | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id && user) {
      loadListAndBooks(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadListAndBooks = async (listId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const listData = await getReadingListById(listId, user.id);
      if (!listData) {
        navigate('/reading-lists');
        return;
      }
      setList(listData);

      // Load all books in the list
      const bookPromises = listData.bookIds.map((bookId) => getBook(bookId));
      const booksData = await Promise.all(bookPromises);
      setBooks(booksData.filter((book): book is Book => book !== null));
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    if (!list || !user) return;

    if (!confirm('Remove this book from the list?')) return;

    try {
      const updatedBookIds = list.bookIds.filter((id) => id !== bookId);
      await updateReadingList(list.id, {
        ...list,
        bookIds: updatedBookIds,
      });

      // Update local state
      setList({ ...list, bookIds: updatedBookIds });
      setBooks(books.filter((book) => book.id !== bookId));

      alert('Book removed from list!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteList = async () => {
    if (!list || !user) return;

    if (!confirm(`Delete "${list.name}" reading list? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await deleteReadingList(list.id, user.id);
      alert('Reading list deleted successfully!');
      navigate('/reading-lists');
    } catch (error) {
      handleApiError(error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!list) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/reading-lists')}
          className="flex items-center text-slate-600 hover:text-violet-600 mb-8 transition-colors group glass-effect px-4 py-2 rounded-xl border border-white/20 w-fit"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-semibold">Back to Lists</span>
        </button>

        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3">{list.name}</h1>
              <p className="text-lg text-slate-600">{list.description || 'No description'}</p>
              <p className="text-sm text-slate-500 mt-2">{books.length} books in this list</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteList}
              disabled={isDeleting}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <svg
                className="w-4 h-4 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {isDeleting ? 'Deleting...' : 'Delete List'}
            </Button>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="glass-effect rounded-3xl shadow-xl border border-white/20 p-12 text-center">
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">No books in this list yet</h3>
            <p className="text-slate-600 mb-6">Start adding books to build your reading list!</p>
            <Button onClick={() => navigate('/books')}>Browse Books</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="glass-effect rounded-2xl shadow-lg border border-white/20 overflow-hidden group hover:shadow-glow transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-slate-600 mb-4">{book.author}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBook(book.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
