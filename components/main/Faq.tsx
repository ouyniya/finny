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
    answer:
      "Mutual fund ช่วยกระจายความเสี่ยงในการลงทุน โดยมีผู้จัดการกองทุนบริหารให้ เหมาะสำหรับผู้ที่ต้องการลงทุนแต่ไม่มีเวลาหรือความเชี่ยวชาญในการเลือกหุ้นเอง",
  },
  {
    question: "เว็บไซต์นี้ช่วยอะไรได้บ้าง?",
    answer:
      "เว็บไซต์นี้ช่วยให้คุณสามารถคัดกรองกองทุนตามเงื่อนไขที่ต้องการ เพิ่มกองทุนลงใน Wishlist และศึกษาข้อมูลกองทุนเพื่อการเรียนรู้ โดยไม่มีวัตถุประสงค์เพื่อการแนะนำการลงทุน",
  },
  {
    question: "การเพิ่มกองทุนลงใน Wishlist มีประโยชน์อย่างไร?",
    answer:
      "การเพิ่มกองทุนลงใน Wishlist ช่วยให้คุณสามารถติดตามกองทุนที่สนใจ และเปรียบเทียบข้อมูลได้ง่ายขึ้นโดยไม่ต้องค้นหาใหม่ทุกครั้ง",
  },
  {
    question: "ข้อมูลในเว็บไซต์นี้เชื่อถือได้หรือไม่?",
    answer:
      "ข้อมูลในเว็บไซต์นี้จัดทำขึ้นเพื่อการศึกษาและอ้างอิงจากแหล่งข้อมูลที่น่าเชื่อถือ อย่างไรก็ตาม โปรดตรวจสอบข้อมูลจากแหล่งข้อมูลทางการก่อนตัดสินใจลงทุน",
  },
  {
    question: "เว็บไซต์นี้มีค่าใช้จ่ายหรือไม่?",
    answer:
      "เว็บไซต์นี้ให้บริการฟรีสำหรับการศึกษาข้อมูลเกี่ยวกับกองทุน ไม่มีค่าธรรมเนียมในการใช้งาน",
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
              faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    {faq.answer}
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
