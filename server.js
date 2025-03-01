// backend/server.js
const express = require('express');
const cors = require('cors');
const { retrieveRelevantResearch } = require('./retrieval');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Generative AI client and use a supported generative model.
// Note: Replace "text-bison-001" with a model that supports generateContent if needed.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const generativeModel = genAI.getGenerativeModel({ model: "text-bison-001" });

app.post('/generate-recommendation', async (req, res) => {
  try {
    // Expect a JSON payload with a "patientData" field.
    const patientData = req.body.patientData;
    if (!patientData) {
      return res.status(400).json({ error: "Missing patientData in request body" });
    }

    // Retrieve the top 3 matching research documents based on the patient data.
    const researchResults = await retrieveRelevantResearch(patientData);
    
    // Build a prompt for the generative model that combines patient details and research findings.
    const researchContent = researchResults.length
      ? researchResults.map((doc, i) => `Source ${i + 1}: ${doc.title} - ${doc.abstract}`).join('\n')
      : "No research findings available.";
    
    const prompt = `Patient information: ${patientData}\n\nRelevant research:\n${researchContent}\n\nBased on the above, provide a detailed clinical recommendation with reasoning.`;
    
    // Call the generative model to produce the recommendation.
    const response = await generativeModel.generateContent(prompt);
    const recommendation = response.text(); // Adjust this if the structure differs.

    // Return the recommendation along with the research sources used.
    res.json({ recommendation, sources: researchResults });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ error: "Error generating recommendation" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
