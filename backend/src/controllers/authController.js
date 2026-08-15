import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { dbStore } from '../store/index.js';

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  const users = dbStore.getCollection('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please check email and password.'
    });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Contact system administrator.'
    });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.userId === user.id);

  // Record audit log
  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: user.fullName,
    role: user.role,
    action: 'USER_LOGIN',
    resource: `User (${user.email})`,
    timestamp: new Date().toISOString(),
    details: `Successful login from role ${user.role}`
  });

  return res.json({
    success: true,
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        cadetId: cadet ? cadet.id : null,
        regNo: cadet ? cadet.regNo : null,
        rank: cadet ? cadet.rank : null,
        company: user.company || (cadet ? cadet.company : 'ALPHA COY')
      }
    }
  });
};

export const register = (req, res) => {
  const { email, password, fullName, phone, regNo, rank, company, platoon, bloodGroup, dob } = req.body;

  if (!email || !password || !fullName || !regNo) {
    return res.status(400).json({
      success: false,
      message: 'Missing required registration fields (Email, Password, Full Name, Reg No).'
    });
  }

  const users = dbStore.getCollection('users');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists.'
    });
  }

  const cadets = dbStore.getCollection('cadets');
  if (cadets.some(c => c.regNo.toLowerCase() === regNo.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Cadet with this NCC Reg No already exists.'
    });
  }

  const newUserId = `u-cadet-${Date.now()}`;
  const newUser = {
    id: newUserId,
    email,
    password,
    fullName,
    role: 'CADET',
    phone: phone || '',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  const newCadetId = `cdt-${Date.now()}`;
  const newCadet = {
    id: newCadetId,
    userId: newUserId,
    regNo,
    fullName,
    email,
    phone: phone || '',
    rank: rank || 'Cadet',
    company: company || 'ALPHA COY',
    platoon: platoon || 'Platoon 1',
    dateJoined: new Date().toISOString().split('T')[0],
    bloodGroup: bloodGroup || 'O+',
    status: 'ACTIVE',
    dob: dob || '2004-01-01',
    gender: 'Male',
    collegeName: 'Rizvi College of Arts, Science & Commerce',
    course: 'Undergraduate',
    yearOfStudy: '1st Year',
    avatarUrl: newUser.avatarUrl
  };

  dbStore.addItem('users', newUser);
  dbStore.addItem('cadets', newCadet);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: fullName,
    role: 'CADET',
    action: 'CADET_SELF_REGISTER',
    resource: `Cadet (${regNo})`,
    timestamp: new Date().toISOString(),
    details: `Registered new cadet account`
  });

  const token = jwt.sign(
    { userId: newUser.id, role: newUser.role, email: newUser.email },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  return res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        cadetId: newCadet.id,
        regNo: newCadet.regNo,
        rank: newCadet.rank,
        company: newCadet.company
      }
    }
  });
};

export const getMe = (req, res) => {
  const user = req.user;
  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.userId === user.id || c.email?.toLowerCase() === user.email?.toLowerCase());

  return res.json({
    success: true,
    data: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      designation: user.designation,
      unit: user.unit,
      company: user.company || (cadet ? cadet.company : 'ALPHA COY'),
      cadetId: cadet ? cadet.id : null,
      regNo: cadet ? cadet.regNo : null,
      rank: cadet ? cadet.rank : null,
      cadet: cadet || null
    }
  });
};

export const updateProfile = (req, res) => {
  const user = req.user;
  const { fullName, phone, designation, unit, company, avatarUrl } = req.body;

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;
  if (designation !== undefined) updates.designation = designation;
  if (unit !== undefined) updates.unit = unit;
  if (company !== undefined) updates.company = company;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

  const updatedUser = dbStore.updateItem('users', user.id, updates);

  // If cadet, also update cadet record
  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.userId === user.id || c.email?.toLowerCase() === user.email?.toLowerCase());
  if (cadet) {
    dbStore.updateItem('cadets', cadet.id, {
      ...(fullName && { fullName }),
      ...(phone && { phone }),
      ...(avatarUrl && { avatarUrl }),
      ...(company && { company })
    });
  }

  // Record audit log
  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: user.fullName,
    role: user.role,
    action: 'USER_PROFILE_UPDATE',
    resource: `Profile (${user.email})`,
    timestamp: new Date().toISOString(),
    details: `Updated personal profile details and avatar`
  });

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      id: updatedUser ? updatedUser.id : user.id,
      fullName: updatedUser ? updatedUser.fullName : (fullName || user.fullName),
      email: user.email,
      role: user.role,
      phone: updatedUser ? updatedUser.phone : (phone || user.phone),
      avatarUrl: updatedUser ? updatedUser.avatarUrl : (avatarUrl || user.avatarUrl),
      designation: updatedUser ? updatedUser.designation : designation,
      unit: updatedUser ? updatedUser.unit : unit,
      company: updatedUser ? updatedUser.company : company,
      cadetId: cadet ? cadet.id : null,
      regNo: cadet ? cadet.regNo : null,
      rank: cadet ? cadet.rank : null
    }
  });
};

