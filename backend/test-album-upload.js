const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testAlbumUpload() {
  try {
    const form = new FormData();
    
    // Add text fields
    form.append('title', 'Test Photography Album');
    form.append('description', 'A beautiful collection of test photos');
    form.append('tags', 'Travel,Photography,Test');
    form.append('features', JSON.stringify([
      {
        icon: '📸',
        title: 'Camera Used',
        value: 'Canon EOS R5',
        order: 1
      }
    ]));

    // Add cover image (if you have a test image)
    // form.append('coverImage', fs.createReadStream('./test-image.jpg'));
    
    // Add album images (if you have test images)
    // form.append('images', fs.createReadStream('./test-image1.jpg'));
    // form.append('images', fs.createReadStream('./test-image2.jpg'));

    const response = await axios.post('http://localhost:3000/api/albums', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODVmYzcyNTA2NjdmMmRiMWJkN2NmYzciLCJlbWFpbCI6IlNhZWVkU2Vra2FAZW1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMTE0MTEzfQ.w8aBrwSpgw-EprJNUsL82TfNW39C9IxwUX9J48kMiMQ'
      }
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAlbumUpload(); 