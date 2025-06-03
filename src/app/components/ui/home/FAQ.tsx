"use client";

import { useDictionary } from "@/app/context/DictionaryContext";
import React, { use, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { dict } = useDictionary();

  const faqData: FAQItem[] = [
    {
      question: dict.FAQ.QUESTION_1,
      answer: dict.FAQ.ANSWER_1,
    },
    {
      question: dict.FAQ.QUESTION_2,
      answer: dict.FAQ.ANSWER_2,
    },
    {
      question: dict.FAQ.QUESTION_3,
      answer: dict.FAQ.ANSWER_3,
    },
    {
      question: dict.FAQ.QUESTION_4,
      answer: dict.FAQ.ANSWER_4,
    },
    {
      question: dict.FAQ.QUESTION_5,
      answer: dict.FAQ.ANSWER_5,
    },
    {
      question: dict.FAQ.QUESTION_6,
      answer: dict.FAQ.ANSWER_6,
    },
    {
      question: dict.FAQ.QUESTION_7,
      answer: dict.FAQ.ANSWER_7,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-8 text-center ">{dict.FAQ.TITLE}</h2>
      <div className="space-y-4">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="w-full rounded-xl border border-glacier-500 bg-glacier-700/40 transition-all duration-200 flex flex-col border-collapse overflow-hidden text-sm ">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-white hover:bg-glacier-600/40 active:bg-glacier-800/40 ">
                <span className="flex-1">{item.question}</span>
                <span className="ml-4 text-xl shrink-0 hover:cursor-pointer">{isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}</span>
              </button>
              <div className={`px-6 text-white/90 text-sm overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 py-4" : "max-h-0 py-0"}`}>{isOpen && item.answer}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
