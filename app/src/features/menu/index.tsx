import Link from "next/link";
import Image from "next/image";
import { getMenuItems } from "./categories.repository";
import { FlexRowSection } from "@/shared/components/container";
import { HTMLAttributes } from "react";
import { MenuRowSlider } from "./ui/menu-slider";
import { cn } from "@/shared/lib/utils";

export const menuRoute = "/menu";

export const MenuList = async ({...props}: HTMLAttributes<HTMLDivElement>) => {
  const items = await getMenuItems();
  return (
    <div className={cn("w-full flex justify-center items-center mt-5", props.className)} {...props}>
      <MenuRowSlider items={items.map((item) => ({
        name: item.name,
        img_url: item.img_url || ""
      }))} />
    </div>
  );
};

