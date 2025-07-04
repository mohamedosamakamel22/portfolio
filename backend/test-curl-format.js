const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testCurlFormat() {
  try {
    const form = new FormData();
    
    // Add text fields exactly like the curl command
    form.append('title', 'My Photography Album');
    form.append('description', 'A beautiful collection');
    form.append('tags', 'Travel,Photography');
    form.append('features', JSON.stringify([
      {
        icon: '📸',
        title: 'Camera',
        value: 'Canon EOS R5'
      }
    ]));

    // Add cover image (simulating the curl command)
    // Note: In a real scenario, you would have an actual image file
    // For testing, we'll create a dummy file
    const dummyImagePath = './dummy-image.jpg';
    if (!fs.existsSync(dummyImagePath)) {
      // Create a dummy file for testing
      fs.writeFileSync(dummyImagePath, 'dummy image content');
    }
    
    form.append('coverImage', fs.createReadStream(dummyImagePath));
    form.append('images', fs.createReadStream(dummyImagePath));

    const response = await axios.post('http://localhost:3000/api/albums', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODVmYzcyNTA2NjdmMmRiMWJkN2NmYzciLCJlbWFpbCI6IlNhZWVkU2Vra2FAZW1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMTE0MTEzfQ.w8aBrwSpgw-EprJNUsL82TfNW39C9IxwUX9J48kMiMQ'
      }
    });

    console.log('Success:', response.data);
    
    // Clean up dummy file
    if (fs.existsSync(dummyImagePath)) {
      fs.unlinkSync(dummyImagePath);
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCurlFormat(); 