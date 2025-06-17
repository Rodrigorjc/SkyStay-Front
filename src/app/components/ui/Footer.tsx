"use client";
import React from "react";
import { FaXTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa6";
import Image from "next/image";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import Link from "next/link";

const Footer: React.FC = () => {
  const lang = useLanguage();
  const { dict } = useDictionary();
  if (!dict) {
    return null;
  }
  const socialLinks = [
    { icon: <FaXTwitter size={20} />, href: "https://x.com" },
    { icon: <FaInstagram size={20} />, href: "https://instagram.com" },
    { icon: <FaFacebook size={20} />, href: "https://facebook.com" },
    { icon: <FaLinkedin size={20} />, href: "https://linkedin.com" },
  ];

  const pages = [
    { name: dict.CLIENT.FOOTER.FLIGHTS, href: "/flights" },
    { name: dict.CLIENT.FOOTER.ACCOMMODATION, href: "/hotels" },
    { name: dict.CLIENT.FOOTER.ABOUT, href: "/about" },
  ];

  const legalLinks = [
    { name: dict.CLIENT.FOOTER.PRIVACY_POLICY, href: `/${lang}/legal` },
    { name: dict.CLIENT.FOOTER.COOKIES_POLICY, href: `/${lang}/legal` },
    { name: dict.CLIENT.FOOTER.TERMS_OF_SERVICE, href: `/${lang}/legal` },
    { name: dict.CLIENT.FOOTER.LEGAL_NOTICE, href: `/${lang}/legal` },
  ];

  return (
    <footer className="w-full bg-glacier-500/50 backdrop-blur-md border-t border-white/20 text-white mt-10 pt-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-center md:text-left md:gap-10">
        <div className="flex flex-col items-center md:items-start">
          <Image src="/logo-footer.svg" alt="SkyStay Logo" width={100} height={50} className="mb-4 w-2/3" />
          <div className="flex gap-4 justify-center md:justify-start">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{dict.CLIENT.FOOTER.EXPLORE} </h4>
          <ul className="space-y-2 text-sm">
            {pages.map((page, i) => (
              <li key={i}>
                <a href={page.href} className="hover:underline hover:text-black transition">
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 ">{dict.CLIENT.FOOTER.CONTACT}</h4>
          <p className="text-sm mb-3  cursor-pointer">📧 skystay.info.eu@gmail.com</p>
          <p className="text-sm mb-3  cursor-pointer">📞 +34 682 319 080</p>
          <p className="text-sm  cursor-pointer">📍 C/ Tetuán 36, 41001 Sevilla</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{dict.CLIENT.FOOTER.LEGAL}</h4>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="hover:underline hover:text-black transition">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-white mt-10 pb-4 opacity-70">
        © {new Date().getFullYear()} SkyStay. {dict.CLIENT.FOOTER.TITLE}
      </div>
    </footer>
  );
};

export default Footer;
