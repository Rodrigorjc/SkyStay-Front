export const Title: React.FC<{ title: string }> = ({ title }) => (
  <header className="p-4 flex items-center justify-between">
    <h1 className="text-4xl font-extrabold text-glacier-500 tracking-tight">{title}</h1>
  </header>
);
