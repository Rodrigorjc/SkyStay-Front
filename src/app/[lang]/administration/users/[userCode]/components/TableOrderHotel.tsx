"use client";

import { OrderHotelVO } from "@/types/admin/orderHotel";
import { useDictionary } from "@context";

interface TableOrderHotelProps {
  data: OrderHotelVO[];
}

export default function TableOrderHotel({ data }: TableOrderHotelProps) {
  const { dict } = useDictionary();

  return (
    <div>
      <section>
        <h3 className="my-4 text-2xl text-glacier-300">{dict.ADMINISTRATION.USERS.DETAILS.HOTEL_ORDER}:</h3>
        <div className="overflow-auto">
          <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="text-left">
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.CODE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.ORDER_CODE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.AMOUNT}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.DISCOUNT}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.STATUS}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.BILL}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.order_code}>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.hotel_code}</td>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.order_code}</td>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.amount}</td>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.discount}</td>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.status}</td>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.bill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
