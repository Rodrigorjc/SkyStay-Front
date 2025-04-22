"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@components/Navbar";
import { useDictionary } from "@context";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@components/Notification";
import { MdError } from "react-icons/md";
import axiosClient from "@/lib/axiosClient";
import {usePathname} from "next/navigation";
import router from "next/router";

const steps = ["Account", "Personal", "Image"];

interface AccountData {
    email: string;
    password: string;
    confirmPassword: string;
}

interface PersonalData {
    name: string;
    lastName: string;
    nif: string;
    phone: string;
    birthDate: string;
    gender: number;
}

interface ImageData {
    img: File | null;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    lastName?: string;
    nif?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    img?: string;
}

interface ProgressBarProps {
    step: number;
}

const AccountStep: React.FC<{
    data: AccountData;
    errors: FormErrors;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    validateField: (name: string, value: string) => void;
}> = ({ data, errors, handleChange, validateField }) => {
    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-purple-700 font-semibold">Información de la cuenta:</h2>
                <h2 className="text-lg text-gray-500">Paso 1 - 4</h2>
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Email: *</label>
                <input
                    type="email"
                    name="email"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Email"
                    value={data.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField("email", e.target.value)}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.email}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Contraseña: *</label>
                <input
                    type="password"
                    name="password"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Contraseña"
                    value={data.password}
                    onChange={handleChange}
                    onBlur={(e) => validateField("password", e.target.value)}
                />
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.password}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Confirmar Contraseña: *</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Confirmar Contraseña"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    onBlur={(e) => validateField("confirmPassword", e.target.value)}
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.confirmPassword}
                    </p>
                )}
            </div>
        </div>
    );
};

