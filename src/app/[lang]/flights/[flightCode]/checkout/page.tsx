"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { getFlightDetails } from "../services/flight.details.service";
import { AllDetailsFlightsVO } from "../types/flight.details";
import Loader from "@/app/components/ui/Loader";
import { FaEnvelope, FaIdCard, FaPhone, FaUser, FaTrash } from "react-icons/fa";
import StepsForm from "@/app/components/ui/admin/StepsForm";
import { purchaseTicketsFlight } from "./services/checkout.service";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@/app/components/ui/admin/Notificaciones";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import PaymentGateway from "@/app/components/ui/PaymentGateway";
import { IoMdClose } from "react-icons/io";

const EUROPE_COUNTRIES = [
  { code: "+355", flag: "al" },
  { code: "+43", flag: "at" },
  { code: "+375", flag: "by" },
  { code: "+32", flag: "be" },
  { code: "+387", flag: "ba" },
  { code: "+359", flag: "bg" },
  { code: "+385", flag: "hr" },
  { code: "+357", flag: "cy" },
  { code: "+420", flag: "cz" },
  { code: "+45", flag: "dk" },
  { code: "+372", flag: "ee" },
  { code: "+358", flag: "fi" },
  { code: "+33", flag: "fr" },
  { code: "+995", flag: "ge" },
  { code: "+49", flag: "de" },
  { code: "+30", flag: "gr" },
  { code: "+36", flag: "hu" },
  { code: "+354", flag: "is" },
  { code: "+353", flag: "ie" },
  { code: "+39", flag: "it" },
  { code: "+383", flag: "xk" },
  { code: "+371", flag: "lv" },
  { code: "+423", flag: "li" },
  { code: "+370", flag: "lt" },
  { code: "+352", flag: "lu" },
  { code: "+356", flag: "mt" },
  { code: "+373", flag: "md" },
  { code: "+377", flag: "mc" },
  { code: "+382", flag: "me" },
  { code: "+31", flag: "nl" },
  { code: "+389", flag: "mk" },
  { code: "+47", flag: "no" },
  { code: "+48", flag: "pl" },
  { code: "+351", flag: "pt" },
  { code: "+40", flag: "ro" },
  { code: "+7", flag: "ru" },
  { code: "+378", flag: "sm" },
  { code: "+381", flag: "rs" },
  { code: "+421", flag: "sk" },
  { code: "+386", flag: "si" },
  { code: "+34", flag: "es" },
  { code: "+46", flag: "se" },
  { code: "+41", flag: "ch" },
  { code: "+90", flag: "tr" },
  { code: "+380", flag: "ua" },
  { code: "+44", flag: "gb" },
];

const passengerSchema = z.object({
  name: z.string().min(1, "Nombre obligatorio").max(150, "Máx. 150 caracteres"),
  surnames: z.string().min(1, "Apellidos obligatorios").max(150, "Máx. 150 caracteres"),
  email: z.string().email("Email inválido").max(50, "Máx. 50 caracteres"),
  nif: z
    .string()
    .min(1, "NIF obligatorio")
    .max(13, "Máx. 13 caracteres")
    .refine(
      value => {
        const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        const nifRegex = /^[0-9]{8}[A-Z]$/;
        if (!nifRegex.test(value)) return false;
        const number = parseInt(value.substring(0, 8));
        const providedLetter = value.charAt(8);
        const correctLetter = letters.charAt(number % 23);
        return providedLetter === correctLetter;
      },
      {
        message: "NIF inválido o letra incorrecta",
      }
    ),
  phonePrefix: z.string().min(1, "Prefijo obligatorio"),
  phone: z
    .string()
    .regex(/^\+?\d+$/, "El teléfono debe ser un número válido")
    .max(13, "Máx. 13 caracteres"),
  seatRow: z.string().min(1),
  seatColumn: z.string().min(1),
  seatClass: z.string().min(1),
});

const schema = z.object({
  passengers: z.array(passengerSchema),
});

