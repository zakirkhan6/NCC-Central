import { dbStore } from '../store/index.js';

export const getCadets = (req, res) => {
  const { search, company, platoon, rank, status, page = 1, limit = 10 } = req.query;
  let cadets = dbStore.getCollection('cadets');

  if (search) {
    const q = search.toLowerCase();
    cadets = cadets.filter(c => 
      c.fullName.toLowerCase().includes(q) || 
      c.regNo.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q)
    );
  }

  if (company) cadets = cadets.filter(c => c.company === company);
  if (platoon) cadets = cadets.filter(c => c.platoon === platoon);
  if (rank) cadets = cadets.filter(c => c.rank === rank);
  if (status) cadets = cadets.filter(c => c.status === status);

  const total = cadets.length;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedCadets = cadets.slice(startIndex, startIndex + limitNum);

  return res.json({
    success: true,
    data: {
      cadets: paginatedCadets,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  });
};

export const getCadetById = (req, res) => {
  const { id } = req.params;
  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.id === id || c.userId === id);

  if (!cadet) {
    return res.status(404).json({
      success: false,
      message: 'Cadet record not found.'
    });
  }

  // Fetch associated records for deep profile
  const attendance = dbStore.getCollection('attendance').filter(a => a.cadetId === cadet.id);
  const achievements = dbStore.getCollection('achievements').filter(a => a.cadetId === cadet.id);
  const certificates = dbStore.getCollection('certificates').filter(c => c.cadetId === cadet.id);
  const events = dbStore.getCollection('events').filter(e => e.registrations && e.registrations.includes(cadet.id));

  const totalAttendance = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

  return res.json({
    success: true,
    data: {
      ...cadet,
      attendanceRate,
      attendanceHistory: attendance,
      achievements,
      certificates,
      enrolledEvents: events
    }
  });
};

export const createCadet = (req, res) => {
  const { fullName, email, phone, regNo, rank, company, platoon, dateJoined, bloodGroup, dob, collegeName, course, yearOfStudy } = req.body;

  if (!fullName || !email || !regNo) {
    return res.status(400).json({
      success: false,
      message: 'Full Name, Email, and Reg No are required.'
    });
  }

  const cadets = dbStore.getCollection('cadets');
  if (cadets.some(c => c.regNo.toLowerCase() === regNo.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Cadet with this Reg No already exists.'
    });
  }

  const newUserId = `u-cadet-${Date.now()}`;
  const newUser = {
    id: newUserId,
    email,
    password: 'password123',
    fullName,
    role: 'CADET',
    phone: phone || '',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  const newCadet = {
    id: `cdt-${Date.now()}`,
    userId: newUserId,
    regNo,
    fullName,
    email,
    phone: phone || '',
    rank: rank || 'Cadet',
    company: company || 'ALPHA COY',
    platoon: platoon || 'Platoon 1',
    dateJoined: dateJoined || new Date().toISOString().split('T')[0],
    bloodGroup: bloodGroup || 'O+',
    status: 'ACTIVE',
    dob: dob || '2004-01-01',
    collegeName: collegeName || 'Rizvi College of Arts, Science & Commerce',
    course: course || 'B.Sc',
    yearOfStudy: yearOfStudy || '1st Year',
    avatarUrl: newUser.avatarUrl
  };

  dbStore.addItem('users', newUser);
  dbStore.addItem('cadets', newCadet);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'CADET_CREATED',
    resource: `Cadet (${regNo})`,
    timestamp: new Date().toISOString(),
    details: `Added new cadet ${fullName}`
  });

  return res.status(201).json({
    success: true,
    message: 'Cadet record created successfully.',
    data: newCadet
  });
};

export const updateCadet = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const cadet = dbStore.updateItem('cadets', id, updates);
  if (!cadet) {
    return res.status(404).json({
      success: false,
      message: 'Cadet not found.'
    });
  }

  // Update associated user full name/phone if altered
  if (updates.fullName || updates.phone) {
    dbStore.updateItem('users', cadet.userId, {
      fullName: updates.fullName || cadet.fullName,
      phone: updates.phone || cadet.phone
    });
  }

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'CADET_UPDATED',
    resource: `Cadet (${cadet.regNo})`,
    timestamp: new Date().toISOString(),
    details: `Updated cadet profile information`
  });

  return res.json({
    success: true,
    message: 'Cadet profile updated successfully.',
    data: cadet
  });
};

export const toggleCadetStatus = (req, res) => {
  const { id } = req.params;
  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.id === id);

  if (!cadet) {
    return res.status(404).json({ success: false, message: 'Cadet not found.' });
  }

  const newStatus = cadet.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const updatedCadet = dbStore.updateItem('cadets', id, { status: newStatus });
  dbStore.updateItem('users', cadet.userId, { status: newStatus });

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'CADET_STATUS_CHANGED',
    resource: `Cadet (${cadet.regNo})`,
    timestamp: new Date().toISOString(),
    details: `Changed status to ${newStatus}`
  });

  return res.json({
    success: true,
    message: `Cadet status updated to ${newStatus}.`,
    data: updatedCadet
  });
};
