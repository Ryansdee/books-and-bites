"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Link from "next/link";
import Image from "next/image";

interface Review {
  title: string;
  titleSlug: string;
  rating: number;
  review: string;
  categories?: string;
  meal?: string;
  imageUrl: string;
  Uploaded?: Timestamp;
}

const mockReview: Review = {
  title: "Les Sept Maris d'Evelyn Hugo",
  titleSlug: "les-sept-maris-evelyn-hugo",
  rating: 5,
  review: "Un récit absolument captivant...",
  categories: "Romance, Fiction contemporaine, Hollywood",
  meal: "Thé Earl Grey avec des macarons à la rose",
  imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
};

export default function ReviewPage() {
  const { slug } = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      if (!slug) return;
      const q = query(collection(db, "reviews"), where("titleSlug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setReview(snap.docs[0].data() as Review);
      } else {
        setReview(mockReview);
      }
      setLoading(false);
    }
    fetchReview();
  }, [slug]);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-[#d4739f]" : "text-gray-300"}`}>
        ★
      </span>
    ));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-xl shadow-md p-10 border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-[#d4739f] rounded-full animate-ping opacity-20"></div>
            <div className="relative w-16 h-16 border-4 border-gray-200 border-t-[#d4739f] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-xl shadow-md p-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Review not found</h2>
          <p className="text-gray-600 mb-6">The review you are looking for does not exist yet.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#d4739f] text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Image src="/images/logo.png" alt="Logo" width={140} height={35} />
          <Link
            href="/"
            className="px-5 py-2 rounded-md bg-[#d4739f] text-white font-medium hover:opacity-90 transition"
          >
            ← Back
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {review.title}
          </h1>
          <div className="w-24 h-1 bg-[#d4739f] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            <div className="relative h-96 rounded-lg shadow border border-gray-200 overflow-hidden bg-white">
              <Image
                src={review.imageUrl}
                alt={`Cover of ${review.title}`}
                fill
                className="object-cover"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">
                Reviewed on <span className="text-[#d4739f]">{review.Uploaded ? review.Uploaded.toDate().toLocaleDateString() : "Unknown date"}</span>
              </h3>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Global rating</h3>
              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="text-gray-700 text-sm">{review.rating}/5</span>
              </div>
            </div>
          </aside>

          {/* Main review */}
          <section className="md:col-span-2 bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our review</h2>
            <p className="text-gray-700 leading-relaxed mb-8">{review.review}</p>

            {review.categories && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {review.categories
                    .split(/[,#]/)
                    .map(cat => cat.trim())
                    .filter(cat => cat.length > 0)
                    .map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-[#d4739f] rounded-full text-xs font-medium border border-gray-200"
                      >
                        {cat}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {review.meal && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">Meal</h3>
                <span className="inline-block px-4 py-2 bg-gray-100 text-[#d4739f] rounded-full text-sm font-medium border border-gray-200">
                  {review.meal}
                </span>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-10 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <Image src="/images/logo.png" alt="Logo" width={120} height={60} />
            <p className="mt-4 text-sm">Books&Bites – your destination for insightful book reviews.</p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Links</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="#reviews" className="hover:text-white">Reviews</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Follow Us</h5>
            <a
              href="https://www.instagram.com/bookssnbites/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs">
          &copy; 2025 Books&Bites. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
