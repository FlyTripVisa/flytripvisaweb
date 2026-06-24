import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // ইউজার মেসেজ সেট করা
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // আপনার তৈরি করা api/chat এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error: AI not responding." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h2>FlyTripVisa AI Assistant</h2>
      
      {/* চ্যাট উইন্ডো */}
      <div style={{ height: "400px", border: "1px solid #ccc", overflowY: "auto", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "10px", textAlign: m.role === "user" ? "right" : "left" }}>
            <div style={{ display: "inline-block", padding: "8px", borderRadius: "8px", backgroundColor: m.role === "user" ? "#007bff" : "#e9ecef", color: m.role === "user" ? "white" : "black" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p>Thinking...</p>}
      </div>

      {/* ইনপুট এরিয়া */}
      <div style={{ display: "flex" }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Visa related query..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
