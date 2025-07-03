import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Portfolio API (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let adminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider('MONGODB_URI')
    .useValue(mongoUri)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    app.setGlobalPrefix('api');
    
    await app.init();

    // Create test users
    await createTestUsers();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  const createTestUsers = async () => {
    // Register admin
    const adminRegister = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });

    // Register customer
    const customerRegister = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'customer@test.com',
        password: 'customer123',
        firstName: 'Customer',
        lastName: 'User',
        role: 'customer',
      });

    adminToken = adminRegister.body.access_token;
    customerToken = customerRegister.body.access_token;
  };

  describe('Authentication', () => {
    describe('/api/auth/register (POST)', () => {
      it('should register a new user', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'newuser@test.com',
            password: 'password123',
            firstName: 'New',
            lastName: 'User',
          })
          .expect(201);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('newuser@test.com');
      });

      it('should not register user with existing email', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'admin@test.com',
            password: 'password123',
            firstName: 'Another',
            lastName: 'Admin',
          })
          .expect(409);
      });
    });

    describe('/api/auth/login (POST)', () => {
      it('should login with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'admin123',
          })
          .expect(200);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
      });

      it('should not login with invalid credentials', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'wrongpassword',
          })
          .expect(401);
      });
    });
  });

  describe('CMS API (Admin Only)', () => {
    describe('/api/cms/profile (GET)', () => {
      it('should allow admin access', async () => {
        await request(app.getHttpServer())
          .get('/api/cms/profile')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
      });

      it('should deny customer access', async () => {
        await request(app.getHttpServer())
          .get('/api/cms/profile')
          .set('Authorization', `Bearer ${customerToken}`)
          .expect(403);
      });

      it('should deny unauthenticated access', async () => {
        await request(app.getHttpServer())
          .get('/api/cms/profile')
          .expect(401);
      });
    });

    describe('/api/cms/profile (POST)', () => {
      it('should create profile as admin', async () => {
        const profileData = {
          name: 'Test Photographer',
          title: 'Professional Photographer',
          bio: 'Test bio',
          email: 'photographer@test.com',
          specialties: ['Wedding', 'Portrait'],
        };

        const response = await request(app.getHttpServer())
          .post('/api/cms/profile')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(profileData)
          .expect(201);

        expect(response.body.name).toBe(profileData.name);
        expect(response.body.title).toBe(profileData.title);
      });
    });
  });

  describe('Website API (Public)', () => {
    describe('/api/website/profile/active (GET)', () => {
      it('should allow public access to active profile', async () => {
        await request(app.getHttpServer())
          .get('/api/website/profile/active')
          .expect(200);
      });
    });

    describe('/api/website/albums (GET)', () => {
      it('should allow public access to published albums', async () => {
        await request(app.getHttpServer())
          .get('/api/website/albums')
          .expect(200);
      });
    });

    describe('/api/website/contact (POST)', () => {
      it('should allow public contact form submission', async () => {
        const contactData = {
          name: 'John Contact',
          email: 'contact@test.com',
          subject: 'Test Inquiry',
          message: 'This is a test message',
        };

        const response = await request(app.getHttpServer())
          .post('/api/website/contact')
          .send(contactData)
          .expect(201);

        expect(response.body.name).toBe(contactData.name);
        expect(response.body.email).toBe(contactData.email);
      });
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger documentation', async () => {
      await request(app.getHttpServer())
        .get('/api/docs')
        .expect(301); // Redirect to docs page
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });
});
