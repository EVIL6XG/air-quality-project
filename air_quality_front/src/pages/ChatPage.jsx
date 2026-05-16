import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSendChat } from "@/features/chat/queries";
import { Send } from "lucide-react";
import { Button } from "../components/ui/Button";

const initialMessages = [
  {
    role: "bot",
    text:
      "Hello! I am the AirQ AI Assistant. Ask me a question about Almaty air quality, AQI, PM2.5, a district, or a specific date, and I will help you understand the data.",
  },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const chatMutation = useSendChat();
const loading = chatMutation.isPending;
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
  if (!input.trim() || loading) return;

  const text = input;
  const userMessage = { role: "user", text };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const res = await chatMutation.mutateAsync(text);
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: res.response || res.answer || "No response received." },
    ]);
  } catch {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "Error connecting to AI." },
    ]);
  }
}

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-[#0F1117] min-h-screen flex flex-col">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-[#5B5BD6] hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Air Q AI Assistant</h2>

      <div className="flex-1 bg-white dark:bg-[#1A1D2E] rounded-2xl shadow-sm border dark:border-gray-800 flex flex-col p-4 h-[72vh]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#5B5BD6] text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                <span className="text-gray-400 dark:text-gray-500 text-sm">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4 border-t dark:border-gray-700 pt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 border dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#5B5BD6]"
            placeholder="Ask about air quality in Almaty..."
          />
          <Button
      onClick={handleSend}
  disabled={loading}
  className="rounded-xl"
>
  <Send size={16} />
</Button>
        </div>
      </div>
    </div>
  );
}
