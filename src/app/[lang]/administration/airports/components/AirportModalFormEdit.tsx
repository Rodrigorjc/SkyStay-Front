"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";
import StepsForm from "@/app/components/ui/admin/StepsForm";
import { useCallback, useEffect, useState } from "react";
import { useDictionary } from "@context";
import LocationSelector from "@/app/components/ui/MapSelector";
import { Coordinates } from "@/types/common/coordinates";
import { getAllCities } from "@/lib/services/administration.user.service";
import { CityVO } from "@/types/admin/city";
import { AirportFormEdit } from "../types/airport";
import { updateAirport } from "../services/airports.service";
import { ResponseVO } from "@/types/common/response";
import { Notifications } from "@/app/interfaces/Notifications";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";

interface Props {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  defaultValues: AirportFormEdit;
}

export const airportFormSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  iataCode: z.string().min(1),
  description: z.string().min(1),
  terminal: z.string().min(1),
  gate: z.string().min(1),
  latitude: z.union([z.number(), z.string()]),
  longitude: z.union([z.number(), z.string()]),
  timezone: z.string().min(1),
  city: z.string().min(1),
});

export type AirportFormValues = z.infer<typeof airportFormSchema>;

export default function AirportModalFormEdit({ onClose, onSuccess, defaultValues }: Props) {
  const { dict } = useDictionary();
  const apiKey = process.env.NEXT_PUBLIC_TIMEZONE_API_KEY || "";

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const [formData, setFormData] = useState<AirportFormEdit>(defaultValues);
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState<CityVO[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(defaultValues.city || "");

  const { handleSubmit, register, setValue, trigger, getValues } = useForm<AirportFormValues>({
    resolver: zodResolver(airportFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (selectedCity) setValue("city", selectedCity);
  }, [selectedCity, setValue]);

  const onSubmit = async () => {
    try {
      await updateAirport(getValues());
      const notificationSuccess = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPORTS.SUCCESS.EDIT_SUCCESS_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.AIRPORTS.SUCCESS.EDIT_SUCCESS_MESSAGE,
      };
      onSuccess(notificationSuccess);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPORTS.ERRORS.EDIT_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPORTS.ERRORS.EDIT_MESSAGE,
      });
    }
  };

  const handleLocationChange = async ({ lat, lng }: Coordinates) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    try {
      const res = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data?.zoneName) {
        setFormData(prev => ({
          ...prev,
          timezone: data.zoneName,
        }));
        setValue("timezone", data.zoneName);
      }
    } catch (err) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_MESSAGE,
      });
    }
  };

  const fetchCities = useCallback(async () => {
    try {
      const response = await getAllCities();
      setCities(response.objects.flat());
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_MESSAGE,
      });
    }
  }, [dict]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return (
    <>
      <Modal onClose={onClose}>
        {step === 1 && (
          <Card>
            <CardHeader color="glacier" className="pt-4">
              {dict.ADMINISTRATION.AIRPORTS.ADD_AIRPORT}
            </CardHeader>
            <StepsForm step={step} totalSteps={2} />
            <CardContent className="grid gap-4 my-4">
              <div className="flex flex-col gap-4 w-full">
                <InputWithLabel id="code" label="Código" type="text" {...register("code")} />
                <InputWithLabel id="name" label="Nombre" type="text" {...register("name")} />
                <InputWithLabel id="iataCode" label="IATA" type="text" {...register("iataCode")} />
                <InputWithLabel id="description" label="Descripción" type="text" {...register("description")} />
                <InputWithLabel id="terminal" label="Terminal" type="text" {...register("terminal")} />
                <InputWithLabel id="gate" label="Puerta" type="text" {...register("gate")} />
                <div>
                  <label className="mb-1 block">Ubicación en el mapa</label>
                  <LocationSelector
                    onChange={handleLocationChange}
                    initialPosition={{
                      lat: Number(formData.latitude),
                      lng: Number(formData.longitude),
                    }}
                  />
                </div>
                <InputWithLabel id="latitude" label="Latitud" type="text" value={formData.latitude} readOnly />
                <InputWithLabel id="longitude" label="Longitud" type="text" value={formData.longitude} readOnly />
                <InputWithLabel id="timezone" label="Zona horaria" type="text" value={formData.timezone} readOnly />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={async () => {
                    const isValid = await trigger(["code", "name", "iataCode", "latitude", "longitude", "timezone"]);
                    if (!isValid) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                      });
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
          <Card>
            <CardHeader color="glacier">
              {step}. {dict.ADMINISTRATION.AIRPORTS.SELECT_CITY}
            </CardHeader>
            <StepsForm step={step} totalSteps={2} />
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRPORTS.CITY}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cities?.map(city => (
                      <TableRow key={city.name}>
                        <TableCell>{city.name}</TableCell>
                        <TableCell>
                          <Button
                            color={selectedCity.trim().toLowerCase() === city.name.trim().toLowerCase() ? "default" : "light"}
                            onClick={() => setSelectedCity(city.name)}
                            text={selectedCity.trim().toLowerCase() === city.name.trim().toLowerCase() ? dict.ADMINISTRATION.SELECTED : dict.ADMINISTRATION.SELECT}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setStep(1)} color="light" text={dict.ADMINISTRATION.BACK} />
                <Button
                  onClick={() => {
                    if (!selectedCity) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.AIRPORTS.ERRORS.SELECT_CITY_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.AIRPORTS.ERRORS.SELECT_CITY_MESSAGE,
                      });
                      return;
                    }
                    setValue("city", selectedCity);
                    handleSubmit(onSubmit)();
                  }}
                  color="light"
                  text={dict.ADMINISTRATION.NEXT}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </Modal>
      {notification?.tipo === "error" && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </>
  );
}
