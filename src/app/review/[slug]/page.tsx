"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../component/Footer";

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
      }
      setLoading(false);
    }
    fetchReview();
  }, [slug]);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? "text-[#d4739f]" : "text-gray-300"}`}>
        ★
      </span>
    ));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-[#d4739f] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Review Not Found</h2>
          <p className="text-gray-600 mb-8">The review you are looking for does not exist.</p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-[#d4739f] text-white font-semibold rounded-lg hover:bg-[#b85c89] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Books&Bites" width={50} height={50} />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hidden sm:block text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link href="/#reviews" className="hidden sm:block text-gray-300 hover:text-white transition-colors font-medium">
              Reviews
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-lg bg-[#d4739f] text-white font-semibold hover:bg-[#b85c89] transition-colors"
            >
              ← Back
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block px-4 py-1.5 bg-[#d4739f]/10 border border-[#d4739f]/30 rounded-full text-[#d4739f] text-xs font-bold uppercase tracking-wider mb-6">
              Book Review
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight max-w-4xl">
              {review.title}
            </h1>
            <div className="flex items-center gap-2">
              {renderStars(review.rating)}
              <span className="ml-2 text-sm text-gray-400 font-medium">{review.rating} out of 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Book Cover */}
              <div className="relative aspect-[2/3] w-full max-w-md mx-auto lg:max-w-none rounded-xl overflow-hidden shadow-xl border border-gray-200">
                <Image
                  src={review.imageUrl}
                  alt={review.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Rating Card */}
              <div className="bg-black text-white rounded-xl p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-3">Rating</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-5xl font-black text-[#d4739f]">{review.rating}</span>
                  <span className="text-2xl text-gray-500 font-light">/5</span>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Categories */}
              {review.categories && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-600 mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {review.categories
                      .split(/[,#]/)
                      .map(cat => cat.trim())
                      .filter(cat => cat.length > 0)
                      .map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-[#d4739f] hover:text-[#d4739f] transition-colors cursor-default"
                        >
                          {cat}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Perfect Pairing */}
              {review.meal && (
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl">☕</span>
                    Perfect Pairing
                  </h3>
                  <p className="text-gray-800 font-medium leading-relaxed">{review.meal}</p>
                </div>
              )}
            </div>
          </aside>

          {/* Main Review */}
          <section className="lg:col-span-8">
            <article className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 shadow-sm">
              <header className="mb-10 pb-6 border-b border-gray-200">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  Our Review
                </h2>
              </header>
              
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed text-base md:text-lg space-y-4 whitespace-pre-line">
                  {review.review}
                </div>
              </div>$
            </article>

            {/* Back to Reviews CTA */}
            <div className="mt-10 text-center">
              <Link
                href="/#reviews"
                className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all hover:gap-4"
              >
                <span>←</span>
                Explore More Reviews
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}