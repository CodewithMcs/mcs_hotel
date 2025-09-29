import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import RoomManagement from './components/RoomManagement';
import BookingManagement from './components/BookingManagement';
import GuestManagement from './components/GuestManagement';
import StaffManagement from './components/StaffManagement';
import BillingManagement from './components/BillingManagement';
import Reports from './components/Reports';
import Notifications from './components/Notifications';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', name: 'Room Management', icon: Bed },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'guests', name: 'Guests', icon: Users },
    { id: 'staff', name: 'Staff', icon: UserCog },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'rooms': return <RoomManagement />;
      case 'bookings': return <BookingManagement />;
      case 'guests': return <GuestManagement />;
      case 'staff': return <StaffManagement />;
      case 'billing': return <BillingManagement />;
      case 'reports': return <Reports />;
      case 'notifications': return <Notifications />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-blue-400 ${!sidebarOpen && 'hidden'}`}>
              HotelAdmin Pro
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <li key={module.id}>
                  <button
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                      activeModule === module.id
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>
                      {module.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;