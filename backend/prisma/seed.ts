import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const servicesData = [
    {
      title: "Hair Styling",
      icon: "✂️",
      description: "Bespoke cuts and luxury styling to elevate your natural beauty.",
      price: "₹1,499",
    },
    {
      title: "Bridal Makeup",
      icon: "💄",
      description: "Flawless, long-lasting bridal looks crafted for your special day.",
      price: "₹15,000",
    },
    {
      title: "Skin Treatments",
      icon: "✨",
      description: "Advanced facials and skin therapies for a radiant glow.",
      price: "₹2,999",
    },
    {
      title: "Nail Art",
      icon: "💅",
      description: "Exquisite manicures with custom, intricate nail artistry.",
      price: "₹999",
    },
    {
      title: "Hair Coloring",
      icon: "🎨",
      description: "Premium coloring, balayage, and highlights by expert colorists.",
      price: "₹3,499",
    },
    {
      title: "Relaxing Spa",
      icon: "🌿",
      description: "Holistic massage and wellness therapies for ultimate relaxation.",
      price: "₹2,499",
    },
  ];

  console.log(`Start seeding ...`)
  for (const s of servicesData) {
    const service = await prisma.service.create({
      data: s,
    })
    console.log(`Created service with id: ${service.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
