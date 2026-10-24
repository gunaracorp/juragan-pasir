"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="judul-faq" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Tanya Jawab"
          title="Pertanyaan yang"
          highlight="Sering Diajukan"
          description="Belum menemukan jawabannya? Tim kami membalas WhatsApp kerja hari yang sama."
        />

        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="border-stone-200 data-[state=open]:border-amber-500/40"
              >
                <AccordionTrigger className="px-5 text-left text-base font-bold text-stone-900 hover:text-amber-700 hover:no-underline [&[data-state=open]>svg]:text-amber-600">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-stone-600">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
