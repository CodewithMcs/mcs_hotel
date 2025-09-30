import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

// Sample notifications data
const notificationsData = [
  { id: 1, message: "New booking received", time: "2h ago" },
  { id: 2, message: "Room 101 cleaned", time: "3h ago" },
  { id: 3, message: "Guest John checked in", time: "5h ago" },
  { id: 4, message: "Payment processed", time: "8h ago" },
  { id: 5, message: "Staff meeting at 3 PM", time: "1d ago" },
  { id: 6, message: "Maintenance request", time: "1d ago" },
];

interface HeaderProps {
  activeModuleName: string;
  onShowNotifications?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeModuleName,
  onShowNotifications,
  onLogout,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 h-[70px] flex items-center justify-between z-10 relative">
      {/* Active module title */}
      <h2 className="text-2xl font-semibold text-white truncate">
        {activeModuleName}
      </h2>

      {/* Right side */}
      <div className="flex items-center space-x-4 relative">
   

        {/* Notification Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Bell size={20} className="text-gray-300" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-3 max-h-64 overflow-y-auto space-y-2">
                {notificationsData.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className="text-sm text-gray-300 p-2 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    <p>{notif.message}</p>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                ))}
              </div>
              {notificationsData.length > 5 && (
                <button
                  onClick={onShowNotifications}
                  className="w-full text-center py-2 text-blue-400 hover:bg-gray-700 rounded-b-lg"
                >
                  Show More
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="hidden md:inline text-sm font-medium">Admin</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Profile
              </button>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-b-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
