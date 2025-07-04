const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test the create album endpoint with image uploads
async function testCreateAlbum() {
  const baseUrl = 'http://localhost:3000';
  const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual admin JWT token

  const formData = new FormData();

  // Required fields
  formData.append('title', 'Test Album with Images');
  formData.append('description', 'This is a test album to demonstrate image upload functionality');

  // Optional fields
  formData.append('tags', 'Test,Photography,Portfolio');
  
  // JSON fields as strings
  formData.append('features', JSON.stringify([
    {
      icon: '📸',
      title: 'Camera Used',
      value: 'Canon EOS R5',
      order: 1
    },
    {
      icon: '📱',
      title: 'Location',
      value: 'New York City',
      order: 2
    }
  ]));

  formData.append('specifications', JSON.stringify([
    {
      icon: '📂',
      name: 'Category',
      value: 'Street Photography',
      order: 1
    },
    {
      icon: '🎨',
      name: 'Style',
      value: 'Urban',
      order: 2
    }
  ]));

  formData.append('actionButton', JSON.stringify({
    text: 'View Gallery',
    url: 'https://example.com/gallery',
    enabled: true,
    style: 'primary'
  }));

  formData.append('youtubeVideo', JSON.stringify({
    videoId: 'dQw4w9WgXcQ',
    title: 'Behind the Scenes - Test Album',
    description: 'A behind the scenes look at creating this test album',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '3:45'
  }));

  // Add cover image (if you have a test image file)
  // formData.append('coverImage', fs.createReadStream(path.join(__dirname, 'test-cover.jpg')));

  // Add multiple images (if you have test image files)
  // formData.append('images', fs.createReadStream(path.join(__dirname, 'test-image-1.jpg')));
  // formData.append('images', fs.createReadStream(path.join(__dirname, 'test-image-2.jpg')));
  // formData.append('imageAlt_0', 'First test image description');
  // formData.append('imageAlt_1', 'Second test image description');

  try {
    const response = await fetch(`${baseUrl}/albums`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Album created successfully:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.error('❌ Failed to create album:');
      console.error(error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test without images (just metadata)
async function testCreateAlbumWithoutImages() {
  const baseUrl = 'http://localhost:3000';
  const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual admin JWT token

  const formData = new FormData();

  // Required fields
  formData.append('title', 'Test Album - No Images');
  formData.append('description', 'This is a test album without image uploads');

  // Optional fields
  formData.append('tags', 'Test,NoImages,Portfolio');

  try {
    const response = await fetch(`${baseUrl}/albums`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Album created successfully (no images):');
      console.log(JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.error('❌ Failed to create album:');
      console.error(error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test validation errors
async function testValidationErrors() {
  const baseUrl = 'http://localhost:3000';
  const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual admin JWT token

  const formData = new FormData();

  // Missing required fields to test validation
  formData.append('title', ''); // Empty title
  // Missing description

  try {
    const response = await fetch(`${baseUrl}/albums`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('✅ Validation error caught as expected:');
      console.log(error);
    } else {
      console.error('❌ Expected validation error but request succeeded');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run tests
console.log('🚀 Testing Album Creation API...\n');

console.log('1. Testing album creation with metadata only:');
testCreateAlbumWithoutImages();

console.log('\n2. Testing album creation with full data:');
testCreateAlbum();

console.log('\n3. Testing validation errors:');
testValidationErrors();

console.log('\n📝 Note: Replace YOUR_JWT_TOKEN_HERE with an actual admin JWT token');
console.log('📝 Note: Uncomment image upload lines if you have test image files'); 