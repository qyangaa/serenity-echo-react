interface TranscriptionResponse {
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
}

interface JournalRequest {
  audioData: string;
  metadata: {
    duration: string;
    type: string;
  };
}

export const sendJournalEntry = async (
  base64AudioData: string,
  duration: string
): Promise<TranscriptionResponse> => {
  try {
    const payload: JournalRequest = {
      audioData: base64AudioData,
      metadata: {
        duration,
        type: "journal",
      },
    };

    const response = await fetch("http://localhost:3000/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Server responded with status ${response.status}: ${errorText}`
      );
    }

    const data: TranscriptionResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending journal entry:", error);
    throw error;
  }
};
