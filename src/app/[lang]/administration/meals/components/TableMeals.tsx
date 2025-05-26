"use client";

import { useDictionary } from "@context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import { MealTableVO } from "../types/meal";

interface MealsTableProps {
  data: MealTableVO[];
  onRefresh: () => void;
}

export default function MealsTable({ data, onRefresh }: MealsTableProps) {
  const { dict } = useDictionary();

  return (
    <div>
      <section>
        <div className="mt-8 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.ADMINISTRATION.MEALS.CODE}</TableHead>
                <TableHead>{dict.ADMINISTRATION.MEALS.NAME}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d, index) => (
                <TableRow key={d.code} isOdd={index % 2 === 0}>
                  <TableCell>{d.code}</TableCell>
                  <TableCell>{d.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
