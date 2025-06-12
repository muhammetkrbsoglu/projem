import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create category groups
  const occasionsGroup = await prisma.categoryGroup.create({
    data: {
      name: 'Occasions',
    },
  });

  const seasonsGroup = await prisma.categoryGroup.create({
    data: {
      name: 'Seasonal',
    },
  });

  // Create categories
  const weddingCategory = await prisma.category.create({
    data: {
      name: 'Wedding',
      groupId: occasionsGroup.id,
    },
  });

  const hennaCategory = await prisma.category.create({
    data: {
      name: 'Henna Night',
      groupId: occasionsGroup.id,
    },
  });

  const birthdayCategory = await prisma.category.create({
    data: {
      name: 'Birthday',
      groupId: occasionsGroup.id,
    },
  });

  const summerCategory = await prisma.category.create({
    data: {
      name: 'Summer',
      groupId: seasonsGroup.id,
    },
  });

  // Create sample products
  const products = await Promise.all([
    // Wedding Products
    prisma.product.create({
      data: {
        name: 'Elegant Wedding Photo Frame',
        price: 79.99,
        stock: 15,
        photoUrl: 'https://picsum.photos/seed/frame/400',
        categories: {
          connect: [{ id: weddingCategory.id }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Crystal Wedding Centerpiece',
        price: 129.99,
        stock: 8,
        photoUrl: 'https://picsum.photos/seed/crystal/400',
        categories: {
          connect: [{ id: weddingCategory.id }],
        },
      },
    }),

    // Henna Night Products
    prisma.product.create({
      data: {
        name: 'Traditional Henna Set',
        price: 45.99,
        stock: 20,
        photoUrl: 'https://picsum.photos/seed/henna/400',
        categories: {
          connect: [{ id: hennaCategory.id }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Decorative Henna Tray',
        price: 89.99,
        stock: 12,
        photoUrl: 'https://picsum.photos/seed/tray/400',
        categories: {
          connect: [{ id: hennaCategory.id }],
        },
      },
    }),

    // Birthday Products
    prisma.product.create({
      data: {
        name: 'Luxury Birthday Gift Box',
        price: 149.99,
        stock: 10,
        photoUrl: 'https://picsum.photos/seed/gift/400',
        categories: {
          connect: [{ id: birthdayCategory.id }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Personalized Birthday Frame',
        price: 59.99,
        stock: 25,
        photoUrl: 'https://picsum.photos/seed/personal/400',
        categories: {
          connect: [{ id: birthdayCategory.id }],
        },
      },
    }),

    // Summer Products
    prisma.product.create({
      data: {
        name: 'Summer Party Kit',
        price: 99.99,
        stock: 18,
        photoUrl: 'https://picsum.photos/seed/summer/400',
        categories: {
          connect: [{ id: summerCategory.id }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Beach Celebration Set',
        price: 79.99,
        stock: 15,
        photoUrl: 'https://picsum.photos/seed/beach/400',
        categories: {
          connect: [{ id: summerCategory.id }],
        },
      },
    }),
  ]);

  console.log('Database has been seeded with sample data!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
