import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <Accordion className="divide-y divide-line">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="py-2">
          <AccordionTrigger className="font-serif text-lg text-ink hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-ink-2">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
