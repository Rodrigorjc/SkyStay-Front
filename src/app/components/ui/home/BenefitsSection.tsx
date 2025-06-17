"use client";
import React from "react";
import { FiShield, FiAirplay, FiThumbsUp } from "react-icons/fi";
import { FaBed } from "react-icons/fa";
import { useDictionary } from "@/app/context/DictionaryContext";

const BenefitsSection: React.FC = () => {
  const { dict } = useDictionary();
  if (!dict) {
    return null;
  }
  const benefits = [
    {
      icon: <FiAirplay size={32} className="text-glacier-400" />,
      title: dict.HOME.BENEFITS.FIRST.TITLE,
      description: dict.HOME.BENEFITS.FIRST.DESCRIPTION,
    },
    {
      icon: <FaBed size={32} className="text-glacier-400" />,
      title: dict.HOME.BENEFITS.SECOND.TITLE,
      description: dict.HOME.BENEFITS.SECOND.DESCRIPTION,
    },
    {
      icon: <FiShield size={32} className="text-glacier-400" />,
      title: dict.HOME.BENEFITS.THIRD.TITLE,
      description: dict.HOME.BENEFITS.THIRD.DESCRIPTION,
    },
    {
      icon: <FiThumbsUp size={32} className="text-glacier-400" />,
      title: dict.HOME.BENEFITS.FOURTH.TITLE,
      description: dict.HOME.BENEFITS.FOURTH.DESCRIPTION,
    },
  ];

  return (
    <section className="w-full py-8 text-white px-6">
      <div className="max-w-[1500px] mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{dict.HOME.BENEFITS.TITLE}</h2>
        <p className="text-lg text-gray-300 mb-12">{dict.HOME.BENEFITS.DESCRIPTION}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 backdrop-blur-md hover:bg-white/10">
              <div className="flex items-center justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
