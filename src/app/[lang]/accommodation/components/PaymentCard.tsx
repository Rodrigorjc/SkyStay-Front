import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Loading from "@components/Loader";
import axiosClient from "@/lib/axiosClient";
import Cookies from "js-cookie";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificacionComponent from "@components/Notification";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { MdNfc } from "react-icons/md";

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
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            controls.start({
                rotate: [0, 10, -10, 10, -10, 0],
                transition: { duration: 0.6 },
            });
            iconControls.start({
                scale: [1, 1.2, 1],
                transition: { duration: 0.6 },
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [controls, iconControls]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const searchParams = new URLSearchParams(window.location.search);
            const startDate = searchParams.get("checkIn");
            const endDate = searchParams.get("checkOut");

            const payload = {
                total,
                rooms, // ahora se envía el array con roomConfigId y qty
                accommodationCode,
                accommodationType,
                startDate,
                endDate,
            };

            const { data } = await axiosClient.post("/accommodations/realizar", payload);
            setNotificacion({
                titulo: data.titulo,
                mensaje: data.mensaje,
                code: data.code,
                tipo: data.code,
            });

            setTimeout(() => {
                setMostrarFormularioPago(false);
                router.push("/");
            }, 2500);
        } catch (error: any) {
            const err = error.response ? error.response.data : null;
            setNotificacion({
                titulo: err?.titulo || "Error",
                mensaje: err?.mensaje || "Error al realizar pedido",
                code: err?.code || 500,
                tipo: err?.tipo || "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = () => {
        setIsFlipped((prev) => !prev);
        controls.start({ rotateY: !isFlipped ? 180 : 0, transition: { duration: 0.6 } });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            {isLoading ? (
                <Loading />
            ) : (
                <div className="relative w-full max-w-4xl bg-glacier-50 rounded-2xl shadow-2xl px-8 py-6">
                    <button
                        onClick={() => setMostrarFormularioPago(false)}
                        className="absolute top-4 right-4 text-glacier-700 hover:text-glacier-900"
                    >
                        <FiX size={24} />
                    </button>

                    <h2 className="text-2xl font-semibold text-glacier-600 text-center mb-6">Forma de Pago</h2>

                    <div className="flex justify-center gap-4 mb-8">
                        {['card', 'paypal'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method as 'card' | 'paypal')}
                                className={`px-4 py-2 rounded-full font-medium transition 
                  ${paymentMethod === method ? 'bg-glacier-600 text-glacier-50' : 'bg-glacier-200 text-glacier-700 hover:bg-glacier-300'}`}
                            >
                                {method === 'card' ? 'Tarjeta' : 'PayPal'}
                            </button>
                        ))}
                    </div>

                    {paymentMethod === 'card' ? (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <motion.div
                                className="w-full lg:w-1/2 cursor-pointer perspective"
                                onClick={handleCardClick}
                                initial={{ rotateY: 0 }}
                                animate={controls}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="relative w-full h-56 rounded-xl shadow-lg bg-gradient-to-br from-glacier-500 to-glacier-400 flex flex-col justify-between p-6 text-glacier-50 backface-hidden">
                                    {!isFlipped ? (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <Image src={cardType === 'visa' ? '/iconos/visa.svg' : '/iconos/mastercard.svg'} alt="logo" width={48} height={32} />
                                                <MdNfc size={32} />
                                            </div>
                                            <div className="text-xl tracking-widest font-bold">
                                                {formData.cardNumber || '1234 5678 9012 3456'}
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>{formData.expiryDate || 'MM/YY'}</span>
                                                <span>{formData.cardHolder || 'Nombre Apellido'}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-glacier-800 rounded-xl p-6 flex flex-col justify-between backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                                            <div className="h-8 bg-black rounded-md"></div>
                                            <div className="bg-glacier-50 text-black rounded-md p-2 flex justify-between">
                                                <span className="font-semibold">{formData.cardHolder || 'Nombre Apellido'}</span>
                                                <span className="font-mono">{formData.cvv || '***'}</span>
                                            </div>
                                            <p className="text-xs text-glacier-300">Tarjeta segura. No compartas tus datos.</p>
                                        </div>
                                    )}
                                </div>

                                <p className="text-center text-sm text-glacier-500 mt-2">Haz click en la tarjeta para girar</p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="w-full lg:w-1/2 flex flex-col gap-4">
                                <div className="relative">
                                    <label className="block mb-1 text-glacier-600">Número de Tarjeta</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                        onChange={handleChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        pattern="\d{4} \d{4} \d{4} \d{4}"
                                        required
                                        className="w-full border-2 border-glacier-200 focus:border-glacier-600 rounded-lg p-2 pr-10"
                                    />
                                    <motion.div
                                        className="absolute top-9 right-3 cursor-pointer"
                                        animate={iconControls}
                                        onClick={() => setCardType(prev => prev === 'visa' ? 'mastercard' : 'visa')}
                                    >
                                        <Image src={cardType === 'visa' ? '/iconos/visa.svg' : '/iconos/mastercard.svg'} alt="tipo" width={24} height={16} />
                                    </motion.div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-glacier-600">Expiración</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            pattern="(0[1-9]|1[0-2])\/\d{2}"
                                            required
                                            className="w-full border-2 border-glacier-200 focus:border-glacier-600 rounded-lg p-2"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-glacier-600">CVV</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="123"
                                            maxLength={3}
                                            required
                                            className="w-full border-2 border-glacier-200 focus:border-glacier-600 rounded-lg p-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-glacier-600">Titular</label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleChange}
                                        placeholder="Nombre Apellido"
                                        required
                                        className="w-full border-2 border-glacier-200 focus:border-glacier-600 rounded-lg p-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full py-3 font-semibold rounded-lg bg-glacier-600 hover:bg-glacier-700 transition text-glacier-50 shadow-lg"
                                >
                                    Pagar {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-center">
                            <div className="flex-1 flex justify-center">
                                <Image src="/iconos/paypal.svg" alt="Paypal" width={120} height={50} />
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                                <div>
                                    <label className="block mb-1 text-glacier-600">Correo PayPal</label>
                                    <input
                                        type="email"
                                        name="paypalEmail"
                                        value={formData.paypalEmail}
                                        onChange={handleChange}
                                        placeholder="example@paypal.com"
                                        required
                                        className="w-full border-2 border-glacier-200 focus:border-glacier-600 rounded-lg p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-glacier-600">Contraseña PayPal</label>
                                    <input
                                        type="password"
                                        name="paypalPassword"
                                    value={formData.paypalPassword}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                    className="w-full border-2 border-glacier-200 focus:border-glacier-600 rounded-lg p-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 w-full py-3 font-semibold rounded-lg bg-glacier-600 hover:bg-glacier-700 transition text-glacier-50 shadow-lg"
                                >
                                    Pagar con PayPal
                                </button>
                            </div>
                        </form>
                    )}

                    {notificacion && (
                        <NotificacionComponent Notifications={notificacion} onClose={() => setNotificacion(undefined)} />
                    )}
                </div>
            )}
        </div>
    );
}
