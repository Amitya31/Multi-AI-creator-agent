// prisma/seed.ts
// import "dotenv/config";
// import { PrismaClient } from "../lib/generated/prisma";
// import { PrismaPg } from "@prisma/adapter-pg";

// if (!process.env.DATABASE_URL) {
//    console.error("❌ DATABASE_URL not set");
//   process.exit(1);
// }

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log("🌱 Seeding database...");

//   await prisma.$connect();
//   console.log("✅ Connected to DB");

//   const user = await prisma.user.upsert({
//     where: { email: "admin@example.com" },
//     update: {},
//     create: {
//       email: "admin@example.com",
//       name: "Admin User",
//       password: "ADMIN1234"
//     },
//   });

//   console.log("👤 User:", user.email);

//   const agents = [
//   { name: "outline", description: "Creates structured outlines", ownerId: user.id },
//   { name: "writer", description: "Writes long-form content", ownerId: user.id },
//   { name: "seo", description: "Optimizes content for SEO", ownerId: user.id },
//   { name: "title", description: "Generates titles", ownerId: user.id },
//   { name: "summarizer", description: "Summarizes content", ownerId: user.id },
// ];


//   const createdAgents = await Promise.all(
//     agents.map((agent) =>
//       prisma.agent.upsert({
//         where: { name: agent.name },
//         update: {
//           description: agent.description
//         },
//         create: {
//           name:agent.name,
//           description: agent.description,
//           ownerId: user.id
//         }
//       })
//     )
//   );

//   console.log("🤖 Agents:", createdAgents.map(a => a.name).join(", "));
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     console.log("🔌 Disconnected");
//   });

// import "dotenv/config";
// import { PrismaClient } from "../lib/generated/prisma";
// import { PrismaPg } from "@prisma/adapter-pg";

// if (!process.env.DATABASE_URL) {
//   console.error("❌ DATABASE_URL not set");
//   process.exit(1);
// }

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log("🌱 Seeding pricing plans...");

//   await prisma.pricingPlan.createMany({
//     data: [
//       {
//         name: "Starter",
//         priceUSD: 1000, // $10
//         credits: 10000,
//       },
//       {
//         name: "Pro",
//         priceUSD: 4000, // $40
//         credits: 50000,
//       },
//       {
//         name: "Growth",
//         priceUSD: 10000, // $100
//         credits: 150000,
//       },
//     ],
//     skipDuplicates: true, // 🔥 important
//   });

//   console.log("✅ Pricing plans seeded");
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });