import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderNotification } from '../types/OrderNotification';

interface OrderNotificationState {
    notification: OrderNotification | null;
}

const initialState: OrderNotificationState = {
    notification: null
};

const orderNotificationSlice = createSlice({
    name: 'orderNotification',
    initialState,
    reducers: {
        setOrderNotification: (state, action: PayloadAction<OrderNotification | null>) => {
            state.notification = action.payload;
        }
    }
});

export const { setOrderNotification } = orderNotificationSlice.actions;
export default orderNotificationSlice.reducer; 