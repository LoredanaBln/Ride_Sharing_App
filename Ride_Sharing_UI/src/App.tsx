import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {store} from './store/store.ts';
import Login from './pages/Login.tsx';
import PassengerHome from './pages/PassengerHome.tsx';
import SignUpPassenger from './pages/SignUpPassenger.tsx';
import SignUpDriver from "./pages/SignUpDriver.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import DriverHomePage from "./pages/DriverHomePage.tsx";
import DriverAccountPage from "./pages/DriverAccountPage.tsx";
import PassengerRidesHistory from "./pages/PassengerRidesHistory.tsx";
import PassengerAccountPage from "./pages/PassengerAccountPage.tsx";
import PassengerPaymentMethod from "./pages/PassengerPaymentMethod.tsx";
import DriverPaymentMethod from "./pages/DriverPaymentMethod.tsx";
import { Toaster } from 'react-hot-toast';
import DriverRidesHistory from "./pages/DriverRidesHistory.tsx";
import About from "./pages/About";
import Support from "./pages/Support";

function App() {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#2b7d27',
                        },
                    },
                    error: {
                        style: {
                            background: '#dc3545',
                        },
                    },
                }}
            />
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login/>}/>

                        {/* Passenger Routes */}
                        <Route path="/passenger-home" element={<PassengerHome/>}/>
                        <Route path="/passenger-payment" element={<PassengerPaymentMethod/>}/>
                        <Route path="/my-account-passenger" element={<PassengerAccountPage/>}/>
                        <Route path="/passenger-rides-history" element={<PassengerRidesHistory/>}/>

                        {/* Driver Routes */}
                        <Route path="/driver-home" element={<DriverHomePage/>}/>
                        <Route path="/driver-payment" element={<DriverPaymentMethod/>}/>
                        <Route path="/my-account-driver" element={<DriverAccountPage/>}/>
                        <Route path="/driver-rides-history" element={<DriverRidesHistory/>}/>

                        {/* Public Routes */}
                        <Route path="/signup-passenger" element={<SignUpPassenger/>}/>
                        <Route path="/signup-driver" element={<SignUpDriver/>}/>
                        <Route path="/reset-password" element={<ChangePassword/>}/>
                        <Route path="/support" element={<Support/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </>
    );
}

export default App;
