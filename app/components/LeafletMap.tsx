"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Define marker icon to avoid the missing icon issue
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// User location icon
const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

// Create a custom photographer marker icon
const createPhotographerIcon = () => {
  return L.divIcon({
    className: "photographer-marker",
    html: `
      <div class="w-8 h-8 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-8 h-8">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

interface Marker {
  id: number
  coordinates: [number, number]
  name: string
  image?: string
  rating?: number
  price?: string
  distance?: number
  onClick?: () => void
}

interface Hexagon {
  id: string
  boundary: [number, number][]
  count: number
  center: [number, number]
}

interface LeafletMapProps {
  center: [number, number]
  zoom: number
  markers: Marker[]
  userLocation: [number, number]
  hexagons: Hexagon[]
  onMapInit?: (map: L.Map) => void
  selectedMarker: any | null
  onMarkerClose: () => void
}

export default function LeafletMap({
  center,
  zoom,
  markers,
  userLocation,
  hexagons,
  onMapInit,
  selectedMarker,
  onMarkerClose,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const hexagonsLayerRef = useRef<L.LayerGroup | null>(null)
  const popupRef = useRef<L.Popup | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Set default icon for all markers
    L.Marker.prototype.options.icon = defaultIcon

    // Create map if it doesn't exist
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom)

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Create layers for markers and hexagons
      markersLayerRef.current = L.layerGroup().addTo(map)
      hexagonsLayerRef.current = L.layerGroup().addTo(map)

      // Store map reference
      mapRef.current = map

      // Call onMapInit callback if provided
      if (onMapInit) {
        onMapInit(map)
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update map center and zoom when props change
  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.setView(center, zoom, { animate: true })
  }, [center, zoom])

  // Add user location marker
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Add user location marker
    L.marker(userLocation, { icon: userIcon })
      .addTo(markersLayerRef.current)
      .bindTooltip("Your Location", { permanent: false, direction: "top" })

    // Add photographer markers
    markers.forEach((marker) => {
      const photographerIcon = createPhotographerIcon()

      L.marker(marker.coordinates, { icon: photographerIcon })
        .addTo(markersLayerRef.current)
        .on("click", () => {
          if (marker.onClick) {
            marker.onClick()
          }
        })
    })
  }, [userLocation, markers])

  // Add hexagons
  useEffect(() => {
    if (!mapRef.current || !hexagonsLayerRef.current) return

    // Clear existing hexagons
    hexagonsLayerRef.current.clearLayers()

    // Add hexagons
    hexagons.forEach((hex) => {
      // Convert hex boundary to Leaflet polygon path
      const latlngs = hex.boundary.map(([lat, lng]) => [lat, lng])

      // Determine color based on count (density)
      let fillColor = "#3B82F6" // Default blue
      let fillOpacity = 0.2

      if (hex.count > 3) {
        fillColor = "#EF4444" // Red for high density
        fillOpacity = 0.5
      } else if (hex.count > 1) {
        fillColor = "#F59E0B" // Amber for medium density
        fillOpacity = 0.4
      }

      L.polygon(latlngs, {
        fillColor,
        fillOpacity,
        color: fillColor,
        weight: 1,
        opacity: 0.8,
      })
        .addTo(hexagonsLayerRef.current)
        .on("click", () => {
          // Center map on hexagon and zoom in
          mapRef.current?.setView(hex.center, 14, { animate: true })
        })
    })
  }, [hexagons])

  // Handle selected marker popup
  useEffect(() => {
    if (!mapRef.current) return

    // Close existing popup
    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }

    // Show popup for selected marker
    if (selectedMarker) {
      const content = document.createElement("div")
      content.className = "p-2 max-w-xs"
      content.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="relative w-12 h-12 rounded-full overflow-hidden">
            <img src="${selectedMarker.image || "/placeholder.svg"}" alt="${selectedMarker.name}" class="object-cover w-full h-full" />
          </div>
          <div>
            <h3 class="font-semibold">${selectedMarker.name}</h3>
            <div class="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-yellow-400">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span class="ml-1">${selectedMarker.rating}</span>
            </div>
          </div>
        </div>
        <p class="text-sm mt-2">
          ${selectedMarker.price} • ${selectedMarker.distance.toFixed(1)} km away
        </p>
        <a href="/cameraman/${selectedMarker.id}" class="block w-full text-center py-1 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2 text-sm">
          View Profile
        </a>
      `

      popupRef.current = L.popup({
        closeButton: true,
        className: "custom-popup",
      })
        .setLatLng([selectedMarker.coordinates[1], selectedMarker.coordinates[0]])
        .setContent(content)
        .openOn(mapRef.current)
        .on("close", onMarkerClose)
    }
  }, [selectedMarker, onMarkerClose])

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
}
