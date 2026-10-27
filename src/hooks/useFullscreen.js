import { useState, useEffect, useRef } from 'react';

const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;

// Volledig scherm voor een spel: aan/uit, liggend op mobiel, knoppen verbergen na 4 s
export default function useFullscreen(containerRef) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    // Standard Fullscreen API (works on Android Chrome, Desktop)
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (request) {
      request.call(el).catch(() => {});
    }
    // Also try to lock screen orientation to landscape for better game experience
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
    // iOS fallback: scroll to hide address bar
    if (isIOS) {
      window.scrollTo(0, 1);
    }
  };

  const exitFullscreen = () => {
    if (fullscreenElement()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  };

  const toggleFullscreen = () => {
    if (!fullscreenElement()) enterFullscreen();
    else exitFullscreen();
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!fullscreenElement());
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Auto-request fullscreen on mobile when game opens (some browsers allow it after a recent interaction)
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    const timer = setTimeout(enterFullscreen, 300);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide buttons after a few seconds of inactivity, show on tap
  useEffect(() => {
    if (isFullscreen) {
      hideTimer.current = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(hideTimer.current);
    }
    setShowControls(true);
  }, [isFullscreen]);

  const handleTap = () => {
    if (isFullscreen && !showControls) {
      setShowControls(true);
      hideTimer.current = setTimeout(() => setShowControls(false), 4000);
    }
  };

  return { isFullscreen, isMobile, showControls, toggleFullscreen, exitFullscreen, handleTap };
}
