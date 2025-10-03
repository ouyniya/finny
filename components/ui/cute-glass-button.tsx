import { AnimatedGradientText } from "./magicui/animated-gradient-text";
import { cn } from "@/lib/utils";

import { ElementType, MouseEventHandler } from "react";

interface CuteGlassButtonProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  textColorFrom: string;
  textColorTo: string;
  text: string;
  iconBefore?: React.ElementType | string;
  iconAfter?: ElementType;
  iconAnimation?: string;
  loading?: boolean;
  className?: string;
}

const CuteGlassButton = ({
  onClick,
  textColorFrom,
  textColorTo,
  text,
  iconBefore: IconBefore,
  iconAfter: IconAfter,
  iconAnimation = "",
  loading,
  className
}: CuteGlassButtonProps) => {
  return (
    <div
      className="max-w-max group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] hover:cursor-pointer"
      onClick={onClick}
    >
      <span
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r",
          `from-[#9c40ff]/50`,
          `via-[#1ca2e9]/50`,
          `to-[#9c40ff]/50`,
          "bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      {IconBefore &&
        (typeof IconBefore === "string" ? (
          <div
            className={cn(
              "flex mr-2 justify-center items-center",
              `group-hover:${iconAnimation}`
            )}
          >
            <p>{IconBefore}</p>
          </div>
        ) : (
          <IconBefore className={cn("transition-transform", iconAnimation)} />
        ))}
      <AnimatedGradientText
        className={cn("text-lg font-medium", className)}
        // className="text-lg font-medium"
        colorFrom={textColorFrom}
        colorTo={textColorTo}
      >
        {loading ? "กำลังโหลด..." : text}
      </AnimatedGradientText>
      {IconAfter && (
        <IconAfter className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      )}
    </div>
  );
};

export default CuteGlassButton;
