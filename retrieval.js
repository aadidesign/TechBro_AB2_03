// backend/retrieval.js
const { PineconeClient } = require("@pinecone-database/pinecone");
require("dotenv").config();
const fs = require("fs");

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = "clinical-research";

const researchData = JSON.parse(fs.readFileSync("./data/research_data_embedded.json", "utf-8"));

async function initializePinecone() {
  const client = new PineconeClient();
  await client.init({
    apiKey: PINECONE_API_KEY,
    environment: "us-west1-gcp" // Change based on your region
  });

  const index = client.Index(PINECONE_INDEX_NAME);

  // Upload embeddings to Pinecone
  const upserts = researchData.map((item, i) => ({
    id: `doc-${i}`,
    values: item.embedding,
    metadata: { title: item.title, abstract: item.abstract }
  }));

  await index.upsert(upserts);
  console.log("Embeddings stored in Pinecone.");
}

initializePinecone();
