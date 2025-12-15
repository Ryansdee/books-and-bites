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
  alignment?: 'left' | 'center' | 'right';
  order?: number;
}

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}>
        <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#d4739f]/30 group-hover:ring-[#d4739f] transition-all duration-300">
              <Image src="/images/logo.png" alt="Logo" width={48} height={48} className="object-cover" />
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
            <Link
              href="/#reviews"
              className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-all duration-300 relative group`}
            >
              Reviews
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4739f] to-transparent group-hover:w-full transition-all duration-500"></span>
            </Link>
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
              <Link href="/#reviews" onClick={closeMobileMenu} className="text-base font-medium text-gray-900 hover:text-[#d4739f] transition-colors">
                Reviews
              </Link>
              <Link href="/about" onClick={closeMobileMenu} className="text-base font-medium text-gray-900 hover:text-[#d4739f] transition-colors">
                About
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-[#d4739f] rounded-full animate-pulse"></div>
            About Books&Bites
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Meet The Readers
            <span className="block mt-2 bg-gradient-to-r from-[#d4739f] via-[#f0a0c5] to-[#d4739f] bg-clip-text text-transparent">
              Behind The Reviews
            </span>
          </h1>

          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent mx-auto mb-8"></div>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A passionate team of book enthusiasts dedicated to sharing honest reviews and thoughtful recommendations.
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-20 h-20 relative">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#d4739f] rounded-full animate-spin"></div>
            </div>
            <p className="mt-8 text-gray-600 font-medium text-lg">Loading our amazing team...</p>
          </div>
        ) : (
          <div className="w-full space-y-24">
            {profiles.map((profile, index) => (
              <div 
                key={profile.slug}
                className="w-full"
              >
                <div className="container mx-auto px-6">
                  <div className={`flex flex-col ${
                    (profile.alignment === 'right' || index % 2 === 1) ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } items-center gap-16 max-w-7xl mx-auto`}>
                    
                    {/* Avatar */}
                    <div className="flex-shrink-0 lg:w-1/2">
                      <Link href={`/profile/${profile.slug}`} className="block group">
                        <div className="relative">
                          <div className="absolute -inset-4 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                          
                          <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-3xl border-2 border-gray-200 group-hover:border-[#d4739f]/50 transition-all duration-500 shadow-2xl">
                            <Image 
                              src={profile.avatar} 
                              alt={profile.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              priority
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center justify-center gap-2 text-gray-900 font-semibold">
                                View Full Profile
                                <svg className="w-5 h-5 text-[#d4739f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-8">
                      <div>
                        <Link href={`/profile/${profile.slug}`} className="group inline-block">
                          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 group-hover:text-[#d4739f] transition-colors duration-300">
                            {profile.name}
                          </h2>
                        </Link>
                        
                        <div className="relative pl-6 border-l-4 border-[#d4739f]/30">
                          <p className="text-xl sm:text-2xl text-gray-600 italic leading-relaxed">
                            &quot;{profile.quote}&quot;
                          </p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-8 pt-6">
                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f]/5 to-transparent rounded-2xl"></div>
                          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 group-hover:border-[#d4739f]/30 transition-all duration-300 shadow-sm hover:shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                                ⭐
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Favorite Book
                              </span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{profile.favoriteBook}</p>
                          </div>
                        </div>

                        <div className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f]/5 to-transparent rounded-2xl"></div>
                          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 group-hover:border-[#d4739f]/30 transition-all duration-300 shadow-sm hover:shadow-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                                📖
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Currently Reading
                              </span>
                            </div>
                            <p className="text-xl font-bold text-[#d4739f]">{profile.currentReading}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Link
                          href={`/profile/${profile.slug}`}
                          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                          <span className="relative z-10 text-white">Discover {profile.name}&apos;s Reviews</span>
                          <svg className="relative z-10 w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#d4739f] to-[#b85c89]"></div>
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
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4739f]/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4739f]/20 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#d4739f] font-semibold text-sm uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4 text-gray-900">
              Why We Do What We Do
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our mission is to connect readers with exceptional books through honest reviews
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "✍️",
                title: "Honest Reviews",
                description: "Authentic, thoughtful reviews that help readers discover books they'll truly love."
              },
              {
                icon: "💬",
                title: "Building Community",
                description: "Creating a welcoming space where readers connect and celebrate literature together."
              },
              {
                icon: "🎯",
                title: "Curated Selections",
                description: "Carefully chosen books across all genres, from bestsellers to hidden gems."
              },
              {
                icon: "☕",
                title: "Perfect Pairings",
                description: "Enhancing your reading experience with expertly matched recommendations."
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4739f]/5 to-transparent rounded-3xl"></div>
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 group-hover:border-[#d4739f]/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[#d4739f] font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-4 text-gray-900">
              What We Stand For
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { emoji: "💎", title: "Authenticity", text: "Every review reflects genuine opinions and honest impressions" },
              { emoji: "📚", title: "Diversity", text: "Celebrating books from all genres, cultures, and perspectives" },
              { emoji: "🤝", title: "Community", text: "Building meaningful connections through shared love of reading" }
            ].map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#d4739f] to-[#b85c89] rounded-full flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  {value.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to discover your next favorite book?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join our community and explore reviews curated by passionate readers.
            </p>
            <Link
              href="/#reviews"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105"
            >
              <span className="relative z-10 text-white">Explore Our Reviews</span>
              <svg className="relative z-10 w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4739f] to-[#b85c89]"></div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}