"use client";

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Logo from "../svg/Logo";
import Link from "next/link";
import Loading from "@/app/loading";

const Navbar = () => {
  const { isLoaded, user } = useUser();

  return (
    <nav>
      <div className="mt-8 max-w-5xl w-screen h-16 mx-auto text-sm text-primary/75 px-8">
        <div className="fixed relative max-w-5xl w-full h-16 rounded-2xl border border-slate-500/50 bg-primary-foreground/30 backdrop-blur-sm">
          <div className="flex w-full h-full justify-between items-center px-8">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex gap-10">
              {!isLoaded ? (
                <>
                  <Loading />
                </>
              ) : user ? (
                <>
                  <UserButton />

                  <SignOutButton>
                    <button className="hover:cursor-pointer hover:text-primary hover:text-shadow-[0_0px_16px_rgb(255_0_0_/_1)] hover:text-shadow-red-500 duration-300">
                      Logout
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <>
                  <SignInButton>
                    <button className="link">Login</button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="link">Register</button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
