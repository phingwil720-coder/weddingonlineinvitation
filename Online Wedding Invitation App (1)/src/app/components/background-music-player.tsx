import { useState, useRef, useEffect } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface BackgroundMusicPlayerProps {
  musicUrl: string;
  autoplay?: boolean;
}

export function BackgroundMusicPlayer({ musicUrl, autoplay = false }: BackgroundMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set audio properties
    audio.loop = true;
    audio.volume = 0.3; // Start at 30% volume for background music

    // Try to autoplay if enabled
    if (autoplay && !hasInteracted) {
      // Most browsers block autoplay with sound, so we'll wait for user interaction
      const handleInteraction = () => {
        if (!hasInteracted) {
          setHasInteracted(true);
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Autoplay was prevented, that's okay
            });
          
          // Remove listeners after first interaction
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
          document.removeEventListener('scroll', handleInteraction);
        }
      };

      document.addEventListener('click', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);
      document.addEventListener('scroll', handleInteraction);

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
      };
    }
  }, [autoplay, hasInteracted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <audio ref={audioRef} src={musicUrl} />
      
      <Button
        size="sm"
        variant="outline"
        onClick={togglePlay}
        className="rounded-full w-10 h-10 p-0 bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:bg-white"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4 text-slate-700" />
        ) : (
          <VolumeX className="h-4 w-4 text-slate-700" />
        )}
      </Button>
    </div>
  );
}
