import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={"en"}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <Script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" />
        <title>SkyStay</title>
      </head>
      <body className="bg-zinc-800">{children}</body>
    </html>
  );
}
