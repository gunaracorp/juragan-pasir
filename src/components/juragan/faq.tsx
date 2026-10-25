"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CmsFaq, CmsSection } from "@/lib/cms-types";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Faq({
  faqs,
  section,
}: {
  faqs: CmsFaq[];
  section?: CmsSection;
}) {
  return (
    <section id="faq" aria-labelledby="judul-faq" className="scroll-mt-24 bg-cream-50 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={section?.eyebrow || "Tanya Jawab"}
          title={section?.heading || "Pertanyaan yang"}
          highlight={section?.highlight || "Sering Diajukan"}
          description={section?.description}
        />

        <Reveal>
          <div className="rounded-2xl border border-line bg-card p-3 shadow-soft">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.id}
                  value={`faq-${i}`}
                  className="border-line data-[state=open]:border-gold-500/50"
                >
                  <AccordionTrigger className="px-5 text-left font-display text-[1.05rem] font-bold text-ink-900 hover:text-gold-700 hover:no-underline [&[data-state=open]>svg]:text-gold-600">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-ink-500">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
