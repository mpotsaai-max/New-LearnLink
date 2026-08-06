import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RatingModalProps {
  sessionId: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  sessionId,
  tutorId,
  tutorName,
  subject,
  onClose
}) => {
  const { addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      sessionId,
      tutorId,
      rating,
      comment: comment.trim(),
      subject
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#feae2c]/20 text-[#835500] mx-auto flex items-center justify-center mb-3 font-bold">
            <Star className="w-6 h-6 fill-[#feae2c] text-[#feae2c]" />
          </div>
          <h3 className="font-bold text-xl text-[#022448]">Rate Your Session</h3>
          <p className="text-xs text-slate-500 mt-1">
            How was your {subject} lesson with <strong>{tutorName}</strong>?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Selection */}
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'fill-[#feae2c] text-[#feae2c]'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Review & Feedback</label>
            <textarea
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share what went well or how the tutor helped you master the subject..."
              className="w-full p-3 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#022448] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#022448] text-white font-bold text-xs rounded-xl hover:bg-[#1e3a5f] shadow-lg transition-all"
          >
            Submit Review
          </button>
        </form>

      </div>
    </div>
  );
};
