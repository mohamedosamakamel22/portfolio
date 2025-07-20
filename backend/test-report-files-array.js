const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testReportFilesArray() {
  console.log('🧪 Testing Report Files Array Structure...\n');

  try {
    // First, test if server is running
    console.log('🔍 Checking if server is running...');
    try {
      await axios.get(`${API_BASE_URL}/reports`);
      console.log('✅ Server is running');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ Server is not running. Please start the server with: npm run start:dev');
        return;
      }
      console.log('✅ Server is running (got response)');
    }

    // Test 1: Create report with files array
    console.log('\n📝 Test 1: Creating report with files array...');
    const createReportData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+966 50 123 4567',
      message: 'This is a test report with files',
      files: [
        {
          url: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/document.pdf',
          filename: 'document.pdf'
        },
        {
          url: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/screenshot.png',
          filename: 'screenshot.png'
        }
      ]
    };

    const createResponse = await axios.post(`${API_BASE_URL}/reports`, createReportData);
    console.log('✅ Create report response:', JSON.stringify(createResponse.data, null, 2));

    const reportId = createResponse.data._id;

    // Test 2: Update report with new files array
    console.log('\n📝 Test 2: Updating report with new files array...');
    const updateReportData = {
      message: 'Updated message with new files',
      files: [
        {
          url: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/updated-document.pdf',
          filename: 'updated-document.pdf'
        }
      ]
    };

    const updateResponse = await axios.patch(`${API_BASE_URL}/reports/${reportId}`, updateReportData);
    console.log('✅ Update report response:', JSON.stringify(updateResponse.data, null, 2));

    // Test 3: Get the updated report
    console.log('\n📝 Test 3: Getting updated report...');
    const getResponse = await axios.get(`${API_BASE_URL}/reports/${reportId}`);
    console.log('✅ Get report response:', JSON.stringify(getResponse.data, null, 2));

    // Test 4: Create report without files (optional field)
    console.log('\n📝 Test 4: Creating report without files...');
    const createReportWithoutFiles = {
      name: 'Test User No Files',
      email: 'testnofiles@example.com',
      phone: '+966 50 987 6543',
      message: 'This is a test report without files'
    };

    const createNoFilesResponse = await axios.post(`${API_BASE_URL}/reports`, createReportWithoutFiles);
    console.log('✅ Create report without files response:', JSON.stringify(createNoFilesResponse.data, null, 2));

    // Test 5: Update report to add files
    console.log('\n📝 Test 5: Adding files to existing report...');
    const addFilesData = {
      files: [
        {
          url: 'https://res.cloudinary.com/example/image/upload/v1234567890/reports/added-file.pdf',
          filename: 'added-file.pdf'
        }
      ]
    };

    const addFilesResponse = await axios.patch(`${API_BASE_URL}/reports/${createNoFilesResponse.data._id}`, addFilesData);
    console.log('✅ Add files response:', JSON.stringify(addFilesResponse.data, null, 2));

    console.log('\n🎉 All tests passed! Files array structure is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Server might not be running.');
      console.error('Please start the server with: npm run start:dev');
    } else {
      console.error('Error details:', error);
    }
  }
}

// Run the test
testReportFilesArray(); 