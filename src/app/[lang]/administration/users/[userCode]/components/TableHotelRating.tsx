"use client";

import { useDictionary } from "@context";
import { HotelRatingVO } from "../types/rating";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";

interface TableHotelRatingProps {
  data: HotelRatingVO[];
}

export default function TableHotelRating({ data }: TableHotelRatingProps) {
  const { dict } = useDictionary();
  return (
    <div>
      <section>
        <h3 className="my-4 text-2xl text-glacier-300">{dict.ADMINISTRATION.USERS.HOTEL_RATING}:</h3>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.AIRLANE_NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.RATING}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    {dict.ADMINISTRATION.NO_DATA_AVAILABLE}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((d, index) => (
                  <TableRow key={d.hotelName} isOdd={index % 2 === 0}>
                    <TableCell>{d.hotelName}</TableCell>
                    <TableCell>{d.rating}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
