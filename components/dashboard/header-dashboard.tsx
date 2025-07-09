"use client";

import NavigationBar from "@/components/dashboard/navigation-bar";
import Logo from "../svg/Logo";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import WelcomeMsg from "./welcome-msg";

const HeaderDashboard = () => {
  return (
    <>
      <header className="max-w-4xl mx-auto py-8 h-65">
        <div className=" w-full h-16 rounded-2xl border border-slate-500/50 bg-primary-foreground/30 backdrop-blur-sm">
          <div className="flex gap-5 justify-between items-center w-full h-full px-8">
            <Link href="/">
              <Logo />
            </Link>
            <NavigationBar />
            <ClerkLoaded>
              <UserButton />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin" />
            </ClerkLoading>
          </div>
          <WelcomeMsg />
        </div>
      </header>
    </>
  );
};
export default HeaderDashboard;
