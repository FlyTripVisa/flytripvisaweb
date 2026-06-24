import { ActionFunctionArgs } from "react-router";
export async function action({ request, context }: ActionFunctionArgs) {
  // ক্লায়েন্ট থেকে আসা ডেটা গ্রহণ
  const { prompt } = await request.json();

  // Cloudflare Binding থেকে AI এক্সেস করা
  // context.cloudflare.env.AI দিয়ে কনটেক্সট থেকে AI বাইন্ডিং পাওয়া যায়
  const ai = context.cloudflare.env.AI;

  try {
    const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: "system", content: "You are a helpful travel assistant for FlyTripVisa." },
        { role: "user", content: prompt }
      ]
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}
