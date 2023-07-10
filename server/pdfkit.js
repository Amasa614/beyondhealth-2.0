const express = require('express');
const PDFDocument = require('pdfkit');

const app = express();

app.get('/generate-pdf', (req, res) => {
  const { output } = req.query;
  const doc = new PDFDocument();
  
  // Add content and formatting to the PDF document using PDFKit methods
  doc.text(output);

  // Set the appropriate headers for PDF response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

  // Stream the generated PDF to the response
  doc.pipe(res);
  doc.end();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
