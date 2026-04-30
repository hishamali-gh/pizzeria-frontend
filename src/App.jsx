import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LogInPage";
import SignUpPage from "./pages/public/SignUpPage";

import Dashboard from "./pages/HMI/Dashboard";
import DeviceInventory from "./pages/HMI/DeviceInventory";
import CommandConsole from "./pages/HMI/CommandConsole";


export default function App() {
    return(
        <>
            <LoginPage />
            <SignUpPage />

            <LandingPage />

            <Dashboard />
            <DeviceInventory />
            <CommandConsole />
        </>
    );
}
