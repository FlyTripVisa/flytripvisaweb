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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      
      const data = await res.json();
      
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <h1>FlyTripVisa Assistant</h1>
      
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #334155", marginBottom: "10px", padding: "10px", borderRadius: "8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <strong style={{ color: m.role === "user" ? "#38bdf8" : "#fbbf24" }}>
              {m.role === "user" ? "You: " : "AI: "}
            </strong>
            {m.content}
          </div>
        ))}
        {loading && <div>Thinking...</div>}
      </div>

      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Ask about visas..."
        style={{ padding: "10px", width: "70%", borderRadius: "5px", color: "black" }}
      />
      <button 
        onClick={sendMessage} 
        disabled={loading} 
        style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer" }}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
