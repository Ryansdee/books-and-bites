// src/app/profile/[name]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../component/Footer";

interface Profile {
  name: string;
  slug: string;
  avatar: string;
  quote: string;
  favoriteBook: string;
  currentReading: string;
  bio?: string;
}

export default function ProfilePage() {
  const { name } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!name) return;
      
      try {
        const q = query(
          collection(db, "profiles"), 
          where("slug", "==", name)
        );
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          setProfile(snap.docs[0].data() as Profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-[#d4739f] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">👤</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-8">This profile does not exist.</p>
          <Link
            href="/about"
            className="inline-flex items-center px-8 py-3 bg-[#d4739f] text-white font-semibold rounded-lg hover:bg-[#b85c89] transition-colors"
          >
            ← Back to About
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Books&Bites" width={50} height={50} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden sm:block text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link href="/about" className="hidden sm:block text-gray-300 hover:text-white transition-colors font-medium">
              About
            </Link>
            <Link
              href={`/admin/profile/${name}`}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
            >
              <span>✏️</span>
              Edit
            </Link>
            <Link
              href="/about"
              className="px-6 py-2.5 rounded-lg bg-[#d4739f] text-white font-semibold hover:bg-[#b85c89] transition-colors"
            >
              ← Back
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative w-48 h-48 mb-8">
              <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-2xl">
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-[#d4739f] rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-gray-900">
                📚
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6">{profile.name}</h1>
            <p className="text-2xl text-gray-300 italic max-w-2xl leading-relaxed">
              &quot;{profile.quote}&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Bio Section (optionnel) */}
          {profile.bio && (
            <div className="mb-12 text-center">
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Reading Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Favorite Book */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#d4739f] rounded-lg flex items-center justify-center text-2xl">
                  ⭐
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
                  Favorite Book
                </h3>
              </div>
              <p className="text-2xl font-black text-gray-900 leading-tight">
                {profile.favoriteBook}
              </p>
            </div>

            {/* Currently Reading */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                  📖
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">
                  Currently Reading
                </h3>
              </div>
              <p className="text-2xl font-black text-gray-900 leading-tight">
                {profile.currentReading}
              </p>
            </div>
          </div>

          {/* Quote Card */}
          <div className="mt-12 bg-black text-white rounded-2xl p-10 text-center">
            <p className="text-xl md:text-2xl italic leading-relaxed">
              &quot;{profile.quote}&quot;
            </p>
            <p className="mt-6 text-gray-400 font-semibold">
              — {profile.name}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#d4739f] text-white font-bold rounded-lg hover:bg-[#b85c89] transition-all"
            >
              <span>←</span>
              Meet the Team
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}