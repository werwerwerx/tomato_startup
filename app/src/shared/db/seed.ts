import db from "@/shared/db";
import { categories_table, dishes_table, img_table } from "@/shared/db/schema";

const menu_items = [
  { name: "Салаты", imagePath: "/menu_1.png" },
  { name: "Роллы", imagePath: "/menu_2.png" },
  { name: "Десерты", imagePath: "/menu_3.png" },
  { name: "Сэндвичи", imagePath: "/menu_4.png" },
  { name: "Торты", imagePath: "/menu_5.png" },
  { name: "Вегетарианское", imagePath: "/menu_6.png" },
  { name: "Паста", imagePath: "/menu_7.png" },
  { name: "Лапша", imagePath: "/menu_8.png" }
];

const dishes = [
  {
    _id: "1",
    name: "Греческий салат",
    image: "/food_1.png",
    price: 120,
    description: "Свежий салат с оливками, сыром фета и овощами",
    category: "Салаты"
  },
  {
    _id: "2",
    name: "Овощной салат",
    image: "/food_2.png",
    price: 180,
    description: "Легкий салат из свежих сезонных овощей",
    category: "Салаты"
  },
  {
    _id: "29",
    name: "Лапша с маслом",
    image: "/food_29.png",
    price: 140,
    description: "Нежная лапша с сливочным маслом",
    category: "Лапша"
  },
  {
    _id: "3",
    name: "Клеверный салат",
    image: "/food_3.png",
    price: 160,
    description: "Свежий салат с клевером и полезными травами",
    category: "Салаты"
  },
  {
    _id: "4",
    name: "Куриный салат",
    image: "/food_4.png",
    price: 240,
    description: "Сытный салат с куриным филе и свежими овощами",
    category: "Салаты"
  },
  {
    _id: "5",
    name: "Роллы с лазаньей",
    image: "/food_5.png",
    price: 140,
    description: "Необычные роллы с начинкой как в лазанье",
    category: "Роллы"
  },
  {
    _id: "6",
    name: "Роллы Пери-Пери",
    image: "/food_6.png",
    price: 120,
    description: "Острые роллы в соусе пери-пери",
    category: "Роллы"
  },
  {
    _id: "7",
    name: "Куриные роллы",
    image: "/food_7.png",
    price: 200,
    description: "Классические роллы с курицей",
    category: "Роллы"
  },
  {
    _id: "8",
    name: "Вегетарианские роллы",
    image: "/food_8.png",
    price: 150,
    description: "Роллы с овощами и тофу",
    category: "Роллы"
  },
  {
    _id: "9",
    name: "Мороженое Рипл",
    image: "/food_9.png",
    price: 140,
    description: "Нежное мороженое с фруктовым рипл-соусом",
    category: "Десерты"
  },
  {
    _id: "10",
    name: "Фруктовое мороженое",
    image: "/food_10.png",
    price: 220,
    description: "Освежающее мороженое из натуральных фруктов",
    category: "Десерты"
  },
  {
    _id: "11",
    name: "Мороженое в банке",
    image: "/food_11.png",
    price: 100,
    description: "Оригинальная подача мороженого в стеклянной банке",
    category: "Десерты"
  },
  {
    _id: "12",
    name: "Ванильное мороженое",
    image: "/food_12.png",
    price: 120,
    description: "Классическое ванильное мороженое",
    category: "Десерты"
  },
  {
    _id: "13",
    name: "Куриный сэндвич",
    image: "/food_13.png",
    price: 120,
    description: "Сочный сэндвич с куриным филе",
    category: "Сэндвичи"
  },
  {
    _id: "14",
    name: "Веганский сэндвич",
    image: "/food_14.png",
    price: 180,
    description: "Полезный сэндвич с растительными ингредиентами",
    category: "Сэндвичи"
  },
  {
    _id: "15",
    name: "Гриль сэндвич",
    image: "/food_15.png",
    price: 160,
    description: "Горячий сэндвич с овощами гриль",
    category: "Сэндвичи"
  },
  {
    _id: "16",
    name: "Хлебный сэндвич",
    image: "/food_16.png",
    price: 240,
    description: "Классический сэндвич на свежем хлебе",
    category: "Сэндвичи"
  },
  {
    _id: "17",
    name: "Капкейк",
    image: "/food_17.png",
    price: 140,
    description: "Нежный кекс с кремом",
    category: "Торты"
  },
  {
    _id: "18",
    name: "Веганский торт",
    image: "/food_18.png",
    price: 120,
    description: "Торт без продуктов животного происхождения",
    category: "Торты"
  },
  {
    _id: "19",
    name: "Торт Баттерскотч",
    image: "/food_19.png",
    price: 200,
    description: "Сливочный торт с карамельным вкусом",
    category: "Торты"
  },
  {
    _id: "20",
    name: "Нарезной торт",
    image: "/food_20.png",
    price: 150,
    description: "Порционный торт на выбор",
    category: "Торты"
  },
  {
    _id: "21",
    name: "Грибы с чесноком",
    image: "/food_21.png",
    price: 140,
    description: "Ароматные грибы в чесночном соусе",
    category: "Вегетарианское"
  },
  {
    _id: "22",
    name: "Жареная цветная капуста",
    image: "/food_22.png",
    price: 220,
    description: "Хрустящая цветная капуста во фритюре",
    category: "Вегетарианское"
  },
  {
    _id: "23",
    name: "Овощной плов",
    image: "/food_23.png",
    price: 100,
    description: "Ароматный рис с овощами",
    category: "Вегетарианское"
  },
  {
    _id: "24",
    name: "Рис с цукини",
    image: "/food_24.png",
    price: 120,
    description: "Легкое блюдо из риса с цукини",
    category: "Вегетарианское"
  },
  {
    _id: "25",
    name: "Сырная паста",
    image: "/food_25.png",
    price: 120,
    description: "Паста в сливочно-сырном соусе",
    category: "Паста"
  },
  {
    _id: "26",
    name: "Томатная паста",
    image: "/food_26.png",
    price: 180,
    description: "Паста в соусе из свежих томатов",
    category: "Паста"
  },
  {
    _id: "27",
    name: "Сливочная паста",
    image: "/food_27.png",
    price: 160,
    description: "Паста в нежном сливочном соусе",
    category: "Паста"
  },
  {
    _id: "28",
    name: "Паста с курицей",
    image: "/food_28.png",
    price: 240,
    description: "Паста с куриным филе в сливочном соусе",
    category: "Паста"
  },
  {
    _id: "30",
    name: "Овощная лапша",
    image: "/food_30.png",
    price: 120,
    description: "Лапша с сезонными овощами",
    category: "Лапша"
  },
  {
    _id: "31",
    name: "Лапша Сомен",
    image: "/food_31.png",
    price: 200,
    description: "Традиционная японская пшеничная лапша",
    category: "Лапша"
  },
  {
    _id: "32",
    name: "Вареная лапша",
    image: "/food_32.png",
    price: 150,
    description: "Классическая лапша с соусом на выбор",
    category: "Лапша"
  }
];

