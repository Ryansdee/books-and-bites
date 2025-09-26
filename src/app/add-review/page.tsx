"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { Star, Upload, X, Camera, MessageSquare, Tag, Utensils, Send } from "lucide-react";
import Image from "next/image";

export default function AddReview() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [categories, setCategories] = useState("");
  const [meal, setMeal] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    if (!imageFile) return alert("Please select an image");
    if (rating === 0) return alert("Please give a rating");

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      const imageUrl = `/images/${data.filename}`;
      const titleSlug = slugify(title);

      await addDoc(collection(db, "reviews"), {
        title,
        titleSlug,
        rating,
        review,
        categories,
        meal,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Review added successfully!");
      router.push(`/review/${titleSlug}`);
    } catch (error) {
      console.error(error);
      alert("Error adding review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i += 0.5) {
      const isFull = rating >= i;
      const isHalf = rating + 0.5 === i;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              isFull ? "fill-[#d4739f] text-[#d4739f]" : isHalf ? "fill-pink-200 text-[#d4739f]" : "text-gray-300"
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit a Review</h1>
          <p className="text-gray-600">Share your thoughts with the community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-8 border border-gray-200">
          {/* Image upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Camera className="w-5 h-5 text-[#d4739f]" />
              Picture
            </label>
            {!imagePreview ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#d4739f] hover:bg-pink-50 transition">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 group-hover:text-[#d4739f]" />
                  <p className="text-gray-700 font-medium">Click to upload picture</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
              </label>
            ) : (
              <div className="relative rounded-lg overflow-hidden w-full h-64">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-[#d4739f] text-white rounded-full p-2 hover:bg-pink-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded text-xs">
                  Picture selected
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 text-[#d4739f]" />
              Book Title
            </label>
            <input
              type="text"
              placeholder="Ex: Happy Place by Emily Henry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:border-[#d4739f] focus:outline-none text-base"
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Star className="w-5 h-5 text-[#d4739f]" />
              Global Rating
            </label>
            <div className="flex items-center gap-1">
              {renderStars()}
              {rating > 0 && <span className="ml-4 text-lg font-medium text-[#d4739f]">{rating}/5</span>}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 text-[#d4739f]" />
              Review
            </label>
            <textarea
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:border-[#d4739f] focus:outline-none text-base resize-none"
              required
            />
            <div className="text-sm text-gray-500 text-right">{review.length}/500 characters</div>
          </div>

          {/* Categories & Meal */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Tag className="w-5 h-5 text-[#d4739f]" />
                Categories
              </label>
              <input
                type="text"
                placeholder="#romance #thriller"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:border-[#d4739f] focus:outline-none text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Utensils className="w-5 h-5 text-[#d4739f]" />
                Meal
              </label>
              <input
                type="text"
                placeholder="Sushi, Burger, ..."
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:border-[#d4739f] focus:outline-none text-base"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition transform hover:scale-[1.01] flex items-center justify-center gap-3 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#d4739f] hover:bg-pink-700 shadow-md"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
