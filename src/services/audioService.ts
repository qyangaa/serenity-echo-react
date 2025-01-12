interface RecordingResult {
  fileName: string;
  duration: string;
  base64Data: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  async stopRecording(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/mp3" });
        const timestamp = new Date().toISOString();
        const fileName = `recording-${timestamp}.mp3`;

        // Calculate duration
        const durationMs = Date.now() - this.startTime;
        const durationSeconds = Math.round(durationMs / 1000);
        const duration = `${durationSeconds}s`;

        // Save to local storage and return data
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          // Remove the data URL prefix to get just the base64 data
          const base64Data = base64Audio.split(",")[1];
          localStorage.setItem(fileName, base64Audio);
          resolve({
            fileName,
            duration,
            base64Data,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
      };

      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}
