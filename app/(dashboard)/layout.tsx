import HeaderDashboard from "@/components/dashboard/header-dashboard";
import NewAccountSheet from "@/components/dashboard/new-account-sheet";
import Bg from "@/components/main/Bg";
import { ChildrenProps } from "@/types/main-layout";

const DashboardLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <div className="w-screen min-h-screen">
        <Bg />
        <HeaderDashboard />
        <main className="max-w-4xl mx-auto">
          <div className="flex justify-end w-full">
            <NewAccountSheet />
          </div>
          {children}
        </main>
      </div>
    </>
  );
};
export default DashboardLayout;
