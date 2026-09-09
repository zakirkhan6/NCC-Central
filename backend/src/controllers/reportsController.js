import { dbStore } from '../store/index.js';
import { StatisticsService } from '../services/statisticsService.js';

export const getReportsSummary = (req, res) => {
  try {
    const user = req.user;
    const { company, platoon, startDate, endDate } = req.query;

    const data = StatisticsService.getUnitDashboardMetrics(user?.role, user?.id, user?.cadetId);
    let cadets = dbStore.getCollection('cadets') || [];
    let attendance = dbStore.getCollection('attendance') || [];

    if (company && company !== 'All') {
      cadets = cadets.filter(c => c.company === company);
      attendance = attendance.filter(a => a.company === company);
    }
    if (platoon && platoon !== 'All') {
      cadets = cadets.filter(c => c.platoon === platoon);
      attendance = attendance.filter(a => a.platoon === platoon);
    }
    if (startDate) {
      attendance = attendance.filter(a => a.date >= startDate);
    }
    if (endDate) {
      attendance = attendance.filter(a => a.date <= endDate);
    }

    const filteredTotalCadets = cadets.length;
    const filteredActive = cadets.filter(c => c.status === 'ACTIVE').length;
    const filteredPresent = attendance.filter(a => a.status === 'PRESENT' || a.status === 'CAMP').length;
    const filteredRate = attendance.length > 0 ? Math.round((filteredPresent / attendance.length) * 100) : (filteredTotalCadets > 0 ? 100 : 0);

    return res.json({
      success: true,
      data: {
        ...data,
        filteredMetrics: {
          totalCadets: filteredTotalCadets,
          activeCadets: filteredActive,
          attendanceRate: filteredRate,
          attendanceRecordsCount: attendance.length
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate dynamic reports summary.',
      error: err.message
    });
  }
};

export const exportCadetsCsv = (req, res) => {
  const { company, platoon, status } = req.query;
  let cadets = dbStore.getCollection('cadets') || [];

  if (company && company !== 'All') cadets = cadets.filter(c => c.company === company);
  if (platoon && platoon !== 'All') cadets = cadets.filter(c => c.platoon === platoon);
  if (status && status !== 'All') cadets = cadets.filter(c => c.status === status);

  let csvContent = "Reg No,Full Name,Rank,Company,Platoon,Status,Phone,Email,Blood Group,College,Course,Date Joined\n";
  cadets.forEach(c => {
    csvContent += `"${c.regNo || ''}","${c.fullName || ''}","${c.rank || ''}","${c.company || ''}","${c.platoon || ''}","${c.status || ''}","${c.phone || ''}","${c.email || ''}","${c.bloodGroup || ''}","${c.collegeName || ''}","${c.course || ''}","${c.dateJoined || ''}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ncc_cadets_registry_report.csv"');
  return res.status(200).send(csvContent);
};

export const exportAttendanceCsv = (req, res) => {
  const { company, date } = req.query;
  let attendance = dbStore.getCollection('attendance') || [];

  if (company && company !== 'All') attendance = attendance.filter(a => a.company === company);
  if (date) attendance = attendance.filter(a => a.date === date);

  let csvContent = "Date,Reg No,Cadet Name,Company,Platoon,Status,Session,Remarks\n";
  attendance.forEach(a => {
    csvContent += `"${a.date || ''}","${a.regNo || ''}","${a.cadetName || ''}","${a.company || ''}","${a.platoon || ''}","${a.status || ''}","${a.session || ''}","${a.remarks || ''}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ncc_attendance_register_report.csv"');
  return res.status(200).send(csvContent);
};
