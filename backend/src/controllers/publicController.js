import { StatisticsService } from '../services/statisticsService.js';
import { dbStore } from '../store/index.js';

export const getPublicStatistics = (req, res) => {
  try {
    const stats = StatisticsService.getPublicStatistics();
    return res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve public statistics',
      error: err.message
    });
  }
};

export const getPublicOperations = (req, res) => {
  try {
    const operations = StatisticsService.getPublicOperations();
    return res.json({
      success: true,
      data: operations
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve operational preview',
      error: err.message
    });
  }
};

export const verifyCertificatePublic = (req, res) => {
  try {
    const { certificateNo } = req.params;
    if (!certificateNo) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Certificate number is required.'
      });
    }

    const certificates = dbStore.getCollection('certificates') || [];
    const cert = certificates.find(c => c.certificateNo.trim().toLowerCase() === certificateNo.trim().toLowerCase());

    if (!cert) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Certificate Number Not Found in Official NCC Central Registry.'
      });
    }

    // Mask registration number to protect cadet privacy on public lookup
    const maskedRegNo = cert.regNo ? 
      (cert.regNo.length > 5 ? `${cert.regNo.slice(0, 4)}••••${cert.regNo.slice(-3)}` : '••••') 
      : 'MH23••••';

    return res.json({
      success: true,
      verified: true,
      data: {
        certificateNo: cert.certificateNo,
        cadetName: cert.cadetName,
        maskedRegNo,
        rank: cert.rank || 'Cadet',
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        grade: cert.grade,
        status: cert.status || 'ISSUED',
        issuingAuthority: '1 MAH BATTALION NCC, MUMBAI',
        verificationTimestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      verified: false,
      message: 'Verification service temporarily unavailable.',
      error: err.message
    });
  }
};

export const publicEnrollment = (req, res) => {
  try {
    const { fullName, email, phone, regNo, bloodGroup, collegeName, course, yearOfStudy, dob, gender, fatherName } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and phone number are required for cadet registration.'
      });
    }

    const cadets = dbStore.getCollection('cadets') || [];
    const users = dbStore.getCollection('users') || [];

    // Uniqueness checks
    if (email && (users.some(u => u.email.toLowerCase() === email.toLowerCase()) || cadets.some(c => c.email.toLowerCase() === email.toLowerCase()))) {
      return res.status(400).json({
        success: false,
        message: 'A cadet account with this email address already exists.'
      });
    }

    const finalRegNo = regNo && regNo.trim() ? regNo.trim() : `MH26SDA${Math.floor(10000 + Math.random() * 90000)}`;

    if (cadets.some(c => c.regNo.toLowerCase() === finalRegNo.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Cadet with registration number ${finalRegNo} is already registered.`
      });
    }

    const newCadetId = `cdt-${Date.now()}`;
    const newCadet = {
      id: newCadetId,
      regNo: finalRegNo,
      fullName,
      email,
      phone,
      rank: 'Cadet',
      company: 'ALPHA COY',
      platoon: 'Platoon 1',
      dateJoined: new Date().toISOString().split('T')[0],
      bloodGroup: bloodGroup || 'O+',
      dob: dob || '2004-01-01',
      gender: gender || 'Male',
      fatherName: fatherName || '',
      collegeName: collegeName || 'Rizvi College of Arts, Science & Commerce',
      course: course || 'Degree Course',
      yearOfStudy: yearOfStudy || '1st Year',
      status: 'ACTIVE'
    };

    dbStore.addItem('cadets', newCadet);

    // Audit log
    dbStore.addItem('auditLogs', {
      id: `log-${Date.now()}`,
      user: 'Public Portal',
      role: 'CADET',
      action: 'CADET_SELF_REGISTERED',
      resource: `Cadet (${finalRegNo})`,
      timestamp: new Date().toISOString(),
      details: `New cadet ${fullName} self-enrolled via public portal.`
    });

    return res.status(201).json({
      success: true,
      message: 'Cadet self-registration successful! Welcome to NCC Central.',
      data: newCadet
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Self-registration failed. Please try again.',
      error: err.message
    });
  }
};
