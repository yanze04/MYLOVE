/**
 * IndexedDB storage engine for persistent video & gallery media.
 * Survives page reloads, browser restarts, and works seamlessly with Vercel/static deployments.
 */

const DB_NAME = 'MyLoveGalleryDB';
const DB_VERSION = 1;
const VIDEO_STORE = 'videos';
const PHOTO_STORE = 'photos';

export interface VideoMetadata {
  id: string;
  fileName: string;
  title: string;
  subtitle: string;
  fileSize: number;
  mimeType: string;
  updatedAt: number;
  duration?: number;
}

export interface StoredVideoRecord {
  id: string;
  blob: Blob;
  metadata: VideoMetadata;
}

export interface StoredPhoto {
  id: string;
  title: string;
  caption: string;
  dataUrl: string; // Base64 or Blob URL
  createdAt: number;
  likes: number;
  tag?: string;
}

// Open IndexedDB instance safely
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save video Blob and its metadata to IndexedDB
 */
export async function saveVideoBlob(
  blob: Blob,
  meta: { fileName: string; title?: string; subtitle?: string; duration?: number }
): Promise<StoredVideoRecord> {
  const db = await openDB();
  const metadata: VideoMetadata = {
    id: 'primary-video',
    fileName: meta.fileName || 'couple-video.mp4',
    title: meta.title || 'my meowmeoow 🤍',
    subtitle: meta.subtitle || 'Special Video Memory',
    fileSize: blob.size,
    mimeType: blob.type || 'video/mp4',
    updatedAt: Date.now(),
    duration: meta.duration,
  };

  const record: StoredVideoRecord = {
    id: 'primary-video',
    blob,
    metadata,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction([VIDEO_STORE], 'readwrite');
    const store = tx.objectStore(VIDEO_STORE);
    const putReq = store.put(record);

    putReq.onsuccess = () => resolve(record);
    putReq.onerror = () => reject(putReq.error);
  });
}

/**
 * Retrieve saved video record from IndexedDB
 */
export async function getSavedVideo(): Promise<StoredVideoRecord | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([VIDEO_STORE], 'readonly');
    const store = tx.objectStore(VIDEO_STORE);
    const getReq = store.get('primary-video');

    getReq.onsuccess = () => {
      resolve(getReq.result || null);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

/**
 * Remove saved video from IndexedDB
 */
export async function deleteSavedVideo(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([VIDEO_STORE], 'readwrite');
    const store = tx.objectStore(VIDEO_STORE);
    const delReq = store.delete('primary-video');

    delReq.onsuccess = () => resolve();
    delReq.onerror = () => reject(delReq.error);
  });
}

/**
 * Save photo to IndexedDB
 */
export async function savePhoto(photo: StoredPhoto): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PHOTO_STORE], 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const putReq = store.put(photo);
    putReq.onsuccess = () => resolve();
    putReq.onerror = () => reject(putReq.error);
  });
}

/**
 * Get all user uploaded photos from IndexedDB
 */
export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PHOTO_STORE], 'readonly');
    const store = tx.objectStore(PHOTO_STORE);
    const req = store.getAll();

    req.onsuccess = () => {
      const photos = (req.result || []) as StoredPhoto[];
      // sort newest first
      photos.sort((a, b) => b.createdAt - a.createdAt);
      resolve(photos);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Delete a photo by ID
 */
export async function deletePhoto(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PHOTO_STORE], 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Update photo like count
 */
export async function updatePhotoLikes(id: string, delta: number): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PHOTO_STORE], 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const photo = getReq.result as StoredPhoto | undefined;
      if (!photo) {
        resolve(0);
        return;
      }
      photo.likes = Math.max(0, (photo.likes || 0) + delta);
      const putReq = store.put(photo);
      putReq.onsuccess = () => resolve(photo.likes);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
