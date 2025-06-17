"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@components/Navbar";
import { useDictionary } from "@context";
import { Notifications } from "@/app/interfaces/Notifications";
import NotificationComponent from "@components/Notification";
import { MdError } from "react-icons/md";
import axiosClient from "@/lib/axiosClient";
import { usePathname } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import Image from "next/image";

const getSteps = (dict: any) => [dict.CLIENT.REGISTER.STEPS.ACCOUNT, dict.CLIENT.REGISTER.STEPS.PERSONAL, dict.CLIENT.REGISTER.STEPS.IMAGE];

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-glacier-200 font-semibold">{dict.CLIENT.REGISTER.ACCOUNT_STEP.TITLE}</h2>
        <h2 className="text-lg text-glacier-400">{dict.CLIENT.REGISTER.STEP_INDICATOR.replace("{{current}}", "1").replace("{{total}}", "3")}</h2>
      </div>

      <div className="mb-4">
        <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.LABEL}</label>
        <input
          type="email"
          name="email"
          className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all ${
            errors.email ? "border-red-500" : "border-zinc-600"
          }`}
          placeholder={dict.CLIENT.REGISTER.ACCOUNT_STEP.EMAIL.PLACEHOLDER}
          value={data.email}
          onChange={handleChange}
          onBlur={e => validateField("email", e.target.value)}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-2 flex items-center">
            <MdError className="mr-1" /> {errors.email}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.LABEL}</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all pr-12 ${
              errors.password ? "border-red-500" : "border-zinc-600"
            }`}
            placeholder={dict.CLIENT.REGISTER.ACCOUNT_STEP.PASSWORD.PLACEHOLDER}
            value={data.password}
            onChange={handleChange}
            onBlur={e => validateField("password", e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-glacier-400 hover:text-glacier-200 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-2 flex items-center">
            <MdError className="mr-1" /> {errors.password}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.LABEL}</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all pr-12 ${
              errors.confirmPassword ? "border-red-500" : "border-zinc-600"
            }`}
            placeholder={dict.CLIENT.REGISTER.ACCOUNT_STEP.CONFIRM_PASSWORD.PLACEHOLDER}
            value={data.confirmPassword}
            onChange={handleChange}
            onBlur={e => validateField("confirmPassword", e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-glacier-400 hover:text-glacier-200 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mt-2 flex items-center">
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
  dict: any;
}> = ({ data, errors, handleChange, validateField, dict }) => {
  return (
    <div className="text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-glacier-200 font-semibold">{dict.CLIENT.REGISTER.PERSONAL_STEP.TITLE}</h2>
        <h2 className="text-lg text-glacier-400">{dict.CLIENT.REGISTER.STEP_INDICATOR.replace("{{current}}", "2").replace("{{total}}", "3")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.PERSONAL_STEP.NAME.LABEL}</label>
          <input
            type="text"
            name="name"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all ${
              errors.name ? "border-red-500" : "border-zinc-600"
            }`}
            placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.NAME.PLACEHOLDER}
            value={data.name}
            onChange={handleChange}
            onBlur={e => validateField("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <MdError className="mr-1" /> {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.PERSONAL_STEP.LAST_NAME.LABEL}</label>
          <input
            type="text"
            name="lastName"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all ${
              errors.lastName ? "border-red-500" : "border-zinc-600"
            }`}
            placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.LAST_NAME.PLACEHOLDER}
            value={data.lastName}
            onChange={handleChange}
            onBlur={e => validateField("lastName", e.target.value)}
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <MdError className="mr-1" /> {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.LABEL}</label>
          <input
            type="text"
            name="nif"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all ${
              errors.nif ? "border-red-500" : "border-zinc-600"
            }`}
            placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.PLACEHOLDER}
            value={data.nif}
            onChange={handleChange}
            onBlur={e => validateField("nif", e.target.value)}
          />
          {errors.nif && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <MdError className="mr-1" /> {errors.nif}
            </p>
          )}
        </div>

        <div>
          <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.LABEL}</label>
          <input
            type="text"
            name="phone"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 placeholder-glacier-400 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all ${
              errors.phone ? "border-red-500" : "border-zinc-600"
            }`}
            placeholder={dict.CLIENT.REGISTER.PERSONAL_STEP.PHONE.PLACEHOLDER}
            value={data.phone}
            onChange={handleChange}
            onBlur={e => validateField("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <MdError className="mr-1" /> {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.PERSONAL_STEP.BIRTH_DATE.LABEL}</label>
          <input
            type="date"
            name="birthDate"
            className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all min-h-[48px] ${
              errors.birthDate ? "border-red-500" : "border-zinc-600"
            }`}
            value={data.birthDate}
            onChange={handleChange}
            onBlur={e => validateField("birthDate", e.target.value)}
            max={(() => {
              const today = new Date();
              const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
              return eighteenYearsAgo.toISOString().split("T")[0];
            })()}
          />
          {errors.birthDate && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <MdError className="mr-1" /> {errors.birthDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.LABEL}</label>
          <select
            name="gender"
            className={`form-select w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all min-h-[48px] ${
              errors.gender ? "border-red-500" : "border-zinc-600"
            }`}
            value={data.gender}
            onChange={handleChange}
            onBlur={e => validateField("gender", e.target.value)}>
            <option value="0">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.OPTIONS.MALE}</option>
            <option value="1">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.OPTIONS.FEMALE}</option>
            <option value="2">{dict.CLIENT.REGISTER.PERSONAL_STEP.GENDER.OPTIONS.OTHER}</option>
          </select>
          {errors.gender && (
            <p className="text-red-400 text-sm mt-2 flex items-center">
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-glacier-200 font-semibold">{dict.CLIENT.REGISTER.IMAGE_STEP.TITLE}</h2>
        <h2 className="text-lg text-glacier-400">{dict.CLIENT.REGISTER.STEP_INDICATOR.replace("{{current}}", "3").replace("{{total}}", "3")}</h2>
      </div>

      <div className="mb-4">
        <label className="block text-glacier-300 mb-2 font-medium">{dict.CLIENT.REGISTER.IMAGE_STEP.UPLOAD_LABEL}</label>
        <input
          type="file"
          name="img"
          accept="image/*"
          className={`form-input w-full px-4 py-3 border rounded-lg bg-zinc-700 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-glacier-600 file:text-white hover:file:bg-glacier-700 ${
            errors.img ? "border-red-500" : "border-zinc-600"
          }`}
          onChange={handleFileChange}
        />
        {errors.img && (
          <p className="text-red-400 text-sm mt-2 flex items-center">
            <MdError className="mr-1" /> {errors.img}
          </p>
        )}
        {data.img && (
          <div className="mt-4">
            <Image
              src={URL.createObjectURL(data.img)}
              alt="Foto de perfil"
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-lg border-2 border-glacier-500"
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
    <div className="mb-6">
      <ul className="flex justify-between text-sm text-glacier-400 mb-3">
        {steps.map((label, idx) => (
          <li key={label} className={`flex-1 text-center transition-all ${idx <= step ? "text-glacier-200 font-bold" : ""}`}>
            {label}
          </li>
        ))}
      </ul>
      <div className="w-full bg-zinc-700 h-2 rounded-full">
        <div className="h-2 bg-glacier-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
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
        const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        const nifRegex = /^[0-9]{8}[A-Z]$/;
        if (!value) {
          newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.REQUIRED;
        } else if (!nifRegex.test(value)) {
          newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.INVALID;
        } else {
          const number = parseInt(value.substring(0, 8));
          const providedLetter = value.charAt(8);
          const correctLetter = letters.charAt(number % 23);

          if (providedLetter !== correctLetter) {
            newErrors.nif = dict.CLIENT.REGISTER.PERSONAL_STEP.NIF.INVALID_DATA;
          } else {
            delete newErrors.nif;
          }
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
          const birthDate = new Date(value);
          const today = new Date();
          const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
          if (birthDate > eighteenYearsAgo) {
            newErrors.birthDate = dict.CLIENT.REGISTER.PERSONAL_STEP.BIRTH_DATE.MIN_AGE;
          } else {
            delete newErrors.birthDate;
          }
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
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "gender") {
      setPersonalData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setPersonalData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setImageData(prev => ({ ...prev, [name]: files[0] }));

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
      setStep(prev => Math.min(prev + 1, steps.length - 1));
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
    setStep(prev => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    if (!dict || Object.keys(dict).length === 0) {
      return;
    }
    switch (step) {
      case 0:
        return <AccountStep data={accountData} errors={errors} handleChange={handleAccountChange} validateField={validateField} dict={dict} />;
      case 1:
        return <PersonalStep data={personalData} errors={errors} handleChange={handlePersonalChange} validateField={validateField} dict={dict} />;
      case 2:
        return <ImageStep data={imageData} errors={errors} handleFileChange={handleFileChange} dict={dict} />;
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
          password: accountData.password,
        };

        Object.entries(userData).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        if (imageData.img) {
          formData.append("img", imageData.img);
        }

        const response = await axiosClient.post("auth/register", formData);

        console.log("Respuesta del servidor:", response.data);

        Cookies.set("registrationEmail", accountData.email, {
          expires: 1 / 24, // 1 hora en días
          secure: true, // Solo HTTPS
          sameSite: "strict", // Protección contra CSRF
        });

        setNotification({
          titulo: dict.CLIENT.REGISTER.NOTIFICATIONS.REGISTER_SUCCESS.TITLE,
          mensaje: dict.CLIENT.REGISTER.NOTIFICATIONS.REGISTER_SUCCESS.MESSAGE,
          code: 200,
          tipo: "success",
        });

        const lang = pathname.split("/")[1] || "en";
        setTimeout(() => {
          window.location.href = `/${lang}/code_validation`;
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="flex flex-grow justify-center items-center p-4">
        <div className="w-full max-w-4xl bg-zinc-800 rounded-xl shadow-2xl border border-glacier-700 p-8">
          <h2 className="text-3xl font-bold text-glacier-200 text-center uppercase mb-2">{dict.CLIENT.REGISTER.TITLE}</h2>
          <p className="text-center text-glacier-400 mb-8">{dict.CLIENT.REGISTER.SUBTITLE}</p>

          <ProgressBar step={step} steps={steps} />

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {renderStep()}
          </motion.div>

          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="bg-zinc-600 hover:bg-zinc-700 text-glacier-200 px-6 py-3 rounded-lg font-medium
                                transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {dict.CLIENT.REGISTER.BUTTONS.PREVIOUS}
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="bg-glacier-600 hover:bg-glacier-700 text-white px-6 py-3 rounded-lg font-medium
                                ml-auto transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {dict.CLIENT.REGISTER.BUTTONS.NEXT}
              </button>
            ) : step === steps.length - 1 ? (
              <button
                onClick={submitForm}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium
                                ml-auto transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {dict.CLIENT.REGISTER.BUTTONS.FINISH}
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {notification && <NotificationComponent Notifications={notification} onClose={() => setNotification(undefined)} />}
    </div>
  );
};

export default MultiStepForm;
