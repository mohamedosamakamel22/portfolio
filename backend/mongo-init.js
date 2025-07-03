// MongoDB initialization script
db = db.getSiblingDB('portfolio');

// Create an admin user
db.users.insertOne({
  email: 'admin@portfolio.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvQ7r5KEw0OJ/WS', // password: admin123
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.profiles.createIndex({ isActive: 1 });
db.reviews.createIndex({ isVisible: 1, isFeatured: 1 });
db.albums.createIndex({ isPublished: 1, isFeatured: 1 });
db.albums.createIndex({ category: 1 });
db.contacts.createIndex({ status: 1 });
db.contacts.createIndex({ createdAt: -1 });

print('Database initialization completed successfully!');
print('Default admin user created: admin@portfolio.com / admin123'); 