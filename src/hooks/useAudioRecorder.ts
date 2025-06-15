import { useState, useRef, useCallback } from 'react';
import { AudioRecording } from '../types/chat';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Check if we're in a secure context
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported. Please use HTTPS.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        }
      });
      
      streamRef.current = stream;

      // Set up audio analysis for visual feedback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start visual feedback
      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate RMS (Root Mean Square) for better audio level representation
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          setAudioLevel(Math.min(rms / 128, 1)); // Normalize to 0-1
          
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      // Check for MediaRecorder support and choose best format
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Let browser choose
          }
        }
      }

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setIsRecording(false);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow microphone permissions and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Audio recording not supported in this browser.');
        }
      }
      throw new Error('Failed to start recording. Please check your microphone permissions and ensure you\'re using HTTPS.');
    }
  }, [isRecording]);

  const stopRecording = useCallback((): Promise<AudioRecording> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !streamRef.current) {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        try {
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          
          // Calculate duration (approximate)
          const duration = chunksRef.current.length * 0.1; // 100ms chunks
          
          resolve({
            blob,
            url,
            duration
          });
        } catch (error) {
          reject(error);
        } finally {
          cleanup();
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop();
      cleanup();
    }
  }, []);

  const cleanup = useCallback(() => {
    // Stop all tracks
    streamRef.current?.getTracks().forEach(track => track.stop());
    
    // Close audio context
    audioContextRef.current?.close();
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Reset state
    setIsRecording(false);
    setAudioLevel(0);
    chunksRef.current = [];
    
    // Clear refs
    mediaRecorderRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
  }, []);

  return {
    isRecording,
    audioLevel,
    startRecording,
    stopRecording,
    cancelRecording
  };
};