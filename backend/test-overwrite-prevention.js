const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test the new overwrite prevention functionality
async function testOverwritePrevention() {
  console.log('🧪 Testing Overwrite Prevention Functionality\n');

  const baseUrl = 'http://localhost:3000/api';
  
  // Create a test file with Arabic name
  const testFileName = 'عربيpdf.pdf';
  const testFilePath = path.join(__dirname, testFileName);
  
  // Create a dummy PDF file for testing
  const dummyPdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF';
  
  fs.writeFileSync(testFilePath, dummyPdfContent);
  console.log(`✅ Created test file: ${testFileName}`);

  try {
    // Test 1: Upload the same file twice with preventOverwrite=true (default)
    console.log('\n📤 Test 1: Uploading same file twice with preventOverwrite=true (default)');
    
    const formData1 = new FormData();
    formData1.append('files', fs.createReadStream(testFilePath));
    formData1.append('folder', 'portfolio/files');
    formData1.append('preserveOriginalName', 'true');
    formData1.append('preventOverwrite', 'true');

    const response1 = await fetch(`${baseUrl}/media/upload/mixed`, {
      method: 'POST',
      body: formData1
    });

    const result1 = await response1.json();
    console.log('First upload result:', JSON.stringify(result1, null, 2));

    // Upload the same file again
    const formData2 = new FormData();
    formData2.append('files', fs.createReadStream(testFilePath));
    formData2.append('folder', 'portfolio/files');
    formData2.append('preserveOriginalName', 'true');
    formData2.append('preventOverwrite', 'true');

    const response2 = await fetch(`${baseUrl}/media/upload/mixed`, {
      method: 'POST',
      body: formData2
    });

    const result2 = await response2.json();
    console.log('Second upload result:', JSON.stringify(result2, null, 2));

    // Check if the second upload has a different filename (timestamp added)
    if (result1[0].publicId !== result2[0].publicId) {
      console.log('✅ SUCCESS: Overwrite prevention worked! Files have different names:');
      console.log(`   First: ${result1[0].publicId} (original filename: ${result1[0].filename})`);
      console.log(`   Second: ${result2[0].publicId} (original filename: ${result2[0].filename})`);
    } else {
      console.log('❌ FAILED: Overwrite prevention did not work - files have same name');
    }

    // Test 2: Upload with preventOverwrite=false (should overwrite)
    console.log('\n📤 Test 2: Uploading same file with preventOverwrite=false');
    
    const formData3 = new FormData();
    formData3.append('files', fs.createReadStream(testFilePath));
    formData3.append('folder', 'portfolio/files');
    formData3.append('preserveOriginalName', 'true');
    formData3.append('preventOverwrite', 'false');

    const response3 = await fetch(`${baseUrl}/media/upload/mixed`, {
      method: 'POST',
      body: formData3
    });

    const result3 = await response3.json();
    console.log('Third upload result (preventOverwrite=false):', JSON.stringify(result3, null, 2));

    // Test 3: Upload with preserveOriginalName=false (should use timestamp-based names)
    console.log('\n📤 Test 3: Uploading with preserveOriginalName=false');
    
    const formData4 = new FormData();
    formData4.append('files', fs.createReadStream(testFilePath));
    formData4.append('folder', 'portfolio/files');
    formData4.append('preserveOriginalName', 'false');
    formData4.append('preventOverwrite', 'true');

    const response4 = await fetch(`${baseUrl}/media/upload/mixed`, {
      method: 'POST',
      body: formData4
    });

    const result4 = await response4.json();
    console.log('Fourth upload result (preserveOriginalName=false):', JSON.stringify(result4, null, 2));

    // Test 4: Test single file upload
    console.log('\n📤 Test 4: Single file upload with overwrite prevention');
    
    const formData5 = new FormData();
    formData5.append('file', fs.createReadStream(testFilePath));
    formData5.append('folder', 'portfolio/files');
    formData5.append('preserveOriginalName', 'true');
    formData5.append('preventOverwrite', 'true');

    const response5 = await fetch(`${baseUrl}/media/upload`, {
      method: 'POST',
      body: formData5
    });

    const result5 = await response5.json();
    console.log('Single file upload result:', JSON.stringify(result5, null, 2));

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log(`\n🧹 Cleaned up test file: ${testFileName}`);
    }
  }
}

// Run the test
testOverwritePrevention().catch(console.error); 