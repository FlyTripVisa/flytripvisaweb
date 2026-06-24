import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createAiGateway } from "ai-gateway-provider";
import { createUnified } from "ai-gateway-provider/providers/unified";
import { generateText } from "ai";

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const { prompt } = await request.json();

    // ক্লাউডফ্লেয়ার এনভায়রনমেন্ট থেকে ক্রেডেনশিয়াল লোড করা
    const aigateway = createAiGateway({
      accountId: context.cloudflare.env.CF_ACCOUNT_ID,
      gateway: "default",
      apiKey: context.cloudflare.env.CF_AIG_TOKEN,
    });

    const unified = createUnified();

    // AI গেটওয়ের মাধ্যমে রেসপন্স জেনারেট করা
    const { text } = await generateText({
      model: aigateway(unified("dynamic/Qwen_ai")),
      prompt: prompt,
    });

    return Response.json({ response: text });
  } catch (error) {
    console.error("AI API Error:", error);
    return Response.json(
      { error: "Failed to connect to AI Gateway" },
      { status: 500 }
    );
  }
}
