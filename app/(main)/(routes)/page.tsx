import { Bento } from "@/components/main/Bento";
import Faq from "@/components/main/Faq";
import Header from "@/components/common/Header";
import Hero from "@/components/main/Hero";
import GamePage from "./game/page";

export default async function Home() {
  return (
    <div className="flex flex-col gap-5 md:gap-48 w-full max-w-5xl mx-auto px-4 xl:px-0 mb-32">
      <Hero />

      <div className="flex flex-col gap-16 justify-center">
        <Header
          top="Learning"
          header="มือใหม่กองทุนรวม"
          content="เรียนรู้เรื่องราวกองทุนรวมแบบลึกซึ้งได้ที่นี่"
        />
        <Bento />
      </div>

      <div className="flex flex-col gap-16 justify-center">
        <GamePage />
      </div>

      <div className="flex flex-col gap-16 justify-center">
        <Header
          top="FAQs"
          header="คำถามที่พบบ่อย"
          content="รวบรวมคำถามที่พบบ่อย แยกตามหมวดหมู่ดังนี้"
        />
        <Faq />
      </div>
    </div>
  );
}
