"use client";

import { useDictionary } from "@context";
import AirportModalForm from "./AirportModalForm";
import AirportModalFormEdit from "./AirportModalFormEdit";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { AirportAdminVO } from "../types/airport";

interface AdminAirportsTableProps {
  data: AirportAdminVO[];
  onRefresh: () => void;
}

export default function AdminAirportsTable({ data, onRefresh }: AdminAirportsTableProps) {
  const { dict } = useDictionary();
  const [selectedAirport, setSelectedAirport] = useState<AirportAdminVO | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      {isCreateModalOpen && <AirportModalForm onClose={() => setIsCreateModalOpen(false)} />}
      {selectedAirport && (
        <AirportModalFormEdit
          defaultValues={{
            ...selectedAirport,
            city: selectedAirport.city.name,
          }}
          onClose={() => setSelectedAirport(null)}
        />
      )}

      <section>
        <div className="flex flex-row items-end gap-4">
          <Button
            text={dict.ADMINISTRATION.CREATE_AIRPORTS}
            onClick={() => {
              setSelectedAirport(null);
              setIsCreateModalOpen(true);
            }}
            color="admin"
          />
          <Button text={dict.ADMINISTRATION.RELOAD} onClick={onRefresh} color="admin" />
        </div>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.USERS.DETAILS.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.USERS.NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.DESCRIPTION}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.TERMINAL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.GATE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.LATITUDE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.LONGITUDE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.TIMEZONE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.COUNTRY}</TableHead>
                <TableHead>{dict.ADMINISTRATION.AIRPORTS.CITY}</TableHead>
                <TableHead>{dict.ADMINISTRATION.EDIT}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.code} isOdd={index % 2 === 0}>
                  <TableCell>{d.code}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="truncate max-w-sm" title={d.description}>
                    {d.description}
                  </TableCell>
                  <TableCell>{d.terminal}</TableCell>
                  <TableCell>{d.gate}</TableCell>
                  <TableCell>{d.latitude}</TableCell>
                  <TableCell>{d.longitude}</TableCell>
                  <TableCell>{d.timezone}</TableCell>
                  <TableCell>{d.city.country.name}</TableCell>
                  <TableCell>{d.city.name}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      text={dict.ADMINISTRATION.EDIT}
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setSelectedAirport(d);
                      }}
                      color="light"
                      className="text-xs px-4 py-2"
                    />
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
