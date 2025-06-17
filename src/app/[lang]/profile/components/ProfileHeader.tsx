"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCamera, FaShieldAlt, FaUser } from "react-icons/fa";
import { User } from "../types/Profile";
import { uploadProfileImage } from "../services/profileService";
import { Notifications } from "@/app/interfaces/Notifications";

export interface ProfileHeaderProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
  onNotification: (notification: Notifications) => void;
}

export default function ProfileHeader({ user, onUserUpdate, onNotification }: ProfileHeaderProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotification({
        titulo: "Error",
        mensaje: "Por favor selecciona un archivo de imagen válido",
        tipo: "error",
        code: 400
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onNotification({
        titulo: "Error", 
        mensaje: "La imagen no puede superar los 5MB",
        tipo: "error",
        code: 400
      });
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await uploadProfileImage(file);
      
      const updatedUser = { ...user, img: imageUrl };
      onUserUpdate(updatedUser);
      
      onNotification({
        titulo: "¡Éxito!",
        mensaje: "Imagen de perfil actualizada correctamente",
        tipo: "success",
        code: 200
      });
    } catch (error: any) {
      onNotification({
        titulo: "Error",
        mensaje: error.message || "Error al subir la imagen",
        tipo: "error",
        code: 500
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const getInitials = () => {
    const firstName = user.name || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const hasValidImage = user.img && user.img !== "" && !user.img.includes("example.com");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-700 rounded-xl border border-glacier-700 p-6"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-glacier-500/20">
            {hasValidImage ? (
              <Image
                src={user.img}
                alt={`${user.name} ${user.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-glacier-500 to-glacier-700 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getInitials() || <FaUser className="text-xl" />}
                </span>
              </div>
            )}
          </div>
          
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            {uploadingImage ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <FaCamera className="text-white text-lg" />
            )}
          </label>
        </div>

        {/* Info del usuario */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-glacier-100">
            {user.name} {user.lastName}
          </h1>
          <p className="text-glacier-400 text-lg">{user.email}</p>
          {user.phone && (
            <p className="text-glacier-400">{user.phone}</p>
          )}
          
          {/* Badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
            {user.validation && (
              <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg border border-green-500/30">
                <FaShieldAlt className="text-xs" />
                <span className="text-xs font-medium">Verificado</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 bg-glacier-500/20 text-glacier-400 px-2 py-1 rounded-lg border border-glacier-500/30">
              <span className="text-xs font-medium">
                Miembro desde {new Date(user.createdAt).getFullYear()}
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg border border-blue-500/30">
              <span className="text-xs font-medium uppercase">{user.rol}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}