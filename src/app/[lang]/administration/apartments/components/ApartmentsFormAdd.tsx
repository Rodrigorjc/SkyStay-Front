"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@components/admin/Card";
import Button from "@components/Button";
import { InputWithLabel, SelectWithLabel, TextareaWithLabel } from "@/app/components/ui/admin/Label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/admin/Table";
import Pagination from "@/app/components/ui/Pagination";
import { getAllCitiesPaginated } from "@/lib/services/administration.user.service";
import { CityTableVO } from "@/types/admin/city";
import { getAllRoomConfigurations, getAllRoomType } from "../../hotels/services/hotel.service";
import { createApartment } from "../services/apartment.service";
import Modal from "@/app/components/ui/admin/Modal";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificacionComponent from "@/app/components/ui/Notification";
import { useDictionary } from "@/app/context/DictionaryContext";
import { RoomConfigurationVO } from "../../hotels/types/hotel";

interface ApartmentsFormAddProps {
  onClose: () => void;
  onSuccess: () => void;
}

const roomSchema = z.object({
  type: z.string().min(1, "El tipo de habitación es obligatorio"),
  total_rooms: z.number().min(1, "Debe haber al menos 1 habitación"),
  capacity: z.number().min(1, "La capacidad debe ser al menos 1"),
});

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  postalCode: z.string().min(1, "El código postal es obligatorio"),
  phone_number: z.string().min(1, "El teléfono es obligatorio"),
  email: z.string().email("Debe ser un correo válido"),
  website: z.string().optional(),
  description: z.string().min(1, "La descripción es obligatoria"),
  cityId: z.number().min(1, "Debe seleccionar una ciudad"),
  rooms: z.array(roomSchema),
});

type FormValues = z.infer<typeof formSchema>;

