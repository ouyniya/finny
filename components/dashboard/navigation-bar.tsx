"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

const routes = [
  { href: "/dashboard", label: "ภาพรวม" },
  { href: "/dashboard/transaction", label: "รายการ" },
  { href: "/dashboard/accounts", label: "บัญชี" },
  { href: "/dashboard/categories", label: "หมวดหมู่" },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const [isShowNavbar, setIsShowNavbar] = useState(false);

  return (
    <>
      <nav>
        <div
          className={cn(
            "flex flex-col md:flex-row gap-1 md:gap-2 md:pt-0",
            isShowNavbar ? "pt-44" : "pt-0"
          )}
        >
          <Button
            onClick={() => setIsShowNavbar((prev) => !prev)}
            className={cn(
              "group link bg-primary/0 text-primary rounded-xl hover:bg-primary-foreground/0  duration-300 hover:cursor-pointer",
              "md:hidden"
            )}
          >
            <p>เมนู</p>
            {isShowNavbar ? (
              <X className="group-hover:text-red-500" />
            ) : (
              <ChevronDown className="group-hover:animate-bounce" />
            )}
          </Button>

          <div
            className={cn(
              "flex flex-col md:flex-row gap-1 md:gap-2 bg-primary-foreground md:bg-primary-foreground/0 px-4 py-2 md:px-0 rounded-xl md:block",
              isShowNavbar ? "" : "hidden"
            )}
          >
            {routes.map((route) => {
              const isActive = pathname === route.href;

              return (
                <Link key={route.label} href={route.href}>
                  <Button
                    className={cn(
                      "link bg-primary/0 text-primary rounded-xl hover:bg-primary-foreground/0  duration-300 hover:cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5",
                      isActive
                        ? "border border-primary/40 bg-primary/10 hover:bg-primary/15"
                        : ""
                    )}
                  >
                    {route.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
export default NavigationBar;
