import React, { useState, useEffect } from "react";
import {
  GradientBackground,
  CalminDisk,
  TranscriptionCard,
  TranscriptionText,
  TranscriptionMeta,
  SummarySection,
  Divider,
  TranscriptionSection,
  NewJournalButton,
} from "./styles/AppStyles";
import { GlobalStyle } from "./styles/GlobalStyles";
import { AudioRecorder } from "./services/audioService";
import {
  getOrCreateJournal,
  createNewJournal,
  appendToJournal,
  TranscriptionResponse,
} from "./services/journalService";
import ReactMarkdown from "react-markdown";

interface Transcription {
  text: string;
  summary: string;
  timestamp: string;
  duration: string;
}

interface JournalState {
  id?: string;
  timestamp: string;
  latestEntry?: {
    transcription: string;
    summary?: string;
    timestamp: string;
    duration?: string;
  };
}

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [isSending, setIsSending] = useState(false);
  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );
  const [currentJournal, setCurrentJournal] = useState<JournalState | null>(
    null
  );

  useEffect(() => {
    const initializeJournal = async () => {
      try {
        const journal = await getOrCreateJournal();
        if (journal && journal.entries.length > 0) {
          const latestEntry = journal.entries[journal.entries.length - 1];
          setCurrentJournal({
            id: journal.id,
            timestamp: journal.timestamp,
            latestEntry: {
              transcription: latestEntry.transcription,
              summary: latestEntry.summary,
              timestamp: latestEntry.timestamp,
              duration: latestEntry.metadata?.duration,
            },
          });
        } else if (journal) {
          // New journal with no entries
          setCurrentJournal({
            id: journal.id,
            timestamp: journal.timestamp,
          });
        }
      } catch (error) {
        console.error("Error initializing journal:", error);
      }
    };

    initializeJournal();
  }, []);

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

          let response: TranscriptionResponse;
          if (!currentJournal?.id) {
            // Create new journal if none exists
            response = await createNewJournal(
              recordingResult.base64Data,
              recordingResult.duration
            );
          } else {
            // Append to existing journal
            response = await appendToJournal(
              currentJournal.id,
              recordingResult.base64Data,
              recordingResult.duration
            );
          }

          setTranscription({
            text: response.transcription.text,
            summary: response.transcription.summary,
            timestamp: response.timestamp,
            duration: response.metadata.duration,
          });

          // Update current journal
          setCurrentJournal((prev) => ({
            id: response.journalId,
            timestamp: response.timestamp,
            latestEntry: {
              transcription: response.transcription.text,
              summary: response.transcription.summary,
              timestamp: response.timestamp,
              duration: response.metadata.duration,
            },
          }));
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

  const handleNewJournal = async () => {
    setCurrentJournal(null);
    setTranscription(null);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <GlobalStyle />
      <GradientBackground>
        <NewJournalButton
          onClick={handleNewJournal}
          disabled={isRecording || isSending}
        >
          New Journal
        </NewJournalButton>

        <CalminDisk
          onClick={handleDiskClick}
          isRecording={isRecording}
          disabled={isSending}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        />

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
