import {
  Container,
  FlexColSection,
  FlexRowSection,
} from "@/shared/components/container";
import { BlockHeading } from "@/shared/components/main-heading-slider";
import { Button } from "@/shared/components/ui-kit/button";
import { ArrowDown } from "lucide-react";
import { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import { MenuList } from "@/features/menu";

export const dynamic = "force-static";
export const revalidate = 60 * 60 * 5;

export async function generateMetadata() {
  return {
    title: "Главная страница",
    description: "Главная страница сайта томато вкусная еда",
  };
}

export default function Home() {
  return (
    <>
      <BlockHeading className="h-[30vh] md:h-[50vh] lg:h-[70vh]">
        <FlexColSection
          className="h-full justify-center gap-6 px-10 md:items-start"
          id="heading-section"
        >
          <div className="flex flex-col gap-4 rounded-lg text-white md:w-2/3">
            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl">
              Заказывайте свою любимую еду здесь!
            </h1>
            <div className="hidden md:block lg:text-xl">
              <h2 className="text-md font-medium">
                Наша миссия - создавать продукты используя наиболее качественные
                ингредиенты.{" "}
                <span className="">Попробуйте наши блюда</span> и
                оцените качество!
              </h2>
            </div>
          </div>
          <div className="flex w-full">
            <Button variant="secondary" size="lg" className="">
              <ArrowDown />
              <span>Подробнее</span>
            </Button>
          </div>
        </FlexColSection>
      </BlockHeading>

      <FlexColSection
        className="h-full justify-center gap-4 md:hidden"
        id="mission-section"
      >
        <div className="flex flex-col gap-2 rounded-lg">
          <HeadingH>Наша миссия - </HeadingH>
          <HeadingP>
            это создавать продукты используя наиболее качественные ингредиенты.{" "}
            Попробуйте наши блюда и оцените
            качество!
          </HeadingP>
          <div className="h-[1px] w-full bg-gray-300"></div>
        </div>
      </FlexColSection>

      <FlexColSection className="mt-5 h-full">
        <HeadingH>Исследуйте наше меню</HeadingH>
        <HeadingP>
          Наша миссия - создавать продукты используя наиболее качественные
          ингредиенты. <span className="font-bold">Попробуйте наши блюда</span>{" "}
          и оцените качество!
        </HeadingP>
        <MenuList />
      </FlexColSection>
    </>
  );
}

const HeadingH = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
  return (
    <h1
      className={cn("text-2xl font-bold md:text-3xl lg:text-4xl", className)}
      {...props}
    >
      {children}
    </h1>
  );
};

const HeadingP = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
  return (
    <p
      className={cn("text-md text-foreground/80 font-medium", className)}
      {...props}
    >
      {children}
    </p>
  );
};
