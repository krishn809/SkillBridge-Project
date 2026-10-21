const express = require('express');
const { state, save, uid } = require('../db');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();
router.use(authenticate);

router.get('/', (req, res) => {
  const events = (state.events || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json({ events });
});

router.post('/', authorize('academician', 'industry', 'admin'), (req, res) => {
  const { title, type, date, time, location, description } = req.body || {};
  if (!title || !date) return res.status(400).json({ error: 'title and date are required.' });
  const event = {
    id: uid('e'),
    organizerId: req.user.id,
    organizerName: req.user.orgName || req.user.name,
    title: String(title).trim(),
    type: ['Workshop', 'GuestLecture', 'Challenge'].includes(type) ? type : 'Workshop',
    date,
    time: time ? String(time).trim() : '',
    location: location ? String(location).trim() : 'Virtual / Campus',
    description: description ? String(description).trim() : '',
    rsvps: [],
    createdAt: Date.now()
  };
  state.events = state.events || [];
  state.events.push(event);
  save();
  res.status(201).json({ event });
});

router.delete('/:id', authorize('academician', 'industry', 'admin'), (req, res) => {
  state.events = state.events || [];
  const event = state.events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found.' });
  if (req.user.role !== 'admin' && event.organizerId && event.organizerId !== req.user.id && event.organizerName !== req.user.name) {
    return res.status(403).json({ error: 'You can only delete your own events.' });
  }
  state.events = state.events.filter((e) => e.id !== req.params.id);
  save();
  res.status(204).end();
});

router.post('/:id/rsvp', (req, res) => {
  state.events = state.events || [];
  const event = state.events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found.' });
  event.rsvps = event.rsvps || [];
  const idx = event.rsvps.indexOf(req.user.id);
  if (idx > -1) event.rsvps.splice(idx, 1);
  else event.rsvps.push(req.user.id);
  save();
  res.json({ event });
});

module.exports = router;
