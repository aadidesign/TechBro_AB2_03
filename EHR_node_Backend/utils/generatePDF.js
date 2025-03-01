const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePDF = (prescription, outputPath, callback) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text("Prescription", { align: "center" });
  doc.moveDown();
  
  doc.fontSize(14).text(`Patient Name: ${prescription.patient_name}`);
  doc.text(`Doctor: ${prescription.doctor_name}`);
  doc.text(`Date: ${prescription.date}`);
  doc.moveDown();

  doc.fontSize(16).text("Medications:", { underline: true });
  prescription.medications.forEach((med, index) => {
    doc.text(`${index + 1}. ${med}`);
  });

  doc.moveDown();
  doc.fontSize(16).text("Instructions:", { underline: true });
  doc.text(prescription.instructions);

  doc.end();
  callback();
};

module.exports = generatePDF;
