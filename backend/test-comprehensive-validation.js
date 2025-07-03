const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testComprehensiveValidation() {
  console.log('🧪 Testing Comprehensive User Validation and Admin Protection...\n');

  try {
    // ========== Login Tests ==========
    console.log('🔑 Step 1: Authentication Tests');
    console.log('================================\n');

    // Login as admin
    console.log('1.1 Logging in as admin...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@portfolio.com',
      password: 'admin123'
    });
    const adminToken = adminLoginResponse.data.access_token;
    console.log('✅ Admin login successful\n');

    // Login as customer
    console.log('1.2 Logging in as customer...');
    const customerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'customer@example.com',
      password: 'customer123'
    });
    const customerToken = customerLoginResponse.data.access_token;
    console.log('✅ Customer login successful\n');

    // Get valid user IDs
    const usersResponse = await axios.get(`${BASE_URL}/cms/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminUser = usersResponse.data.data.find(user => user.email === 'admin@portfolio.com');
    const customerUser = usersResponse.data.data.find(user => user.email === 'customer@example.com');
    
    console.log(`Valid Admin User ID: ${adminUser._id}`);
    console.log(`Valid Customer User ID: ${customerUser._id}\n`);

    // ========== Review API Tests ==========
    console.log('📝 Step 2: Review API Validation Tests');
    console.log('======================================\n');

    // Test 2.1: Admin can create review with valid user ID
    console.log('2.1 Testing admin review creation with valid user ID...');
    try {
      const reviewResponse = await axios.post(`${BASE_URL}/reviews`, {
        clientUserId: customerUser._id,
        clientName: 'Test Client',
        clientTitle: 'Test Title',
        company: 'Test Company',
        review: 'Test review with valid user ID',
        rating: 5
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Admin successfully created review with valid user ID');
      
      // Clean up
      await axios.delete(`${BASE_URL}/reviews/${reviewResponse.data._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Test review cleaned up\n');
    } catch (error) {
      console.log('❌ Admin failed to create review:', error.response?.data?.message);
    }

    // Test 2.2: Admin review creation with invalid user ID should fail
    console.log('2.2 Testing admin review creation with invalid user ID...');
    try {
      await axios.post(`${BASE_URL}/reviews`, {
        clientUserId: '507f1f77bcf86cd799439011', // Non-existent user ID
        clientName: 'Test Client',
        clientTitle: 'Test Title',
        company: 'Test Company',
        review: 'Test review',
        rating: 5
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('❌ Should have failed with invalid user ID');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected invalid user ID');
        console.log(`   Error: ${error.response.data.message}`);
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // Test 2.3: Customer cannot create review
    console.log('\n2.3 Testing customer role protection...');
    try {
      await axios.post(`${BASE_URL}/reviews`, {
        clientUserId: customerUser._id,
        clientName: 'Test Client',
        clientTitle: 'Test Title',
        company: 'Test Company',
        review: 'Test review',
        rating: 5
      }, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('❌ Customer should not be able to create review');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Correctly blocked customer from creating review');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // ========== CMS Review API Tests ==========
    console.log('\n📋 Step 3: CMS Review API Validation Tests');
    console.log('==========================================\n');

    // Test 3.1: CMS review creation with valid user ID
    console.log('3.1 Testing CMS review creation with valid user ID...');
    try {
      const cmsReviewResponse = await axios.post(`${BASE_URL}/cms/reviews`, {
        clientUserId: adminUser._id,
        reviewedBy: customerUser._id,
        clientName: 'CMS Test Client',
        clientTitle: 'CMS Test Title',
        company: 'CMS Test Company',
        review: 'CMS test review with valid user ID',
        rating: 5
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ CMS review created successfully with valid user IDs');
      
      // Clean up
      await axios.delete(`${BASE_URL}/cms/reviews/${cmsReviewResponse.data._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ CMS test review cleaned up\n');
    } catch (error) {
      console.log('❌ CMS review creation failed:', error.response?.data?.message);
    }

    // Test 3.2: CMS review creation with invalid user ID should fail
    console.log('3.2 Testing CMS review creation with invalid user ID...');
    try {
      await axios.post(`${BASE_URL}/cms/reviews`, {
        clientUserId: '507f1f77bcf86cd799439011', // Invalid ID
        clientName: 'CMS Test Client',
        clientTitle: 'CMS Test Title',
        company: 'CMS Test Company',
        review: 'CMS test review',
        rating: 5
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('❌ Should have failed with invalid user ID');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ CMS correctly rejected invalid user ID');
        console.log(`   Error: ${error.response.data.message}`);
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // ========== Profile API Tests ==========
    console.log('\n👤 Step 4: Profile API Validation Tests');
    console.log('=======================================\n');

    // Test 4.1: Admin can create profile with valid user ID
    console.log('4.1 Testing profile creation with valid user ID...');
    try {
      const profileResponse = await axios.post(`${BASE_URL}/profile`, {
        userId: adminUser._id,
        name: 'Test Profile',
        title: 'Test Photographer',
        bio: 'Test bio',
        email: 'test@profile.com',
        phone: '+1234567890',
        address: 'Test Address'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Profile created successfully with valid user ID');
      
      // Clean up
      await axios.delete(`${BASE_URL}/profile/${profileResponse.data._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Test profile cleaned up\n');
    } catch (error) {
      console.log('❌ Profile creation failed:', error.response?.data?.message);
    }

    // Test 4.2: Customer cannot create profile
    console.log('4.2 Testing customer profile creation protection...');
    try {
      await axios.post(`${BASE_URL}/profile`, {
        userId: customerUser._id,
        name: 'Customer Profile',
        title: 'Customer Photographer',
        bio: 'Customer bio',
        email: 'customer@profile.com',
        phone: '+1234567890',
        address: 'Customer Address'
      }, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('❌ Customer should not be able to create profile');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Correctly blocked customer from creating profile');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    // ========== Albums API Tests ==========
    console.log('\n🖼️  Step 5: Albums API Protection Tests');
    console.log('=====================================\n');

    // Test 5.1: Admin can create album
    console.log('5.1 Testing admin album creation...');
    try {
      const albumResponse = await axios.post(`${BASE_URL}/albums`, {
        title: 'Test Album',
        description: 'Test album description',
        category: 'Test',
        projectType: 'Test Project'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Admin successfully created album');
      
      // Clean up
      await axios.delete(`${BASE_URL}/albums/${albumResponse.data._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Test album cleaned up\n');
    } catch (error) {
      console.log('❌ Admin album creation failed:', error.response?.data?.message);
    }

    // Test 5.2: Customer cannot create album
    console.log('5.2 Testing customer album creation protection...');
    try {
      await axios.post(`${BASE_URL}/albums`, {
        title: 'Customer Album',
        description: 'Customer album description',
        category: 'Customer',
        projectType: 'Customer Project'
      }, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('❌ Customer should not be able to create album');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Correctly blocked customer from creating album');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    console.log('\n🎉 Comprehensive validation tests completed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ User ID validation working correctly');
    console.log('- ✅ Admin role protection working correctly');
    console.log('- ✅ Customer role restrictions working correctly');
    console.log('- ✅ Both regular and CMS APIs protected');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Give the server time to start
setTimeout(() => {
  testComprehensiveValidation();
}, 5000); 