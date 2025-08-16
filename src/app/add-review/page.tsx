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
    if (!imageFile) return alert("Veuillez sélectionner une image");
    if (rating === 0) return alert("Veuillez donner une note");

    setIsSubmitting(true);

    try {
      // Upload image
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Échec de l'upload d'image");
      const data = await res.json();
      const imageUrl = `/images/${data.filename}`;
      const titleSlug = slugify(title);

      // Add review to Firestore
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

      alert("Review ajouté avec succès !");
      router.push(`/review/${titleSlug}`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du review. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper pour afficher les étoiles, supportant les demi-étoiles
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
              isFull ? "fill-yellow-400 text-yellow-400" : isHalf ? "fill-yellow-200 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Partagez votre expérience
          </h1>
          <p className="text-gray-600">Créez un review détaillé avec photos et notes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 space-y-8">
          {/* Image upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Camera className="w-5 h-5 text-red-500" />
              Photo du plat
            </div>
            {!imagePreview ? (
              <label className="block">
                <div className="border-2 border-dashed border-red-300 rounded-2xl p-8 text-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all duration-300 group">
                  <Upload className="w-12 h-12 text-red-400 mx-auto mb-4 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Cliquez pour ajouter une photo</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF jusqu&apos;&agrave; 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <Image src={imagePreview} alt="Aperçu" className="w-full h-64 object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  Image sélectionnée ✓
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 text-red-500" />
              Titre du review
            </label>
            <input
              type="text"
              placeholder="Ex: Délicieux burger au restaurant La Belle &apos;Époque&apos;"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-lg transition-colors"
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Star className="w-5 h-5 text-red-500" />
              Votre note
            </label>
            <div className="flex items-center gap-1">
              {renderStars()}
              {rating > 0 && <span className="ml-4 text-2xl font-bold text-yellow-500">{rating}/5</span>}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MessageSquare className="w-5 h-5 text-red-500" />
              Votre review
            </label>
            <textarea
              placeholder="Décrivez votre expérience : goût, présentation, service, ambiance..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-lg resize-none transition-colors"
              required
            />
            <div className="text-sm text-gray-500 text-right">{review.length}/500 caractères</div>
          </div>

          {/* Categories & Meal */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Tag className="w-5 h-5 text-red-500" />
                Catégories
              </label>
              <input type="text" placeholder="#italien #pizza" value={categories} onChange={(e) => setCategories(e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-lg transition-colors" />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Utensils className="w-5 h-5 text-red-500" />
                Contexte du repas
              </label>
              <input type="text" placeholder="Repas d'affaires, sortie en famille..." value={meal} onChange={(e) => setMeal(e.target.value)} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-lg transition-colors" />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl"}`}>
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publication en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publier mon review
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Votre review sera visible publiquement après validation</p>
        </div>
      </div>
    </div>
  );
}
