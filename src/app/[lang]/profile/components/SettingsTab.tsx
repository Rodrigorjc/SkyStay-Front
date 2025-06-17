"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { User } from "../types/Profile";
import { updateUserProfile, changePassword } from "../services/profileService";

interface SettingsTabProps {
  profile: User;
  onProfileUpdate: (profile: User) => void;
  onNotification: (notification: any) => void;
}

export default function SettingsTab({ profile, onProfileUpdate, onNotification }: SettingsTabProps) {
  const [activeSection, setActiveSection] = useState<"personal" | "security">("personal");
  const [loading, setLoading] = useState(false);
  
  // Estados para información personal
  const [personalData, setPersonalData] = useState({
    name: profile.name || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    birthDate: profile.birthDate || "",
    gender: profile.gender || "",
    nif: profile.nif || ""
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleUpdatePersonalInfo = async () => {
    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(personalData);
      onProfileUpdate(updatedProfile);
      
      onNotification({
        titulo: "¡Éxito!",
        mensaje: "Perfil actualizado correctamente",
        tipo: "success",
        code: 200
      });
    } catch (error: any) {
      onNotification({
        titulo: "Error",
        mensaje: error.message || "Error al actualizar el perfil",
        tipo: "error",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      onNotification({
        titulo: "Error",
        mensaje: "Todos los campos son obligatorios",
        tipo: "error",
        code: 400
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onNotification({
        titulo: "Error",
        mensaje: "Las contraseñas nuevas no coinciden",
        tipo: "error",
        code: 400
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      onNotification({
        titulo: "Error",
        mensaje: "La nueva contraseña debe tener al menos 6 caracteres",
        tipo: "error",
        code: 400
      });
      return;
    }

    try {
      setLoading(true);
      await changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      onNotification({
        titulo: "¡Éxito!",
        mensaje: "Contraseña cambiada correctamente",
        tipo: "success",
        code: 200
      });
    } catch (error: any) {
      onNotification({
        titulo: "Error",
        mensaje: error.message || "Error al cambiar contraseña",
        tipo: "error",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      id: "personal" as const,
      label: "Información Personal",
      icon: FaUser
    },
    {
      id: "security" as const,
      label: "Seguridad",
      icon: FaLock
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Navegación lateral */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-700 rounded-xl border border-glacier-700 p-4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                  activeSection === section.id
                    ? "bg-glacier-600 text-white"
                    : "text-glacier-300 hover:text-glacier-100 hover:bg-zinc-600"
                }`}
              >
                <section.icon className="text-lg" />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido */}
      <div className="lg:col-span-3">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-700 rounded-xl border border-glacier-700 p-6"
        >
          {activeSection === "personal" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-glacier-100">Información Personal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-glacier-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={personalData.name}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="Introduce tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-glacier-300 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="Introduce tus apellidos"
                  />
                </div>

                <div>
                  <label className="block text-glacier-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-glacier-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdatePersonalInfo}
                disabled={loading}
                className="bg-glacier-600 hover:bg-glacier-700 disabled:bg-zinc-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaCheck />
                )}
                <span>Actualizar información</span>
              </button>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-glacier-100">Cambiar Contraseña</h2>
              
              <div className="space-y-4 max-w-md">
                <div className="relative">
                  <label className="block text-glacier-300 mb-2">Contraseña actual</label>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 pr-10 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="Introduce tu contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-9 text-glacier-400 hover:text-glacier-200"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-glacier-300 mb-2">Nueva contraseña</label>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 pr-10 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="Introduce una nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-9 text-glacier-400 hover:text-glacier-200"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-glacier-300 mb-2">Repetir nueva contraseña</label>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-zinc-600 border border-glacier-600 rounded-lg px-3 py-2 pr-10 text-glacier-100 focus:outline-none focus:ring-2 focus:ring-glacier-500"
                    placeholder="Repite la nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-9 text-glacier-400 hover:text-glacier-200"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-glacier-600 hover:bg-glacier-700 disabled:bg-zinc-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? "Cambiando..." : "Cambiar contraseña"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}