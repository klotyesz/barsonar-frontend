/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

type ChatRequest = {
  messages: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
};

export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json() as ChatRequest;
      const { messages } = body;

      const systemPrompt = {
        role: "system",
        content: "You are BarSonar AI, an expert on bars, pubs, and all kinds of alcoholic beverages. Your sole purpose is to provide information and answer questions related to this topic. Refuse to answer any questions that are not about bars, drinks, or nightlife. Be friendly and helpful and try to answer briefly."
      };

      const result = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        { messages: [systemPrompt, ...messages] }
      );

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response("Error: " + String(err), { status: 500 });
    }
  },
};
