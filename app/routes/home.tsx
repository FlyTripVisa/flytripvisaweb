import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Welcome message={loaderData.message} />;
}
// app/routes/home.tsx
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", { // আপনার রাউট অনুযায়ী এন্ডপয়েন্ট
      method: "POST",
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "ai", content: data.response }]);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", color: "white" }}>
      <h1>FlyTripVisa AI</h1>
      <div style={{ height: "400px", overflowY: "auto", border: "1px solid #333", padding: "10px" }}>
        {messages.map((m, i) => <p key={i}><strong>{m.role}:</strong> {m.content}</p>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} style={{ width: "80%", color: "black" }} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
