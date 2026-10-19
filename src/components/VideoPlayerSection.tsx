import React, { useState, useEffect, useRef } from 'react';
import { 
  saveVideoBlob, 
  getSavedVideo, 
  deleteSavedVideo, 
  StoredVideoRecord 
} from '../lib/storage';
import { 
  Video, 
  Upload, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Link as LinkIcon, 
  Edit2, 
  Sparkles, 
  Film, 
  Trash2, 
  Info,
  Play,
  Pause
} from 'lucide-react';

interface Props {
  onShowExplainModal: () => void;
}

// Romantic couple sample video fallback for preview when no local file is uploaded yet
const DEFAULT_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export const VideoPlayerSection: React.FC<Props> = ({ onShowExplainModal }) => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [isPersisted, setIsPersisted] = useState<boolean>(false);
  const [storedRecord, setStoredRecord] = useState<StoredVideoRecord | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  // Title & subtitle customization
  const [title, setTitle] = useState<string>('my meowmeoow 🤍');
  const [subtitle, setSubtitle] = useState<string>('Special Video Memory');
  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);

  // URL modal state
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  // Load persisted video from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;

    async function loadPersistedVideo() {
      try {
        const record = await getSavedVideo();
        if (record && record.blob && isMounted) {
          // Clean up old URL
          if (currentObjectUrlRef.current) {
            URL.revokeObjectURL(currentObjectUrlRef.current);
          }
          const url = URL.createObjectURL(record.blob);
          currentObjectUrlRef.current = url;
          setVideoSrc(url);
          setStoredRecord(record);
          setIsPersisted(true);
          if (record.metadata.title) setTitle(record.metadata.title);
          if (record.metadata.subtitle) setSubtitle(record.metadata.subtitle);
          setStatusMessage('Restored automatically from local storage! Survives page reload.');
        } else if (isMounted) {
          // Check if custom URL was stored in localStorage
          const savedUrl = localStorage.getItem('custom_video_url');
          if (savedUrl) {
            setVideoSrc(savedUrl);
            setIsPersisted(true);
          } else {
            // Default sample preview
            setVideoSrc(DEFAULT_VIDEO_URL);
            setIsPersisted(false);
          }
        }
      } catch (err) {
        console.error('Error loading video from IndexedDB:', err);
        if (isMounted) {
          setVideoSrc(DEFAULT_VIDEO_URL);
          setIsPersisted(false);
        }
      }
    }

    loadPersistedVideo();

    return () => {
      isMounted = false;
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  // Handle local video selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setStatusMessage('Saving video permanently to browser IndexedDB...');

    try {
      // Clean up previous blob URL
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }

      // Save to IndexedDB
      const savedRecord = await saveVideoBlob(file, {
        fileName: file.name,
        title,
        subtitle,
      });

      // Create new ObjectURL
      const newUrl = URL.createObjectURL(file);
      currentObjectUrlRef.current = newUrl;
      setVideoSrc(newUrl);
      setStoredRecord(savedRecord);
      setIsPersisted(true);
      localStorage.removeItem('custom_video_url');

      setStatusMessage('Saved! Your video will now stay even when you refresh the page.');

      // Play video
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Failed to save video:', err);
      setStatusMessage('Error saving video: ' + (err.message || 'Storage error'));
    } finally {
      setIsSaving(false);
      // Reset input value so re-selecting same file triggers change
      if (event.target) event.target.value = '';
    }
  };

  // Handle setting a custom video URL
  const handleSaveCustomUrl = () => {
    if (!inputUrl.trim()) return;
    setVideoSrc(inputUrl.trim());
    localStorage.setItem('custom_video_url', inputUrl.trim());
    setIsPersisted(true);
    setShowUrlInput(false);
    setStatusMessage('Online video URL saved and persisted.');
  };

  // Reset or remove saved video
  const handleResetVideo = async () => {
    if (confirm('Are you sure you want to clear this saved video and return to default?')) {
      await deleteSavedVideo();
      localStorage.removeItem('custom_video_url');
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
        currentObjectUrlRef.current = null;
      }
      setStoredRecord(null);
      setIsPersisted(false);
      setVideoSrc(DEFAULT_VIDEO_URL);
      setStatusMessage('Saved video cleared.');
    }
  };

  // Download saved video
  const handleDownloadVideo = () => {
    if (storedRecord && storedRecord.blob) {
      const a = document.createElement('a');
      a.href = videoSrc;
      a.download = storedRecord.metadata.fileName || 'couple-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(videoSrc, '_blank');
    }
  };

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-[700px] mx-auto flex flex-col gap-5">
      {/* Persistence Info Banner */}
      <div className="bg-pink-950/40 border border-pink-500/30 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex items-start gap-3">
        <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-pink-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Video Persistence Engine Active
            </span>
            <button
              onClick={onShowExplainModal}
              className="text-xs text-pink-400 hover:text-pink-300 underline font-medium"
            >
              How does it work?
            </button>
          </div>
          <p className="text-pink-100/75 mt-1 leading-relaxed">
            Your uploaded video is saved into the browser's persistent <strong>IndexedDB</strong>. 
            It will <strong>never disappear</strong> when you refresh, reload, or revisit!
          </p>
        </div>
      </div>

      {/* Main Video Player Card */}
      <div className="romantic-card rounded-2xl overflow-hidden p-4 sm:p-5 transition-all duration-300">
        {/* Video Screen Wrapper */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-pink-500/30 shadow-2xl group">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            Your browser does not support HTML5 video playback.
          </video>

          {/* Quick badge on video */}
          {isPersisted && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-pink-500/30 text-[11px] font-medium text-pink-300 flex items-center gap-1.5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Persisted on Reload
            </div>
          )}
        </div>

        {/* Video Info & Controls Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            {isEditingMeta ? (
              <div className="flex flex-col gap-1.5 w-full">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-2 py-1 bg-black/60 border border-pink-500/40 rounded-lg text-sm text-pink-300 font-semibold focus:outline-none focus:border-pink-400"
                  placeholder="Video Title"
                />
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="px-2 py-1 bg-black/60 border border-pink-500/40 rounded-lg text-xs text-pink-200/80 focus:outline-none focus:border-pink-400"
                  placeholder="Video Subtitle / Memory note"
                />
                <button
                  onClick={() => setIsEditingMeta(false)}
                  className="self-start text-[11px] text-pink-400 hover:text-pink-300 mt-1 font-semibold"
                >
                  ✓ Done editing
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-pink-400 tracking-wide">
                    {title}
                  </h3>
                  <button
                    onClick={() => setIsEditingMeta(true)}
                    className="text-pink-400/60 hover:text-pink-300 p-1"
                    title="Edit title & subtitle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-pink-200/70 mt-0.5">
                  {subtitle}
                </p>
                {storedRecord && (
                  <p className="text-[11px] text-pink-300/60 mt-1">
                    📁 {storedRecord.metadata.fileName} ({formatBytes(storedRecord.metadata.fileSize)})
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/35 border border-pink-400/80 text-white text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-pink-300" />
              <span>{isSaving ? 'Saving...' : isPersisted ? 'Change Video' : 'Select Video'}</span>
            </button>

            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              title="Add remote video URL"
              className="p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:text-white transition"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            {isPersisted && (
              <>
                <button
                  onClick={handleDownloadVideo}
                  title="Download / Export saved video"
                  className="p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:text-white transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetVideo}
                  title="Reset to default video"
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Remote URL input accordion */}
        {showUrlInput && (
          <div className="mt-3 p-3 bg-black/60 border border-pink-500/30 rounded-xl flex items-center gap-2">
            <input
              type="url"
              placeholder="Paste direct MP4 link or cloud video URL..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-pink-100 placeholder-pink-400/40 focus:outline-none"
            />
            <button
              onClick={handleSaveCustomUrl}
              className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium rounded-lg"
            >
              Load URL
            </button>
          </div>
        )}

        {/* Real-time Status Message */}
        {statusMessage && (
          <p className="mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {statusMessage}
          </p>
        )}
      </div>

      {/* Spotify Embed Player */}
      <div className="w-full rounded-2xl overflow-hidden border border-pink-500/25 shadow-xl bg-[#150009]/80 backdrop-blur-md p-1">
        <iframe
          data-testid="embed-iframe"
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/track/19Hg1UCZaCdpHB37L7x63X?utm_source=generator&theme=0&si=29453ba70ed24dbb"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Romantic Track Player"
        />
      </div>
    </div>
  );
};
