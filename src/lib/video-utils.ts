
/**
 * Utility to optimize and compress video files client-side.
 * Extremely optimized for Firestore 1MB document limit.
 * Target size: < 700KB (Base64 overhead safe)
 */
export async function optimizeVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      if (!(video as any).captureStream) {
        console.warn('captureStream not supported, using original file.');
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const stream = (video as any).captureStream();
      // Target 250kbps for GUARANTEED small size under 1MB even with Base64 overhead
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 250000 
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

      // Play and record quickly
      video.play().then(() => {
        mediaRecorder.start();
        
        // Stop recording after 6 seconds to ensure it fits in Firestore (1MB limit)
        // 250kbps * 6s = 1.5Mbits = 187KB (Very safe)
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
