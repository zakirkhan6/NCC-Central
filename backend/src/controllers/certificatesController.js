import QRCode from 'qrcode';
import { dbStore } from '../store/index.js';

export const getCertificates = (req, res) => {
  const { cadetId, status, search } = req.query;
  let certificates = dbStore.getCollection('certificates') || [];

  if (cadetId) {
    certificates = certificates.filter(c => c.cadetId === cadetId);
  }
  if (status && status !== 'All') {
    certificates = certificates.filter(c => c.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    certificates = certificates.filter(c => 
      c.certificateNo?.toLowerCase().includes(q) ||
      c.cadetName?.toLowerCase().includes(q) ||
      c.regNo?.toLowerCase().includes(q) ||
      c.courseName?.toLowerCase().includes(q)
    );
  }

  return res.json({ success: true, data: certificates });
};

export const getCertificateById = (req, res) => {
  const { id } = req.params;
  const certificates = dbStore.getCollection('certificates') || [];
  const cert = certificates.find(c => c.id === id || c.certificateNo === id);

  if (!cert) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  return res.json({ success: true, data: cert });
};

export const createCertificate = async (req, res) => {
  try {
    const { cadetId, courseName, issueDate, grade } = req.body;
    if (!cadetId || !courseName) {
      return res.status(400).json({ success: false, message: 'Cadet ID and Course Name are required.' });
    }

    const cadets = dbStore.getCollection('cadets') || [];
    const cadet = cadets.find(c => c.id === cadetId);

    if (!cadet) {
      return res.status(404).json({ success: false, message: 'Cadet not found in directory.' });
    }

    const currentYear = new Date().getFullYear();
    let typeCode = 'B';
    if (courseName.includes("'A'") || courseName.includes(" A ")) typeCode = 'A';
    else if (courseName.includes("'C'") || courseName.includes(" C ")) typeCode = 'C';
    else if (courseName.toLowerCase().includes('camp')) typeCode = 'CAMP';

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certNumber = `NCC-${currentYear}-${typeCode}-${randomSuffix}`;

    // Verification URL pointing to frontend verification route
    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const verifyUrl = `${clientOrigin}/verify/${certNumber}`;

    // Generate high-resolution QR code
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#123B63',
        light: '#FFFFFF'
      }
    });

    const newCertificate = {
      id: `crt-${Date.now()}`,
      certificateNo: certNumber,
      cadetId: cadet.id,
      cadetName: cadet.fullName,
      regNo: cadet.regNo,
      rank: cadet.rank || 'Cadet',
      company: cadet.company || 'ALPHA COY',
      courseName,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      grade: grade || 'Alpha (A Grade)',
      status: 'ISSUED',
      qrCodeDataUrl,
      verifyUrl,
      verified: true
    };

    dbStore.addItem('certificates', newCertificate);

    dbStore.addItem('auditLogs', {
      id: `log-${Date.now()}`,
      user: req.user?.fullName || 'NCC Officer',
      role: req.user?.role || 'OFFICER',
      action: 'CERTIFICATE_ISSUED',
      resource: `Certificate (${certNumber})`,
      timestamp: new Date().toISOString(),
      details: `Issued ${courseName} to ${cadet.fullName} (${cadet.regNo})`
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate successfully generated and recorded in registry.',
      data: newCertificate
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to issue certificate',
      error: err.message
    });
  }
};

export const revokeCertificate = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const certificates = dbStore.getCollection('certificates') || [];
  const cert = certificates.find(c => c.id === id || c.certificateNo === id);

  if (!cert) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  const updated = dbStore.updateItem('certificates', cert.id, {
    status: 'REVOKED',
    revocationReason: reason || 'Administrative order',
    revokedAt: new Date().toISOString(),
    revokedBy: req.user?.fullName || 'Admin'
  });

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user?.fullName || 'Admin',
    role: req.user?.role || 'ADMIN',
    action: 'CERTIFICATE_REVOKED',
    resource: `Certificate (${cert.certificateNo})`,
    timestamp: new Date().toISOString(),
    details: `Revoked certificate ${cert.certificateNo}: ${reason || 'Administrative action'}`
  });

  return res.json({
    success: true,
    message: 'Certificate has been revoked.',
    data: updated
  });
};

export const verifyCertificate = (req, res) => {
  const { certNo } = req.params;
  const certificates = dbStore.getCollection('certificates') || [];
  const cert = certificates.find(c => c.certificateNo.toLowerCase() === certNo.trim().toLowerCase());

  if (!cert) {
    return res.status(404).json({
      success: false,
      message: 'Certificate record invalid or not found in official registry.',
      verified: false
    });
  }

  const maskedReg = cert.regNo ? 
    (cert.regNo.length > 5 ? `${cert.regNo.substring(0, 4)}••••${cert.regNo.slice(-3)}` : '••••') 
    : '••••';

  return res.json({
    success: true,
    message: 'Official NCC Central Certificate Verified.',
    verified: cert.status !== 'REVOKED',
    data: {
      certificateNo: cert.certificateNo,
      cadetName: cert.cadetName,
      maskedRegNo: maskedReg,
      rank: cert.rank,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      grade: cert.grade,
      status: cert.status || 'ISSUED',
      issuingAuthority: '1 MAH BATTALION NCC, MUMBAI',
      verificationTimestamp: new Date().toISOString()
    }
  });
};

export const getCertificateQrCode = async (req, res) => {
  try {
    const { certNo } = req.params;
    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const verifyUrl = `${clientOrigin}/verify/${certNo}`;
    
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#123B63',
        light: '#FFFFFF'
      }
    });

    return res.json({ success: true, qrDataUrl, verifyUrl });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate QR Code' });
  }
};
