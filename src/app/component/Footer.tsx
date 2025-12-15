"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus("success");
      setMessage(data.message || "Successfully subscribed!");
      setEmail("");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-400 overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4739f] rounded-full blur-3xl animate-pulse-slow animation-delay-2"></div>
      </div>

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4739f] to-transparent"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Newsletter Section */}
        <div className="mb-16 pb-16 border-b border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[#d4739f] font-semibold text-sm uppercase tracking-wider">Newsletter</span>
              <h4 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
                Stay In The Loop
              </h4>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-gray-400 max-w-xl mx-auto">
                Get exclusive book reviews, curated recommendations, and literary insights delivered straight to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d4739f] via-[#f0a0c5] to-[#d4739f] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={status === "loading"}
                      className="w-full px-6 py-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group/btn relative px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <span className="relative z-10 text-white flex items-center justify-center gap-2">
                      {status === "loading" ? (
                        <>
                          <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4739f] to-[#b85c89] group-hover/btn:scale-105 transition-transform duration-300"></div>
                  </button>
                </div>
              </div>
            </form>

            {message && (
              <div className={`mt-6 text-center animate-fade-in`}>
                <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl ${
                  status === "success" 
                    ? "bg-green-500/10 border border-green-500/30 text-green-400" 
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}>
                  {status === "success" ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#d4739f]/30 group-hover:ring-[#d4739f] transition-all duration-300">
                <Image src="/images/logo.png" alt="Books&Bites Logo" fill className="object-cover" />
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">Books&Bites</span>
                <span className="text-xs text-[#d4739f]">Literary Excellence</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Your destination for thoughtful book reviews, curated recommendations, and a passionate community of readers celebrating the art of storytelling.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/bookssnbites/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4739f] to-[#b85c89]"></div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-[#d4739f] to-transparent rounded-full"></span>
              Quick Links
            </h5>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Reviews", href: "#reviews" },
                { label: "About Us", href: "/about" },
                { label: "Our Readers", href: "/#readers" }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-[#d4739f] transition-colors duration-300"
                  >
                    <span className="w-0 h-px bg-[#d4739f] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h5 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-[#d4739f] to-transparent rounded-full"></span>
              Connect
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-[#d4739f]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-lg">📧</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <a href="mailto:contact@booksbites.com" className="hover:text-[#d4739f] transition-colors">
                    contact@booksbites.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-[#d4739f]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Based in</div>
                  <span>Belgium</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © 2025 Books&Bites. Crafted with <span className="text-[#d4739f] animate-pulse">♥</span> for book lovers everywhere
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-[#d4739f] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#d4739f] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-[#d4739f] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4739f] to-transparent"></div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animation-delay-2 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
}