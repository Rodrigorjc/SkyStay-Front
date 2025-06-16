import { notFound } from "next/navigation";
import { DictionaryProvider } from "@/app/context/DictionaryContext";
import { ReactNode } from "react";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

const SUPPORTED_LANGUAGES = ["en", "es"];

type LayoutProps = {
  children: ReactNode;
  params?: Promise<{ lang: "en" | "es" } | undefined>;
};

export default async function LangLayout({ children, params }: LayoutProps) {
  const resolvedParams = params ? await params : { lang: "es" };

  if (!resolvedParams || !SUPPORTED_LANGUAGES.includes(resolvedParams.lang)) {
    notFound();
  }

  return <DictionaryProvider lang={resolvedParams.lang as "en" | "es"}>{children}</DictionaryProvider>;
}
