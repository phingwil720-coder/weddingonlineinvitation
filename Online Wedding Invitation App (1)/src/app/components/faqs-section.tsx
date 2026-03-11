import { FAQ } from '../../lib/supabase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle } from 'lucide-react';
import { FloralDecoration } from './floral-decoration';

interface FAQsSectionProps {
  faqs: FAQ[];
  primaryColor: string;
}

export function FAQsSection({ faqs, primaryColor }: FAQsSectionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-16 bg-white bg-[#f9f4f3] relative overflow-hidden">
      <FloralDecoration variant="branch" position="top-left" size="md" opacity={0.28} color="#C3968C" />
      <FloralDecoration variant="flower" position="bottom-right" size="sm" opacity={0.25} color="#7A9173" />
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-10">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <HelpCircle className="h-8 w-8" style={{ color: primaryColor }} />
          </div>
          
          <h3 className="text-3xl mb-3 font-['Playfair_Display'] font-semibold text-foreground text-[#443730]">
            Frequently Asked Questions
          </h3>
          <p className="text-muted-foreground text-[#443730]">
            Here are answers to some common questions
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={faq.id || index} 
              value={`item-${index}`}
              className="bg-secondary rounded-2xl border border-border px-6 overflow-hidden bg-[#e4cec9]"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="text-base font-medium text-foreground pr-4 text-[#443730]">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}