import Chart from "@/components/main/Chart";
import { Card } from "@/components/ui/card";
import { AlignRight } from "lucide-react";
import Link from "next/link";

const SETUpdate = () => {
  function formatNextWeekday(date = new Date()) {
    const result = new Date(date);

    // ถ้าเป็นเสาร์ (6) → บวก 2 วัน, ถ้าเป็นอาทิตย์ (0) → บวก 1 วัน
    if (result.getDay() === 6) {
      result.setDate(result.getDate() + 2);
    } else if (result.getDay() === 0) {
      result.setDate(result.getDate() + 1);
    }

    const day = result.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[result.getMonth()];
    const year = result.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const today = new Date();
  const formattedDate = formatNextWeekday(today);

  return (
    <div>
      <div className="w-full [mask-image:linear-gradient(to_bottom,#000_70%,transparent_100%)]">
        <Card className="flex flex-row gap-5 px-5.5 bg-primary-foreground/20 justify-center">
          <div className="mx-auto flex flex-col gap-4">
            <div className="navbar-fake">
              <Card className="h-12 flex flex-row justify-between items-center px-4">
                <ul className="flex gap-2">
                  <li>ภาพรวมตลาดหุ้นไทย</li>
                </ul>
                <div>
                  <Link
                    className="text-sm link flex gap-2 items-center"
                    href="https://www.set.or.th/en/market/index/set/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p>ข้อมูลเพิ่มเติม</p>
                    <AlignRight className="w-4" />
                  </Link>
                </div>
              </Card>
            </div>

            <div className="flex gap-5 flex-col lg:flex-row">
              <div className="w-full">
                <div>
                  <Chart />
                </div>
              </div>
              <div className="basis-1/2 text-sm">
                <p className="font-semibold text-lg mb-3">มุมมองล่าสุด</p>
                <p>
                  ตลาดหุ้นไทยยังเคลื่อนไหวในลักษณะที่ระมัดระวัง
                  โดยได้รับแรงกดดันจากหลายปัจจัยทั้งภายในและภายนอกประเทศ
                  ปัจจัยทางการเมืองที่ยังไม่ชัดเจน รวมถึงความกังวลต่อภาระการคลัง
                  ทำให้นักลงทุนต่างชาติยังระมัดระวังการลงทุน
                  ขณะเดียวกันค่าเงินบาทที่แข็งค่าขึ้นอย่างรวดเร็วก็สร้างแรงถ่วงต่อภาคส่งออก
                  แม้รัฐบาลชุดใหม่จะเตรียมออกมาตรการกระตุ้นเศรษฐกิจ
                  ตลาดยังคงรอดูความชัดเจนของนโยบาย
                  ทำให้การฟื้นตัวของดัชนีมีลักษณะระมัดระวังและอาจผันผวนตามข่าวสารทั้งในและต่างประเทศ
                  นักลงทุนควรติดตามมาตรการกระตุ้นเศรษฐกิจของรัฐบาล ค่าเงินบาท
                  และนโยบายการเงินจากธนาคารแห่งประเทศไทย
                  รวมถึงปัจจัยภายนอกที่อาจส่งผลต่อทิศทางตลาด
                  เพื่อใช้ประกอบการตัดสินใจในการลงทุน
                </p>
                <p className="text-xs opacity-50 mt-4">
                  หมายเหตุ:
                  บทความนี้เป็นการสรุปและวิเคราะห์ตลาดเพื่อวัตถุประสงค์ให้ข้อมูลเท่านั้น
                  ไม่ใช่คำแนะนำในการลงทุน
                </p>
                <p className="text-xs opacity-50 mt-4">
                  <span>ข้อมูลล่าสุด วันที่</span>
                  <span> {formattedDate}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default SETUpdate;
