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

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="relative bg-white text-gray-900 min-h-screen">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#d4739f]/30 group-hover:ring-[#d4739f] transition-all duration-300">
              <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-xl block ${isScrolled ? "text-gray-900" : "text-white"}`}>
                Books&Bites
              </span>
              <span className="text-xs text-[#d4739f]">Literary Excellence</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-12 font-medium">
            <Link 
              href="/" 
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-all duration-300 relative group`}
            >
              Home
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4739f] to-transparent group-hover:w-full transition-all duration-500"></span>
            </Link>
            <button
              onClick={scrollToReviews}
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-all duration-300 relative group`}
            >
              Reviews
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4739f] to-transparent group-hover:w-full transition-all duration-500"></span>
            </button>
            <Link 
              href="/about" 
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-all duration-300 relative group`}
            >
              About
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4739f] to-transparent group-hover:w-full transition-all duration-500"></span>
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-3 rounded-xl text-white bg-[#d4739f] hover:bg-[#b85c89] transition-all duration-300 shadow-lg"
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
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100">
            <nav className="flex flex-col items-center py-8 space-y-6">
              <Link href="/" onClick={closeMobileMenu} className="text-base font-medium text-gray-900 hover:text-[#d4739f] transition-colors">
                Home
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  scrollToReviews();
                }}
                className="text-base font-medium text-gray-900 hover:text-[#d4739f] transition-colors"
              >
                Reviews
              </button>
              <Link href="/about" onClick={closeMobileMenu} className="text-base font-medium text-gray-900 hover:text-[#d4739f] transition-colors">
                About
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Artistic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          
          {/* Animated Mesh Gradient */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#d4739f]/20 via-transparent to-transparent animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#d4739f]/20 via-transparent to-transparent animate-pulse-slow animation-delay-2"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float animation-delay-3"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Text content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-sm font-medium">
                <div className="w-2 h-2 bg-[#d4739f] rounded-full animate-pulse"></div>
                Curated Literary Experience
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                  Where Stories
                  <span className="block mt-2 bg-gradient-to-r from-[#d4739f] via-[#f0a0c5] to-[#d4739f] bg-clip-text text-transparent animate-gradient">
                    Come Alive
                  </span>
                </h1>
                <div className="w-32 h-1.5 bg-gradient-to-r from-[#d4739f] to-transparent rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
                Immerse yourself in thoughtfully curated book reviews, discover hidden literary gems, and join a community that celebrates the art of reading.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                <button
                  onClick={scrollToReviews}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#d4739f] to-[#b85c89] text-white rounded-xl font-semibold overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4739f]/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Our Library
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b85c89] to-[#d4739f] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </button>
                <Link
                  href="/about"
                  className="group px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 border-2 border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
                >
                  About Us
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
                <div className="text-center lg:text-left group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#d4739f] to-[#f0a0c5] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                    {reviews.length}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Books Reviewed</div>
                </div>
                <div className="text-center lg:text-left group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#d4739f] to-[#f0a0c5] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Expert Readers</div>
                </div>
                <div className="text-center lg:text-left group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#d4739f] to-[#f0a0c5] bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                    {avgRating}★
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Right side - Reader Showcase */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Saki - Left */}
              <div className="absolute top-12 left-0 w-72 animate-float">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 backdrop-blur-sm overflow-hidden">
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#d4739f]/20 to-transparent rounded-bl-full"></div>
                    
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500">
                      <Image src="/images/Saki.webp" alt="Saki" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-2xl font-bold">Saki</div>
                        <div className="text-sm text-gray-300">Literary Critic</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-[#d4739f] to-transparent rounded-full w-4/5"></div>
                      <div className="h-2 bg-gradient-to-r from-white/20 to-transparent rounded-full w-3/5"></div>
                    </div>
                    
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-full flex items-center justify-center text-3xl shadow-xl">
                      ☕
                    </div>
                  </div>
                </div>
              </div>

              {/* Loor - Center/Right */}
              <div className="absolute top-32 right-0 w-72 animate-float animation-delay-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 backdrop-blur-sm overflow-hidden">
                    {/* Decorative corner */}
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-[#d4739f]/20 to-transparent rounded-br-full"></div>
                    
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500">
                      <Image src="/images/Loor.webp" alt="Loor" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-2xl font-bold">Loor</div>
                        <div className="text-sm text-gray-300">Book Enthusiast</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-[#d4739f] to-transparent rounded-full w-4/5"></div>
                      <div className="h-2 bg-gradient-to-r from-white/20 to-transparent rounded-full w-2/3"></div>
                    </div>
                    
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-full flex items-center justify-center text-3xl shadow-xl">
                      ⭐
                    </div>
                  </div>
                </div>
              </div>

              {/* Ivana - Bottom Left */}
              <div className="absolute bottom-0 left-16 w-72 animate-float animation-delay-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 backdrop-blur-sm overflow-hidden">
                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#d4739f]/20 to-transparent rounded-tl-full"></div>
                    
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500">
                      <Image src="/images/Ivana.webp" alt="Ivana" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-2xl font-bold">Ivana</div>
                        <div className="text-sm text-gray-300">Reading Curator</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-[#d4739f] to-transparent rounded-full w-3/4"></div>
                      <div className="h-2 bg-gradient-to-r from-white/20 to-transparent rounded-full w-1/2"></div>
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-full flex items-center justify-center text-3xl shadow-xl">
                      📖
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm font-medium">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET OUR READERS SECTION */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4739f] font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Meet Our Readers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three passionate readers with diverse tastes and unique perspectives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Saki */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="h-80 relative overflow-hidden">
                  <Image src="/images/Saki.webp" alt="Saki" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-3xl font-bold text-white mb-1">Saki</h3>
                    <p className="text-white/80 text-sm">Literary Critic</p>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-xl">
                    ☕
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Specializes in contemporary fiction and loves pairing books with the perfect coffee blend.
                  </p>
                </div>
              </div>
            </div>

            {/* Loor */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="h-80 relative overflow-hidden">
                  <Image src="/images/Loor.webp" alt="Loor" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-3xl font-bold text-white mb-1">Loor</h3>
                    <p className="text-white/80 text-sm">Book Enthusiast</p>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-xl">
                    ⭐
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Passionate about fantasy and sci-fi, bringing fresh perspectives to every review.
                  </p>
                </div>
              </div>
            </div>

            {/* Ivana */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="h-80 relative overflow-hidden">
                  <Image src="/images/Ivana.webp" alt="Ivana" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-3xl font-bold text-white mb-1">Ivana</h3>
                    <p className="text-white/80 text-sm">Reading Curator</p>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-xl">
                    📖
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    Curates diverse reading lists and explores hidden gems across all genres.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4739f]/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4739f]/20 to-transparent"></div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4739f] font-semibold text-sm uppercase tracking-wider">Experience</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Why Books&Bites?</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A sophisticated platform designed for discerning readers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f]/5 to-transparent rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white p-8 rounded-3xl border border-gray-100 group-hover:border-[#d4739f]/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  ✍️
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Authentic Reviews</h3>
                <p className="text-gray-600 leading-relaxed">
                  In-depth, honest reviews crafted by passionate readers who bring genuine insights and literary appreciation to every book they explore.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-[#d4739f] font-semibold text-sm">Discover More →</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f]/5 to-transparent rounded-3xl transform -rotate-2 group-hover:-rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white p-8 rounded-3xl border border-gray-100 group-hover:border-[#d4739f]/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  🎯
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Curated Selection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Carefully selected books across diverse genres, with detailed categorization and personalized recommendations tailored to your reading preferences.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-[#d4739f] font-semibold text-sm">Explore Library →</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f]/5 to-transparent rounded-3xl transform rotate-1 group-hover:rotate-3 transition-transform duration-500"></div>
              <div className="relative bg-white p-8 rounded-3xl border border-gray-100 group-hover:border-[#d4739f]/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  ☕
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Perfect Pairings</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enhance your reading experience with expertly matched beverage and snack recommendations that complement each book's atmosphere and mood.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-[#d4739f] font-semibold text-sm">See Pairings →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Find Your Next Adventure</h2>
            <p className="text-lg text-gray-600">Search through our curated collection of reviewed books</p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4739f] via-[#f0a0c5] to-[#d4739f] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-3">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-4 rounded-xl border-0 focus:ring-0 outline-none text-base bg-transparent placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="flex-shrink-0 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <main className="relative py-24 bg-white" id="reviews">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#d4739f] font-semibold text-sm uppercase tracking-wider">Collection</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4">Featured Reviews</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our latest book reviews and discover your next favorite read
            </p>
          </div>

          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block w-20 h-20 relative">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#d4739f] rounded-full animate-spin"></div>
              </div>
              <p className="mt-8 text-gray-600 font-medium text-lg">Curating your reading list...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-32 bg-gradient-to-b from-gray-50 to-white rounded-3xl">
              <div className="text-8xl mb-8">📚</div>
              <p className="text-3xl text-gray-900 mb-4 font-bold">
                {searchQuery ? "No books found" : "No reviews yet"}
              </p>
              <p className="text-gray-500 text-lg mb-8">
                {searchQuery ? "Try adjusting your search terms" : "Stay tuned for our upcoming reviews"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-8 py-4 bg-gradient-to-r from-[#d4739f] to-[#b85c89] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#d4739f]/30 transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredReviews.map((review, index) => (
                <div
                  key={review.titleSlug}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#d4739f]/30 hover:-translate-y-2">
                    
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden bg-gray-100">
                      <Image
                        src={review.imageUrl}
                        alt={review.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5">
                        <span className="text-[#d4739f] font-bold">{review.rating}.0</span>
                        <span className="text-[#d4739f]">★</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-[#d4739f]/10 to-transparent text-[#d4739f] rounded-full uppercase tracking-wide border border-[#d4739f]/20">
                          {review.categories || "General"}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-[#d4739f] transition-colors duration-300">
                        {review.title}
                      </h3>

                      {review.meal && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 bg-gray-50 rounded-xl px-4 py-2.5">
                          <span className="text-lg">☕</span>
                          <span className="line-clamp-1 font-medium">Pairs with: {review.meal}</span>
                        </div>
                      )}

                      <Link
                        href={`/review/${review.titleSlug}`}
                        className="group/btn relative block w-full text-center px-6 py-3.5 rounded-xl font-semibold overflow-hidden transition-all duration-300"
                      >
                        <span className="relative z-10 text-white group-hover/btn:text-white transition-colors">
                          Read Full Review
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d4739f] to-[#b85c89] group-hover/btn:scale-105 transition-transform duration-300"></div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA SECTION */}
      <section className="py-32 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Artistic Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#d4739f]/30 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#d4739f]/30 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow animation-delay-2"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block text-[#d4739f] font-semibold text-sm uppercase tracking-wider mb-6">Join Us</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Begin Your Literary
              <span className="block mt-2 bg-gradient-to-r from-[#d4739f] via-[#f0a0c5] to-[#d4739f] bg-clip-text text-transparent">
                Journey Today
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover thoughtfully curated reviews, connect with fellow readers, and never run out of exceptional books to explore.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={scrollToReviews}
                className="group px-10 py-5 bg-gradient-to-r from-[#d4739f] to-[#b85c89] text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#d4739f]/50 transition-all hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Reviews
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <Link
                href="/about"
                className="px-10 py-5 bg-white/5 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/20 hover:border-white/40 flex items-center justify-center gap-2"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }

        .animation-delay-1 {
          animation-delay: 1s;
        }

        .animation-delay-2 {
          animation-delay: 2s;
        }

        .animation-delay-3 {
          animation-delay: 3s;
        }

        .animation-delay-4 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}