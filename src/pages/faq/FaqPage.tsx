"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

const longLorem = (length: number) => {
  const base = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `;
  let text = "";
  while (text.length < length) text += base;
  return text.slice(0, length);
};

const faqMockData: Record<string, { question: string; answer: string }[]> = {
  "Rozpoczęcie roku szkolnego": [
    {
      question: "Jakie dokumenty są wymagane przy rozpoczęciu roku szkolnego?",
      answer: longLorem(300),
    },
    {
      question: "Procedura rejestracji nowych uczniów",
      answer: longLorem(600),
    },
    {
      question: "Szczegóły dotyczące adaptacji pierwszoklasistów",
      answer: longLorem(1200),
    },
    { question: "Plan lekcji i zmiany w grafiku", answer: longLorem(800) },
    {
      question: "Zasady bezpieczeństwa na terenie szkoły",
      answer: longLorem(400),
    },
  ],
  "Zakończenie roku szkolnego": [
    {
      question: "Jak wygląda procedura zakończenia roku szkolnego?",
      answer: longLorem(300),
    },
    {
      question: "Uroczystość wręczenia świadectw – harmonogram",
      answer: longLorem(1000),
    },
    {
      question: "Strój galowy – wytyczne dla uczniów i rodziców",
      answer: longLorem(500),
    },
    {
      question: "Zamknięcie bibliotek i oddawanie podręczników",
      answer: longLorem(600),
    },
    {
      question: "Podsumowanie działań edukacyjnych w mijającym roku",
      answer: longLorem(1500),
    },
  ],
  "Librus GO": [
    {
      question: "Funkcjonalności platformy Librus GO",
      answer: longLorem(300),
    },
    {
      question: "Instrukcja resetu hasła i odzyskiwania dostępu",
      answer: longLorem(1000),
    },
    {
      question: "Konfiguracja powiadomień push i e-mail",
      answer: longLorem(500),
    },
    {
      question: "Bezpieczeństwo danych i zasady RODO",
      answer: longLorem(2000),
    },
    {
      question: "Najczęstsze błędy i ich rozwiązywanie",
      answer: longLorem(400),
    },
  ],
};

const categories = Object.keys(faqMockData);

export const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="mx-auto rounded-xl shadow-lg  text-card-foreground">
      {/* CONTROL PANEL */}
      <div className="flex flex-wrap gap-2 border-b border-border mb-6 pb-2">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-selected={isActive}
              className={`group flex items-center px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
                isActive
                  ? "text-primary border-b-2 border-primary bg-background"
                  : "text-foreground hover:text-foreground"
              }`}
            >
              {isActive ? (
                <FolderOpen className="mr-2 w-4 h-4 text-primary" />
              ) : (
                <Folder className="mr-2 w-4 h-4 text-muted-foreground group-hover:text-foreground" />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      {/* HEADER */}
      <h1 className="text-xl font-extrabold text-foreground mb-6">
        FAQ — {activeCategory}
      </h1>

      {/* SHADCN ACCORDION */}
      <Accordion type="multiple" collapsible className="space-y-4">
        {faqMockData[activeCategory].map(({ question, answer }, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border border-border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold text-base text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-muted-foreground text-base leading-relaxed prose max-w-none">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
