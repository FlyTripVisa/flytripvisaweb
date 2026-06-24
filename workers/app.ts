import { createRequestHandler } from "react-router";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	fetch(request, env, ctx) {
		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
// app/workers/app.ts
export interface Env {
  AI: any; // Cloudflare Workers AI binding
}

export default {
  async fetch(request: Request, env: Env) {
    const { prompt } = await request.json();
    
    // Cloudflare Workers AI লজিক
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt: prompt,
    });

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
