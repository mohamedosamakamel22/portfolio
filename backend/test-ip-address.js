const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/ip-address`;

// Test function to record a visit
async function testRecordVisit() {
    console.log('\n=== Testing IP Address Recording ===');
    
    try {
        // Test 1: Record a new visitor
        console.log('\n1. Recording new visitor...');
        const newVisitorData = {
            ip: '192.168.1.100'
        };
        
        const response1 = await axios.post(API_BASE, newVisitorData);
        console.log('New visitor response:', response1.data);
        
        // Test 2: Record the same visitor again (should increment)
        console.log('\n2. Recording same visitor again...');
        const response2 = await axios.post(API_BASE, newVisitorData);
        console.log('Returning visitor response:', response2.data);
        
        // Test 3: Record another visitor
        console.log('\n3. Recording another visitor...');
        const anotherVisitorData = {
            ip: '192.168.1.101'
        };
        
        const response3 = await axios.post(API_BASE, anotherVisitorData);
        console.log('Another visitor response:', response3.data);
        
        // Test 4: Record first visitor again
        console.log('\n4. Recording first visitor again...');
        const response4 = await axios.post(API_BASE, newVisitorData);
        console.log('First visitor again response:', response4.data);
        
    } catch (error) {
        console.error('Error recording visit:', error.response?.data || error.message);
    }
}

// Test function to get visitor stats
async function testGetStats() {
    console.log('\n=== Testing Visitor Statistics ===');
    
    try {
        const response = await axios.get(API_BASE);
        console.log('Visitor statistics:', response.data);
    } catch (error) {
        console.error('Error getting stats:', error.response?.data || error.message);
    }
}

// Test function for invalid IP
async function testInvalidIP() {
    console.log('\n=== Testing Invalid IP ===');
    
    try {
        const invalidData = {
            ip: 'invalid-ip-address'
        };
        
        const response = await axios.post(API_BASE, invalidData);
        console.log('Invalid IP response:', response.data);
    } catch (error) {
        console.log('Expected error for invalid IP:', error.response?.data || error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('Starting IP Address API Tests...');
    console.log('Make sure your NestJS server is running on port 3000');
    
    await testRecordVisit();
    await testGetStats();
    await testInvalidIP();
    
    console.log('\n=== All Tests Completed ===');
}

// Run the tests
runTests().catch(console.error);

// Example usage for frontend integration:
console.log(`
=== Frontend Integration Example ===

// JavaScript code for your frontend:
const recordVisit = async () => {
    try {
        // Get visitor's IP (you might need a service like ipify.org)
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Record the visit
        const visitData = {
            ip: ipData.ip
        };
        
        const response = await fetch('${API_BASE}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitData)
        });
        
        const result = await response.json();
        console.log('Visit recorded:', result);
    } catch (error) {
        console.error('Error recording visit:', error);
    }
};

// Get visitor statistics
const getStats = async () => {
    try {
        const response = await fetch('${API_BASE}');
        const stats = await response.json();
        console.log('Visitor stats:', stats);
        // stats.totalVisits = total visits including repeated visits
        // stats.uniqueIPs = distinct count of IP addresses
    } catch (error) {
        console.error('Error getting stats:', error);
    }
};

// Call this function when your website loads
recordVisit();
`); 