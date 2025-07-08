import { GlowEffectButton } from "@/components/ui/GlowButton";
import { Blocks, ChevronRight } from "lucide-react";
import { TextLoopBasic } from "@/components/text/TextLoopBasic";
import GradientText from "@/components/text/GradientText";

const Hero = () => {
  return (
    <main>
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-12 justify-center mt-24">
        <div className="flex flex-col gap-2 lg:gap-5">
          <a href="#" className="hover:cursor-pointer">
            <div className="flex gap-2 justify-center items-center max-w-max rounded-md mx-auto px-3 py-1 bg-primary-foreground border border-primary/10">
              <Blocks size={16} fill="blue" />
              <TextLoopBasic />
              <ChevronRight size={16} />
            </div>
          </a>

          <div className="flex flex-col gap-0 md:gap-2 text-center w-full">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="font-light text-xl md:text-4xl xl:text-5xl leading-15"
            >
              เลือกกองทุนที่ใช่ ในไม่กี่คลิก!
            </GradientText>
            <p className="text-center text-sm lg:text-base md:text-xl opacity-60">
              กองทุนไหนใช่? เราช่วยคุณคัดกรอง
            </p>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <a href="/know-you">
            <GlowEffectButton>ค้นหากองทุนที่ใช่</GlowEffectButton>
          </a>
        </div>
      </div>
    </main>
  );
};
export default Hero;
