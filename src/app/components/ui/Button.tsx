"use client";

import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  text: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: "default" | "dark" | "light" | "admin";
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color = "default", className = "", disabled }) => {
  const baseStyles = "px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm cursor-pointer";
  const colors: { [key in "default" | "dark" | "light" | "admin"]: string } = {
    default: "bg-glacier-500 text-white hover:bg-glacier-400 active:bg-glacier-600",
    dark: "bg-glacier-700 text-white hover:bg-glacier-600 active:bg-glacier-800",
    light: "bg-glacier-200 text-black hover:bg-glacier-100 active:bg-glacier-300",
    admin: "bg-glacier-700/40 text-white border border-glacier-500 hover:bg-glacier-600/40 active:bg-glacier-800/40",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${colors[color]} ${className} ${disabled ? "disabled" : ""}`} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;

//Para usar el boton copiar este plantilla, remplazar el onClick para definir que hace el boton,
// className para estilos, text para el texto que lleva el boton y color para las variantes predefinidas
// <Button text="Hola mundo" onClick={() => console.log("Hola")} color="dark" className="button" />
