// src/app/admin/profile/[name]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import Link from "next/link";
import Image from "next/image";

interface Profile {
  name: string;
  slug: string;
  avatar: string;
  quote: string;
  favoriteBook: string;
  currentReading: string;
  bio?: string;
}

export default function AdminProfileEditPage() {
  const params = useParams();
  const router = useRouter();
  const name = params?.name as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form state
  const [quote, setQuote] = useState("");
  const [favoriteBook, setFavoriteBook] = useState("");
  const [currentReading, setCurrentReading] = useState("");

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
          const profileData = snap.docs[0].data() as Profile;
          setProfile(profileData);
          setQuote(profileData.quote);
          setFavoriteBook(profileData.favoriteBook);
          setCurrentReading(profileData.currentReading);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setSaving(true);
    setSuccessMessage("");
    
    try {
      // Trouver le document ID
      const q = query(
        collection(db, "profiles"), 
        where("slug", "==", name)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const docId = snap.docs[0].id;
        const docRef = doc(db, "profiles", docId);
        
        await updateDoc(docRef, {
          quote,
          favoriteBook,
          currentReading,
        });
        
        setSuccessMessage("Profile updated successfully!");
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push(`/profile/${name}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Books&Bites" width={50} height={50} />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/profile/${name}`}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              View Profile
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

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
              👤
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Edit Profile: {profile.name}
            </h1>
            <p className="text-gray-600">Update your reading preferences and quote</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium flex items-center gap-2">
                <span>✓</span>
                {successMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-8">
            {/* Quote */}
            <div>
              <label htmlFor="quote" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                Your Quote
              </label>
              <textarea
                id="quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all resize-none"
                placeholder="Enter your inspirational quote about books..."
              />
              <p className="mt-2 text-sm text-gray-500">
                This quote will appear on your profile and the About page
              </p>
            </div>

            {/* Favorite Book */}
            <div>
              <label htmlFor="favoriteBook" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                Favorite Book
              </label>
              <input
                type="text"
                id="favoriteBook"
                value={favoriteBook}
                onChange={(e) => setFavoriteBook(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all"
                placeholder="Enter your all-time favorite book..."
              />
            </div>

            {/* Currently Reading */}
            <div>
              <label htmlFor="currentReading" className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                Currently Reading
              </label>
              <input
                type="text"
                id="currentReading"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-lg focus:border-[#d4739f] focus:ring-2 focus:ring-[#d4739f]/20 outline-none transition-all"
                placeholder="What are you reading right now..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Update this whenever you start a new book
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-8 py-4 bg-[#d4739f] text-white font-bold rounded-lg hover:bg-[#b85c89] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={`/profile/${name}`}
                className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            Quick Tip
          </h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            Your changes will be visible immediately on your profile page and the About page. 
            Make sure to keep your "Currently Reading" updated so your readers know what you're enjoying!
          </p>
        </div>
      </main>
    </div>
  );
}