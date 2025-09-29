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
    <div className="p-6 space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="revenue">Revenue Report</option>
            <option value="occupancy">Occupancy Report</option>
            <option value="performance">Performance Report</option>
            <option value="guest">Guest Analysis</option>
          </select>
        </div>
        <Button variant="primary" icon={Download}>
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-green-400 mt-2">$320,000</p>
              <p className="text-sm text-green-400 mt-1">+15.3% from last period</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Average Occupancy</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">86%</p>
              <p className="text-sm text-blue-400 mt-1">+3.2% from last period</p>
            </div>
            <BarChart3 className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">602</p>
              <p className="text-sm text-purple-400 mt-1">+8.7% from last period</p>
            </div>
            <Calendar className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Avg. Daily Rate</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">$185</p>
              <p className="text-sm text-amber-400 mt-1">+6.1% from last period</p>
            </div>
            <TrendingUp className="text-amber-500" size={32} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Revenue Trend
          </h3>
          <Chart data={revenueData} type="bar" color="#10B981" />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            Occupancy Rate
          </h3>
          <Chart data={occupancyData} type="line" color="#3B82F6" />
        </div>
      </div>

      {/* Room Type Performance */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Room Type Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-400 font-medium">Room Type</th>
                <th className="text-right py-3 text-gray-400 font-medium">Bookings</th>
                <th className="text-right py-3 text-gray-400 font-medium">Revenue</th>
                <th className="text-right py-3 text-gray-400 font-medium">Avg. Rate</th>
                <th className="text-right py-3 text-gray-400 font-medium">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {roomTypeData.map((room, index) => (
                <tr key={index} className="border-b border-gray-700/50">
                  <td className="py-3 text-white font-medium">{room.type}</td>
                  <td className="py-3 text-right text-gray-300">{room.bookings}</td>
                  <td className="py-3 text-right text-green-400 font-semibold">${room.revenue.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-300">${Math.round(room.revenue / room.bookings)}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(room.bookings / 150) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-sm">{Math.round((room.bookings / 150) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Performance & Top Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            Staff Performance
          </h3>
          <div className="space-y-4">
            {staffPerformance.map((staff, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">{staff.name}</div>
                  <div className="text-sm text-gray-400">{staff.department}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`${i < Math.floor(staff.rating) ? 'text-yellow-400' : 'text-gray-600'}`}>
                        ★
                      </span>
                    ))}
                    <span className="text-white ml-2">{staff.rating}</span>
                  </div>
                  <div className="text-sm text-gray-400">{staff.tasks} tasks completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            Top Guests
          </h3>
          <div className="space-y-4">
            {topGuests.map((guest, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">{guest.name}</div>
                  <div className="text-sm text-gray-400">Last visit: {guest.lastVisit}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">${guest.spent.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{guest.stays} stays</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Trends */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Booking Trends & Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">42%</div>
            <div className="text-sm text-gray-400">Direct Bookings</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">2.3</div>
            <div className="text-sm text-gray-400">Avg. Stay Duration</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
            <div className="text-sm text-gray-400">Guest Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;