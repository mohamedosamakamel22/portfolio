const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';
const USER_ID = '685fe192e9ad4407f2b52ce4';

// Helper function to make requests
async function makeRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error making ${method} request to ${url}:`, error.response?.data || error.message);
    throw error;
  }
}

// Test functions
async function testGetGearSection() {
  console.log('\n=== Testing GET Gear Section ===');
  try {
    const response = await makeRequest('GET', '/profile-objects/gear');
    console.log('✅ GET gear section successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ GET gear section failed');
  }
}

async function testUpdateGearSection() {
  console.log('\n=== Testing PUT Gear Section ===');
  
  const gearData = {
    title: 'My Professional Gear',
    subtitle: 'Equipment I use to create amazing content',
    gearSection: [
      {
        title: 'Cameras',
        order: 1,
        subtitle: 'Professional camera equipment',
        isActive: true,
        gearItems: [
          {
            title: 'Canon EOS R5',
            icon: 'fas fa-camera',
            order: 1,
            isActive: true
          },
          {
            title: 'Sony A7S III',
            icon: 'fas fa-video',
            order: 2,
            isActive: true
          }
        ]
      },
      {
        title: 'Audio Equipment',
        order: 2,
        subtitle: 'Professional audio recording gear',
        isActive: true,
        gearItems: [
          {
            title: 'Rode VideoMic Pro',
            icon: 'fas fa-microphone',
            order: 1,
            isActive: true
          }
        ]
      },
      {
        title: 'Computing',
        order: 3,
        subtitle: 'Editing and processing equipment',
        isActive: true,
        gearItems: [
          {
            title: 'MacBook Pro M2',
            icon: 'fas fa-desktop',
            order: 1,
            isActive: true
          }
        ]
      }
    ],
    isActive: true
  };
  
  try {
    const response = await makeRequest('PUT', '/profile-update-objects/gear', gearData);
    console.log('✅ PUT gear section successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ PUT gear section failed');
  }
}

async function testGetGearAfterUpdate() {
  console.log('\n=== Testing GET Gear Section After Update ===');
  try {
    const response = await makeRequest('GET', '/profile-objects/gear');
    console.log('✅ GET gear section after update successful');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    // Verify the update was successful
    if (response.title === 'My Professional Gear') {
      console.log('✅ Title update confirmed');
    } else {
      console.log('❌ Title update not confirmed');
    }
    
    if (response.gearSection && response.gearSection.length === 3) {
      console.log('✅ Gear categories count correct (3 categories)');
      
      // Check if first category has gear items
      if (response.gearSection[0].gearItems && response.gearSection[0].gearItems.length === 2) {
        console.log('✅ First category has correct number of gear items (2 items)');
      } else {
        console.log('❌ First category gear items count incorrect');
      }
    } else {
      console.log('❌ Gear categories count incorrect');
    }
  } catch (error) {
    console.log('❌ GET gear section after update failed');
  }
}

async function testPartialUpdateGearSection() {
  console.log('\n=== Testing Partial Update Gear Section ===');
  
  const partialGearData = {
    title: 'Updated Gear Title',
    isActive: false
  };
  
  try {
    const response = await makeRequest('PUT', '/profile-update-objects/gear', partialGearData);
    console.log('✅ Partial PUT gear section successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ Partial PUT gear section failed');
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Gear Section API Tests...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`User ID: ${USER_ID}`);
  
  try {
    await testGetGearSection();
    await testUpdateGearSection();
    await testGetGearAfterUpdate();
    await testPartialUpdateGearSection();
    await testGetGearAfterUpdate();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run the tests
runTests(); 