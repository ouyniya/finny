import Header from "@/components/common/Header";
import { MagicCardGame } from "@/components/common/MagicCard";
import { LRMGAMES } from "@/lib/constants";

export default async function GamePage() {
  return (
    <>
      <Header
        top="Game"
        header="เครื่องมือบริหารความเสี่ยงสภาพคล่องของกองทุนรวม"
        content="Liquidity Management Tools (LMTs)"
      />

    <h1 className="font-semibold">กลุ่มเครื่องมือที่กำหนดให้ผู้ลงทุนเป็นผู้รับภาระค่าใช้จ่าย (Pass on Transaction Cost tools) </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto">
        {LRMGAMES &&
          LRMGAMES.map((game) => 
            (
            <div key={game.title}>
              <MagicCardGame
                title={
                  game.title.length <= 20
                    ? game.title
                    : game.title.substring(0, 20).trimEnd() + "..."
                }
                content={game.content}
                link={game.link}
                url={game.url}
              />
            </div>
          ))}
      </div>
    </>
  );
}
