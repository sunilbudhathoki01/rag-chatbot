import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

// --- URLs to scrape ---
const f1Data = ["https://en.wikipedia.org/wiki/Formula_One"];

// --- Astra DB client ---
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
  keyspace: ASTRA_DB_NAMESPACE!, // updated: keyspace instead of deprecated namespace
});

// --- Text splitter ---
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

// --- Create collection ---
const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
    vector: {
      dimension: 1536, // embedding dimension
      metric: similarityMetric,
    },
  });
  console.log("Collection created:", res);
};

// --- Scrape page ---
const scrapePage = async (url: string): Promise<string> => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: "new", // fixes deprecation warning
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page) => {
      return await page.evaluate(() => document.body.innerHTML);
    },
  });

  const content = await loader.scrape();
  return content?.replace(/<[^>]*>?/gm, "").trim() || "";
};

// --- Load sample data with dummy embeddings (avoids OpenAI quota) ---
const LoadSampleData = async () => {
  const collection = db.collection(ASTRA_DB_COLLECTION!);

  for (const url of f1Data) {
    console.log(`Scraping: ${url}`);
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);

    for (const chunk of chunks) {
      // Dummy vector of 1536 dimensions
      const vector = Array(1536)
        .fill(0)
        .map(() => Math.random());

      await collection.insertOne({
        $vector: vector,
        text: chunk,
        source: url,
      });

      console.log("Inserted chunk for", url);
    }
  }

  console.log("✅ Data loaded into Astra DB (dummy vectors)");
};

// --- Top-level execution ---
(async () => {
  try {
    await createCollection();
    await LoadSampleData();
    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();
