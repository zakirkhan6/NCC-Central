import QRCode from 'qrcode';
import { dbStore } from '../store/index.js';

export const getCertificates = (req, res) => {
  const { cadetId } = req.query;
  let certificates = dbStore.getCollection('certificates');
  if (cadetId) certificates = certificates.filter(c => c.cadetId === cadetId);
  return res.json({ success: true, data: certificates });
};

export const createCertificate = (req, res) => {
  const { cadetId, courseName, issueDate, grade } = req.body;
  if (!cadetId || !courseName) {
    return res.status(400).json({ success: false, message: 'Cadet ID and Course Name are required.' });
  }

  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.id === cadetId);

  if (!cadet) return res.status(404).json({ success: false, message: 'Cadet not found.' });

  const certNumber = `NCC-CENTRAL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const newCertificate = {
    id: `crt-${Date.now()}`,
    certificateNo: certNumber,
    cadetId: cadet.id,
    cadetName: cadet.fullName,
    regNo: cadet.regNo,
    rank: cadet.rank,
    courseName,
    issueDate: issueDate || new Date().toISOString().split('T')[0],
    grade: grade || 'Alpha (A Grade)',
    status: 'ISSUED',
    verified: true
  };

  dbStore.addItem('certificates', newCertificate);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'CERTIFICATE_ISSUED',
    resource: `Certificate (${certNumber})`,
    timestamp: new Date().toISOString(),
    details: `Issued ${courseName} certificate to ${cadet.fullName}`
  });

  return res.status(201).json({
    success: true,
    message: 'Certificate record created successfully.',
    data: newCertificate
  });
};

export const verifyCertificate = (req, res) => {
  const { certNo } = req.params;
  const certificates = dbStore.getCollection('certificates');
  const cert = certificates.find(c => c.certificateNo.toLowerCase() === certNo.toLowerCase());

  if (!cert) {
    return res.status(404).json({
      success: false,
      message: 'Certificate record invalid or not found in official registry.',
      verified: false
    });
  }

  // Obfuscate sensitive personal info on public verification check
  const maskedReg = cert.regNo ? `${cert.regNo.substring(0, 4)}****${cert.regNo.slice(-3)}` : '****';

  return res.json({
    success: true,
    message: 'Official NCC Central Certificate Verified.',
    verified: true,
    data: {
      certificateNo: cert.certificateNo,
      cadetName: cert.cadetName,
      maskedRegNo: maskedReg,
      rank: cert.rank,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      grade: cert.grade,
      status: cert.status,
      issuingAuthority: '1 MAH BATTALION NCC, MUMBAI'
    }
  });
};

export const getCertificateQrCode = async (req, res) => {
  const { certNo } = req.params;
  const verifyUrl = `${req.protocol}://${req.get('host')}/verify-certificate/${certNo}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);
    return res.json({ success: true, qrDataUrl, verifyUrl });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate QR Code' });
  }
};
