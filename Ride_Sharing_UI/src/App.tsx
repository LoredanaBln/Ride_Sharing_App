import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store/store.ts';
import Login from './pages/Login.tsx';
import PassengerHome from './pages/PassengerHome.tsx';
import SignUpPassenger from "./pages/SignUpPassenger.tsx";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/passenger-home" element={<PassengerHome />} />
                    <Route path="/payment" element={<div>Payment Page</div>} />
                    <Route path="/support" element={<div>Support Page</div>} />
                    <Route path="/about" element={<div>About Page</div>} />
                    <Route path="/account" element={<div>Account Page</div>} />
                    <Route path="/rides-history" element={<div>Rides History Page</div>} />
                    <Route path="/signUp-passenger " element={<div>SignUpPassenger</div>}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
