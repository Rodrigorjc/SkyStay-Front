"use client";

import { useDictionary } from "@context";
import { AirlineRatingVO } from "@/types/admin/airlineRating";

interface TableAirlaneRatingProps {
  data: AirlineRatingVO[];
}

export default function TableAirlineRating({ data }: TableAirlaneRatingProps) {
  const { dict } = useDictionary();

  return (
    <div>
      <section>
        <h3 className="my-4 text-2xl text-glacier-300">{dict.ADMINISTRATION.USERS.AIRLINE_RATING}:</h3>
        <div className="overflow-auto">
          <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="text-bold text-justify text-base">
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.AIRLANE_NAME}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.RATING}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.airlineName}>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.airlineName}</td>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
