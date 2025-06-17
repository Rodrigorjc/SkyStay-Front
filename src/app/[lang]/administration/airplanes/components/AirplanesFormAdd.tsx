"use client";

import { useCallback, useEffect, useState } from "react";
import { useDictionary } from "@context";
import {
  createAirplanePart1,
  createAirplanePart2,
  getAllAirlines,
  getAllAirplanesSeatClases,
  getAllAirplanesStatus,
  getAllAirplanesTypes,
  getAllAirplanesTypesEmun,
  getAllSeatConfigurations,
} from "../services/airplane.service";
import { AirplaneForm2VO, AirplanesTypesFormVO, SeatConfigurationVO } from "../types/airplane";
import Loader from "@/app/components/ui/Loader";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import Modal from "@/app/components/ui/admin/Modal";
import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import StepsForm from "@/app/components/ui/admin/StepsForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import Button from "@/app/components/ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputWithLabel, SelectWithLabel } from "@/app/components/ui/admin/Label";
import { AirlineReducedVO } from "../../flights/types/common";

interface Props {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
  notifications?: Notifications | null;
}

export const AirplaneFormSchema = z.object({
  airplane_type_id: z.number().min(0),
  airline_id: z.number().min(0),
  model: z.string().min(1),
  registrationNumber: z.string().min(1),
  yearOfManufacture: z.number().min(1900).max(new Date().getFullYear()),
  status: z.string().min(1),
  type: z.string().min(1),
});

export type AirplaneForm1ValuesVO = z.infer<typeof AirplaneFormSchema>;

