"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../component/Footer";

export default function ContactPage() {
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
            <Link href="/contact" className={`${isScrolled ? "text-gray-900" : "text-white"} hover:text-[#d4739f] transition-colors`}>
              Contact
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
              <Link href="/contact" onClick={closeMobileMenu} className="text-base font-medium hover:text-[#d4739f]">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="inline-block px-5 py-2 bg-[#d4739f]/10 border border-[#d4739f]/30 rounded-full text-[#d4739f] text-sm font-bold uppercase tracking-wider mb-6">
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Let's Talk Books
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a book recommendation? A question about our reviews? Or just want to chat about your latest read? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <main className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12">
            <form 
              name="contact" 
              method="POST" 
              data-netlify="true"
              action="/thank-you"
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Book recommendation, Question, etc."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#d4739f] text-white font-bold rounded-lg hover:bg-[#b85c89] transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-12 grid md:grid-cols-1 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl mb-4">
                📸
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Follow Us</h3>
              <a
                href="https://www.instagram.com/bookssnbites/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4739f] font-semibold hover:underline"
              >
                @bookssnbites
              </a>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>💡</span>
              Response Time
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We typically respond within 24-48 hours. In the meantime, feel free to explore our latest reviews or join our newsletter to stay updated!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}