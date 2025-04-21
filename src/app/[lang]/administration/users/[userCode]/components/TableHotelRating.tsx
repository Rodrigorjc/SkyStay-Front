"use client";

import Button from "@/app/components/ui/Button";
import { useDictionary } from "@context";
import { HotelRatingVO } from "@/types/admin/hotelRating";

interface TableHotelRatingProps {
  data: HotelRatingVO[];
}

export default function TableHotelRating({ data }: TableHotelRatingProps) {
  const { dict } = useDictionary();
  return (
    <div>
      <section>
        <h3 className="my-4 text-2xl text-glacier-300">{dict.ADMINISTRATION.USERS.HOTEL_RATING}:</h3>
        <div className="overflow-auto">
          <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="text-left">
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.HOTEL_NAME}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.RATING}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.hotelName}>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.hotelName}</td>
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
