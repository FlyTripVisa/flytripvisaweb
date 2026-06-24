export async function onRequestPost(context) {
  const { prompt } = await context.request.json();
  
  const response = await context.env.AI.run(
    "@cf/qwen/qwen1.5-14b-chat-inst",
    {
      messages: [
        { role: "system", content: "You are a helpful visa assistant for FlyTripVisa." },
        { role: "user", content: prompt }
      ],
    },
    { 
      gateway: { 
        id: "default", 
        token: context.env.CF_AIG_TOKEN 
      } 
    }
  );

  return new Response(JSON.stringify({ response: response.result.response }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
