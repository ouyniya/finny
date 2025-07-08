import { InView } from "@/components/ui/in-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const portfolioGameFact = [
  {
    question: "เกมส์นี้คิออะไร",
    answer: `
      เกมส์นี้ช่วยคำนวณและหาพอร์ตลงทุนที่เหมาะสมตามหลัก <strong>Modern Portfolio Theory (MPT)</strong> 📖<br/>
      ซึ่งเน้นการจัดพอร์ตเพื่อลดความเสี่ยงและเพิ่มผลตอบแทน โดยคำนวณจากข้อมูล <em>ผลตอบแทนที่คาดหวัง</em>, <em>ความผันผวน</em>, และ <em>ความสัมพันธ์ระหว่างสินทรัพย์</em><br/>
      💬 โดยเราใช้การสุ่มน้ำหนักลงทุน <strong>1 ล้านรอบ (Monte Carlo Simulation)</strong> เพื่อค้นหาพอร์ตที่มี <strong>Sharpe Ratio</strong> สูงที่สุด<br/>
      รวมถึงแสดง <strong>📈 กราฟ Efficient Frontier</strong> ให้เห็นตำแหน่งของพอร์ตที่ดีที่สุดในกราฟ
    `,
  },
  {
    question: "สิ่งที่ควรรู้ก่อนการใช้งาน",
    answer: `
      เครื่องมือนี้ออกแบบมาเพื่อใช้ในลักษณะ <strong>“เกมจำลองสถานการณ์”</strong> เท่านั้น<br/>
      <em>ไม่สามารถนำผลลัพธ์ไปใช้ในการลงทุนจริงได้</em> เพราะอิงกับข้อมูลที่ผู้ใช้กรอกเอง และอาจไม่สมบูรณ์<br/>
      ระบบไม่คำนึงถึงปัจจัยในโลกจริง เช่น สภาพตลาด ค่าใช้จ่าย หรือข้อจำกัดอื่น ๆ<br/>
      ดังนั้นควรใช้เพื่อ <strong>การทดลอง เรียนรู้ และฝึกวิเคราะห์เบื้องต้น</strong> เท่านั้น
    `,
  },
  {
    question: "ค่าเริ่มต้นของผลตอบแทนและความผันผวนคำนวณจากไหน",
    answer: `
      ค่าเริ่มต้นคำนวณจากค่าเฉลี่ยย้อนหลัง 10 ปี ณ วันที่ 4 ก.ค. 2568<br/>
      🏛️ เงินฝาก: Money Market General<br/>
      📜 ตราสารหนี้ภาครัฐ: Mid Term Government Bond<br/>
      📖 หุ้นกู้: Mid Term General Bond<br/>
      🔥 หุ้น: Global Equity<br/>
      💎 การลงทุนทางเลือก: Fund of Property Fund - Thai<br/>
      <em>หมายเหตุ: ตัวเลขเหล่านี้ใช้เพื่อการจำลองเท่านั้น ไม่ใช่การการันตีผลตอบแทนในอนาคต</em>
    `,
  },
  {
    question: "ค่าสัมประสิทธิ์สหสัมพันธ์คืออะไร หาข้อมูลจากไหนดี",
    answer: `
      ค่าสัมประสิทธิ์สหสัมพันธ์ (Correlation Coefficient) หรือที่เรียกย่อ ๆ ว่า "ค่า Correlation" เป็นตัวเลขที่ใช้วัดความสัมพันธ์เชิงสถิติระหว่าง ตัวแปร 2 ตัว — ในบริบททางการเงิน โดยมากจะใช้วัดความสัมพันธ์ของ ผลตอบแทนของสินทรัพย์ 2 ชนิด เช่น หุ้นสองตัว, หุ้นกับพันธบัตร ฯลฯ<br/>
      📖 ค่าอยู่ในช่วง -1 ถึง +1<br/>
      +1: ความสัมพันธ์เชิงบวกสมบูรณ์ 🧩 (เคลื่อนไหวไปทางเดียวกัน 100%) <br/>
      0: ไม่มีความสัมพันธ์ 🕊️ <br/>
      -1: ความสัมพันธ์เชิงลบสมบูรณ์ ⚠️ (เคลื่อนไหวตรงกันข้าม 100%)<br/>
      <em>💬 แหล่งข้อมูลออนไลน์: เว็บไซต์เช่น Bloomberg, Yahoo Finance, TradingView (ต้องโหลดข้อมูลราคามาคำนวณผลตอบแทน) หรือ โปรแกรมวิเคราะห์พอร์ต เช่น Morningstar Direct ฯลฯ</em>
     
    `,
  },
];

const WhatIsPortfolioGame = () => {
  return (
    <div className="max-w-xs md:max-w-lg xl:max-w-2xl w-full mx-auto">
      <InView
        variants={{
          hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: "blur(4px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -350px 0px" }}
      >
        <div className="w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            {portfolioGameFact &&
              portfolioGameFact.map((fact, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger>{fact.question}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div dangerouslySetInnerHTML={{ __html: fact.answer }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </InView>
    </div>
  );
};
export default WhatIsPortfolioGame;
