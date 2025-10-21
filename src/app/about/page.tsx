// src/app/about/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Footer from "../component/Footer";

interface Profile {
  name: string;
  slug: string;
  avatar: string;
  quote: string;
  favoriteBook: string;
  currentReading: string;
  alignment: 'left' | 'center' | 'right';
  order: number;
}

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const snap = await getDocs(collection(db, "profiles"));
        const profilesData = snap.docs.map(doc => doc.data() as Profile);
        profilesData.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProfiles(profilesData);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-black"
      }`}>
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Books&Bites" width={50} height={50} />
          </Link>

          <div className="hidden lg:flex items-center space-x-10 font-medium text-base">
            <Link href="/" className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-colors`}>
              Home
            </Link>
            <Link href="/#reviews" className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-colors`}>
              Reviews
            </Link>
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
              <Link href="/#reviews" onClick={closeMobileMenu} className="text-base font-medium hover:text-[#d4739f]">
                Reviews
              </Link>
              <Link href="/about" onClick={closeMobileMenu} className="text-base font-medium hover:text-[#d4739f]">
                About
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-block px-5 py-2 bg-[#d4739f]/10 border border-[#d4739f]/30 rounded-full text-[#d4739f] text-sm font-bold uppercase tracking-wider mb-6">
            About Us
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Meet Our Book Lovers
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We&apos;re a passionate team of readers sharing honest reviews, thoughtful recommendations, and our love for literature with the world.
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-white">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-[#d4739f] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading team...</p>
          </div>
        ) : (
          <div className="w-full space-y-0">
            {profiles.map((profile, index) => (
              <div 
                key={profile.slug}
                className={`w-full py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="container mx-auto px-6">
                  <div className={`flex flex-col ${
                    profile.alignment === 'left' ? 'md:flex-row' :
                    profile.alignment === 'right' ? 'md:flex-row-reverse' :
                    'md:flex-row'
                  } items-center gap-12 max-w-6xl ${
                    profile.alignment === 'center' ? 'mx-auto' :
                    profile.alignment === 'left' ? 'mr-auto' :
                    'ml-auto'
                  }`}>
                    
                    {/* Avatar - Just Image */}
                    <div className={`flex-shrink-0 ${profile.alignment === 'center' ? 'md:w-1/2' : 'md:w-1/3'}`}>
                      <Link href={`/profile/${profile.slug}`} className="block group">
                        <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none overflow-hidden transition-all duration-300 group-hover:scale-105">
                          <div className="w-full h-full flex items-center justify-center text-9xl">
                            👤
                          </div>
                          {/* Remplacez par vos vraies images:
                          <Image 
                            src={profile.avatar} 
                            alt={profile.name}
                            fill
                            className="object-cover"
                            priority
                          />
                          */}
                        </div>
                      </Link>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${profile.alignment === 'center' ? 'text-center' : profile.alignment === 'right' ? 'text-right' : 'text-left'} space-y-6`}>
                      <div>
                        <Link href={`/profile/${profile.slug}`}>
                          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 hover:text-[#d4739f] transition-colors cursor-pointer">
                            {profile.name}
                          </h2>
                        </Link>
                        <p className="text-xl text-gray-600 italic leading-relaxed max-w-xl">
                          &quot;{profile.quote}&quot;
                        </p>
                      </div>

                      <div className="space-y-4 pt-6">
                        <div className={`inline-block ${profile.alignment === 'center' ? '' : 'block'}`}>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                            Favorite Book
                          </span>
                          <p className="text-xl text-gray-900 font-bold">{profile.favoriteBook}</p>
                        </div>

                        <div className={`inline-block ${profile.alignment === 'center' ? '' : 'block'}`}>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                            Currently Reading
                          </span>
                          <p className={`text-xl text-[#d4739f] font-bold flex items-center gap-2 ${profile.alignment === 'center' ? 'justify-center' : profile.alignment === 'right' ? 'justify-end' : ''}`}>
                            <span>📖</span>
                            {profile.currentReading}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Link
                          href={`/profile/${profile.slug}`}
                          className="inline-flex items-center gap-2 text-[#d4739f] font-semibold hover:gap-3 transition-all"
                        >
                          View Profile
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-300 text-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-[#d4739f] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                ✍️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Honest Reviews</h3>
              <p className="text-gray-400 leading-relaxed">
                We believe in authentic, thoughtful reviews that help readers discover their next favorite book.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                💬
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Building Community</h3>
              <p className="text-gray-400 leading-relaxed">
                Books bring people together. We&apos;re creating a space where readers can connect and share.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Curated Selections</h3>
              <p className="text-gray-400 leading-relaxed">
                From bestsellers to hidden gems, we carefully select books across all genres.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="w-14 h-14 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-6">
                ☕
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Perfect Pairings</h3>
              <p className="text-gray-400 leading-relaxed">
                Reading is best enjoyed with the perfect beverage. We suggest pairings for your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}