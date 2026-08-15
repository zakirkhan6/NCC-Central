import { dbStore } from '../store/index.js';

export const getReportsSummary = (req, res) => {
  const cadets = dbStore.getCollection('cadets');
  const attendance = dbStore.getCollection('attendance');
  const training = dbStore.getCollection('training');
  const events = dbStore.getCollection('events');
  const achievements = dbStore.getCollection('achievements');
  const certificates = dbStore.getCollection('certificates');

  const totalCadets = cadets.length;
  const activeCadets = cadets.filter(c => c.status === 'ACTIVE').length;

  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = totalAttendanceRecords > 0 ? Math.round((presentCount / totalAttendanceRecords) * 100) : 100;

  // Company breakdown
  const companyBreakdown = cadets.reduce((acc, c) => {
    acc[c.company] = (acc[c.company] || 0) + 1;
    return acc;
  }, {});

  // Monthly attendance trend
  const monthlyTrend = [
    { month: 'Mar', percentage: 92 },
    { month: 'Apr', percentage: 88 },
    { month: 'May', percentage: 85 },
    { month: 'Jun', percentage: 94 },
    { month: 'Jul', percentage: 90 },
    { month: 'Aug', percentage: attendancePercentage }
  ];

  return res.json({
    success: true,
    data: {
      metrics: {
        totalCadets,
        activeCadets,
        attendancePercentage,
        totalTrainingSessions: training.length,
        totalEvents: events.length,
        totalAchievements: achievements.length,
        totalCertificatesIssued: certificates.length
      },
      companyBreakdown,
      monthlyTrend,
      recentActivities: dbStore.getCollection('auditLogs').slice(0, 5)
    }
  });
};

export const exportCadetsCsv = (req, res) => {
  const cadets = dbStore.getCollection('cadets');

  let csvContent = "Reg No,Full Name,Rank,Company,Platoon,Status,Phone,Email,Blood Group,Date Joined\n";
  cadets.forEach(c => {
    csvContent += `"${c.regNo}","${c.fullName}","${c.rank}","${c.company}","${c.platoon}","${c.status}","${c.phone}","${c.email}","${c.bloodGroup}","${c.dateJoined}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ncc_cadets_report.csv"');
  return res.status(200).send(csvContent);
};

export const exportAttendanceCsv = (req, res) => {
  const attendance = dbStore.getCollection('attendance');

  let csvContent = "Date,Reg No,Cadet Name,Company,Platoon,Status,Session,Remarks\n";
  attendance.forEach(a => {
    csvContent += `"${a.date}","${a.regNo}","${a.cadetName}","${a.company}","${a.platoon}","${a.status}","${a.session}","${a.remarks || ''}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ncc_attendance_report.csv"');
  return res.status(200).send(csvContent);
};
