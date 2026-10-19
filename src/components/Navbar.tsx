import React from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, Heart } from 'lucide-react';

export type TabType = 'memories' | 'gallery' | 'message' | 'games' | 'surprise';

interface Props {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenExplain: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onTabChange,
  isAudioMuted,
  onToggleAudio,
  onOpenExplain,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon?: string }> = [
    { id: 'memories', label: 'Memories' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'message', label: 'Message' },
    { id: 'games', label: 'Games' },
    { id: 'surprise', label: 'Surprise ✨' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0007]/85 backdrop-blur-md border-b border-[#ff69b4]/25 shadow-xl transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        {/* Brand/Couple Tag */}
        <div 
          onClick={() => onTabChange('gallery')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/50 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-400" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-pink-200 group-hover:text-pink-100 hidden sm:inline-block">
            MY LOVE
          </span>
        </div>

        {/* Navigation buttons */}
        <nav className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-pink-600/30 border-pink-400 text-white shadow-[0_0_15px_rgba(255,105,180,0.4)] scale-105'
                    : 'bg-pink-500/5 border-pink-500/20 text-pink-200/90 hover:bg-pink-500/15 hover:border-pink-500/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action icons (Audio toggle & Persistence Explanation) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExplain}
            title="How video persistence across refresh works"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-white text-xs font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden md:inline">Persistence Fix</span>
          </button>

          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute romantic music' : 'Mute romantic music'}
            className="p-2 rounded-xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-white transition"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-pink-400/80" />
            ) : (
              <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
