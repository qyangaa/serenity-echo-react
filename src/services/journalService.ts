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
): Promise<void> => {
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
  } catch (error) {
    console.error("Error sending journal entry:", error);
    throw error;
  }
};
