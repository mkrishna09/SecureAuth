import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const users = [
    {
      email: "admin@example.com",
      name: "Admin",
      role: Role.ADMIN,
    },
    {
      email: "moderator@example.com",
      name: "Moderator",
      role: Role.MODERATOR,
    },
    {
      email: "user@example.com",
      name: "User",
      role: Role.USER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });