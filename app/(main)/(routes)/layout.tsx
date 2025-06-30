import Bg from "@/components/main/Bg";
import Footer from "@/components/main/Footer";
import Navbar from "@/components/main/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div
        className="site min-h-[100dvh] grid"
        style={{
          gridTemplateRows: "auto 1fr auto",
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <Bg />
        <Navbar />
        {children}

        <div className="relative flex">
          <Footer />
        </div>
      </div>
    </>
  );
};
export default MainLayout;
