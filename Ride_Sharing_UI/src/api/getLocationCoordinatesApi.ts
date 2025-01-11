import axios from "axios";
import { GeoLocation } from "../types/location.ts";
import { API_ENDPOINTS } from "./apiEndpoints.ts";

export const getLocationCoordinatesApi = {
  getCoordinates: async (address: string): Promise<GeoLocation> => {
    const response = await axios.get<GeoLocation>(
        API_ENDPOINTS.GET_LOCATION,
        {
          params: { address },
        }
    );
    return response.data;
  },
};
