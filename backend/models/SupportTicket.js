const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, default: '' },
  bookingIdOrPnr: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Bus Booking', 'Train Booking', 'Cab Rental', 'Custom Bus', 'Payment & Refund', 'Account & Login', 'General Inquiry'],
    default: 'General Inquiry'
  },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  attachments: [{ type: String }],
  ipAddress: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
