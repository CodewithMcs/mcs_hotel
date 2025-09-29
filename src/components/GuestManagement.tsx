import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Star, History } from 'lucide-react';
import Modal from './shared/Modal';
import Button from './shared/Button';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  dateOfBirth: string;
  idNumber: string;
  preferences: string[];
  vipStatus: 'None' | 'Silver' | 'Gold' | 'Platinum';
  totalStays: number;
  totalSpent: number;
  lastVisit: string;
  notes: string;
}

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY',
      nationality: 'American',
      dateOfBirth: '1985-06-15',
      idNumber: 'ID123456789',
      preferences: ['Non-smoking', 'High floor', 'Late checkout'],
      vipStatus: 'Gold',
      totalStays: 8,
      totalSpent: 4200,
      lastVisit: '2025-01-10',
      notes: 'Prefers room with city view. Always requests extra pillows.'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1987654321',
      address: '456 Oak Ave, Los Angeles, CA',
      nationality: 'American',
      dateOfBirth: '1990-03-22',
      idNumber: 'ID987654321',
      preferences: ['Gym access', 'Early breakfast'],
      vipStatus: 'Silver',
      totalStays: 3,
      totalSpent: 1800,
      lastVisit: '2025-01-08',
      notes: 'Business traveler. Requires express laundry service.'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    nationality: '',
    dateOfBirth: '',
    idNumber: '',
    preferences: [] as string[],
    vipStatus: 'None' as Guest['vipStatus'],
    notes: ''
  });

  const preferenceOptions = [
    'Non-smoking', 'High floor', 'Low floor', 'City view', 'Sea view',
    'Late checkout', 'Early breakfast', 'Gym access', 'Spa access',
    'Pet-friendly', 'Business center', 'Airport pickup'
  ];

  const getVipColor = (status: Guest['vipStatus']) => {
    switch (status) {
      case 'Platinum': return 'text-purple-400 bg-purple-500/20';
      case 'Gold': return 'text-yellow-400 bg-yellow-500/20';
      case 'Silver': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-500 bg-gray-600/20';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const guestData: Guest = {
      id: editingGuest?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      nationality: formData.nationality,
      dateOfBirth: formData.dateOfBirth,
      idNumber: formData.idNumber,
      preferences: formData.preferences,
      vipStatus: formData.vipStatus,
      totalStays: editingGuest?.totalStays || 0,
      totalSpent: editingGuest?.totalSpent || 0,
      lastVisit: editingGuest?.lastVisit || new Date().toISOString().split('T')[0],
      notes: formData.notes
    };

    if (editingGuest) {
      setGuests(guests.map(guest => guest.id === editingGuest.id ? guestData : guest));
    } else {
      setGuests([...guests, guestData]);
    }

    setShowModal(false);
    setEditingGuest(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      nationality: '',
      dateOfBirth: '',
      idNumber: '',
      preferences: [],
      vipStatus: 'None',
      notes: ''
    });
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      address: guest.address,
      nationality: guest.nationality,
      dateOfBirth: guest.dateOfBirth,
      idNumber: guest.idNumber,
      preferences: guest.preferences,
      vipStatus: guest.vipStatus,
      notes: guest.notes
    });
    setShowModal(true);
  };

  const togglePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-72"
          />
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon={Plus}
        >
          Add Guest
        </Button>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuests.map(guest => (
          <div key={guest.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{guest.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVipColor(guest.vipStatus)}`}>
                      {guest.vipStatus}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500" size={14} />
                      <span className="text-sm text-gray-400">{guest.totalStays} stays</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="text-blue-400" size={16} />
                <span className="text-gray-300">{guest.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-green-400" size={16} />
                <span className="text-gray-300">{guest.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <History className="text-purple-400" size={16} />
                <span className="text-gray-300">Last visit: {guest.lastVisit}</span>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-400 mb-2">Preferences:</p>
                <div className="flex flex-wrap gap-2">
                  {guest.preferences.slice(0, 3).map(pref => (
                    <span key={pref} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {pref}
                    </span>
                  ))}
                  {guest.preferences.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      +{guest.preferences.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Spent:</span>
                  <span className="text-green-400 font-semibold">${guest.totalSpent}</span>
                </div>
              </div>

              {guest.notes && (
                <div className="pt-2">
                  <p className="text-xs text-gray-400 italic">"{guest.notes}"</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => handleEdit(guest)}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Guest Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingGuest(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            nationality: '',
            dateOfBirth: '',
            idNumber: '',
            preferences: [],
            vipStatus: 'None',
            notes: ''
          });
        }}
        title={editingGuest ? 'Edit Guest Profile' : 'Add New Guest'}
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
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                VIP Status
              </label>
              <select
                value={formData.vipStatus}
                onChange={(e) => setFormData({...formData, vipStatus: e.target.value as Guest['vipStatus']})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="None">None</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferences
            </label>
            <div className="grid grid-cols-3 gap-2">
              {preferenceOptions.map(preference => (
                <label key={preference} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.includes(preference)}
                    onChange={() => togglePreference(preference)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-300">{preference}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              rows={3}
              placeholder="Special notes about the guest..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingGuest ? 'Update Guest' : 'Add Guest'}
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

export default GuestManagement;