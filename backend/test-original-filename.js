const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testOriginalFilename() {
  try {
    // Create a test file with Arabic name
    const testFileName = 'صورة.png';
    const testFilePath = './test-image.png';
    
    // Create a simple test image if it doesn't exist
    if (!fs.existsSync(testFilePath)) {
      // Create a minimal PNG file for testing
      const pngHeader = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
        0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
        0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
        0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      fs.writeFileSync(testFilePath, pngHeader);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath), testFileName);
    form.append('folder', 'portfolio/files');

    console.log('Testing upload with original filename:', testFileName);
    
    const response = await axios.post('http://localhost:3000/api/media/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('Upload Response:', response.data);
    
    // Check if the publicId contains the original filename (sanitized)
    const publicId = response.data.publicId;
    const expectedSanitizedName = 'صورة.png'; // Should preserve Arabic characters now
    
    if (publicId.includes('صورة')) {
      console.log('✅ SUCCESS: File uploaded with original name preserved');
      console.log('Original name:', testFileName);
      console.log('Public ID:', publicId);
    } else {
      console.log('❌ FAILED: File was not uploaded with original name');
      console.log('Expected to contain: صورة');
      console.log('Actual publicId:', publicId);
    }

  } catch (error) {
    console.error('Error testing original filename:', error.response?.data || error.message);
  }
}

testOriginalFilename(); 