// app/routes/home.tsx
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // এটি সরাসরি api.chat.ts এর action ফাংশনকে হিট করবে
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      
      const data = await res.json();
      
      // AI এর রেসপন্স প্রসেস করা
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <h1>FlyTripVisa Assistant</h1>
      
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #334155", marginBottom: "10px", padding: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <strong>{m.role === "user" ? "You: " : "AI: "}</strong>
            {m.content}
          </div>
        ))}
        {loading && <div>Thinking...</div>}
      </div>

      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Ask about visas..."
        style={{ padding: "10px", width: "70%", borderRadius: "5px" }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ padding: "10px 20px" }}>
        Send
      </button>
    </div>
  );
}
