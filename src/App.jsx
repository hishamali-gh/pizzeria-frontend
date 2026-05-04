import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LogInPage";
import SignUpPage from "./pages/public/SignUpPage";

import ProfilePage from "./pages/user-settings/ProfilePage";

import Dashboard from "./pages/HMI/Dashboard";
import DeviceInventory from "./pages/HMI/DeviceInventory";
import CommandConsole from "./pages/HMI/CommandConsole";
import Archive from "./pages/HMI/Archive";
import Alerts from "./pages/HMI/Alerts";


export default function App() {
    return(
        <>
            <LandingPage />

            <LoginPage />
            <SignUpPage />

            <ProfilePage />

            <Dashboard />
            <DeviceInventory />
            <CommandConsole />
            <Archive />
            <Alerts />
        </>
    );
}
