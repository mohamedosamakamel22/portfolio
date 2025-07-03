const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test user ID - replace with an actual user ID from your database
const TEST_USER_ID = '507f1f77bcf86cd799439011'; // Example MongoDB ObjectId

async function testProfileObjectsAPIs() {
  console.log('🧪 Testing Profile Objects Controller APIs...\n');

  const endpoints = [
    'hero',
    'stats', 
    'bio',
    'brands',
    'experience',
    'services',
    'faq',
    'social-media',
    'cta-buttons',
    'youtube-video'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing GET /profile-objects/${endpoint}/${TEST_USER_ID}`);
      
      const response = await axios.get(`${BASE_URL}/profile-objects/${endpoint}/${TEST_USER_ID}`);
      
      console.log(`✅ ${endpoint.toUpperCase()}: Success`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, JSON.stringify(response.data, null, 2));
      console.log('');
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.toUpperCase()}: Error ${error.response.status}`);
        console.log(`   Message: ${error.response.data.message || error.response.statusText}`);
      } else {
        console.log(`❌ ${endpoint.toUpperCase()}: Network Error`);
        console.log(`   Message: ${error.message}`);
      }
      console.log('');
    }
  }

  console.log('🎉 Profile Objects API testing completed!');
}

// Run the test
testProfileObjectsAPIs().catch(console.error); 