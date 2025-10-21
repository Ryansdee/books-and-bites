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
    <footer className="bg-black text-gray-400 py-16">
      <div className="container mx-auto px-6">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-3">
              Join Our Newsletter
            </h4>
            <p className="text-gray-400 mb-6">
              Get the latest book reviews and recommendations delivered to your inbox
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === "loading"}
                className="flex-1 px-5 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-[#d4739f] text-white rounded-lg font-semibold hover:bg-[#b85c89] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {message && (
              <p className={`mt-4 text-sm ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}>
                {status === "success" ? "✓" : "✗"} {message}
              </p>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center sm:text-left">
          <div>
            <div className="flex justify-center sm:justify-start mb-4">
              <Image src="/images/logo.png" alt="Logo" width={80} height={40} />
            </div>
            <p className="text-sm leading-relaxed">
              Books&Bites – your destination for insightful book reviews
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 text-base">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#d4739f] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#reviews" className="hover:text-[#d4739f] transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#d4739f] transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 text-base">Follow Us</h5>
            <a
              href="https://www.instagram.com/bookssnbites/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#d4739f] rounded-lg font-semibold hover:bg-[#b85c89] transition-colors text-white"
            >
              <span>📸</span>
              Instagram
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Books&Bites. Made with <span className="text-[#d4739f]">♥</span> for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
}