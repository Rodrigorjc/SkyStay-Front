import "../globals.css";
import { notFound } from "next/navigation";
import { DictionaryProvider } from "@context";

const SUPPORTED_LANGUAGES = ["en", "es"];

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  const { lang } = await Promise.resolve(params);

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
          <title>SkyStay</title>
      </head>
      <body className="bg-zinc-800">
        <DictionaryProvider lang={lang as "en" | "es"}>{children}</DictionaryProvider>
      </body>
    </html>
  );
}
