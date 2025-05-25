import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import Button from "@/app/components/ui/Button";
import { createFlight, getAllAirlinesReduced, getAllAirplanesReduced, getAllAirportsReduced } from "../services/flight.service";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useDictionary } from "@/app/context/DictionaryContext";

interface FlightAddProps {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  isOpen?: boolean;
}

export const flightFormSchema = z.object({
  dateTime: z.string().min(1),
  dateTimeArrival: z.string().min(1),
  airlineId: z.number().min(1),
  departureAirportId: z.number().min(1),
  arrivalAirportId: z.number().min(1),
  airplaneId: z.number().min(1),
});

export type FlightFormValues = z.infer<typeof flightFormSchema>;

export default function ModalCreateFlight({ onClose, onSuccess }: FlightAddProps) {
  const { dict } = useDictionary();
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<Notifications | null>(null);

  const [airlines, setAirlines] = useState<any[]>([]);
  const [airplanes, setAirplanes] = useState<any[]>([]);
  const [airports, setAirports] = useState<any[]>([]);
  const [selectedAirline, setSelectedAirline] = useState<number | null>(null);
  const [selectedAirplane, setSelectedAirplane] = useState<number | null>(null);
  const [selectedDepartureAirport, setSelectedDepartureAirport] = useState<number | null>(null);
  const [selectedArrivalAirport, setSelectedArrivalAirport] = useState<number | null>(null);

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const minDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  useEffect(() => {
    async function fetchData() {
      try {
        const airlinesResponse = await getAllAirlinesReduced(100, 0);
        const airplanesResponse = await getAllAirplanesReduced(100, 0);
        const airportsResponse = await getAllAirportsReduced(100, 0);
        setAirlines(airlinesResponse.objects);
        setAirplanes(airplanesResponse.objects);
        setAirports(airportsResponse.objects);
      } catch (error) {
        setNotification({
          tipo: "error",
          titulo: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE,
          code: 500,
          mensaje: dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_MESSAGE,
        });
      }
    }
    fetchData();
  }, []);

  const handleCloseNotification = () => setNotification(null);

  const onSubmit = async (data: FlightFormValues) => {
    try {
      await createFlight(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.FLIGHTS.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.FLIGHTS.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const { register, handleSubmit, setValue, trigger, watch } = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      dateTime: "",
      dateTimeArrival: "",
      airlineId: 0,
      departureAirportId: 0,
      arrivalAirportId: 0,
      airplaneId: 0,
    },
  });

  useEffect(() => {
    if (selectedAirline) setValue("airlineId", selectedAirline);
    if (selectedAirplane) setValue("airplaneId", selectedAirplane);
    if (selectedDepartureAirport) setValue("departureAirportId", selectedDepartureAirport);
    if (selectedArrivalAirport) setValue("arrivalAirportId", selectedArrivalAirport);
  }, [selectedAirline, selectedAirplane, selectedDepartureAirport, selectedArrivalAirport, setValue]);

  function toDatetimeLocal(value: string) {
    if (!value) return "";
    return value.length >= 16 ? value.slice(0, 16) : value;
  }

  return (
    <>
      <Modal onClose={onClose} onSubmit={e => e.preventDefault()}>
        {step === 1 && (
          <Card>
            <CardHeader color="glacier">1. {dict.ADMINISTRATION.FLIGHTS.DEPARTURE_ARRIVAL_TIME}</CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <InputWithLabel id="dateTime" label={dict.ADMINISTRATION.FLIGHTS.TIME_DEPARTURED} type="datetime-local" min={minDateTime} {...register("dateTime")} />
                </div>
                <div className="flex-1">
                  <InputWithLabel
                    id="dateTimeArrival"
                    label={dict.ADMINISTRATION.FLIGHTS.TIME_ARRIVAL}
                    type="datetime-local"
                    min={watch("dateTime") ? toDatetimeLocal(watch("dateTime")) : minDateTime}
                    disabled={!watch("dateTime")}
                    {...register("dateTimeArrival")}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  color="light"
                  text={dict.ADMINISTRATION.CLEAR_ALL}
                  onClick={() => {
                    setValue("dateTime", "");
                    setValue("dateTimeArrival", "");
                  }}
                />
                <Button
                  onClick={async () => {
                    const salida = watch("dateTime");
                    const llegada = watch("dateTimeArrival");
                    const isValid = await trigger(["dateTime", "dateTimeArrival"]);
                    if (!isValid) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.INVALID_TIMES_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.REQUIRED_FIELDS_MESSAGE,
                      });
                      return;
                    }
                    if (salida && llegada && new Date(llegada) < new Date(salida)) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.INVALID_TIMES_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.INVALID_TIMES_MESSAGE,
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
            <CardHeader color="glacier">2. {dict.ADMINISTRATION.FLIGHTS.SELECT_AIRLINE}</CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRLINE.NAME}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airlines.map(airline => (
                      <TableRow key={airline.id}>
                        <TableCell>{airline.name}</TableCell>
                        <TableCell>
                          <Button
                            color={selectedAirline === airline.id ? "default" : "light"}
                            onClick={() => setSelectedAirline(airline.id)}
                            text={selectedAirline === airline.id ? dict.ADMINISTRATION.SELECTED : dict.ADMINISTRATION.SELECT}
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
                    if (!selectedAirline) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRLINE_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRLINE_MESSAGE,
                      });
                      return;
                    }
                    setStep(3);
                  }}
                  color="light"
                  text={dict.ADMINISTRATION.NEXT}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader color="glacier">3. {dict.ADMINISTRATION.FLIGHTS.SELECT_AIRPLANE}</CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRPLANES.MODEL}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airplanes.map(airplane => (
                      <TableRow key={airplane.id}>
                        <TableCell>{airplane.model}</TableCell>
                        <TableCell>
                          <Button
                            color={selectedAirplane === airplane.id ? "default" : "light"}
                            onClick={() => setSelectedAirplane(airplane.id)}
                            text={selectedAirplane === airplane.id ? dict.ADMINISTRATION.SELECTED : dict.ADMINISTRATION.SELECT}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setStep(2)} color="light" text={dict.ADMINISTRATION.BACK} />
                <Button
                  onClick={() =>
                    selectedAirplane
                      ? setStep(4)
                      : setNotification({
                          tipo: "error",
                          titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRCRAFT_TITLE,
                          code: 400,
                          mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRCRAFT_MESSAGE,
                        })
                  }
                  color="light"
                  text={dict.ADMINISTRATION.NEXT}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader color="glacier">4. {dict.ADMINISTRATION.FLIGHTS.SELECT_AIRPORTS}</CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRPORTS.ARPORT_NAME}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.FLIGHTS.TYPE}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airports.map(airport => (
                      <TableRow key={airport.id}>
                        <TableCell>{airport.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-4 items-center justify-start">
                            <Button
                              color={selectedDepartureAirport === airport.id ? "default" : "light"}
                              onClick={() => setSelectedDepartureAirport(airport.id)}
                              text={dict.ADMINISTRATION.FLIGHTS.DEPARTURE}
                            />
                            <Button
                              color={selectedArrivalAirport === airport.id ? "default" : "light"}
                              onClick={() => setSelectedArrivalAirport(airport.id)}
                              text={dict.ADMINISTRATION.FLIGHTS.ARRIVAL}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {selectedDepartureAirport === airport.id ? dict.ADMINISTRATION.FLIGHTS.DEPARTURE : selectedArrivalAirport === airport.id ? dict.ADMINISTRATION.FLIGHTS.ARRIVAL : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between mt-4">
                <Button onClick={() => setStep(3)} color="light" text={dict.ADMINISTRATION.BACK} />
                <Button
                  onClick={() => {
                    if (!selectedDepartureAirport || !selectedArrivalAirport) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRPORTS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRPORTS_MESSAGE,
                      });
                    } else if (selectedDepartureAirport === selectedArrivalAirport) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.SAME_AIRPORTS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.SAME_AIRPORTS_MESSAGE,
                      });
                    } else {
                      setStep(5);
                    }
                  }}
                  color="light"
                  text={dict.ADMINISTRATION.NEXT}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card className="px-2 py-1">
            <CardHeader color="glacier">5. {dict.ADMINISTRATION.SUMMARY}</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xl text-zinc-300 font-light my-4">
                <div>
                  <p className="text-glacier-400 font-mono text-base uppercase mb-1">{dict.ADMINISTRATION.FLIGHTS.TIME_DEPARTURED}</p>
                  <p>{watch("dateTime")}</p>
                </div>
                <div>
                  <p className="text-glacier-400 font-mono text-base uppercase mb-1">{dict.ADMINISTRATION.FLIGHTS.TIME_ARRIVAL}</p>
                  <p>{watch("dateTimeArrival")}</p>
                </div>
                <div>
                  <p className="text-glacier-400 font-mono text-base uppercase mb-1">{dict.ADMINISTRATION.FLIGHT_DETAILS.AIRLINE}</p>
                  <p>{airlines.find(a => a.id === selectedAirline)?.name}</p>
                </div>
                <div>
                  <p className="text-glacier-400 font-mono text-base uppercase mb-1">{dict.ADMINISTRATION.FLIGHTS.AIRPLANE_MODEL}</p>
                  <p>{airplanes.find(a => a.id === selectedAirplane)?.model}</p>
                </div>

                <div>
                  <p className="text-glacier-400 font-mono text-base uppercase mb-1">{dict.ADMINISTRATION.FLIGHTS.DEPARTURE_AIRPORT}</p>
                  <p>{airports.find(a => a.id === selectedDepartureAirport)?.name}</p>
                </div>
                <div>
                  <p className="text-glacier-400 font-mono text-base uppercase mb-1">{dict.ADMINISTRATION.FLIGHTS.ARRIVAL_AIRPORT}</p>
                  <p>{airports.find(a => a.id === selectedArrivalAirport)?.name}</p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button onClick={() => setStep(4)} color="dark" text={dict.ADMINISTRATION.BACK} />
                <Button onClick={handleSubmit(onSubmit)} color="light" text={dict.ADMINISTRATION.SAVE} />
              </div>
            </CardContent>
          </Card>
        )}
      </Modal>

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </>
  );
}
