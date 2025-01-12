import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { GeoLocation } from "../types/location";

interface MapProps {
  currentLocation?: GeoLocation | null;
  destination?: GeoLocation | null;
  routeCoordinates?: [number, number][];
  onMapReady?: (map: L.Map) => void;
  defaultPosition?: [number, number];
}

const currentLocationIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "current-location-marker",
});

const destinationIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "destination-marker",
});

function Map({
  currentLocation,
  destination,
  routeCoordinates = [],
  onMapReady,
  defaultPosition = [46.7712, 23.6236], // Cluj-Napoca
}: MapProps) {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={onMapReady ? onMapReady : undefined}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
      />
      {currentLocation && (
        <Marker
          position={[currentLocation.latitude, currentLocation.longitude]}
          icon={currentLocationIcon}
        />
      )}
      {destination && (
        <Marker
          position={[destination.latitude, destination.longitude]}
          icon={destinationIcon}
        />
      )}
      {routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="blue"
          weight={4}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}

export default Map;
