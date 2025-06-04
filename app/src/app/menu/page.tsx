import { Container, FlexColSection, FlexRowSection } from "@/shared/components/container";
import { cn } from "@/shared/lib/utils";
import { BannersCarousel } from "@/shared/components/banners-carousel";
import { MenuListTopBar } from "@/features/menu";
import { getMenuItems } from "@/features/menu/categories.repository";
import { DishCard } from "@/features/dishes/dish-card";
import { getCatalog } from "@/features/shared/catalog/catalog.repository";

export const dynamic = "force-static";
export const revalidate = 60 * 60 * 5;

export async function generateMetadata() {
  return {
    title: "Меню",
    description: "Меню сайта томато вкусная еда",
  };
}
export default async function Menu() {
  const items = await getCatalog();
  return (
    <FlexColSection className="items-start">
          <BannersCarousel />
          <MenuListTopBar items={items.map((item) => {
            return {
              id: item.id,
              name: item.name,
              img_url: item.img_url,
            }
          })} />

          {items.map((item) => (
            <FlexColSection key={item.id} id={item.name}>
              <h1 className="font-extrabold text-2xl">{item.name}</h1>
              <FlexRowSection>
                {item.dishes.map((dish) => (
                  <DishCard key={dish.id} id={dish.id} name={dish.name} description={dish.description} price={dish.price} image={dish.img_url} index={0} />
                ))}
              </FlexRowSection>
            </FlexColSection>
          ))}

    </FlexColSection>
  );
}





