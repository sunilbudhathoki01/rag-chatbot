import OpenAI from "openai";
import { streamText } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

// --- OpenAI client ---
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY!,
});

// --- AstraDB client ---
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
  keyspace: ASTRA_DB_NAMESPACE!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content || "";

    // --- 1. Generate embedding for the user query ---
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
    });

    // --- 2. Query AstraDB vector collection ---
    let docContext = "";
    try {
      const collection = db.collection(ASTRA_DB_COLLECTION!);
      const cursor = collection.find(null, {
        sort: { $vector: embedding.data[0].embedding },
        limit: 10,
      });

      const documents = await cursor.toArray();
      const docsMap = documents.map((doc: any) => doc.text);
      docContext = JSON.stringify(docsMap);
    } catch (err) {
      console.error("Error querying AstraDB:", err);
      docContext = "";
    }

    // --- 3. Create system prompt using context ---
    const systemPrompt = `
You are an AI assistant who knows everything about Formula One.
Use the CONTEXT below to answer the QUESTION.
If the context does not contain the answer, use your own knowledge.
Do NOT mention the context or sources.

START CONTEXT
${docContext}
END CONTEXT

QUESTION:
${latestMessage}
`;

    // --- 4. Stream response using AI SDK ---
    const result = await streamText({
      model: "gpt-4o-mini", // free-tier compatible
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    });

    return result.toTextStreamResponse(); // ✅ streams to client
  } catch (err) {
    console.error("Error in POST /api/chat:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
