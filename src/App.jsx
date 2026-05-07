import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

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
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignUpPage />} />

                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/inventory" element={<DeviceInventory />} />
                <Route path="/console" element={<CommandConsole />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/alerts" element={<Alerts />} />
            </Routes>
        </Router>
    );
}
