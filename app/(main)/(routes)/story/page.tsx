import Header from "@/components/common/Header";
import NewMFs from "@/components/main/NewMFs";
import Reports from "@/components/main/Reports";
import SETUpdate from "@/components/main/SETUpdate";
import UpdateMF from "@/components/main/UpdateMF";

const StoryPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <Header
        top="Mutual funds update"
        header="อัพเดตกองทุนรวม"
        content="ติดตามข่าวสารของกองทุนรวมได้ที่นี่"
      />

      <UpdateMF />

      <SETUpdate />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NewMFs />
        <Reports />
      </div>
    </div>
  );
};
export default StoryPage;
