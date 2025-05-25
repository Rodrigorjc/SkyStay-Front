"use client";

import { useDictionary } from "@context";
import Button from "@/app/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { useRouter } from "next/navigation";
import { FlightsTableVO } from "../types/flight";

interface AdminFlightTableProps {
  data: FlightsTableVO[];
  onRefresh: () => void;
}

export default function AdminFlightsTable({ data, onRefresh }: AdminFlightTableProps) {
  const { dict } = useDictionary();
  const router = useRouter();

  const formatDate = (date?: Date) => (date ? new Date(date).toLocaleString() : "");

  return (
    <div>
      <section>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.DEPATURE_TIME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.STATUS}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.DATE_TIME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.DATE_TIME_ARRIVAL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.AIRLINE_NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.AIRLINE_IATA_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.DEPATURE_AIRPORT_NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.DEPATURE_AIRPORT_IATA_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.ARRIVAL_AIRPORT_NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.ARRIVAL_AIRPORT_IATA_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.AIRPLANE_MODEL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.FLIGHTS.AIRPLANE_REGISTRATION_NUMBER}</TableHead>
                <TableHead>{dict.ADMINISTRATION.DETAILED_INFORMATION}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.code} isOdd={index % 2 === 0}>
                  <TableCell>{d.code}</TableCell>
                  <TableCell>{d.departureTime}</TableCell>
                  <TableCell>{d.status}</TableCell>
                  <TableCell>{formatDate(d.dateTime)}</TableCell>
                  <TableCell>{formatDate(d.dateTimeArrival)}</TableCell>
                  <TableCell>{d.airline.name}</TableCell>
                  <TableCell>{d.airline.iataCode}</TableCell>
                  <TableCell>{d.departureAirport.name}</TableCell>
                  <TableCell className="truncate max-w-sm">{d.departureAirport.iataCode}</TableCell>
                  <TableCell>{d.arrivalAirport.name}</TableCell>
                  <TableCell className="truncate max-w-sm">{d.arrivalAirport.iataCode}</TableCell>
                  <TableCell>{d.airplane.model}</TableCell>
                  <TableCell>{d.airplane.registrationNumber}</TableCell>
                  <TableCell className="text-center">
                    <Button text={dict.ADMINISTRATION.SHOW} onClick={() => router.push(`flights/${d.code}`)} color="light" className="button w-fit" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
