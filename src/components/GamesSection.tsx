import React, { useState } from 'react';
import { COUPONS } from '../data/initialMemories';
import { Gift, Sparkles, Check, RefreshCw, Trophy, Heart } from 'lucide-react';

export const GamesSection: React.FC = () => {
  // Revealed coupons state
  const [revealedCoupons, setRevealedCoupons] = useState<Record<string, boolean>>({});

  // Memory Card Game State
  const initialCards = [
    { id: 1, icon: '🤍', matched: false },
    { id: 2, icon: '🤍', matched: false },
    { id: 3, icon: '📸', matched: false },
    { id: 4, icon: '📸', matched: false },
    { id: 5, icon: '🌹', matched: false },
    { id: 6, icon: '🌹', matched: false },
    { id: 7, icon: '💌', matched: false },
    { id: 8, icon: '💌', matched: false },
  ];

  const [cards, setCards] = useState(() => {
    return [...initialCards].sort(() => Math.random() - 0.5);
  });
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const handleRevealCoupon = (id: string) => {
    setRevealedCoupons((prev) => ({ ...prev, [id]: true }));
  };

  const handleCardClick = (index: number) => {
    if (isProcessing) return;
    if (cards[index].matched) return;
    if (flippedIndices.includes(index)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        // Matched!
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((card, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...card, matched: true } : card
            );
            if (updated.every((c) => c.matched)) {
              setGameWon(true);
            }
            return updated;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  const handleResetGame = () => {
    setCards([...initialCards].sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setGameWon(false);
  };

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col gap-8 pb-20 animate-in fade-in">
      {/* SECTION 1: Couple Love Coupons */}
      <div className="romantic-card rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-pink-400" />
          <h2 className="text-xl font-bold text-pink-300 font-romantic">
            Redeemable Couple Love Coupons
          </h2>
        </div>
        <p className="text-xs text-pink-200/70 mb-5">
          Tap any coupon card to scratch and reveal your special romantic reward!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COUPONS.map((coupon) => {
            const isRevealed = !!revealedCoupons[coupon.id];
            return (
              <div
                key={coupon.id}
                onClick={() => handleRevealCoupon(coupon.id)}
                className={`relative rounded-xl p-4 border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isRevealed
                    ? 'bg-pink-950/60 border-pink-400/80 shadow-[0_0_20px_rgba(255,105,180,0.3)]'
                    : 'bg-black/50 border-dashed border-pink-500/40 hover:border-pink-400 hover:bg-black/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 bg-pink-500/10 rounded-xl border border-pink-500/20">
                    {coupon.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-pink-200 mb-1">
                      {coupon.title}
                    </h3>
                    {isRevealed ? (
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded bg-pink-500/30 border border-pink-400 text-[11px] font-mono text-pink-300 font-bold mb-1">
                          CODE: {coupon.code}
                        </div>
                        <p className="text-[11px] text-emerald-400 font-medium">
                          ✓ Unlocked! Claim anytime with meowmeow.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-pink-400/60 italic">
                        Tap to scratch & unlock ✨
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Memory Match Game */}
      <div className="romantic-card rounded-2xl p-6 border border-pink-500/30 shadow-2xl text-center">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-left">
            <Heart className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-lg font-bold text-pink-300 font-romantic">
                Couple Memory Flip Game
              </h3>
              <p className="text-xs text-pink-200/60">Find all matching pairs of our love symbols</p>
            </div>
          </div>
          <button
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        {gameWon && (
          <div className="p-4 mb-4 bg-pink-600/20 border border-pink-400 rounded-xl text-center animate-in zoom-in">
            <div className="flex items-center justify-center gap-2 text-pink-300 font-bold text-base">
              <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
              <span>You Won! Perfect Match, Just Like Us 🤍</span>
            </div>
            <p className="text-xs text-pink-100/80 mt-1">
              Every card has its counterpart, just like how we belong together!
            </p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || card.matched;
            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-xl text-2xl flex items-center justify-center border transition-all duration-300 transform ${
                  isFlipped
                    ? 'bg-pink-900/60 border-pink-400 scale-100 shadow-[0_0_15px_rgba(255,105,180,0.4)]'
                    : 'bg-black/60 border-pink-500/30 hover:border-pink-400/70 hover:scale-105'
                }`}
              >
                {isFlipped ? card.icon : '❓'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
