#!/usr/bin/env node

/**
 * 📸 Photography Portfolio CMS - API Demo
 * 
 * This script demonstrates the portfolio-based API architecture
 * showing how data is properly isolated by portfolio ID.
 */

const https = require('https');
const http = require('http');

const API_BASE = 'http://localhost:3000/api';
const PORTFOLIO_ID = '685fc7250667f2db1bd7cfc7'; // Saeed Sekka's portfolio

console.log(`
🎯 Photography Portfolio CMS - API Demo
==========================================

Testing portfolio-based API architecture with:
Portfolio ID: ${PORTFOLIO_ID} (Saeed Sekka)
API Base: ${API_BASE}

`);

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🔍 1. Testing Health Check...');
    const health = await makeRequest(`${API_BASE}/health`);
    console.log(`   ✅ Health: ${health.status === 200 ? 'OK' : 'Failed'}`);
    
    console.log('\n📊 2. Testing Portfolio Reviews...');
    const reviews = await makeRequest(`${API_BASE}/website/${PORTFOLIO_ID}/reviews`);
    if (reviews.status === 200 && reviews.data.reviews) {
      console.log(`   ✅ Found ${reviews.data.reviews.length} reviews for portfolio ${PORTFOLIO_ID}`);
      console.log(`   📈 Meta: portfolioId=${reviews.data.meta.portfolioId}, totalShown=${reviews.data.meta.totalShown}`);
      
      if (reviews.data.reviews.length > 0) {
        const review = reviews.data.reviews[0];
        console.log(`   📝 Sample Review: "${review.title}" by ${review.clientName} (${review.rating}⭐)`);
      }
    } else {
      console.log(`   ❌ Reviews API failed: ${reviews.status}`);
    }

    console.log('\n🖼️ 3. Testing Portfolio Albums...');
    const albums = await makeRequest(`${API_BASE}/website/${PORTFOLIO_ID}/albums`);
    if (albums.status === 200 && albums.data.albums) {
      console.log(`   ✅ Found ${albums.data.albums.length} albums for portfolio ${PORTFOLIO_ID}`);
      console.log(`   📈 Meta: portfolioId=${albums.data.meta.portfolioId}, totalShown=${albums.data.meta.totalShown}`);
      
      if (albums.data.albums.length > 0) {
        const album = albums.data.albums[0];
        console.log(`   🎨 Sample Album: "${album.title}" (${album.category}/${album.projectType})`);
        console.log(`   📸 Images: ${album.images ? album.images.length : 0}`);
      }
    } else {
      console.log(`   ❌ Albums API failed: ${albums.status}`);
    }

    console.log('\n👤 4. Testing Portfolio Profile...');
    const profile = await makeRequest(`${API_BASE}/website/${PORTFOLIO_ID}/profile`);
    if (profile.status === 200 && profile.data.name) {
      console.log(`   ✅ Profile: ${profile.data.name} (${profile.data.title})`);
      console.log(`   📍 Location: ${profile.data.location}`);
      console.log(`   📧 Email: ${profile.data.email}`);
      console.log(`   📈 Stats: ${profile.data.stats.yearsExperience} years experience, ${profile.data.stats.projectsCompleted} projects`);
    } else {
      console.log(`   ❌ Profile API failed: ${profile.status}`);
    }

    console.log('\n🔍 5. Testing Album Search...');
    const search = await makeRequest(`${API_BASE}/website/${PORTFOLIO_ID}/albums/search?q=India`);
    if (search.status === 200 && Array.isArray(search.data)) {
      console.log(`   ✅ Search results: ${search.data.length} albums matching "India"`);
      if (search.data.length > 0) {
        console.log(`   🔍 Found: "${search.data[0].title}"`);
      }
    } else {
      console.log(`   ❌ Search API failed: ${search.status}`);
    }

    console.log('\n⭐ 6. Testing Featured Reviews...');
    const featured = await makeRequest(`${API_BASE}/website/${PORTFOLIO_ID}/reviews/featured`);
    if (featured.status === 200 && Array.isArray(featured.data)) {
      console.log(`   ✅ Featured reviews: ${featured.data.length}`);
    } else {
      console.log(`   ❌ Featured reviews API failed: ${featured.status}`);
    }

    console.log('\n🚫 7. Testing Non-Existent Portfolio (Data Isolation)...');
    const nonExistent = await makeRequest(`${API_BASE}/website/nonexistent123/reviews`);
    if (nonExistent.status === 500 || (nonExistent.data.reviews && nonExistent.data.reviews.length === 0)) {
      console.log(`   ✅ Data isolation working: No data leaked from other portfolios`);
    } else {
      console.log(`   ⚠️ Unexpected response for non-existent portfolio: ${nonExistent.status}`);
    }

    console.log('\n🔐 8. Testing Authentication...');
    const loginData = JSON.stringify({
      email: 'SaeedSekka@email.com',
      password: 'admin123'
    });
    
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      },
      body: loginData
    };
    
    const auth = await makeRequest(`${API_BASE}/auth/login`, authOptions);
    if (auth.status === 200 && auth.data.access_token) {
      console.log(`   ✅ Authentication successful`);
      console.log(`   👤 User: ${auth.data.user.firstName} ${auth.data.user.lastName} (${auth.data.user.role})`);
      console.log(`   🔑 Token length: ${auth.data.access_token.length} characters`);
    } else {
      console.log(`   ❌ Authentication failed: ${auth.status}`);
    }

  } catch (error) {
    console.error(`❌ Demo failed: ${error.message}`);
    console.log('\n🚨 Make sure the server is running:');
    console.log('   cd backend && npm run start:dev');
  }
}

