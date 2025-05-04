/**
 * Test script to generate a sample LOI PDF
 * Run with: node test-loi-pdf.js
 */

// Register TypeScript
require('ts-node/register');

const loiService = require('./src/services/loiService').default;
const fs = require('fs');
const path = require('path');

// Sample LOI form data
const sampleData = {
  fullName: "John Doe",
  company: "Example Corp",
  email: "john.doe@example.com",
  country: "United States",
  sector: "E-commerce",
  comments: "Looking forward to implementing this solution for our customers.",
  signature: "", // Will be filled with a sample signature
};

// Create a simple signature (base64 encoded PNG)
const createSampleSignature = () => {
  // Path to a sample signature or we can use the FlexFi logo as a placeholder
  const logoPath = path.join(__dirname, 'src/assets/images/Logo_-_FlexF.png');
  
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoData.toString('base64')}`;
  }
  
  // Fallback to a minimal base64 PNG if logo doesn't exist
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAABmJLR0QA/wD/AP+gvaeTAAAA30lEQVR4nO3ZQQ6DIBRF0e/aCblw9t/BDFyJpAmhKlXrOSMT4BJ4hBBCaLI97v3c9jHnXDnKZXvCz9Yx5vyo62cZ5bz4/vvMOe9Rt8vr7O/5/zHL68zOPeZM3jmzP3PnzP7MnTP7M3fO7M/cOfNvzJ0z+zN3zuzP3DmzP3PnzP7MnTP7M3fO7M/cObM/c+fM/sydM/szd87sz9w5sz9z58z+zJ0z+zN3zuzP3DmzP3PnzP7MnTP7M3fO7M/cObM/c+fM/sydM/szd87sz9w5sz9z58z+zJ0z+zN3zuzP3Dnze1OAl9AH/h/DAAAAAElFTkSuQmCC';
};

// Run the test
const runTest = async () => {
  try {
    // Set the signature
    sampleData.signature = createSampleSignature();
    
    // Generate the PDF
    const pdfPath = await loiService.generatePDF(sampleData);
    
    console.log(`PDF generated successfully at: ${pdfPath}`);
    console.log(`Full path: ${path.resolve(pdfPath)}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Execute the test
runTest(); 