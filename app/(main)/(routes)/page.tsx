import { Button } from "@/components/ui/button";
import { initialProfile } from "@/lib/initial-profile";
import GradientText from "@/components/text/GradientText";

export default async function Home() {
  await initialProfile();

  return (
    <>
      <h1 className="text-indigo-600">test</h1>
      <Button>test</Button>
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
        className="font-extrabold text-6xl"
      >
        Add a splash of color!
      </GradientText>
    </>
  );
}
