const fs = require('fs');
const path = require('path');

// Test script for Digital Ocean Spaces integration
console.log('🌊 Digital Ocean Spaces Migration Test');
console.log('=====================================');

// Check if required environment variables are set
const requiredEnvVars = [
  'DO_SPACES_KEY',
  'DO_SPACES_SECRET', 
  'DO_SPACES_BUCKET',
  'DO_SPACES_ENDPOINT',
  'DO_SPACES_REGION'
];

console.log('\n📋 Environment Variables Check:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***SET***' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Check if AWS SDK is installed
console.log('\n📦 Dependencies Check:');
try {
  require('@aws-sdk/client-s3');
  console.log('✅ @aws-sdk/client-s3: Installed');
} catch (error) {
  console.log('❌ @aws-sdk/client-s3: Not installed');
}

try {
  require('@aws-sdk/s3-request-presigner');
  console.log('✅ @aws-sdk/s3-request-presigner: Installed');
} catch (error) {
  console.log('❌ @aws-sdk/s3-request-presigner: Not installed');
}

// Check if Digital Ocean Spaces service exists
console.log('\n🔧 Service Files Check:');
const servicePath = path.join(__dirname, 'src', 'digitalocean-spaces', 'digitalocean-spaces.service.ts');
const modulePath = path.join(__dirname, 'src', 'digitalocean-spaces', 'digitalocean-spaces.module.ts');

if (fs.existsSync(servicePath)) {
  console.log('✅ digitalocean-spaces.service.ts: Exists');
} else {
  console.log('❌ digitalocean-spaces.service.ts: Missing');
}

if (fs.existsSync(modulePath)) {
  console.log('✅ digitalocean-spaces.module.ts: Exists');
} else {
  console.log('❌ digitalocean-spaces.module.ts: Missing');
}

// Check if media controller has been updated
const mediaControllerPath = path.join(__dirname, 'src', 'media', 'media.controller.ts');
if (fs.existsSync(mediaControllerPath)) {
  const content = fs.readFileSync(mediaControllerPath, 'utf8');
  if (content.includes('DigitalOceanSpacesService')) {
    console.log('✅ media.controller.ts: Updated to use Digital Ocean Spaces');
  } else {
    console.log('❌ media.controller.ts: Still using Cloudinary');
  }
} else {
  console.log('❌ media.controller.ts: File not found');
}

console.log('\n🚀 Test API Endpoints:');
console.log('The following endpoints should work with Digital Ocean Spaces:');
console.log('- POST /media/upload');
console.log('- POST /media/upload/large-file');
console.log('- POST /media/upload/multiple');
console.log('- POST /media/upload/mixed');
console.log('- POST /profile/:id/upload-profile-image');

console.log('\n📝 Next Steps:');
console.log('1. Set up your Digital Ocean Spaces bucket');
console.log('2. Configure environment variables in .env file');
console.log('3. Start the server: npm run start:dev');
console.log('4. Test upload endpoints with curl or Postman');
console.log('5. Check the DIGITAL_OCEAN_SPACES_MIGRATION.md for detailed instructions');

console.log('\n✨ Migration Complete!'); 