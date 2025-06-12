import React from 'react';
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

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const recording = await stopRecording();
      onAudioRecorded(recording.blob);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleCancelRecording = () => {
    cancelRecording();
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-2">
        {/* Audio level indicator */}
        <div className="flex items-center gap-1">
          <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" />
          <div 
            className="w-1 bg-red-500 rounded-full transition-all duration-100"
            style={{ height: `${Math.max(8, audioLevel * 20)}px` }}
          />
          <div 
            className="w-1 bg-red-500 rounded-full transition-all duration-100"
            style={{ height: `${Math.max(8, audioLevel * 16)}px` }}
          />
          <div 
            className="w-1 bg-red-500 rounded-full transition-all duration-100"
            style={{ height: `${Math.max(8, audioLevel * 12)}px` }}
          />
        </div>

        <span className="text-sm text-red-600 font-medium">Recording...</span>

        <div className="flex gap-1">
          <button
            onClick={handleStopRecording}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Stop recording"
          >
            <Square size={16} />
          </button>
          <button
            onClick={handleCancelRecording}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
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
      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Record voice message"
    >
      <Mic size={16} />
    </button>
  );
};