import { InfoCard } from "@/app/components/ui/admin/InfoCard";

const AirplaneDetails = ({ airplaneInfo }: { airplaneInfo: any }) => {
  if (!airplaneInfo) return null;

  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-screen-3xl">
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
