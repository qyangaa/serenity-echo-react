import React, { useState, useEffect } from "react";
import {
  GradientBackground,
  CalminDisk,
  RecordingsList,
  RecordingItem,
} from "./styles/AppStyles";
import { GlobalStyle } from "./styles/GlobalStyles";
import { AudioRecorder } from "./services/audioService";
import { sendJournalEntry } from "./services/journalService";

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [recordings, setRecordings] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Load recordings from localStorage on mount
  useEffect(() => {
    const savedRecordings = Object.keys(localStorage).filter((key) =>
      key.startsWith("recording-")
    );
    setRecordings(savedRecordings);
  }, []);

  const handleDiskClick = async () => {
    try {
      if (!isRecording) {
        await audioRecorder.startRecording();
        setIsRecording(true);
      } else {
        setIsSending(true);
        try {
          const recordingResult = await audioRecorder.stopRecording();
          // Send to backend
          await sendJournalEntry(
            recordingResult.base64Data,
            recordingResult.duration
          );
          // Update local state
          setRecordings((prev) => [...prev, recordingResult.fileName]);
          console.log(
            "Recording saved and sent to server:",
            recordingResult.fileName
          );
        } finally {
          setIsSending(false);
          setIsRecording(false);
        }
      }
    } catch (error) {
      console.error("Recording error:", error);
      setIsRecording(false);
      setIsSending(false);
    }
  };

  const handlePlay = (fileName: string) => {
    const audioData = localStorage.getItem(fileName);
    if (audioData) {
      const audio = new Audio(audioData);
      audio.play();
    }
  };

  const handleDelete = (fileName: string) => {
    localStorage.removeItem(fileName);
    setRecordings((prev) => prev.filter((name) => name !== fileName));
  };

  const formatDate = (fileName: string) => {
    const timestamp = fileName.replace("recording-", "").replace(".mp3", "");
    return new Date(timestamp).toLocaleString();
  };

  const buttonText = isRecording
    ? "Recording... Click to Stop"
    : isSending
    ? "Sending to server..."
    : "Click to Start Recording";

  return (
    <>
      <GlobalStyle />
      <GradientBackground>
        <CalminDisk
          onClick={handleDiskClick}
          isRecording={isRecording}
          disabled={isSending}
        >
          {buttonText}
        </CalminDisk>

        {recordings.length > 0 && (
          <RecordingsList>
            {recordings.map((fileName) => (
              <RecordingItem key={fileName}>
                <span>{formatDate(fileName)}</span>
                <div>
                  <button onClick={() => handlePlay(fileName)}>Play</button>{" "}
                  <button onClick={() => handleDelete(fileName)}>Delete</button>
                </div>
              </RecordingItem>
            ))}
          </RecordingsList>
        )}
      </GradientBackground>
    </>
  );
};

export default App;
