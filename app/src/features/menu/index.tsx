import Link from "next/link";
import Image from "next/image";
import { getMenuItems } from "./api/get";
import { FlexRowSection } from "@/shared/components/container";
import { HTMLAttributes } from "react";

export const menuRoute = "/menu";

export const MenuList = async () => {
  const items = await getMenuItems();
  return (
    <FlexRowSection className="flex w-full flex-row flex-wrap gap-4">
      {items.map((item) => {
        if (!item.img_url) {
          return (
            <MenuItem
              key={item.name}
              name={item.name}
              img_url={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVLDP5s2j9u1x86fOb7kNKXanJeMn8zZ30ZQ&s"
              }
            />
          );
        }
        return (
          <MenuItem
            key={item.name}
            name={item.name}
            img_url={item.img_url}
          />
        );
      })}
    </FlexRowSection>
  );
};

const MenuItem = ({
  name,
  img_url,
  ...props
}: { name: string; img_url: string } & HTMLAttributes<HTMLAnchorElement>) => (
  <Link
    href={`${menuRoute}/${name}`}
    className="flex flex-col gap-2"
    {...props}
  >
    <div className="relative h-[200px] w-[200px] overflow-hidden rounded-lg border">
      <Image
        src={img_url}
        alt={name}
        fill
        className="object-cover"
        loading="lazy"
      />
    </div>
    <p className="font-xl font-medium text-neutral-600/50">{name}</p>
  </Link>
);
