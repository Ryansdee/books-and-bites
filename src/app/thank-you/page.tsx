"use client";
import Link from "next/link";
import Image from "next/image";

export default function ThankYouPage() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-xl">
        <Image
          src="/images/logo.png"
          alt="Books&Bites Logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Your message has been successfully sent. We'll get back to you soon.
        </p>
        <Link
          href="/"
          className="inline-block bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
