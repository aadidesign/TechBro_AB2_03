// backend/retrieval.js
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const fs = require("fs");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST;
const PINECONE_INDEX_NAME = "clinical-research";

// Load pre-generated research data (with embeddings) from file
const researchData = JSON.parse(fs.readFileSync("./data/research_data_embedded.json", "utf-8"));

// Initialize the Google Generative AI client and the embedding model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

/**
 * Generate an embedding for a given text using the Gemini API.
 * Returns an array of numbers representing the embedding.
 */
async function getEmbedding(text) {
  try {
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text: text }] },
    });
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Initialize Pinecone by checking for the existence of the index and upserting research data.
 */
async function initializePinecone() {
  try {
    // Initialize the Pinecone client
    const pinecone = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });
    
    // Check if index exists
    const indexList = await pinecone.listIndexes();
    
    // Find if our index exists in the list
    const indexExists = indexList.indexes?.some(index => index.name === PINECONE_INDEX_NAME);
    
    if (!indexExists) {
      console.error(`Index "${PINECONE_INDEX_NAME}" not found. Please create it in your Pinecone dashboard.`);
      process.exit(1);
    }
    
    const index = pinecone.index(PINECONE_INDEX_NAME);
    
    // Prepare data for upsert: each document gets an id, its embedding, and metadata.
    const upsertData = researchData.map((item, i) => ({
      id: `doc-${i}`,
      values: item.embedding, 
      metadata: { title: item.title, abstract: item.abstract }
    }));
    
    // Batch upserts for better performance (max 100 vectors per request)
    const batchSize = 100;
    for (let i = 0; i < upsertData.length; i += batchSize) {
      const batch = upsertData.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Upserted batch ${i/batchSize + 1} of ${Math.ceil(upsertData.length/batchSize)}`);
    }
    
    console.log("✅ Embeddings successfully upserted to Pinecone.");
  } catch (error) {
    console.error("Error initializing Pinecone:", error);
    throw error;
  }
}

/**
 * Retrieve relevant research based on patient data:
 * 1. Generate an embedding for the patient input.
 * 2. Query the Pinecone index for the top 3 most similar research entries.
 * Returns an array of metadata from the matched research entries.
 */
async function retrieveRelevantResearch(patientData) {
  try {
    const pinecone = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });
    
    const index = pinecone.index(PINECONE_INDEX_NAME);
    
    const queryEmbedding = await getEmbedding(patientData);
    if (!queryEmbedding) {
      console.error("Failed to generate query embedding.");
      return [];
    }
    
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true
    });
    
    return queryResponse.matches.map(match => match.metadata);
  } catch (error) {
    console.error("Error retrieving research:", error);
    return [];
  }
}

// If this file is run directly, initialize Pinecone and test retrieval with a sample patient query.
if (require.main === module) {
  (async () => {
    try {
      await initializePinecone();
      const testPatientData = "45-year-old male with type 2 diabetes experiencing frequent hypoglycemia.";
      const results = await retrieveRelevantResearch(testPatientData);
      console.log("Retrieved research:", results);
    } catch (error) {
      console.error("Error in main execution:", error);
    }
  })();
}

// Export functions for use in other parts of the application.
module.exports = { initializePinecone, retrieveRelevantResearch, getEmbedding };