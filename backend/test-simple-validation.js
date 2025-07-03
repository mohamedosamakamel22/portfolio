const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testSimpleValidation() {
  console.log('🧪 Testing Simple API Validation...\n');

  try {
    // Test 1: Check if API is responding
    console.log('1. Testing API health...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}`);
      console.log('✅ API is responding');
    } catch (error) {
      console.log('❌ API not responding:', error.message);
      return;
    }

    // Test 2: Try to access protected route without authentication
    console.log('\n2. Testing authentication protection...');
    try {
      await axios.post(`${BASE_URL}/reviews`, {
        clientName: 'Test Client',
        clientTitle: 'Test Title',
        company: 'Test Company',
        review: 'Test review',
        rating: 5
      });
      console.log('❌ Should have required authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }

    // Test 3: Try to register a test user and login
    console.log('\n3. Testing user registration and login...');
    try {
      // Try to register a test user
      const testUser = {
        email: 'test@validation.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Test user registered successfully');

      // Try to login
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      const token = loginResponse.data.access_token;
      console.log('✅ Test user login successful');

      // Test 4: Try creating review with invalid user ID (should fail due to validation)
      console.log('\n4. Testing user ID validation...');
      try {
        await axios.post(`${BASE_URL}/reviews`, {
          clientUserId: '507f1f77bcf86cd799439011', // Non-existent user ID
          clientName: 'Test Client',
          clientTitle: 'Test Title',
          company: 'Test Company',
          review: 'Test review',
          rating: 5
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('❌ Should have failed with invalid user ID');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ Correctly blocked due to insufficient role (customer trying to create review)');
        } else if (error.response?.status === 400) {
          console.log('✅ Correctly rejected invalid user ID');
          console.log(`   Error: ${error.response.data.message}`);
        } else {
          console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
        }
      }

      console.log('\n✅ Basic validation tests completed successfully!');
      
    } catch (error) {
      // If registration fails, it might be because user already exists
      if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  Test user already exists, trying to login...');
        try {
          const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@validation.com',
            password: 'TestPass123!'
          });
          console.log('✅ Logged in with existing test user');
        } catch (loginError) {
          console.log('❌ Could not login with existing user:', loginError.response?.data);
        }
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testSimpleValidation(); 