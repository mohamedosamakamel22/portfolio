const fetch = require('node-fetch');

async function testValidationFix() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Validation Fix...\n');
  
  try {
    // Test 1: Profile creation without userId (should work)
    console.log('1️⃣ Testing profile creation without userId...');
    const profileResponse = await fetch(`${baseUrl}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        title: 'Test Title',
        bio: 'Test bio',
        email: 'test@test.com',
        phone: '123456789',
        address: 'Test Address'
      })
    });
    
    if (profileResponse.ok) {
      console.log('✅ Profile creation successful - validation fix working!');
    } else {
      const error = await profileResponse.text();
      console.log('❌ Profile creation failed:', profileResponse.status, error);
    }
    
    // Test 2: Profile creation with invalid userId (should fail with proper error)
    console.log('\n2️⃣ Testing profile creation with invalid userId...');
    const invalidProfileResponse = await fetch(`${baseUrl}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '507f1f77bcf86cd799439000', // Invalid user ID
        name: 'Test User 2',
        title: 'Test Title 2',
        bio: 'Test bio 2',
        email: 'test2@test.com',
        phone: '123456789',
        address: 'Test Address 2'
      })
    });
    
    if (!invalidProfileResponse.ok) {
      const error = await invalidProfileResponse.text();
      console.log('✅ Invalid userId properly rejected:', invalidProfileResponse.status);
      console.log('📝 Error message:', error);
    } else {
      console.log('❌ Invalid userId was accepted (this should not happen)');
    }
    
    console.log('\n🎉 Validation fix test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('💡 Make sure the server is running on port 3000');
  }
}

// Run the test
testValidationFix(); 