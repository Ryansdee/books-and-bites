"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
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
<span key={i} className={`text-lg ${i < rating ? "text-[#d4739f]" : "text-gray-300"}`}>
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
    <div className="bg-white text-gray-900 min-h-screen">
      {/* HEADER */}
<header
  className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
    isScrolled ? "bg-white shadow" : "bg-black/70"
  }`}
>
  <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
    </Link>

    {/* Desktop Menu */}
    <div className="hidden lg:flex items-center space-x-8 font-medium">
      <Link href="/" className={`hover:text-pink-300 ${isScrolled ? "text-black" : "text-white"} transition`}>Home</Link>
      <button
        onClick={scrollToReviews}
        className={`hover:text-pink-300 ${isScrolled ? "text-black" : "text-white"} transition`}
        style={{ cursor: "pointer" }}
      >
        Reviews
      </button>
      <Link href="/about" className={`hover:text-pink-300 ${isScrolled ? "text-black" : "text-white"} transition`}>About</Link>
    </div>

    {/* Mobile Menu Button */}
    <button
      onClick={toggleMobileMenu}
      className="lg:hidden p-2 rounded-md text-white hover:bg-gray-700 transition"
      style={{ background: "#d4739fff" }} // bleu foncé
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

  {/* Mobile Menu Drawer */}
  {isMobileMenuOpen && (
    <div className="lg:hidden absolute top-full left-0 w-full my-auto h-auto text-white shadow-md" style={{backdropFilter: "blur(10px)", background:"#d4739fff"}}>
      <nav className="flex flex-col items-center py-6 space-y-10 mx-auto">
        <Link href="/" onClick={closeMobileMenu} className="hover:text-blue-500 transition">Home</Link>
        <button
          onClick={() => {
            closeMobileMenu();
            scrollToReviews();
          }}
          className="hover:text-blue-500 transition"
        >
          Reviews
        </button>
        <Link href="/about" onClick={closeMobileMenu} className="hover:text-blue-500 transition">About</Link>
      </nav>
    </div>
  )}
</header>


      {/* HERO */}
      <section className="relative bg-black text-white min-h-[80vh] flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
            Discover <span style={{color:"#d4739fff"}}>Inspiring</span>  Books & <span style={{color:"#d4739fff"}}>Honest</span> Reviews
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Books&Bites is your trusted corner for book reviews, reading insights, and curated recommendations.
          </p>
          <button
            onClick={scrollToReviews}
            className="px-8 py-4 rounded-full font-semibold shadow-md transition" style={{background:"#d4739fff", cursor:"pointer"}} >
            Explore Reviews
          </button>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-6 max-w-lg">
          <input
            type="text"
            placeholder="Search books, authors, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </section>

      {/* REVIEWS */}
      <main className="container mx-auto px-6 py-16" id="reviews">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Reviews</h2>
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">📘</div>
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-600 mb-2">
              {searchQuery ? "No books found" : "No reviews yet"}
            </p>
            <p className="text-gray-400">
              {searchQuery ? "Try another search term." : "Be the first to add a review!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((review) => (
              <div
                key={review.titleSlug}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border"
              >
                <div className="h-48 relative">
                  <Image
                    src={review.imageUrl}
                    alt={review.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                      {review.categories || "General"}
                    </span>
                    <div className="flex items-center space-x-1" style={{color:"#d4739fff"}} >
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {review.title}
                  </h3>
                  {review.meal && (
                    <p className="text-sm text-gray-500 mb-4">
                      Perfect with: {review.meal}
                    </p>
                  )}
                  <Link
                    href={`/review/${review.titleSlug}`}
                    className="block text-center text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition" style={{background:"#d4739fff"}}
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
      <footer className="bg-black text-gray-400 py-12 mt-12">
        <div className="container mx-auto text-center px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <Image src="/images/logo.png" alt="Logo" width={120} height={60} />
            <p className="mt-4 text-sm">
              Books&Bites – your destination for insightful book reviews.
            </p>
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
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm">
          &copy; 2025 Books&Bites. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}