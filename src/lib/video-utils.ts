
/**
 * Utility to optimize and compress video files client-side.
 * Extremely optimized for Firestore 1MB document limit.
 * Target size: < 500KB to be absolutely safe with Base64 overhead.
 */
export async function optimizeVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.playsInline = true;
    
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Check if captureStream is available (most modern browsers)
      if (!(video as any).captureStream && !(video as any).mozCaptureStream) {
        console.warn('captureStream not supported, falling back to safe conversion.');
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          // If original is too big, we can't save it. 
          if (result.length > 1000000) {
            reject(new Error('VIDEO_TOO_LARGE'));
          } else {
            resolve(result);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
      
      // Target VERY low bitrate for guaranteed saving (150kbps)
      // 150kbps * 6s = 900kbits = ~112KB (Highly safe for Firestore)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 150000 
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          URL.revokeObjectURL(url);
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      };

      video.muted = true;
      video.play().then(() => {
        mediaRecorder.start();
        
        // Limit duration to 6 seconds for performance and size safety
        const maxDuration = Math.min(video.duration, 6);
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            video.pause();
          }
        }, maxDuration * 1000);
      }).catch(reject);
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
  });
}
