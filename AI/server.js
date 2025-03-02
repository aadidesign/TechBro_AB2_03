// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Added missing import
const path = require('path'); // Added missing import
const { retrieveRelevantResearch } = require('./retrieval');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

app.post('/generate-recommendation', async (req, res) => {
  try {
    console.log("generating....");
    
    const patientId = req.body.patientId;
    if (!patientId) {
      return res.status(400).json({ error: "Missing patientId in request body" });
    }
    
    // Fixed variable declaration - removed const
    let aiSupportPatientData = null;
    
    // Fixed path to patient data file
    const patientsFilePath = path.join(__dirname, "../EHR_node_Backend/data", "patients.json");
    
    if (!fs.existsSync(patientsFilePath)) {
      console.log("⚠️ Patients file does not exist!");
      return res.status(404).json({ error: "Patient data file not found" });
    } 
    
    const fileContent = fs.readFileSync(patientsFilePath, "utf-8").trim();
    if (fileContent.length === 0) {
      console.log("⚠️ Patients file is empty!");
      return res.status(404).json({ error: "Patient data file is empty" });
    } 
    
    const data = JSON.parse(fileContent);
    aiSupportPatientData = data.find((patient) => patient.id === patientId);
    
    if (!aiSupportPatientData) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fixed function parameter - passing the actual patient data, not the file path
    const researchResults = await retrieveRelevantResearch(aiSupportPatientData);
      
    const researchContent = researchResults.length
      ? researchResults.map((doc, i) => `Source ${i + 1}: ${doc.title} - ${doc.abstract}`).join('\n')
      : "No research findings available.";
        
    const prompt = `Patient information: ${JSON.stringify(aiSupportPatientData, null, 2)}
    
    Relevant research:
    ${researchContent}
    
    Generate a clinical recommendation in the following JSON format:
    {
      "patient_id": "string",
      "patient_name": "string",
      "recommendation_summary": "string",
      "treatment_plan": {
        "medications": ["string"],
        "lifestyle_changes": ["string"],
        "monitoring_instructions": ["string"]
      },
      "research_references": [
        {
          "title": "string",
          "authors": ["string"],
          "year": number,
          "relevance": "string"
        }
      ],
      "confidence_score": 0-100,
      "risk_assessment": "string",
      "followup_schedule": "string"
    }
    
    Requirements:
    - Include all listed fields
    - medications should match patient's current diagnoses
    - research_references should be from provided sources
    - confidence_score must be numerical value
    - Use plain JSON format (no markdown)`;
    
    const response = await generativeModel.generateContent(prompt);
    // Fix to extract the actual text content from the response
    const recommendation = response.response.text();
    
    // Return the recommendation along with the research sources used
    res.json({ recommendation, sources: researchResults });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ error: "Error generating recommendation", details: error.message });
  }
});

const PORT = process.env.PORT || 3010;
app.listen(3010, () => {
  console.log(`Server running on port ${PORT}`);
});