import db from "@/shared/db";
import { menu_table, img_table } from "@/shared/db/schema";

const menu_items = [
  { name: "Salad", imagePath: "/menu_1.png" },
  { name: "Rolls", imagePath: "/menu_2.png" },
  { name: "Deserts", imagePath: "/menu_3.png" },
  { name: "Sandwich", imagePath: "/menu_4.png" },
  { name: "Cake", imagePath: "/menu_5.png" },
  { name: "Pure Veg", imagePath: "/menu_6.png" },
  { name: "Pasta", imagePath: "/menu_7.png" },
  { name: "Noodles", imagePath: "/menu_8.png" }
];

async function seed() {
  try {
    const imgRows = await Promise.all(menu_items.map(item => 
      db.insert(img_table).values({
        url: item.imagePath,
      }).returning({ id: img_table.id }).onConflictDoUpdate({
        target: [img_table.url],
        set: {
          url: item.imagePath,
        }
      })
    ));

    const imgIds = imgRows.map(row => row[0]?.id);

    const menuPromises = menu_items.map((item, index) => 
      db.insert(menu_table).values({
        name: item.name,
        imgId: imgIds[index],
      }).onConflictDoUpdate({
        target: [menu_table.name],
        set: {
          imgId: imgIds[index],
        }
      })
    );

    await Promise.all(menuPromises);
    console.log("✅ Menu items seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();