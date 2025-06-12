const { PrismaClient } = require('@prisma/client');

let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma client. Try running "prisma generate" first.');
  process.exit(1);
}

async function main() {
  try {
    // Find existing user and make them admin
    const users = await prisma.user.findMany({
      take: 1
    });
    
    if (users.length === 0) {
      console.error('No users found in the database');
      process.exit(1);
    }    const user = await prisma.user.update({
      where: { id: users[0].id },
      data: { role: 'admin' }
    });
    
    console.log('User promoted to admin:', user);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
