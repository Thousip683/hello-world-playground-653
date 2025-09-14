import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface URLMediaPreviewProps {
  urls: string[];
  className?: string;
}

export const URLMediaPreview = ({ urls, className = "" }: URLMediaPreviewProps) => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleVideoPlay = (index: number) => {
    // Pause all other videos
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) {
        video.pause();
      }
    });
    setPlayingVideo(index);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  const getMediaType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'm4a', 'ogg'].includes(extension || '')) return 'audio';
    return 'image'; // Default to image
  };

  if (!urls || urls.length === 0) return null;

  // Show first media item only for now
  const url = urls[0];
  const mediaType = getMediaType(url);

  return (
    <div className={className}>
      {mediaType === 'image' && (
        <img
          src={url}
          alt="Report media"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {mediaType === 'video' && (
        <div className="relative">
          <video
            ref={(el) => (videoRefs.current[0] = el)}
            src={url}
            className="w-full h-full object-cover rounded-lg"
            onPlay={() => handleVideoPlay(0)}
            onPause={handleVideoPause}
            controls
          />
          {playingVideo !== 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <Play className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      )}

      {mediaType === 'audio' && (
        <div className="p-4 bg-muted rounded-lg border flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-primary rounded-full flex items-center justify-center mb-2">
              <Play className="w-6 h-6 text-primary-foreground" />
            </div>
            <audio
              src={url}
              controls
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};