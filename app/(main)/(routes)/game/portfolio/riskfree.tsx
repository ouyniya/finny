import CuteGlassButton from "@/components/ui/cute-glass-button";
import { ChevronRight, Loader } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function RiskFree() {
  const [yieldValue, setYieldValue] = useState("");
  const [error, setError] = useState("");
  const [hasRequested, setHasRequested] = useState(false); // เพิ่มตัวแปรนี้

  const getRiskFreeRateFromTBMA = () => {
    setHasRequested(true); // ตั้งค่าว่าเคยกดปุ่มแล้ว
    setError(""); // ล้าง error เก่า
    setYieldValue(""); // ล้างค่าก่อนโหลดใหม่

    fetch("/api/riskfree")
      .then((res) => res.json())
      .then((json) => {
        console.log("Response JSON:", json);

        if (json.rows && json.rows.length > 0) {
          const value = json.rows[0][7]; // 8th column
          setYieldValue(value);
        } else {
          setError("ไม่พบข้อมูล");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("ดึงข้อมูลไม่สำเร็จ");
      });
  };

  return (
    <div className="p-4 flex gap-4 items-center">
      <div className="max-w-max">
        <CuteGlassButton
          onClick={getRiskFreeRateFromTBMA}
          textColorFrom="#a67bf5"
          textColorTo="#1ca2e9"
          text="ขอข้อมูลหน่อย"
          iconBefore="🪄"
          iconAfter={ChevronRight}
          iconAnimation=""
        />
      </div>

      {hasRequested && (
        <>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : yieldValue ? (
            <p className="text-indigo-500 text-lg font-bold">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">
                    ⚡ {parseFloat(yieldValue).toFixed(2)} %
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">ค่านี้คืออะไร?</h4>
                      <p className="text-sm">
                        อัตราดอกเบี้ยปราศจากความเสี่ยง
                        <br/>
                        อ้างอิงตามแนวทางของสมาคมบริษัทจัดการลงทุน<br/>
                        โดยพิจารณาจาก ThaiBMA Short-term <br/> Government Bond Index
                      </p>
                      <div className="text-muted-foreground text-xs">
                        https://www.thaibma.or.th/EN/Market/Index/<br/>
                        ShortTermIndex.aspx
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </p>
          ) : (
            <div className="text-gray-400 flex gap-1 items-center">
              <Loader size={16} className="animate-spin" />
              <p>กำลังโหลด...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
