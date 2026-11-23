const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');

// In-memory rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map();

router.post('/tickets', async (req, res) => {
  try {
    const { name, email, mobile, bookingIdOrPnr, category, subject, message, honeypot } = req.body;

    // Honeypot anti-bot check
    if (honeypot) {
      return res.status(200).json({ message: 'Ticket received', ticketId: 'TKT-BOT-BLOCKED' });
    }

    // Rate limiting (max 5 requests per 10 minutes per IP)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < 10 * 60 * 1000);
    if (validTimestamps.length >= 5) {
      return res.status(429).json({ error: 'Too many requests. Please wait a few minutes before submitting another ticket.' });
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    // Validation
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email is required' });
    if (!subject || subject.trim().length < 4) return res.status(400).json({ error: 'Subject must be at least 4 characters' });
    if (!message || message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({ error: 'Message must be between 10 and 2000 characters' });
    }

    const ticketId = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = new SupportTicket({
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: (mobile || '').trim(),
      bookingIdOrPnr: (bookingIdOrPnr || '').trim(),
      category: category || 'General Inquiry',
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: String(ip)
    });

    await newTicket.save();
    console.log(`✅ Support Ticket created: ${ticketId} by ${email}`);

    res.status(201).json({
      message: 'Support ticket registered successfully. An automated confirmation has been sent to your email.',
      ticketId
    });
  } catch (err) {
    console.error('Support ticket error:', err);
    res.status(500).json({ error: 'Internal server error processing support ticket' });
  }
});

module.exports = router;
