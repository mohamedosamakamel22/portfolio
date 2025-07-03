import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfileService } from '../profile/profile.service';
import { ReviewsService } from '../reviews/reviews.service';
import { AlbumsService } from '../albums/albums.service';
import { ContactService } from '../contact/contact.service';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { Contact, ContactDocument, ContactStatus, ContactType } from '../schemas/contact.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly reviewsService: ReviewsService,
    private readonly albumsService: AlbumsService,
    private readonly contactService: ContactService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async seedProfile() {
    try {
      const profileData = {
        name: 'Saeed Sekka',
        title: 'Professional Photographer',
        bio: 'I am a passionate photographer dedicated to capturing life\'s most precious moments. With a keen eye for detail and a love for storytelling, I strive to create images that are not just beautiful, but that also evoke emotion and tell a compelling story.',
        email: 'SaeedSekka@email.com',
        phone: '+966-53-868-3923',
        address: 'Riyadh, Saudi Arabia',
        stats: [
          { key: 'hoursExperience', value: 5000 },
          { key: 'yearsExperience', value: 12 },
          { key: 'awards', value: 15 },
          { key: 'happyClients', value: 200 },
        ],
        specialties: ['Photography', 'Photo Editing', 'Designer'],
        services: [
          'Event Photography',
          'Aerial Photography',
          'Corporate Photography',
          'Editorial Photography',
          'Portrait Photography',
          'Product Photography'
        ],
        pricing: {
          portraitSessions: 200,
          eventPhotography: 500,
          commercialRates: 'Customized based on project scope',
        },
        socialMedia: {
          instagram: 'https://instagram.com/saedsekka',
          facebook: 'https://facebook.com/saedsekka',
          twitter: 'https://twitter.com/saedsekka',
          linkedin: 'https://linkedin.com/in/saedsekka',
        },
        experience: [
          {
            company: 'Clavmen Studio',
            position: 'Senior UX Designer',
            startDate: new Date('2022-01-01'),
            endDate: undefined,
            isPresent: true,
            description: 'Clavmen inspires creativity and makes learning piano fun. The sleek, lightweight body fits easily into gig bags for portability.',
            location: 'New York, USA',
            employmentType: 'Full-time',
            achievements: [
              'Led UX design for 5+ major projects',
              'Increased user engagement by 40%',
              'Mentored 3 junior designers'
            ]
          },
          {
            company: 'Losify',
            position: 'Lead Product Designer',
            startDate: new Date('2013-01-01'),
            endDate: new Date('2022-01-01'),
            isPresent: false,
            description: 'Fitness and well-being with personalized coaching and innovative wellness solutions.',
            location: 'San Francisco, USA',
            employmentType: 'Full-time',
            achievements: [
              'Redesigned core product interface',
              'Led team of 6 designers',
              'Launched 10+ successful features'
            ]
          },
          {
            company: 'Gamadias',
            position: 'Junior UX Designer',
            startDate: new Date('2012-01-01'),
            endDate: new Date('2013-01-01'),
            isPresent: false,
            description: 'Gaming Experiences with Innovative Technology and Unparalleled Performance.',
            location: 'Los Angeles, USA',
            employmentType: 'Full-time',
            achievements: [
              'Designed UI for gaming peripherals',
              'Collaborated with hardware teams',
              'Created design system'
            ]
          },
          {
            company: 'Freelance',
            position: 'Web Designer',
            startDate: new Date('2010-01-01'),
            endDate: new Date('2012-01-01'),
            isPresent: false,
            description: 'Bringing creativity, technical expertise, and a passion for design to every project.',
            location: 'Remote',
            employmentType: 'Freelance',
            achievements: [
              'Completed 50+ web design projects',
              'Built client base of 30+ companies',
              'Specialized in e-commerce design'
            ]
          },
        ],
        faq: [
          {
            question: 'How do I book a photography session with you?',
            answer: 'You can book a session by filling out the contact form on my website or by emailing me directly at SaeedSekka@email.com. I\'ll get back to you within 24 hours to discuss the details and schedule your shoot.',
          },
          {
            question: 'What are your rates for photography sessions?',
            answer: 'Portrait sessions start at $200. Event photography starts at $500. Commercial and product photography pricing is customized based on the project scope.',
          },
          {
            question: 'What does your pricing include?',
            answer: 'Pre-shoot consultation. The photography session. Professional editing of selected images. A set number of high-resolution digital images. Online gallery for viewing and downloading photos.',
          },
          {
            question: 'What types of photography do you specialize in?',
            answer: 'I specialize in a variety of photography services including portrait, travel, commercial, product, event, and landscape photography. Check out my portfolio to see examples of my work.',
          },
        ],
        isActive: true,
      };

      const profile = await this.profileService.create(profileData);
      console.log('✅ Profile seeded successfully');
      return profile;
    } catch (error) {
      console.error('❌ Error seeding profile:', error.message);
    }
  }

  async seedReviews() {
    try {
      const reviewsData = [
        {
          clientName: 'Michael T.',
          clientTitle: 'Marketing Manager',
          company: 'Stellar Designs',
          review: 'We are thrilled with the product photography provided by Saeed. They captured our products beautifully, highlighting their unique features and enhancing their appeal.',
          rating: 5,
          isVisible: true,
          isFeatured: true,
          projectType: 'Product Photography',
          serviceUsed: 'Product Photography',
        },
        {
          clientName: 'Aurora Jensen',
          clientTitle: 'Marketing Director',
          company: 'Creative Agency',
          review: 'Thanks you, our product images have never looked better! They have a keen eye for detail and a talent for capturing our products in the best possible light. We couldn\'t be happier with the results!',
          rating: 5,
          isVisible: true,
          isFeatured: true,
          projectType: 'Product Photography',
          serviceUsed: 'Product Photography',
        },
        {
          clientName: 'G. Monroe',
          clientTitle: 'Marketing Manager',
          company: 'Stellar Designs',
          review: 'He provided exceptional product photography services for our latest collection. Their attention to detail and creative approach resulted in images that perfectly showcased our products. Highly recommended!',
          rating: 5,
          isVisible: true,
          isFeatured: false,
          projectType: 'Product Photography',
          serviceUsed: 'Product Photography',
        },
        {
          clientName: 'Michael',
          clientTitle: 'MD',
          company: 'Stellar Designs',
          review: 'It was a fantastic experience! They brought a level of professionalism and creativity to our product photography that truly set our brand apart. We look forward to working with them again in the future!',
          rating: 5,
          isVisible: true,
          isFeatured: false,
          projectType: 'Product Photography',
          serviceUsed: 'Product Photography',
        },
      ];

      for (const reviewData of reviewsData) {
        await this.reviewsService.create(reviewData);
      }
      console.log('✅ Reviews seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding reviews:', error.message);
    }
  }

  async seedAlbums() {
    try {
      const albumsData = [
        {
          title: 'Colorful India',
          description: 'A vibrant journey through India\'s rich culture and stunning landscapes',
          category: 'Travel',
          projectType: 'Collaboration',
          tags: ['travel', 'culture', 'india', 'colorful'],
          isPublished: true,
          isFeatured: true,
          sortOrder: 1,
        },
        {
          title: 'Echoes of Dreams',
          description: 'Conceptual photography exploring the realm of dreams and imagination',
          category: 'Conceptual',
          projectType: 'Commercial',
          tags: ['conceptual', 'dreams', 'artistic'],
          isPublished: true,
          isFeatured: true,
          sortOrder: 2,
        },
        {
          title: 'Wings of Freedom',
          description: 'Aerial photography capturing breathtaking landscapes from above',
          category: 'Aerial & Drone',
          projectType: 'Passion Project',
          tags: ['aerial', 'drone', 'landscape', 'freedom'],
          isPublished: true,
          isFeatured: false,
          sortOrder: 3,
        },
        {
          title: 'Crafted Perfection',
          description: 'Product photography showcasing exquisite craftsmanship',
          category: 'Product',
          projectType: 'Commercial',
          tags: ['product', 'commercial', 'craftsmanship'],
          isPublished: true,
          isFeatured: false,
          sortOrder: 4,
        },
        {
          title: 'Wild Wonders',
          description: 'Wildlife photography capturing nature\'s most magnificent creatures',
          category: 'Wildlife & Nature',
          projectType: 'Passion Project',
          tags: ['wildlife', 'nature', 'animals', 'conservation'],
          isPublished: true,
          isFeatured: false,
          sortOrder: 5,
        },
      ];

      for (const albumData of albumsData) {
        await this.albumsService.create(albumData);
      }
      console.log('✅ Albums seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding albums:', error.message);
    }
  }

  async seedUsers() {
    try {
      // Check if admin user exists
      const existingAdmin = await this.userModel.findOne({ email: 'admin@portfolio.com' });
      if (existingAdmin) {
        console.log('✅ Admin user already exists');
        return;
      }

      const adminPassword = await bcrypt.hash('admin123', 12);
      const customerPassword = await bcrypt.hash('customer123', 12);

      const usersData = [
        {
          email: 'admin@portfolio.com',
          password: adminPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
          isActive: true,
          isEmailVerified: true,
        },
        {
          email: 'customer@example.com',
          password: customerPassword,
          firstName: 'John',
          lastName: 'Customer',
          role: UserRole.CUSTOMER,
          isActive: true,
          isEmailVerified: true,
        },
        {
          email: 'jane.customer@example.com',
          password: customerPassword,
          firstName: 'Jane',
          lastName: 'Smith',
          role: UserRole.CUSTOMER,
          isActive: true,
          isEmailVerified: true,
        },
      ];

      for (const userData of usersData) {
        const user = new this.userModel(userData);
        await user.save();
      }
      console.log('✅ Users seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding users:', error.message);
    }
  }

  async seedContacts() {
    try {
      const contactsData = [
        {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+1-555-0101',
          subject: 'Wedding Photography Inquiry',
          message: 'Hi! I\'m planning my wedding for June 2024 and would love to discuss your photography services. We\'re looking for someone who can capture both candid moments and formal portraits.',
          type: ContactType.BOOKING,
          status: ContactStatus.NEW,
          eventDate: new Date('2024-06-15'),
          eventLocation: 'Riyadh, Saudi Arabia',
          budget: '$2000-$3000',
          serviceType: 'Wedding Photography',
          preferredContactMethod: 'email',
        },
        {
          name: 'Michael Brown',
          email: 'michael@techstart.com',
          phone: '+1-555-0202',
          subject: 'Corporate Event Photography',
          message: 'We need a photographer for our annual tech conference. The event will have 200+ attendees and we need both event coverage and professional headshots.',
          type: ContactType.BOOKING,
          status: ContactStatus.IN_PROGRESS,
          eventDate: new Date('2024-08-20'),
          eventLocation: 'Jeddah, Saudi Arabia',
          budget: '$1500-$2500',
          serviceType: 'Corporate Photography',
          preferredContactMethod: 'phone',
          adminNotes: 'Called client - very interested. Scheduled follow-up call for Monday.',
          respondedAt: new Date(),
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah@creativeagency.com',
          subject: 'Product Photography for E-commerce',
          message: 'We have a new line of handcrafted jewelry that needs professional product photography for our online store. Looking for clean, modern shots with lifestyle elements.',
          type: ContactType.QUOTE,
          status: ContactStatus.RESOLVED,
          serviceType: 'Product Photography',
          budget: '$800-$1200',
          adminNotes: 'Project completed successfully. Client very satisfied with results.',
          respondedAt: new Date('2024-01-15'),
        },
        {
          name: 'David Chen',
          email: 'david@startup.co',
          phone: '+1-555-0404',
          subject: 'Team Photography',
          message: 'Our startup needs professional team photos for our website and marketing materials. We have 12 team members and want both group shots and individual portraits.',
          type: ContactType.GENERAL,
          status: ContactStatus.NEW,
          serviceType: 'Portrait Photography',
          budget: '$500-$800',
          preferredContactMethod: 'email',
        },
        {
          name: 'Lisa Rodriguez',
          email: 'lisa@eventplanning.com',
          subject: 'Partnership Opportunity',
          message: 'I run an event planning company and I\'m interested in establishing a partnership. We frequently need photographers for weddings, corporate events, and parties.',
          type: ContactType.COLLABORATION,
          status: ContactStatus.IN_PROGRESS,
          adminNotes: 'Interesting partnership opportunity. Scheduled meeting for next week.',
          respondedAt: new Date(),
        },
      ];

      for (const contactData of contactsData) {
        await this.contactService.create(contactData);
      }
      console.log('✅ Contacts seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding contacts:', error.message);
    }
  }

  async seedAll() {
    console.log('🌱 Starting database seeding...');
    await this.seedUsers();
    await this.seedProfile();
    await this.seedReviews();
    await this.seedAlbums();
    await this.seedContacts();
    console.log('🎉 Database seeding completed!');
    console.log('');
    console.log('📧 Admin Login: admin@portfolio.com / admin123');
    console.log('📧 Customer Login: customer@example.com / customer123');
    console.log('📚 API Documentation: http://localhost:3000/api/docs');
  }
} 