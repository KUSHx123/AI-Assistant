import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Skip back button */}
      <button
        onClick={() => skipTime(-10)}
        className="flex-shrink-0 w-8 h-8 text-gray-500 hover:text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-200 btn-animate"
        title="Skip back 10s"
      >
        <SkipBack size={14} />
      </button>
      
      {/* Play/Pause button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 btn-animate"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} className="ml-0.5" />
        )}
      </button>

      {/* Skip forward button */}
      <button
        onClick={() => skipTime(10)}
        className="flex-shrink-0 w-8 h-8 text-gray-500 hover:text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all duration-200 btn-animate"
        title="Skip forward 10s"
      >
        <SkipForward size={14} />
      </button>

      <div className="flex-1 flex items-center gap-3">
        {/* Progress bar */}
        <div 
          className="flex-1 bg-gray-200 rounded-full h-2 relative cursor-pointer hover:h-3 transition-all duration-200"
          onClick={handleSeek}
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-100 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
        
        {/* Time display */}
        <span className="text-sm text-gray-600 font-mono min-w-[80px] text-center">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-2">
        <Volume2 size={16} className="text-gray-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>
    </div>
  );
};