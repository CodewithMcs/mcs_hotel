import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import Chart from './shared/Chart';
import Button from './shared/Button';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('revenue');

  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 89 },
    { month: 'Feb', revenue: 52000, bookings: 96 },
    { month: 'Mar', revenue: 48000, bookings: 92 },
    { month: 'Apr', revenue: 55000, bookings: 105 },
    { month: 'May', revenue: 62000, bookings: 112 },
    { month: 'Jun', revenue: 58000, bookings: 108 }
  ];

  const occupancyData = [
    { month: 'Jan', rate: 78 },
    { month: 'Feb', rate: 85 },
    { month: 'Mar', rate: 82 },
    { month: 'Apr', rate: 88 },
    { month: 'May', rate: 92 },
    { month: 'Jun', rate: 89 }
  ];

  const roomTypeData = [
    { type: 'Single', bookings: 145, revenue: 17400 },
    { type: 'Double', bookings: 128, revenue: 23040 },
    { type: 'Suite', bookings: 64, revenue: 22400 },
    { type: 'Deluxe', bookings: 89, revenue: 26700 }
  ];

  const staffPerformance = [
    { name: 'Alice Johnson', rating: 4.8, tasks: 156, department: 'Operations' },
    { name: 'Bob Smith', rating: 4.5, tasks: 142, department: 'Front Desk' },
    { name: 'Carol Davis', rating: 4.7, tasks: 189, department: 'Housekeeping' },
    { name: 'David Brown', rating: 4.3, tasks: 134, department: 'Maintenance' }
  ];

  const topGuests = [
    { name: 'John Doe', stays: 8, spent: 4200, lastVisit: '2025-01-10' },
    { name: 'Sarah Wilson', stays: 6, spent: 3600, lastVisit: '2025-01-08' },
    { name: 'Michael Chen', stays: 5, spent: 2800, lastVisit: '2025-01-05' },
    { name: 'Emma Davis', stays: 4, spent: 2400, lastVisit: '2025-01-03' }
  ];

  return (
 <div className="p-4 sm:p-6 space-y-6">
  {/* Header with Controls */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
    <div className="flex flex-col sm:flex-row sm:items-center flex-1 space-y-2 sm:space-y-0 sm:space-x-3">
      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="quarter">This Quarter</option>
        <option value="year">This Year</option>
      </select>
      <select
        value={selectedReport}
        onChange={(e) => setSelectedReport(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
      >
        <option value="revenue">Revenue Report</option>
        <option value="occupancy">Occupancy Report</option>
        <option value="performance">Performance Report</option>
        <option value="guest">Guest Analysis</option>
      </select>
    </div>
    <Button variant="primary" icon={Download} className="w-full sm:w-auto mt-2 sm:mt-0">
      Export Report
    </Button>
  </div>

  {/* Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {[
      { title: "Total Revenue", value: "$320,000", change: "+15.3%", icon: <TrendingUp className="text-green-500" size={32} /> , color: "text-green-400"},
      { title: "Average Occupancy", value: "86%", change: "+3.2%", icon: <BarChart3 className="text-blue-500" size={32} /> , color: "text-blue-400"},
      { title: "Total Bookings", value: "602", change: "+8.7%", icon: <Calendar className="text-purple-500" size={32} /> , color: "text-purple-400"},
      { title: "Avg. Daily Rate", value: "$185", change: "+6.1%", icon: <TrendingUp className="text-amber-500" size={32} /> , color: "text-amber-400"},
    ].map((card, idx) => (
      <div key={idx} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{card.title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${card.color} mt-1`}>{card.value}</p>
          <p className={`text-xs sm:text-sm ${card.color} mt-1`}>{card.change} from last period</p>
        </div>
        {card.icon}
      </div>
    ))}
  </div>

  {/* Charts Section */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
        <TrendingUp className="mr-2" size={20} /> Revenue Trend
      </h3>
      <Chart data={revenueData} type="bar" color="#10B981" />
    </div>
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Occupancy Rate</h3>
      <Chart data={occupancyData} type="line" color="#3B82F6" />
    </div>
  </div>

  {/* Room Type Performance */}
  <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 overflow-x-auto">
    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Room Type Performance</h3>
    <table className="w-full min-w-[500px]">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="text-left py-2 text-gray-400 font-medium">Room Type</th>
          <th className="text-right py-2 text-gray-400 font-medium">Bookings</th>
          <th className="text-right py-2 text-gray-400 font-medium">Revenue</th>
          <th className="text-right py-2 text-gray-400 font-medium">Avg. Rate</th>
          <th className="text-right py-2 text-gray-400 font-medium">Utilization</th>
        </tr>
      </thead>
      <tbody>
        {roomTypeData.map((room, index) => (
          <tr key={index} className="border-b border-gray-700/50">
            <td className="py-2 text-white font-medium">{room.type}</td>
            <td className="py-2 text-right text-gray-300">{room.bookings}</td>
            <td className="py-2 text-right text-green-400 font-semibold">${room.revenue.toLocaleString()}</td>
            <td className="py-2 text-right text-gray-300">${Math.round(room.revenue / room.bookings)}</td>
            <td className="py-2 text-right">
              <div className="flex items-center justify-end space-x-2">
                <div className="w-16 sm:w-20 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(room.bookings / 150) * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-300 text-xs sm:text-sm">{Math.round((room.bookings / 150) * 100)}%</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Staff Performance & Top Guests */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    {/* Staff Performance Card */}
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Staff Performance</h3>
      <div className="space-y-3 sm:space-y-4">
        {staffPerformance.map((staff, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-white font-medium">{staff.name}</div>
              <div className="text-sm text-gray-400">{staff.department}</div>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`${i < Math.floor(staff.rating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                ))}
                <span className="text-white ml-1">{staff.rating}</span>
              </div>
              <div className="text-sm text-gray-400">{staff.tasks} tasks</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Top Guests Card */}
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Top Guests</h3>
      <div className="space-y-3 sm:space-y-4">
        {topGuests.map((guest, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-white font-medium">{guest.name}</div>
              <div className="text-sm text-gray-400">Last visit: {guest.lastVisit}</div>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <div className="text-green-400 font-semibold">${guest.spent.toLocaleString()}</div>
              <div className="text-sm text-gray-400">{guest.stays} stays</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Booking Trends */}
  <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Booking Trends & Insights</h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
        <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">42%</div>
        <div className="text-xs sm:text-sm text-gray-400">Direct Bookings</div>
      </div>
      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
        <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1 sm:mb-2">2.3</div>
        <div className="text-xs sm:text-sm text-gray-400">Avg. Stay Duration</div>
      </div>
      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
        <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">94%</div>
        <div className="text-xs sm:text-sm text-gray-400">Guest Satisfaction</div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Reports;