import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { TbNfc } from "react-icons/tb";
import { useDictionary } from "@/app/context/DictionaryContext";

export default function PaymentGateway() {
  const { dict } = useDictionary();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
    paypalEmail: "",
    paypalPassword: "",
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardType, setCardType] = useState("visa");

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

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCardType = () => {
    setCardType(prevType => (prevType === "visa" ? "mastercard" : "visa"));
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    controls.start({
      rotateY: isFlipped ? 0 : 180,
      transition: { duration: 0.6 },
    });
  };

  return (
    <>
      <div>
        <div className="flex w-full justify-center items-center mb-4">
          <div className="flex w-full justify-center items-center mb-6">
            <div className="bg-glacier-950 rounded-xl p-1 flex gap-1">
              <button
                className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  paymentMethod === "card" ? "bg-glacier-900 text-white shadow-md" : "text-glacier-300 hover:text-glacier-100"
                }`}
                onClick={() => setPaymentMethod("card")}>
                💳 {dict.CLIENT.PAYMENT_GATEWAY.CARD}
              </button>
              <button
                className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  paymentMethod === "paypal" ? "bg-glacier-900 text-white shadow-md" : "text-glacier-300 hover:text-glacier-100"
                }`}
                onClick={() => setPaymentMethod("paypal")}>
                🏛️ {dict.CLIENT.PAYMENT_GATEWAY.PAYPAL}
              </button>
            </div>
          </div>
        </div>

        {paymentMethod === "card" ? (
          <div className="flex justify-center items-center w-full">
            <div className="w-1/2 flex flex-col items-center justify-center">
              <motion.div
                className={`relative w-96 h-56 rounded-lg shadow-lg cursor-pointer items-center justify-center ${cardType === "visa" ? "bg-[#214694]" : "bg-red-600"}`}
                initial={{ rotateY: 0 }}
                animate={controls}
                transition={{ duration: 0.6 }}
                onClick={handleCardClick}
                style={{ transformStyle: "preserve-3d" }}
                title={dict.CLIENT.PAYMENT_GATEWAY.FLIP_CARD}>
                {!isFlipped ? (
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-white rounded-lg" style={{ backfaceVisibility: "hidden" }}>
                    <div className="absolute bottom-2 right-4">
                      <Image width={40} height={80} src={cardType === "visa" ? "/iconos/visa.svg" : "/iconos/mastercard.svg"} alt="Card Logo" className="mt-2 opacity-70" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <TbNfc className="text-xl" />
                    </div>
                    <div className="text-2xl font-bold">{cardType === "visa" ? "Visa" : "Mastercard"}</div>
                    <div>
                      <Image src={"/iconos/chip.png"} alt="Logo chip card" width={50} height={20} style={{ mixBlendMode: "overlay" }} />
                    </div>
                    <div>
                      <div className="text-xl tracking-widest font-bold">{formData.cardNumber || "**** **** **** ****"}</div>
                      <div className="flex justify-between text-sm">
                        <span>{formData.expiryDate || "MM/YY"}</span>
                      </div>
                      <div className="text-lg">{formData.cardHolder || "Juan Ávila"}</div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 bg-gray-800 text-white rounded-lg p-4 flex flex-col justify-between"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}>
                    <div className="w-full h-10 bg-black mt-2"></div>
                    <div className="mt-4 bg-white text-black p-2 rounded-lg flex justify-between items-center">
                      <span className="text-sm font-semibold">{formData.cardHolder || "Juan Ávila"}</span>
                      <span className="text-lg">{formData.cvv || "***"}</span>
                    </div>
                    <p className="text-xs mt-2 text-gray-300">{dict.CLIENT.PAYMENT_GATEWAY.SECURE_CARD_MESSAGE}</p>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col items-center justify-end w-1/2">
              <form autoComplete="off">
                <div className="mb-4 relative">
                  <div>
                    <label className="block text-gray-700">{dict.CLIENT.PAYMENT_GATEWAY.CARD_NUMBER.LABEL}</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                      onChange={handleChange}
                      className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 text-white placeholder-glacier-300 w-full focus:outline-none"
                      placeholder={dict.CLIENT.PAYMENT_GATEWAY.CARD_NUMBER.PLACEHOLDER}
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
                  <div className="flex justify-end w-full mt-0.5">
                    <p className="text-gray-600 text-sm">{dict.CLIENT.PAYMENT_GATEWAY.FLIP_CARD}</p>
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700">{dict.CLIENT.PAYMENT_GATEWAY.EXPIRY_DATE.LABEL}</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 text-white placeholder-glacier-300 w-full focus:outline-none"
                      placeholder={dict.CLIENT.PAYMENT_GATEWAY.EXPIRY_DATE.PLACEHOLDER}
                      maxLength={5}
                      pattern="(0[1-9]|1[0-2])\/\d{2}"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700">{dict.CLIENT.PAYMENT_GATEWAY.CVV.LABEL}</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 text-white placeholder-glacier-300 w-full focus:outline-none"
                      placeholder={dict.CLIENT.PAYMENT_GATEWAY.CVV.PLACEHOLDER}
                      maxLength={3}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">{dict.CLIENT.PAYMENT_GATEWAY.CARD_HOLDER.LABEL}</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                    className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 text-white placeholder-glacier-300 w-full focus:outline-none"
                    placeholder={dict.CLIENT.PAYMENT_GATEWAY.CARD_HOLDER.PLACEHOLDER}
                    required
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-1/2">
              <Image src={"/iconos/paypal.svg"} alt={"Paypal"} height={100} width={80} className="w-80" />
            </div>
            <div className="flex flex-col w-1/2">
              <form className="w-full" autoComplete="off">
                <div className="mb-4">
                  <label className="block text-gray-700">{dict.CLIENT.PAYMENT_GATEWAY.PAYPAL_EMAIL.LABEL}</label>
                  <input
                    type="email"
                    name="paypalEmail"
                    value={formData.paypalEmail}
                    onChange={handleChange}
                    className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 text-white placeholder-glacier-300 w-full focus:outline-none"
                    placeholder={dict.CLIENT.PAYMENT_GATEWAY.PAYPAL_EMAIL.PLACEHOLDER}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">{dict.CLIENT.PAYMENT_GATEWAY.PAYPAL_PASSWORD.LABEL}</label>
                  <input
                    type="password"
                    name="paypalPassword"
                    value={formData.paypalPassword}
                    onChange={handleChange}
                    className="flex items-center bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-glacier-400 transition border border-white/5 text-white placeholder-glacier-300 w-full focus:outline-none"
                    placeholder={dict.CLIENT.PAYMENT_GATEWAY.PAYPAL_PASSWORD.PLACEHOLDER}
                    required
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
