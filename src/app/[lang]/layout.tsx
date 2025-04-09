import "../globals.css";

import { DictionaryProvider } from "@context";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "es" }>;
}>) {
  return (
    <html lang={(await params).lang}>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="bg-zinc-800">
        <DictionaryProvider>{children}</DictionaryProvider>
      </body>
    </html>
  );
}
