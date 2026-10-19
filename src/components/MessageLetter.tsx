import React, { useState, useEffect } from 'react';
import { Mail, Heart, Sparkles, Send, Check, Bookmark, Feather } from 'lucide-react';
import { LOVE_LETTERS } from '../data/initialMemories';

export const MessageLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [userNotes, setUserNotes] = useState<Array<{ id: string; text: string; date: string }>>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState<number>(0);

  const sweetQuotes = [
    "You are my favorite thought before falling asleep and the first reason I smile when I wake up.",
    "If I had a flower for every time I thought of you, I could walk through my garden forever.",
    "You make even the quietest, ordinary days feel like a fairytale.",
    "No matter what happens, you will always be my safest home and favorite place to be."
  ];

  // Load user notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('love_notes_list');
      if (saved) {
        setUserNotes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note = {
      id: 'note-' + Date.now(),
      text: newNote.trim(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [note, ...userNotes];
    setUserNotes(updated);
    localStorage.setItem('love_notes_list', JSON.stringify(updated));
    setNewNote('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteNote = (id: string) => {
    const updated = userNotes.filter((n) => n.id !== id);
    setUserNotes(updated);
    localStorage.setItem('love_notes_list', JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col gap-8 pb-20 animate-in fade-in">
      {/* Interactive Romantic Love Letter Envelope */}
      <div className="romantic-card rounded-2xl p-6 sm:p-8 border border-pink-500/30 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-romantic text-pink-300">
              A Letter For You
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Fold Letter' : 'Read Letter'}</span>
          </button>
        </div>

        {isOpen ? (
          <div className="bg-[#240014]/60 border border-pink-500/25 rounded-xl p-5 sm:p-7 shadow-inner relative">
            <div className="absolute top-4 right-4 text-pink-400/40">
              <Heart className="w-8 h-8 fill-pink-500/20" />
            </div>

            <p className="text-xs font-semibold text-pink-400/80 uppercase tracking-widest mb-3">
              To my beloved meowmeow 🤍
            </p>

            <div className="text-sm sm:text-base text-pink-100/90 leading-relaxed space-y-4 font-sans">
              <p>
                From the very first moments we shared in the cold winter — holding hands and laughing about not having enough warm clothes — to our late night gaming adventures where we accidentally scanned pigeons instead of clicking pictures with the camera... every memory with you is pure gold.
              </p>
              <p>
                You bring so much gentleness, laughter, and light into my life. Even on the busiest or hardest days, just hearing from you or seeing your cute messages turns everything around.
              </p>
              <p>
                Thank you for being my constant companion, my best friend, and my deepest love. I can't wait for all the sweet chapters still ahead of us.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between">
              <span className="font-script text-xl sm:text-2xl text-pink-300">
                Forever & Always yours,
              </span>
              <span className="text-xs text-pink-300/60 font-mono">
                With all my love 🤍
              </span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsOpen(true)}
            className="w-full py-12 rounded-xl bg-pink-500/5 border border-dashed border-pink-400/40 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-500/10 transition group"
          >
            <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-pink-300 group-hover:text-white">
              Tap to open your love letter
            </p>
          </div>
        )}
      </div>

      {/* Sweet Daily Romantic Quote Carousel */}
      <div className="romantic-card rounded-2xl p-5 border border-pink-500/25 flex flex-col items-center text-center">
        <Sparkles className="w-5 h-5 text-pink-400 mb-2" />
        <p className="font-romantic text-base sm:text-lg text-pink-200 italic max-w-lg mb-4">
          "{sweetQuotes[activeQuoteIdx]}"
        </p>
        <button
          onClick={() => setActiveQuoteIdx((prev) => (prev + 1) % sweetQuotes.length)}
          className="text-xs px-3.5 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 font-semibold transition"
        >
          Next Sweet Reminder ✨
        </button>
      </div>

      {/* Secret Love Notes Board */}
      <div className="romantic-card rounded-2xl p-6 border border-pink-500/30 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-4 h-4 text-pink-400" />
          <h3 className="text-base sm:text-lg font-bold text-pink-300 font-romantic">
            Leave a Secret Love Note
          </h3>
        </div>

        <form onSubmit={handleAddNote} className="flex flex-col gap-3 mb-6">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a sweet little message or secret love note for later..."
            rows={2}
            className="w-full px-3.5 py-2.5 bg-black/60 border border-pink-500/30 rounded-xl text-xs sm:text-sm text-pink-100 placeholder-pink-400/40 focus:outline-none focus:border-pink-400"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-pink-300/60">
              Saved locally on your device
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Leave Note</span>
            </button>
          </div>
          {isSaved && (
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Note saved!
            </p>
          )}
        </form>

        {/* List of saved notes */}
        <div className="space-y-3">
          {userNotes.length === 0 ? (
            <p className="text-xs text-pink-300/50 text-center py-4 italic">
              No custom love notes yet. Write one above to surprise your sweetheart!
            </p>
          ) : (
            userNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl bg-black/40 border border-pink-500/20 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
                    {note.text}
                  </p>
                  <span className="text-[10px] text-pink-400/60 mt-1 block">
                    {note.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-pink-400/40 hover:text-red-400 text-xs p-1"
                  title="Remove note"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
