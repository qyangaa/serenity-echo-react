interface JournalEntry {
  timestamp: string;
  transcription: string;
  summary?: string;
  audioLength: number;
  metadata?: {
    duration?: string;
    type?: string;
    [key: string]: any;
  };
}

interface JournalEntryData {
  id?: string;
  timestamp: string;
  entries: JournalEntry[];
}

export interface TranscriptionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  metadata: {
    duration: string;
    type: string;
  };
  format: string;
  transcription: {
    text: string;
    duration: number;
    language: string;
    summary: string;
  };
  journalId: string;
}

export const getOrCreateJournal =
  async (): Promise<JournalEntryData | null> => {
    try {
      const response = await fetch(
        "http://localhost:3000/journal/latest-or-new"
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching or creating journal:", error);
      throw error;
    }
  };

export const createNewJournal = async (
  base64AudioData: string,
  duration: string
): Promise<TranscriptionResponse> => {
  try {
    const response = await fetch("http://localhost:3000/journal/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioData: base64AudioData,
        metadata: {
          duration,
          type: "journal",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Server responded with status ${response.status}: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating new journal:", error);
    throw error;
  }
};

export const appendToJournal = async (
  journalId: string,
  base64AudioData: string,
  duration: string
): Promise<TranscriptionResponse> => {
  try {
    const response = await fetch(
      `http://localhost:3000/journal/${journalId}/append`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioData: base64AudioData,
          metadata: {
            duration,
            type: "journal",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Server responded with status ${response.status}: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error appending to journal:", error);
    throw error;
  }
};
