import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Play, Pause, Download } from "lucide-react";

interface MediaPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const MediaPreview = ({ files, onRemove }: MediaPreviewProps) => {
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

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'unknown';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Selected Media ({files.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file, index) => {
          const fileType = getFileType(file);
          const url = URL.createObjectURL(file);

          return (
            <Card key={index} className="relative p-2">
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 z-10"
                onClick={() => onRemove(index)}
              >
                <X className="w-3 h-3" />
              </Button>

              {fileType === 'image' && (
                <div className="aspect-square bg-muted rounded border overflow-hidden">
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {fileType === 'video' && (
                <div className="aspect-video bg-muted rounded border overflow-hidden relative">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={url}
                    className="w-full h-full object-cover"
                    onPlay={() => handleVideoPlay(index)}
                    onPause={handleVideoPause}
                    controls
                  />
                  {playingVideo !== index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              )}

              {fileType === 'audio' && (
                <div className="p-4 bg-muted rounded border">
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 mx-auto bg-civic-blue rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <audio
                    src={url}
                    controls
                    className="w-full h-8"
                  />
                </div>
              )}

              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};