const MultiStepForm: React.FC<ApartmentsFormAddProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState<CityTableVO[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  const [roomConfigurations, setRoomConfigurations] = useState<RoomConfigurationVO[]>([]);
  const [roomTypeCount, setRoomTypeCount] = useState(1);
  const [selectedCity, setSelectedCity] = useState<number | null>(0);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const { dict } = useDictionary();

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await getAllCitiesPaginated(20, page);
      setCities(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomConfigurations = async () => {
    setLoading(true);
    try {
      const response = await getAllRoomConfigurations();
      setRoomConfigurations(response.response.objects);
    } catch (error) {
      console.error("Error al obtener configuraciones de habitaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchRoomConfigurations();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      postalCode: "",
      phone_number: "",
      email: "",
      website: "",
      description: "",
      cityId: 0,
      rooms: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "rooms",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await createApartment({
        ...data,
        website: data.website || "",
      });
      console.log("Hotel creado:", response);
      onSuccess();
    } catch (error) {
      console.error("Error al crear el hotel:", error);
      setNotifications(prev => [
        ...prev,
        {
          tipo: "error",
          titulo: "Error al crear el hotel",
          mensaje: "Ocurrió un error al intentar guardar el hotel.",
          code: 500,
        },
      ]);
    }
  };

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const response = await getAllRoomType();
      setRoomTypes(response.response.objects);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const rooms = Array.from({ length: roomTypeCount }).map(() => ({
      type: "",
      total_rooms: 1,
      capacity: 1,
    }));
    setValue("rooms", rooms);
  }, [roomTypeCount, setValue]);

  return (
    <Modal onSubmit={handleSubmit(onSubmit)} onClose={onClose}>
      {step === 1 && (
        <Card>
          <CardHeader>{dict.ADMINISTRATION.APARTMENTS.INFO}</CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputWithLabel id="name" label={dict.ADMINISTRATION.HOTELS.NAME} {...register("name")} />
              </div>
              <div>
                <InputWithLabel id="address" label={dict.ADMINISTRATION.HOTELS.ADDRESS} {...register("address")} />
              </div>
              <div>
                <InputWithLabel id="postalCode" label={dict.ADMINISTRATION.HOTELS.POSTAL_CODE} {...register("postalCode")} />
              </div>
              <div>
                <InputWithLabel id="phone_number" label={dict.ADMINISTRATION.HOTELS.PHONE_NUMBER} {...register("phone_number")} />
              </div>
              <div>
                <InputWithLabel id="email" label={dict.ADMINISTRATION.HOTELS.EMAIL} {...register("email")} />
              </div>
              <div>
                <InputWithLabel id="website" label={dict.ADMINISTRATION.HOTELS.WEBSITE} {...register("website")} />
              </div>
              <div className="col-span-2">
                <TextareaWithLabel id="description" label={dict.ADMINISTRATION.HOTELS.DESCRIPTION} {...register("description")} maxLength={255} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} color="light" text={dict.ADMINISTRATION.NEXT} />
            </div>
          </CardContent>
        </Card>
      )}
      {step === 2 && (
        <div>
          <CardHeader>{dict.ADMINISTRATION.HOTELS.CHOOSE_CITY}</CardHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dict.ADMINISTRATION.HOTELS.NAME}</TableHead>
                  <TableHead>{dict.ADMINISTRATION.HOTELS.SELECT}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map(city => (
                  <TableRow key={city.id}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>
                      <Button
                        color={selectedCity === city.id ? "default" : "light"}
                        onClick={() => {
                          setSelectedCity(city.id);
                          setValue("cityId", city.id, { shouldValidate: false });
                        }}
                        text={selectedCity === city.id ? dict.ADMINISTRATION.HOTELS.SELECTED : dict.ADMINISTRATION.HOTELS.SELECT}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination page={page} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} onPageChange={handlePageChange} />

          <div className="flex justify-between">
            <Button onClick={() => setStep(1)} color="light" text={dict.ADMINISTRATION.BACK} />
            <Button onClick={() => setStep(3)} color="light" text={dict.ADMINISTRATION.NEXT} />
          </div>
        </div>
      )}
      {step === 3 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{dict.ADMINISTRATION.NEXT}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-64">
              <SelectWithLabel id="roomTypeCount" label={dict.ADMINISTRATION.HOTELS.NUMBER_ROOM_TYPES} onChange={e => setRoomTypeCount(Number(e.target.value))} defaultValue="1">
                {Array.from({ length: roomTypes.length }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1}
                  </option>
                ))}
              </SelectWithLabel>
            </div>

            {fields.map((field, index) => {
              const selectedTypes = fields.map((_, i) => watch(`rooms.${i}.type`)).filter((type, i) => type && i !== index);

              return (
                <div key={field.id} className="grid grid-cols-3 gap-4 border p-4 rounded-xl bg-zinc-700">
                  <div>
                    <SelectWithLabel id={`rooms.${index}.type`} label={dict.ADMINISTRATION.HOTELS.TYPES} {...register(`rooms.${index}.type` as const)}>
                      <option value="" disabled>
                        {dict.ADMINISTRATION.HOTELS.SELECT_TYPE}
                      </option>
                      {roomTypes
                        .filter(type => !selectedTypes.includes(type))
                        .map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </SelectWithLabel>
                  </div>
                  <div>
                    <InputWithLabel
                      id={`rooms.${index}.total_rooms`}
                      label={dict.ADMINISTRATION.HOTELS.TOTAL_ROOMS}
                      type="number"
                      {...register(`rooms.${index}.total_rooms`, { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <InputWithLabel id={`rooms.${index}.capacity`} label={dict.ADMINISTRATION.HOTELS.CAPACITY} type="number" {...register(`rooms.${index}.capacity`, { valueAsNumber: true })} />
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} color="light" text={dict.ADMINISTRATION.BACK} />
              <Button onClick={handleSubmit(onSubmit)} color="light" text={dict.ADMINISTRATION.SAVE} />
            </div>
          </CardContent>
        </Card>
      )}
      {step === 4 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{dict.ADMINISTRATION.NEXT}</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-64">
              <SelectWithLabel id="roomTypeCount" label={dict.ADMINISTRATION.HOTELS.NUMBER_ROOM_TYPES} onChange={e => setRoomTypeCount(Number(e.target.value))} defaultValue="1">
                {Array.from({ length: roomTypes.length }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1}
                  </option>
                ))}
              </SelectWithLabel>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} color="light" text={dict.ADMINISTRATION.BACK} />
              <Button onClick={handleSubmit(onSubmit)} color="light" text={dict.ADMINISTRATION.SAVE} />
            </div>
          </CardContent>
        </Card>
      )}
      {notifications.map((notification, index) => (
        <NotificacionComponent
          key={index}
          Notifications={notification}
          onClose={() => {
            setNotifications(prev => prev.filter((_, i) => i !== index));
          }}
        />
      ))}
    </Modal>
  );
};

export default MultiStepForm;
