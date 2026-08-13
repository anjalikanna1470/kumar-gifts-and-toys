// Centralized API and Asset URL Helper

// Backend API URL.
// Local development: empty -> Vite proxy handles /api and /uploads.
// Production: set VITE_API_URL to your deployed backend URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Vite/GitHub Pages base path.
// Local development: '/'
// Production GitHub Pages: '/kumar-gifts-and-toys/'
export const BASE_PATH = import.meta.env.BASE_URL || '/';

export function getApiUrl(path) {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${API_BASE_URL}${cleanPath}`;
}

export function getImageUrl(path) {
  if (!path) {
    return `${BASE_PATH}images/custom_mug.png`;
  }

  // Data URLs and external URLs should remain unchanged.
  if (
    path.startsWith('data:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Local/public images must use Vite's BASE_URL.
  if (cleanPath.startsWith('/images/')) {
    return `${BASE_PATH}${cleanPath.slice(1)}`;
  }

  // Backend-uploaded images should go through the backend.
  if (cleanPath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }

  return `${BASE_PATH}${cleanPath.slice(1)}`;
}