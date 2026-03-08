'use client';

import React, { useEffect, useState } from 'react';
import { useBook } from '@/presentation/hooks';
import { BookEntity } from '@/core/entities';
import { Modal } from '@/presentation/components/base/Modal';

// Simple icons
const BookIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ToolIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
);

export function KitabList() {
  const { listBook } = useBook();
  const [books, setBooks] = useState<BookEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookEntity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await listBook({
          page: 1,
          limit: 100,
        });

        if (res.success && res.data.data) {
          setBooks(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [listBook]);

  const handleBookClick = (book: BookEntity) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-8 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Kitab</h1>
        <p className="text-slate-500">Koleksi kitab digital ISHARI</p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center p-16 text-slate-500 bg-white rounded-2xl border border-slate-100">
          Belum ada data kitab yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book)}
              className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <BookIcon className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {book.title}
              </h3>

              {book.author && (
                <p className="text-sm text-emerald-600 font-medium mb-2">
                  {book.author}
                </p>
              )}

              {book.description && (
                <p className="text-sm text-slate-500 line-clamp-2">
                  {book.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Informasi"
        width="max-w-md"
      >
        <div className="py-6 text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ToolIcon />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Dalam Pengembangan
          </h3>
          <p className="text-slate-500 leading-relaxed">
            Fitur untuk <span className="font-medium text-slate-700">{selectedBook?.title}</span> sedang dalam tahap pengembangan. Nantikan update selanjutnya.
          </p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Mengerti
          </button>
        </div>
      </Modal>
    </div>
  );
}
