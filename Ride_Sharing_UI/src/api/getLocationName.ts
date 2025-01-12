export const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        return data.display_name || "Unknown Location";
    } catch (error) {
        console.error("Error getting location name:", error);
        return "Unknown Location";
    }
};