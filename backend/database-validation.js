require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}🔥 ${msg}${colors.reset}\n`),
  section: (msg) => console.log(`\n${colors.bold}${colors.blue}📋 ${msg}${colors.reset}`)
};

let validationResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
};

function validateResult(condition, successMsg, errorMsg) {
  validationResults.total++;
  if (condition) {
    validationResults.passed++;
    log.success(successMsg);
    return true;
  } else {
    validationResults.failed++;
    log.error(errorMsg);
    return false;
  }
}

function validateWarning(condition, successMsg, warningMsg) {
  if (condition) {
    log.success(successMsg);
  } else {
    validationResults.warnings++;
    log.warning(warningMsg);
  }
}

async function validateDatabase() {
  log.header('DATABASE VALIDATION - SAEED SEKKA PORTFOLIO');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    log.error('MONGODB_URI not found in environment variables');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    log.success('Connected to MongoDB');

    const db = client.db('portfolio');

    // ===========================================
    // 👥 USERS COLLECTION VALIDATION
    // ===========================================
    log.section('USERS COLLECTION VALIDATION');

    const users = await db.collection('users').find({}).toArray();
    validateResult(
      users.length >= 2,
      `Users collection has ${users.length} users (Expected: 2+)`,
      `Users collection has only ${users.length} users`
    );

    // Check admin user
    const adminUser = users.find(u => u.role === 'admin');
    validateResult(
      adminUser && adminUser.email === 'SaeedSekka@email.com',
      'Admin user found with correct email',
      'Admin user not found or incorrect email'
    );

    // Check user schema fields
    const userRequiredFields = ['email', 'password', 'firstName', 'lastName', 'role'];
    const userSample = users[0];
    userRequiredFields.forEach(field => {
      validateResult(
        userSample.hasOwnProperty(field),
        `User schema has required field: ${field}`,
        `User schema missing required field: ${field}`
      );
    });

    // ===========================================
    // 📝 PROFILES COLLECTION VALIDATION
    // ===========================================
    log.section('PROFILES COLLECTION VALIDATION');

    const profiles = await db.collection('profiles').find({}).toArray();
    validateResult(
      profiles.length >= 1,
      `Profiles collection has ${profiles.length} profiles`,
      `Profiles collection has no profiles`
    );

    if (profiles.length > 0) {
      const profile = profiles[0];
      
      // Check user relationship
      validateResult(
        profile.userId && ObjectId.isValid(profile.userId),
        'Profile has valid userId reference',
        'Profile missing or invalid userId reference'
      );

      // Check new fields we added
      const newFields = ['callToAction', 'bookSessionButton'];
      newFields.forEach(field => {
        validateResult(
          profile.hasOwnProperty(field),
          `Profile has new field: ${field}`,
          `Profile missing new field: ${field}`
        );
      });

      // Check complex nested fields
      const complexFields = ['gear', 'experience', 'faq', 'clientBenefits'];
      complexFields.forEach(field => {
        validateWarning(
          profile[field] && (Array.isArray(profile[field]) || typeof profile[field] === 'object'),
          `Profile has complex field: ${field}`,
          `Profile missing or invalid complex field: ${field}`
        );
      });

      // Check gear structure
      if (profile.gear) {
        const gearCategories = ['cameras', 'lenses', 'accessories', 'editingTools'];
        gearCategories.forEach(category => {
          validateWarning(
            profile.gear[category] && Array.isArray(profile.gear[category]),
            `Gear has ${category} array`,
            `Gear missing ${category} array`
          );
        });
      }

      // Check experience structure
      if (profile.experience && Array.isArray(profile.experience)) {
        log.info(`Profile has ${profile.experience.length} experience entries`);
        if (profile.experience.length > 0) {
          const exp = profile.experience[0];
          const expFields = ['company', 'position', 'startDate', 'description'];
          expFields.forEach(field => {
            validateWarning(
              exp.hasOwnProperty(field),
              `Experience entry has field: ${field}`,
              `Experience entry missing field: ${field}`
            );
          });
        }
      }
    }

    // ===========================================
    // 📸 ALBUMS COLLECTION VALIDATION
    // ===========================================
    log.section('ALBUMS COLLECTION VALIDATION');

    const albums = await db.collection('albums').find({}).toArray();
    validateResult(
      albums.length >= 5,
      `Albums collection has ${albums.length} albums (Expected: 5)`,
      `Albums collection has only ${albums.length} albums`
    );

    if (albums.length > 0) {
      const album = albums[0];
      
      // Check user relationship
      validateResult(
        album.createdBy && ObjectId.isValid(album.createdBy),
        'Album has valid createdBy reference',
        'Album missing or invalid createdBy reference'
      );

      // Check album essential fields
      const albumFields = ['title', 'description', 'category', 'coverImage', 'images'];
      albumFields.forEach(field => {
        validateResult(
          album.hasOwnProperty(field),
          `Album has required field: ${field}`,
          `Album missing required field: ${field}`
        );
      });

      // Check new album fields
      const newAlbumFields = ['specifications', 'actionButton', 'youtubeVideo'];
      newAlbumFields.forEach(field => {
        validateWarning(
          album.hasOwnProperty(field),
          `Album has enhanced field: ${field}`,
          `Album missing enhanced field: ${field}`
        );
      });

      // Check categories distribution
      const categories = [...new Set(albums.map(a => a.category))];
      log.info(`Album categories: ${categories.join(', ')}`);
      validateResult(
        categories.length >= 3,
        `Albums have diverse categories (${categories.length})`,
        `Albums have limited categories (${categories.length})`
      );
    }

    // ===========================================
    // ⭐ REVIEWS COLLECTION VALIDATION
    // ===========================================
    log.section('REVIEWS COLLECTION VALIDATION');

    const reviews = await db.collection('reviews').find({}).toArray();
    validateResult(
      reviews.length >= 4,
      `Reviews collection has ${reviews.length} reviews (Expected: 4)`,
      `Reviews collection has only ${reviews.length} reviews`
    );

    if (reviews.length > 0) {
      const review = reviews[0];
      
      // Check user relationship
      validateResult(
        review.reviewedBy && ObjectId.isValid(review.reviewedBy),
        'Review has valid reviewedBy reference',
        'Review missing or invalid reviewedBy reference'
      );

      // Check review fields
      const reviewFields = ['clientName', 'rating', 'title', 'content'];
      reviewFields.forEach(field => {
        validateResult(
          review.hasOwnProperty(field),
          `Review has required field: ${field}`,
          `Review missing required field: ${field}`
        );
      });

      // Check rating values
      const ratings = reviews.map(r => r.rating);
      const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      validateResult(
        avgRating >= 4.0,
        `Average rating is ${avgRating.toFixed(1)} (Good quality reviews)`,
        `Average rating is ${avgRating.toFixed(1)} (Low quality reviews)`
      );
    }

    // ===========================================
    // 📞 CONTACTS COLLECTION VALIDATION
    // ===========================================
    log.section('CONTACTS COLLECTION VALIDATION');

    const contacts = await db.collection('contacts').find({}).toArray();
    validateResult(
      contacts.length >= 2,
      `Contacts collection has ${contacts.length} contacts (Expected: 2)`,
      `Contacts collection has only ${contacts.length} contacts`
    );

    if (contacts.length > 0) {
      const contact = contacts[0];
      
      // Check user relationship
      validateResult(
        contact.contactingUser && ObjectId.isValid(contact.contactingUser),
        'Contact has valid contactingUser reference',
        'Contact missing or invalid contactingUser reference'
      );

      // Check contact fields
      const contactFields = ['name', 'email', 'subject', 'message'];
      contactFields.forEach(field => {
        validateResult(
          contact.hasOwnProperty(field),
          `Contact has required field: ${field}`,
          `Contact missing required field: ${field}`
        );
      });
    }

    // ===========================================
    // 🔗 RELATIONSHIPS VALIDATION
    // ===========================================
    log.section('DATABASE RELATIONSHIPS VALIDATION');

    if (users.length > 0 && profiles.length > 0) {
      const adminUserId = adminUser._id.toString();
      const profileUserId = profiles[0].userId.toString();
      validateResult(
        adminUserId === profileUserId,
        'Profile correctly linked to admin user',
        'Profile not linked to admin user'
      );
    }

    if (users.length > 0 && albums.length > 0) {
      const adminUserId = adminUser._id.toString();
      const albumsLinkedToAdmin = albums.filter(a => a.createdBy.toString() === adminUserId).length;
      validateResult(
        albumsLinkedToAdmin === albums.length,
        `All ${albumsLinkedToAdmin} albums linked to admin user`,
        `Only ${albumsLinkedToAdmin}/${albums.length} albums linked to admin user`
      );
    }

    if (users.length > 0 && reviews.length > 0) {
      const adminUserId = adminUser._id.toString();
      const reviewsForAdmin = reviews.filter(r => r.reviewedBy.toString() === adminUserId).length;
      validateResult(
        reviewsForAdmin === reviews.length,
        `All ${reviewsForAdmin} reviews for admin user`,
        `Only ${reviewsForAdmin}/${reviews.length} reviews for admin user`
      );
    }

    // ===========================================
    // 📊 DATA INTEGRITY CHECKS
    // ===========================================
    log.section('DATA INTEGRITY CHECKS');

    // Check for required data completeness
    const profilesWithCompleteData = profiles.filter(p => 
      p.name && p.email && p.phone && p.bio && p.detailedBio
    ).length;
    validateResult(
      profilesWithCompleteData === profiles.length,
      `All profiles have complete basic data`,
      `${profiles.length - profilesWithCompleteData} profiles missing basic data`
    );

    // Check albums have images
    const albumsWithImages = albums.filter(a => 
      a.images && Array.isArray(a.images) && a.images.length > 0
    ).length;
    validateResult(
      albumsWithImages === albums.length,
      `All albums have images`,
      `${albums.length - albumsWithImages} albums missing images`
    );

    // Check reviews have proper ratings
    const validReviews = reviews.filter(r => 
      r.rating && r.rating >= 1 && r.rating <= 5
    ).length;
    validateResult(
      validReviews === reviews.length,
      `All reviews have valid ratings (1-5)`,
      `${reviews.length - validReviews} reviews have invalid ratings`
    );

  } catch (error) {
    log.error(`Database validation failed: ${error.message}`);
  } finally {
    await client.close();
    log.success('Database connection closed');
  }

  // ===========================================
  // 📊 FINAL RESULTS
  // ===========================================
  log.header('DATABASE VALIDATION RESULTS');
  
  console.log(`${colors.bold}📊 Total Validations: ${validationResults.total}${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${validationResults.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${validationResults.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${validationResults.warnings}${colors.reset}`);
  
  const successRate = ((validationResults.passed / validationResults.total) * 100).toFixed(1);
  console.log(`\n${colors.bold}📈 Success Rate: ${successRate}%${colors.reset}`);
  
  if (successRate >= 95) {
    log.success('🎉 EXCELLENT! Database schema and data integrity perfect!');
  } else if (successRate >= 85) {
    log.warning('⚠️  GOOD! Database mostly healthy, minor issues detected.');
  } else {
    log.error('🚨 CRITICAL! Database has significant issues that need attention.');
  }
  
  log.header('DATABASE VALIDATION COMPLETE');
}

// Run validation
if (require.main === module) {
  validateDatabase().catch(console.error);
}

module.exports = { validateDatabase }; 