"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface Tab {
  id: string;
  label: string;
  icon: IconType;
  count?: number;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ProfileTabs({ tabs, activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-700 rounded-xl border border-glacier-700 p-2"
    >
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-glacier-600 text-white shadow-lg"
                : "text-glacier-300 hover:text-white hover:bg-zinc-600"
            }`}
          >
            <tab.icon className="text-lg" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id
                  ? "bg-white/20"
                  : "bg-glacier-600 text-white"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}