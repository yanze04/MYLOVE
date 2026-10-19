import React, { useState } from 'react';
import { Heart, Sparkles, Gift, ArrowLeft, Stars } from 'lucide-react';

interface Props {
  onBackToGallery: () => void;
}

export const SurpriseView: React.FC<Props> = ({ onBackToGallery }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col items-center text-center pb-20 animate-in fade-in">
      <button
        onClick={onBackToGallery}
        className="self-start mb-6 px-4 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Gallery</span>
      </button>

      {!opened ? (
        <div className="romantic-card rounded-3xl p-8 sm:p-12 border border-pink-400/40 shadow-2xl flex flex-col items-center max-w-lg w-full relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>

          <div className="p-4 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(255,105,180,0.4)] animate-bounce">
            <Gift className="w-12 h-12" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-romantic text-pink-300 mb-3">
            A Secret Surprise For You 🎁
          </h2>

          <p className="text-xs sm:text-sm text-pink-100/80 mb-8 leading-relaxed max-w-sm">
            I prepared something special just for my baby meowmeow. Are you ready to see it?
          </p>

          <button
            onClick={() => setOpened(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(255,105,180,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Unwrap The Surprise 🤍
          </button>
        </div>
      ) : (
        <div className="romantic-card rounded-3xl p-6 sm:p-10 border border-pink-400/50 shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-center gap-2 text-pink-400 mb-3">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
            <span className="font-semibold text-xs uppercase tracking-widest text-pink-300">Surprise Unlocked</span>
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-romantic text-pink-200 mb-4">
            You Are My Whole World 🤍
          </h2>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-pink-500/40 shadow-xl mb-6">
            <img
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80"
              alt="Romantic Surprise Couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-0 right-0 text-center font-script text-xl sm:text-2xl text-pink-200">
              "Forever with my meowmeow"
            </div>
          </div>

          <div className="bg-black/40 border border-pink-500/30 rounded-2xl p-5 text-xs sm:text-sm text-pink-100/90 leading-relaxed text-left space-y-3 font-sans mb-6">
            <p>
              Hey baby, if you ever find yourself having a tough day, feeling tired, or wondering how much you matter — please remember this:
            </p>
            <p className="text-pink-300 font-semibold italic text-center text-sm sm:text-base font-romantic py-1">
              "You are loved more than yesterday, and less than tomorrow."
            </p>
            <p>
              I am so proud of you, I believe in you always, and my heart will always belong to you. Let's make a million more memories together!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setOpened(false)}
              className="px-5 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-semibold transition"
            >
              Close Box
            </button>
            <button
              onClick={onBackToGallery}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition shadow"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