const PersonalStep: React.FC<{
    data: PersonalData;
    errors: FormErrors;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    validateField: (name: string, value: string) => void;
}> = ({ data, errors, handleChange, validateField }) => {
    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-purple-700 font-semibold">Información Personal:</h2>
                <h2 className="text-lg text-gray-500">Paso 2 - 4</h2>
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nombre: *</label>
                <input
                    type="text"
                    name="name"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Nombre"
                    value={data.name}
                    onChange={handleChange}
                    onBlur={(e) => validateField("name", e.target.value)}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.name}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Apellidos: *</label>
                <input
                    type="text"
                    name="lastName"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Apellidos"
                    value={data.lastName}
                    onChange={handleChange}
                    onBlur={(e) => validateField("lastName", e.target.value)}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.lastName}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">NIF/DNI: *</label>
                <input
                    type="text"
                    name="nif"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.nif ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="NIF/DNI"
                    value={data.nif}
                    onChange={handleChange}
                    onBlur={(e) => validateField("nif", e.target.value)}
                />
                {errors.nif && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.nif}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Teléfono: *</label>
                <input
                    type="text"
                    name="phone"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Teléfono"
                    value={data.phone}
                    onChange={handleChange}
                    onBlur={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.phone}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Fecha de Nacimiento: *</label>
                <input
                    type="date"
                    name="birthDate"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.birthDate ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    value={data.birthDate}
                    onChange={handleChange}
                    onBlur={(e) => validateField("birthDate", e.target.value)}
                />
                {errors.birthDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.birthDate}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Género: *</label>
                <select
                    name="gender"
                    className={`form-select w-full px-3 py-2 border ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    value={data.gender}
                    onChange={handleChange}
                    onBlur={(e) => validateField("gender", e.target.value)}
                >
                    <option value="">Seleccionar</option>
                    <option value="0">Masculino</option>
                    <option value="1">Femenino</option>
                    <option value="2">Otro</option>
                </select>
                {errors.gender && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.gender}
                    </p>
                )}
            </div>
        </div>
    );
};

const ImageStep: React.FC<{
    data: ImageData;
    errors: FormErrors;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ data, errors, handleFileChange }) => {
    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-purple-700 font-semibold">Foto de Perfil:</h2>
                <h2 className="text-lg text-gray-500">Paso 3 - 4</h2>
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Sube tu foto de perfil:</label>
                <input
                    type="file"
                    name="img"
                    accept="image/*"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.img ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    onChange={handleFileChange}
                />
                {errors.img && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1" /> {errors.img}
                    </p>
                )}
                {data.img && (
                    <div className="mt-2">
                        <img
                            src={URL.createObjectURL(data.img)}
                            alt="Foto de perfil"
                            className="w-24 h-24 object-cover rounded-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
    const percentage = ((step + 1) / steps.length) * 100;

    return (
        <div className="mb-4">
            <ul className="flex justify-between text-sm text-gray-400 mb-2">
                {steps.map((label, idx) => (
                    <li key={label} className={`flex-1 text-center ${idx <= step ? "text-purple-700 font-bold" : ""}`}>
                        {label}
                    </li>
                ))}
            </ul>
            <div className="w-full bg-gray-300 h-2 rounded-full">
                <div className="h-2 bg-purple-700 rounded-full transition-all" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const MultiStepForm: React.FC = () => {
    const [step, setStep] = useState(0);
    const { dict } = useDictionary();
    const [notification, setNotification] = useState<Notifications>();

    const [accountData, setAccountData] = useState<AccountData>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [personalData, setPersonalData] = useState<PersonalData>({
        name: "",
        lastName: "",
        nif: "",
        phone: "",
        birthDate: "",
        gender: 0,
    });

    const [imageData, setImageData] = useState<ImageData>({
        img: null,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    if (!dict || Object.keys(dict).length === 0) {
        return null;
    }

    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.email = "El email es obligatorio";
                } else if (!emailRegex.test(value)) {
                    newErrors.email = "El formato del email no es válido";
                } else {
                    delete newErrors.email;
                }
                break;
            case "password":
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
                if (!value) {
                    newErrors.password = "La contraseña es obligatoria";
                } else if (!passwordRegex.test(value)) {
                    newErrors.password = "La contraseña debe tener al menos 6 caracteres, un número y un carácter especial";
                } else {
                    delete newErrors.password;
                }
                // Validar también confirmPassword si ya existe
                if (accountData.confirmPassword) {
                    if (value !== accountData.confirmPassword) {
                        newErrors.confirmPassword = "Las contraseñas no coinciden";
                    } else {
                        delete newErrors.confirmPassword;
                    }
                }
                break;
            case "confirmPassword":
                if (!value) {
                    newErrors.confirmPassword = "Debe confirmar la contraseña";
                } else if (value !== accountData.password) {
                    newErrors.confirmPassword = "Las contraseñas no coinciden";
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            case "name":
                if (!value) {
                    newErrors.name = "El nombre es obligatorio";
                } else {
                    delete newErrors.name;
                }
                break;
            case "lastName":
                if (!value) {
                    newErrors.lastName = "Los apellidos son obligatorios";
                } else {
                    delete newErrors.lastName;
                }
                break;
            case "nif":
                const nifRegex = /^[0-9]{8}[A-Z]$/;
                if (!value) {
                    newErrors.nif = "El NIF/DNI es obligatorio";
                } else if (!nifRegex.test(value)) {
                    newErrors.nif = "El formato del NIF/DNI no es válido";
                } else {
                    delete newErrors.nif;
                }
                break;
            case "phone":
                const phoneRegex = /^\d{9,15}$/;
                if (!value) {
                    newErrors.phone = "El número de teléfono es obligatorio";
                } else if (!phoneRegex.test(value)) {
                    newErrors.phone = "El formato del número de teléfono no es válido";
                } else {
                    delete newErrors.phone;
                }
                break;
            case "birthDate":
                if (!value) {
                    newErrors.birthDate = "La fecha de nacimiento es obligatoria";
                } else {
                    delete newErrors.birthDate;
                }
                break;
            case "gender":
                if (value === "") {
                    newErrors.gender = "El género es obligatorio";
                } else {
                    delete newErrors.gender;
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (step === 0) {
            if (!accountData.email) {
                newErrors.email = "El email es obligatorio";
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
                newErrors.email = "El formato del email no es válido";
                isValid = false;
            }

            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
            if (!accountData.password) {
                newErrors.password = "La contraseña es obligatoria";
                isValid = false;
            } else if (!passwordRegex.test(accountData.password)) {
                newErrors.password = "La contraseña debe tener al menos 6 caracteres, un número y un carácter especial";
                isValid = false;
            }

            if (!accountData.confirmPassword) {
                newErrors.confirmPassword = "Debe confirmar la contraseña";
                isValid = false;
            } else if (accountData.confirmPassword !== accountData.password) {
                newErrors.confirmPassword = "Las contraseñas no coinciden";
                isValid = false;
            }
        } else if (step === 1) {
            if (!personalData.name) {
                newErrors.name = "El nombre es obligatorio";
                isValid = false;
            }

            if (!personalData.lastName) {
                newErrors.lastName = "El apellido es obligatorio";
                isValid = false;
            }

            if (!personalData.nif) {
                newErrors.nif = "El NIF/DNI es obligatorio";
                isValid = false;
            } else if (!/^[0-9]{8}[A-Z]$/.test(personalData.nif)) {
                newErrors.nif = "El formato del NIF/DNI no es válido";
                isValid = false;
            }

            if (!personalData.phone) {
                newErrors.phone = "El número de teléfono es obligatorio";
                isValid = false;
            } else if (!/^\d{9,15}$/.test(personalData.phone)) {
                newErrors.phone = "El formato del número de teléfono no es válido";
                isValid = false;
            }

            if (!personalData.birthDate) {
                newErrors.birthDate = "La fecha de nacimiento es obligatoria";
                isValid = false;
            }

            if (personalData.gender === undefined) {
                newErrors.gender = "El género es obligatorio";
                isValid = false;
            }
        } else if (step === 2) {
            // La imagen es opcional, no necesita validación obligatoria
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "gender") {
            setPersonalData((prev) => ({ ...prev, [name]: parseInt(value) }));
        } else {
            setPersonalData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setImageData((prev) => ({ ...prev, [name]: files[0] }));

            const file = files[0];
            const newErrors = { ...errors };

            if (file.size > 5 * 1024 * 1024) {
                newErrors[name as keyof FormErrors] = "El archivo no debe superar los 5MB";
            } else if (!file.type.startsWith("image/")) {
                newErrors[name as keyof FormErrors] = "El archivo debe ser una imagen";
            } else {
                delete newErrors[name as keyof FormErrors];
            }

            setErrors(newErrors);
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            if (step === steps.length - 1) {
                setNotification({
                    titulo: "Registro completado",
                    mensaje: "Tu cuenta ha sido creada correctamente",
                    code: 200,
                    tipo: "success",
                });
            }
            setStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            setNotification({
                titulo: "Error de validación",
                mensaje: "Por favor, completa correctamente todos los campos requeridos",
                code: 400,
                tipo: "error",
            });
        }
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <AccountStep
                        data={accountData}
                        errors={errors}
                        handleChange={handleAccountChange}
                        validateField={validateField}
                    />
                );
            case 1:
                return (
                    <PersonalStep
                        data={personalData}
                        errors={errors}
                        handleChange={handlePersonalChange}
                        validateField={validateField}
                    />
                );
            case 2:
                return (
                    <ImageStep
                        data={imageData}
                        errors={errors}
                        handleFileChange={handleFileChange}
                    />
                );
            default:
                return null;
        }
    };


    const submitForm = async () => {
        if (validateStep()) {
            try {
                const formData = new FormData();

                const userData = {
                    name: personalData.name,
                    lastName: personalData.lastName,
                    email: accountData.email,
                    birthDate: personalData.birthDate,
                    nif: personalData.nif,
                    phone: personalData.phone,
                    gender: personalData.gender,
                    password: accountData.password
                };

                Object.entries(userData).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });

                if (imageData.img) {
                    formData.append('img', imageData.img);
                }

                const response = await axiosClient.post('auth/register', formData);

                console.log("Respuesta del servidor:", response.data);


                setNotification({
                    titulo: "Registro completado",
                    mensaje: "Tu cuenta ha sido creada correctamente",
                    code: 200,
                    tipo: "success",
                });
                const pathname = usePathname();
                const lang = pathname.split("/")[1] || "en";
                setTimeout(() => {
                    router.push(`/${lang}/login`);
                }, 1000);

            } catch (error: any) {
                console.error("Error de registro:", error);

                const errorData = error.response?.data;

                setNotification({
                    titulo: errorData?.title || "Error en el registro",
                    mensaje: errorData?.message || "No se pudo completar el registro",
                    code: error.response?.status || 500,
                    tipo: "error",
                });
            }
        } else {
            setNotification({
                titulo: "Error de validación",
                mensaje: "Por favor, completa correctamente todos los campos requeridos",
                code: 400,
                tipo: "error",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar dict={dict} />
            <div className="flex flex-grow justify-center items-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-md shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-purple-700 text-center uppercase mb-2">
                        Sign Up Your User Account
                    </h2>
                    <p className="text-center text-gray-500 mb-4">
                        Fill all form fields to go to next step
                    </p>

                    <ProgressBar step={step} />

                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderStep()}
                    </motion.div>

                    <div className="flex justify-between mt-4">
                        {step > 0 && (
                            <button
                                onClick={prevStep}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-black"
                            >
                                Previous
                            </button>
                        )}
                        {step < steps.length - 1 ? (
                            <button
                                onClick={nextStep}
                                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 ml-auto"
                            >
                                Next
                            </button>
                        ) : step === steps.length - 1 ? (
                            <button
                                onClick={submitForm}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 ml-auto"
                            >
                                Finalizar
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
            {notification && (
                <NotificationComponent
                    Notifications={notification}
                    onClose={() => setNotification(undefined)}
                />
            )}
        </div>
    );
};

export default MultiStepForm;