import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "../data/faq.json";

function Faq() {
  const headerRef = useRef(null); // Separate ref for header
  const faqRef = useRef(null); // Separate ref for accordion
  const headerInView = useInView(headerRef);
  const faqInView = useInView(faqRef);

  return (
    <div className="flex flex-col  gap-16 mt-10">
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h1 className="mb-2 caveat text-3xl font-semibold text-white text-center md:text-5xl ">
          Need <span className="text-blue-500 caveat">Help</span>?
        </h1>
        <p className="  text-lg text-gray-500 md:text-center md:text-xl text-center">
          Frequently Asked Questions About Job Opportunities
        </p>
      </motion.header>

      <motion.div
        ref={faqRef}
        initial={{ opacity: 0, y: 50 }}
        animate={faqInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Accordion type="multiple" className="w-full flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}

export default Faq;
