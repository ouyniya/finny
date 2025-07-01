import { TextLoop } from "@/components/motion-primitives/text-loop";

export function TextLoopBasic() {
  return (
    <TextLoop className="text-xs sm:text-sm opacity-75">
      <span>คัดกรองกองทุนตามเงื่อนไขที่ต้องการ</span>
      <span>เพิ่มกองทุนลงใน Wishlist ให้คุณ!</span>
      <span>ช่วยให้คุณสามารถติดตามกองทุนที่สนใจ</span>
      <span>ให้บริการฟรีสำหรับการศึกษาข้อมูลเกี่ยวกับกองทุน</span>
    </TextLoop>
  );
}
