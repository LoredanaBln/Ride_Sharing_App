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

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/passenger-home" element={<PassengerHome/>}/>
                    <Route path="/signup-passenger" element={<SignUpPassenger/>}/>
                    <Route path="/signup-driver" element={<SignUpDriver/>}/>
                    <Route path="/reset-password" element={<ChangePassword/>}/>
                    <Route path="/driver-home" element={<DriverHomePage/>}/>
                    <Route path="/my-account-driver" element={<DriverAccountPage/>}/>
                    <Route path="/support" element={<div>Support Page</div>}/>
                    <Route path="/about" element={<div>About Page</div>}/>
                    <Route path="/account" element={<div>Account Page</div>}/>
                    <Route path="/rides-history" element={<div>Rides History Page</div>}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
