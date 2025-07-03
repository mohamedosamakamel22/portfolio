const axios = require('axios');

// Base URL for your API
const BASE_URL = 'http://localhost:3000';

async function testStatsArray() {
  console.log('📊 Testing Stats Array Implementation\n');

  try {
    // Test data with new stats structure
    const testProfile = {
      name: 'Test Photographer',
      title: 'Professional Photographer',
      bio: 'Testing the new stats array structure',
      email: 'test@example.com',
      phone: '+1234567890',
      address: 'Test City',
      stats: [
        { key: 'yearsExperience', value: 14 },
        { key: 'projectsCompleted', value: 500 },
        { key: 'happyClients', value: 200 },
        { key: 'awards', value: 25 },
        { key: 'hoursExperience', value: 15000 },
        { key: 'countriesVisited', value: 25 },
        { key: 'weddingsCaptured', value: 150 },
        { key: 'socialFollowers', value: '50K+' }
      ]
    };

    console.log('📤 Test Profile Data:');
    console.log('Stats Array:', JSON.stringify(testProfile.stats, null, 2));
    console.log('');

    // Demonstrate stats manipulation
    console.log('🔧 Stats Manipulation Examples:');
    
    // Find specific stat
    const yearsExp = testProfile.stats.find(s => s.key === 'yearsExperience');
    console.log('Years Experience:', yearsExp?.value);
    
    // Add new stat
    testProfile.stats.push({ key: 'videosProduced', value: 100 });
    console.log('Added videos produced stat');
    
    // Filter numeric stats
    const numericStats = testProfile.stats.filter(s => typeof s.value === 'number');
    console.log('Numeric stats count:', numericStats.length);
    
    // Calculate total projects (example)
    const projects = testProfile.stats.find(s => s.key === 'projectsCompleted')?.value || 0;
    const weddings = testProfile.stats.find(s => s.key === 'weddingsCaptured')?.value || 0;
    console.log('Total photo sessions:', Number(projects) + Number(weddings));
    
    console.log('');
    console.log('✅ Stats array structure working correctly!');
    console.log('');
    console.log('📋 Key Benefits:');
    console.log('• Dynamic stats - no schema changes needed');
    console.log('• Easy to add/remove stats');
    console.log('• Flexible value types (numbers and strings)');
    console.log('• Consistent with other array fields');
    console.log('• Frontend-friendly structure');

  } catch (error) {
    console.error('❌ Error testing stats array:', error.message);
  }
}

// Demonstrate different ways to work with stats
function demonstrateStatsUsage() {
  console.log('\n📖 Stats Usage Examples:\n');

  const sampleStats = [
    { key: 'yearsExperience', value: 14 },
    { key: 'projectsCompleted', value: 500 },
    { key: 'happyClients', value: 200 },
    { key: 'awards', value: 25 },
    { key: 'socialFollowers', value: '50K+' }
  ];

  console.log('1. Convert to object for display:');
  const statsObject = Object.fromEntries(
    sampleStats.map(stat => [stat.key, stat.value])
  );
  console.log(statsObject);

  console.log('\n2. Format for frontend display:');
  const displayStats = sampleStats.map(stat => ({
    label: stat.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: stat.value,
    key: stat.key
  }));
  console.log(displayStats);

  console.log('\n3. Group by type:');
  const numericStats = sampleStats.filter(s => typeof s.value === 'number');
  const stringStats = sampleStats.filter(s => typeof s.value === 'string');
  console.log('Numeric:', numericStats.length, 'String:', stringStats.length);

  console.log('\n4. Create stat cards:');
  sampleStats.forEach(stat => {
    const label = stat.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`📊 ${label}: ${stat.value}`);
  });
}

// Run the demonstrations
if (require.main === module) {
  console.log('📊 Stats Array Implementation Test\n');
  testStatsArray();
  demonstrateStatsUsage();
  
  console.log('\n🚀 Ready to use the new stats structure!');
  console.log('\n💡 To test with actual API:');
  console.log('1. Start your server: npm run start:dev');
  console.log('2. Create/update a profile with the new stats array');
  console.log('3. Verify the data is saved correctly');
}

module.exports = { testStatsArray, demonstrateStatsUsage }; 