export default function AirplaneModalForm({ onClose, onSuccess }: Props) {
  const { dict } = useDictionary();

  const { handleSubmit, register, setValue, trigger, getValues } = useForm<AirplaneForm1ValuesVO>({
    resolver: zodResolver(AirplaneFormSchema),
    defaultValues: {
      airplane_type_id: undefined,
      model: undefined,
      registrationNumber: undefined,
      yearOfManufacture: undefined,
      status: undefined,
      type: undefined,
    },
  });

  // Variables generales
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Enumerados de la API
  const [airplaneTypesEnum, setAirplaneTypesEnum] = useState<[string]>();
  const [airplaneStatuses, setAirplaneStatuses] = useState<[string]>();
  const [airplaneTypes, setAirplaneTypes] = useState<[AirplanesTypesFormVO]>();
  const [seatConfiguration, setSeatConfiguration] = useState<[SeatConfigurationVO]>();
  const [airlines, setAirlines] = useState<[AirlineReducedVO]>();
  const [airplaneSeatClasses, setAirplaneSeatClasses] = useState<string[]>([]);
  const [idAirplane, setAirplaneId] = useState<number>(0);
  const [numberOfCabins, setNumberOfCabins] = useState<number>(1);
  const [cabinsData, setCabinsData] = useState<AirplaneForm2VO[]>([]);
  const [selectedAirplaneType, setSelectedAirplaneType] = useState<number | null>(null);
  const [selectedSeatConfigurations, setSelectedSeatConfigurations] = useState<number[]>([]);

  const [capacity, setCapacity] = useState<number>(0);
  const [remainingSeats, setRemainingSeats] = useState<number>(0);

  const [selectedAirline, setSelectedAirline] = useState<number | null>(null);
  useEffect(() => {
    if (selectedAirplaneType) setValue("airplane_type_id", selectedAirplaneType);
  }, [selectedAirplaneType, setValue]);

  useEffect(() => {
    if (selectedAirline) setValue("airline_id", selectedAirline);
  }, [selectedAirline, setValue]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const seatClassesResponse = await getAllAirplanesSeatClases();
      const typesResponse = await getAllAirplanesTypesEmun();
      const statusesResponse = await getAllAirplanesStatus();
      const airplaneTypes = await getAllAirplanesTypes();
      const seatConfigurationResponse = await getAllSeatConfigurations();
      const allAirlinesResponse = await getAllAirlines();
      setAirplaneSeatClasses(seatClassesResponse.response.objects);
      setAirplaneTypesEnum(typesResponse.response.objects);
      setAirplaneStatuses(statusesResponse.response.objects);
      setAirplaneTypes(airplaneTypes.response.objects);
      setSeatConfiguration(seatConfigurationResponse.response.objects);
      setAirlines(allAirlinesResponse.response.objects);

      setCabinsData([
        {
          airplane_id: idAirplane,
          seat_configuration_id: 0,
          seat_class: "",
          rowStart: 0,
          rowEnd: 0,
        },
      ]);
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
  }, [dict, idAirplane]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNumberOfCabinsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfCabins(value);

    setCabinsData(
      Array.from({ length: value }, () => ({
        airplane_id: idAirplane,
        seat_configuration_id: 0,
        airplane_cabin_id: 0,
        seat_class: "",
        rowStart: 0,
        rowEnd: 0,
      }))
    );

    setSelectedSeatConfigurations(Array(value).fill(null));
  };

  useEffect(() => {
    const totalAssignedSeats = cabinsData.reduce((sum, cabin) => {
      const rowStart = cabin.rowStart || 0;
      const rowEnd = cabin.rowEnd || 0;

      // Validar que rowStart y rowEnd sean válidos
      if (rowStart <= 0 || rowEnd <= 0 || rowEnd < rowStart) {
        return sum; // Ignorar esta cabina si los valores no son válidos
      }

      const rows = rowEnd - rowStart + 1;
      const seatPattern = seatConfiguration?.find(config => config.id === cabin.seat_configuration_id)?.seatPattern;

      // Calcular asientos por fila
      const seatsPerRow = seatPattern ? getSeatsPerRow(seatPattern) : 0;

      // Sumar al total solo si los valores son válidos
      return sum + (rows > 0 ? rows * seatsPerRow : 0);
    }, 0);

    setRemainingSeats(capacity - totalAssignedSeats);
  }, [cabinsData, capacity, seatConfiguration]);

  const handleSeatConfigurationSelection = (cabinIndex: number, configIndex: number, config: any) => {
    setSelectedSeatConfigurations(prev => {
      const updatedSelections = [...prev];
      updatedSelections[cabinIndex] = configIndex;
      return updatedSelections;
    });

    setCabinsData(prev => {
      const updatedCabins = [...prev];
      updatedCabins[cabinIndex] = {
        ...updatedCabins[cabinIndex],
        seat_configuration_id: config.id,
      };
      return updatedCabins;
    });
  };

  const handleCabinDataChange = (index: number, field: string, value: any) => {
    const updatedCabins = [...cabinsData];
    updatedCabins[index] = { ...updatedCabins[index], [field]: value };

    const totalAssignedSeats = updatedCabins.reduce((sum, cabin) => {
      const rows = cabin.rowEnd - cabin.rowStart + 1;
      const seatPattern = seatConfiguration?.find(config => config.id === cabin.seat_configuration_id)?.seatPattern;

      const seatsPerRow = seatPattern ? getSeatsPerRow(seatPattern) : 0;
      return sum + (rows > 0 ? rows * seatsPerRow : 0);
    }, 0);

    if (totalAssignedSeats <= capacity) {
      setCabinsData(updatedCabins);
    } else {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.EXCEEDS_CAPACITY,
      });
    }
  };

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const handleSuccess = (notif: Notifications) => {
    onClose();
    if (onSuccess) onSuccess(notif);
    setNotification(notif);
  };

  const handleSubmitStep1 = async (form: AirplaneForm1ValuesVO) => {
    try {
      const data = await createAirplanePart1(form);
      setAirplaneId(data.response.objects);
      setStep(4);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const handleSubmitStep2 = async () => {
    setIsLoading(true);
    try {
      const formattedCabinsData = cabinsData.map(cabin => ({
        airplane_id: idAirplane,
        seat_configuration_id: cabin.seat_configuration_id,
        seat_class: cabin.seat_class,
        rowStart: cabin.rowStart,
        rowEnd: cabin.rowEnd,
      }));
      await createAirplanePart2(formattedCabinsData);
      handleSuccess({
        tipo: "success",
        titulo: dict.ADMINISTRATION.AIRPLANES.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.AIRPLANES.SUCCESS.CREATION_SUCCESS_MESSAGE,
      });
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.CREATION_FAILED_MESSAGE,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para calcular el número de asientos por fila
  const getSeatsPerRow = (seatPattern: string): number => {
    return (seatPattern.match(/[A-Z]/g) || []).length;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRPLANES.AIRPLANES_CODE}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.AIRPLANES.CAPACITY}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.AIRPLANES.MANUFACTURER}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airplaneTypes?.map(type => (
                      <TableRow key={type.id}>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>{type.capacity}</TableCell>
                        <TableCell>{type.manufacturer}</TableCell>
                        <TableCell>
                          <Button
                            color={selectedAirplaneType === type.id ? "default" : "light"}
                            onClick={() => {
                              setSelectedAirplaneType(type.id);
                              setCapacity(type.capacity);
                            }}
                            text={selectedAirplaneType === type.id ? dict.ADMINISTRATION.SELECTED : dict.ADMINISTRATION.SELECT}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => {
                    if (!selectedAirplaneType) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRLINE_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.FLIGHTS.ERRORS.MISSING_AIRLINE_MESSAGE,
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
          </>
        );
      case 2:
        return (
          <>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRLINE.CODE}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.AIRLINE.NAME}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airlines?.map(type => (
                      <TableRow key={type.id}>
                        <TableCell>{type.id}</TableCell>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>
                          <Button
                            color={selectedAirline === type.id ? "default" : "light"}
                            onClick={() => {
                              setSelectedAirline(type.id);
                              setValue("airline_id", type.id);
                            }}
                            text={selectedAirline === type.id ? dict.ADMINISTRATION.SELECTED : dict.ADMINISTRATION.SELECT}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => {
                    if (!selectedAirplaneType) {
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
          </>
        );
      case 3:
        return (
          <>
            <CardContent>
              {/* Modelo del avión (compañia) */}
              <div className="flex flex-col gap-4">
                <InputWithLabel id="model" label={dict.ADMINISTRATION.AIRPLANES.MODEL} type="text" placeholder={dict.ADMINISTRATION.AIRPLANES.MODEL} {...register("model")} />
                <InputWithLabel
                  id="registrationNumber"
                  label={dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}
                  type="text"
                  placeholder={dict.ADMINISTRATION.AIRPLANES.REGISTRATION_NUMBER}
                  {...register("registrationNumber")}
                />
                <InputWithLabel
                  id="yearOfManufacture"
                  label={dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}
                  type="number"
                  placeholder={dict.ADMINISTRATION.AIRPLANES.YEAR_OF_MANUFACTURE}
                  {...register("yearOfManufacture", { valueAsNumber: true })}
                />

                {/* Estado */}
                <SelectWithLabel id="status" label={dict.ADMINISTRATION.STATUS} required {...register("status")}>
                  <option value="" disabled>
                    {dict.ADMINISTRATION.STATUS}
                  </option>
                  {airplaneStatuses?.map((status: string) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectWithLabel>

                {/* Tipo de Avión */}
                <SelectWithLabel id="type" label={dict.ADMINISTRATION.TYPE} required {...register("type")}>
                  <option value="" disabled>
                    {dict.ADMINISTRATION.TYPE}
                  </option>
                  {airplaneTypesEnum?.map((type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </SelectWithLabel>
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={() => setStep(2)} color="light" text={dict.ADMINISTRATION.BACK} />
                <Button
                  onClick={async () => {
                    console.log(getValues());
                    const isValid = await trigger(["registrationNumber", "yearOfManufacture", "status", "type"]);
                    if (getValues("yearOfManufacture") < 1900 || getValues("yearOfManufacture") > new Date().getFullYear()) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.YEAR_OF_MANUFACTURE_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.YEAR_OF_MANUFACTURE_MESSAGE,
                      });
                      return;
                    }
                    if (!isValid) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_MESSAGE,
                      });
                      return;
                    }
                    handleSubmit(handleSubmitStep1)();
                  }}
                  color="light"
                  text={dict.ADMINISTRATION.NEXT}
                />
              </div>
            </CardContent>
          </>
        );
      case 4:
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">{dict.ADMINISTRATION.AIRPLANES.REMAINING_SEATS}</label>
              <div className="text-lg font-semibold text-glacier-500">
                {dict.ADMINISTRATION.AIRPLANES.SEATS_REMAINING}: {remainingSeats}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <SelectWithLabel id="numberOfCabins" label={dict.ADMINISTRATION.AIRPLANES.NUMBER_OF_CABINS} value={numberOfCabins} onChange={e => handleNumberOfCabinsChange(e)} required>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </SelectWithLabel>
            </div>

            {cabinsData.map((cabin, index) => (
              <div key={index} className="border-b-2 border-transparent">
                <div className="col-span-2 flex flex-col my-2">
                  <h1 className="text-xl font-medium">
                    {dict.ADMINISTRATION.AIRPLANES.AIRPLANE_CABIN}: {index + 1}
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputWithLabel
                    id={`rowStart-${index}`}
                    label={dict.ADMINISTRATION.AIRPLANES.ROW_START}
                    type="number"
                    placeholder={dict.ADMINISTRATION.AIRPLANES.ROW_START}
                    value={cabin.rowStart || ""}
                    onChange={e => handleCabinDataChange(index, "rowStart", parseInt(e.target.value, 10) || "")}
                  />
                  <InputWithLabel
                    id={`rowEnd-${index}`}
                    label={dict.ADMINISTRATION.AIRPLANES.ROW_END}
                    type="number"
                    placeholder={dict.ADMINISTRATION.AIRPLANES.ROW_END}
                    value={cabin.rowEnd || ""}
                    onChange={e => handleCabinDataChange(index, "rowEnd", parseInt(e.target.value, 10) || "")}
                  />
                  <div className="col-span-2">
                    <SelectWithLabel
                      id={`seatClass-${index}`}
                      label={dict.ADMINISTRATION.AIRPLANES.SEAT_CLASS}
                      value={cabin.seat_class}
                      onChange={e => handleCabinDataChange(index, "seat_class", e.target.value)}
                      required>
                      <option value="" disabled>
                        {dict.ADMINISTRATION.AIRPLANES.SEAT_CLASS}
                      </option>
                      {airplaneSeatClasses.map(seatClass => (
                        <option key={seatClass} value={seatClass}>
                          {seatClass}
                        </option>
                      ))}
                    </SelectWithLabel>
                  </div>
                </div>

                <CardHeader className="mt-6" color="glacier">
                  {dict.ADMINISTRATION.AIRPLANES.SEAT_CONFIGURATION}
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.ADMINISTRATION.AIRPLANES.SEAT_PATTERN}</TableHead>
                      <TableHead>{dict.ADMINISTRATION.SELECT}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seatConfiguration?.map((config, configIndex) => (
                      <TableRow key={config.id} isOdd={configIndex % 2 === 1}>
                        <TableCell>{config.seatPattern}</TableCell>
                        <TableCell>
                          <Button
                            color={selectedSeatConfigurations[index] === configIndex ? "default" : "light"}
                            onClick={() => handleSeatConfigurationSelection(index, configIndex, config)}
                            text={selectedSeatConfigurations[index] === configIndex ? dict.ADMINISTRATION.SELECTED : dict.ADMINISTRATION.SELECT}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}

            <div className="flex justify-end mt-8">
              <Button
                onClick={() => {
                  // Validar que todas las cabinas tengan clase seleccionada
                  if (cabinsData.some(c => !c.seat_class)) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.MISSING_SEAT_CLASS,
                    });
                    return;
                  }
                  // Validar que todas las cabinas tengan configuración seleccionada
                  if (selectedSeatConfigurations.some(sel => sel === null || sel === undefined)) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.MISSING_SEAT_CONFIGURATION,
                    });
                    return;
                  }
                  // Validar filas
                  if (cabinsData.some(c => !c.rowStart || !c.rowEnd || c.rowEnd < c.rowStart)) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.INVALID_ROWS,
                    });
                    return;
                  }
                  // Validar que haya filas asignadas
                  if (cabinsData.some(c => c.rowStart === 0 && c.rowEnd === 0)) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.ERRORS.REQUIRED_FIELDS_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.AIRPLANES.ERRORS.MISSING_ROWS,
                    });
                    return;
                  }
                  // Validar capacidad
                  if (remainingSeats < 0) {
                    setNotification({
                      tipo: "error",
                      titulo: dict.ADMINISTRATION.AIRPLANES.ERRORS.EXCEEDS_CAPACITY_TITLE,
                      code: 400,
                      mensaje: dict.ADMINISTRATION.AIRPLANES.EXCEEDS_CAPACITY,
                    });
                    return;
                  }
                  handleSubmitStep2();
                }}
                color="light"
                text={dict.ADMINISTRATION.NEXT}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 bg-glacier-900/70 backdrop-blur-sm flex items-center justify-center z-50 text-white">
          <Loader />
        </div>
      ) : (
        <>
          <Modal onClose={onClose}>
            <Card>
              <div>
                <CardHeader color="glacier" className="pt-4">
                  {dict.ADMINISTRATION.AIRPLANES.ADD_AIRPLANE}
                </CardHeader>

                <StepsForm step={step} totalSteps={4} />
                {renderStepContent()}
              </div>
            </Card>
            {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
          </Modal>
        </>
      )}
    </>
  );
}
