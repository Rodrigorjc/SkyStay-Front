import React from "react";

export const InputWithLabel = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string }>(({ label, id, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium mb-2 ml-0.5">
      {label}
    </label>
    <input ref={ref} id={id} {...props} autoComplete="off" className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800 focus:ring-0 focus:outline-none min-h-[50px]" />
  </div>
));

export const SelectWithLabel = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }>(({ label, id, children, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium mb-2 ml-0.5">
      {label}
    </label>
    <select ref={ref} id={id} {...props} className="border border-glacier-500 focus:ring-0 focus:outline-none p-3 rounded-xl transition text-white bg-zinc-800 min-h-[50px]">
      {children}
    </select>
  </div>
));
export const InputWithLabelAndSymbol = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string; symbol?: string }>(({ label, id, symbol, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium mb-2 ml-0.5">
      {label}
    </label>
    <div className="relative">
      <input ref={ref} id={id} {...props} autoComplete="off" className={`border border-glacier-500 p-3 pr-10 rounded-xl transition text-white bg-zinc-800 w-full focus:ring-0 focus:outline-none`} />
      {symbol && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm pointer-events-none">{symbol}</span>}
    </div>
  </div>
));

export const TextareaWithLabel = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }>(({ label, id, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <textarea
      ref={ref}
      id={id}
      {...props}
      autoComplete="off"
      className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800 max-h-44 resize-none  focus:ring-0 focus:outline-none"
    />
  </div>
));

export const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-white">
    {children}
  </label>
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ id, children, ...props }, ref) => (
  <select ref={ref} id={id} {...props} className="border border-glacier-500 focus:border-glacier-500 focus:ring-0 focus:outline-none p-3 rounded-xl transition text-white bg-zinc-800">
    {children}
  </select>
));
