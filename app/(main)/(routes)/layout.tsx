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

        <div className="flex flex-col gap-5 md:gap-16 w-full max-w-5xl mx-auto px-4 xl:px-0 mt-20 mb-32">
          {children}
        </div>

        <div className="relative flex">
          <Footer />
        </div>
      </div>

      
    </>
  );
};
export default MainLayout;
