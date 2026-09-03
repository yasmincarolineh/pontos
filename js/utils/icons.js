// js/utils/icons.js - Helper for initializing Lucide Icons

export function initIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  } else {
    console.warn('Lucide icons CDN not yet loaded or unavailable.');
  }
}
