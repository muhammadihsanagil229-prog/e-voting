import {useEffect, useState} from 'react';

const DB_NAME = 'pilketos_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB tidak tersedia di browser ini.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Gagal membuka penyimpanan media.'));
  });
}

export function isIndexedDbUri(url?: string): boolean {
  return Boolean(url && url.startsWith('idb:'));
}

export function getIndexedDbKey(url: string): string {
  return url.slice(4);
}

export async function saveMediaBlob(key: string, blob: Blob): Promise<string> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, key);
    tx.oncomplete = () => {
      db.close();
      resolve(`idb:${key}`);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error('Gagal menyimpan file media.'));
    };
  });
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => {
      db.close();
      resolve((req.result as Blob | undefined) ?? null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error ?? new Error('Gagal membaca file media.'));
    };
  });
}

export async function deleteMediaBlobByUri(uri?: string): Promise<void> {
  if (!uri || !isIndexedDbUri(uri)) return;
  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(getIndexedDbKey(uri));
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Gagal menghapus media.'));
      };
    });
  } catch {
    // Ignore cleanup failures
  }
}

export function readVideoDurationSeconds(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      const duration = video.duration;
      cleanup();
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error('Durasi video tidak dapat dibaca.'));
        return;
      }
      resolve(duration);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Format video tidak didukung oleh browser.'));
    };

    video.src = objectUrl;
  });
}

export function formatDurationLabel(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return '00:00';
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function useResolvedMediaUrl(url?: string): string | undefined {
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(() =>
    url && !isIndexedDbUri(url) ? url : undefined
  );

  useEffect(() => {
    if (!url) {
      setResolvedUrl(undefined);
      return;
    }

    if (!isIndexedDbUri(url)) {
      setResolvedUrl(url);
      return;
    }

    let cancelled = false;
    let activeObjectUrl: string | null = null;

    getMediaBlob(getIndexedDbKey(url))
      .then((blob) => {
        if (cancelled) return;
        if (!blob) {
          setResolvedUrl(undefined);
          return;
        }
        activeObjectUrl = URL.createObjectURL(blob);
        setResolvedUrl(activeObjectUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedUrl(undefined);
        }
      });

    return () => {
      cancelled = true;
      if (activeObjectUrl) {
        URL.revokeObjectURL(activeObjectUrl);
      }
    };
  }, [url]);

  return resolvedUrl;
}
