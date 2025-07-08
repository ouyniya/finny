import { InView } from "@/components/ui/in-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { initialMarketDataInputs } from "@/lib/constants";

const retireGameFact = [
  {
    question: "เกมส์นี้คิออะไร",
    answer: `
      เกมนี้ถูกออกแบบมาเพื่อช่วยให้คุณวางแผนการลงทุนเพื่อการเกษียณอย่างมีประสิทธิภาพ
      คุณจะได้ทดลองกรอกข้อมูลพื้นฐาน เช่น อายุ รายได้ เงินออม และรูปแบบชีวิตที่ต้องการหลังเกษียณ จากนั้นระบบจะช่วยคำนวณและจำลองผลลัพธ์ให้
      เกมนี้เหมาะสำหรับผู้ที่อยากเข้าใจการลงทุนและวางแผนเกษียณแบบมีหลักการ <br> * สมมติให้คุณมีอายุถึง 90 ปี
    `,
  },
  {
    question: "สิ่งที่ควรรู้ก่อนการใช้งาน",
    answer: `
      เครื่องมือนี้ออกแบบมาเพื่อเป็น <strong>“เกมจำลองสถานการณ์”</strong> เพื่อการเรียนรู้และทดลองเท่านั้น 🧠<br/>
    <em>ไม่ควรใช้ผลลัพธ์เพื่อตัดสินใจลงทุนจริง</em> อาจไม่ครอบคลุมทุกปัจจัยที่ส่งผลต่อการลงทุนจริง เช่น ภาษี เงินเฟ้อ หรือสถานการณ์เศรษฐกิจ<br/>

    `,
  },
  {
    question: "ค่าของผลตอบแทนมาจากไหน",
    answer: `
      ค่าเริ่มต้นคำนวณจากค่าเฉลี่ยย้อนหลัง 10 ปี ณ วันที่ 4 ก.ค. 2568<br/>
      🏛️ เงินฝาก: Money Market General (${(
        initialMarketDataInputs[0].expectedReturn * 100
      ).toFixed(2)}% ต่อปี)<br/>
      📜 พันธบัตร: Mid Term Government Bond (${(
        initialMarketDataInputs[1].expectedReturn * 100
      ).toFixed(2)}% ต่อปี)<br/>
      🔥 หุ้น: Global Equity (${(
        initialMarketDataInputs[3].expectedReturn * 100
      ).toFixed(2)}% ต่อปี)<br/>
      <em>หมายเหตุ: ตัวเลขเหล่านี้ใช้เพื่อการจำลองเท่านั้น ไม่ใช่การการันตีผลตอบแทนในอนาคต</em>
    `,
  },
];

const WhatIsRetireGame = () => {
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
            {retireGameFact &&
              retireGameFact.map((fact, index) => (
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
export default WhatIsRetireGame;
