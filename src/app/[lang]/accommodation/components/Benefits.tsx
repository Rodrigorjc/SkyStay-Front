"use client";

import React from 'react';
import { useDictionary } from '@context';

const BenefitsSection: React.FC = () => {
    const { dict } = useDictionary();

    const benefits = [
        {
            icon: '🧾',
            title: dict.CLIENT.BENEFITS.PAY_ON_SITE.TITLE,
            description: dict.CLIENT.BENEFITS.PAY_ON_SITE.DESCRIPTION,
        },
        {
            icon: '🌍',
            title: dict.CLIENT.BENEFITS.WORLDWIDE.TITLE,
            description: dict.CLIENT.BENEFITS.WORLDWIDE.DESCRIPTION,
        },
        {
            icon: '🕐',
            title: dict.CLIENT.BENEFITS.SUPPORT24.TITLE,
            description: dict.CLIENT.BENEFITS.SUPPORT24.DESCRIPTION,
        },
    ];

    if (!dict || !dict.CLIENT || !dict.CLIENT.BENEFITS) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl bg-black/40 backdrop-blur-sm border border-gray-800 hover:border-glacier-500"
                    >
                        <div className="p-6 flex flex-col items-center text-center text-white">
                            <div className="text-5xl mb-4 bg-gradient-to-r from-glacier-300 to-glacier-700 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                <p className="text-gray-300 text-sm">{benefit.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BenefitsSection;