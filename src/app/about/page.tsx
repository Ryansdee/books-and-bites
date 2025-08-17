"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const FLOATING_EMOJIS = ["📚", "🍒", "💖", "✨"];

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 min-h-screen">
      {/* Floating emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {FLOATING_EMOJIS.slice(0, 4).map((emoji, i) => (
          <div
            key={i}
            className="absolute text-xl sm:text-2xl opacity-20 animate-bounce"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl"
            : "bg-gradient-to-r from-[#ffbdc8] via-pink-300 to-[#f00b0d]"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className={`transition-colors duration-300 ${
                isScrolled ? "text-pink-500" : "text-white"
              }`}
            >
              <Image src="/images/logo.png" alt="Logo" width={80} height={80} />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${
                isScrolled
                  ? "text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                  : "text-white hover:text-pink-200 hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              href="/#reviews"
              className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${
                isScrolled
                  ? "text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                  : "text-white hover:text-pink-200 hover:bg-white/10"
              }`}
            >
              Reviews
            </Link>
            <Link
              href="/about"
              className={`relative px-3 py-2 font-medium transition-all duration-300 rounded-lg ${
                isScrolled
                  ? "text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                  : "text-white hover:text-pink-200 hover:bg-white/10"
              }`}
            >
              About
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled ? "text-gray-700 hover:bg-pink-50" : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div
            className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 pointer-events-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900">
                  Navigation
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="p-4 space-y-2">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Home
                </Link>
                <Link
                  href="/#reviews"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Reviews
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  About
                </Link>
              </nav>

              <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  &copy; 2025 Books&Bites. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mx-auto text-center px-4 sm:px-6">
            <Image src={"/images/logo.png"} alt={""} width={360} height={240} className="mx-auto mb-8" />
          Still writing the last chapter...
        </h1>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo + description */}
            <div className="space-y-4 text-center sm:text-left lg:col-span-1">
              <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={240}
                  height={120}
                  className="w-auto h-auto rounded-full transition-transform duration-300"
                />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Your cozy corner for book reviews, warm recommendations, and literary love 💕
              </p>
            </div>

            {/* Navigation */}
            <div className="text-center sm:text-left">
              <h5 className="font-bold mb-4 sm:mb-6 text-pink-300 text-lg">Navigation</h5>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-pink-300 transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#reviews" className="text-gray-400 hover:text-pink-300 transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-pink-300 transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1">
                    Genres
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-pink-300 transition-all duration-300 text-sm sm:text-base inline-block hover:translate-x-1">
                    Authors
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="text-center sm:text-left">
              <h5 className="font-bold mb-4 sm:mb-6 text-pink-300 text-lg">Connect</h5>
              <ul className="space-y-2 sm:space-y-3 flex justify-center sm:justify-start">
                <li>
                  <Link
                    href="https://www.instagram.com/bookssnbites/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-pink-300 transition-all duration-300 text-sm sm:text-base space-x-2"
                  >
                    <span>Instagram</span>
                    <Image src="/images/insta.png" alt="Instagram" width={20} height={20} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-12 text-center">
            &copy; 2025 Books&Bites. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
