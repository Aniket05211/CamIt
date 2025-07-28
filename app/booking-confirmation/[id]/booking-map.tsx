"use client"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface BookingMapProps {
  userLocation: [number, number]
  cameramanLocation: [number, number]
  status: string
}

// Custom marker icons
const createUserIcon = () => {
  return L.divIcon({
    html: `<div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-3 h-3">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
      </svg>
    </div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const createCameramanIcon = () => {
  return L.divIcon({
    html: `<div class="w-8 h-8 rounded-full bg-green-600 border-2 border-white shadow-md flex items-center justify-center animate-pulse">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-4 h-4">
        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Map bounds updater component
function MapBoundsUpdater({
  userLocation,
  cameramanLocation,
}: {
  userLocation: [number, number]
  cameramanLocation: [number, number]
}) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds([userLocation, cameramanLocation])
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [map, userLocation, cameramanLocation])

  return null
}

export default function BookingMap({ userLocation, cameramanLocation, status }: BookingMapProps) {
  // Calculate path between user and cameraman
  const path = [userLocation, cameramanLocation]

  // Determine if we should show the path based on status
  const showPath = ["confirmed", "en-route", "arrived"].includes(status)

  return (
    <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Update map bounds when locations change */}
      <MapBoundsUpdater userLocation={userLocation} cameramanLocation={cameramanLocation} />

      {/* User marker */}
      <Marker position={userLocation} icon={createUserIcon()}>
        <Popup>
          <div className="text-sm font-medium">Your Location</div>
        </Popup>
      </Marker>

      {/* Cameraman marker */}
      <Marker position={cameramanLocation} icon={createCameramanIcon()}>
        <Popup>
          <div className="text-sm font-medium">Cameraman Location</div>
        </Popup>
      </Marker>

      {/* Path between user and cameraman */}
      {showPath && (
        <Polyline
          positions={path}
          color="#3B82F6"
          weight={4}
          opacity={0.7}
          dashArray={status === "en-route" ? undefined : "5, 10"}
        />
      )}
    </MapContainer>
  )
}
