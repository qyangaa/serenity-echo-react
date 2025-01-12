interface EchoResponse {
  message: string;
}

export const sendEchoMessage = async (message: string): Promise<string> => {
  try {
    console.log("Sending request to server:", { message });
    const response = await fetch("http://localhost:3000/echo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    console.log("Server response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(
        `Server responded with status ${response.status}: ${errorText}`
      );
    }

    const data: EchoResponse = await response.json();
    console.log("Server response data:", data);
    return data.message;
  } catch (error: any) {
    console.error("Detailed error:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};
