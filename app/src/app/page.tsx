import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HeadingText, SubHeadingText } from "@/components/ui/typography";
import { DishCategoryWidget } from "@/components/widjets/dish-categories.widget";
import { Suspense } from "react";
import { HeroBanner } from "@/components/widjets/hero-banner";
import dynamicImport from "next/dynamic";
import { DishCategoryFeature } from "@/features/dish-category";
const ListDishes = dynamicImport(() => import("@/features/dish/list-dish"), {
  loading: () => (
    <div className="h-48 animate-pulse rounded-lg bg-neutral-200" />
  ),
});

export const dynamic = 'force-static'
export const revalidate = 1800

export async function generateMetadata() {
  return {
    title: 'Главная страница',
  }
}

export default function Home() {
  return (
    <Container>
      <Block1 />
      <div className="mt-8">
        <DishCategoryWidget />
      </div>
    </Container>
  );
}


function Block1() {
  return (
    <div className="relative mt-3 flex h-[550px] w-full items-center justify-start rounded-lg">
      <div className="absolute inset-0">
        <HeroBanner />
      </div>
      <div className="relative z-10 flex h-full w-full max-w-[70%] flex-col items-start justify-center gap-5 p-8 text-white md:max-w-[60%] lg:max-w-[45%] lg:px-[10%]">
        <HeadingText size="xl">Заказывайте свою любимую еду здесь</HeadingText>
        <SubHeadingText className="text-white/90">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam
          esse quasi cupiditate dolorum recusandae
        </SubHeadingText>
        <Button
          variant={"secondary"}
          size={"lg"}
          aria-label="Перейти к заказу еды"
        >
          Заказать
        </Button>
      </div>
    </div>
  );
}
