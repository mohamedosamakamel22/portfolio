const fs = require('fs');
const FormData = require('form-data');

// Use the built-in fetch in Node.js 18+
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSimpleUpload() {
  const baseUrl = 'http://localhost:3000/api';
  
  // Create a test file
  const testContent = 'Test content';
  const testFilePath = './test-simple-file.txt';
  
  fs.writeFileSync(testFilePath, testContent);
  
  console.log('🧪 Testing simple file upload...');
  
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(testFilePath), {
      filename: 'test-file.txt',
      contentType: 'text/plain'
    });
    formData.append('folder', 'portfolio/files');
    formData.append('preserveOriginalName', 'true');
    formData.append('preventOverwrite', 'true');

    const response = await fetch(`${baseUrl}/media/upload/mixed`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('📤 Upload result:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ SUCCESS: Simple file upload worked!');
      console.log('📁 File URL:', result[0]?.url);
    } else {
      console.log('❌ FAILED:', result.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

testSimpleUpload(); 