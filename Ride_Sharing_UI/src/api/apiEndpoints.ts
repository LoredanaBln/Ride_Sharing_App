const BASE_URL = 'http://localhost:8080/'

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}auth/login`,
    SIGN_UP_DRIVER: `${BASE_URL}driver/signUp`,
    SIGN_UP_PASSENGER: `${BASE_URL}passenger/signUp`,
    PASSENGER_REQUEST_RESET_PASSWORD: `${BASE_URL}passenger/requestPasswordReset`,
    PASSENGER_CONFIRM_RESET_PASSWORD: `${BASE_URL}passenger/confirmPasswordReset`,
    PASSENGER_GET_ORDERS: `${BASE_URL}order/passengerOrder`,
}