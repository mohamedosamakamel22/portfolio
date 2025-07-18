const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function testDigitalOceanSpaces() {
  console.log('🌊 Testing Digital Ocean Spaces Connection...\n');

  // Check environment variables
  const accessKey = process.env.DO_SPACES_KEY;
  const secretKey = process.env.DO_SPACES_SECRET;
  const bucketName = process.env.DO_SPACES_BUCKET || 'portfolio';

  console.log('📋 Environment Variables:');
  console.log(`✅ DO_SPACES_KEY: ${accessKey ? 'SET' : 'NOT SET'}`);
  console.log(`✅ DO_SPACES_SECRET: ${secretKey ? 'SET' : 'NOT SET'}`);
  console.log(`✅ DO_SPACES_BUCKET: ${bucketName}`);
  console.log(`🌐 Endpoint: https://${bucketName}.sfo3.digitaloceanspaces.com\n`);

  if (!accessKey || !secretKey) {
    console.log('❌ Missing required environment variables');
    return;
  }

  try {
    // Create S3 client
    const s3Client = new S3Client({
      endpoint: `https://${bucketName}.sfo3.digitaloceanspaces.com`,
      region: 'sfo3',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: false,
    });

    console.log('🔗 Testing connection...');
    
    // Try to list buckets (this will test the connection)
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    console.log('✅ Connection successful!');
    console.log('📦 Available buckets:', response.Buckets?.map(b => b.Name).join(', ') || 'None');
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('AccessDenied')) {
      console.log('\n💡 This might be a permissions issue. Check your API keys.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 This might be a network or endpoint issue.');
    }
  }
}

testDigitalOceanSpaces(); 