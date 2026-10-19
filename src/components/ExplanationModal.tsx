import React, { useState } from 'react';
import { X, Check, Copy, AlertTriangle, ShieldCheck, Database, HardDrive, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplanationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vanillaJsCode = `<!-- ADD THIS INTO YOUR gallery.html SCRIPT TAG TO PERSIST VIDEOS -->
<script>
  const localVideoInput = document.getElementById('localVideoInput');
  const mainVideoPlayer = document.getElementById('mainVideoPlayer');

  // 1. Open or create client-side IndexedDB database
  function openVideoDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LoveGalleryDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 2. Save chosen video to IndexedDB
  async function saveVideoToLocalDB(file) {
    const db = await openVideoDB();
    const tx = db.transaction(['videos'], 'readwrite');
    const store = tx.objectStore('videos');
    store.put({ id: 'persisted_video', blob: file, name: file.name, date: Date.now() });
  }

  // 3. Load saved video automatically on page load / reload
  async function restoreVideoOnLoad() {
    try {
      const db = await openVideoDB();
      const tx = db.transaction(['videos'], 'readonly');
      const store = tx.objectStore('videos');
      const req = store.get('persisted_video');
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const videoURL = URL.createObjectURL(req.result.blob);
          mainVideoPlayer.src = videoURL;
          mainVideoPlayer.load();
          console.log('Restored video from IndexedDB:', req.result.name);
        }
      };
    } catch (err) {
      console.warn('No persisted video found in IndexedDB yet.', err);
    }
  }

  // 4. File input change listener
  localVideoInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (file) {
      // Create temporary view URL
      const videoURL = URL.createObjectURL(file);
      mainVideoPlayer.src = videoURL;
      mainVideoPlayer.load();
      mainVideoPlayer.play().catch(() => {});

      // Persist permanently in IndexedDB for subsequent reloads!
      await saveVideoToLocalDB(file);
    }
  });

  // Automatically restore when page finishes loading
  window.addEventListener('DOMContentLoaded', restoreVideoOnLoad);
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(vanillaJsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#150009] border border-[#ff69b4]/40 rounded-2xl shadow-2xl p-6 text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-pink-300 hover:text-white bg-pink-950/40 hover:bg-pink-900/60 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-pink-500/20 border border-pink-500/40 rounded-xl text-pink-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-pink-300">
              Why Videos Disappear on Refresh & How We Fixed It
            </h2>
            <p className="text-xs md:text-sm text-pink-200/70">
              Complete technical explanation + instant copy-paste code for your Vercel site
            </p>
          </div>
        </div>

        {/* The Problem Section */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Why It Was Disappearing</span>
            </div>
            <ul className="text-xs md:text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-red-300">In-Memory Object URL:</strong> <code className="text-pink-300 bg-pink-950/60 px-1 rounded">URL.createObjectURL(file)</code> only lives in the browser's temporary RAM. As soon as you press refresh (F5), that URL is erased.
              </li>
              <li>
                <strong className="text-red-300">localStorage Quota Limit:</strong> <code className="text-pink-300 bg-pink-950/60 px-1 rounded">localStorage</code> has a strict 5MB limit. Storing a video as Base64 exceeds 5MB and crashes immediately.
              </li>
              <li>
                <strong className="text-red-300">Vercel Serverless Limits:</strong> Free Vercel functions have a 4.5MB request limit and an ephemeral filesystem (<code className="text-pink-300 bg-pink-950/60 px-1 rounded">/tmp</code> wipes on every cold start).
              </li>
            </ul>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>How IndexedDB Permanently Fixes It</span>
            </div>
            <ul className="text-xs md:text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-emerald-300">Native Binary Storage:</strong> IndexedDB stores binary <code className="text-pink-300 bg-pink-950/60 px-1 rounded">Blob</code> and <code className="text-pink-300 bg-pink-950/60 px-1 rounded">File</code> objects directly inside the browser's persistent storage.
              </li>
              <li>
                <strong className="text-emerald-300">Huge Quota:</strong> Can store hundreds of megabytes (up to 50% of available disk space), easily handling HD romantic videos.
              </li>
              <li>
                <strong className="text-emerald-300">Survives Everything:</strong> Stays safe across page reloads, browser restarts, offline visits, and works on Vercel with zero server configuration.
              </li>
            </ul>
          </div>
        </div>

        {/* Copy paste snippet for Vanilla HTML */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-pink-300">
              <Database className="w-4 h-4" />
              <span>Copy-Paste Vanilla JS for your static <code className="text-pink-400">gallery.html</code> on Vercel:</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition shadow"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-black/70 border border-pink-500/20 rounded-xl text-xs font-mono text-pink-100 overflow-x-auto max-h-56 leading-relaxed">
            {vanillaJsCode}
          </pre>
        </div>

        {/* Live Status in this App */}
        <div className="bg-pink-950/30 border border-pink-500/30 rounded-xl p-4 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-pink-400 shrink-0" />
          <p className="text-xs md:text-sm text-pink-100/90 leading-relaxed">
            This app already has this full IndexedDB engine active right now! Any video you select or upload here will stay permanently saved and automatically restore every time you refresh.
          </p>
        </div>
      </div>
    </div>
  );
};
