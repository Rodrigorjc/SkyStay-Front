"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationSelectorProps {
  onChange: Function;
  initialPosition?: { lat: number; lng: number };
}

export default function LocationSelector({ onChange, initialPosition = { lat: 0, lng: 0 } }: LocationSelectorProps) {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const isSamePosition = position.lat === initialPosition.lat && position.lng === initialPosition.lng;

    if (!isSamePosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition, position]);

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
    <MapContainer center={[position.lat, position.lng]} zoom={2} className="h-64 w-full rounded-xl" scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      <Marker position={[position.lat, position.lng]} />
    </MapContainer>
  );
}
