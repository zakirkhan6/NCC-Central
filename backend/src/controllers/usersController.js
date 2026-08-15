import { dbStore } from '../store/index.js';

export const getUsers = (req, res) => {
  const users = dbStore.getCollection('users');
  const sanitized = users.map(({ password, ...u }) => u);
  return res.json({ success: true, data: sanitized });
};

export const createUser = (req, res) => {
  const { fullName, email, password, role, phone, designation, company } = req.body;
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Full Name, Email, Password, and Role are required.' });
  }

  const users = dbStore.getCollection('users');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    email,
    password,
    fullName,
    role,
    phone: phone || '',
    designation: designation || (role === 'ANO' ? 'Associate NCC Officer' : 'Staff'),
    company: company || 'ALPHA COY',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  dbStore.addItem('users', newUser);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'USER_CREATED',
    resource: `User (${email})`,
    timestamp: new Date().toISOString(),
    details: `Created new user with role ${role}`
  });

  const { password: p, ...sanitized } = newUser;
  return res.status(201).json({ success: true, message: 'User created successfully.', data: sanitized });
};

export const updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const updated = dbStore.updateItem('users', id, { role, status });
  if (!updated) return res.status(404).json({ success: false, message: 'User not found.' });

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'USER_ROLE_UPDATED',
    resource: `User (${updated.email})`,
    timestamp: new Date().toISOString(),
    details: `Updated role to ${role}`
  });

  const { password: p, ...sanitized } = updated;
  return res.json({ success: true, message: 'User updated.', data: sanitized });
};
