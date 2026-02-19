require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Testing database connection...');

prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully!');
    return prisma.wallpaper.count();
  })
  .then(count => {
    console.log(`✅ Found ${count} wallpapers in database`);
    return prisma.slideshow.count();
  })
  .then(slideshowCount => {
    console.log(`✅ Found ${slideshowCount} slideshows in database`);
    return prisma.category.count();
  })
  .then(categoryCount => {
    console.log(`✅ Found ${categoryCount} categories in database`);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  })
  .finally(() => prisma.$disconnect());
