import Chart from "@/components/main/Chart";
import { Card } from "@/components/ui/card";

const Tester = () => {
  return (
    <div>
      <div className="w-full [mask-image:linear-gradient(to_bottom,#000_70%,transparent_100%)]">
        <Card className="flex flex-row gap-5 px-5.5 bg-primary-foreground/20 justify-center">
          <div className="mx-auto flex flex-col gap-4">
            <div className="navbar-fake">
              <Card className="h-12 flex flex-row justify-between items-center px-4">
                <ul className="flex gap-2">
                  <li>test</li>
                  <li>test</li>
                  <li>test</li>
                  <li>test</li>
                  <li>test</li>
                </ul>
                <div>search</div>
              </Card>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <div>
                  <Chart />
                </div>
              </div>
              <div className="basis-1/2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                harum aliquid porro odit explicabo. Beatae quasi iure debitis
                voluptatum commodi excepturi, recusandae vitae perspiciatis,
                nihil accusamus minus et, tempora iste sequi magnam sint
                pariatur officiis? Enim natus ducimus, explicabo maxime vel nemo
                eaque qui sit, reiciendis hic et commodi cumque. Doloremque
                eaque labore voluptatum. Labore perspiciatis ea animi excepturi
                necessitatibus architecto quod sequi porro corporis omnis
                similique, quibusdam incidunt rerum facilis cupiditate aliquid
                earum cum eum dignissimos dolore commodi aperiam minus? Dolores
                dolore culpa nisi, laborum porro quis, rem aut aliquam qui
                nostrum laboriosam! Illo, sint. Culpa quaerat nisi numquam!
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Tester;
