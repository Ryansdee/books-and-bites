"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import Footer from './component/Footer'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Review {
  title: string;
  titleSlug: string;
  rating: number;
  review: string;
  categories?: string;
  meal?: string;
  imageUrl: string;
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setReviews(snap.docs.map((doc) => doc.data() as Review));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (!searchQuery) return reviews;
    return reviews.filter(
      (review) =>
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.categories?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviews, searchQuery]);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? "text-[#d4739f]" : "text-gray-300"}`}>
        ★
      </span>
    ));
  }, []);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const scrollToReviews = useCallback(() => {
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative bg-white text-gray-900 min-h-screen">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-black"
        }`}
      >
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          </Link>

          <div className="hidden lg:flex items-center space-x-10 font-medium text-base">
            <Link href="/" className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-colors`}>
              Home
            </Link>
            <button
              onClick={scrollToReviews}
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-colors cursor-pointer`}
            >
              Reviews
            </button>
            <Link href="/about" className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-colors`}>
              About
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-3 rounded-lg text-white bg-[#d4739f]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-black text-white shadow-xl">
            <nav className="flex flex-col items-center py-6 space-y-5">
              <Link href="/" onClick={closeMobileMenu} className="text-base font-medium hover:text-[#d4739f]">
                Home
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  scrollToReviews();
                }}
                className="text-base font-medium hover:text-[#d4739f]"
              >
                Reviews
              </button>
              <Link href="/about" onClick={closeMobileMenu} className="text-base font-medium hover:text-[#d4739f]">
                About
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 bg-black">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Text content */}
            <div className="space-y-8 text-center lg:text-left text-white">
              <div className="inline-block px-5 py-2 border border-[#d4739f] rounded-full text-[#d4739f] text-sm font-semibold">
                Welcome to Books&Bites
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Discover Books<br />
                That <span className="text-[#d4739f]">Matter</span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Honest reviews, personalized recommendations, and a passionate community of readers sharing their literary discoveries.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button
                  onClick={scrollToReviews}
                  className="px-8 py-4 bg-[#d4739f] text-white rounded-lg font-semibold hover:bg-[#b85c89] transition-colors cursor-pointer"
                >
                  Explore Reviews
                </button>
                <Link
                  href="/about"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-12 justify-center lg:justify-start pt-8 border-t border-gray-800">
                <div>
                  <div className="text-3xl font-bold text-[#d4739f]">{reviews.length}</div>
                  <div className="text-sm text-gray-400 font-medium">Books Reviewed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#d4739f]">3</div>
                  <div className="text-sm text-gray-400 font-medium">Readers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#d4739f]">{reviews.length > 0 
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : "0"}★</div>
                  <div className="text-sm text-gray-400 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right side - Characters showcase */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Character 1 - Top left */}
              <div className="absolute top-0 left-0 w-64 h-80 animate-float">
                <div className="relative w-full h-full bg-black border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="w-full h-48 bg-gray-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl">
                      <Image src="/images/Ivana.webp" alt="Reader 2" fill className="object-contain" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-800 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-800 rounded-full w-1/2"></div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#d4739f] rounded-full flex items-center justify-center text-xl shadow-lg">
                    📖
                  </div>
                </div>
              </div>

              {/* Character 2 - Bottom left */}
              <div className="absolute bottom-0 left-12 w-56 h-72 animate-float animation-delay-2">
                <div className="relative w-full h-full bg-black border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="w-full h-40 bg-gray-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl">
                      <Image src="/images/Saki.webp" alt="Reader 2" fill className="object-contain" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-800 rounded-full w-2/3"></div>
                    <div className="h-2 bg-gray-800 rounded-full w-1/2"></div>
                  </div>
                  <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">
                    ☕
                  </div>
                </div>
              </div>

              {/* Character 3 - Right side */}
              <div className="absolute top-32 right-0 w-64 h-80 animate-float animation-delay-4">
                <div className="relative w-full h-full bg-black border-2 border-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="w-full h-48 bg-gray-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <div className="text-6xl">
                      <Image src="/images/Loor.webp" alt="Reader 2" fill className="object-contain" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-800 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-800 rounded-full w-2/3"></div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#d4739f] rounded-full flex items-center justify-center text-xl shadow-lg">
                    ⭐
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Books&Bites?</h2>
            <p className="text-lg text-gray-600">A unique experience for book lovers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black text-white p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                ✍️
              </div>
              <h3 className="text-xl font-bold mb-4">Authentic Reviews</h3>
              <p className="text-gray-400 leading-relaxed">
                Honest and detailed reviews written by passionate readers who genuinely share their impressions.
              </p>
            </div>

            <div className="bg-black text-white p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-4">Targeted Recommendations</h3>
              <p className="text-gray-400 leading-relaxed">
                Find exactly the book you need with our detailed categories and personalized suggestions.
              </p>
            </div>

            <div className="bg-black text-white p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                💬
              </div>
              <h3 className="text-xl font-bold mb-4">Active reviews</h3>
              <p className="text-gray-400 leading-relaxed">
                Join or 3 readers with their reviews, share your thoughts, and be part of our growing community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Next Read</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none bg-white text-base"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">🔍</span>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <main className="relative container mx-auto px-6 py-20 bg-white" id="reviews">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Latest Reviews</h2>
          <div className="w-20 h-1 bg-[#d4739f] mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-[#d4739f] rounded-full animate-spin"></div>
            <p className="mt-6 text-gray-600 text-base font-medium">Loading your next great read...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">📚</div>
            <p className="text-xl text-gray-700 mb-2 font-bold">
              {searchQuery ? "No books found" : "No reviews yet"}
            </p>
            <p className="text-gray-500">
              {searchQuery ? "Try another search term" : "Be the first to add a review"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review) => (
              <div
                key={review.titleSlug}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-[#d4739f] overflow-hidden transition-all duration-300"
              >
                <div className="h-56 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <Image
                    src={review.imageUrl}
                    alt={review.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-700 rounded-full uppercase tracking-wide">
                      {review.categories || "General"}
                    </span>
                    <div className="flex items-center space-x-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900">
                    {review.title}
                  </h3>

                  {review.meal && (
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <span>☕</span>
                      <span>Perfect with: {review.meal}</span>
                    </p>
                  )}

                  <Link
                    href={`/review/${review.titleSlug}`}
                    className="block text-center text-white px-5 py-3 rounded-lg font-semibold bg-[#d4739f] hover:bg-[#b85c89] transition-colors"
                  >
                    Read Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
      

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2 {
          animation-delay: 2s;
        }

        .animation-delay-4 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}