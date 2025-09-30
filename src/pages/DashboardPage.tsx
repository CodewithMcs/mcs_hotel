import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  UserCog,
  CreditCard,
  BarChart3,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Dashboard from "../components/Dashboard";
import RoomManagement from "../components/RoomManagement";
import BookingManagement from "../components/BookingManagement";
import GuestManagement from "../components/GuestManagement";
import StaffManagement from "../components/StaffManagement";
import BillingManagement from "../components/BillingManagement";
import Reports from "../components/Reports";
import Notifications from "../components/Notifications";
import Header from "../components/Header";

interface Props {
  setLoggedIn: (value: boolean) => void;
}

const DashboardPage: React.FC<Props> = ({ setLoggedIn }) => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [moduleComponent, setModuleComponent] = useState<JSX.Element>(<Dashboard />);
  const [starting, setStarting] = useState(true);

  const width = window.innerWidth;

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "rooms", name: "Room Management", icon: Bed },
    { id: "bookings", name: "Bookings", icon: Calendar },
    { id: "guests", name: "Guests", icon: Users },
    { id: "staff", name: "Staff", icon: UserCog },
    { id: "billing", name: "Billing", icon: CreditCard },
    { id: "reports", name: "Reports", icon: BarChart3 },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  // Startup splash
  useEffect(() => {
    const timer = setTimeout(() => setStarting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Module change loader
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      switch (activeModule) {
        case "dashboard":
          setModuleComponent(<Dashboard />);
          break;
        case "rooms":
          setModuleComponent(<RoomManagement />);
          break;
        case "bookings":
          setModuleComponent(<BookingManagement />);
          break;
        case "guests":
          setModuleComponent(<GuestManagement />);
          break;
        case "staff":
          setModuleComponent(<StaffManagement />);
          break;
        case "billing":
          setModuleComponent(<BillingManagement />);
          break;
        case "reports":
          setModuleComponent(<Reports />);
          break;
        case "notifications":
          setModuleComponent(<Notifications />);
          break;
        default:
          setModuleComponent(<Dashboard />);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeModule]);

  const Loader: React.FC = () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Show splash screen while starting
  if (starting)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="h-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700 h-[70px] flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              HotelAdmin Pro
            </h1>
          )}

          {width > 679 && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gradient scrollbar-track-gray-700">
          <ul className="space-y-1">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <li key={module.id}>
                  <button
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm md:text-base leading-none
                      ${
                        activeModule === module.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-[1.02]"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      <Icon size={18} />
                    </span>
                    <span className={`truncate ${!sidebarOpen && "hidden"}`}>
                      {module.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <Header
          activeModuleName={modules.find((m) => m.id === activeModule)?.name || ""}
          onShowNotifications={() => setActiveModule("notifications")}
          onLogout={() => setLoggedIn(false)}
        />

        <main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gradient scrollbar-track-gray-700 scroll-smooth p-4">
          {loading ? <Loader /> : moduleComponent}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
