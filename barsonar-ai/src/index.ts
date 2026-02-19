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

      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
      const userText = (lastUserMessage?.content?.trim() ?? "").toLowerCase();

      const TOPIC_KEYWORDS = [
        "bar", "pub", "kocsma", "sör", "bor", "ital", "beer", "wine", "drink",
        "cocktail", "whiskey", "whisky", "pia", "szórakozás", "nightlife",
        "night life", "inn", "tavern", "brewery", "sörfőzde", "borozó",
        "alcohol", "alkohol", "ivás", "drinking", "inni", "shot", "gin",
        "rum", "vodka", "tequila", "aperol", "prosecco", "champagne",
        "fröccs", "pezsgő", "likőr", "liqueur", "mixology",
      ];

      const hasTopicKeyword = TOPIC_KEYWORDS.some((kw) => userText.includes(kw));

      if (!hasTopicKeyword) {
        return new Response(
          JSON.stringify({
            response: "Csak kocsmákról és italokról tudok beszélni. Kérlek ezzel a témával kapcsolatban kérdezz! 🍻",
            result: "Csak kocsmákról és italokról tudok beszélni. Kérlek ezzel a témával kapcsolatban kérdezz! 🍻",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        { messages }
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
