import { ReactNode } from "react";

export const Card = ({ children }: { children: ReactNode }) => <div className=" ">{children}</div>;

export const CardHeader = ({ children }: { children: ReactNode }) => <div className="text-2xl font-semibold mb-6 text-center">{children}</div>;

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
