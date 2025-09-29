import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Bed, 
  DollarSign, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react';
import StatCard from './shared/StatCard';
import Chart from './shared/Chart';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,240',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Occupancy Rate',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      icon: Bed,
      color: 'blue'
    },
    {
      title: 'Active Guests',
      value: '156',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Pending Checkouts',
      value: '23',
      change: '-2.4%',
      trend: 'down',
      icon: Calendar,
      color: 'amber'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 35000 },
    { month: 'Feb', revenue: 42000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 45000 },
    { month: 'May', revenue: 52000 },
    { month: 'Jun', revenue: 48000 }
  ];

  const occupancyData = [
    { day: 'Mon', rate: 78 },
    { day: 'Tue', rate: 85 },
    { day: 'Wed', rate: 92 },
    { day: 'Thu', rate: 87 },
    { day: 'Fri', rate: 94 },
    { day: 'Sat', rate: 98 },
    { day: 'Sun', rate: 82 }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'Room 302 maintenance scheduled for tomorrow',
      time: '2 hours ago'
    },
    {
      type: 'info',
      message: '15 guests checking in today',
      time: '3 hours ago'
    },
    {
      type: 'success',
      message: 'Monthly revenue target exceeded by 12%',
      time: '1 day ago'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Monthly Revenue
          </h3>
          <Chart data={revenueData} type="bar" color="#3B82F6" />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            Weekly Occupancy Rate
          </h3>
          <Chart data={occupancyData} type="line" color="#10B981" />
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white">John Doe checked in to Room 205</p>
                <p className="text-xs text-gray-400">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white">Payment received from Room 108</p>
                <p className="text-xs text-gray-400">12 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white">Housekeeping completed Room 156</p>
                <p className="text-xs text-gray-400">25 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            System Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500' :
                  alert.type === 'info' ? 'bg-blue-500/10 border-blue-500' :
                  'bg-green-500/10 border-green-500'
                }`}
              >
                <p className="text-sm text-white">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;