require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seedEnhancedData() {
  console.log('🌱 SEEDING SAEED SEKKA PORTFOLIO DATA...\n');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('portfolio');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('profiles').deleteMany({}),
      db.collection('albums').deleteMany({}),
      db.collection('reviews').deleteMany({}),
      db.collection('contacts').deleteMany({})
    ]);
    console.log('✅ All data cleared');

    // Seed Users
    console.log('👤 Seeding users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const hashedCustomerPassword = await bcrypt.hash('customer123', 12);

    const users = [
      {
        email: 'SaeedSekka@email.com',
        password: hashedAdminPassword,
        firstName: 'Saeed',
        lastName: 'Sekka',
        phone: '+966-53-868-3923',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        avatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/users/saeed-avatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'customer@example.com',
        password: hashedCustomerPassword,
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        phone: '+966 50 123 4567',
        role: 'customer',
        isActive: true,
        isEmailVerified: true,
        avatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/users/customer-avatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    // ✅ ALL MISSING ELEMENTS ADDED:
    // - Profile: introText, moreAboutMe button, brandsWorkedWith array
    // - Albums: specifications array, actionButton with redirect URLs
    // - Complete data matching the website structure




    const userResult = await db.collection('users').insertMany(users);
    console.log('✅ Users seeded successfully');

    // Get the admin user ID for relationships
    const adminUser = userResult.insertedIds[0]; // First user is Saeed (admin)
    const customerUser = userResult.insertedIds[1]; // Second user is customer

    // Saeed Sekka Profile - Identical to website
    console.log('📝 Seeding Saeed Sekka profile...');
    const profile = {
      userId: adminUser, // Link profile to admin user
      name: 'Saeed Sekka',
      title: 'Photography • Photo Editing • Designer',
      bio: 'I am Saeed, a passionate photographer dedicated to capturing life\'s most precious moments. With a keen eye for detail and a love for storytelling, I strive to create images that are not just beautiful, but that also evoke emotion and tell a compelling story.',
      
      // Additional intro text from website
      introText: 'I am Saeed, a passionate photographer dedicated to crafting moments and capturing stories through the lens',

      // Detailed bio from website
      detailedBio: 'Hi there! I\'m Saeed Sekka, a passionate photographer based in the vibrant city of Riyadh. With over a decade of experience behind the lens, I specialize in capturing the unique beauty of life\'s fleeting moments, from portraits and breathtaking landscapes to dynamic product shots and lively events.',

      // Photography journey from website
      photographyJourney: 'My journey into photography began as a curious child with a disposable camera, fascinated by the world\'s colors and light. Over the years, this hobby transformed into a full-blown love affair with visual storytelling. Each click of the shutter is my way of freezing time, preserving emotions, and narrating stories that words alone can\'t convey. I\'ve had the privilege of working with amazing clients and have been honored with several awards for my work.',
      
      // Call-to-action text from website
      callToAction: 'Let\'s create something extraordinary together. Whether you\'re looking to capture a special moment, need stunning visuals for your brand, or simply want to explore the world through my lens, I\'d love to hear from you! Feel free to reach out, and let\'s make magic happen.',
      
      // Book a session button configuration
      bookSessionButton: {
        text: 'Book a session',
        url: '/contact',
        enabled: true,
        style: 'primary',
        icon: '📸'
      },
      
      // More About Me button configuration
      moreAboutMe: {
        text: 'More About Me',
        url: '/about',
        enabled: true
      },

      // Brands worked with - array of brand icons
      brandsWorkedWith: [
        { name: 'Canon', icon: '📷', url: 'https://canon.com', order: 1 },
        { name: 'Adobe', icon: '🎨', url: 'https://adobe.com', order: 2 },
        { name: 'Lightroom', icon: '📸', url: 'https://lightroom.adobe.com', order: 3 },
        { name: 'DJI', icon: '🚁', url: 'https://dji.com', order: 4 },
        { name: 'Fujifilm', icon: '📹', url: 'https://fujifilm.com', order: 5 },
        { name: 'National Geographic', icon: '🌍', url: 'https://nationalgeographic.com', order: 6 }
      ],

      // Contact Information - Exact from website
      email: 'SaeedSekka@email.com',
      phone: '+966-53-868-3923',
      whatsapp: '+966-53-868-3923',
      address: 'Riyadh, Saudi Arabia',
      location: 'Riyadh, Saudi Arabia',
      website: 'https://saeedseka.framer.website/',

      // Images
      profileImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg',
      avatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-avatar.jpg',
      coverImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-cover.jpg',

      // YouTube Video Integration
      youtubeVideo: {
        videoId: 'dQw4w9WgXcQ',
        title: 'Photography Behind the Scenes',
        description: 'Take a look at my photography process and creative journey.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },

      // Statistics - From website (animated counters)
      stats: [// list of stats
        { key: 'yearsExperience', value: 14 }, // 2010-2024
        { key: 'projectsCompleted', value: 500 },
        { key: 'happyClients', value: 200 },
        { key: 'awards', value: 25 },
        { key: 'hoursExperience', value: 15000 }
      ],

      // Services - Exact from website
      services: [
        { name: 'Event Photography', icon: '📸', description: 'Tell powerful stories through our event photography, capturing real-life events and moments.' },
        { name: 'Aerial Photography', icon: '🚁', description: 'Get a bird\'s-eye view with stunning aerial photography captured via drones, perfect for real estate, events, and landscapes.' },
        { name: 'Corporate Photography', icon: '👔', description: 'Enhance your brand image with professional corporate photography for headshots, team photos, and company events.' },
        { name: 'Editorial Photography', icon: '📰', description: 'Bring your stories to life with compelling editorial photography for magazines, blogs, and publications.' },
        { name: 'Photography', icon: '📷', description: 'Professional photography services with artistic vision' },
        { name: 'Photo Editing', icon: '✨', description: 'Professional photo editing and post-processing' },
        { name: 'Designer', icon: '🎨', description: 'Creative design solutions for various needs' }
      ],

      // EXPERIENCE - Exact from website
      experience: [
        {
          company: 'Clavmen Studio',
          position: 'Senior UX Designer',
          startDate: new Date('2022-01-01'),
          endDate: undefined,
          isPresent: true,
          location: 'Riyadh, Saudi Arabia',
          employmentType: 'Full-time',
          description: 'Clavmen inspires creativity and makes learning piano fun. The sleek, lightweight body fits easily into gig bags for portability.',
          achievements: [
            'Led UX design for innovative piano learning platform',
            'Improved user engagement by 40%',
            'Designed portable and user-friendly interfaces',
            'Collaborated with cross-functional teams'
          ]
        },
        {
          company: 'Losify',
          position: 'Lead Product Designer',
          startDate: new Date('2013-01-01'),
          endDate: new Date('2022-12-31'),
          isPresent: false,
          location: 'Saudi Arabia',
          employmentType: 'Full-time',
          description: 'Fitness and well-being with personalized coaching and innovative wellness solutions.',
          achievements: [
            'Led product design for fitness platform',
            'Developed personalized coaching interfaces',
            'Created innovative wellness solutions',
            'Managed design team of 5 designers',
            'Launched 3 major product updates'
          ]
        },
        {
          company: 'Gamadias',
          position: 'Junior Ux Designer',
          startDate: new Date('2012-01-01'),
          endDate: new Date('2013-12-31'),
          isPresent: false,
          location: 'Saudi Arabia',
          employmentType: 'Full-time',
          description: 'Gaming Experiences with Innovative Technology and Unparalleled Performance.',
          achievements: [
            'Designed gaming interfaces and experiences',
            'Worked with innovative gaming technology',
            'Contributed to unparalleled performance solutions',
            'Collaborated on multiple game projects'
          ]
        },
        {
          company: 'Freelance',
          position: 'Web Designer',
          startDate: new Date('2010-01-01'),
          endDate: new Date('2012-12-31'),
          isPresent: false,
          location: 'Saudi Arabia',
          employmentType: 'Freelance',
          description: 'Bringing creativity, technical expertise, and a passion for design to every project.',
          achievements: [
            'Completed 100+ web design projects',
            'Built strong client relationships',
            'Developed technical expertise in web technologies',
            'Established creative design methodology'
          ]
        }
      ],

      // Social Media - From website
      socialMedia: {
        isActive: true,
        socialMedia: [
          { icon: 'fab fa-instagram', url: 'https://instagram.com/saeedsekka', title: 'Instagram', order: 1 },
          { icon: 'fab fa-facebook', url: 'https://facebook.com/saeedsekka', title: 'Facebook', order: 2 },
          { icon: 'fab fa-twitter', url: 'https://twitter.com/saeed_sekka', title: 'Twitter', order: 3 },
          { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/saeed-sekka', title: 'LinkedIn', order: 4 },
          { icon: 'fab fa-youtube', url: 'https://youtube.com/@saeedsekka', title: 'YouTube', order: 5 },
          { icon: 'fab fa-tiktok', url: 'https://tiktok.com/@saeedsekka', title: 'TikTok', order: 6 }
        ]
      },

      // Comprehensive Gear Information - From Website
      gear: {
        cameras: [
          {
            name: 'Canon EOS R5',
            model: 'Canon EOS R5',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-eos-r5.jpg',
            description: 'Professional mirrorless camera with 45MP sensor',
            order: 1
          },
          {
            name: 'Sony Alpha a7 III',
            model: 'Sony Alpha a7 III',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/sony-a7iii.jpg',
            description: 'Full-frame mirrorless camera for versatile shooting',
            order: 2
          },
          {
            name: 'Fujifilm X-T4',
            model: 'Fujifilm X-T4',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/fujifilm-xt4.jpg',
            description: 'APS-C mirrorless camera with film simulations',
            order: 3
          }
        ],
        lenses: [
          {
            name: 'Canon RF 24-70mm f/2.8L IS USM',
            model: 'Canon RF 24-70mm f/2.8L IS USM',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/canon-rf-24-70.jpg',
            description: 'Professional standard zoom lens with image stabilization',
            order: 1
          },
          {
            name: 'Fujinon XF 16-55mm f/2.8 R LM WR',
            model: 'Fujinon XF 16-55mm f/2.8 R LM WR',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/fujinon-16-55.jpg',
            description: 'Weather-resistant standard zoom lens for Fujifilm X-mount',
            order: 2
          },
          {
            name: 'Sigma 35mm f/1.4 DG HSM Art',
            model: 'Sigma 35mm f/1.4 DG HSM Art',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/sigma-35mm.jpg',
            description: 'High-performance wide-angle prime lens',
            order: 3
          },
          {
            name: 'Sony FE 85mm f/1.4 GM',
            model: 'Sony FE 85mm f/1.4 GM',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/sony-85mm.jpg',
            description: 'Premium portrait lens with beautiful bokeh',
            order: 4
          }
        ],
        accessories: [
          {
            name: 'Godox AD200 Pro',
            model: 'Godox AD200 Pro',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/godox-ad200.jpg',
            description: 'Portable flash strobe for versatile lighting',
            category: 'Lighting',
            order: 1
          },
          {
            name: 'Profoto B10',
            model: 'Profoto B10',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/profoto-b10.jpg',
            description: 'Compact and powerful off-camera flash',
            category: 'Lighting',
            order: 2
          },
          {
            name: 'Neewer Ring Light Kit',
            model: 'Neewer Ring Light Kit',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/neewer-ring-light.jpg',
            description: 'LED ring light for portrait and macro photography',
            category: 'Lighting',
            order: 3
          },
          {
            name: 'Manfrotto Befree Advanced Tripod',
            model: 'Manfrotto Befree Advanced Tripod',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/manfrotto-tripod.jpg',
            description: 'Lightweight carbon fiber travel tripod',
            category: 'Support',
            order: 4
          },
          {
            name: 'DJI Ronin-S Gimbal',
            model: 'DJI Ronin-S Gimbal',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/dji-ronin-s.jpg',
            description: '3-axis gimbal stabilizer for smooth video',
            category: 'Stabilization',
            order: 5
          },
          {
            name: 'Peak Design Everyday Backpack',
            model: 'Peak Design Everyday Backpack',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/peak-design-backpack.jpg',
            description: 'Professional camera bag with modular organization',
            category: 'Storage',
            order: 6
          },
          {
            name: 'SanDisk Extreme Pro SD Cards',
            model: 'SanDisk Extreme Pro SD Cards',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/sandisk-sd-cards.jpg',
            description: 'High-speed memory cards for professional photography',
            category: 'Storage',
            order: 7
          }
        ],
        editingTools: [
          {
            name: 'Adobe Creative Cloud',
            model: 'Adobe Creative Cloud',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/adobe-cc.jpg',
            description: 'Complete suite of creative applications',
            category: 'Software',
            order: 1
          },
          {
            name: 'Wacom Intuos Pro Tablet',
            model: 'Wacom Intuos Pro Tablet',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/wacom-intuos.jpg',
            description: 'Professional pen tablet for precise editing',
            category: 'Hardware',
            order: 2
          },
          {
            name: 'Calibrite ColorChecker Display Pro',
            model: 'Calibrite ColorChecker Display Pro',
            image: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/gear/calibrite-colorchecker.jpg',
            description: 'Monitor calibration tool for accurate colors',
            category: 'Hardware',
            order: 3
          }
        ]
      },

      // What clients will find in me - From website
      clientBenefits: [
        {
          title: 'Creative Vision',
          description: 'Bringing unique artistic perspective to every project with innovative composition and lighting techniques.',
          icon: '🎨',
          order: 1
        },
        {
          title: 'Technical Expertise',
          description: 'Mastery of professional equipment and post-processing techniques to deliver exceptional image quality.',
          icon: '⚡',
          order: 2
        },
        {
          title: 'Collaborative Approach',
          description: 'Working closely with clients to understand their vision and exceed their expectations.',
          icon: '🤝',
          order: 3
        }
      ],

      // Work approach methodology
      workApproach: [
        {
          title: 'Discovery & Planning',
          description: 'Understanding your needs, vision, and goals to create the perfect photography strategy.',
          icon: '🔍',
          order: 1
        },
        {
          title: 'Creative Execution',
          description: 'Applying technical expertise and artistic vision to capture stunning, meaningful images.',
          icon: '📸',
          order: 2
        },
        {
          title: 'Professional Delivery',
          description: 'Careful post-processing and timely delivery of high-quality final images.',
          icon: '🎯',
          order: 3
        }
      ],

      // FAQ - Exact from website
      faq: [
        {
          question: 'How do I book a photography session with you?',
          content: {
            title: 'Booking a Photography Session',
            subtitle: 'Simple and straightforward process',
            description: 'Easy steps to book your photography session',
            body: [
              {
                type: 'text',
                content: 'You can book a session by filling out the contact form on my website or by emailing me directly at'
              },
              {
                type: 'highlight',
                content: 'SaeedSekka@email.com',
                style: { bold: true, color: '#D4A574' }
              },
              {
                type: 'text',
                content: 'I\'ll get back to you within 24 hours to discuss the details and schedule your shoot.'
              }
            ]
          },
          icon: '📅',
          category: 'Booking',
          order: 1,
          isVisible: true
        },
        {
          question: 'What are your rates for photography sessions?',
          content: {
            title: 'Photography Session Rates',
            subtitle: 'Competitive and transparent pricing',
            body: [
              {
                type: 'list',
                items: [
                  { text: 'Portrait sessions start at $200', prefix: '+' },
                  { text: 'Event photography starts at $500', prefix: '+' },
                  { text: 'Commercial and product photography pricing is customized based on the project scope', prefix: '+' }
                ]
              }
            ]
          },
          icon: '💰',
          category: 'Pricing',
          order: 2,
          isVisible: true
        },
        {
          question: 'What does your pricing include?',
          content: {
            title: 'What\'s Included in Pricing',
            subtitle: 'Comprehensive service package',
            body: [
              {
                type: 'list',
                items: [
                  { text: 'Pre-shoot consultation', prefix: '✓' },
                  { text: 'The photography session', prefix: '✓' },
                  { text: 'Professional editing of selected images', prefix: '✓' },
                  { text: 'A set number of high-resolution digital images', prefix: '✓' },
                  { text: 'Online gallery for viewing and downloading photos', prefix: '✓' }
                ]
              }
            ]
          },
          icon: '📦',
          category: 'Pricing',
          order: 3,
          isVisible: true
        },
        {
          question: 'What types of photography do you specialize in?',
          content: {
            title: 'Photography Specializations',
            subtitle: 'Diverse range of photography services',
            body: [
              {
                type: 'text',
                content: 'I specialize in a variety of photography services including'
              },
              {
                type: 'highlight',
                content: 'portrait, travel, commercial, product, event, and landscape photography.',
                style: { bold: true }
              },
              {
                type: 'text',
                content: 'Check out my portfolio to see examples of my work.'
              }
            ]
          },
          icon: '📸',
          category: 'Services',
          order: 4,
          isVisible: true
        },
        {
          question: 'What is included in your photography packages?',
          content: {
            title: 'Photography Package Contents',
            subtitle: 'Complete service offerings',
            body: [
              {
                type: 'text',
                content: 'My packages typically include'
              },
              {
                type: 'list',
                items: [
                  { text: 'Pre-shoot consultation', prefix: '•' },
                  { text: 'The photography session', prefix: '•' },
                  { text: 'Professional editing', prefix: '•' },
                  { text: 'Set number of high-resolution digital images', prefix: '•' }
                ]
              },
              {
                type: 'text',
                content: 'I also offer prints and albums as add-ons.'
              }
            ]
          },
          icon: '📋',
          category: 'Packages',
          order: 5,
          isVisible: true
        },
        {
          question: 'How long does a typical photo session last?',
          content: {
            title: 'Session Duration',
            subtitle: 'Flexible timing based on your needs',
            body: [
              {
                type: 'text',
                content: 'Most sessions last between'
              },
              {
                type: 'highlight',
                content: '1-2 hours',
                style: { bold: true, color: '#D4A574' }
              },
              {
                type: 'text',
                content: 'depending on the type of shoot and the number of locations. Larger events will naturally take longer.'
              }
            ]
          },
          icon: '⏰',
          category: 'Sessions',
          order: 6,
          isVisible: true
        },
        {
          question: 'Do you travel for shoots?',
          content: {
            title: 'Travel Photography Services',
            subtitle: 'Available for destination shoots',
            body: [
              {
                type: 'text',
                content: 'Yes, I'
              },
              {
                type: 'highlight',
                content: 'love to travel!',
                style: { bold: true, color: '#D4A574' }
              },
              {
                type: 'text',
                content: 'I am available for destination shoots and events worldwide. Travel fees may apply depending on the location.'
              }
            ]
          },
          icon: '✈️',
          category: 'Travel',
          order: 7,
          isVisible: true
        },
        {
          question: 'What should I wear to my photo session?',
          content: {
            title: 'What to Wear Guide',
            subtitle: 'Tips for looking your best',
            body: [
              {
                type: 'text',
                content: 'I recommend wearing something that makes you feel'
              },
              {
                type: 'highlight',
                content: 'comfortable and confident.',
                style: { bold: true }
              },
              {
                type: 'text',
                content: 'Solid colors and minimal patterns work best. We can discuss wardrobe options during your pre-shoot consultation.'
              }
            ]
          },
          icon: '👕',
          category: 'Preparation',
          order: 8,
          isVisible: true
        },
        {
          question: 'How long will it take to receive my photos?',
          content: {
            title: 'Photo Delivery Timeline',
            subtitle: 'Quick turnaround for your memories',
            body: [
              {
                type: 'text',
                content: 'You will receive a'
              },
              {
                type: 'highlight',
                content: 'preview gallery within a week',
                style: { bold: true, color: '#D4A574' }
              },
              {
                type: 'text',
                content: 'of your shoot. The final edited images will be delivered within'
              },
              {
                type: 'highlight',
                content: '2-4 weeks',
                style: { bold: true }
              },
              {
                type: 'text',
                content: 'depending on the scope of the project.'
              }
            ]
          },
          icon: '📅',
          category: 'Delivery',
          order: 9,
          isVisible: true
        }
      ],

      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('profiles').insertOne(profile);
    console.log('✅ Saeed Sekka profile seeded successfully');

    // Albums - Based on website
    console.log('📸 Seeding albums...');
    const albums = [
      {
        createdBy: adminUser, // Link album to admin user
        title: 'Colorful India',
        description: 'Travel photography collaboration showcasing the vibrant colors and culture of India',
        projectGoal: 'To capture the vibrant life, culture, and diversity of India\'s streets through a collaborative travel photography project. The aim was to document everyday moments, unique street scenes, and cultural events, showcasing the essence of Indian street life.',
        category: 'Travel',
        projectType: 'Collaboration',
        tags: ['Travel', 'Collaboration'],//  filter by tags
        coverImage: {
          url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/colorful-india-cover.jpg',
          publicId: 'portfolio/travel/colorful-india-cover',
          width: 1200,
          height: 800,
          alt: 'Colorful India travel photography cover'
        },
        images: [
          {
            url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-1.jpg',
            publicId: 'portfolio/travel/india-1',
            width: 1200,
            height: 800,
            alt: 'Vibrant Indian street scene',
            caption: 'Colorful streets of India'
          },
          {
            url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/travel/india-2.jpg',
            publicId: 'portfolio/travel/india-2',
            width: 1200,
            height: 800,
            alt: 'Traditional Indian architecture',
            caption: 'Traditional architecture and culture'
          }
        ],
        
        // Album specifications from website
        specifications: [
          { icon: '📂', name: 'Category', value: 'Travel', order: 1 },
          { icon: '🤝', name: 'Project Type', value: 'Collaboration', order: 2 },
          { icon: '📸', name: 'Camera', value: 'Fujifilm X-T4', order: 3 },
          { icon: '🔍', name: 'Lenses', value: 'Fujinon XF 23mm f/1.4 R, Fujinon XF 35mm f/2 R WR', order: 4 },
          { icon: '🚁', name: 'Other Devices', value: 'Mavic Air', order: 5 },
          { icon: '📍', name: 'Location', value: 'India', order: 6 },
          { icon: '📅', name: 'Time', value: 'April 2024', order: 7 },
          { icon: '🏢', name: 'Client', value: 'India Tourism', order: 8 }
        ],
        
        // Action button for album
        actionButton: {
          text: 'Buy Prints',
          url: 'https://prints.saeedseka.com/colorful-india',
          enabled: true,
          style: 'primary'
        },

        // YouTube video showcasing the project
        youtubeVideo: {
          videoId: 'YqeW9_5kURI',
          title: 'Colorful India - Behind the Scenes',
          description: 'Take a journey behind the scenes of our collaborative travel photography project in India, capturing the vibrant street life and cultural diversity.',
          thumbnail: 'https://img.youtube.com/vi/YqeW9_5kURI/maxresdefault.jpg',
          embedUrl: 'https://www.youtube.com/embed/YqeW9_5kURI',
          duration: '4:32'
        },
        
        isPublished: true,
        isFeatured: true,
        viewCount: 324,
        likes: 156,
        location: 'India',
        eventDate: new Date('2024-04-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdBy: adminUser, // Link album to admin user
        title: 'Echoes of Dreams',
        description: 'Conceptual commercial photography exploring abstract themes and creative vision',
        projectGoal: 'To explore the intersection between dreams and reality through abstract conceptual photography, challenging viewers to interpret their own meaning while showcasing innovative commercial photography techniques.',
        category: 'Conceptual',
        projectType: 'Commercial',
        tags: ['Conceptual', 'Commercial'],
        coverImage: {
          url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/conceptual/echoes-dreams-cover.jpg',
          publicId: 'portfolio/conceptual/echoes-dreams-cover',
          width: 1200,
          height: 800,
          alt: 'Echoes of Dreams conceptual photography cover'
        },
        images: [
          {
            url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/conceptual/dreams-1.jpg',
            publicId: 'portfolio/conceptual/dreams-1',
            width: 1200,
            height: 800,
            alt: 'Abstract conceptual photography',
            caption: 'Conceptual art and dreams'
          }
        ],
        specifications: [
          { icon: '📂', name: 'Category', value: 'Conceptual', order: 1 },
          { icon: '💼', name: 'Project Type', value: 'Commercial', order: 2 },
          { icon: '📸', name: 'Camera', value: 'Canon EOS R5', order: 3 },
          { icon: '🔍', name: 'Lenses', value: 'Canon RF 50mm f/1.2L USM', order: 4 },
          { icon: '💡', name: 'Lighting', value: 'Studio Strobes', order: 5 },
          { icon: '📍', name: 'Location', value: 'Studio', order: 6 },
          { icon: '📅', name: 'Time', value: 'February 2024', order: 7 }
        ],
        actionButton: {
          text: 'View Series',
          url: 'https://gallery.saeedseka.com/echoes-dreams',
          enabled: true,
          style: 'secondary'
        },

        // YouTube video for conceptual project
        youtubeVideo: {
          videoId: 'M7lc1UVf-VE',
          title: 'Echoes of Dreams - Creative Process',
          description: 'Discover the creative process behind this conceptual photography series, exploring abstract themes and innovative techniques.',
          thumbnail: 'https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg',
          embedUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE',
          duration: '3:47'
        },

        isPublished: true,
        isFeatured: true,
        viewCount: 289,
        likes: 134,
        location: 'Studio',
        eventDate: new Date('2024-02-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdBy: adminUser, // Link album to admin user
        title: 'Wings of Freedom',
        description: 'Aerial and drone photography passion project capturing freedom from above',
        projectGoal: 'To showcase the world from a bird\'s-eye perspective, capturing the essence of freedom and vastness through innovative aerial photography techniques and creative drone cinematography.',
        category: 'Aerial & Drone',
        projectType: 'Passion Project',
        tags: ['Aerial & Drone', 'Passion Project'],
        coverImage: {
          url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/aerial/wings-freedom-cover.jpg',
          publicId: 'portfolio/aerial/wings-freedom-cover',
          width: 1200,
          height: 800,
          alt: 'Wings of Freedom aerial photography cover'
        },
        images: [
          {
            url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/aerial/wings-1.jpg',
            publicId: 'portfolio/aerial/wings-1',
            width: 1200,
            height: 800,
            alt: 'Aerial landscape view',
            caption: 'Freedom captured from above'
          }
        ],
        specifications: [
          { icon: '📂', name: 'Category', value: 'Aerial & Drone', order: 1 },
          { icon: '❤️', name: 'Project Type', value: 'Passion Project', order: 2 },
          { icon: '🚁', name: 'Drone', value: 'DJI Mavic 3 Pro', order: 3 },
          { icon: '📸', name: 'Camera', value: 'Hasselblad L2D-20c', order: 4 },
          { icon: '🎯', name: 'Flight Pattern', value: 'Cinematic Mapping', order: 5 },
          { icon: '📍', name: 'Location', value: 'Various Locations', order: 6 },
          { icon: '📅', name: 'Time', value: 'March 2024', order: 7 }
        ],
        actionButton: {
          text: 'Aerial Prints',
          url: 'https://prints.saeedseka.com/wings-freedom',
          enabled: true,
          style: 'primary'
        },

        // YouTube video for aerial project
        youtubeVideo: {
          videoId: 'dNJdJIwCF_Y',
          title: 'Wings of Freedom - Aerial Photography Journey',
          description: 'Experience breathtaking aerial views and learn about the techniques used in capturing stunning drone photography from above.',
          thumbnail: 'https://img.youtube.com/vi/dNJdJIwCF_Y/maxresdefault.jpg',
          embedUrl: 'https://www.youtube.com/embed/dNJdJIwCF_Y',
          duration: '5:18'
        },

        isPublished: true,
        isFeatured: true,
        viewCount: 412,
        likes: 198,
        location: 'Various Locations',
        eventDate: new Date('2024-03-10'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdBy: adminUser, // Link album to admin user
        title: 'Crafted Perfection',
        description: 'Professional product photography showcasing commercial craftsmanship',
        projectGoal: 'To highlight the intricate details and superior quality of handcrafted products through precise lighting and composition, emphasizing the artisanal craftsmanship and commercial appeal.',
        category: 'Product',
        projectType: 'Commercial',
        tags: ['Product', 'Commercial'],
        coverImage: {
          url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/product/crafted-perfection-cover.jpg',
          publicId: 'portfolio/product/crafted-perfection-cover',
          width: 1200,
          height: 800,
          alt: 'Crafted Perfection product photography cover'
        },
        images: [
          {
            url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/product/crafted-1.jpg',
            publicId: 'portfolio/product/crafted-1',
            width: 1200,
            height: 800,
            alt: 'Professional product shot',
            caption: 'Perfectly crafted products'
          }
        ],
        specifications: [
          { icon: '📂', name: 'Category', value: 'Product', order: 1 },
          { icon: '💼', name: 'Project Type', value: 'Commercial', order: 2 },
          { icon: '📸', name: 'Camera', value: 'Canon EOS 5D Mark IV', order: 3 },
          { icon: '🔍', name: 'Lenses', value: 'Canon EF 100mm f/2.8L Macro IS USM', order: 4 },
          { icon: '💡', name: 'Lighting', value: 'Softbox & Reflectors', order: 5 },
          { icon: '📍', name: 'Location', value: 'Studio', order: 6 },
          { icon: '📅', name: 'Time', value: 'January 2024', order: 7 }
        ],
        actionButton: {
          text: 'Commercial Inquiry',
          url: 'https://saeedseka.com/commercial-contact',
          enabled: true,
          style: 'secondary'
        },
        isPublished: true,
        isFeatured: false,
        viewCount: 156,
        likes: 87,
        location: 'Studio',
        eventDate: new Date('2024-01-25'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdBy: adminUser, // Link album to admin user
        title: 'Wild Wonders',
        description: 'Wildlife and nature photography passion project capturing natural beauty',
        projectGoal: 'To document and preserve the beauty of wildlife in their natural habitats, raising awareness about conservation while showcasing the incredible diversity of nature through powerful visual storytelling.',
        category: 'Wildlife & Nature',
        projectType: 'Passion Project',
        tags: ['Wildlife & Nature', 'Passion Project'],
        coverImage: {
          url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/wildlife/wild-wonders-cover.jpg',
          publicId: 'portfolio/wildlife/wild-wonders-cover',
          width: 1200,
          height: 800,
          alt: 'Wild Wonders wildlife photography cover'
        },
        images: [
          {
            url: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/wildlife/wild-1.jpg',
            publicId: 'portfolio/wildlife/wild-1',
            width: 1200,
            height: 800,
            alt: 'Wildlife in natural habitat',
            caption: 'Natural wonders of wildlife'
          }
        ],
        specifications: [
          { icon: '📂', name: 'Category', value: 'Wildlife & Nature', order: 1 },
          { icon: '❤️', name: 'Project Type', value: 'Passion Project', order: 2 },
          { icon: '📸', name: 'Camera', value: 'Nikon D850', order: 3 },
          { icon: '🔍', name: 'Lenses', value: 'Nikon AF-S 600mm f/4E FL ED VR', order: 4 },
          { icon: '🎒', name: 'Support', value: 'Gitzo Carbon Tripod', order: 5 },
          { icon: '📍', name: 'Location', value: 'Natural Reserves', order: 6 },
          { icon: '📅', name: 'Time', value: 'February 2024', order: 7 }
        ],
        actionButton: {
          text: 'Nature Prints',
          url: 'https://prints.saeedseka.com/wild-wonders',
          enabled: true,
          style: 'primary'
        },

        // YouTube video for wildlife project
        youtubeVideo: {
          videoId: 'nK96jdUfUJo',
          title: 'Wild Wonders - Nature Photography Adventure',
          description: 'Join me on an incredible wildlife photography adventure, capturing the raw beauty of nature and learning conservation-focused photography techniques.',
          thumbnail: 'https://img.youtube.com/vi/nK96jdUfUJo/maxresdefault.jpg',
          embedUrl: 'https://www.youtube.com/embed/nK96jdUfUJo',
          duration: '6:24'
        },

        isPublished: true,
        isFeatured: true,
        viewCount: 278,
        likes: 165,
        location: 'Natural Reserves',
        eventDate: new Date('2024-02-05'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('albums').insertMany(albums);
    console.log('✅ Albums seeded successfully');

    // Reviews - From website testimonials
    console.log('⭐ Seeding reviews...');
    const reviews = [
      {
        reviewedBy: adminUser, // Reviews are for the admin user (photographer)
        clientName: 'Michael T.',
        clientEmail: 'michael.t@stellardesigns.com',
        clientPhone: '+966 50 111 2222',
        clientAvatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/michael-avatar.jpg',
        rating: 5,
        title: 'Outstanding Product Photography',
        content: 'We are thrilled with the product photography provided by James. They captured our products beautifully, highlighting their unique features and enhancing their appeal.',
        projectType: 'Product Photography',
        eventDate: new Date('2024-01-20'),
        location: 'Stellar Designs Office',
        packageType: 'Commercial Photography Package',
        isApproved: true,
        isVisible: true,
        isFeatured: true,
        likes: 28,
        helpful: 24,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      },
      {
        reviewedBy: adminUser, // Reviews are for the admin user (photographer)
        clientName: 'Aurora Jensen',
        clientEmail: 'aurora.jensen@company.com',
        clientPhone: '+966 50 333 4444',
        clientAvatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/aurora-avatar.jpg',
        rating: 5,
        title: 'Exceptional Results',
        content: 'Thanks you, our product images have never looked better! They have a keen eye for detail and a talent for capturing our products in the best possible light. We couldn\'t be happier with the results!',
        projectType: 'Product Photography',
        eventDate: new Date('2024-02-10'),
        location: 'Company Studio',
        packageType: 'Marketing Director',
        isApproved: true,
        isVisible: true,
        isFeatured: true,
        likes: 22,
        helpful: 19,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
      },
      {
        reviewedBy: adminUser, // Reviews are for the admin user (photographer)
        clientName: 'G. Monroe',
        clientEmail: 'g.monroe@stellardesigns.com',
        clientPhone: '+966 50 555 6666',
        clientAvatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/monroe-avatar.jpg',
        rating: 5,
        title: 'Highly Recommended Photography Services',
        content: 'He provided exceptional product photography services for our latest collection. Their attention to detail and creative approach resulted in images that perfectly showcased our products. Highly recommended!',
        projectType: 'Product Photography',
        eventDate: new Date('2024-03-01'),
        location: 'Stellar Designs',
        packageType: 'Collection Photography',
        isApproved: true,
        isVisible: true,
        isFeatured: true,
        likes: 31,
        helpful: 27,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      },
      {
        reviewedBy: adminUser, // Reviews are for the admin user (photographer)
        clientName: 'Michael',
        clientEmail: 'michael@stellardesigns.com',
        clientPhone: '+966 50 777 8888',
        clientAvatar: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/clients/michael2-avatar.jpg',
        rating: 5,
        title: 'Fantastic Experience',
        content: 'It was a fantastic experience! They brought a level of professionalism and creativity to our product photography that truly set our brand apart. We look forward to working with them again in the future!',
        projectType: 'Brand Photography',
        eventDate: new Date('2024-03-15'),
        location: 'Stellar Designs HQ',
        packageType: 'Brand Photography Package',
        isApproved: true,
        isVisible: true,
        isFeatured: true,
        likes: 35,
        helpful: 31,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-20')
      }
    ];

    await db.collection('reviews').insertMany(reviews);
    console.log('✅ Reviews seeded successfully');

    // Sample Contacts
    console.log('📞 Seeding contacts...');
    const contacts = [
      {
        contactingUser: adminUser, // Contact is directed to admin user (photographer)
        name: 'Fahad Al-Mansour',
        email: 'fahad.almansour@email.com',
        phone: '+966 50 444 5566',
        subject: 'Corporate Photography Services',
        message: 'Hi Saeed! We need professional corporate photography for our new office in Riyadh. Could you provide information about your corporate packages?',
        preferredDate: new Date('2024-05-15'),
        budgetRange: '5000-8000 SAR',
        eventType: 'Corporate',
        guestCount: 50,
        venue: 'Corporate Office, Riyadh',
        status: 'new',
        priority: 'high',
        source: 'website',
        referralSource: 'Google Search',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        contactingUser: adminUser, // Contact is directed to admin user (photographer)
        name: 'Noura Al-Zahra',
        email: 'noura.alzahra@gmail.com',
        phone: '+966 55 111 2233',
        subject: 'Event Photography Inquiry',
        message: 'Hello! I am organizing a cultural event in Riyadh and would love to hire you for event photography. Please let me know your availability.',
        preferredDate: new Date('2024-06-20'),
        budgetRange: '3000-5000 SAR',
        eventType: 'Cultural Event',
        guestCount: 200,
        venue: 'Cultural Center, Riyadh',
        status: 'contacted',
        priority: 'medium',
        source: 'instagram',
        referralSource: 'Social Media',
        adminNotes: 'Interested in full event coverage.',
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-03-02')
      }
    ];

    await db.collection('contacts').insertMany(contacts);
    console.log('✅ Contacts seeded successfully');

    console.log('\n🎉 SAEED SEKKA PORTFOLIO DATA SEEDING COMPLETE!');
    console.log('=====================================================');
    console.log('✅ Users: 2 (Saeed Sekka admin & customer)');
    console.log('✅ Profile: Saeed Sekka - Riyadh, Saudi Arabia');
    console.log('✅ Experience: 4 positions (2010-Present)');
    console.log('✅ Services: Event, Aerial, Corporate, Editorial + Core Skills');
    console.log('✅ Albums: 5 collections (matching website)');
    console.log('✅ Reviews: 4 client testimonials (from website)');
    console.log('✅ FAQ: 9 questions (matching website)');
    console.log('✅ Contacts: 2 Saudi client inquiries');
    console.log('=====================================================');
    console.log('🔑 Admin Login: SaeedSekka@email.com / admin123');
    console.log('🔑 Customer Login: customer@example.com / customer123');
    console.log('📍 Location: Riyadh, Saudi Arabia');
    console.log('📞 Phone: +966-53-868-3923');
    console.log('🌐 Website: https://saeedseka.framer.website/');
    console.log('🚀 Portfolio ready - identical to reference website!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

seedEnhancedData(); 