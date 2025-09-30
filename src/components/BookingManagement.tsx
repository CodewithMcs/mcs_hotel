import React, { useState } from 'react';
import { Plus, Calendar, User, Clock, Search, Filter } from 'lucide-react';
import Modal from './shared/Modal';
import Button from './shared/Button';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';
  specialRequests: string;
  bookingDate: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+1234567890',
      roomNumber: '205',
      checkIn: '2025-01-15',
      checkOut: '2025-01-18',
      guests: 2,
      totalAmount: 540,
      status: 'Confirmed',
      specialRequests: 'Late check-in requested',
      bookingDate: '2025-01-10'
    },
    {
      id: '2',
      guestName: 'Sarah Wilson',
      guestEmail: 'sarah@example.com',
      guestPhone: '+1987654321',
      roomNumber: '301',
      checkIn: '2025-01-14',
      checkOut: '2025-01-16',
      guests: 1,
      totalAmount: 700,
      status: 'Checked-in',
      specialRequests: 'Extra towels',
      bookingDate: '2025-01-08'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    specialRequests: ''
  });

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Checked-in': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Checked-out': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const calculateAmount = (checkIn: string, checkOut: string, roomType: string = 'Double') => {
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24));
    const ratePerNight = roomType === 'Suite' ? 350 : roomType === 'Double' ? 180 : 120;
    return nights * ratePerNight;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = calculateAmount(formData.checkIn, formData.checkOut);
    
    const bookingData: Booking = {
      id: editingBooking?.id || Date.now().toString(),
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      guestPhone: formData.guestPhone,
      roomNumber: formData.roomNumber,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: parseInt(formData.guests),
      totalAmount,
      status: editingBooking?.status || 'Confirmed',
      specialRequests: formData.specialRequests,
      bookingDate: editingBooking?.bookingDate || new Date().toISOString().split('T')[0]
    };

    if (editingBooking) {
      setBookings(bookings.map(booking => booking.id === editingBooking.id ? bookingData : booking));
    } else {
      setBookings([...bookings, bookingData]);
    }

    setShowModal(false);
    setEditingBooking(null);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      roomNumber: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      specialRequests: ''
    });
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      roomNumber: booking.roomNumber,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests.toString(),
      specialRequests: booking.specialRequests
    });
    setShowModal(true);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
 <div className="p-6 space-y-6">
  {/* Header with Actions */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
    <div className="flex items-center space-x-4 w-full lg:w-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
      >
        <option value="All">All Status</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Checked-in">Checked-in</option>
        <option value="Checked-out">Checked-out</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
    <Button
      onClick={() => setShowModal(true)}
      variant="primary"
      icon={Plus}
    >
      New Booking
    </Button>
  </div>

  {/* Desktop Table */}
  <div className="hidden sm:block bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Guest</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Room</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check-in / Check-out</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Guests</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredBookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-white">{booking.guestName}</div>
                  <div className="text-sm text-gray-400">{booking.guestEmail}</div>
                  <div className="text-sm text-gray-400">{booking.guestPhone}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-white">{booking.roomNumber}</td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div className="text-white">{booking.checkIn}</div>
                  <div className="text-gray-400">{booking.checkOut}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-white">{booking.guests}</td>
              <td className="px-6 py-4 text-green-400 font-bold">${booking.totalAmount}</td>
              <td className="px-6 py-4">
                <select
                  value={booking.status}
                  onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} bg-transparent focus:outline-none`}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-in">Checked-in</option>
                  <option value="Checked-out">Checked-out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <Button
                  onClick={() => handleEdit(booking)}
                  variant="secondary"
                  size="sm"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Mobile Cards */}
  <div className="grid grid-cols-1 gap-4 sm:hidden">
    {filteredBookings.map((booking) => (
      <div key={booking.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">{booking.guestName}</h3>
            <p className="text-sm text-gray-400">{booking.guestEmail}</p>
            <p className="text-sm text-gray-400">{booking.guestPhone}</p>
          </div>
          <select
            value={booking.status}
            onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} bg-transparent focus:outline-none`}
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Checked-out">Checked-out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mt-3 space-y-2 text-sm text-gray-300">
          <div>Room: <span className="text-white">{booking.roomNumber}</span></div>
          <div>Check-in: <span className="text-white">{booking.checkIn}</span></div>
          <div>Check-out: <span className="text-white">{booking.checkOut}</span></div>
          <div>Guests: <span className="text-white">{booking.guests}</span></div>
          <div>Total: <span className="text-green-400 font-bold">${booking.totalAmount}</span></div>
        </div>
        <div className="mt-3">
          <Button
            onClick={() => handleEdit(booking)}
            variant="secondary"
            size="sm"
          >
            Edit
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default BookingManagement;