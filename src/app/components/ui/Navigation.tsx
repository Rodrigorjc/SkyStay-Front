"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCaretRight } from "react-icons/fa";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      staggerDirection: 1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Navigation: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { dict } = useDictionary();
  const lang = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !pathname) return null;

  const pathSegments = pathname.split("/").filter(Boolean);
  const isLocalized = pathSegments[0] === lang;
  const filteredSegments = isLocalized ? pathSegments.slice(1) : pathSegments;

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!dict) {
    return null;
  }
  return (
    <motion.nav className="w-full max-w-[1850px] mx-auto px-4 mt-12 text-xl font-normal tracking-tight flex items-center flex-wrap" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.span variants={itemVariants} className="inline-flex items-center">
        <Link href="/" className={`${pathname === "/" || pathname === "/es" ? "text-glacier-500 underline font-semibold" : "text-gray-200"}`}>
          {dict.CLIENT.NAVIGATION.HOME}
        </Link>
      </motion.span>

      {filteredSegments.map((segment, index) => {
        const hrefSegments = isLocalized ? [lang, ...filteredSegments.slice(0, index + 1)] : filteredSegments.slice(0, index + 1);

        const href = `/${hrefSegments.join("/")}`;
        const isActive = pathname === href;

        return (
          <motion.span key={index} variants={itemVariants} className="inline-flex items-center">
            <FaCaretRight className="mx-2 text-gray-400 text-sm relative top-[1px]" />
            <Link href={href} className={isActive ? "text-glacier-500 underline font-semibold" : "text-gray-200"}>
              {capitalizeFirstLetter(segment)}
            </Link>
          </motion.span>
        );
      })}
    </motion.nav>
  );
};

export default Navigation;
