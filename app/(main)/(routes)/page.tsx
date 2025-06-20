import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return <>
  <h1 className="text-indigo-600">test</h1>
  <Button>test</Button>
  <UserButton />
  </>;
}
