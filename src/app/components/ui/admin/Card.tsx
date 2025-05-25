import { ReactNode } from "react";

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => <div className={className}>{children}</div>;

interface CardHeaderProps {
  children: ReactNode;
  color?: "glacier";
  className?: string;
}

export const CardHeader = ({ children, color, className }: CardHeaderProps) => (
  <div className={`text-2xl font-semibold mb-6 text-center font-mono ${color === "glacier" ? "text-glacier-400" : "text-white"} ${className}`}>{children}</div>
);
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
