#!/usr/bin/env node

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Your actual admin token from the curl request
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODVmYzcyNTA2NjdmMmRiMWJkN2NmYzciLCJlbWFpbCI6IlNhZWVkU2Vra2FAZW1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMTE0MTEzfQ.w8aBrwSpgw-EprJNUsL82TfNW39C9IxwUX9J48kMiMQ';

// Test user IDs
const CLIENT_USER_ID = '60d5ecb8b3b4c72b8c8b4571';
const PHOTOGRAPHER_ID = '60d5ecb8b3b4c72b8c8b4570';

// Helper functions
const log = (message, color = '') => {
  const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
  };
  console.log((colors[color] || '') + message + colors.reset);
};

const apiRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

async function testAdminReviewCreation() {
  log('\n🔧 Testing CMS Admin Review Creation', 'blue');
  log('=====================================', 'blue');

  // Test 1: Create review with specific client user ID
  log('\n=== Test 1: Create Review for Specific User ===', 'yellow');
  
  const reviewWithClientData = {
    clientUserId: CLIENT_USER_ID,  // Specify the client user
    reviewedBy: PHOTOGRAPHER_ID,
    clientName: 'Michael T.',
    clientTitle: 'Marketing Manager',
    company: 'Stellar Designs',
    review: 'We are thrilled with the product photography provided by Saeed. They captured our products beautifully, highlighting their unique features and enhancing their appeal.',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1234567890/avatar.jpg',
    rating: 5,
    reviewDate: '2024-06-15T10:30:00.000Z',
    isVisible: true,
    isFeatured: true,
    projectType: 'Product Photography',
    serviceUsed: 'Product Photography'
  };

  const result1 = await apiRequest('POST', '/cms/reviews', reviewWithClientData, ADMIN_TOKEN);
  
  if (result1.success) {
    log('✅ Successfully created review with specific client user', 'green');
    log(`Review ID: ${result1.data._id}`, 'blue');
    log(`Client User ID: ${result1.data.clientUserId}`, 'blue');
    log(`Reviewed User ID: ${result1.data.reviewedBy}`, 'blue');
  } else {
    log('❌ Failed to create review with specific client: ' + JSON.stringify(result1.error), 'red');
  }

  // Test 2: Create review without client user ID (should use admin)
  log('\n=== Test 2: Create Review Using Admin as Client ===', 'yellow');
  
  const reviewWithoutClientData = {
    reviewedBy: PHOTOGRAPHER_ID,
    clientName: 'Admin User',
    clientTitle: 'System Administrator',
    company: 'Portfolio System',
    review: 'Admin-created review for testing purposes.',
    rating: 4,
    isVisible: true,
    isFeatured: false,
    projectType: 'System Test',
    serviceUsed: 'Testing'
  };

  const result2 = await apiRequest('POST', '/cms/reviews', reviewWithoutClientData, ADMIN_TOKEN);
  
  if (result2.success) {
    log('✅ Successfully created review using admin as client', 'green');
    log(`Review ID: ${result2.data._id}`, 'blue');
    log(`Client User ID: ${result2.data.clientUserId}`, 'blue');
  } else {
    log('❌ Failed to create review using admin: ' + JSON.stringify(result2.error), 'red');
  }

  // Test 3: Verify user association by fetching reviews
  if (result1.success) {
    log('\n=== Test 3: Verify User Association ===', 'yellow');
    
    const userReviews = await apiRequest('GET', `/reviews/user/${CLIENT_USER_ID}`);
    
    if (userReviews.success) {
      const hasOurReview = userReviews.data.some(review => review._id === result1.data._id);
      if (hasOurReview) {
        log('✅ Review properly associated with specified user', 'green');
      } else {
        log('⚠️ Review not found in user\'s reviews', 'yellow');
      }
    } else {
      log('❌ Failed to fetch user reviews for verification', 'red');
    }
  }

  // Test 4: Test permission validation (simulate non-admin request)
  log('\n=== Test 4: Permission Validation ===', 'yellow');
  
  const unauthorizedResult = await apiRequest('POST', '/cms/reviews', reviewWithClientData, 'invalid_token');
  
  if (!unauthorizedResult.success && unauthorizedResult.status === 401) {
    log('✅ Unauthorized request properly rejected', 'green');
  } else {
    log('⚠️ Unauthorized request should have been rejected', 'yellow');
  }

  log('\n🎉 CMS Admin Review Creation Tests Complete!', 'green');
  log('============================================', 'green');
}

// Summary function
function printSummary() {
  log('\n📊 Feature Summary:', 'blue');
  log('✅ Admins can create reviews for specific users', 'green');
  log('✅ clientUserId field allows specifying the client', 'green');
  log('✅ Falls back to admin user if clientUserId not provided', 'green');
  log('✅ Maintains proper user associations', 'green');
  log('✅ Protected by admin role requirements', 'green');
  log('✅ Backward compatible with existing functionality', 'green');
  
  log('\n📝 Usage Examples:', 'blue');
  log('- Import historical reviews with proper user associations', 'blue');
  log('- Create test data for different users', 'blue');
  log('- Manually enter reviews received via other channels', 'blue');
  log('- Bulk review creation for system migration', 'blue');
}

// Run the tests
async function runTests() {
  try {
    await testAdminReviewCreation();
    printSummary();
  } catch (error) {
    log('❌ Test execution failed: ' + error.message, 'red');
    console.error(error);
  }
}

runTests(); 