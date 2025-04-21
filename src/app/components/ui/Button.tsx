"use client";

import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  text: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: "default" | "dark" | "light";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color = "default", className = "" }) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-400 hover:scale-105 active:scale-95";
  const colors: { [key in "default" | "dark" | "light"]: string } = {
    default: "bg-glacier-500 text-white active:bg-glacier-600",
    dark: "bg-glacier-700 text-white  active:bg-glacier-800",
    light: "bg-glacier-200 text-black active:bg-glacier-300",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${colors[color]} ${className}`}>
      {text}
    </button>
  );
};

export default Button;

//Para usar el boton copiar este plantilla, remplazar el onClick para definir que hace el boton,
// className para estilos, text para el texto que lleva el boton y color para las variantes predefinidas
// <Button text="Hola mundo" onClick={() => console.log("Hola")} color="dark" className="button" />
