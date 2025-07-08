"use client";

import { GlowEffectButton } from "@/components/ui/GlowButton";
import { Globe } from "@/components/ui/magicui/globe";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const FfsPage = () => {
  const [loading, setLoading] = useState("กลับหน้าค้นหากองทุน");
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  return (
    <div className="flex flex-col gap-14 justify-center items-center mx-auto w-full h-full">
      <div className="relative flex flex-col justify-center items-center gap-8">
        <Globe className="w-55 h-55 absolute" />
        <div className="flex justify-center items-center w-49 h-49 rounded-full overflow-hidden relative">
          <Image
            src="/images/people/company.png"
            width={120}
            height={120}
            alt="error"
            className="translate-y-6"
          />
        </div>

        {url.includes("https://www.sec.or.th") || url.length <= 10 ? (
          <div className="flex gap-2 justify-center items-center">
            <AlertCircle size={16} />
            <p>ไม่พบข้อมูลหนังสือชี้ชวนของกองทุนนี้</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 justify-center items-center text-base text-center">
              กำลังพาคุณไปที่
              <br />
              <p className="opacity-50 text-sm">
                {url.substring(0, 45) + "..."}
              </p>
            </div>
          </>
        )}
      </div>
      <GlowEffectButton>
        <Link
          href="/search"
          className="link"
          onClick={() => {
            setLoading("กำลังเปลี่ยนหน้า...");
            setTimeout(() => {
              setLoading("เกิดข้อผิดพลาด กรุณาโหลดหน้านี้ใหม่");
            }, 5000);
          }}
        >
          {loading}
        </Link>
      </GlowEffectButton>
      <object data={url} type="application/pdf" width="100%"></object>
    </div>
  );
};
export default FfsPage;
