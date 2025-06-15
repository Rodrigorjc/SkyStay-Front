"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Loading from "@components/Loader";
import axiosClient from "@/lib/axiosClient";
import NotificacionComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { TbNfc } from "react-icons/tb";
import { useDictionary } from "@context";

interface RoomSelection {
    roomConfigId: string | number;
    qty: number;
}

interface FormularioPagoProps {
    setMostrarFormularioPago: (value: boolean) => void;
    total: number;
    rooms: RoomSelection[];
    accommodationCode: string;
    accommodationType: string;
}

export default function FormularioPago({
    setMostrarFormularioPago,
    total,
    rooms,
    accommodationCode,
    accommodationType,
}: FormularioPagoProps) {
    const { dict } = useDictionary();
    const router = useRouter();

    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolder: "",
        paypalEmail: "",
        paypalPassword: "",
    });
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
    const [cardType, setCardType] = useState<"visa" | "mastercard">("visa");
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notificacion, setNotificacion] = useState<Notifications>();

    const controls = useAnimation();
    const iconControls = useAnimation();

    useEffect(() => {
        const intervalId = setInterval(() => {
            controls.start({
                rotate: [0, 3, -3, 3, -3, 0],
                transition: { duration: 1.2, ease: "easeInOut" },
            });
            iconControls.start({
                scale: [1, 1.08, 1],
                transition: { duration: 1.2, ease: "easeInOut" },
            });
        }, 15000);
        return () => clearInterval(intervalId);
    }, [controls, iconControls]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleCardType = () => {
        setCardType((prevType) => (prevType === "visa" ? "mastercard" : "visa"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const startDate = params.get("checkIn");
            const endDate = params.get("checkOut");
            const payload = { total, rooms, accommodationCode, accommodationType, startDate, endDate };
            const { data } = await axiosClient.post("/accommodations/realizar", payload);
            setNotificacion({
                titulo: data.titulo,
                mensaje: data.mensaje,
                code: data.code,
                tipo: data.tipo,
            });
            setTimeout(() => {
                setMostrarFormularioPago(false);
                router.push("/");
            }, 2500);
        } catch (error: any) {
            const err = error.response?.data;
            setNotificacion({
                titulo: err?.titulo || dict.CLIENT.PAYMENT.ERROR.TITLE,
                mensaje: err?.mensaje || dict.CLIENT.PAYMENT.ERROR.SUBMIT,
                code: err?.code || 500,
                tipo: err?.tipo || "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
        controls.start({
            rotateY: isFlipped ? 0 : 180,
            transition: { duration: 0.6 },
        });
    };

    if (!dict || Object.keys(dict).length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            {isLoading ? (
                <Loading />
            ) : (
                <div className="relative w-full max-w-6xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl px-8 py-6 border border-glacier-700">
                    <button
                        onClick={() => setMostrarFormularioPago(false)}
                        className="absolute top-4 right-4 text-glacier-300 hover:text-glacier-100 transition-colors"
                    >
                        <FiX size={24} />
                    </button>

                    <h2 className="text-2xl font-semibold text-glacier-200 text-center mb-6">
                        {dict.CLIENT.PAYMENT.TITLE}
                    </h2>

                    {/* Selector de método de pago mejorado */}
                    <div className="flex w-full justify-center items-center mb-8">
                        <div className="bg-zinc-800 rounded-xl p-1 flex gap-1 border border-glacier-700">
                            <button
                                onClick={() => setPaymentMethod("card")}
                                className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    paymentMethod === "card"
                                        ? "bg-glacier-600 text-white shadow-md"
                                        : "text-glacier-300 hover:text-glacier-100"
                                }`}
                            >
                                💳 {dict.CLIENT.PAYMENT.METHOD.CARD}
                            </button>
                            <button
                                onClick={() => setPaymentMethod("paypal")}
                                className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    paymentMethod === "paypal"
                                        ? "bg-glacier-600 text-white shadow-md"
                                        : "text-glacier-300 hover:text-glacier-100"
                                }`}
                            >
                                🏛️ {dict.CLIENT.PAYMENT.METHOD.PAYPAL}
                            </button>
                        </div>
                    </div>

                    {paymentMethod === "card" ? (
                        <div className="flex justify-center items-center w-full">
                            {/* Tarjeta mejorada */}
                            <div className="w-1/2 flex flex-col items-center justify-center">
                                <motion.div
                                    className={`relative w-96 h-56 rounded-lg shadow-lg cursor-pointer ${
                                        cardType === "visa" ? "bg-[#214694]" : "bg-red-600"
                                    }`}
                                    initial={{ rotateY: 0 }}
                                    animate={controls}
                                    transition={{ duration: 0.6 }}
                                    onClick={handleCardClick}
                                    style={{ transformStyle: "preserve-3d" }}
                                    title={dict.CLIENT.PAYMENT.CARD.FLIP_INSTRUCTION}
                                >
                                    {!isFlipped ? (
                                        <div
                                            className="absolute inset-0 flex flex-col justify-between p-4 text-white rounded-lg"
                                            style={{ backfaceVisibility: "hidden" }}
                                        >
                                            <div className="absolute bottom-2 right-4">
                                                <Image
                                                    width={40}
                                                    height={80}
                                                    src={cardType === "visa" ? "/iconos/visa.svg" : "/iconos/mastercard.svg"}
                                                    alt="Card Logo"
                                                    className="mt-2 opacity-70"
                                                />
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <TbNfc className="text-xl" />
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {cardType === "visa" ? "Visa" : "Mastercard"}
                                            </div>
                                            <div>
                                                <Image
                                                    src="/iconos/chip.png"
                                                    alt="Logo chip card"
                                                    width={50}
                                                    height={20}
                                                    style={{ mixBlendMode: "overlay" }}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xl tracking-widest font-bold">
                                                    {formData.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ") || "**** **** **** ****"}
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>{formData.expiryDate || "MM/YY"}</span>
                                                </div>
                                                <div className="text-lg">
                                                    {formData.cardHolder || "Nombre del titular"}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="absolute inset-0 bg-gray-800 text-white rounded-lg p-4 flex flex-col justify-between"
                                            style={{
                                                transform: "rotateY(180deg)",
                                                backfaceVisibility: "hidden",
                                            }}
                                        >
                                            <div className="w-full h-10 bg-black mt-2"></div>
                                            <div className="mt-4 bg-white text-black p-2 rounded-lg flex justify-between items-center">
                                                <span className="text-sm font-semibold">
                                                    {formData.cardHolder || "Nombre del titular"}
                                                </span>
                                                <span className="text-lg">{formData.cvv || "***"}</span>
                                            </div>
                                            <p className="text-xs mt-2 text-gray-300">
                                                {dict.CLIENT.PAYMENT.CARD.SECURE_NOTICE}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                                <div className="flex justify-center w-full mt-2">
                                    <p className="text-glacier-400 text-sm">
                                        {dict.CLIENT.PAYMENT.CARD.FLIP_INSTRUCTION}
                                    </p>
                                </div>
                            </div>

                            {/* Formulario mejorado */}
                            <div className="flex flex-col items-center justify-end w-1/2">
                                <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-md">
                                    <div className="mb-4 relative">
                                        <label className="block text-glacier-300 mb-1">
                                            {dict.CLIENT.PAYMENT.CARD.NUMBER_LABEL}
                                        </label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                                            onChange={handleChange}
                                            className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/10 text-white placeholder-glacier-400 w-full focus:outline-none"
                                            placeholder={dict.CLIENT.PAYMENT.CARD.PLACEHOLDER_NUMBER}
                                            maxLength={19}
                                            pattern="\d{4} \d{4} \d{4} \d{4}"
                                            required
                                            autoComplete="off"
                                        />
                                        <motion.div className="absolute right-0 top-7 mr-2" animate={iconControls}>
                                            <Image
                                                width={20}
                                                height={20}
                                                src={cardType === "visa" ? "/iconos/visa.svg" : "/iconos/mastercard.svg"}
                                                alt={cardType === "visa" ? "Visa" : "Mastercard"}
                                                className="w-12 h-8 cursor-pointer"
                                                onClick={toggleCardType}
                                            />
                                        </motion.div>
                                    </div>

                                    <div className="flex gap-4 mb-4">
                                        <div className="w-1/2">
                                            <label className="block text-glacier-300 mb-1">
                                                {dict.CLIENT.PAYMENT.CARD.EXPIRY_LABEL}
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/10 text-white placeholder-glacier-400 w-full focus:outline-none"
                                                placeholder={dict.CLIENT.PAYMENT.CARD.PLACEHOLDER_EXPIRY}
                                                maxLength={5}
                                                pattern="(0[1-9]|1[0-2])\/\d{2}"
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-glacier-300 mb-1">
                                                {dict.CLIENT.PAYMENT.CARD.CVV_LABEL}
                                            </label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/10 text-white placeholder-glacier-400 w-full focus:outline-none"
                                                placeholder={dict.CLIENT.PAYMENT.CARD.PLACEHOLDER_CVV}
                                                maxLength={3}
                                                required
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-glacier-300 mb-1">
                                            {dict.CLIENT.PAYMENT.CARD.HOLDER_LABEL}
                                        </label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            value={formData.cardHolder}
                                            onChange={handleChange}
                                            className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/10 text-white placeholder-glacier-400 w-full focus:outline-none"
                                            placeholder={dict.CLIENT.PAYMENT.CARD.PLACEHOLDER_HOLDER}
                                            required
                                            autoComplete="off"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl font-semibold bg-glacier-600 hover:bg-glacier-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {dict.CLIENT.PAYMENT.CARD.PAY_BUTTON.replace(
                                            "{{type}}",
                                            cardType.charAt(0).toUpperCase() + cardType.slice(1)
                                        )}{" "}
                                        • {total}€
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <div className="flex items-center justify-center w-1/2">
                                <Image
                                    src="/iconos/paypal.svg"
                                    alt="Paypal"
                                    height={100}
                                    width={80}
                                    className="w-80"
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <form onSubmit={handleSubmit} className="w-full max-w-md" autoComplete="off">
                                    <div className="mb-4">
                                        <label className="block text-glacier-300 mb-1">
                                            {dict.CLIENT.PAYMENT.PAYPAL.EMAIL_LABEL}
                                        </label>
                                        <input
                                            type="email"
                                            name="paypalEmail"
                                            value={formData.paypalEmail}
                                            onChange={handleChange}
                                            className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/10 text-white placeholder-glacier-400 w-full focus:outline-none"
                                            placeholder={dict.CLIENT.PAYMENT.PAYPAL.PLACEHOLDER_EMAIL}
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-glacier-300 mb-1">
                                            {dict.CLIENT.PAYMENT.PAYPAL.PASSWORD_LABEL}
                                        </label>
                                        <input
                                            type="password"
                                            name="paypalPassword"
                                            value={formData.paypalPassword}
                                            onChange={handleChange}
                                            className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/10 text-white placeholder-glacier-400 w-full focus:outline-none"
                                            placeholder={dict.CLIENT.PAYMENT.PAYPAL.PLACEHOLDER_PASSWORD}
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl font-semibold bg-glacier-600 hover:bg-glacier-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {dict.CLIENT.PAYMENT.PAYPAL.PAY_BUTTON} • {total}€
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {notificacion && (
                        <NotificacionComponent
                            Notifications={notificacion}
                            onClose={() => setNotificacion(undefined)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
