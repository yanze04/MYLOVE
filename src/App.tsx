/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { VideoPlayerSection } from './components/VideoPlayerSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { MemoriesTimeline } from './components/MemoriesTimeline';
import { MessageLetter } from './components/MessageLetter';
import { GamesSection } from './components/GamesSection';
import { SurpriseView } from './components/SurpriseView';
import { ExplanationModal } from './components/ExplanationModal';
import { ChevronDown, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('gallery');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Read audio preferences from localStorage
  useEffect(() => {
    try {
      const savedMute = localStorage.getItem('bg-audio-muted');
      if (savedMute !== null) {
        setIsAudioMuted(savedMute === 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused || isAudioMuted) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setIsAudioMuted(false);
      localStorage.setItem('bg-audio-muted', 'false');
    } else {
      audioRef.current.muted = true;
      setIsAudioMuted(true);
      localStorage.setItem('bg-audio-muted', 'true');
    }
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-white relative selection:bg-pink-500 selection:text-white">
      {/* Background Audio (Apocalypse / Romantic ambient track) */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-guitar-11447.mp3"
      />

      {/* Floating Background Heart Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-heart text-pink-500/20"
            style={{
              left: `${(i * 8.5 + 4) % 96}%`,
              animationDelay: `${i * 1.3}s`,
              animationDuration: `${12 + (i % 6) * 2}s`,
              fontSize: `${14 + (i % 4) * 8}px`,
            }}
          >
            🤍
          </div>
        ))}
      </div>

      {/* Persistent Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleAudio}
        onOpenExplain={() => setIsExplainModalOpen(true)}
      />

      {/* Explanation & Vercel Code Modal */}
      <ExplanationModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />

      {/* Main View Port */}
      <main className="relative z-10 pt-24 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* GALLERY TAB */}
        {currentTab === 'gallery' && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Header */}
            <section className="text-center py-6 sm:py-8 flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Our Sacred Memories & Love Library</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-pink-400 font-romantic drop-shadow-[0_10px_20px_rgba(255,105,180,0.3)]">
                Gallery & Library
              </h1>
              <p className="text-xs sm:text-sm text-pink-200/70 max-w-md">
                Every video, every picture, and every whisper of our journey together.
              </p>
            </section>

            {/* Persistent Video Player Section & Spotify */}
            <VideoPlayerSection onShowExplainModal={() => setIsExplainModalOpen(true)} />

            {/* Scroll Down Hint */}
            <div className="my-8 text-center">
              <button
                onClick={scrollToGallery}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-pink-300/80 hover:text-pink-200 transition group"
              >
                <span>Scroll down for photos</span>
                <ChevronDown className="w-4 h-4 animate-bounce text-pink-400 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Photo Gallery List & Upload Card */}
            <div id="gallery-content" className="pt-2">
              <PhotoGallerySection />
            </div>
          </div>
        )}

        {/* MEMORIES TIMELINE TAB */}
        {currentTab === 'memories' && (
          <div className="animate-in fade-in duration-300">
            <section className="text-center py-6 sm:py-8 flex flex-col items-center gap-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-pink-400 font-romantic">
                Our Journey & Milestones
              </h1>
              <p className="text-xs sm:text-sm text-pink-200/70 max-w-md">
                A timeline of sweet laughter, winter memories, and late-night talks.
              </p>
            </section>
            <MemoriesTimeline />
          </div>
        )}

        {/* MESSAGE / LOVE LETTER TAB */}
        {currentTab === 'message' && (
          <div className="animate-in fade-in duration-300">
            <section className="text-center py-6 sm:py-8 flex flex-col items-center gap-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-pink-400 font-romantic">
                Love Notes & Messages
              </h1>
              <p className="text-xs sm:text-sm text-pink-200/70 max-w-md">
                Heartfelt letters straight from the heart to my meowmeow.
              </p>
            </section>
            <MessageLetter />
          </div>
        )}

        {/* GAMES TAB */}
        {currentTab === 'games' && (
          <div className="animate-in fade-in duration-300">
            <section className="text-center py-6 sm:py-8 flex flex-col items-center gap-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-pink-400 font-romantic">
                Couple Mini-Games & Coupons
              </h1>
              <p className="text-xs sm:text-sm text-pink-200/70 max-w-md">
                Scratch to redeem cute love coupons and play sweet couple games!
              </p>
            </section>
            <GamesSection />
          </div>
        )}

        {/* SURPRISE TAB */}
        {currentTab === 'surprise' && (
          <div className="animate-in fade-in duration-300">
            <SurpriseView onBackToGallery={() => setCurrentTab('gallery')} />
          </div>
        )}
      </main>

      {/* Floating Audio Toggle Button (matching user's original HTML button) */}
      <button
        onClick={toggleAudio}
        title={isAudioMuted ? 'Play background music' : 'Mute background music'}
        className="fixed right-4 bottom-4 z-50 p-3 rounded-2xl bg-[#150009]/90 border border-pink-500/40 text-pink-300 hover:text-white hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(255,105,180,0.3)] backdrop-blur-md transition-all flex items-center justify-center"
      >
        {isAudioMuted ? (
          <VolumeX className="w-5 h-5 text-pink-400/70" />
        ) : (
          <Volume2 className="w-5 h-5 text-pink-400 animate-pulse" />
        )}
      </button>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-pink-500/15 bg-black/40 text-pink-300/60 text-xs">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span>Made with all my love for my meowmeow</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-400" />
        </div>
        <p className="text-[11px] text-pink-400/40">
          Powered by client-side IndexedDB persistence • Never lost on refresh
        </p>
      </footer>
    </div>
  );
}
