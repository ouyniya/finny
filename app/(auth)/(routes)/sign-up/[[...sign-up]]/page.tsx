import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          card: "opacity-95 bg-linear-to-b from-slate-900 to-slate-950 text-sm",
          footer:
            "opacity-95 !bg-linear-to-b from-slate-950 to-slate-950 text-sm",
        },
      }}
    />
  );
}
