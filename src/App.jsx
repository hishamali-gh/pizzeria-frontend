import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LogInPage";
import SignUpPage from "./pages/public/SignUpPage";

import ProfilePage from "./pages/user-settings/ProfilePage";
import ManagementHub from "./pages/user-settings/ManagementHub";
import Onboarding from "./pages/user-settings/Onboarding";

import Dashboard from "./pages/HMI/Dashboard";
import DeviceInventory from "./pages/HMI/DeviceInventory";
import CommandConsole from "./pages/HMI/CommandConsole";
import Archive from "./pages/HMI/Archive";
import Alerts from "./pages/HMI/Alerts";

import RoleGuard from "./components/RoleGuard";


export default function App() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignUpPage />} />

                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/management-hub" element={
                    <RoleGuard minRole='admin'>
                        <ManagementHub />
                    </RoleGuard>
                } />
                <Route path="/onboarding" element={<Onboarding />} />

                <Route path="/dashboard" element={
                    <RoleGuard minRole='viewer'>
                        <Dashboard />
                    </RoleGuard>
                }/>
                <Route path="/inventory" element={
                    <RoleGuard minRole='viewer'>
                        <DeviceInventory />
                    </RoleGuard>
                } />
                <Route path="/console" element={
                    <RoleGuard minRole='worker'>
                        <CommandConsole />
                    </RoleGuard>
                } />
                <Route path="/archive" element={<Archive />} />
                <Route path="/alerts" element={<Alerts />} />
            </Routes>
        </Router>
    );
}
