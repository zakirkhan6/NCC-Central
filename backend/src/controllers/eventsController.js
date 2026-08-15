import { dbStore } from '../store/index.js';

export const getEvents = (req, res) => {
  const events = dbStore.getCollection('events');
  return res.json({ success: true, data: events });
};

export const createEvent = (req, res) => {
  const { title, category, date, time, location, capacity, eligibility, description } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ success: false, message: 'Title, Date, and Location are required.' });
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    title,
    category: category || 'Camp',
    date,
    time: time || '08:00 AM',
    location,
    capacity: capacity ? parseInt(capacity, 10) : 50,
    eligibility: eligibility || 'All Cadets',
    description: description || '',
    isUpcoming: true,
    registrations: []
  };

  dbStore.addItem('events', newEvent);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'EVENT_CREATED',
    resource: `Event (${title})`,
    timestamp: new Date().toISOString(),
    details: `Created new event for ${date}`
  });

  return res.status(201).json({ success: true, message: 'Event created successfully.', data: newEvent });
};

export const registerForEvent = (req, res) => {
  const { id } = req.params;
  const events = dbStore.getCollection('events');
  const event = events.find(e => e.id === id);

  if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.userId === req.user.id);

  if (!cadet) {
    return res.status(400).json({ success: false, message: 'Only registered cadets can enroll in events.' });
  }

  const regs = event.registrations || [];
  if (regs.includes(cadet.id)) {
    return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
  }

  if (regs.length >= event.capacity) {
    return res.status(400).json({ success: false, message: 'Event registration capacity is full.' });
  }

  regs.push(cadet.id);
  const updated = dbStore.updateItem('events', id, { registrations: regs });

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'EVENT_REGISTRATION',
    resource: `Event (${event.title})`,
    timestamp: new Date().toISOString(),
    details: `Registered cadet ${cadet.regNo}`
  });

  return res.json({
    success: true,
    message: `Successfully registered for ${event.title}.`,
    data: updated
  });
};

export const updateEvent = (req, res) => {
  const { id } = req.params;
  const updated = dbStore.updateItem('events', id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Event not found.' });
  return res.json({ success: true, message: 'Event updated.', data: updated });
};

export const deleteEvent = (req, res) => {
  const { id } = req.params;
  dbStore.deleteItem('events', id);
  return res.json({ success: true, message: 'Event deleted.' });
};
