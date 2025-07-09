const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = '685fe192e9ad4407f2b52ce4'; // Default user ID from the existing data

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Helper functions for colored output
function logSuccess(message) {
  console.log('\x1b[32m✓ ' + message + '\x1b[0m');
}

function logError(message) {
  console.log('\x1b[31m✗ ' + message + '\x1b[0m');
}

function logInfo(message) {
  console.log('\x1b[36mℹ ' + message + '\x1b[0m');
}

function logWarning(message) {
  console.log('\x1b[33m⚠ ' + message + '\x1b[0m');
}

function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };
  console.log(colors[color] + message + '\x1b[0m');
}

// Test functions
async function testUserStatistics() {
  log('\n=== Testing User Statistics API ===', 'yellow');
  
  const response = await apiRequest('GET', `/api/statistics/user/${TEST_USER_ID}`);
  
  if (response.success) {
    logSuccess('Successfully retrieved user statistics');
    logInfo(`User ID: ${response.data.userId}`);
    logInfo(`Reviews: ${response.data.statistics.reviews}`);
    logInfo(`Albums: ${response.data.statistics.albums}`);
    logInfo(`Home Sections: ${response.data.statistics.homeSections}`);
    logInfo(`Reports: ${response.data.statistics.reports}`);
  } else {
    logError(`Failed to retrieve user statistics: ${JSON.stringify(response.error)}`);
  }
  
  return response;
}

async function testAllUsersStatistics() {
  log('\n=== Testing All Users Statistics API ===', 'yellow');
  
  const response = await apiRequest('GET', '/api/statistics/users/all');
  
  if (response.success) {
    logSuccess('Successfully retrieved all users statistics');
    logInfo(`Total Users: ${response.data.totalUsers}`);
    
    response.data.statistics.forEach((userStats, index) => {
      logInfo(`User ${index + 1}: ${userStats.userId}`);
      logInfo(`  - Reviews: ${userStats.statistics.reviews}`);
      logInfo(`  - Albums: ${userStats.statistics.albums}`);
      logInfo(`  - Home Sections: ${userStats.statistics.homeSections}`);
      logInfo(`  - Reports: ${userStats.statistics.reports}`);
    });
  } else {
    logError(`Failed to retrieve all users statistics: ${JSON.stringify(response.error)}`);
  }
  
  return response;
}

async function testGlobalStatistics() {
  log('\n=== Testing Global Statistics API ===', 'yellow');
  
  const response = await apiRequest('GET', '/api/statistics/global');
  
  if (response.success) {
    logSuccess('Successfully retrieved global statistics');
    logInfo(`Total Reviews: ${response.data.global.totalReviews}`);
    logInfo(`Total Albums: ${response.data.global.totalAlbums}`);
    logInfo(`Total Profiles: ${response.data.global.totalProfiles}`);
    logInfo(`Total Reports: ${response.data.global.totalReports}`);
    logInfo(`Total Home Sections: ${response.data.global.totalHomeSections}`);
  } else {
    logError(`Failed to retrieve global statistics: ${JSON.stringify(response.error)}`);
  }
  
  return response;
}

async function testInvalidUserId() {
  log('\n=== Testing Invalid User ID ===', 'yellow');
  
  const invalidUserId = 'invalid-user-id';
  const response = await apiRequest('GET', `/api/statistics/user/${invalidUserId}`);
  
  if (response.success) {
    logWarning('API returned success for invalid user ID (this might be expected behavior)');
    logInfo(`Response: ${JSON.stringify(response.data)}`);
  } else {
    logInfo(`API correctly handled invalid user ID: ${JSON.stringify(response.error)}`);
  }
  
  return response;
}

async function testServerConnection() {
  log('\n=== Testing Server Connection ===', 'yellow');
  
  try {
    const response = await axios.get(`${BASE_URL}/api`);
    logSuccess('Server is running and accessible');
    return true;
  } catch (error) {
    logError(`Server connection failed: ${error.message}`);
    logError('Please make sure your NestJS server is running on port 3000');
    return false;
  }
}

// Main test runner
async function runTests() {
  log('🚀 Statistics API Test Suite', 'green');
  log('=====================================', 'green');
  
  // Test server connection first
  const serverUp = await testServerConnection();
  if (!serverUp) {
    log('\n❌ Tests aborted - Server not accessible', 'red');
    return;
  }
  
  // Run API tests
  const results = {
    userStats: await testUserStatistics(),
    allUsersStats: await testAllUsersStatistics(),
    globalStats: await testGlobalStatistics(),
    invalidUserId: await testInvalidUserId(),
  };
  
  // Summary
  log('\n=== Test Results Summary ===', 'green');
  const passed = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  
  log(`✅ Passed: ${passed}/${total} tests`, passed === total ? 'green' : 'yellow');
  
  if (passed < total) {
    log('\n❌ Some tests failed. Please check the error messages above.', 'red');
  } else {
    log('\n🎉 All tests passed! Statistics API is working correctly.', 'green');
  }
}

// Run the tests
runTests().catch(error => {
  logError(`Test runner failed: ${error.message}`);
  process.exit(1);
}); 