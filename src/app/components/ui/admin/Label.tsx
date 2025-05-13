import React from "react";

export const InputWithLabel = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string }>(({ label, id, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <input ref={ref} id={id} {...props} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800" />
  </div>
));

export const TextareaWithLabel = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }>(({ label, id, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <textarea ref={ref} id={id} {...props} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800 max-h-44 resize-none" />
  </div>
));

export const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-white">
    {children}
  </label>
);

export const SelectWithLabel = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }>(({ label, id, children, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <select ref={ref} id={id} {...props} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800">
      {children}
    </select>
  </div>
));
