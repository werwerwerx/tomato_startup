import Image from "next/image";

export const ImageUnkownSize = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <Image
    src={src}
    alt={alt}
    className={className}
    width={0}
    height={0}
    sizes="100vw"
  />
);
