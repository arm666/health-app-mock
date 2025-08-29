import React, { useState } from "react";
import {
  Calendar,
  FileText,
  Pill,
  User,
  Home,
  Heart,
  Share2,
} from "lucide-react";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import AppointmentScreen from "./components/AppointmentScreen";
import EnhancedRecordsScreen from "./components/EnhancedRecordsScreen";
import MedicationScreen from "./components/MedicationScreen";
import ProfileScreen from "./components/ProfileScreen";
import ProfileEditScreen from "./components/ProfileEditScreen";
import SettingsScreen from "./components/SettingsScreen";
import SubscriptionScreen from "./components/SubscriptionScreen";
import SharingSystem from "./components/SharingSystem";

type Screen =
  | "auth"
  | "dashboard"
  | "appointments"
  | "records"
  | "medications"
  | "profile"
  | "profile-edit"
  | "settings"
  | "subscription"
  | "sharing";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen("dashboard");
  };

  const navigationItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "appointments", icon: Calendar, label: "Appointments" },
    { id: "records", icon: FileText, label: "Records" },
    { id: "medications", icon: Pill, label: "Meds" },
    { id: "sharing", icon: Share2, label: "Share" },
  ];

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <Dashboard onOpenProfile={() => setCurrentScreen("profile")} />;
      case "appointments":
        return <AppointmentScreen />;
      case "records":
        return <EnhancedRecordsScreen />;
      case "medications":
        return <MedicationScreen />;
      case "sharing":
        return <SharingSystem onBack={() => setCurrentScreen("dashboard")} />;
      case "profile":
        return (
          <ProfileScreen
            onLogout={() => setIsAuthenticated(false)}
            onEditProfile={() => setCurrentScreen("profile-edit")}
            onSettings={() => setCurrentScreen("settings")}
            onSubscription={() => setCurrentScreen("subscription")}
            onSharing={() => setCurrentScreen("sharing")}
            onBack={() => setCurrentScreen("dashboard")}
          />
        );
      case "profile-edit":
        return <ProfileEditScreen onBack={() => setCurrentScreen("profile")} />;
      case "settings":
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen("profile")}
            onSubscription={() => setCurrentScreen("subscription")}
          />
        );
      case "subscription":
        return (
          <SubscriptionScreen onBack={() => setCurrentScreen("settings")} />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{ height: "100dvh" }}
      className=" bg-background flex flex-col max-w-md mx-auto border-x"
    >
      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderScreen()}</div>

      {/* Bottom Navigation - Only show on main screens */}
      {!["profile", "profile-edit", "settings", "subscription"].includes(
        currentScreen
      ) && (
        <div className="bg-white border-t border-border px-2 py-1">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
