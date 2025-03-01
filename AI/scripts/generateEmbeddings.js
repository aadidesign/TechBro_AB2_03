// scripts/generateEmbeddings.js
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Ensure your GEMINI_API_KEY is set in the .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCRdq7VVCj0magiKaCnVuRjSyM5MHyZ0T8";
if (!GEMINI_API_KEY) {
  console.error("Please set your GEMINI_API_KEY in the .env file.");
  process.exit(1);
}

// Initialize the Google Generative AI client and model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Define file paths for input research data and output with embeddings
const inputFilePath = '../Data/research_data.json';
const outputFilePath = '../Data/research_data_embedded.json';

// Load research data (assumed to be an array of objects with "title" and "abstract" fields)
const researchData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

/**
 * Function to get an embedding for a given text using the Gemini API.
 * Uses the embedContent method from the Google Generative AI package.
 */
async function getGeminiEmbedding(text) {
  try {
    const result = await model.embedContent(text);
    // Assuming the embedding is returned in result.embedding.values
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding for text:", text, error);
    return null;
  }
}

/**
 * Main function to process each research item, generate its embedding,
 * and write the results to an output file.
 */
async function generateEmbeddings() {
  const results = [];
  for (const item of researchData) {
    console.log(`Processing: ${item.title}`);
    const embedding = await getGeminiEmbedding(item.abstract);
    if (embedding) {
      results.push({
        title: item.title,
        abstract: item.abstract,
        embedding: embedding
      });
    }
    // Optional delay to manage rate limits (e.g., 1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
  console.log(`Embeddings saved to ${outputFilePath}`);
}

// Execute the embedding generation process
generateEmbeddings();
