import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const logger = new Logger('Bootstrap');
  
  // Security middleware - helmet for security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Disable for Swagger UI
  }));
  
  // Performance middleware - compression
  app.use(compression());
  
  // Request logging middleware
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.log(message.trim());
      },
    },
  }));
  
  // Enable CORS for ALL domains (as requested)
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Enable global validation with performance optimizations
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
    validateCustomDecorators: true,
  }));

  // Enable global request/response logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  // Additional performance configurations
  app.use((req, res, next) => {
    // Add performance headers
    res.setHeader('X-Powered-By', 'NestJS Portfolio API');
    res.setHeader('X-Response-Time-Start', Date.now().toString());
    
    // Cache control for static resources
    if (req.url.includes('/api/docs') || req.url.includes('/swagger')) {
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache for docs
    }
    
    next();
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Photography Portfolio CMS API')
    .setDescription('Complete backend API for photography portfolio management with CMS and public website endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('CMS - Profile Management', 'Admin-only profile management')
    .addTag('CMS - Reviews Management', 'Admin-only reviews management')
    .addTag('CMS - Albums Management', 'Admin-only albums management')
    .addTag('CMS - Contact Management', 'Admin-only contact inquiries management')
    .addTag('Website - Public Profile', 'Public access to profile data')
    .addTag('Website - Public Reviews', 'Public access to reviews')
    .addTag('Website - Public Albums', 'Public access to albums')
    .addTag('Website - Contact Form', 'Public contact form submission')
    .addTag('Media Upload', 'File upload endpoints for images and videos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log('🚀 Portfolio API is running with optimizations:');
  logger.log(`📍 Server: http://localhost:${port}/api`);
  logger.log(`📚 Swagger Documentation: http://localhost:${port}/api/docs`);
  logger.log(`📧 Default Admin: admin@portfolio.com / admin123`);
  logger.log(`🌍 MongoDB: ${process.env.MONGODB_URI?.includes('cluster0') ? 'Connected to Cloud Atlas' : 'Local/Custom'}`);
  logger.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_URL?.includes('egyptismycountry') ? 'Connected' : 'Custom'}`);
  logger.log('🔧 Performance Optimizations:');
  logger.log('   ✅ Compression enabled');
  logger.log('   ✅ Security headers (helmet)');
  logger.log('   ✅ Request logging (morgan)');
  logger.log('   ✅ CORS enabled for all domains');
  logger.log('   ✅ JWT tokens with no expiration');
}
bootstrap();
