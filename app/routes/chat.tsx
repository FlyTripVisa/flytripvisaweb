import { useState } from "react";
import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";

// আপনার দেওয়া ব্যাকএন্ড লজিক
export async function action({ request, context }: ActionFunctionArgs) {
  // আপনার আগের দেওয়া কোড এখানে থাকবে...
  // শুধু নিশ্চিত করবেন model এ আপনার সঠিক মডেল আইডি আছে।
}

export default function ChatInterface() {
  const fetcher = useFetcher();
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value;
    fetcher.submit({ prompt }, { method: "post" });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>FlyTripVisa AI</h1>
      <div style={{ minHeight: "200px", border: "1px solid #ccc", padding: "10px" }}>
        {fetcher.data?.response && <p>AI: {fetcher.data.response}</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <input name="prompt" type="text" placeholder="কী জানতে চান?" required />
        <button type="submit" disabled={fetcher.state === "submitting"}>
          {fetcher.state === "submitting" ? "লিখে দিচ্ছে..." : "পাঠান"}
        </button>
      </form>
    </div>
  );
}
