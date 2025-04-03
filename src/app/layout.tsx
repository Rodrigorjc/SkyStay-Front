import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyStay",
  description: "Creado por: Antonio Nogues y Rodrigo Jaén",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        <link rel="icon" href="/favicon.png" />
    </head>
      <body>
        {children}
      </body>
    </html>
  );
}
