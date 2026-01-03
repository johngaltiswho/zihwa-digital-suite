import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  image: string;
  slug: string;
};

export default function NewsCard({ title, image, slug }: Props) {
  return (
    <Link
      href={`/news/${slug}`}
      className="flex gap-8 items-start mb-14"
    >
      <Image
        src={image}
        alt={title}
        className="w-[360px] h-[220px] object-cover"
      />
      <h3 className="text-[26px] leading-snug font-normal text-black max-w-lg">
        {title}
      </h3>
    </Link>
  );
}
