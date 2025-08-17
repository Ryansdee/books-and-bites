"use client";

import { useEffect, useState } from "react";
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
  Uploaded?: Timestamp; // Optional field for the date of upload
}

// Mock data pour fallback/demo
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
        // fallback demo
        setReview(mockReview);
      }
      setLoading(false);
    }
    fetchReview();
  }, [slug]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <header className="bg-gradient-to-r from-[#ffbdc8] via-pink-400 to-[#f00b0d] shadow-xl">
          <nav className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🍒</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Books&Bites</h1>
              </div>
              <div className="hidden md:flex items-center">
                <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="text-white font-medium">← Back</span>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="container mx-auto p-6 flex justify-center items-center min-h-96">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 border border-pink-100">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] rounded-full animate-ping opacity-20"></div>
              <div className="relative w-16 h-16 border-4 border-pink-200 border-t-[#f00b0d] rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Load review...</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 border border-pink-100">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Review don&apos;t existe</h2>
          <p className="text-gray-600 mb-6">The review that you wanna see is not made yet !</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header amélioré */}
      <header className="bg-gradient-to-r from-[#ffbdc8] via-pink-400 to-[#f00b0d] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <nav className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 mx-auto">
              <Image src={"/images/logo.png"} alt={""} width={140} height={35} />
            </div>
            <div className="hidden md:flex items-center">
              <Link 
                href="/" 
                className="group flex items-center space-x-2 bg-white/15 hover:bg-white/25 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-200 border border-white/20"
              >
                <svg className="w-5 h-5 text-white transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-white font-semibold">Back</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-red-300"></div>
      </header>

      {/* Review Content */}
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Titre principal avec effet */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4 leading-tight">
            {review.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Sidebar avec image et rating */}
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Image du livre */}
              <div className="group relative w-full max-w-sm mx-auto md:mx-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffbdc8]/20 to-[#f00b0d]/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="relative h-96 rounded-2xl shadow-2xl border border-white overflow-hidden bg-white">
                  <Image
                    src={review.imageUrl}
                    alt={`Couverture de ${review.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 p-6 hover:shadow-2xl transition-all duration-300">
                <h3 className="font-bold text-gray-800 flex items-center text-lg">
                  Reviewed on &nbsp;<span className="flex items-center justify-between text-[#f00b0d] font-semibold">{review.Uploaded ? review.Uploaded.toDate().toLocaleDateString() : "Unknown date"}</span>
                </h3>
              </div>

              {/* Rating card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 p-6 hover:shadow-2xl transition-all duration-300">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🍒</span>
                  </div>
                  Global note
                </h3>
                <div className="flex items-center justify-between">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
          </div>

          {/* Review Text */}
          <div className="md:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-lg">📖</span>
                </div>
                Our review
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-10">
                <p className="text-lg font-light leading-8">{review.review}</p>
              </div>

              {/* Categories */}
              <div className="border-t border-gradient-to-r from-pink-100 to-rose-100 pt-8 mb-8">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🏷️</span>
                  </div>
                  Category
                </h3>
                <div className="flex flex-wrap gap-3">
                  {review.categories
                    ?.split(/[,#]/)
                    .map(cat => cat.trim())
                    .filter(cat => cat.length > 0)
                    .map((cat, index) => (
                      <span
                        key={index}
                        className="group px-4 py-2 bg-gradient-to-r from-[#ffbdc8]/20 to-[#f00b0d]/20 hover:from-[#ffbdc8]/30 hover:to-[#f00b0d]/30 text-[#f00b0d] rounded-full text-sm font-bold uppercase tracking-wide border border-pink-200 hover:border-pink-300 hover:shadow-md transform hover:scale-105 transition-all duration-200 cursor-default"
                      >
                        {cat}
                      </span>
                    ))}
                </div>
              </div>

              {/* Meal */}
              <div className="border-t border-gradient-to-r from-pink-100 to-rose-100 pt-8">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🍽️</span>
                  </div>
                  Meal
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="group px-6 py-3 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 text-[#f00b0d] rounded-full text-base font-semibold border border-orange-200 hover:border-orange-300 hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-default">
                    {review.meal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile back button */}
        <div className="md:hidden mt-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}