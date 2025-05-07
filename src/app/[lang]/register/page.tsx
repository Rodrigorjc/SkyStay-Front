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
import { FaEye, FaEyeSlash } from "react-icons/fa";


const getSteps = (dict: any) => [
    dict.CLIENT.REGISTER.STEPS.ACCOUNT,
    dict.CLIENT.REGISTER.STEPS.PERSONAL,
    dict.CLIENT.REGISTER.STEPS.IMAGE
];

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


const AccountStep: React.FC<{
    data: AccountData;
    errors: FormErrors;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    validateField: (name: string, value: string) => void;
    dict: any;
}> = ({ data, errors, handleChange, validateField, dict }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-(--color-glacier-500) font-semibold">
                    {dict.CLIENT.REGISTER.ACCOUNT_STEP.TITLE}
                </h2>
                <h2 className="text-lg text-gray-500">
                    {dict.CLIENT.REGISTER.STEP_INDICATOR.replace('{{current}}', '1').replace('{{total}}', '3')}
                </h2>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.LABEL}</label>
                <input
                    type="email"
                    name="email"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.email ? "border-red-500" : "border-(--color-glacier-500)"
                    } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300)`}
                    placeholder={dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.PLACEHOLDER}
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
                <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.LABEL}</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.password ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300) pr-10`}
                        placeholder={dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.PLACEHOLDER}
                        value={data.password}
                        onChange={handleChange}
                        onBlur={(e) => validateField("password", e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <FaEye className="h-5 w-5 text-gray-500"/>
                        ) : (
                            <FaEyeSlash className="h-5 w-5 text-gray-500"/>
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1"/> {errors.password}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label
                    className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.LABEL}</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.confirmPassword ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300) pr-10`}
                        placeholder={dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.PLACEHOLDER}
                        value={data.confirmPassword}
                        onChange={handleChange}
                        onBlur={(e) => validateField("confirmPassword", e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <FaEye className="h-5 w-5 text-gray-500"/>
                        ) : (
                            <FaEyeSlash className="h-5 w-5 text-gray-500"/>
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <MdError className="mr-1"/> {errors.confirmPassword}
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
    dict: any;
}> = ({data, errors, handleChange, validateField, dict}) => {
    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-(--color-glacier-500) font-semibold">
                    {dict.CLIENT.REGISTER.PERSONAL_STEP.TITLE}
                </h2>
                <h2 className="text-lg text-gray-500">
                    {dict.CLIENT.REGISTER.STEP_INDICATOR.replace('{{current}}', '2').replace('{{total}}', '3')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.PERSONAL_STEP.NAME.LABEL}</label>
                    <input
                        type="text"
                        name="name"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.name ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300)`}
                        placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.NAME.PLACEHOLDER}
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

                <div>
                    <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.PERSONAL_STEP.LAST_NAME.LABEL}</label>
                    <input
                        type="text"
                        name="lastName"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.lastName ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300)`}
                        placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.LAST_NAME.PLACEHOLDER}
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

                <div>
                    <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.LABEL}</label>
                    <input
                        type="text"
                        name="nif"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.nif ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300)`}
                        placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.PLACEHOLDER}
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

                <div>
                    <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.LABEL}</label>
                    <input
                        type="text"
                        name="phone"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.phone ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300)`}
                        placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.PLACEHOLDER}
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

                <div>
                    <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.PERSONAL_STEP.BIRTH_DATE.LABEL}</label>
                    <input
                        type="date"
                        name="birthDate"
                        className={`form-input w-full px-3 py-2 border ${
                            errors.birthDate ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300) min-h-[42px]`}
                        value={data.birthDate}
                        onChange={handleChange}
                        onBlur={(e) => validateField("birthDate", e.target.value)}
                        max={(() => {
                            const today = new Date();
                            const eighteenYearsAgo = new Date(
                                today.getFullYear() - 18,
                                today.getMonth(),
                                today.getDate()
                            );
                            return eighteenYearsAgo.toISOString().split('T')[0];
                        })()}
                    />
                    {errors.birthDate && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                            <MdError className="mr-1" /> {errors.birthDate}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.LABEL}</label>
                    <select
                        name="gender"
                        className={`form-select w-full px-3 py-2 border ${
                            errors.gender ? "border-red-500" : "border-(--color-glacier-500)"
                        } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300) min-h-[42px] pr-10`}
                        style={{
                            backgroundPositionX: "calc(100% - 8px)"
                        }}
                        value={data.gender}
                        onChange={handleChange}
                        onBlur={(e) => validateField("gender", e.target.value)}
                    >
                        <option value="0">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.OPTIONS.MALE}</option>
                        <option value="1">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.OPTIONS.FEMALE}</option>
                        <option value="2">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.OPTIONS.OTHER}</option>
                    </select>
                    {errors.gender && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                            <MdError className="mr-1" /> {errors.gender}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ImageStep: React.FC<{
    data: ImageData;
    errors: FormErrors;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dict: any;
}> = ({ data, errors, handleFileChange, dict }) => {
    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-(--color-glacier-500) font-semibold">
                    {dict.CLIENT.REGISTER.IMAGE_STEP.TITLE}
                </h2>
                <h2 className="text-lg text-gray-500">
                    {dict.CLIENT.REGISTER.STEP_INDICATOR.replace('{{current}}', '3').replace('{{total}}', '3')}
                </h2>
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">
                    {dict.CLIENT.REGISTER.IMAGE_STEP.UPLOAD_LABEL}
                </label>
                <input
                    type="file"
                    name="img"
                    accept="image/*"
                    className={`form-input w-full px-3 py-2 border ${
                        errors.img ? "border-red-500" : "border-(--color-glacier-500)"
                    } rounded-md placeholder:text-(--color-glacier-300) text-(--color-glacier-300)`}
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

const ProgressBar: React.FC<{
    step: number;
    steps: string[];
}> = ({ step, steps }) => {
    const percentage = ((step + 1) / steps.length) * 100;

    return (
        <div className="mb-4">
            <ul className="flex justify-between text-sm text-gray-400 mb-2">
                {steps.map((label, idx) => (
                    <li key={label} className={`flex-1 text-center ${idx <= step ? "text-(--color-glacier-700) font-bold" : ""}`}>
                        {label}
                    </li>
                ))}
            </ul>
            <div className="w-full bg-gray-300 h-2 rounded-full">
                <div className="h-2 bg-(--color-glacier-500) rounded-full transition-all duration-400" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const MultiStepForm: React.FC = () => {
    const [step, setStep] = useState(0);
    const { dict } = useDictionary();
    const pathname = usePathname();
    const [notification, setNotification] = useState<Notifications>();
    const steps = dict ? getSteps(dict) : [];


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
                    newErrors.email = dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.REQUIRED;
                } else if (!emailRegex.test(value)) {
                    newErrors.email = dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.INVALID;
                } else {
                    delete newErrors.email;
                }
                break;
            case "password":
                const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
                if (!value) {
                    newErrors.password = dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.REQUIRED;
                } else if (!passwordRegex.test(value)) {
                    newErrors.password = dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.INVALID;
                } else {
                    delete newErrors.password;
                }
                // Validar también confirmPassword si ya existe
                if (accountData.confirmPassword) {
                    if (value !== accountData.confirmPassword) {
                        newErrors.confirmPassword = dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.MISMATCH;
                    } else {
                        delete newErrors.confirmPassword;
                    }
                }
                break;
            case "confirmPassword":
                if (!value) {
                    newErrors.confirmPassword = dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.REQUIRED;
                } else if (value !== accountData.password) {
                    newErrors.confirmPassword = dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.MISMATCH;
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            case "name":
                if (!value) {
                    newErrors.name = dict.CLIENT.REGISTER.PERSONAL_STEP.NAME.REQUIRED;
                } else {
                    delete newErrors.name;
                }
                break;
            case "lastName":
                if (!value) {
                    newErrors.lastName = dict.CLIENT.REGISTER.PERSONAL_STEP.LAST_NAME.REQUIRED;
                } else {
                    delete newErrors.lastName;
                }
                break;
            case "nif":
                const nifRegex = /^[0-9]{8}[A-Z]$/;
                if (!value) {
                    newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.REQUIRED;
                } else if (!nifRegex.test(value)) {
                    newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.INVALID;
                } else {
                    delete newErrors.nif;
                }
                break;
            case "phone":
                const phoneRegex = /^\d{9,15}$/;
                if (!value) {
                    newErrors.phone = dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.REQUIRED;
                } else if (!phoneRegex.test(value)) {
                    newErrors.phone = dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.INVALID;
                } else {
                    delete newErrors.phone;
                }
                break;
            case "birthDate":
                if (!value) {
                    newErrors.birthDate = dict.CLIENT.REGISTER.PERSONAL_STEP.BIRTH_DATE.REQUIRED;
                } else {
                    delete newErrors.birthDate;
                }
                break;
            case "gender":
                if (value === "") {
                    newErrors.gender = dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.REQUIRED;
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
                newErrors.email = dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.REQUIRED;
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
                newErrors.email = dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.INVALID;
                isValid = false;
            }

            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
            if (!accountData.password) {
                newErrors.password = dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.REQUIRED;
                isValid = false;
            } else if (!passwordRegex.test(accountData.password)) {
                newErrors.password = dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.INVALID;
                isValid = false;
            }

            if (!accountData.confirmPassword) {
                newErrors.confirmPassword = dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.REQUIRED;
                isValid = false;
            } else if (accountData.confirmPassword !== accountData.password) {
                newErrors.confirmPassword = dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.MISMATCH;
                isValid = false;
            }
        } else if (step === 1) {
            if (!personalData.name) {
                newErrors.name = dict.CLIENT.REGISTER.PERSONAL_STEP.NAME.REQUIRED;
                isValid = false;
            }

            if (!personalData.lastName) {
                newErrors.lastName = dict.CLIENT.REGISTER.PERSONAL_STEP.LAST_NAME.REQUIRED;
                isValid = false;
            }

            if (!personalData.nif) {
                newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.REQUIRED;
                isValid = false;
            } else if (!/^[0-9]{8}[A-Z]$/.test(personalData.nif)) {
                newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.INVALID;
                isValid = false;
            }

            if (!personalData.phone) {
                newErrors.phone = dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.REQUIRED;
                isValid = false;
            } else if (!/^\d{9,15}$/.test(personalData.phone)) {
                newErrors.phone = dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.INVALID;
                isValid = false;
            }

            if (!personalData.birthDate) {
                newErrors.birthDate = dict.CLIENT.REGISTER.PERSONAL_STEP.BIRTH_DATE.REQUIRED;
                isValid = false;
            }

            if (personalData.gender === undefined) {
                newErrors.gender = dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.REQUIRED;
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
                newErrors[name as keyof FormErrors] = dict.CLIENT.REGISTER.IMAGE_STEP.VALIDATION.SIZE_ERROR;
            } else if (!file.type.startsWith("image/")) {
                newErrors[name as keyof FormErrors] = dict.CLIENT.REGISTER.IMAGE_STEP.VALIDATION.TYPE_ERROR;
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
                    titulo: dict.CLIENT.REGISTER.NOTIFICATIONS.REGISTER_SUCCESS.TITLE,
                    mensaje: dict.CLIENT.REGISTER.NOTIFICATIONS.REGISTER_SUCCESS.MESSAGE,
                    code: 200,
                    tipo: "success",
                });
            }
            setStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            setNotification({
                titulo: dict.CLIENT.REGISTER.NOTIFICATIONS.VALIDATION_ERROR.TITLE,
                mensaje: dict.CLIENT.REGISTER.NOTIFICATIONS.VALIDATION_ERROR.MESSAGE,
                code: 400,
                tipo: "error",
            });
        }
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const renderStep = () => {
        if (!dict || Object.keys(dict).length === 0) {
            return;
        }
        switch (step) {
            case 0:
                return (
                    <AccountStep
                        data={accountData}
                        errors={errors}
                        handleChange={handleAccountChange}
                        validateField={validateField}
                        dict={dict}
                    />
                );
            case 1:
                return (
                    <PersonalStep
                        data={personalData}
                        errors={errors}
                        handleChange={handlePersonalChange}
                        validateField={validateField}
                        dict={dict}
                    />
                );
            case 2:
                return (
                    <ImageStep
                        data={imageData}
                        errors={errors}
                        handleFileChange={handleFileChange}
                        dict={dict}
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
                    titulo: dict.CLIENT.REGISTER.NOTIFICATIONS.REGISTER_SUCCESS.TITLE,
                    mensaje: dict.CLIENT.REGISTER.NOTIFICATIONS.REGISTER_SUCCESS.MESSAGE,
                    code: 200,
                    tipo: "success",
                });

                const lang = pathname.split("/")[1] || "en";
                setTimeout(() => {
                    window.location.href = `/${lang}/login`;
                }, 1000);

            } catch (error: any) {
                console.error("Error de registro:", error);

                const errorData = error.response?.data;

                setNotification({
                    titulo: errorData?.title || dict.CLIENT.REGISTER.NOTIFICATIONS.ERROR.TITLE,
                    mensaje: errorData?.message || dict.CLIENT.REGISTER.NOTIFICATIONS.ERROR.MESSAGE,
                    code: error.response?.status || 500,
                    tipo: "error",
                });
            }
        } else {
            setNotification({
                titulo: dict.CLIENT.REGISTER.NOTIFICATIONS.VALIDATION_ERROR.TITLE,
                mensaje: dict.CLIENT.REGISTER.NOTIFICATIONS.VALIDATION_ERROR.MESSAGE,
                code: 400,
                tipo: "error",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar dict={dict} />
            <div className="flex flex-grow justify-center items-center p-4">
                <div className="w-full max-w-4xl bg-(--color-glacier-50) rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-(--color-glacier-600) text-center uppercase mb-2">
                        {dict.CLIENT.REGISTER.TITLE}
                    </h2>
                    <p className="text-center text-gray-500 mb-4">
                        {dict.CLIENT.REGISTER.SUBTITLE}
                    </p>

                    <ProgressBar step={step} steps={steps} />

                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.6 }}
                    >
                        {renderStep()}
                    </motion.div>

                    <div className="flex justify-between mt-4">
                        {step > 0 && (
                            <button
                                onClick={prevStep}
                                className="bg-gray-600 text-white px-4 py-2 hover:bg-gray-700
                                transition-all duration-400 hover:scale-105
                                active:scale-95 active:bg-gray-800 rounded-full"
                            >
                                {dict.CLIENT.REGISTER.BUTTONS.PREVIOUS}
                            </button>
                        )}
                        {step < steps.length - 1 ? (
                            <button
                                onClick={nextStep}
                                className="bg-(--color-glacier-500) text-white px-4 py-2
                                hover:bg-(--color-glacier-600) ml-auto transition-all duration-400 hover:scale-105
                                active:scale-95 active:bg-(--color-glacier-700) rounded-full"
                            >
                                {dict.CLIENT.REGISTER.BUTTONS.NEXT}
                            </button>
                        ) : step === steps.length - 1 ? (
                            <button
                                onClick={submitForm}
                                className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 ml-auto
                                transition-all duration-400 hover:scale-105
                                active:scale-95 active:bg-green-900 rounded-full"
                            >
                                {dict.CLIENT.REGISTER.BUTTONS.FINISH}
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