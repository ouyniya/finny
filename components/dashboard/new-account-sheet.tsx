"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AccountForm from "./account-form";
import { useNewAccount } from "@/hooks/use-new-account";

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const handleSubmit = (values: { name: string }) => {
    console.log("Submitted values:", values);
    // TODO: call API here
    onClose(); // ปิดแผ่น sheet เมื่อเสร็จ
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>สร้างบัญชีใหม่</SheetTitle>
            <SheetDescription asChild>
              <div className="flex flex-col gap-4">
                กรุณากรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีของคุณ
                <AccountForm onSubmit={handleSubmit} />
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default NewAccountSheet;
