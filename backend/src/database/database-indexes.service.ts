import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseIndexesService implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    await this.createIndexes();
  }

  private async createIndexes() {
    try {
      const db = this.connection.db;
      if (!db) {
        console.error('❌ Database connection not available');
        return;
      }

      // User collection indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ role: 1 });
      await db.collection('users').createIndex({ isActive: 1 });
      await db.collection('users').createIndex({ createdAt: -1 });

      // Profile collection indexes
      await db.collection('profiles').createIndex({ isActive: 1 });
      await db.collection('profiles').createIndex({ email: 1 });
      await db.collection('profiles').createIndex({ specialties: 1 });
      await db.collection('profiles').createIndex({ 'services.name': 1 });

      // Album collection indexes
      await db.collection('albums').createIndex({ isPublished: 1 });
      await db.collection('albums').createIndex({ isFeatured: 1 });
      await db.collection('albums').createIndex({ category: 1 });
      await db.collection('albums').createIndex({ projectType: 1 });
      await db.collection('albums').createIndex({ tags: 1 });
      await db.collection('albums').createIndex({ sortOrder: 1 });
      await db.collection('albums').createIndex({ createdAt: -1 });
      await db.collection('albums').createIndex({ viewCount: -1 });
      await db.collection('albums').createIndex(
        { title: 'text', description: 'text', tags: 'text' },
        { name: 'search_index' }
      );

      // Review collection indexes
      await db.collection('reviews').createIndex({ isVisible: 1 });
      await db.collection('reviews').createIndex({ isFeatured: 1 });
      await db.collection('reviews').createIndex({ rating: 1 });
      await db.collection('reviews').createIndex({ serviceUsed: 1 });
      await db.collection('reviews').createIndex({ projectType: 1 });
      await db.collection('reviews').createIndex({ createdAt: -1 });
      await db.collection('reviews').createIndex({ clientEmail: 1 });

      // Contact collection indexes
      await db.collection('contacts').createIndex({ status: 1 });
      await db.collection('contacts').createIndex({ type: 1 });
      await db.collection('contacts').createIndex({ email: 1 });
      await db.collection('contacts').createIndex({ createdAt: -1 });
      await db.collection('contacts').createIndex({ isArchived: 1 });
      await db.collection('contacts').createIndex({ eventDate: 1 });

      // Compound indexes for common queries
      await db.collection('albums').createIndex({ isPublished: 1, isFeatured: 1 });
      await db.collection('albums').createIndex({ isPublished: 1, category: 1 });
      await db.collection('albums').createIndex({ isPublished: 1, projectType: 1 });
      await db.collection('reviews').createIndex({ isVisible: 1, isFeatured: 1 });
      await db.collection('reviews').createIndex({ isVisible: 1, rating: -1 });
      await db.collection('contacts').createIndex({ status: 1, createdAt: -1 });

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating database indexes:', error);
    }
  }
} 