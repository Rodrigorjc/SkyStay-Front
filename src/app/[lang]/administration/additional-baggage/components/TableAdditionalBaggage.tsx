"use client";

import { useDictionary } from "@context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { AdditionalBaggageTableVO } from "../types/additional-baggage";
import ImageModal from "../../components/ImageModal";
import { useState } from "react";
import Button from "@/app/components/ui/Button";

interface AdditionalBaggageTableProps {
  data: AdditionalBaggageTableVO[];
  onRefresh: () => void;
}

export default function AdditionalBaggageTable({ data }: AdditionalBaggageTableProps) {
  const { dict } = useDictionary();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      <section>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.WEIGHT}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.PRICE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_PHONE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_EMAIL}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_WEBSITE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_IATA_CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_IMAGE}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.id} isOdd={index % 2 === 0}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.weight}</TableCell>
                  <TableCell>{d.extraAmount}</TableCell>
                  <TableCell>{d.airline.code}</TableCell>
                  <TableCell>{d.airline.name}</TableCell>
                  <TableCell>{d.airline.phone}</TableCell>
                  <TableCell>{d.airline.email}</TableCell>
                  <TableCell>{d.airline.website}</TableCell>
                  <TableCell>{d.airline.iataCode}</TableCell>
                  <TableCell>
                    <Button text={dict.ADMINISTRATION.SHOW} onClick={() => setSelectedImage(d.airline.image)} color="light" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
}
