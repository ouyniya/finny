"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/use-new-account";
import { Edit2 } from "lucide-react";

const DashboardPage = () => {
  const { onOpen } = useNewAccount();

  return (
    <div>
      <div className="flex justify-between items-center w-full">
        <h1 className="text-xl">รายการ</h1>
        <Button onClick={onOpen}>
          <div className="flex items-center gap-2 px-4">
            <Edit2 />
            <p>สร้างบัญชีใหม่</p>
          </div>
        </Button>
      </div>
    </div>
  );
};
export default DashboardPage;
