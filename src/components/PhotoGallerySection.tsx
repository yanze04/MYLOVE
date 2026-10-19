import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_MEMORIES, MemoryItem } from '../data/initialMemories';
import { 
  StoredPhoto, 
  getAllPhotos, 
  savePhoto, 
  deletePhoto, 
  updatePhotoLikes 
} from '../lib/storage';
import { 
  Heart, 
  Plus, 
  Trash2, 
  Maximize2, 
  X, 
  CheckCircle, 
  Sparkles,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

export const PhotoGallerySection: React.FC = () => {
  const [userPhotos, setUserPhotos] = useState<StoredPhoto[]>([]);
  const [likedMap, setLikedMap] = useState<Record<string, number>>({});
  const [userLikedKeys, setUserLikedKeys] = useState<Record<string, boolean>>({});

  // Upload card state
  const [isPhotoSelected, setIsPhotoSelected] = useState<boolean>(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('Our Special Day 🤍');
  const [newCaption, setNewCaption] = useState<string>('Tap to edit this caption with your sweet memory...');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Lightbox modal state
  const [activeLightbox, setActiveLightbox] = useState<{ src: string; title: string; caption: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load user photos from IndexedDB
  useEffect(() => {
    async function loadStoredPhotos() {
      try {
        const stored = await getAllPhotos();
        setUserPhotos(stored);
      } catch (err) {
        console.error('Failed to load photos from IndexedDB:', err);
      }
    }
    loadStoredPhotos();

    // Load likes from localStorage
    try {
      const storedLikes = localStorage.getItem('love_gallery_likes');
      if (storedLikes) {
        setLikedMap(JSON.parse(storedLikes));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLike = (id: string, initialLikes = 0) => {
    const isCurrentlyLiked = !!userLikedKeys[id];
    const currentCount = likedMap[id] ?? initialLikes;
    const nextCount = isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    const nextLikedMap = { ...likedMap, [id]: nextCount };
    const nextUserLikedKeys = { ...userLikedKeys, [id]: !isCurrentlyLiked };

    setLikedMap(nextLikedMap);
    setUserLikedKeys(nextUserLikedKeys);
    localStorage.setItem('love_gallery_likes', JSON.stringify(nextLikedMap));

    // Also persist in IndexedDB if it's a user photo
    updatePhotoLikes(id, isCurrentlyLiked ? -1 : 1).catch(() => {});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPendingImageSrc(result);
        setIsPhotoSelected(true);
        setSaveStatus('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!pendingImageSrc) return;
    setIsSaving(true);
    setSaveStatus('Saving to browser storage...');

    try {
      const newPhoto: StoredPhoto = {
        id: 'photo-' + Date.now(),
        title: newTitle.trim() || 'Sweet Memory',
        caption: newCaption.trim() || 'A magical moment together.',
        dataUrl: pendingImageSrc,
        createdAt: Date.now(),
        likes: 1,
        tag: 'Couple Memory'
      };

      await savePhoto(newPhoto);
      setUserPhotos((prev) => [newPhoto, ...prev]);

      // Reset upload state
      setIsPhotoSelected(false);
      setPendingImageSrc('');
      setNewTitle('Our Special Day 🤍');
      setNewCaption('Tap to edit this caption with your sweet memory...');
      setSaveStatus('Photo saved successfully!');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err: any) {
      console.error('Error saving photo:', err);
      setSaveStatus('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteUserPhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this photo memory?')) {
      await deletePhoto(id);
      setUserPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col gap-7 pb-20">
      {/* INITIAL MEMORIES */}
      {INITIAL_MEMORIES.map((item) => {
        const likes = likedMap[item.id] ?? 12;
        const isLiked = !!userLikedKeys[item.id];

        return (
          <div
            key={item.id}
            className="romantic-card rounded-2xl overflow-hidden group transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_20px_50px_rgba(255,105,180,0.15)]"
          >
            {/* Photo Thumbnail */}
            <div 
              onClick={() => setActiveLightbox({ src: item.imageUrl, title: item.title, caption: item.caption })}
              className="relative w-full aspect-video bg-[#150009] overflow-hidden cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150009] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-pink-500/30 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {item.tag && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-pink-500/30 text-[11px] font-medium text-pink-300">
                  {item.tag}
                </div>
              )}
            </div>

            {/* Content & Description */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-base sm:text-lg font-bold text-pink-400 tracking-wide font-romantic">
                  {item.title}
                </h2>
                <button
                  onClick={() => handleLike(item.id, 12)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                    isLiked
                      ? 'bg-pink-500/30 border-pink-400 text-pink-300'
                      : 'bg-black/40 border-pink-500/20 text-pink-200/70 hover:text-pink-200 hover:border-pink-500/40'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500 text-pink-400' : ''}`} />
                  <span>{likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed font-sans">
                {item.caption}
              </p>
            </div>
          </div>
        );
      })}

      {/* USER UPLOADED DYNAMIC ENTRIES */}
      {userPhotos.map((photo) => {
        const likes = likedMap[photo.id] ?? photo.likes ?? 1;
        const isLiked = !!userLikedKeys[photo.id];

        return (
          <div
            key={photo.id}
            className="romantic-card rounded-2xl overflow-hidden group transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_20px_50px_rgba(255,105,180,0.15)] animate-in fade-in"
          >
            <div 
              onClick={() => setActiveLightbox({ src: photo.dataUrl, title: photo.title, caption: photo.caption })}
              className="relative w-full aspect-video bg-[#150009] overflow-hidden cursor-pointer"
            >
              <img
                src={photo.dataUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150009] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={(e) => handleDeleteUserPhoto(photo.id, e)}
                  title="Delete memory"
                  className="p-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-red-500/40 text-red-300 hover:bg-red-950/60 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-pink-500/30 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-pink-500/30 text-[11px] font-medium text-pink-300">
                Personal Upload • Persisted
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-base sm:text-lg font-bold text-pink-400 tracking-wide font-romantic">
                  {photo.title}
                </h2>
                <button
                  onClick={() => handleLike(photo.id, photo.likes || 1)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                    isLiked
                      ? 'bg-pink-500/30 border-pink-400 text-pink-300'
                      : 'bg-black/40 border-pink-500/20 text-pink-200/70 hover:text-pink-200 hover:border-pink-500/40'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500 text-pink-400' : ''}`} />
                  <span>{likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
                {photo.caption}
              </p>
            </div>
          </div>
        );
      })}

      {/* BLANK / ADD-YOUR-OWN PHOTO CARD */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!isPhotoSelected ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-pink-400/40 bg-pink-500/5 hover:bg-pink-500/10 hover:border-pink-400/70 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 text-2xl group-hover:scale-110 transition-transform mb-3 shadow-[0_0_15px_rgba(255,105,180,0.3)]">
              <Plus className="w-7 h-7" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-pink-200 group-hover:text-white">
              Tap to add your couple photo
            </p>
            <p className="text-xs text-pink-200/50 mt-1">
              Saves automatically to browser memory & survives page reloads
            </p>
          </div>
        ) : (
          <div className="romantic-card rounded-2xl overflow-hidden border border-pink-500/40 shadow-2xl p-4 sm:p-5 animate-in fade-in">
            {/* Preview Thumbnail */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-pink-500/30 mb-4 bg-black">
              <img
                src={pendingImageSrc}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setIsPhotoSelected(false);
                  setPendingImageSrc('');
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 border border-pink-500/40 text-pink-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Editable Title & Caption */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-pink-300 uppercase tracking-wider block mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter memory title..."
                  className="w-full px-3 py-2 bg-black/60 border border-pink-500/30 rounded-xl text-sm text-pink-100 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-pink-300 uppercase tracking-wider block mb-1">
                  Sweet Caption / Story
                </label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  rows={2}
                  placeholder="Write your sweet love story or inside joke..."
                  className="w-full px-3 py-2 bg-black/60 border border-pink-500/30 rounded-xl text-xs sm:text-sm text-pink-100 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSavePhoto}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-95 text-white text-xs sm:text-sm font-semibold transition shadow-[0_0_20px_rgba(255,105,180,0.4)] disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Photo Memory'}
                </button>
                <button
                  onClick={() => {
                    setIsPhotoSelected(false);
                    setPendingImageSrc('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-pink-300 text-xs font-medium border border-pink-500/20 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {saveStatus && (
          <p className="mt-2 text-xs text-center text-emerald-400 font-medium flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            {saveStatus}
          </p>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeLightbox && (
        <div 
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#150009] border border-pink-500/40 rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 text-pink-300 hover:text-white bg-black/70 rounded-full border border-pink-500/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 sm:p-6 bg-[#150009]">
              <h3 className="text-lg sm:text-xl font-bold text-pink-400 font-romantic mb-1">
                {activeLightbox.title}
              </h3>
              <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
                {activeLightbox.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
