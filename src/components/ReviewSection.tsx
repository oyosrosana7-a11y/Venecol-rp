/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Star, MessageSquare, Plus, CheckCircle, User as UserIcon } from "lucide-react";
import { Review } from "../types";

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
  vehicleId?: string; // If provided, only shows reviews for this vehicle. "general" by default
}

export default function ReviewSection({
  reviews,
  onAddReview,
  vehicleId = "general"
}: ReviewSectionProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Filter reviews matching current ID
  const filteredReviews = reviews.filter((r) => r.vehicleId === vehicleId);

  // Math Calculations
  const averageRating = filteredReviews.length > 0 
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : "5.0";

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const reviewerName = name.trim() || "Piloto_Anonimo";

    const newReview: Review = {
      id: "rev-" + Math.floor(1000 + Math.random() * 9000),
      vehicleId: vehicleId,
      userName: reviewerName,
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", // default avatar placeholder
      rating: rating,
      comment: comment,
      date: new Date().toISOString().split("T")[0]
    };

    onAddReview(newReview);
    setComment("");
    setName("");
    setRating(5);
    setShowForm(false);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-white uppercase font-display tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#F2C94C]" />
            <span>Reseñas de la Comunidad</span>
          </h3>
          <p className="text-gray-400 text-xs mt-1">Conoce las opiniones de administradores y pilotos sobre nuestros recursos de FiveM.</p>
        </div>

        {/* Average and Create Buttons */}
        <div className="flex items-center gap-3.5">
          <div className="bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
            <span className="text-[#F2C94C] font-black text-sm flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#F2C94C] text-[#F2C94C]" />
              {averageRating}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300">{filteredReviews.length} opiniones</span>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-3.5 py-1.5 bg-[#F2C94C]/10 hover:bg-[#F2C94C]/20 border border-[#F2C94C]/20 text-[#F2C94C] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Escribir Reseña
            </button>
          )}
        </div>
      </div>

      {formSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold font-mono mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>¡Reseña guardada con éxito! Gracias por tu feedback.</span>
        </div>
      )}

      {/* Write review expandable drawer */}
      {showForm && (
        <form onSubmit={handleReviewSubmit} className="bg-black/40 border border-white/5 rounded-xl p-5 mb-6 space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Escribe tu Comentario</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">Cancelar</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-gray-400 uppercase font-semibold">Tu Nombre o Nombre de Rol (Simulado)</label>
              <input
                type="text"
                placeholder="E.g. Juan_Capriles_RP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase font-semibold">Puntuación de estrellas</label>
              <div className="flex gap-1 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-0.5 text-[#F2C94C]"
                  >
                    <Star className={`w-5.5 h-5.5 ${s <= rating ? "fill-[#F2C94C]" : "text-gray-600"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400 uppercase font-semibold">Mensaje o Crítica</label>
            <textarea
              placeholder="¿Qué te parecieron las colisiones del auto, la calidad de la pintura o la atención de soporte?"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-xs resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#F2C94C] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            Publicar Comentario
          </button>
        </form>
      )}

      {/* Feed list */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
        {filteredReviews.length === 0 ? (
          <p className="text-gray-500 text-xs italic py-2">No hay opiniones publicadas todavía para este recurso. ¡Sé el primero!</p>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-black/25 border border-white/5 rounded-xl font-sans space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-neutral-800 border border-white/10 rounded-full flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <span className="font-bold text-gray-200">{rev.userName}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
              </div>

              {/* Stars display */}
              <div className="flex gap-0.5 text-[#F2C94C]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`w-3.5 h-3.5 ${idx < rev.rating ? "fill-[#F2C94C] text-[#F2C94C]" : "text-gray-700"}`} 
                  />
                ))}
              </div>

              <p className="text-xs text-gray-400 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
