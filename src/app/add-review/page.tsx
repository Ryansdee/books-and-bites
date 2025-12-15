"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import {
  Star,
  Upload,
  X,
  Camera,
  MessageSquare,
  Tag,
  Utensils,
  Send,
  User,
  BookOpen,
} from "lucide-react";
import Image from "next/image";

const AUTHORS = [
  { id: "books-and-bites", name: "Books & Bites", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { id: "loor", name: "Loor", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { id: "saki", name: "Saki", color: "bg-pink-100 text-pink-700 border-pink-300" },
  { id: "ivana", name: "Ivana", color: "bg-green-100 text-green-700 border-green-300" },
];

export default function AddReview() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [categories, setCategories] = useState("");
  const [meal, setMeal] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert("Please select an image");
      return;
    }
    
    if (rating === 0) {
      alert("Please give a rating");
      return;
    }
    
    if (!author) {
      alert("Please select who reviewed this book");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      const imageUrl = data.url;
      const titleSlug = slugify(title);

      await addDoc(collection(db, "reviews"), {
        title,
        titleSlug,
        rating,
        review,
        categories: categories.trim(),
        meal: meal.trim(),
        author,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Review added successfully!");
      router.push(`/review/${titleSlug}`);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error adding review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = (hoveredStar || rating) >= i;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredStar(i)}
          onMouseLeave={() => setHoveredStar(0)}
          className="transition-all duration-200 hover:scale-125 focus:outline-none focus:scale-125"
        >
          <Star
            className={`w-9 h-9 transition-colors duration-200 ${
              isFilled
                ? "fill-[#d4739f] text-[#d4739f]"
                : "text-gray-300 hover:text-[#d4739f]"
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d4739f] rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Submit a Review
          </h1>
          <p className="text-gray-600 text-lg">
            Share your literary journey with the community
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-8 border border-gray-100"
        >
          {/* Author Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <User className="w-5 h-5 text-[#d4739f]" />
              Reviewed by
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AUTHORS.map((auth) => (
                <button
                  key={auth.id}
                  type="button"
                  onClick={() => setAuthor(auth.id)}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                    author === auth.id
                      ? `${auth.color} border-current shadow-md scale-105`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {auth.name}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Camera className="w-5 h-5 text-[#d4739f]" />
              Book Cover
            </label>
            {!imagePreview ? (
              <label className="block cursor-pointer group">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-200 group-hover:border-[#d4739f] group-hover:bg-pink-50/50 group-hover:shadow-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 group-hover:bg-pink-100 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#d4739f] transition-colors" />
                  </div>
                  <p className="text-gray-700 font-medium text-lg mb-1">
                    Click to upload book cover
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden w-full aspect-[4/3] bg-gray-100 shadow-lg">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 transition shadow-lg hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
                  ✓ Cover uploaded
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <BookOpen className="w-5 h-5 text-[#d4739f]" />
              Book Title
            </label>
            <input
              type="text"
              placeholder="Ex: Happy Place by Emily Henry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 text-gray-900 focus:border-[#d4739f] focus:outline-none text-base transition-all shadow-sm focus:shadow-md placeholder:text-gray-400"
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Star className="w-5 h-5 text-[#d4739f]" />
              Rating
            </label>
            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-100">
              <div className="flex items-center gap-2">
                {renderStars()}
              </div>
              {rating > 0 && (
                <div className="text-2xl font-bold text-[#d4739f] bg-white px-6 py-2 rounded-full shadow-sm">
                  {rating}/5
                </div>
              )}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 text-[#d4739f]" />
              Your Review
            </label>
            <textarea
              placeholder="Share your thoughts about this book... What did you love? What could be better?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 text-gray-900 focus:border-[#d4739f] focus:outline-none text-base resize-none transition-all shadow-sm focus:shadow-md placeholder:text-gray-400"
              required
              maxLength={500}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Min. 10 characters</span>
              <span className={`font-medium ${review.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                {review.length}/500
              </span>
            </div>
          </div>

          {/* Categories & Meal */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Tag className="w-5 h-5 text-[#d4739f]" />
                Categories
              </label>
              <input
                type="text"
                placeholder="#romance #thriller"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 text-gray-900 focus:border-[#d4739f] focus:outline-none text-base transition-all shadow-sm focus:shadow-md placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Utensils className="w-5 h-5 text-[#d4739f]" />
                Perfect Meal Pairing
              </label>
              <input
                type="text"
                placeholder="Sushi, Burger, Wine..."
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 text-gray-900 focus:border-[#d4739f] focus:outline-none text-base transition-all shadow-sm focus:shadow-md placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-xl font-semibold text-white text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#d4739f] to-pink-600 hover:from-pink-600 hover:to-[#d4739f] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting your review...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your review will be visible to the entire community</p>
        </div>
      </div>
    </div>
  );
}