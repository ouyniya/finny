import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Coins } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-primary-foreground">
        <div className="max-w-5xl mx-auto">
          {/* main */}
          <div className="flex gap-18 py-18 px-4 justify-around items-center flex-wrap max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">Finny</h3>
              <p className="text-sm opacity-50">
                Making fund selection smarter, one wishlist at a time.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="font-semibold text-lg">Text</h3>
              <ul className="flex flex-col gap-4 text-sm">
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="font-semibold text-lg">Text</h3>
              <ul className="flex flex-col gap-4 text-sm">
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="font-semibold text-lg">Text</h3>
              <ul className="flex flex-col gap-4 text-sm">
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <h3 className="font-semibold text-lg">Text</h3>
              <ul className="flex flex-col gap-4 text-sm">
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
                <a href="">
                  <li className="link">Home</li>
                </a>
              </ul>
            </div>
          </div>

          {/* toggle */}
          <div className="w-full">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              <AccordionItem value="about-finny">
                <AccordionTrigger>About Finny</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-sm">
                  <ul>
                    <li className="flex gap-1">
                      <Coins className="text-yellow-500" size={12} />
                      Project Finny อยู่ในระหว่างการพัฒนา
                      มีวัตถุประสงค์เพื่อศึกษาการเขียนโปรแกรมของผู้จัดทำเท่านั้น
                      ไม่สามารถนำไปใช้เป็นแหล่งอ้างอิงได้
                    </li>
                    <li className="flex gap-1">
                      <Coins className="text-yellow-500" size={12} />
                      ข้อมูลที่ทางเรานำมาใช้งาน มีข้อควรพิจารณา ดังนี้
                    </li>
                    <div className="ml-4 opacity-80">
                      <p className="flex gap-1">
                        - ข้อมูลที่แสดงทั้งหมดมาจากแหล่งข้อมูลที่น่าเชื่อถือ
                        เช่น สำนักงาน กลต. หรือ
                        เว็บไซต์ของบริษัทหลักทรัพย์จัดการกองทุน เป็นต้น
                        อย่างไรก็ตาม
                        ทางเราไม่รับรองถึงความถูกต้องสมบูรณ์ของข้อมูลดังกล่าว
                      </p>
                      <p className="flex gap-1">
                        - สำหรับหน้าค้นหากองทุน ข้อมูลที่มีระยะเวลามากกว่า 1
                        ปีขึ้นไปจะแสดงในรูปแบบของข้อมูลต่อปี
                      </p>
                      <p className="flex gap-1">
                        - แบบประเมินความเสี่ยงผู้ลงทุนนำมาจาก
                        <Link
                          className="link text-indigo-300"
                          href="https://www.smarttoinvest.com/Pages/Know%20Investment/Money%20Calculation%20Tool/InvestmentPortfolio.aspx"
                        >
                          เว็บไซต์ของสำนักงาน กลต.
                        </Link>
                        ณ วันที่ 4 มีนาคม 2568
                      </p>
                      <p className="flex gap-1">
                        -
                        ข้อมูลผลประเมินการจัดพอร์ตการลงทุนนำมาจากสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์
                        <Link
                          className="link text-indigo-300"
                          href="https://www.smarttoinvest.com/Pages/Know%20Investment/Money%20Calculation%20Tool/InvestmentPortfolioResult.aspx?Result=29"
                        >
                          คลิกที่นี่
                        </Link>
                      </p>
                      <div className="mt-4">
                        <Alert>
                          <AlertTitle>ข้อจำกัดการใช้งาน</AlertTitle>
                          <AlertDescription>
                            ‣ ข้อมูลที่นำเสนอในเว็บไซต์นี้
                            เป็นข้อมูลเบื้องต้นที่มีจุดประสงค์เพื่อให้ผู้ใช้สามารถเข้าใจหลักการวางแผนการลงทุนตามระดับความเสี่ยงที่เหมาะสม
                            มิได้ถือเป็นคำแนะนำการลงทุนที่เฉพาะเจาะจง
                            และไม่สามารถใช้ทดแทนคำแนะนำจากที่ปรึกษาการลงทุนที่ได้รับใบอนุญาตได้{" "}
                            <br />
                            ‣ ควรพิจารณาปัจจัยอื่นๆ เช่น วัตถุประสงค์ในการลงทุน,
                            สถานการณ์ทางเศรษฐกิจ และภาวะตลาด
                            เพื่อการตัดสินใจลงทุนที่เหมาะสม <br />
                            ‣
                            ผลการคำนวณและการจัดสรรพอร์ตการลงทุนที่แสดงเป็นเพียงการประมาณการจากข้อมูลในอดีต
                            ซึ่งอาจมีความแตกต่างจากผลลัพธ์จริงในอนาคต <br />‣
                            การลงทุนในสินทรัพย์ที่มีความเสี่ยงสูงอาจทำให้สูญเสียเงินลงทุนได้
                            ผู้ใช้ควรพิจารณาความเสี่ยงและการลงทุนที่เหมาะสมกับความสามารถทางการเงินของตน
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
