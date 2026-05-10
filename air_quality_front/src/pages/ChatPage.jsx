import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessageToAI } from "../api/chatApi";
import { Send } from "lucide-react";

export default function ChatPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendMessageToAI(input);
      setMessages((prev) => [...prev, { role: "bot", text: res.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
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
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
              Ask me anything about air quality in Almaty...
            </div>
          )}
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
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#5B5BD6] hover:bg-[#4A4ABF] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
