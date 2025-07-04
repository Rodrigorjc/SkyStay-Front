"use client";

import { useDictionary } from "@context";
import { OrderApartmentVO } from "@/app/[lang]/administration/users/[userCode]/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";

interface TableOrderApartmentProps {
  data: OrderApartmentVO[];
}

export default function TableOrderApartment({ data }: TableOrderApartmentProps) {
  const { dict } = useDictionary();

  return (
    <div>
      <section>
        <h3 className="my-4 text-2xl text-glacier-300">{dict.ADMINISTRATION.USERS.DETAILS.APARTMENT_ORDER}:</h3>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.ORDER_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.AMOUNT}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.DISCOUNT}</TableHead>
                <TableHead>{dict.ADMINISTRATION.STATUS}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.BILL}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {dict.ADMINISTRATION.NO_DATA_AVAILABLE}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((d, index) => (
                  <TableRow key={d.order_code} isOdd={index % 2 === 0}>
                    <TableCell>{d.apartment_code}</TableCell>
                    <TableCell>{d.order_code}</TableCell>
                    <TableCell>{d.amount}</TableCell>
                    <TableCell>{d.discount}</TableCell>
                    <TableCell>{d.status}</TableCell>
                    <TableCell>{d.bill}</TableCell>
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
