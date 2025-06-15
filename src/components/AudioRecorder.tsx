import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square, Volume2 } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioRecorded,
  disabled = false
}) => {
  const { isRecording, audioLevel, startRecording, stopRecording, cancelRecording } = useAudioRecorder();
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please check your microphone permissions and ensure you\'re using HTTPS.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const recording = await stopRecording();
      onAudioRecorded(recording.blob);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert('Failed to stop recording. Please try again.');
    }
  };

  const handleCancelRecording = () => {
    cancelRecording();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl animate-pulse-glow">
        {/* Enhanced audio level indicator */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-1 bg-red-500 rounded-full audio-bar transition-all duration-100"
              style={{ 
                height: `${Math.max(8, (audioLevel * 30) + (i * 2))}px`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-red-700 font-medium">
            Recording {formatTime(recordingTime)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStopRecording}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg btn-animate"
            title="Stop recording"
          >
            <Square size={16} />
          </button>
          <button
            onClick={handleCancelRecording}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg btn-animate"
            title="Cancel recording"
          >
            <MicOff size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleStartRecording}
      disabled={disabled}
      className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover-lift btn-animate focus-ring"
      title="Record voice message"
    >
      <Mic size={18} />
    </button>
  );
};