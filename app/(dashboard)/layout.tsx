import HeaderDashboard from "@/components/dashboard/header-dashboard";
import Bg from "@/components/main/Bg";
import { ChildrenProps } from "@/types/main-layout";

const DashboardLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <div className="w-screen min-h-screen">
        <Bg />
        <HeaderDashboard />
        <main className="max-w-4xl mx-auto">{children}</main>
      </div>
    </>
  );
};
export default DashboardLayout;
