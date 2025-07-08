import Header from "@/components/common/Header";
import { MagicCardGame } from "@/components/common/MagicCard";
import { GAMES } from "@/lib/constants";

export default async function GamePage() {
  return (
    <>
      <Header
        top="Game"
        header="เกมส์การเงิน"
        content="รวมเกมส์การเงินสนุกๆ ไว้ที่นี่แล้ว"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto">
        {GAMES &&
          GAMES.map((game) => (
            <div key={game.title}>
              <MagicCardGame
                title={game.title}
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
