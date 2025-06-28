import { TextLoop } from "@/components/motion-primitives/text-loop";

export function TextLoopBasic() {
  return (
    <TextLoop className="text-sm opacity-75">
      <span>ชีวิตไม่มีคนหาร? ไม่เป็นไร เว็บนี้หารให้!</span>
      <span>เงินเดือนออกทีไร… หายหมดทุกที? เว็บนี้ช่วยจับคนร้ายให้คุณ!</span>
      <span>ใช้เงินเก่ง เก็บเงินไม่เก่ง?… เว็บนี้ช่วยคุณได้!</span>
      <span>วางแผนการเงินแบบง่ายสุดๆ สำหรับสายขี้เกียจ</span>
    </TextLoop>
  );
}
