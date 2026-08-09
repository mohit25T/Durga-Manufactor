/**
 * Helper to detect client device OS and type
 */
export function getDeviceOS() {
  if (typeof window === "undefined" || !navigator) {
    return { isAndroid: false, isIOS: false, isDesktop: true };
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isDesktop = !isAndroid && !isIOS;

  return {
    isAndroid,
    isIOS,
    isDesktop,
    userAgent
  };
}
