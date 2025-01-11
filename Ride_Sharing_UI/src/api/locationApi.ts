import axios from "axios";
import {GeoLocation} from "../types/location.ts";
import {RouteInfo} from "../types/locationInfo.ts";
import {API_ENDPOINTS} from "./apiEndpoints.ts";

export const locationApi = {
  getCoordinates: async (address: string): Promise<GeoLocation> => {
    const response = await axios.get<GeoLocation>(
      API_ENDPOINTS.GET_LOCATION,
      {
        params: { address },
      }
    );
    return response.data;
  },

  getRoute: async (
    start: GeoLocation,
    end: GeoLocation
  ): Promise<RouteInfo> => {
    const response = await axios.get<RouteInfo>(
        API_ENDPOINTS.GET_ROUTE,
      {
        params: {
          startLat: start.latitude,
          startLon: start.longitude,
          endLat: end.latitude,
          endLon: end.longitude,
        },
      }
    );
    return response.data;
  },
};
