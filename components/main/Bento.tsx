import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/magicui/bento-grid";
import { Marquee } from "@/components/ui/magicui/marquee";
import { cn } from "@/lib/utils";

const files = [
  {
    name: "Equity fund",
    body: "กองทุนรวมตราสารทุน (Equity Fund) คือ กองทุนที่นำเงินไปลงทุนในหุ้นของบริษัทต่างๆ เพื่อสร้างโอกาสรับผลตอบแทนในระยะยาว เหมาะกับผู้ลงทุนที่รับความเสี่ยงได้สูง",
  },
  {
    name: "Bond fund",
    body: "กองทุนรวมตราสารหนี้ (Bond Fund) คือ กองทุนที่นำเงินไปลงทุนในพันธบัตรรัฐบาล หุ้นกู้บริษัทเอกชน หรือสินทรัพย์หนี้อื่นๆ เหมาะกับผู้ที่ต้องการผลตอบแทนสม่ำเสมอและความเสี่ยงไม่สูงมาก",
  },
  {
    name: "Mixed fund",
    body: "กองทุนรวมผสม (Mixed Fund) คือ กองทุนที่ลงทุนทั้งในหุ้น ตราสารหนี้ และสินทรัพย์ประเภทอื่นๆ เพื่อกระจายความเสี่ยง เหมาะสำหรับผู้ที่ต้องการสมดุลระหว่างผลตอบแทนและความเสี่ยง",
  },
  {
    name: "Money market fund",
    body: "กองทุนรวมตลาดเงิน (Money Market Fund) คือ กองทุนที่ลงทุนในตราสารหนี้ระยะสั้นที่มีความเสี่ยงต่ำ เช่น ตั๋วเงินคลัง หรือเงินฝาก เหมาะสำหรับผู้ที่ต้องการสภาพคล่องสูงและความเสี่ยงต่ำ",
  },
  {
    name: "Foreign fund",
    body: "กองทุนรวมต่างประเทศ (Foreign Investment Fund) คือ กองทุนที่นำเงินไปลงทุนในสินทรัพย์ในต่างประเทศ เช่น หุ้นต่างประเทศ กองทุนต่างประเทศ เพื่อเพิ่มโอกาสในการลงทุนและกระจายความเสี่ยง",
  },
];


const features = [
  {
    Icon: FileTextIcon,
    name: "กองทุนรวมประเภทต่างๆ",
    description: "ประเภทของกองทุนรวมที่ควรรู้จัก",
    href: "/",
    cta: "Learn more",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function Bento() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
