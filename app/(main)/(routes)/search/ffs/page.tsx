"use client";

import { GlowEffectButton } from "@/components/button/GlowButton";
import { Globe } from "@/components/magicui/globe";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FfsPage = () => {
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

        <div className="flex flex-col gap-2 justify-center items-center text-base text-center">
          คุณกำลังไปที่
          <br />
          <p className="opacity-50 text-sm">{url.substring(0, 45) + "..."}</p>
        </div>
      </div>
      <GlowEffectButton>
        <Link href="/search" className="link">
          <p className="text-base">กลับหน้าค้นหากองทุน</p>
        </Link>
      </GlowEffectButton>
      <object data={url} type="application/pdf" width="100%"></object>
    </div>
  );
};
export default FfsPage;
