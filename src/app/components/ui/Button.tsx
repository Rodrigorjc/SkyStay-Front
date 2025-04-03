"use client";

import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    variant?: "glacier" | "glacier_dark" | "glacier_light";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = "glacier", className = "" }) => {
    const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-400 hover:-translate-y-1 active:scale-95";
    const variants: { [key in "glacier" | "glacier_dark" | "glacier_light"]: string } = {
        glacier: "bg-glacier-500 text-white hover:bg-glacier-600 active:bg-glacier-700",
        glacier_dark: "bg-glacier-700 text-white hover:bg-glacier-800 active:bg-glacier-900",
        glacier_light: "bg-glacier-200 text-black hover:bg-glacier-300 active:bg-glacier-400",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;