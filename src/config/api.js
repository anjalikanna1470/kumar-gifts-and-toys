// Centralized API and Asset URL Helper
// VITE_API_URL is read from environment variable (empty string in dev for Vite proxy support)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function getApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export function getImageUrl(path) {
  if (!path) return '/images/custom_mug.png';
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
