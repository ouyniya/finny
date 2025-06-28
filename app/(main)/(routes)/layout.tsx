import Bg from "@/components/main/Bg";
import Footer from "@/components/main/Footer";
import Navbar from "@/components/main/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Bg />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};
export default MainLayout;
