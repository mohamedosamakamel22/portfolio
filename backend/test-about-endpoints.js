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
async function testGetAboutSection() {
  console.log('\n=== Testing GET About Section ===');
  try {
    const response = await makeRequest('GET', '/profile-objects/about');
    console.log('✅ GET about section successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ GET about section failed');
  }
}

async function testUpdateAboutSection() {
  console.log('\n=== Testing PUT About Section ===');
  
  const aboutData = {
    aboutImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/about-me.jpg',
    description: 'I am a passionate photographer dedicated to capturing life\'s most precious moments through my lens.',
    journey: 'My journey started 15 years ago when I picked up my first camera. What began as a hobby quickly became my life\'s passion.',
    motivation: 'What motivates me is the ability to freeze time and create lasting memories that families will treasure forever.',
    endingText: 'Let\'s work together to create something amazing and capture your special moments!',
    images: [
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-1.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-2.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-3.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/gallery-4.jpg'
    ],
    isActive: true,
    button: {
      text: 'Learn More About Me',
      url: '/about-me',
      enabled: true
    }
  };
  
  try {
    const response = await makeRequest('PUT', '/profile-update-objects/about', aboutData);
    console.log('✅ PUT about section successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ PUT about section failed');
  }
}

async function testGetAboutAfterUpdate() {
  console.log('\n=== Testing GET About Section After Update ===');
  try {
    const response = await makeRequest('GET', '/profile-objects/about');
    console.log('✅ GET about section after update successful');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    // Verify the update was successful
    if (response.description && response.description.includes('precious moments through my lens')) {
      console.log('✅ Description update confirmed');
    } else {
      console.log('❌ Description update not confirmed');
    }
    
    if (response.journey && response.journey.includes('15 years ago')) {
      console.log('✅ Journey update confirmed');
    } else {
      console.log('❌ Journey update not confirmed');
    }
    
    if (response.button && response.button.text === 'Learn More About Me') {
      console.log('✅ Button text update confirmed');
    } else {
      console.log('❌ Button text update not confirmed');
    }
  } catch (error) {
    console.log('❌ GET about section after update failed');
  }
}

async function testPartialUpdateAboutSection() {
  console.log('\n=== Testing Partial Update About Section ===');
  
  const partialAboutData = {
    endingText: 'Ready to capture your story? Let\'s create magic together!',
    isActive: false,
    button: {
      text: 'Contact Me',
      url: '/contact',
      enabled: true
    }
  };
  
  try {
    const response = await makeRequest('PUT', '/profile-update-objects/about', partialAboutData);
    console.log('✅ Partial PUT about section successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ Partial PUT about section failed');
  }
}

async function testUpdateAboutImage() {
  console.log('\n=== Testing Update About Image ===');
  
  const imageUpdateData = {
    aboutImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/new-about-image.jpg'
  };
  
  try {
    const response = await makeRequest('PUT', '/profile-update-objects/about', imageUpdateData);
    console.log('✅ About image update successful');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('❌ About image update failed');
  }
}

async function testUpdateAboutImagesArray() {
  console.log('\n=== Testing Update About Images Array ===');
  
  const imagesUpdateData = {
    images: [
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/new-gallery-1.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/new-gallery-2.jpg',
      'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/about/new-gallery-3.jpg'
    ]
  };
  
  try {
    const response = await makeRequest('PUT', '/profile-update-objects/about', imagesUpdateData);
    console.log('✅ About images array update successful');
    console.log('Response:', JSON.stringify(response, null, 2));
    
    // Verify the images array was updated
    if (response.data && response.data.images && Array.isArray(response.data.images)) {
      console.log('✅ Images array structure confirmed');
      console.log(`✅ Images array length: ${response.data.images.length}`);
    } else {
      console.log('❌ Images array structure not confirmed');
    }
  } catch (error) {
    console.log('❌ About images array update failed');
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting About Section API Tests...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`User ID: ${USER_ID}`);
  
  try {
    await testGetAboutSection();
    await testUpdateAboutSection();
    await testGetAboutAfterUpdate();
    await testPartialUpdateAboutSection();
    await testGetAboutAfterUpdate();
    await testUpdateAboutImage();
    await testGetAboutAfterUpdate();
    await testUpdateAboutImagesArray();
    await testGetAboutAfterUpdate();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run the tests
runTests(); 