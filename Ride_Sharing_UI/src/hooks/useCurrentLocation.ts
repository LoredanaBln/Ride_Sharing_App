import { useState } from 'react';
import { GeoLocation } from '../types/location';
import { Map as LeafletMap } from 'leaflet';

export const useCurrentLocation = (map: LeafletMap | null) => {
    const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);

    const handleMyLocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    map?.flyTo([newLocation.latitude, newLocation.longitude], 15);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
        }
    };

    return { currentLocation, setCurrentLocation, handleMyLocationClick };
};