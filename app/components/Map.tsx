"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProps {
  center: [number, number]
  zoom: number
  markers: Array<{ id: number; coordinates: [number, number]; name: string }>
  userLocation: [number, number]
  showPath?: boolean
}

export default function Map({ center, zoom, markers, userLocation, showPath = false }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(center, zoom)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current?.removeLayer(layer)
        }
      })

      // Add markers for all cameramen
      markers.forEach((marker) => {
        L.marker(marker.coordinates).addTo(mapRef.current!).bindPopup(marker.name)
      })

      // Add user location marker
      const userIcon = L.divIcon({
        html: '<div class="user-marker"></div>',
        className: "user-marker-container",
      })
      L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current!).bindPopup("You are here").openPopup()

      // If showPath is true, draw a path between user and cameraman
      if (showPath && markers.length > 0) {
        const path = L.polyline([userLocation, markers[0].coordinates], { color: "blue", weight: 3 })
        path.addTo(mapRef.current!)
      }

      // Fit the map to show all markers
      const bounds = L.latLngBounds([userLocation, ...markers.map((m) => m.coordinates)])
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, userLocation, showPath])

  return (
    <div className="relative z-10">
      <div id="map" className="h-[400px] w-full rounded-lg" />
    </div>
  )
}
