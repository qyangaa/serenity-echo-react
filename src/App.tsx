import React, { useState } from "react";
import {
  GradientBackground,
  CalminDisk,
  TranscriptionCard,
  TranscriptionText,
  TranscriptionMeta,
  SummarySection,
  Divider,
  TranscriptionSection,
} from "./styles/AppStyles";
import { GlobalStyle } from "./styles/GlobalStyles";
import { AudioRecorder } from "./services/audioService";
import { sendJournalEntry } from "./services/journalService";
import ReactMarkdown from "react-markdown";

interface Transcription {
  text: string;
  summary: string;
  timestamp: string;
  duration: string;
}

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [isSending, setIsSending] = useState(false);
  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );

  const handleDiskClick = async () => {
    try {
      if (!isRecording) {
        setTranscription(null);
        await audioRecorder.startRecording();
        setIsRecording(true);
      } else {
        setIsSending(true);
        try {
          const recordingResult = await audioRecorder.stopRecording();
          const response = await sendJournalEntry(
            recordingResult.base64Data,
            recordingResult.duration
          );

          setTranscription({
            text: response.transcription.text,
            summary: response.transcription.summary,
            timestamp: response.timestamp,
            duration: response.metadata.duration,
          });
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const buttonText = isRecording
    ? "Recording... Click to Stop"
    : isSending
    ? "Processing..."
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

        {transcription && (
          <TranscriptionCard>
            <SummarySection>
              <h3>Summary</h3>
              <ReactMarkdown>{transcription.summary}</ReactMarkdown>
            </SummarySection>

            <Divider />

            <TranscriptionSection>
              <h3>Full Transcription</h3>
              <TranscriptionText>{transcription.text}</TranscriptionText>
            </TranscriptionSection>

            <TranscriptionMeta>
              <span>Recorded: {formatTimestamp(transcription.timestamp)}</span>
              <span>Duration: {transcription.duration}</span>
            </TranscriptionMeta>
          </TranscriptionCard>
        )}
      </GradientBackground>
    </>
  );
};

export default App;
