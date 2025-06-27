import { Button } from "@/components/ui/button";
import { initialProfile } from "@/lib/initial-profile";
import GradientText from "@/components/text/GradientText";
import { UserButton } from "@clerk/nextjs";
import CustomGradientBlur from "@/components/text/CustomGradientBlur";

export default async function Home() {
  // await initialProfile();

  return (
    <>
      <h1 className="text-indigo-600">test</h1>

      <UserButton />

      <Button>test</Button>
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
        className="font-extrabold text-6xl"
      >
        Add a splash of color!
      </GradientText>

      <div className="relative w-[50%] h-[50%] overflow-hidden">
        <ul className="space-y-2 p-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="text-lg">
              Item {i + 1}
            </li>
          ))}
        </ul>

        <CustomGradientBlur
          height="90%"
          direction="to top"
          stops={[
            [
              { stop: "10%", color: "rgba(255,0,150,0)" },
              { stop: "30%", color: "rgba(255,0,150,0.6)" },
              { stop: "60%", color: "rgba(255,0,150,0)" },
            ],
            [
              { stop: "0%", color: "rgba(255,0,150,1)" },
              { stop: "60%", color: "rgba(255,0,150,1)" },
              { stop: "80%", color: "rgba(255,0,150,0)" },
            ],
          ]}
        />
      </div>
    </>
  );
}
