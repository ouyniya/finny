"use client";

import Header from "@/components/common/Header";
import { BentoCard, BentoGrid } from "@/components/ui/magicui/bento-grid";
import { Marquee } from "@/components/ui/magicui/marquee";
import { cn } from "@/lib/utils";
import { MagicWandIcon, HeartIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { OrbitingCircles } from "@/components/ui/magicui/orbiting-circles";
// import GradientText from "@/components/text/GradientText";
// import Link from "next/link";

import {
  Building,
  ChartColumn,
  Coins,
  FolderArchive,
  Leaf,
  Sparkle,
} from "lucide-react";

const features = [
  {
    Icon: MagicWandIcon,
    name: "ช่วยเลือกหน่อย",
    description: "หากคุณยังไม่มีกองทุนรวมในใจ เราช่วยคุณคิดได้นะ",
    href: "/",
    cta: "รายละเอียดเพิ่มเติม",
    background: (
      <div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="w-50 h-50 absolute -bottom-30 -right-20 rounded-full bg-teal-500"></div>
        <Image
          src="/images/people/unknow.png"
          alt="know"
          width={120}
          height={160}
          className="absolute -bottom-2 right-1 -rotate-y-180 z-10"
        />
        <div className="relative top-5 h-[330px] w-full">
          <OrbitingCircles className="top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]">
            <div className="flex gap-2 justify-center items-center px-3 py-1 max-w-max rounded-full bg-indigo-700">
              <ChartColumn className="text-indigo-300" />
              <p className="text-xs w-max">หุ้น</p>
            </div>
            <div className="flex gap-2 justify-center items-center px-3 py-1 max-w-max rounded-full bg-teal-600">
              <Leaf className="text-teal-200" />
              <p className="text-xs w-max">ESG</p>
            </div>
          </OrbitingCircles>
          <OrbitingCircles
            radius={100}
            reverse
            className="top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]"
          >
            <div className="flex gap-2 justify-center items-center px-3 py-1 max-w-max rounded-full bg-amber-500">
              <Sparkle className="text-amber-50" />
              <p className="text-xs w-max">ทองคำ</p>
            </div>
            <div className="flex gap-2 justify-center items-center px-3 py-1 max-w-max rounded-full bg-blue-500">
              <FolderArchive className="text-blue-200" />
              <p className="text-xs w-max">ตราสารหนี้</p>
            </div>
            <div className="flex gap-2 justify-center items-center px-3 py-1 max-w-max rounded-full bg-purple-700">
              <Coins className="text-purple-300" />
              <p className="text-xs w-max">เงินฝาก</p>
            </div>
            <div className="flex gap-2 justify-center items-center px-3 py-1 max-w-max rounded-full bg-fuchsia-500">
              <Building className="text-fuchsia-100" />
              <p className="text-xs w-max">อสังหาฯ</p>
            </div>
          </OrbitingCircles>
        </div>
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-2",
  },
  {
    Icon: HeartIcon,
    name: "มีกองทุนรวมในใจแล้ว",
    description: "ค้นหากองทุนที่คุณต้องการให้ตรงใจคุณด้วยระบบค้นหาขั้นสูง",
    href: "/search",
    cta: "รายละเอียดเพิ่มเติม",
    background: (
      <div>
        <div className="w-50 h-50 absolute -bottom-30 -right-20 rounded-full bg-indigo-500"></div>
        <Image
          src="/images/people/know.png"
          alt="know"
          width={80}
          height={80}
          className="absolute -bottom-2 right-1 -rotate-y-180 z-10"
        />
        <MarqueeDemoVertical />
      </div>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-1",
  },
];

const information = [
  {
    name: "ปั้น",
    username: "@pun",
    body: "สนใจกองทุนหุ้นระยะยาว เพราะคิดว่าผลตอบแทนน่าสนใจ แม้จะมีความผันผวนบ้าง",
    img: "/images/icons/01.png",
  },
  {
    name: "น้ำ",
    username: "@nam",
    body: "อยากหากองทุนตราสารหนี้ เพราะชอบอะไรที่ความเสี่ยงต่ำและมีรายได้สม่ำเสมอ",
    img: "/images/icons/02.png",
  },
  {
    name: "บีม",
    username: "@beam",
    body: "เล็งกองทุนจากบลจ.ชื่อดังไว้ เพราะมั่นใจในความน่าเชื่อถือของบริษัท",
    img: "/images/icons/03.png",
  },
  {
    name: "มะนาว",
    username: "@manao",
    body: "อยากลงทุนในกองทุนหุ้นต่างประเทศ เพราะคิดว่าตลาดโลกยังมีโอกาสอีกมาก",
    img: "/images/icons/04.png",
  },
  {
    name: "โอ๊ต",
    username: "@oat",
    body: "ผมรับความเสี่ยงได้สูง เลยอยากหากองทุนที่ลงทุนในนวัตกรรมหรือเทคโนโลยี",
    img: "/images/icons/05.png",
  },
  {
    name: "มีน",
    username: "@mean",
    body: "ชอบกองทุนที่ลงทุนในอสังหาริมทรัพย์ เพราะอยากมีรายได้แบบ Passive Income",
    img: "/images/icons/06.png",
  },
  {
    name: "ไอซ์",
    username: "@ice",
    body: "ตอนนี้สนใจกองทุนผสมที่มีทั้งหุ้นและตราสารหนี้ เพราะอยากบาลานซ์ความเสี่ยง",
    img: "/images/icons/07.png",
  },
];

const firstRow = information.slice(0, information.length / 2);
const secondRow = information.slice(information.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-50/[.1] bg-primary-foreground hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

function MarqueeDemoVertical() {
  return (
    <div className="relative flex h-[350px] w-full flex-row items-center justify-center overflow-hidden">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}

const KnowYouPage = () => {
  return (
    <>
      <Header
        top="Search"
        header="คุณมีกองทุนในใจแล้วหรือยัง"
        content="เริ่มต้นค้นหากองทุนที่ใช่ของคุณ"
      />
      {/* <BentoGrid className="lg:grid grid-cols-2 grid-rows-2 lg:grid-rows-1 hidden text-2xl font-bold">
        <div className="w-full text-center">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="text-lg md:text-2xl"
          >
            <Link href="/search">มีแล้วจ้า</Link>
          </GradientText>
        </div>
        <div className="w-full text-center">
          {" "}
          <GradientText
            colors={["#FFBF00", "#ffce00", "#ff7400", "#ffce00", "#ffde1a"]}
            animationSpeed={3}
            showBorder={false}
            className="text-lg md:text-2xl"
          >
            ยังไม่มีเลย
          </GradientText>
        </div>
      </BentoGrid> */}

      <BentoGrid className="grid grid-cols-2 grid-rows-2 lg:grid-rows-1">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </>
  );
};

export default KnowYouPage;
