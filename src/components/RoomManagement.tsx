import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Bed, Wifi, Tv, Car, Coffee, Search } from 'lucide-react';
import Modal from './shared/Modal';
import Button from './shared/Button';

interface Room {
  id: string;
  number: string;
  type: 'Single' | 'Double' | 'Suite' | 'Deluxe';
  status: 'Available' | 'Booked' | 'Under Maintenance' | 'Checked-in';
  price: number;
  amenities: string[];
  floor: number;
  description: string;
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      number: '101',
      type: 'Single',
      status: 'Available',
      price: 120,
      amenities: ['WiFi', 'TV', 'AC'],
      floor: 1,
      description: 'Cozy single room with city view'
    },
    {
      id: '2',
      number: '205',
      type: 'Double',
      status: 'Booked',
      price: 180,
      amenities: ['WiFi', 'TV', 'AC', 'Minibar'],
      floor: 2,
      description: 'Spacious double room with balcony'
    },
    {
      id: '3',
      number: '301',
      type: 'Suite',
      status: 'Checked-in',
      price: 350,
      amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Jacuzzi'],
      floor: 3,
      description: 'Luxury suite with premium amenities'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [formData, setFormData] = useState({
    number: '',
    type: 'Single' as Room['type'],
    price: '',
    floor: '',
    description: '',
    amenities: [] as string[]
  });

  const amenityOptions = ['WiFi', 'TV', 'AC', 'Minibar', 'Jacuzzi', 'Balcony', 'Room Service'];

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Booked': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Checked-in': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Under Maintenance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomData: Room = {
      id: editingRoom?.id || Date.now().toString(),
      number: formData.number,
      type: formData.type,
      status: editingRoom?.status || 'Available',
      price: parseInt(formData.price),
      amenities: formData.amenities,
      floor: parseInt(formData.floor),
      description: formData.description
    };

    if (editingRoom) {
      setRooms(rooms.map(room => room.id === editingRoom.id ? roomData : room));
    } else {
      setRooms([...rooms, roomData]);
    }

    setShowModal(false);
    setEditingRoom(null);
    setFormData({
      number: '',
      type: 'Single',
      price: '',
      floor: '',
      description: '',
      amenities: []
    });
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      price: room.price.toString(),
      floor: room.floor.toString(),
      description: room.description,
      amenities: room.amenities
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon={Plus}
        >
          Add Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bed className="text-blue-400" size={20} />
                <h3 className="text-lg font-semibold text-white">Room {room.number}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-medium">{room.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="text-green-400 font-bold">${room.price}/night</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Floor:</span>
                <span className="text-white">{room.floor}</span>
              </div>
              <div>
                <span className="text-gray-400">Amenities:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {room.amenities.map(amenity => (
                    <span key={amenity} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm">{room.description}</p>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => handleEdit(room)}
                variant="secondary"
                icon={Edit}
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(room.id)}
                variant="danger"
                icon={Trash2}
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRoom(null);
          setFormData({
            number: '',
            type: 'Single',
            price: '',
            floor: '',
            description: '',
            amenities: []
          });
        }}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Number
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Room['type']})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price per Night ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Floor
              </label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({...formData, floor: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-3 gap-2">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-300">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingRoom ? 'Update Room' : 'Add Room'}
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

export default RoomManagement;