import { InfoCard } from "@/app/components/ui/admin/InfoCard";
import { useDictionary } from "@/app/context/DictionaryContext";

const AirplaneDetails = ({ airplaneInfo }: { airplaneInfo: any }) => {
  const { dict } = useDictionary();
  if (!airplaneInfo) return null;
  if (!dict) return null;

  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-screen-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <InfoCard label={dict.ADMINISTRATION.CODE} value={airplaneInfo.model} />
            <InfoCard label={dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER} value={airplaneInfo.registrationNumber} />
            <InfoCard label={dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE} value={airplaneInfo.yearOfManufacture} />
          </div>
          <div className="flex flex-col gap-4">
            <InfoCard label={dict.ADMINISTRATION.TYPE} value={airplaneInfo.type} />
            <InfoCard label={dict.ADMINISTRATION.STATUS} value={airplaneInfo.status} />
            <InfoCard label={dict.ADMINISTRATION.AIRPLANES.AIRLINE_NAME} value={airplaneInfo.airlineName} />
          </div>
          <div className="flex flex-col gap-4">
            <InfoCard label={dict.ADMINISTRATION.AIRPLANES.MANUFACTURER} value={airplaneInfo.airplaneType_manufacturer} />
            <InfoCard label={dict.ADMINISTRATION.CODE} value={airplaneInfo.airplaneType_code} />
            <InfoCard label={dict.ADMINISTRATION.AIRPLANES.CAPACITY} value={`${airplaneInfo.airplaneType_capacity} ${dict.ADMINISTRATION.AIRPLANES.PASSANGERS}`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirplaneDetails;
