import { useState } from 'react';
import { GeoLocation } from "../types/location.ts";
import { getLocationCoordinatesApi } from "../api/getLocationCoordinatesApi.ts";
import { getRouteApi } from "../api/getRouteApi.ts";
import polyline from "@mapbox/polyline";
import L from "leaflet";
import { RouteInfo } from "../types/locationInfo.ts";

interface UseSearchProps {
    currentLocation: GeoLocation | null;
    map: L.Map | null;
}

export const useSearch = ({ currentLocation, map }: UseSearchProps) => {
    const [destination, setDestination] = useState<GeoLocation | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

    const handleSearch = async (searchValue: string) => {
        try {
            if (searchValue.trim() && currentLocation) {
                const coordinates = await getLocationCoordinatesApi.getCoordinates(searchValue);
                setDestination(coordinates);

                const route = await getRouteApi.getRoute(currentLocation, coordinates);

                const decodedCoordinates = polyline.decode(route.geometry);
                const formattedCoordinates = decodedCoordinates.map(
                    ([lat, lng]: [number, number]) => [lat, lng] as [number, number]
                );
                setRouteCoordinates(formattedCoordinates);

                if (map) {
                    const bounds = formattedCoordinates.reduce(
                        (bounds, coord) => bounds.extend(coord),
                        L.latLngBounds(formattedCoordinates[0], formattedCoordinates[0])
                    );
                    map.fitBounds(bounds);
                }

                setRouteInfo(route);
                console.log(route);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error searching location or getting route:", error);
            return false;
        }
    };

    return {
        destination,
        routeCoordinates,
        routeInfo,
        handleSearch
    };
};