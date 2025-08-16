"use client";

import { useEffect, useState, useCallback, useMemo} from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCo0Slu-sw1Bj3yrBEpnunUSkCv1Mbzoco",
  authDomain: "books-and-bites-review.firebaseapp.com",
  projectId: "books-and-bites-review",
  storageBucket: "books-and-bites-review.appspot.com",
  messagingSenderId: "714302422646",
  appId: "1:714302422646:web:046f51a7003578eb942957",
  measurementId: "G-XGLFCB1X61",
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

const FLOATING_EMOJIS = ['🌸', '💕', '✨', '🦋', '🌺', '💖', '🎀', '🌙'];

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Optimized scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch reviews with error handling
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(doc => doc.data() as Review));
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // You could add a toast notification here
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Optimized search filter
  const filteredReviews = useMemo(() => {
    if (!searchQuery) return reviews;
    return reviews.filter(review => 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.categories?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviews, searchQuery]);

  // Optimized star rendering
  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-lg transition-colors duration-300 ${
          i < rating ? 'text-pink-400' : 'text-gray-300'
        }`}
      >
        ✨
      </span>
    ));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Scroll to reviews section
  const scrollToReviews = useCallback(() => {
    const reviewsSection = document.getElementById('reviews');
    reviewsSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 min-h-screen">
      {/* Optimized floating elements - reduced for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {FLOATING_EMOJIS.slice(0, 4).map((emoji, i) => (
          <div
            key={i}
            className="absolute text-xl sm:text-2xl opacity-20 animate-bounce"
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${20 + (i * 15)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Optimized Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xl'
          : 'bg-gradient-to-r from-[#ffbdc8] via-pink-300 to-[#f00b0d]'
      }`}>
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`transition-colors duration-300 ${isScrolled ? 'text-pink-500' : 'text-white'}`}>
              <Image src="/images/logo.png" alt="Logo" width={80} height={80} />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${isScrolled ? 'text-gray-700 hover:text-pink-500 hover:bg-pink-50' : 'text-white hover:text-pink-200 hover:bg-white/10'}`}>Home</Link>
            <button onClick={scrollToReviews} className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${isScrolled ? 'text-gray-700 hover:text-pink-500 hover:bg-pink-50' : 'text-white hover:text-pink-200 hover:bg-white/10'}`}>Reviews</button>
            <Link href="/about" className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${isScrolled ? 'text-gray-700 hover:text-pink-500 hover:bg-pink-50' : 'text-white hover:text-pink-200 hover:bg-white/10'}`}>About</Link>
            <Link href="/contact" className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${isScrolled ? 'text-gray-700 hover:text-pink-500 hover:bg-pink-50' : 'text-white hover:text-pink-200 hover:bg-white/10'}`}>Contact</Link>
          </div>

          {/* Mobile Button */}
          <button onClick={toggleMobileMenu} className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:bg-pink-50' : 'text-white hover:bg-white/10'}`} aria-label="Toggle menu">
            <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md shadow-2xl border-t border-pink-200 transition-all duration-300 overflow-hidden">
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
              <Link href="/" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg font-medium">Home</Link>
              <button onClick={() => { closeMobileMenu(); scrollToReviews(); }} className="block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg font-medium">Reviews</button>
              <Link href="/about" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg font-medium">About</Link>
              <Link href="/contact" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg font-medium">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Optimized for mobile */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        {/* Background Image with better mobile optimization */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-pink-400/60"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <div className="relative w-140 h-auto mx-auto">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 drop-shadow-2xl leading-tight px-4">
            Discover your next
            <span className="block text-pink-100">magical read</span>
          </h2>

          <p className="text-lg sm:text-xl text-pink-100 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Where every book is a sweet adventure waiting to be savored 💕
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
            <Link
              href="/add-review"
              className="bg-white text-[#f00b0d] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transform transition-all duration-300 group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Add Your Review</span>
                <span className="group-hover:animate-spin">💖</span>
              </span>
            </Link>
            <button 
              onClick={scrollToReviews}
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#f00b0d] transform hover:scale-105 transition-all duration-300 shadow-2xl backdrop-blur-sm"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Explore Magic</span>
                <span className="animate-bounce">✨</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Search Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books, genres... 📚"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none bg-white/90 text-gray-700 font-medium shadow-lg text-center sm:text-left"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - Optimized Grid */}
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16" id="reviews">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-[#f00b0d]">Latest</span> Sweet Reviews 
            <span className="inline-block ml-2">🍒</span>
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Fresh from our cozy reading nook, with love and lots of tea ☕️✨
          </p>
          {searchQuery && (
            <p className="mt-4 text-pink-600 font-medium">
              Found {filteredReviews.length} results for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading ? (
            // Optimized loading state
            <div className="col-span-full flex flex-col justify-center items-center py-16 sm:py-20">
              <div className="relative mb-6">
                <div className="animate-spin text-4xl sm:text-6xl">🍒</div>
                <div className="absolute -top-1 -right-1 animate-bounce text-lg sm:text-2xl">✨</div>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 mb-4">Loading magical reviews...</p>
              <div className="flex space-x-2">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i}
                    className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          ) : filteredReviews.length === 0 ? (
            // No results state
            <div className="col-span-full text-center py-16 sm:py-20">
              <div className="text-4xl sm:text-6xl mb-4">📚</div>
              <p className="text-lg sm:text-xl text-gray-600 mb-2">
                {searchQuery ? 'No books found' : 'No reviews yet'}
              </p>
              <p className="text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Be the first to add a review!'}
              </p>
            </div>
          ) : (
            // Optimized review cards
            filteredReviews.map((review, index) => (
              <div
                key={review.titleSlug}
                className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-pink-100 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-200/20 transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Optimized image */}
                <div className="relative overflow-hidden w-auto h-50 mx-auto"> 
                  <Image
                    src={review.imageUrl}
                    alt={review.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <span className="text-lg">💕</span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <span className="bg-gradient-to-r from-pink-200 to-rose-200 text-[#f00b0d] px-3 py-1 rounded-full text-sm font-semibold shadow-sm self-start">
                      {review.categories || "General"} ✨
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-gray-600 ml-2 font-semibold text-sm">{review.rating}/5</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-[#f00b0d] transition-colors duration-300 line-clamp-2">
                    {review.title}
                  </h4>
                  
                  {review.meal && (
                    <div className="bg-pink-50 rounded-xl sm:rounded-2xl p-3 mb-4 transform scale-95 group-hover:scale-100 transition-transform duration-300">
                      <p className="text-sm text-gray-600 flex items-start sm:items-center gap-2">
                        <span className="text-base">🫖</span>
                        <span>
                          <span className="font-medium">Perfect with:</span>
                          <span className="block sm:inline sm:ml-1">{review.meal}</span>
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <Link
                    href={`/review/${review.titleSlug}`}
                    className="block text-center bg-gradient-to-r from-[#ffbdc8] to-[#f00b0d] text-white px-4 sm:px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Read This Sweetness</span>
                      <span className="animate-bounce">📖💕</span>
                    </span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Optimized Footer */}
      <footer className="bg-gray-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 text-center sm:text-left lg:col-span-1">
              <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                <span className="text-2xl sm:text-3xl group-hover:animate-spin transition-transform duration-300">🍒</span>
                <h4 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                  Books&Bites
                </h4>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Your cozy corner for book reviews, warm recommendations, and literary love 💕
              </p>
              <div className="flex justify-center sm:justify-start space-x-2">
                {['🌸', '📚', '☕️', '💕'].map((emoji, i) => (
                  <span 
                    key={i} 
                    className="text-xl sm:text-2xl opacity-60 hover:opacity-100 animate-bounce cursor-pointer" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
            
            {[
              { title: "Navigation", items: ["Home", "Reviews", "Genres", "Authors"] },
              { title: "Connect", items: ["Instagram 📸"] }
            ].map((section, i) => (
              <div key={i} className="text-center sm:text-left">
                <h5 className="font-bold mb-4 sm:mb-6 text-pink-300 text-lg">{section.title}</h5>
                <ul className="space-y-2 sm:space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-pink-300 transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              &copy; 2025 Books&Bites. All rights reserved. Made with 
              <span className="text-pink-400 animate-pulse mx-1">💕</span> 
              and lots of 
              <span className="animate-bounce inline-block mx-1">🍒</span>
              for book lovers everywhere.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom optimized styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}