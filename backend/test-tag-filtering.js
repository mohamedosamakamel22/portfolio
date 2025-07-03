const axios = require('axios');

// Base URL for your API
const BASE_URL = 'http://localhost:3000';

// Portfolio ID (replace with actual portfolio ID)
const PORTFOLIO_ID = 'your-portfolio-id';

async function testTagFiltering() {
  console.log('🏷️  Testing Tag Filtering APIs\n');

  try {
    // 1. Test getting all tags
    console.log('📋 Getting all tags...');
    const allTagsResponse = await axios.get(`${BASE_URL}/albums/tags`);
    console.log('All tags:', allTagsResponse.data);
    console.log('');

    // 2. Test getting tags for a specific portfolio
    console.log('📋 Getting tags for portfolio...');
    const portfolioTagsResponse = await axios.get(`${BASE_URL}/website/${PORTFOLIO_ID}/albums/tags`);
    console.log('Portfolio tags:', portfolioTagsResponse.data);
    console.log('');

    // 3. Test filtering albums by tags (admin)
    console.log('🔍 Filtering albums by tags (admin)...');
    const adminFilterResponse = await axios.get(`${BASE_URL}/albums/filter-by-tags?tags=Travel,Collaboration`);
    console.log('Admin filtered albums:', adminFilterResponse.data.length, 'found');
    console.log('');

    // 4. Test filtering albums by tags (portfolio)
    console.log('🔍 Filtering albums by tags (portfolio)...');
    const portfolioFilterResponse = await axios.get(`${BASE_URL}/website/${PORTFOLIO_ID}/albums/filter-by-tags?tags=Travel,Collaboration`);
    console.log('Portfolio filtered albums:', portfolioFilterResponse.data.length, 'found');
    console.log('');

    // 5. Test combined filtering (tags + category)
    console.log('🔍 Testing combined filtering...');
    const combinedResponse = await axios.get(`${BASE_URL}/website/${PORTFOLIO_ID}/albums?category=Travel`);
    console.log('Albums in Travel category:', combinedResponse.data.albums.length, 'found');
    console.log('');

    // 6. Test project type filtering
    console.log('🔍 Testing project type filtering...');
    const projectTypeResponse = await axios.get(`${BASE_URL}/website/${PORTFOLIO_ID}/albums/project-type/Collaboration`);
    console.log('Collaboration projects:', projectTypeResponse.data.length, 'found');
    console.log('');

    console.log('✅ All tag filtering tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing tag filtering:', error.response?.data || error.message);
  }
}

// Enhanced API testing with examples
async function demonstrateAllEndpoints() {
  console.log('🚀 Demonstrating All Enhanced Album Endpoints\n');

  const endpoints = [
    {
      name: 'Get all albums',
      method: 'GET',
      url: `${BASE_URL}/albums`,
      description: 'Retrieve all albums (admin only)'
    },
    {
      name: 'Get published albums',
      method: 'GET',
      url: `${BASE_URL}/albums?published=true`,
      description: 'Get only published albums'
    },
    {
      name: 'Get featured albums',
      method: 'GET',
      url: `${BASE_URL}/albums/featured`,
      description: 'Get featured albums'
    },
    {
      name: 'Get categories',
      method: 'GET',
      url: `${BASE_URL}/albums/categories`,
      description: 'Get all album categories'
    },
    {
      name: 'Get project types',
      method: 'GET',
      url: `${BASE_URL}/albums/project-types`,
      description: 'Get all project types'
    },
    {
      name: 'Get all tags',
      method: 'GET',
      url: `${BASE_URL}/albums/tags`,
      description: 'Get all tags used in albums'
    },
    {
      name: 'Filter by tags',
      method: 'GET',
      url: `${BASE_URL}/albums/filter-by-tags?tags=Travel,Commercial`,
      description: 'Filter albums by comma-separated tags'
    },
    {
      name: 'Search albums',
      method: 'GET',
      url: `${BASE_URL}/albums/search?q=travel`,
      description: 'Search albums by keyword'
    },
    {
      name: 'Get album stats',
      method: 'GET',
      url: `${BASE_URL}/albums/stats`,
      description: 'Get album statistics'
    },
    {
      name: 'Get portfolio albums',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums`,
      description: 'Get all published albums for a portfolio'
    },
    {
      name: 'Get portfolio featured',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/featured`,
      description: 'Get featured albums for a portfolio'
    },
    {
      name: 'Get portfolio categories',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/categories`,
      description: 'Get categories for a portfolio'
    },
    {
      name: 'Get portfolio tags',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/tags`,
      description: 'Get tags for a portfolio'
    },
    {
      name: 'Filter portfolio by tags',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/filter-by-tags?tags=Travel,Commercial`,
      description: 'Filter portfolio albums by tags'
    },
    {
      name: 'Filter by category',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/category/Travel`,
      description: 'Get albums by category for portfolio'
    },
    {
      name: 'Filter by project type',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/project-type/Collaboration`,
      description: 'Get albums by project type for portfolio'
    },
    {
      name: 'Search portfolio albums',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/search?q=travel`,
      description: 'Search albums within a portfolio'
    },
    {
      name: 'Get specific album',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/[album-id]`,
      description: 'Get a specific album by ID'
    },
    {
      name: 'Get related albums',
      method: 'GET',
      url: `${BASE_URL}/website/${PORTFOLIO_ID}/albums/[album-id]/related`,
      description: 'Get albums related to a specific album'
    }
  ];

  console.log('📚 Available Album API Endpoints:\n');
  endpoints.forEach((endpoint, index) => {
    console.log(`${index + 1}. ${endpoint.name}`);
    console.log(`   ${endpoint.method} ${endpoint.url}`);
    console.log(`   ${endpoint.description}\n`);
  });

  console.log('💡 Usage Examples:\n');
  console.log('1. To filter by multiple tags: ?tags=Travel,Commercial,Product');
  console.log('2. To get limited results: ?limit=10');
  console.log('3. To combine filters: ?category=Travel&limit=5');
  console.log('4. To search with tags: search?q=travel (will search in tags too)');
  console.log('5. To get related albums: albums/[id]/related?limit=4');
}

// Run the tests
if (require.main === module) {
  console.log('🏷️  Album Tag Filtering Test Suite\n');
  console.log('📝 Make sure your server is running on port 3000');
  console.log('📝 Replace PORTFOLIO_ID with actual portfolio ID\n');
  
  demonstrateAllEndpoints();
  
  console.log('\n' + '='.repeat(50));
  console.log('To run actual API tests, uncomment the line below:');
  console.log('// testTagFiltering();');
}

module.exports = { testTagFiltering, demonstrateAllEndpoints }; 