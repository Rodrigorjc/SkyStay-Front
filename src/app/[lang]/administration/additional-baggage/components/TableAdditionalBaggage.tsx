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
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.ID}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.NAME}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.WEIGHT}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.PRICE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.AIRLINE_NAME}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.id} isOdd={index % 2 === 0}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.weight}</TableCell>
                  <TableCell>{d.extraAmount}</TableCell>
                  <TableCell>{d.airline.name}</TableCell>
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
