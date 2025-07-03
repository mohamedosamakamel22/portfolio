const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAPIs() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(API_BASE);
    console.log('✅ Health Check:', health.data);

    // Test 2: Register Admin
    console.log('\n2. Testing Admin Registration...');
    const adminRegister = await axios.post(`${API_BASE}/auth/register`, {
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });
    console.log('✅ Admin Registration:', adminRegister.data.user.email);
    const adminToken = adminRegister.data.access_token;

    // Test 3: Register Customer
    console.log('\n3. Testing Customer Registration...');
    const customerRegister = await axios.post(`${API_BASE}/auth/register`, {
      email: 'customer@test.com',
      password: 'customer123',
      firstName: 'Customer',
      lastName: 'User',
    });
    console.log('✅ Customer Registration:', customerRegister.data.user.email);
    const customerToken = customerRegister.data.access_token;

    // Test 4: Login
    console.log('\n4. Testing Login...');
    const login = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123',
    });
    console.log('✅ Login successful for:', login.data.user.email);

    // Test 5: Create Profile (Admin)
    console.log('\n5. Testing Profile Creation (Admin)...');
    const profile = await axios.post(`${API_BASE}/cms/profile`, {
      name: 'Test Photographer',
      title: 'Professional Photographer',
      bio: 'This is a test photographer profile',
      email: 'photographer@test.com',
      specialties: ['Wedding', 'Portrait', 'Commercial'],
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Profile Created:', profile.data.name);

    // Test 6: Test Customer Access Denied
    console.log('\n6. Testing Customer Access Denied...');
    try {
      await axios.get(`${API_BASE}/cms/profile`, {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      console.log('❌ Customer should not have access');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Customer access correctly denied (403)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test 7: Public Website Access
    console.log('\n7. Testing Public Website Access...');
    const publicProfile = await axios.get(`${API_BASE}/website/profile/active`);
    console.log('✅ Public Profile Access:', publicProfile.data?.name || 'No active profile');

    // Test 8: Contact Form
    console.log('\n8. Testing Contact Form...');
    const contact = await axios.post(`${API_BASE}/website/contact`, {
      name: 'Test Contact',
      email: 'contact@test.com',
      subject: 'Test Inquiry',
      message: 'This is a test contact message',
      type: 'general',
    });
    console.log('✅ Contact Form Submitted:', contact.data.name);

    // Test 9: Get Albums (Public)
    console.log('\n9. Testing Public Albums...');
    const albums = await axios.get(`${API_BASE}/website/albums`);
    console.log('✅ Public Albums Retrieved:', albums.data.length, 'albums');

    // Test 10: Swagger Documentation
    console.log('\n10. Testing Swagger Documentation...');
    try {
      const docs = await axios.get(`${API_BASE}/docs`);
      console.log('✅ Swagger Documentation Available');
    } catch (error) {
      if (error.response?.status === 301 || error.response?.status === 302) {
        console.log('✅ Swagger Documentation Available (redirected)');
      } else {
        console.log('❌ Swagger Documentation Error:', error.response?.status);
      }
    }

    console.log('\n🎉 All API Tests Completed Successfully!');
    console.log('\n📚 Admin Login: admin@test.com / admin123');
    console.log('📚 Customer Login: customer@test.com / customer123');
    console.log('📚 API Documentation: http://localhost:3000/api/docs');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Check if server is running, if not, provide instructions
axios.get(API_BASE)
  .then(() => {
    testAPIs();
  })
  .catch(() => {
    console.log('❌ Server is not running!');
    console.log('Please start the server first:');
    console.log('npm run start:dev');
    console.log('\nThen run this test again:');
    console.log('node test-api.js');
  }); 