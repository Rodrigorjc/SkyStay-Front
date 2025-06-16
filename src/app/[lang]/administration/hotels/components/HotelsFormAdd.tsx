"use client";

import React, { useCallback, useEffect, useState } from "react";
import { set, z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@components/admin/Card";
import Button from "@components/Button";
import { InputWithLabel, SelectWithLabel, TextareaWithLabel } from "@/app/components/ui/admin/Label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/admin/Table";
import Pagination from "@/app/components/ui/Pagination";
import { getAllCitiesPaginated } from "@/lib/services/administration.user.service";
import { CityTableVO } from "@/types/admin/city";
import { createHotel, getAllRoomConfigurations, getAllRoomType } from "../services/hotel.service";
import Modal from "@/app/components/ui/admin/Modal";
import { Notifications } from "@/app/interfaces/Notifications";
import { useDictionary } from "@/app/context/DictionaryContext";
import { RoomConfigurationVO } from "../types/hotel";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";

interface HotelsFormAddProps {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  isOpen?: boolean;
}

const roomSchema = z.object({
  type: z.string().min(1),
  total_rooms: z.number().min(1),
  capacity: z.number().min(1),
});

const formSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  website: z.string().min(1),
  description: z.string().min(1),
  cityId: z.number().min(1),
  rooms: z.array(roomSchema),
});

type FormValues = z.infer<typeof formSchema>;

const MultiStepForm: React.FC<HotelsFormAddProps> = ({ onClose, onSuccess }) => {
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

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const { dict } = useDictionary();

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllCitiesPaginated(20, page);
      setCities(response.objects);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_CITY_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_CITY_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  }, [page, dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_CITY_TITLE, dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_CITY_MESSAGE]);

  const fetchRoomConfigurations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllRoomConfigurations();
      setRoomConfigurations(response.response.objects);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_ROOM_CONFIGURATION_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_ROOM_CONFIGURATION_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  }, [dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_ROOM_CONFIGURATION_TITLE, dict.ADMINISTRATION.HOTEL.ERRORS.LOAD_ROOM_CONFIGURATION_MESSAGE]);

  useEffect(() => {
    fetchCities();
    fetchRoomConfigurations();
  }, [page, fetchCities, fetchRoomConfigurations]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const { register, handleSubmit, control, setValue, watch, trigger, getValues } = useForm<FormValues>({
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createHotel(getValues());
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.HOTELS.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.HOTELS.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTELS.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllRoomType();
      setRoomTypes(response.response.objects);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.HOTELS.ERRORS.LOAD_ROOM_TYPE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.LOAD_ROOM_TYPE_MESSAGE,
      });
    } finally {
      setLoading(false);
    }
  }, [dict.ADMINISTRATION.HOTELS.ERRORS.LOAD_ROOM_TYPE_TITLE, dict.ADMINISTRATION.HOTELS.ERRORS.LOAD_ROOM_TYPE_MESSAGE]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  useEffect(() => {
    const rooms = Array.from({ length: roomTypeCount }).map(() => ({
      type: "",
      total_rooms: 1,
      capacity: 1,
    }));
    setValue("rooms", rooms);
  }, [roomTypeCount, setValue]);

  return (
    <Modal onClose={onClose}>
      {step === 1 && (
        <Card>
          <CardHeader color="glacier">{dict.ADMINISTRATION.HOTELS.INFO}</CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputWithLabel id="name" label={dict.ADMINISTRATION.HOTELS.NAME} {...register("name")} />
              </div>
              <div>
                <InputWithLabel id="address" label={dict.ADMINISTRATION.HOTELS.ADDRESS} {...register("address")} />
              </div>
              <div>
                <InputWithLabel id="postalCode" label={dict.ADMINISTRATION.HOTELS.POSTAL_CODE} type="text" maxLength={5} {...register("postalCode")} />
              </div>
              <div>
                <InputWithLabel id="phone_number" label={dict.ADMINISTRATION.HOTELS.PHONE_NUMBER} maxLength={16} {...register("phone_number")} />
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
              <Button
                onClick={async () => {
                  const values = getValues();
                  let customError = false;

                  if (values.postalCode && values.postalCode.length > 5 && !/^\d{1,5}$/.test(values.postalCode)) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.POSTAL_CODE_LENGTH,
                    });
                    customError = true;
                  }
                  if (values.phone_number && /[^\d\s+]/.test(values.phone_number) && values.phone_number.length > 5 && values.phone_number.length <= 16) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.PHONE_NUMBER_FORMAT,
                    });
                    customError = true;
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (values.email && !emailRegex.test(values.email)) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.EMAIL_FORMAT,
                    });
                    customError = true;
                  }

                  const isValid = await trigger(["name", "address", "postalCode", "phone_number", "email", "website", "description"]);
                  if (!isValid || customError) {
                    if (!customError) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                      });
                    }
                    return;
                  }
                  setStep(2);
                }}
                color="light"
                text={dict.ADMINISTRATION.NEXT}
              />
            </div>
          </CardContent>
        </Card>
      )}
      {step === 2 && (
        <div>
          <CardHeader color="glacier">{dict.ADMINISTRATION.HOTELS.CHOOSE_CITY}</CardHeader>
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
            <Button
              onClick={async () => {
                const isValid = await trigger(["cityId"]);
                if (!isValid) {
                  setNotification({
                    tipo: "error",
                    titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                    code: 400,
                    mensaje: dict.ADMINISTRATION.HOTELS.ERRORS.REQUIRED_CITY_MESSAGE,
                  });
                  return;
                }
                setStep(3);
              }}
              color="light"
              text={dict.ADMINISTRATION.NEXT}
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <Card>
          <CardHeader color="glacier">{dict.ADMINISTRATION.HOTELS.ROOM_TYPES}</CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 w-full">
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
              <Button onClick={() => setStep(2)} color="light" text={dict.ADMINISTRATION.BACK} />
              <Button
                onClick={async () => {
                  const isValid = await trigger(["rooms", "rooms.0.type", "rooms.0.total_rooms", "rooms.0.capacity"]);
                  const values = getValues();
                  let customError = false;
                  if (
                    !values.rooms ||
                    values.rooms.length === 0 ||
                    values.rooms.some(room => !room.type || room.total_rooms === undefined || room.total_rooms === null || room.capacity === undefined || room.capacity === null)
                  ) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                    });
                    customError = true;
                  }

                  if (!isValid || customError) {
                    if (!customError) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                      });
                    }
                    return;
                  }
                  handleSubmit(onSubmit)();
                }}
                color="light"
                text={isSubmitting ? dict.ADMINISTRATION.SAVING : dict.ADMINISTRATION.SAVE}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </Modal>
  );
};

export default MultiStepForm;
