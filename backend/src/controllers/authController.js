import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { dbStore } from '../store/index.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const users = dbStore.getCollection('users') || [];
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check email and password.'
      });
    }

    // Secure password comparison: Check bcrypt hash or fallback for plain seed passwords
    let isMatch = false;
    const userPassword = user.password || 'password123';
    if (userPassword.startsWith('$2a$') || userPassword.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, userPassword);
    } else {
      isMatch = userPassword === password;
      // Upgrade plain password to bcrypt hash in background
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        dbStore.updateItem('users', user.id, { password: hashedPassword });
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check email and password.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact your NCC Unit Administrator.'
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    const cadets = dbStore.getCollection('cadets') || [];
    const cadet = cadets.find(c => c.userId === user.id || c.email?.toLowerCase() === user.email.toLowerCase());

    // Record audit log
    dbStore.addItem('auditLogs', {
      id: `log-${Date.now()}`,
      user: user.fullName,
      role: user.role,
      action: 'USER_LOGIN',
      resource: `User (${user.email})`,
      timestamp: new Date().toISOString(),
      details: `Successful login to platform with role ${user.role}`
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
          unit: user.unit || '1 MAH BATTALION NCC, MUMBAI',
          designation: user.designation,
          cadetId: cadet ? cadet.id : null,
          regNo: cadet ? cadet.regNo : null,
          rank: cadet ? cadet.rank : null,
          company: user.company || (cadet ? cadet.company : 'ALPHA COY')
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to a server error.',
      error: err.message
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, fullName, phone, regNo, rank, company, platoon, bloodGroup, dob, gender, collegeName, course, yearOfStudy } = req.body;

    if (!email || !password || !fullName || !regNo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required registration fields (Email, Password, Full Name, NCC Reg No).'
      });
    }

    const users = dbStore.getCollection('users') || [];
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const cadets = dbStore.getCollection('cadets') || [];
    if (cadets.some(c => c.regNo.toLowerCase() === regNo.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Cadet with registration number ${regNo} is already registered.`
      });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserId = `u-cadet-${Date.now()}`;
    const newUser = {
      id: newUserId,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      fullName: fullName.trim(),
      role: 'CADET',
      phone: phone || '',
      avatarUrl: `https://images.unsplash.com/photo-${1535713875002 + (Date.now() % 500)}?auto=format&fit=crop&q=80&w=200`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const newCadetId = `cdt-${Date.now()}`;
    const newCadet = {
      id: newCadetId,
      userId: newUserId,
      regNo: regNo.trim(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      rank: rank || 'Cadet',
      company: company || 'ALPHA COY',
      platoon: platoon || 'Platoon 1',
      dateJoined: new Date().toISOString().split('T')[0],
      bloodGroup: bloodGroup || 'O+',
      status: 'ACTIVE',
      dob: dob || '2004-01-01',
      gender: gender || 'Male',
      collegeName: collegeName || 'Rizvi College of Arts, Science & Commerce',
      course: course || 'Undergraduate Degree',
      yearOfStudy: yearOfStudy || '1st Year',
      avatarUrl: newUser.avatarUrl
    };

    dbStore.addItem('users', newUser);
    dbStore.addItem('cadets', newCadet);

    dbStore.addItem('auditLogs', {
      id: `log-${Date.now()}`,
      user: fullName,
      role: 'CADET',
      action: 'CADET_ENROLLED',
      resource: `Cadet (${regNo})`,
      timestamp: new Date().toISOString(),
      details: `Enrolled new cadet account into ${company || 'ALPHA COY'}`
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, email: newUser.email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your NCC Central account is active.',
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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration.',
      error: err.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const users = dbStore.getCollection('users') || [];
    const dbUser = users.find(u => u.id === user.id);

    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let isMatch = false;
    if (dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(currentPassword, dbUser.password);
    } else {
      isMatch = dbUser.password === currentPassword;
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    dbStore.updateItem('users', user.id, { password: hashedNew });

    dbStore.addItem('auditLogs', {
      id: `log-${Date.now()}`,
      user: user.fullName,
      role: user.role,
      action: 'USER_PASSWORD_CHANGE',
      resource: `User (${user.email})`,
      timestamp: new Date().toISOString(),
      details: 'User successfully updated account password.'
    });

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to change password.',
      error: err.message
    });
  }
};

export const getMe = (req, res) => {
  const user = req.user;
  const cadets = dbStore.getCollection('cadets') || [];
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
      unit: user.unit || '1 MAH BATTALION NCC, MUMBAI',
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

  // If cadet, also sync cadet record
  const cadets = dbStore.getCollection('cadets') || [];
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
    details: 'Updated profile information'
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