async function seed() {
  try {
    await db.delete(dishes_table);
    await db.delete(categories_table);
    await db.delete(img_table);
    
    console.log("🧹 Таблицы очищены");

    const allImages = [
      ...menu_items.map(item => item.imagePath),
      ...dishes.map(dish => dish.image)
    ];

    const uniqueImages = Array.from(new Set(allImages));
    const imgRows = await Promise.all(uniqueImages.map(imagePath => 
      db.insert(img_table).values({
        url: imagePath,
      }).returning({ id: img_table.id, url: img_table.url })
    ));

    const imageUrlToId = Object.fromEntries(
      imgRows.map(row => [row[0].url, row[0].id])
    );

    const categoryRows = await Promise.all(menu_items.map(item => 
      db.insert(categories_table).values({
        name: item.name,
        imgId: imageUrlToId[item.imagePath],
      }).returning({ id: categories_table.id, name: categories_table.name })
    ));

    const categoryNameToId = Object.fromEntries(
      categoryRows.map(row => [row[0].name, row[0].id])
    );
    await Promise.all(dishes.map(dish =>
      db.insert(dishes_table).values({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        imgId: imageUrlToId[dish.image],
        categoryId: categoryNameToId[dish.category],
      })
    ));

    console.log("✅ Данные успешно загружены");
    process.exit(0);

  } catch (error) {
    console.error("❌ Ошибка при загрузке данных:", error);
    process.exit(1);
  }
}

seed();