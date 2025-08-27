import { InView } from "@/components/ui/in-view";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { definition } from "@/lib/constants";

const SwingPricingDefinition = () => {
  return (
    <div className="max-w-xs md:max-w-lg xl:max-w-2xl w-full mx-auto">
      <h4 className="font-semibold mb-2">สาระน่ารู้เพิ่มเติม:</h4>
      <InView
        variants={{
          hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: "blur(4px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -350px 0px" }}
      >
        <div className="w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            {definition &&
              definition.map((def, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger>{def.word}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    {def.definition}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </InView>
    </div>
  );
};
export default SwingPricingDefinition;
