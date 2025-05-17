"use client";
import React, {useState, useRef, useEffect} from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@components/Navbar';
import axiosClient from "@/lib/axiosClient";
import NotificationComponent from '@components/Notification';
import { useDictionary } from "@context";
import { Notifications } from "@/app/interfaces/Notifications";
import Cookies from 'js-cookie';


const CodeValidation: React.FC = () => {
    const { dict } = useDictionary();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en";
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [notification, setNotification] = useState<Notifications>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [emailInput, setEmailInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        const savedEmail = Cookies.get('registrationEmail');
        if (savedEmail) {
            setUserEmail(savedEmail);
            setEmailInput(savedEmail);
        }
    }, []);

    const handleCodeChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        if (/^\d{6}$/.test(pastedData)) {
            const newCode = pastedData.split('');
            setCode(newCode);
            inputRefs.current[5]?.focus();
        }
    };

    const validateCode = async () => {
        if (code.join('').length !== 6) {
            setNotification({
                titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.VALIDATION_ERROR.TITLE,
                mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.VALIDATION_ERROR.MESSAGE,
                code: 400,
                tipo: "error",
            });
            return;
        }

        setIsLoading(true);

        try {
            await axiosClient.post('auth/verify-code', {
                code: parseInt(code.join('')),
                email: userEmail || emailInput
            });

            Cookies.remove('registrationEmail');

            setNotification({
                titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.TITLE,
                mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.SUCCESS.MESSAGE,
                code: 200,
                tipo: "success",
            });

            setTimeout(() => {
                window.location.href = `/${lang}/login`;
            }, 2000);

        } catch (error: any) {
            const errorData = error.response?.data;

            setNotification({
                titulo: errorData?.title || dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.TITLE,
                mensaje: errorData?.message || dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.ERROR.MESSAGE,
                code: error.response?.status || 500,
                tipo: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        if (!emailInput) {
            setNotification({
                titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.TITLE,
                mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.MESSAGE,
                code: 400,
                tipo: "error",
            });
            return;
        }

        setIsLoading(true);

        try {
            await axiosClient.post('auth/resend-code', {
                email: emailInput
            });

            setNotification({
                titulo: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_SUCCESS.TITLE,
                mensaje: dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_SUCCESS.MESSAGE,
                code: 200,
                tipo: "success",
            });

            Cookies.set('registrationEmail', emailInput, {
                expires: 1/24, // 1 hora en días
                secure: true, // Solo HTTPS
                sameSite: 'strict' // Protección contra CSRF
            });

            setIsModalOpen(false);

        } catch (error: any) {
            const errorData = error.response?.data;

            setNotification({
                titulo: errorData?.title || dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.TITLE,
                mensaje: errorData?.message || dict.CLIENT.CODE_VALIDATION.NOTIFICATIONS.RESEND_ERROR.MESSAGE,
                code: error.response?.status || 500,
                tipo: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!dict || Object.keys(dict).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar dict={dict} />
            <div className="flex flex-grow justify-center items-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md bg-(--color-glacier-50) rounded-2xl shadow-lg p-6"
                >
                    <h2 className="text-2xl font-semibold text-(--color-glacier-600) text-center uppercase mb-4">
                        {dict.CLIENT.CODE_VALIDATION.TITLE}
                    </h2>

                    <p className="text-center text-gray-600 mb-6">
                        {dict.CLIENT.CODE_VALIDATION.SUBTITLE}
                        {emailInput && <span className="font-bold block mt-1">{emailInput}</span>}
                    </p>

                    <div className="flex justify-center space-x-2 mb-8">
                        {Array(6).fill(null).map((_, index) => (
                            <div key={index} className="w-12 h-16 relative">
                                <input
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    maxLength={1}
                                    className={`w-full h-full text-center text-2xl font-bold rounded-lg border-2
                                    focus:outline-none focus:ring-2 transition-all ${
                                        code[index]
                                            ? 'border-(--color-glacier-500) bg-(--color-glacier-100) text-(--color-glacier-800)'
                                            : 'border-gray-300 bg-white text-gray-700'
                                    } focus:ring-(--color-glacier-400) focus:border-(--color-glacier-500)`}
                                    value={code[index]}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    disabled={isLoading}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={validateCode}
                            disabled={isLoading || code.join('').length !== 6}
                            className={`w-full py-3 rounded-full font-medium text-white
                            transition-all duration-300 ${
                                isLoading || code.join('').length !== 6
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-(--color-glacier-500) hover:bg-(--color-glacier-600) active:scale-98'
                            }`}
                        >
                            {isLoading
                                ? dict.CLIENT.CODE_VALIDATION.BUTTONS.LOADING
                                : dict.CLIENT.CODE_VALIDATION.BUTTONS.VERIFY}
                        </button>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={isLoading}
                            className="text-(--color-glacier-600) hover:text-(--color-glacier-800) text-sm font-medium transition-colors"
                        >
                            {dict.CLIENT.CODE_VALIDATION.BUTTONS.RESEND}
                        </button>
                    </div>
                </motion.div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-xl font-semibold mb-4">{dict.CLIENT.CODE_VALIDATION.RESEND_MODAL.TITLE}</h3>
                        <p className="text-gray-600 mb-4">{dict.CLIENT.CODE_VALIDATION.RESEND_MODAL.SUBTITLE}</p>

                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-(--color-glacier-400)"
                            placeholder={dict.CLIENT.CODE_VALIDATION.RESEND_MODAL.EMAIL_PLACEHOLDER}
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                disabled={isLoading}
                            >
                                {dict.CLIENT.CODE_VALIDATION.RESEND_MODAL.CANCEL}
                            </button>
                            <button
                                onClick={resendCode}
                                className={`px-4 py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-(--color-glacier-500) hover:bg-(--color-glacier-600)'}`}
                                disabled={isLoading}
                            >
                                {isLoading ? dict.CLIENT.CODE_VALIDATION.BUTTONS.LOADING : dict.CLIENT.CODE_VALIDATION.RESEND_MODAL.SEND}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
        </div>
    );
};

export default CodeValidation;