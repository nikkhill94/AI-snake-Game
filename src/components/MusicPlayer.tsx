import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, TerminalSquare } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { PLAYLIST } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('Audio play failed:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress(duration ? (currentTime / duration) * 100 : 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-black border-[3px] border-magenta shadow-[4px_4px_0px_#d946ef] p-6 w-full max-w-sm flex flex-col items-center screen-tear relative">
      <div className="absolute top-0 right-0 p-1 bg-fuchsia-500 text-black text-[10px] font-black font-mono">
        PID: {Math.floor(Math.random() * 9000) + 1000}
      </div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        muted={isMuted}
      />

      <div className="w-full flex items-center justify-between border-b-2 border-cyan-500/50 pb-2 mb-4">
        <h2 className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase font-bold glitch-text" data-text="AURAL_TRANSMITTER">
          AURAL_TRANSMITTER
        </h2>
        <TerminalSquare className="text-cyan-500 w-5 h-5 animate-pulse" />
      </div>

      <div className="flex items-center gap-4 w-full mb-6 py-2 bg-zinc-900 border border-zinc-800 px-3">
        <div className="w-12 h-12 bg-fuchsia-500/20 border-2 border-fuchsia-500 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 bg-cyan-400 mix-blend-difference transform rotate-45"></div>
        </div>
        <div className="text-left w-full overflow-hidden">
          <h3 className="text-white font-mono font-bold truncate text-sm uppercase">
            {currentTrack.title}
          </h3>
          <p className="text-fuchsia-400 font-mono text-xs truncate mt-1">
            SRC: {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Blocky Progress Bar */}
      <div className="w-full bg-zinc-900 h-3 border-2 border-zinc-700 mb-6 relative">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {/* Decorative scanline on progress bar */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:4px_100%] pointer-events-none" />
      </div>

      <div className="flex items-center justify-center gap-4 w-full">
        <button
          onClick={skipBack}
          className="p-3 text-cyan-500 border-2 border-transparent hover:border-cyan-500 bg-zinc-900 transition-none active:bg-cyan-500 active:text-black"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-12 bg-fuchsia-500 text-black border-2 border-fuchsia-300 flex items-center justify-center font-bold tracking-widest hover:bg-fuchsia-400 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
        </button>
        <button
          onClick={skipForward}
          className="p-3 text-cyan-500 border-2 border-transparent hover:border-cyan-500 bg-zinc-900 transition-none active:bg-cyan-500 active:text-black"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full flex justify-between mt-4 border-t border-dashed border-zinc-700 pt-4">
        <div className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase flex flex-col justify-center gap-1">
          <span>{isPlaying ? 'STATUS: STREAMING_DATA' : 'STATUS: IDLE_STATE'}</span>
          <span>BUFFER: OK</span>
        </div>
        <button
          onClick={toggleMute}
          className="text-fuchsia-500 hover:text-white hover:bg-fuchsia-500 p-2 border border-fuchsia-500 transition-none"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
