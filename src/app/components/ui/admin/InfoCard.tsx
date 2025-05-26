interface InfoCardProps {
  label: string;
  value: string | number;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl px-5 pb-5 pt-24 bg-zinc-900 text-white shadow-xl h-full border border-zinc-700 hover:border-glacier-400 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/30 to-zinc-900/80 pointer-events-none" />
    <div className="relative z-10">
      <h3 className="text-base text-glacier-400 font-semibold tracking-wide mb-1 font-mono uppercase">{label}</h3>
      <p className="text-lg text-zinc-200 font-medium">{value}</p>
    </div>
  </div>
);

export const InfoCardHotel: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl px-5 pb-5 pt-24 bg-zinc-900 text-white shadow-xl h-full border border-zinc-700 hover:border-glacier-400 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/30 to-zinc-900/80 pointer-events-none" />
    <div className="relative z-10">
      <h3 className="text-sm text-glacier-400 font-semibold tracking-wide mb-1 font-mono uppercase">{label}</h3>
      <p className="text-lg text-zinc-200 font-medium">{value}</p>
    </div>
  </div>
);

export const InfoCardLight: React.FC<InfoCardProps> = ({ label, value }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl px-5 pb-5 pt-24 bg-glacier-600/10 text-gray-800 shadow-md h-full border border-glacier-500/20 hover:border-glacier-400 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-glacier-600/20 to-glacier-500/40 pointer-events-none" />
    <div className="relative z-10">
      <h3 className="text-base text-white font-semibold tracking-wide mb-1 font-mono uppercase">{label}</h3>
      <p className="text-lg text-white/70 font-medium">{value}</p>
    </div>
  </div>
);

export const InfoCardFlight: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="bg-zinc-800 rounded-xl shadow-md border border-zinc-700 hover:border-glacier-400 transition-all px-4 py-6">
    <h4 className="text-sm font-mono text-glacier-400 uppercase mb-2">{label}</h4>
    <div className="text-base text-zinc-200 font-medium">{value}</div>
  </div>
);
