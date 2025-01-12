const BASE_URL = 'http://localhost:8080/'

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}auth/login`,
    SIGN_UP_DRIVER: `${BASE_URL}driver/signUp`,
    SIGN_UP_PASSENGER: `${BASE_URL}passenger/signUp`,
    PASSENGER_REQUEST_RESET_PASSWORD: `${BASE_URL}passenger/requestPasswordReset`,
    PASSENGER_CONFIRM_RESET_PASSWORD: `${BASE_URL}passenger/confirmPasswordReset`,
    PASSENGER_GET_ORDERS: `${BASE_URL}order/passengerOrder`,
    SETUP_STRIPE_CUSTOMER: `${BASE_URL}payment/setupCustomer`,
    ATTACH_PAYMENT_METHOD: `${BASE_URL}payment/attachPaymentMethod`,
    DELETE_PAYMENT_METHOD: `${BASE_URL}payment/methods`,
    GET_PAYMENT_METHODS: `${BASE_URL}payment/methods`,
    GET_OR_CREATE_CUSTOMER: `${BASE_URL}payment/customer`,
    SET_DEFAULT_PAYMENT_METHOD: `${BASE_URL}payment/methods`,
    PASSENGER_GET_BY_EMAIL: `${BASE_URL}passenger/email/`,
    PASSENGER_UPDATE: `${BASE_URL}passenger/update`,
    DRIVER_GET_BY_EMAIL: `${BASE_URL}driver/email/`,
    DRIVER_UPDATE: `${BASE_URL}driver/update`,
    GET_LOCATION: `${BASE_URL}location/geocode`,
    GET_ROUTE: `${BASE_URL}location/route`,
    TOGGLE_ONLINE: `${BASE_URL}driver/toggleOnline`,
    CREATE_ORDER: `${BASE_URL}order/create`,
}