"use client";

import { useCallback, useEffect, useState } from "react";
import { useDictionary } from "@context";
import LocationSelector from "@/app/components/ui/MapSelector";
import { Coordinates } from "@/types/common/coordinates";
import { getAllCities } from "@/lib/services/administration.user.service";
import { CityVO } from "@/types/admin/city";
import { createAirport } from "../services/airports.service";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { Notifications } from "@/app/interfaces/Notifications";
import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel, Select, SelectWithLabel, TextareaWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/ui/Loader";

interface Props {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  notifications?: Notifications | null;
}

const airportFormSchema = z.object({
  name: z.string().min(1),
  iataCode: z.string().min(1).max(3),
  description: z.string().min(1).max(255),
  terminal: z.string().min(1),
  gate: z.string().min(1),
  latitude: z.union([z.string(), z.number()]),
  longitude: z.union([z.string(), z.number()]),
  timezone: z.string().min(1),
  city: z.string().min(1),
});

type AirportFormValues = z.infer<typeof airportFormSchema>;

export default function AirportModalForm({ onClose, onSuccess }: Props) {
  const { dict } = useDictionary();
  const apiKey = process.env.NEXT_PUBLIC_TIMEZONE_API_KEY || "";

  const [notification, setNotification] = useState<Notifications | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseNotification = () => setNotification(null);

  const [cities, setCities] = useState<CityVO[]>([]);

  const { register, handleSubmit, setValue, watch, getValues, trigger } = useForm<AirportFormValues>({
    resolver: zodResolver(airportFormSchema),
    defaultValues: {
      name: "",
      iataCode: "",
      description: "",
      terminal: "",
      gate: "",
      latitude: "",
      longitude: "",
      timezone: "",
      city: "",
    },
  });

  const fetchCities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllCities();
      setCities(response.objects);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_MESSAGE,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dict]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleLocationChange = async ({ lat, lng }: Coordinates) => {
    setValue("latitude", lat.toString());
    setValue("longitude", lng.toString());
    try {
      const res = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data?.zoneName) {
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

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await createAirport(getValues());
      const notif: Notifications = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPORTS.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 200,
        mensaje: dict.ADMINISTRATION.AIRPORTS.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(notif);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPORTS.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPORTS.ERRORS.CREATION_FAILED_MESSAGE,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal onClose={onClose} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader color="glacier" className="pt-4">
            {dict.ADMINISTRATION.AIRPORTS.ADD_AIRPORT}
          </CardHeader>

          {isLoading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <CardContent className="grid gap-4 my-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <InputWithLabel id="name" label={dict.ADMINISTRATION.USERS.NAME} type="text" {...register("name")} />
                <InputWithLabel id="iataCode" label={dict.ADMINISTRATION.AIRPORTS.IATA_CODE} type="text" maxLength={3} {...register("iataCode")} />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <InputWithLabel id="terminal" label={dict.ADMINISTRATION.AIRPORTS.TERMINAL} type="text" {...register("terminal")} />
                <InputWithLabel id="gate" label={dict.ADMINISTRATION.AIRPORTS.GATE} type="text" {...register("gate")} />
              </div>
              <TextareaWithLabel id="description" label={dict.ADMINISTRATION.AIRPORTS.DESCRIPTION} maxLength={255} {...register("description")} />
              <LocationSelector onChange={handleLocationChange} />
              <div className="grid grid-cols-3 gap-4 w-full">
                <InputWithLabel id="latitude" label={dict.ADMINISTRATION.AIRPORTS.LATITUDE} type="text" {...register("latitude")} value={watch("latitude")} readOnly />
                <InputWithLabel id="longitude" label={dict.ADMINISTRATION.AIRPORTS.LONGITUDE} type="text" {...register("longitude")} value={watch("longitude")} readOnly />
                <InputWithLabel id="timezone" label={dict.ADMINISTRATION.AIRPORTS.TIMEZONE} type="text" {...register("timezone")} value={watch("timezone")} readOnly />
              </div>
              <div className="grid grid-cols-1 gap-4 w-full">
                <SelectWithLabel label={dict.ADMINISTRATION.AIRPORTS.CITY} {...register("city")} className="border border-glacier-500 p-3 rounded-xl transition text-white bg-zinc-800 w-full" required>
                  <option value="" disabled>
                    {dict.ADMINISTRATION.AIRPORTS.SELECT_CITY}
                  </option>
                  {cities
                    .filter((city: CityVO) => city.name && city.name.trim() !== "")
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((city: CityVO) => (
                      <option key={city.name} value={city.name}>
                        {city.name}, {city.country.name}.
                      </option>
                    ))}
                </SelectWithLabel>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  color="light"
                  text={dict.ADMINISTRATION.SAVE}
                  onClick={async e => {
                    e.preventDefault();
                    const isValid = await trigger();
                    if (!isValid) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                      });
                      return;
                    }
                    handleSubmit(onSubmit)();
                  }}
                />
              </div>
            </CardContent>
          )}
        </Card>
        {notification?.tipo === "error" && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
      </Modal>
    </>
  );
}
