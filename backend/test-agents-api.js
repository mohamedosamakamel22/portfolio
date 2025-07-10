const axios = require('axios');

// Set your server URL
const BASE_URL = 'http://localhost:3000';

// Function to make requests with error handling
async function makeRequest(method, url, data = null, headers = {}) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`Error in ${method} ${url}:`, error.response?.data || error.message);
        throw error;
    }
}

async function testAgentsAPI() {
    console.log('🚀 Testing Agents API...\n');
    
    try {
        // Test 1: Create a new agent
        console.log('📝 Test 1: Creating a new agent...');
        const newAgent = await makeRequest('POST', '/agents', {
            userName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+966 50 444 5566',
            message: 'Looking for collaboration opportunities'
        });
        console.log('✅ Agent created:', newAgent);
        const agentId = newAgent._id;
        
        // Test 2: Create another agent without optional fields
        console.log('\n📝 Test 2: Creating an agent without optional fields...');
        const newAgent2 = await makeRequest('POST', '/agents', {
            userName: 'Jane Smith',
            phone: '+966 51 555 7788'
        });
        console.log('✅ Agent created:', newAgent2);
        
        // Test 3: Get all agents
        console.log('\n📝 Test 3: Getting all agents...');
        const allAgents = await makeRequest('GET', '/agents');
        console.log('✅ All agents:', allAgents);
        
        // Test 4: Get active agents
        console.log('\n📝 Test 4: Getting active agents...');
        const activeAgents = await makeRequest('GET', '/agents/active');
        console.log('✅ Active agents:', activeAgents);
        
        // Test 5: Get agent by ID
        console.log('\n📝 Test 5: Getting agent by ID...');
        const agent = await makeRequest('GET', `/agents/${agentId}`);
        console.log('✅ Agent by ID:', agent);
        
        // Test 6: Get agents count
        console.log('\n📝 Test 6: Getting agents count...');
        const count = await makeRequest('GET', '/agents/count');
        console.log('✅ Agents count:', count);
        
        // Test 7: Update agent (requires authentication - this will fail without token)
        console.log('\n📝 Test 7: Updating agent (will fail without auth token)...');
        try {
            const updatedAgent = await makeRequest('PUT', `/agents/${agentId}`, {
                userName: 'John Doe Updated',
                message: 'Updated message'
            });
            console.log('✅ Agent updated:', updatedAgent);
        } catch (error) {
            console.log('⚠️  Update failed (expected - requires authentication)');
        }
        
        // Test 8: Delete agent (requires authentication - this will fail without token)
        console.log('\n📝 Test 8: Deleting agent (will fail without auth token)...');
        try {
            const deleteResult = await makeRequest('DELETE', `/agents/${agentId}`);
            console.log('✅ Agent deleted:', deleteResult);
        } catch (error) {
            console.log('⚠️  Delete failed (expected - requires authentication)');
        }
        
        console.log('\n🎉 All tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the tests
if (require.main === module) {
    testAgentsAPI();
}

module.exports = { testAgentsAPI }; 