"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

interface Review {
  title: string;
  titleSlug: string;
  rating: number;
  review: string;
  categories?: string;
  meal?: string;
  imageUrl: string;
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

const relatedBooks = [
  { title: "Gone Girl", genre: "Thriller", rating: 4, emoji: "📚" },
  { title: "Fourth Wing", genre: "Fantasy", rating: 5, emoji: "📖" },
  { title: "The Silent Patient", genre: "Mystère", rating: 4, emoji: "📕" }
];

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

  const renderStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] shadow-lg">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🍒</span>
                <h1 className="text-2xl font-bold text-white">Books&Bites</h1>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-white hover:text-[#ffbdc8] transition duration-300">
                  ← Retour aux reviews
                </a>
              </div>
            </div>
          </nav>
        </header>

        <div className="container mx-auto p-6 flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#ffbdc8] border-t-[#f00b0d] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la review...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!review) {
    return <p className="container mx-auto p-6 text-center text-gray-600">Review non trouvée.</p>;
  }

  let categorie = review.categories;
  const res = categorie?.replace("#", "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🍒</span>
              <h1 className="text-2xl font-bold text-white">Books&Bites</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-white hover:text-[#ffbdc8] transition duration-300">
                ← Back
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Review Content */}
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">{review.title}</h1>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <img src={review.imageUrl} alt={`Couverture de ${review.title}`} className="w-full max-w-md mx-auto md:mx-0 rounded-xl shadow-lg border border-[#ffbdc8]/20" />
              <div className="bg-white rounded-xl shadow-lg border border-[#ffbdc8]/20 p-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">🍒</span>
                  Overal Rating
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-yellow-500">{renderStars(review.rating)}</span>
                  <span className="text-gray-600 font-semibold">{review.rating}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Text */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-[#ffbdc8]/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📖</span>
                Notre avis
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                <p>{review.review}</p>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
                <div className="flex flex-wrap gap-3">
                    <span className="bg-[#ffbdc8]/20 text-[#f00b0d] px-3 py-1 rounded-full text-sm font-bold text-transform: uppercase">
                        {res}
                    </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Meal</h3>
                <div className="flex flex-wrap gap-3">
                    <span className="bg-[#ffbdc8]/20 text-[#f00b0d] px-3 py-1 rounded-full text-sm font-bold text-transform: uppercase">
                        {review.meal}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
