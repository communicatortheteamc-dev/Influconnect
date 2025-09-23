import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';

interface ReelsPlayerProps {
  videos: string[];
}

const ReelsPlayer: React.FC<ReelsPlayerProps> = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance to next video
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(timer);
  }, [videos.length]);

  // Handle video change
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  // Only set src if it changed
  if (video.src !== videos[currentVideoIndex]) {
    video.src = videos[currentVideoIndex];
    // small delay to prevent AbortError in long sessions
    setTimeout(() => {
      video.play().catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    }, 100);
  }
}, [currentVideoIndex]);


  // Play/pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const toggleLike = () => setIsLiked(!isLiked);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden"
    >
      {/* Video */}
      {/* <video
      key={currentVideoIndex}
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop={false}
        muted
        playsInline
        onEnded={handleVideoEnd}
        onClick={togglePlayPause}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
      </video> */}
<video
  ref={videoRef}
  className="w-full h-full object-cover"
  autoPlay
  muted
  playsInline
  preload="auto"
  onEnded={handleVideoEnd}
/>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Play size={32} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Video Progress Indicators */}
      <div className="absolute top-16 left-4 right-4 flex space-x-1 z-40">
        {videos.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className={`h-full transition-all duration-300 ${
                index === currentVideoIndex ? 'bg-white' : 'bg-white/50'
              }`}
              style={{
                width: index === currentVideoIndex ? '100%' : index < currentVideoIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
        <button
          onClick={toggleLike}
          className="flex flex-col items-center space-y-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart 
              size={24} 
              className={`transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
          </div>
          <span className="text-white text-xs font-medium">12.5k</span>
        </button>

        <button className="flex flex-col items-center space-y-1 transition-transform hover:scale-110">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">1.2k</span>
        </button>

        <button className="flex flex-col items-center space-y-1 transition-transform hover:scale-110">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Share size={24} className="text-white" />
          </div>
        </button>

        <button
          onClick={toggleBookmark}
          className="flex flex-col items-center space-y-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bookmark 
              size={24} 
              className={`transition-colors ${isBookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-white'}`} 
            />
          </div>
        </button>
      </div>

      {/* Bottom User Info */}
      <div className="absolute bottom-4 left-4 right-20">
        <div className="flex items-center space-x-3 mb-3">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full p-0.5">
            <div className="w-full h-full bg-gray-300 rounded-full"></div>
          </div> */}
          {/* <div>
            <p className="text-white font-semibold text-sm">@username</p>
            <p className="text-white/80 text-xs">2h ago</p>
          </div> */}
          {/* <button className="ml-auto border border-white/50 text-white text-xs px-4 py-1.5 rounded-md font-medium hover:bg-white/10 transition-colors">
            Follow
          </button> */}
        </div>
        <p className="text-white text-sm mb-2">
          Check out this amazing content! 🔥 #reels #viral #trending
        </p>
        <p className="text-white/60 text-xs">
          ♪ Original Audio - Artist Name
        </p>
      </div>

      {/* Swipe Up Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2">
        <div className="animate-bounce">
          <div className="w-0.5 h-8 bg-white/50 rounded-full mx-auto mb-1"></div>
          <div className="text-white/50 text-xs">Swipe up</div>
        </div>
      </div>
    </div>
  );
};

export default ReelsPlayer;