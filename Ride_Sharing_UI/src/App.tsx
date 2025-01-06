import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import SignUpPassenger from "./pages/SignUpPassenger.tsx";

function App() {
    return (
        <Provider store={store}>
            <SignUpPassenger />
        </Provider>
    );
}

export default App;