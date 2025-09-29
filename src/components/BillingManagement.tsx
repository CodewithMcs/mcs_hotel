import React, { useState } from 'react';
import { Plus, Search, CreditCard, DollarSign, Receipt, FileText, Calendar } from 'lucide-react';
import Modal from './shared/Modal';
import Button from './shared/Button';

interface Bill {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  roomCharges: number;
  extraServices: { name: string; amount: number }[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'Transfer' | 'Online';
  status: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
  dueDate: string;
  invoiceNumber: string;
}

const BillingManagement: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      guestName: 'John Doe',
      roomNumber: '205',
      checkIn: '2025-01-15',
      checkOut: '2025-01-18',
      roomCharges: 540,
      extraServices: [
        { name: 'Room Service', amount: 45 },
        { name: 'Laundry', amount: 25 },
        { name: 'Minibar', amount: 30 }
      ],
      totalAmount: 640,
      paidAmount: 640,
      paymentMethod: 'Card',
      status: 'Paid',
      dueDate: '2025-01-18',
      invoiceNumber: 'INV-2025-001'
    },
    {
      id: '2',
      guestName: 'Sarah Wilson',
      roomNumber: '301',
      checkIn: '2025-01-14',
      checkOut: '2025-01-16',
      roomCharges: 700,
      extraServices: [
        { name: 'Spa Services', amount: 120 },
        { name: 'Room Service', amount: 35 }
      ],
      totalAmount: 855,
      paidAmount: 400,
      paymentMethod: 'Cash',
      status: 'Partial',
      dueDate: '2025-01-16',
      invoiceNumber: 'INV-2025-002'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    roomCharges: '',
    extraServices: [{ name: '', amount: '' }]
  });

  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'Cash' as Bill['paymentMethod']
  });

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extraServicesTotal = formData.extraServices
      .filter(service => service.name && service.amount)
      .reduce((sum, service) => sum + parseFloat(service.amount), 0);
    
    const totalAmount = parseFloat(formData.roomCharges) + extraServicesTotal;
    
    const billData: Bill = {
      id: editingBill?.id || Date.now().toString(),
      guestName: formData.guestName,
      roomNumber: formData.roomNumber,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      roomCharges: parseFloat(formData.roomCharges),
      extraServices: formData.extraServices
        .filter(service => service.name && service.amount)
        .map(service => ({ name: service.name, amount: parseFloat(service.amount) })),
      totalAmount,
      paidAmount: editingBill?.paidAmount || 0,
      paymentMethod: editingBill?.paymentMethod || 'Cash',
      status: editingBill?.status || 'Pending',
      dueDate: formData.checkOut,
      invoiceNumber: editingBill?.invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`
    };

    if (editingBill) {
      setBills(bills.map(bill => bill.id === editingBill.id ? billData : bill));
    } else {
      setBills([...bills, billData]);
    }

    setShowModal(false);
    setEditingBill(null);
    setFormData({
      guestName: '',
      roomNumber: '',
      checkIn: '',
      checkOut: '',
      roomCharges: '',
      extraServices: [{ name: '', amount: '' }]
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBill) return;

    const paymentAmount = parseFloat(paymentData.amount);
    const newPaidAmount = editingBill.paidAmount + paymentAmount;
    const newStatus: Bill['status'] = 
      newPaidAmount >= editingBill.totalAmount ? 'Paid' :
      newPaidAmount > 0 ? 'Partial' : 'Pending';

    setBills(bills.map(bill => 
      bill.id === editingBill.id 
        ? { ...bill, paidAmount: newPaidAmount, status: newStatus, paymentMethod: paymentData.paymentMethod }
        : bill
    ));

    setShowPaymentModal(false);
    setEditingBill(null);
    setPaymentData({ amount: '', paymentMethod: 'Cash' });
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      guestName: bill.guestName,
      roomNumber: bill.roomNumber,
      checkIn: bill.checkIn,
      checkOut: bill.checkOut,
      roomCharges: bill.roomCharges.toString(),
      extraServices: bill.extraServices.length > 0 
        ? bill.extraServices.map(service => ({ name: service.name, amount: service.amount.toString() }))
        : [{ name: '', amount: '' }]
    });
    setShowModal(true);
  };

  const handlePaymentClick = (bill: Bill) => {
    setEditingBill(bill);
    setShowPaymentModal(true);
  };

  const addExtraService = () => {
    setFormData({
      ...formData,
      extraServices: [...formData.extraServices, { name: '', amount: '' }]
    });
  };

  const removeExtraService = (index: number) => {
    const newServices = formData.extraServices.filter((_, i) => i !== index);
    setFormData({ ...formData, extraServices: newServices });
  };

  const updateExtraService = (index: number, field: 'name' | 'amount', value: string) => {
    const newServices = [...formData.extraServices];
    newServices[index][field] = value;
    setFormData({ ...formData, extraServices: newServices });
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search bills..."
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
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          icon={Plus}
        >
          Create Bill
        </Button>
      </div>

      {/* Bills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBills.map(bill => (
          <div key={bill.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{bill.guestName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-400">Room {bill.roomNumber}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-blue-400">{bill.invoiceNumber}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bill.status)}`}>
                {bill.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-blue-400" size={16} />
                  <span className="text-gray-300 text-sm">
                    {bill.checkIn} - {bill.checkOut}
                  </span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Room Charges:</span>
                  <span className="text-white font-medium">${bill.roomCharges}</span>
                </div>
                
                {bill.extraServices.map((service, index) => (
                  <div key={index} className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">{service.name}:</span>
                    <span className="text-white">${service.amount}</span>
                  </div>
                ))}
                
                <div className="border-t border-gray-600 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-green-400 font-bold text-lg">${bill.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Payment Status:</span>
                <div className="text-right">
                  <div className="text-white font-medium">${bill.paidAmount} / ${bill.totalAmount}</div>
                  <div className="text-xs text-gray-400">
                    {bill.paymentMethod} • Due: {bill.dueDate}
                  </div>
                </div>
              </div>

              {bill.status !== 'Paid' && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(bill.paidAmount / bill.totalAmount) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => handleEdit(bill)}
                variant="secondary"
                size="sm"
                icon={FileText}
              >
                Edit
              </Button>
              {bill.status !== 'Paid' && (
                <Button
                  onClick={() => handlePaymentClick(bill)}
                  variant="primary"
                  size="sm"
                  icon={CreditCard}
                >
                  Payment
                </Button>
              )}
              <Button
                variant="success"
                size="sm"
                icon={Receipt}
              >
                Invoice
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Bill Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBill(null);
          setFormData({
            guestName: '',
            roomNumber: '',
            checkIn: '',
            checkOut: '',
            roomCharges: '',
            extraServices: [{ name: '', amount: '' }]
          });
        }}
        title={editingBill ? 'Edit Bill' : 'Create New Bill'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Guest Name
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Charges ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.roomCharges}
                onChange={(e) => setFormData({...formData, roomCharges: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Extra Services
              </label>
              <Button
                type="button"
                onClick={addExtraService}
                variant="secondary"
                size="sm"
              >
                Add Service
              </Button>
            </div>
            {formData.extraServices.map((service, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Service name"
                  value={service.name}
                  onChange={(e) => updateExtraService(index, 'name', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={service.amount}
                    onChange={(e) => updateExtraService(index, 'amount', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  {formData.extraServices.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeExtraService(index)}
                      variant="danger"
                      size="sm"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingBill ? 'Update Bill' : 'Create Bill'}
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

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setEditingBill(null);
          setPaymentData({ amount: '', paymentMethod: 'Cash' });
        }}
        title="Record Payment"
        size="md"
      >
        {editingBill && (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Guest:</span>
                <span className="text-white font-medium">{editingBill.guestName}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-green-400 font-bold">${editingBill.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Paid Amount:</span>
                <span className="text-white">${editingBill.paidAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Outstanding:</span>
                <span className="text-red-400 font-bold">${editingBill.totalAmount - editingBill.paidAmount}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                max={editingBill.totalAmount - editingBill.paidAmount}
                value={paymentData.amount}
                onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value as Bill['paymentMethod']})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Transfer">Bank Transfer</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                Record Payment
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BillingManagement;