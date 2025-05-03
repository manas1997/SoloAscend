import { useState, useEffect, useRef } from 'react';

export function useAudio(url?: string) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element when URL changes
  useEffect(() => {
    if (!url) {
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    
    const audio = new Audio(url);
    audio.addEventListener('ended', () => setPlaying(false));
    audioRef.current = audio;
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', () => setPlaying(false));
      }
    };
  }, [url]);
  
  // Handle play and pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    
    setPlaying(!playing);
  };
  
  // Stop playing when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  return { playing, togglePlay };
}
