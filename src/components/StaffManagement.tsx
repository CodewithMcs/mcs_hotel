import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Clock, UserCog, Calendar } from 'lucide-react';
import Modal from './shared/Modal';
import Button from './shared/Button';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping' | 'Maintenance' | 'Security';
  department: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  salary: number;
  startDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  performance: number; // 1-5 rating
  attendanceRate: number; // percentage
}

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@hotel.com',
      phone: '+1234567890',
      role: 'Manager',
      department: 'Operations',
      shift: 'Morning',
      salary: 75000,
      startDate: '2023-01-15',
      status: 'Active',
      performance: 4.8,
      attendanceRate: 96
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@hotel.com',
      phone: '+1987654321',
      role: 'Receptionist',
      department: 'Front Desk',
      shift: 'Afternoon',
      salary: 45000,
      startDate: '2023-03-20',
      status: 'Active',
      performance: 4.5,
      attendanceRate: 94
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@hotel.com',
      phone: '+1567890123',
      role: 'Housekeeping',
      department: 'Housekeeping',
      shift: 'Morning',
      salary: 38000,
      startDate: '2022-11-10',
      status: 'Active',
      performance: 4.7,
      attendanceRate: 98
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Receptionist' as Staff['role'],
    department: '',
    shift: 'Morning' as Staff['shift'],
    salary: '',
    startDate: ''
  });

  const getRoleColor = (role: Staff['role']) => {
    switch (role) {
      case 'Admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Receptionist': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Housekeeping': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Maintenance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Security': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: Staff['status']) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Inactive': return 'text-red-400';
      case 'On Leave': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}>
        ★
      </span>
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const staffData: Staff = {
      id: editingStaff?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      shift: formData.shift,
      salary: parseInt(formData.salary),
      startDate: formData.startDate,
      status: editingStaff?.status || 'Active',
      performance: editingStaff?.performance || 4.0,
      attendanceRate: editingStaff?.attendanceRate || 95
    };

    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? staffData : s));
    } else {
      setStaff([...staff, staffData]);
    }

    setShowModal(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Receptionist',
      department: '',
      shift: 'Morning',
      salary: '',
      startDate: ''
    });
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      role: staffMember.role,
      department: staffMember.department,
      shift: staffMember.shift,
      salary: staffMember.salary.toString(),
      startDate: staffMember.startDate
    });
    setShowModal(true);
  };

  const updateStaffStatus = (id: string, status: Staff['status']) => {
    setStaff(staff.map(s => s.id === id ? { ...s, status } : s));
  };

  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || staffMember.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
  <div className="p-4 sm:p-6 space-y-6">
  {/* Header with Actions */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
    <div className="flex flex-col sm:flex-row sm:items-center flex-1 space-y-2 sm:space-y-0 sm:space-x-3">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>
      <select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
      >
        <option value="All">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Receptionist">Receptionist</option>
        <option value="Housekeeping">Housekeeping</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Security">Security</option>
      </select>
    </div>
    <Button
      onClick={() => setShowModal(true)}
      variant="primary"
      icon={Plus}
      className="w-full sm:w-auto mt-2 sm:mt-0"
    >
      Add Staff
    </Button>
  </div>

  {/* Staff Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {filteredStaff.map(staffMember => (
      <div key={staffMember.id} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 flex flex-col">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-md sm:text-lg font-semibold text-white truncate">{staffMember.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(staffMember.role)}`}>
                {staffMember.role}
              </span>
            </div>
          </div>
          <select
            value={staffMember.status}
            onChange={(e) => updateStaffStatus(staffMember.id, e.target.value as Staff['status'])}
            className={`px-2 py-1 bg-transparent text-xs font-medium focus:outline-none ${getStatusColor(staffMember.status)}`}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        {/* Contact & Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm sm:text-sm">
            <Mail className="text-blue-400" size={16} />
            <span className="text-gray-300 truncate">{staffMember.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm sm:text-sm">
            <Phone className="text-green-400" size={16} />
            <span className="text-gray-300 truncate">{staffMember.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm sm:text-sm">
            <UserCog className="text-purple-400" size={16} />
            <span className="text-gray-300 truncate">{staffMember.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm sm:text-sm">
            <Clock className="text-amber-400" size={16} />
            <span className="text-gray-300">{staffMember.shift} Shift</span>
          </div>
          <div className="flex items-center space-x-2 text-sm sm:text-sm">
            <Calendar className="text-cyan-400" size={16} />
            <span className="text-gray-300">Since {staffMember.startDate}</span>
          </div>
        </div>

        {/* Performance & Salary */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-700 space-y-2">
          <div className="flex justify-between items-center text-sm sm:text-sm">
            <span className="text-gray-400">Performance:</span>
            <div className="flex items-center space-x-1">
              {getPerformanceStars(staffMember.performance)}
              <span className="text-gray-300 ml-1">{staffMember.performance}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm sm:text-sm">
            <span className="text-gray-400">Attendance:</span>
            <span className="text-green-400">{staffMember.attendanceRate}%</span>
          </div>
          <div className="flex justify-between items-center text-sm sm:text-sm">
            <span className="text-gray-400">Salary:</span>
            <span className="text-green-400 font-semibold">${staffMember.salary.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <Button
            onClick={() => handleEdit(staffMember)}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    ))}
  </div>




      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStaff(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'Receptionist',
            department: '',
            shift: 'Morning',
            salary: '',
            startDate: ''
          });
        }}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as Staff['role']})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shift
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value as Staff['shift']})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Morning">Morning (6AM - 2PM)</option>
                <option value="Afternoon">Afternoon (2PM - 10PM)</option>
                <option value="Night">Night (10PM - 6AM)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Annual Salary ($)
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingStaff ? 'Update Staff' : 'Add Staff'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffManagement;