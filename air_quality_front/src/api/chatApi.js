export async function sendMessageToAI(message) {
  const response = await fetch("http://127.0.0.1:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error("Failed to send message to AI");
  }

  return response.json();
}
