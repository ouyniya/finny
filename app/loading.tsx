import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { twMerge } from "tailwind-merge";

export default function Loading({ cn }: { cn?: string  }) {
  return (
    <div className={twMerge(`w-screen h-screen flex justify-center items-center`, cn)}>
      <TextShimmer className="font-mono text-sm" duration={1}>
        Loading...
      </TextShimmer>
    </div>
  );
}
