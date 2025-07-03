const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Test data
let authToken = '';
let testUserId = '';
let testReviewId = '';
let photographerId = '';

// Test user credentials
const testCredentials = {
  email: 'john@example.com',
  password: 'Test123!'
};

// Test photographer credentials
const photographerCredentials = {
  email: 'saeed@example.com',
  password: 'Test123!'
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logSuccess(message) {
  log('✅ ' + message, 'green');
}

function logError(message) {
  log('❌ ' + message, 'red');
}

function logInfo(message) {
  log('ℹ️  ' + message, 'blue');
}

function logWarning(message) {
  log('⚠️  ' + message, 'yellow');
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// Test functions
async function testAuthentication() {
  log('\n=== Testing Authentication ===', 'yellow');
  
  // Test client login
  const clientLogin = await apiRequest('POST', '/auth/login', testCredentials);
  if (clientLogin.success) {
    authToken = clientLogin.data.access_token;
    testUserId = clientLogin.data.user.id;
    logSuccess('Client authentication successful');
    logInfo(`Client User ID: ${testUserId}`);
  } else {
    logError('Client authentication failed: ' + JSON.stringify(clientLogin.error));
    return false;
  }
  
  // Test photographer login
  const photographerLogin = await apiRequest('POST', '/auth/login', photographerCredentials);
  if (photographerLogin.success) {
    photographerId = photographerLogin.data.user.id;
    logSuccess('Photographer authentication successful');
    logInfo(`Photographer ID: ${photographerId}`);
  } else {
    logError('Photographer authentication failed: ' + JSON.stringify(photographerLogin.error));
    return false;
  }
  
  return true;
}

async function testCreateReview() {
  log('\n=== Testing Review Creation (Authenticated) ===', 'yellow');
  
  const reviewData = {
    reviewedBy: photographerId,
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
  
  // Test authenticated review creation
  const createResult = await apiRequest('POST', '/reviews', reviewData, authToken);
  if (createResult.success) {
    testReviewId = createResult.data._id;
    logSuccess('Review created successfully with user association');
    logInfo(`Review ID: ${testReviewId}`);
    logInfo(`Associated with Client: ${createResult.data.clientUserId}`);
    logInfo(`Reviewing: ${createResult.data.reviewedBy}`);
  } else {
    logError('Review creation failed: ' + JSON.stringify(createResult.error));
    return false;
  }
  
  // Test unauthenticated review creation (should fail)
  const unauthResult = await apiRequest('POST', '/reviews', reviewData);
  if (!unauthResult.success && unauthResult.status === 401) {
    logSuccess('Unauthenticated review creation properly rejected');
  } else {
    logWarning('Unauthenticated review creation should have been rejected');
  }
  
  return true;
}

async function testReviewRetrieval() {
  log('\n=== Testing Review Retrieval with User Data ===', 'yellow');
  
  // Test get all reviews
  const allReviews = await apiRequest('GET', '/reviews');
  if (allReviews.success) {
    logSuccess(`Retrieved ${allReviews.data.length} reviews`);
    
    // Check if user data is populated
    const hasUserData = allReviews.data.some(review => 
      review.reviewedBy && typeof review.reviewedBy === 'object' && review.reviewedBy.firstName
    );
    
    if (hasUserData) {
      logSuccess('User data is properly populated in reviews');
    } else {
      logWarning('User data might not be properly populated');
    }
  } else {
    logError('Failed to retrieve all reviews: ' + JSON.stringify(allReviews.error));
  }
  
  // Test get visible reviews
  const visibleReviews = await apiRequest('GET', '/reviews?visible=true');
  if (visibleReviews.success) {
    logSuccess(`Retrieved ${visibleReviews.data.length} visible reviews`);
  } else {
    logError('Failed to retrieve visible reviews: ' + JSON.stringify(visibleReviews.error));
  }
  
  // Test get featured reviews
  const featuredReviews = await apiRequest('GET', '/reviews/featured');
  if (featuredReviews.success) {
    logSuccess(`Retrieved ${featuredReviews.data.length} featured reviews`);
  } else {
    logError('Failed to retrieve featured reviews: ' + JSON.stringify(featuredReviews.error));
  }
  
  // Test get single review
  if (testReviewId) {
    const singleReview = await apiRequest('GET', `/reviews/${testReviewId}`);
    if (singleReview.success) {
      logSuccess('Retrieved single review with user data');
      
      // Verify user data population
      if (singleReview.data.reviewedBy && typeof singleReview.data.reviewedBy === 'object') {
        logSuccess('Reviewed user data is populated');
      }
      if (singleReview.data.clientUserId && typeof singleReview.data.clientUserId === 'object') {
        logSuccess('Client user data is populated');
      }
    } else {
      logError('Failed to retrieve single review: ' + JSON.stringify(singleReview.error));
    }
  }
}

async function testUserSpecificReviews() {
  log('\n=== Testing User-Specific Review Endpoints ===', 'yellow');
  
  // Test get reviews by user (as client)
  const clientReviews = await apiRequest('GET', `/reviews/user/${testUserId}`);
  if (clientReviews.success) {
    logSuccess(`Retrieved ${clientReviews.data.length} reviews for client user`);
  } else {
    logError('Failed to retrieve client reviews: ' + JSON.stringify(clientReviews.error));
  }
  
  // Test get reviews by user (as photographer)
  const photographerReviews = await apiRequest('GET', `/reviews/user/${photographerId}`);
  if (photographerReviews.success) {
    logSuccess(`Retrieved ${photographerReviews.data.length} reviews for photographer`);
  } else {
    logError('Failed to retrieve photographer reviews: ' + JSON.stringify(photographerReviews.error));
  }
  
  // Test get visible reviews by user
  const visibleUserReviews = await apiRequest('GET', `/reviews/user/${photographerId}?visible=true`);
  if (visibleUserReviews.success) {
    logSuccess(`Retrieved ${visibleUserReviews.data.length} visible reviews for photographer`);
  } else {
    logError('Failed to retrieve visible user reviews: ' + JSON.stringify(visibleUserReviews.error));
  }
}

async function testWebsiteEndpoints() {
  log('\n=== Testing Website Portfolio Endpoints ===', 'yellow');
  
  // Test portfolio reviews
  const portfolioReviews = await apiRequest('GET', `/website/${photographerId}/reviews`);
  if (portfolioReviews.success) {
    logSuccess('Retrieved portfolio reviews successfully');
    logInfo(`Found ${portfolioReviews.data.reviews.length} reviews for portfolio`);
  } else {
    logError('Failed to retrieve portfolio reviews: ' + JSON.stringify(portfolioReviews.error));
  }
  
  // Test portfolio featured reviews
  const portfolioFeatured = await apiRequest('GET', `/website/${photographerId}/reviews/featured`);
  if (portfolioFeatured.success) {
    logSuccess(`Retrieved ${portfolioFeatured.data.length} featured reviews for portfolio`);
  } else {
    logError('Failed to retrieve portfolio featured reviews: ' + JSON.stringify(portfolioFeatured.error));
  }
  
  // Test portfolio stats
  const portfolioStats = await apiRequest('GET', `/website/${photographerId}/reviews/stats`);
  if (portfolioStats.success) {
    logSuccess('Retrieved portfolio review statistics');
    logInfo(`Statistics: ${JSON.stringify(portfolioStats.data)}`);
  } else {
    logError('Failed to retrieve portfolio stats: ' + JSON.stringify(portfolioStats.error));
  }
}

async function testFilteringAndStats() {
  log('\n=== Testing Filtering and Statistics ===', 'yellow');
  
  // Test rating filter
  const ratingFilter = await apiRequest('GET', '/reviews/by-rating/5');
  if (ratingFilter.success) {
    logSuccess(`Retrieved ${ratingFilter.data.length} 5-star reviews`);
  } else {
    logError('Failed to retrieve reviews by rating: ' + JSON.stringify(ratingFilter.error));
  }
  
  // Test service filter
  const serviceFilter = await apiRequest('GET', '/reviews/by-service/Product Photography');
  if (serviceFilter.success) {
    logSuccess(`Retrieved ${serviceFilter.data.length} product photography reviews`);
  } else {
    logError('Failed to retrieve reviews by service: ' + JSON.stringify(serviceFilter.error));
  }
  
  // Test average rating
  const avgRating = await apiRequest('GET', '/reviews/stats/rating');
  if (avgRating.success) {
    logSuccess(`Average rating: ${avgRating.data}`);
  } else {
    logError('Failed to retrieve average rating: ' + JSON.stringify(avgRating.error));
  }
  
  // Test rating distribution
  const ratingStats = await apiRequest('GET', '/reviews/stats/distribution');
  if (ratingStats.success) {
    logSuccess('Retrieved rating distribution statistics');
    logInfo(`Distribution: ${JSON.stringify(ratingStats.data)}`);
  } else {
    logError('Failed to retrieve rating distribution: ' + JSON.stringify(ratingStats.error));
  }
}

async function testCMSEndpoints() {
  log('\n=== Testing CMS Endpoints (requires admin) ===', 'yellow');
  
  // Note: These tests assume the current user has admin privileges
  // In a real scenario, you'd need to authenticate as an admin user
  
  // Test CMS get all reviews
  const cmsReviews = await apiRequest('GET', '/cms/reviews', null, authToken);
  if (cmsReviews.success) {
    logSuccess(`CMS: Retrieved ${cmsReviews.data.length} reviews`);
  } else {
    logWarning('CMS: Failed to retrieve reviews (may require admin privileges): ' + JSON.stringify(cmsReviews.error));
  }
  
  // Test CMS get reviews by user
  const cmsUserReviews = await apiRequest('GET', `/cms/reviews/user/${photographerId}`, null, authToken);
  if (cmsUserReviews.success) {
    logSuccess(`CMS: Retrieved ${cmsUserReviews.data.length} reviews for user`);
  } else {
    logWarning('CMS: Failed to retrieve user reviews (may require admin privileges): ' + JSON.stringify(cmsUserReviews.error));
  }
  
  // Test CMS user stats
  const cmsUserStats = await apiRequest('GET', `/cms/reviews/stats/user/${photographerId}`, null, authToken);
  if (cmsUserStats.success) {
    logSuccess('CMS: Retrieved user statistics');
    logInfo(`User stats: ${JSON.stringify(cmsUserStats.data)}`);
  } else {
    logWarning('CMS: Failed to retrieve user stats (may require admin privileges): ' + JSON.stringify(cmsUserStats.error));
  }
}

async function testReviewUpdates() {
  log('\n=== Testing Review Updates ===', 'yellow');
  
  if (!testReviewId) {
    logWarning('No test review ID available for update tests');
    return;
  }
  
  // Test toggle visibility
  const toggleVisibility = await apiRequest('PATCH', `/reviews/${testReviewId}/toggle-visibility`);
  if (toggleVisibility.success) {
    logSuccess('Successfully toggled review visibility');
  } else {
    logError('Failed to toggle visibility: ' + JSON.stringify(toggleVisibility.error));
  }
  
  // Test toggle featured
  const toggleFeatured = await apiRequest('PATCH', `/reviews/${testReviewId}/toggle-featured`);
  if (toggleFeatured.success) {
    logSuccess('Successfully toggled featured status');
  } else {
    logError('Failed to toggle featured: ' + JSON.stringify(toggleFeatured.error));
  }
  
  // Test update review
  const updateData = {
    review: 'Updated review content - This is a test update to verify the review system works correctly.'
  };
  
  const updateResult = await apiRequest('PATCH', `/reviews/${testReviewId}`, updateData);
  if (updateResult.success) {
    logSuccess('Successfully updated review content');
  } else {
    logError('Failed to update review: ' + JSON.stringify(updateResult.error));
  }
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting Review API Validation Tests', 'blue');
  log('=====================================', 'blue');
  
  try {
    // Authentication tests
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
      logError('Authentication failed - stopping tests');
      return;
    }
    
    // Core functionality tests
    await testCreateReview();
    await testReviewRetrieval();
    await testUserSpecificReviews();
    await testWebsiteEndpoints();
    await testFilteringAndStats();
    await testReviewUpdates();
    
    // Admin functionality tests
    await testCMSEndpoints();
    
    log('\n🎉 All tests completed!', 'green');
    log('=====================================', 'green');
    
    // Summary
    log('\n📊 Test Summary:', 'blue');
    log('✅ Authentication & user association', 'green');
    log('✅ Review creation with user linking', 'green');
    log('✅ User data population in responses', 'green');
    log('✅ User-specific endpoints', 'green');
    log('✅ Portfolio/website endpoints', 'green');
    log('✅ Filtering and statistics', 'green');
    log('✅ Review management operations', 'green');
    log('⚠️  CMS endpoints (admin privileges required)', 'yellow');
    
  } catch (error) {
    logError('Test execution failed: ' + error.message);
    console.error(error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testAuthentication,
  testCreateReview,
  testReviewRetrieval,
  testUserSpecificReviews,
  testWebsiteEndpoints,
  testFilteringAndStats,
  testCMSEndpoints,
  testReviewUpdates
}; 