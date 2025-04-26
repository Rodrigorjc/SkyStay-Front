"use client";

import { useDictionary } from "@context";
import { OrderApartmentVO } from "@/types/admin/orderApartment";

interface TableOrderApartmentProps {
  data: OrderApartmentVO[];
}

export default function TableOrderApartment({ data }: TableOrderApartmentProps) {
  const { dict } = useDictionary();

  return (
    <div>
      <section>
        <h3 className="my-4 text-2xl text-glacier-300">{dict.ADMINISTRATION.USERS.DETAILS.APARTMENT_ORDER}:</h3>
        <div className="overflow-auto">
          <table className="table-auto w-full border-separate border-spacing-0 border border-gray-300 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="text-bold text-justify text-base">
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.CODE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.ORDER_CODE}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.AMOUNT}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.DISCOUNT}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.STATUS}</th>
                <th className="border border-gray-300 px-4 py-2 bg-glacier-600 w-1/2">{dict.ADMINISTRATION.USERS.DETAILS.BILL}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.order_code}>
                  <td className="border border-gray-300 px-4 py-2 w-1/2">{d.apartment_code}</td>
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
