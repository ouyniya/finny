"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import CuteGlassButton from "../ui/cute-glass-button";
import { ChevronRight } from "lucide-react";

export function MagicCardGame({
  title,
  content,
  link,
  url,
}: {
  title: string;
  content: string;
  link: string;
  url: string;
}) {
  const { theme } = useTheme();
  return (
    <Card className="p-0 max-w-sm w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#95def3" : "#95def330"}
        className="p-0"
      >
        <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{content}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[250px] overflow-hidden flex justify-center items-center">
            <Image src={url} alt="game" width={400} height={400} />
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
          <Link href={link} className="w-full">
            <CuteGlassButton
              textColorFrom="#a67bf5"
              textColorTo="#1ca2e9"
              text="เริ่มเล่นเกมส์กันเลย"
              iconAfter={ChevronRight}
              iconAnimation="animate-spin"
            />
          </Link>
        </CardFooter>
      </MagicCard>
    </Card>
  );
}
