"use client";

import { useUser } from "@clerk/nextjs";

const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();
  return (
    <>
      <div className="space-y-2 my-8">
        <h2 className="text-2xl text-primary font-medium">
          ยินดีต้อนรับ {isLoaded ? (user?.firstName) : ""}
        </h2>
        <p className="text-sm opacity-50">นี่คือรายงานสถานะการเงินของคุณ</p>
      </div>
    </>
  );
};
export default WelcomeMsg;
