import Button from "@/app/components/ui/Button";
import { useDictionary } from "@context";
import { AirplaneShowVO } from "../types/airplane";
import { useRouter } from "next/navigation";
interface Props {
  planes: AirplaneShowVO[];
}

export default function TablePlanes({ planes }: Props) {
  const { dict } = useDictionary();

  const router = useRouter();
  return (
    <div className="mt-4 overflow-auto">
      <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300  overflow-hidden overflow-x-scroll text-sm">
        <thead>
          <tr className="font-bold text-left text-sm">
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.CODE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.AIRPLANE_TYPE_NAME}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.MODEL}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.TYPE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.STATUS}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.IMAGE}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.AIRPLANES.CAPACITY}</th>
            <th className="border border-gray-300 px-4 py-2 bg-glacier-600 ">{dict.ADMINISTRATION.DETAILED_INFORMATION}</th>
          </tr>
        </thead>
        <tbody className="">
          {planes.map(plane => (
            <tr key={plane.code} className="hover:bg-zinc-700 transition text-center text-sm">
              <td className="border border-gray-300 px-4 py-2">{plane.code}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.airplaneType.manufacturer}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.airplaneType.name}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.model}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.registrationNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.yearOfManufacture}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.type}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.status}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.image?.url ? plane.image.url : "No hay imagen asociada"}</td>
              <td className="border border-gray-300 px-4 py-2">{plane.airplaneType.capacity}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  text={dict.ADMINISTRATION.SHOW}
                  onClick={e => {
                    router.push(`/es/administration/airplanes/${plane.code}`);
                  }}
                  color="light"
                  className="button w-fit"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
