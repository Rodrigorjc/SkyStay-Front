interface InfoCardProps {
  label: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl px-5 pb-5 pt-24 bg-zinc-900 text-white shadow-xl h-full border border-zinc-700 hover:border-glacier-400 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/30 to-zinc-900/80 pointer-events-none" />
    <div className="relative z-10">
      <h3 className="text-base text-glacier-400 font-semibold tracking-wide mb-1 font-mono uppercase">{label}</h3>
      <p className="text-lg text-zinc-200 font-medium">{value}</p>
    </div>
  </div>
);

const AirplaneDetails = ({ airplaneInfo }: { airplaneInfo: any }) => {
  if (!airplaneInfo) return null;

  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <InfoCard label="Modelo" value={airplaneInfo.model} />
            <InfoCard label="Número de Registro" value={airplaneInfo.registrationNumber} />
            <InfoCard label="Año de Fabricación" value={airplaneInfo.yearOfManufacture} />
          </div>
          <div className="flex flex-col gap-4">
            <InfoCard label="Tipo" value={airplaneInfo.type} />
            <InfoCard label="Estado" value={airplaneInfo.status} />
          </div>
          <div className="flex flex-col gap-4">
            <InfoCard label="Fabricante" value={airplaneInfo.airplaneType_manufacturer} />
            <InfoCard label="Código" value={airplaneInfo.airplaneType_code} />
            <InfoCard label="Capacidad" value={`${airplaneInfo.airplaneType_capacity} pasajeros`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirplaneDetails;
