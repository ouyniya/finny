import { InView } from "@/components/ui/in-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "ทำไมต้องลงทุนใน Mutual fund",
    answer: `
      Mutual fund ช่วยกระจายความเสี่ยงในการลงทุน โดยมีผู้จัดการกองทุนบริหารให้ เหมาะสำหรับผู้ที่ต้องการลงทุนแต่ไม่มีเวลาหรือความเชี่ยวชาญในการเลือกหุ้นเอง
    `,
  },
  {
    question: "เว็บไซต์นี้ช่วยอะไรได้บ้าง",
    answer: `
     เว็บไซต์นี้ช่วยให้คุณสามารถคัดกรองกองทุนตามเงื่อนไขที่ต้องการ เพิ่มกองทุนลงใน Wishlist และศึกษาข้อมูลกองทุนเพื่อการเรียนรู้ โดยไม่มีวัตถุประสงค์เพื่อการแนะนำการลงทุน อย่างไรก็ตาม project นี้อยู่ในระหว่างการพัฒนา ไม่สามารถนำไปใช้เป็นแหล่งอ้างอิงได้
    `,
  },
  {
    question: "ข้อควรระวังในการใช้งาน",
    answer: `
      ข้อมูลที่นำเสนอในเว็บไซต์นี้ เป็นข้อมูลเบื้องต้นที่มีจุดประสงค์เพื่อให้ผู้ใช้สามารถเข้าใจหลักการวางแผนการลงทุนตามระดับความเสี่ยงที่เหมาะสม มิได้ถือเป็นคำแนะนำการลงทุนที่เฉพาะเจาะจง และไม่สามารถใช้ทดแทนคำแนะนำจากที่ปรึกษาการลงทุนที่ได้รับใบอนุญาตได้
    `,
  },
];

const Faq = () => {
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
            {faqs &&
              faqs.map((fact, index) => (
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
export default Faq;