export default function CheckoutPage({ params }: { params: Promise<{ flightCode: string }> }) {
  const lang = useLanguage();
  const router = useRouter();
  const { dict } = useDictionary();
  const [flightData, setFlightData] = useState<AllDetailsFlightsVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const { flightCode } = resolvedParams;
  const [notification, setNotification] = useState<Notifications | null>(null);
  const seatsParam = searchParams.get("seats") || "";
  const [seatCabinPairs, setSeatCabinPairs] = useState<
    {
      seatRow?: string;
      seatColumn?: string;
      seatClass?: string;
      price?: number;
    }[]
  >([]);

  useEffect(() => {
    try {
      const decoded = seatsParam ? JSON.parse(decodeURIComponent(seatsParam)) : [];
      setSeatCabinPairs(decoded);
    } catch {
      setSeatCabinPairs([]);
    }
  }, [seatsParam]);

  useEffect(() => {
    async function fetchFlight() {
      try {
        setLoading(true);
        const details = await getFlightDetails(flightCode);
        setFlightData(details.response.objects);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (flightCode) fetchFlight();
  }, [flightCode]);

  type Passenger = z.infer<typeof passengerSchema>;
  type FormValues = { passengers: Passenger[] };

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      passengers: seatCabinPairs.map(s => ({
        name: "",
        surnames: "",
        email: "",
        nif: "",
        phonePrefix: "+34",
        phone: "",
        seatRow: s.seatRow,
        seatColumn: s.seatColumn,
        seatClass: s.seatClass,
      })),
    },
  });

  const handleCloseNotification = () => setNotification(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await purchaseTicketsFlight(data.passengers, flightCode, lang);
      setNotification({
        tipo: "success",
        titulo: dict.CLIENT.FLIGHTS.SUCCESS.PURCHASE_TITLE_SUCCESS,
        code: 500,
        mensaje: dict.CLIENT.FLIGHTS.SUCCESS.PURCHASE_MESSAGE_SUCCESS,
      });
      setTimeout(() => {
        router.push(`/${lang}/flights/${flightCode}`);
      }, 1500);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      setNotification({
        tipo: "error",
        titulo: dict.CLIENT.FLIGHTS.ERRORS.PURCHASE_TITLE_ERROR,
        code: 500,
        mensaje: dict.CLIENT.FLIGHTS.ERRORS.PURCHASE_MESSAGE_ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const { fields, remove } = useFieldArray({ control, name: "passengers" });
  const passengerValues = watch("passengers");

  useEffect(() => {
    reset({
      passengers: seatCabinPairs.map(s => ({
        name: "",
        surnames: "",
        email: "",
        nif: "",
        phonePrefix: "+34",
        phone: "",
        seatRow: s.seatRow,
        seatColumn: s.seatColumn,
        seatClass: s.seatClass,
      })),
    });
  }, [seatCabinPairs, reset]);

  const openModal = () => {
    setModalStep(0);
    setShowModal(true);
  };

  const onNextStep = async () => {
    const valid = await trigger(`passengers.${modalStep}` as const);
    if (!valid) return;
    if (modalStep < fields.length - 1) {
      setModalStep(prev => prev + 1);
    } else {
      setModalStep(fields.length);
    }
  };

  const handleRemoveSeat = (index: number) => {
    remove(index);
    setSeatCabinPairs(prev => prev.filter((_, i) => i !== index));
    if (modalStep >= index && modalStep > 0) {
      setModalStep(modalStep - 1);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <Loader />
      </div>
    );

  if (error || !flightData) return <div className="text-white text-center py-20">{dict.CLIENT.FLIGHTS.ERRORS.LOADING_DATA_FLIGHT}</div>;

  return (
    <div className="text-white px-4 py-10 max-w-[1850px] min-h-[1000px] mx-auto max-2xl:px-8">
      <div className="flex flex-col">
        <div className="lg:col-span-2 my-2">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-glacier-200 mb-3">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.TITLE}</h1>
            <div className="flex flex-col gap-3 itesm-center justify-start flex-wrap text-wrap">
              <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-6 text-lg text-glacier-100 my-4">
                <div>
                  <p className="font-semibold ">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.DEPATURE_DESTINATION}:</p>
                  <p>
                    {flightData.departureAirport.city.name} ({flightData.departureAirport.iataCode}) – {flightData.departureAirport.name}
                  </p>
                </div>
                <div>
                  <p className="font-semibold ">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.ARRIVAL_DESTINATION}:</p>
                  <p>
                    {flightData.arrivalAirport.city.name} ({flightData.arrivalAirport.iataCode}) – {flightData.arrivalAirport.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 max-xl:grid-cols-2 gap-6 text-lg text-glacier-100 mb-4">
                <div>
                  <p className="font-semibold">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.DEPATURE}: </p>
                  <p>{new Date(flightData.dateTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.ARRIVAL}: </p>
                  <p>{new Date(flightData.dateTimeArrival).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-glacier-200 mb-3">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SEAT_SUMMARY_TITLE}</h1>

        <div className="bg-glacier-900 border border-glacier-700 p-8 rounded-2xl shadow-lg w-full self-start my-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-base text-white/80">
              {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SELECTED_SEATS}: {seatCabinPairs.length}/10
            </span>
          </div>

          <ul className="space-y-6 text-glacier-200 text-base">
            {seatCabinPairs.map((s, i) => {
              const badgeColor = {
                ECONOMY: "bg-blue-500/30",
                PREMIUM_ECONOMY: "bg-cyan-500/30",
                BUSINESS: "bg-yellow-500/30",
                FIRST: "bg-purple-500/30",
                SUITE_CLASS: "bg-pink-500/30",
              };
              const badgeClass = badgeColor[s.seatClass as keyof typeof badgeColor];

              return (
                <li key={i} className="rounded-xl bg-glacier-900/70 p-5 shadow-lg  border border-glacier-700">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-glacier-100 pb-1">
                      {s.seatRow && s.seatColumn ? `${dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SEAT} ${s.seatRow}${s.seatColumn}` : dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SEAT}
                    </div>
                    <div className="flex gap-3 items-center">
                      {fields[i] && (
                        <button
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                          title="Editar datos del pasajero"
                          onClick={() => {
                            setModalStep(i);
                            setShowModal(true);
                          }}>
                          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M15.502 1.94a1.5 1.5 0 0 1 0 2.12l-1.439 1.439-2.12-2.12 1.439-1.44a1.5 1.5 0 0 1 2.12 0zm-2.56 3.182-2.12-2.12L2.207 11.414a1 1 0 0 0-.263.465l-.805 2.414a.5.5 0 0 0 .632.632l2.414-.805a1 1 0 0 0 .465-.263l8.615-8.615z" />
                          </svg>
                          {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.EDIT}
                        </button>
                      )}
                      <button className="text-red-400 hover:text-red-300 text-sm" onClick={() => handleRemoveSeat(i)} title="Eliminar este asiento">
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium text-glacier-300">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.LOCATION}:</span> {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.ROW}
                      <span className="font-semibold">{s.seatRow ?? dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NOT_AVAILABLE}</span>, {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.COLUMN}
                      <span className="font-semibold">{s.seatColumn ?? dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NOT_AVAILABLE}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-glacier-300">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SEAT_CLASS_AND_PRICE}:</span>
                      <span className={`text-glacier-100 text-xs font-semibold rounded-full px-3 py-1 ${badgeClass}`}>
                        {s.seatClass ?? dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NOT_AVAILABLE} • {s.price ? `${s.price} €` : dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NO_PRICE}
                      </span>
                    </div>
                  </div>

                  {passengerValues?.[i] && Object.values(passengerValues[i]).some(val => typeof val === "string" && val.trim() !== "") && (
                    <div className="text-sm text-glacier-100 space-y-3 pt-1">
                      <div className="text-base font-bold flex items-center gap-2 mt-3">
                        <FaUser className="text-glacier-400" />
                        {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PASSENGER_DETAILS}
                      </div>

                      <div className="flex items-center gap-2">
                        <FaUser className="text-glacier-400 text-sm" />
                        <span className="font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NAME}: </span>
                        <span className="text-glacier-200">{passengerValues[i].name || <span className="text-glacier-500">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NO_DATA}</span>}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaUser className="text-glacier-400 text-sm" />
                        <span className="font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SURNAME}: </span>
                        <span className="text-glacier-200">{passengerValues[i].surnames || <span className="text-glacier-500">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NO_DATA}</span>}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-glacier-400 text-sm" />
                        <span className="font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.EMAIL}:</span>
                        <span className="text-glacier-200">{passengerValues[i].email || <span className="text-glacier-500">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NO_DATA}</span>}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaIdCard className="text-glacier-400 text-sm" />
                        <span className="font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NIF}:</span>
                        <span className="text-glacier-200">{passengerValues[i].nif || <span className="text-glacier-500">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NO_DATA}</span>}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaPhone className="text-glacier-400 text-sm" />
                        <span className="font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PHONE}:</span>
                        <span className="text-glacier-200">
                          {passengerValues[i].phonePrefix && passengerValues[i].phone ? (
                            `${passengerValues[i].phonePrefix}${passengerValues[i].phone}`
                          ) : (
                            <span className="text-glacier-500">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NO_DATA}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            className="mt-8 w-full px-6 py-2 rounded-xl bg-gradient-to-r from-glacier-400 via-cyan-800/50 to-glacier-600 text-white font-semibold shadow-none hover:from-cyan-400/50 hover:to-glacier-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onClick={openModal}>
            {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PROCEED_TO_PAYMENT}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div className="bg-zinc-800 text-white w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-12 rounded-xl relative">
              <button className="absolute top-4 right-4 text-glacier-400 hover:text-white text-2xl" onClick={() => setShowModal(false)} title="Cerrar">
                <IoMdClose />
              </button>
              <StepsForm step={modalStep + 1} totalSteps={fields.length + 1} />

              {modalStep < fields.length ? (
                <>
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold mb-3">
                      {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PASSENGER} {modalStep + 1}
                    </h2>

                    <div className="text-glacier-400 mb-6 space-y-2">
                      <div className="flex flex-row gap-2 items-center justify-center text-center">
                        <p className="text-glacier-300 font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.LOCATION}:</p>
                        <p className="text-white">
                          {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.ROW}
                          <span className="pl-1">{seatCabinPairs[modalStep]?.seatRow ?? dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NOT_AVAILABLE}</span>,{" "}
                          {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.COLUMN}
                          <span className="pl-1">{seatCabinPairs[modalStep]?.seatColumn ?? dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NOT_AVAILABLE}</span>
                        </p>
                      </div>

                      <div className="flex flex-row gap-2 items-center justify-center text-center">
                        <p className="text-glacier-300 font-medium">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SEAT_CLASS_AND_PRICE}:</p>
                        <div
                          className={`text-glacier-100 text-xs font-semibold rounded-full px-3 py-1 inline-block ${
                            {
                              ECONOMY: "bg-blue-500/30",
                              PREMIUM_ECONOMY: "bg-cyan-500/30",
                              BUSINESS: "bg-yellow-500/30",
                              FIRST: "bg-purple-500/30",
                              SUITE_CLASS: "bg-pink-500/30",
                            }[seatCabinPairs[modalStep]?.seatClass as string] || ""
                          }`}>
                          {seatCabinPairs[modalStep]?.seatClass ?? "N/D"} • {seatCabinPairs[modalStep]?.price ? `${seatCabinPairs[modalStep]?.price} €` : "Sin precio"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={e => e.preventDefault()} className="grid gap-8 sm:grid-cols-2" autoComplete="off">
                    <div>
                      <label className="block mb-2">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NAME}</label>
                      <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
                        <FaUser className="mr-2.5 text-glacier-300" />
                        <input
                          type="text"
                          placeholder={dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NAME}
                          className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                          {...register(`passengers.${modalStep}.name`)}
                        />
                      </div>
                      {errors.passengers?.[modalStep]?.name && <p className="text-red-400 text-sm">{errors.passengers[modalStep].name?.message}</p>}
                    </div>
                    <div>
                      <label className="block mb-2">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SURNAME}</label>
                      <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
                        <FaUser className="mr-2.5 text-glacier-300" />
                        <input
                          type="text"
                          placeholder={dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.SURNAME}
                          className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                          {...register(`passengers.${modalStep}.surnames`)}
                        />
                      </div>
                      {errors.passengers?.[modalStep]?.surnames && <p className="text-red-400 text-sm">{errors.passengers[modalStep].surnames?.message}</p>}
                    </div>
                    <div>
                      <label className="block mb-2">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.EMAIL}</label>
                      <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
                        <FaEnvelope className="mr-2.5 text-glacier-300" />
                        <input
                          type="email"
                          placeholder={dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.EMAIL}
                          className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                          {...register(`passengers.${modalStep}.email`)}
                        />
                      </div>
                      {errors.passengers?.[modalStep]?.email && <p className="text-red-400 text-sm">{errors.passengers[modalStep].email?.message}</p>}
                    </div>
                    <div>
                      <label className="block mb-2">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NIF}</label>
                      <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5">
                        <FaIdCard className="mr-2.5 text-glacier-300" />
                        <input
                          type="text"
                          placeholder={dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NIF}
                          className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                          maxLength={9}
                          {...register(`passengers.${modalStep}.nif`)}
                        />
                      </div>
                      {errors.passengers?.[modalStep]?.nif && <p className="text-red-400 text-sm">{errors.passengers[modalStep].nif?.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-2">{dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PHONE}</label>
                      <div className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 gap-2">
                        <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg gap-2 min-w-[120px]">
                          <img
                            src={`https://flagcdn.com/28x21/${EUROPE_COUNTRIES.find(opt => opt.code === passengerValues[modalStep]?.phonePrefix)?.flag}.png`}
                            width="28"
                            height="21"
                            alt="flag"
                            className="rounded cursor-pointer"
                          />
                          <select className="bg-transparent text-white border-none outline-none w-full" {...register(`passengers.${modalStep}.phonePrefix` as const)} defaultValue="+34">
                            {EUROPE_COUNTRIES.map(opt => (
                              <option key={opt.code} value={opt.code} className="text-black">
                                {opt.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          placeholder={dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PHONE}
                          className="bg-transparent text-white placeholder-glacier-300 w-full focus:outline-none"
                          {...register(`passengers.${modalStep}.phone`)}
                          onInput={e => {
                            const input = e.target as HTMLInputElement;
                            input.value = input.value.replace(/[^0-9]/g, "");
                          }}
                        />
                      </div>
                      {(errors.passengers?.[modalStep]?.phonePrefix || errors.passengers?.[modalStep]?.phone) && (
                        <p className="text-red-400 text-sm">{errors.passengers?.[modalStep]?.phonePrefix?.message || errors.passengers?.[modalStep]?.phone?.message}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        className="w-full px-6 py-2 rounded-xl bg-gradient-to-r from-glacier-400 via-cyan-800/50 to-glacier-600 text-white font-semibold shadow-none hover:from-cyan-400/50 hover:to-glacier-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                        onClick={onNextStep}>
                        {modalStep === fields.length - 1 ? dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.GO_TO_PAYMENT : dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.NEXT_PASSENGER}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="bg-zinc-900/80 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl border border-zinc-700/50">
                  <PaymentGateway />
                  <button
                    className="mt-8 w-full px-6 py-2 rounded-xl bg-gradient-to-r from-glacier-400 via-cyan-800/50 to-glacier-600 text-white font-semibold shadow-none hover:from-cyan-400/50 hover:to-glacier-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    onClick={handleSubmit(onSubmit)}>
                    {dict.CLIENT.FLIGHTS.FLIGHT_CODE.CHECK_OUT.PROCEED_TO_PAYMENT}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {notification && <NotificationComponent Notifications={notification} onClose={handleCloseNotification} />}
    </div>
  );
}
