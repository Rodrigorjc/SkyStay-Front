import { Card, CardContent, CardHeader } from "@/app/components/ui/admin/Card";
import { InputWithLabel, InputWithLabelAndSymbol } from "@/app/components/ui/admin/Label";
import Modal from "@/app/components/ui/admin/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/admin/Table";
import Button from "@/app/components/ui/Button";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useDictionary } from "@/app/context/DictionaryContext";
import { createAdditionalBaggage } from "../services/additional-baggage.service";
import { getAllAirlinesReduced } from "../../flights/services/flight.service";
import StepsForm from "@/app/components/ui/admin/StepsForm";

interface FlightAddProps {
  onClose: () => void;
  onSuccess: (notification: Notifications) => void;
}

export const additonalBaggageFormSchema = z.object({
  name: z.string().min(1),
  weight: z.number().min(1),
  extraAmount: z.number().min(1),
  airline_id: z.number().min(1),
});

export type AdditonalBaggageFormValues = z.infer<typeof additonalBaggageFormSchema>;

export default function ModalCreateFlight({ onClose, onSuccess }: FlightAddProps) {
  const { dict } = useDictionary();

  const [notification, setNotification] = useState<Notifications | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const [step, setStep] = useState(1);

  const [airlines, setAirlines] = useState<any[]>([]);
  const [selectedAirline, setSelectedAirline] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const airlinesResponse = await getAllAirlinesReduced(100, 0);
        setAirlines(airlinesResponse.objects);
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
  }, [dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE, dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_MESSAGE]);

  const onSubmit = async (data: AdditonalBaggageFormValues) => {
    try {
      await createAdditionalBaggage(data);
      const successNotification = {
        tipo: "success",
        titulo: dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.SUCCESS.CREATION_SUCCESS_TITLE,
        code: 300,
        mensaje: dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.SUCCESS.CREATION_SUCCESS_MESSAGE,
      };
      onSuccess(successNotification);
    } catch (error) {
      setNotification({
        tipo: "error",
        titulo: dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.ERRORS.CREATION_FAILED_TITLE,
        code: 500,
        mensaje: dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.ERRORS.CREATION_FAILED_MESSAGE,
      });
    }
  };

  const { handleSubmit, register, setValue, trigger } = useForm<AdditonalBaggageFormValues>({
    resolver: zodResolver(additonalBaggageFormSchema),
    defaultValues: {
      name: "",
      weight: 0,
      extraAmount: 0,
      airline_id: 0,
    },
  });

  useEffect(() => {
    if (selectedAirline) setValue("airline_id", selectedAirline);
  }, [selectedAirline, setValue]);

  return (
    <>
      <Modal onClose={onClose}>
        {step === 1 && (
          <Card>
            <CardHeader color="glacier" className="pt-4">
              {dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.ADD_BAGGAGE}
            </CardHeader>
            <StepsForm step={step} totalSteps={2} />
            <CardContent className="grid gap-4 my-4">
              <div className="flex items-end gap-4">
                <div className="flex flex-col gap-4 w-full">
                  <InputWithLabel id="name" label={dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.NAME} type="text" {...register("name")} />
                  <InputWithLabelAndSymbol id="weight" label={dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.WEIGHT} type="number" symbol="kg" {...register("weight", { valueAsNumber: true })} />
                  <InputWithLabelAndSymbol id="extraAmount" label={dict.ADMINISTRATION.ADDITIONAL_BAGGAGE.PRICE} type="number" symbol="€" {...register("extraAmount", { valueAsNumber: true })} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={async () => {
                    const weightValue = Number((document.getElementById("weight") as HTMLInputElement | null)?.value);
                    const extraAmountValue = Number((document.getElementById("extraAmount") as HTMLInputElement | null)?.value);
                    if (weightValue < 0 || extraAmountValue < 0) {
                      setNotification({
                        tipo: "error",
                        titulo: dict.ADMINISTRATION.ERRORS.NEGATIVE_VALUE_TITLE,
                        code: 400,
                        mensaje: dict.ADMINISTRATION.ERRORS.NEGATIVE_VALUE_MESSAGE,
                      });
                      return;
                    }
                    const isValid = await trigger(["name", "weight", "extraAmount"]);
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
            <CardHeader color="glacier">2. {dict.ADMINISTRATION.FLIGHTS.SELECT_AIRLINE}</CardHeader>
            <StepsForm step={step} totalSteps={2} />
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

      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </>
  );
}
