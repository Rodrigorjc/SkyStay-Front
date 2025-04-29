"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function LocationSelector({ onChange }: { onChange: (latlng: { lat: number; lng: number }) => void }) {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconUrl: "/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/images/marker-shadow.png",
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    });
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onChange(e.latlng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[0, 0]} zoom={2} className="h-64 w-full rounded-xl" scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      <Marker position={[position.lat, position.lng]} />
    </MapContainer>
  );
}
