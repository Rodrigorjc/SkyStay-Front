import { ReactNode } from "react";

export const Table = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <table className={`w-full border-collapse rounded-2xl overflow-hidden text-sm  ${className}`}>{children}</table>
);

export const TableHeader = ({ children }: { children: ReactNode }) => <thead className="bg-glacier-600 text-white text-left">{children}</thead>;

export const TableBody = ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>;

export const TableRow = ({ children, isOdd }: { children: ReactNode; isOdd?: boolean }) => (
  <tr className={`text-left ${isOdd ? "bg-glacier-500/15" : "bg-glacier-600/15"} hover:bg-glacier-700/10 transition-colors`}>{children}</tr>
);

export const TableHead = ({ children }: { children: ReactNode }) => <th className="px-4 py-3 font-semibold truncate">{children}</th>;

export const TableCell = ({ children, className = "", title, colSpan }: { children: ReactNode; className?: string; title?: string; colSpan?: number }) => (
  <td className={`px-4 py-3 ${className}`} colSpan={colSpan}>
    <div title={title} className="truncate">
      {children}
    </div>
  </td>
);
