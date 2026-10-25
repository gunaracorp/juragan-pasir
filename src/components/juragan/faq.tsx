"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
<<<<<<< HEAD
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
=======
import { FAQS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Faq() {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <section id="faq" aria-labelledby="judul-faq" className="scroll-mt-24 bg-cream-50 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
<<<<<<< HEAD
          eyebrow={section?.eyebrow || "Tanya Jawab"}
          title={section?.heading || "Pertanyaan yang"}
          highlight={section?.highlight || "Sering Diajukan"}
          description={section?.description}
=======
          eyebrow="Tanya Jawab"
          title="Pertanyaan yang"
          highlight="Sering Diajukan"
          description="Belum menemukan jawabannya? Tim kami membalas WhatsApp kerja hari yang sama."
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
        />

        <Reveal>
          <div className="rounded-2xl border border-line bg-card p-3 shadow-soft">
            <Accordion type="single" collapsible className="w-full">
<<<<<<< HEAD
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.id}
=======
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={f.q}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                  value={`faq-${i}`}
                  className="border-line data-[state=open]:border-gold-500/50"
                >
                  <AccordionTrigger className="px-5 text-left font-display text-[1.05rem] font-bold text-ink-900 hover:text-gold-700 hover:no-underline [&[data-state=open]>svg]:text-gold-600">
<<<<<<< HEAD
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-ink-500">
                    {f.answer}
=======
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-ink-500">
                    {f.a}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
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