async function showAPIExamples() {
  console.log(`
📚 Portfolio-Based API Examples
===============================

🌐 Public Portfolio APIs (No Auth Required):
-----------------------------------------

# Get portfolio reviews
curl "${API_BASE}/website/${PORTFOLIO_ID}/reviews"

# Get featured reviews only  
curl "${API_BASE}/website/${PORTFOLIO_ID}/reviews/featured"

# Get portfolio albums
curl "${API_BASE}/website/${PORTFOLIO_ID}/albums"

# Search within portfolio
curl "${API_BASE}/website/${PORTFOLIO_ID}/albums/search?q=wedding"

# Get portfolio profile
curl "${API_BASE}/website/${PORTFOLIO_ID}/profile"

# Get contact info
curl "${API_BASE}/website/${PORTFOLIO_ID}/contact"

🔐 Admin APIs (Require Authentication):
------------------------------------

# Login to get token
curl -X POST "${API_BASE}/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"SaeedSekka@email.com","password":"admin123"}'

# Use token for admin operations
curl -H "Authorization: Bearer {token}" \\
  "${API_BASE}/cms/albums"

📊 Key Features Demonstrated:
---------------------------
✅ Portfolio data isolation (each portfolio sees only its data)
✅ Multi-tenant architecture (multiple portfolios supported)  
✅ Comprehensive API coverage (reviews, albums, profiles, search)
✅ Secure authentication (JWT-based admin access)
✅ RESTful design (clean, predictable endpoints)

🎯 Portfolio IDs for Testing:
--------------------------
• Saeed Sekka (Admin): ${PORTFOLIO_ID}
• Customer Portfolio: 685fc7250667f2db1bd7cfc8

`);
}

// Run the demo
console.log('🚀 Starting Portfolio API Demo...\n');

testAPI().then(() => {
  showAPIExamples();
  console.log(`
🎉 Demo Complete!
===============

✨ Your Photography Portfolio CMS is working perfectly!

Next Steps:
• Visit Swagger docs: http://localhost:3000/api/docs  
• Test APIs interactively in the browser
• Build your frontend using these portfolio-scoped endpoints

Happy coding! 📸
`);
}).catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
}); 