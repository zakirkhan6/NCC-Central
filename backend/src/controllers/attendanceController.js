import { dbStore } from '../store/index.js';

export const getAttendance = (req, res) => {
  const { date, company, platoon, cadetId } = req.query;
  let list = dbStore.getCollection('attendance');

  if (date) list = list.filter(a => a.date === date);
  if (company) list = list.filter(a => a.company === company);
  if (platoon) list = list.filter(a => a.platoon === platoon);
  if (cadetId) list = list.filter(a => a.cadetId === cadetId);

  return res.json({
    success: true,
    data: list
  });
};

export const markBulkAttendance = (req, res) => {
  const { date, session, records } = req.body;

  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({
      success: false,
      message: 'Date and records array are required.'
    });
  }

  const existingAttendance = dbStore.getCollection('attendance');
  const cadets = dbStore.getCollection('cadets');

  const updatedOrCreated = [];

  records.forEach(rec => {
    const cadet = cadets.find(c => c.id === rec.cadetId);
    if (!cadet) return;

    // Check duplicate record for same cadet, date, session
    const existingIndex = existingAttendance.findIndex(a => 
      a.cadetId === rec.cadetId && 
      a.date === date && 
      (!session || a.session === session)
    );

    const attendanceRecord = {
      id: existingIndex !== -1 ? existingAttendance[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      cadetId: cadet.id,
      cadetName: cadet.fullName,
      regNo: cadet.regNo,
      date,
      company: cadet.company,
      platoon: cadet.platoon,
      status: rec.status || 'PRESENT',
      session: session || 'Daily Parade Fallin',
      remarks: rec.remarks || ''
    };

    if (existingIndex !== -1) {
      existingAttendance[existingIndex] = attendanceRecord;
    } else {
      existingAttendance.unshift(attendanceRecord);
    }
    updatedOrCreated.push(attendanceRecord);
  });

  dbStore.setCollection('attendance', existingAttendance);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'ATTENDANCE_MARKED',
    resource: `Attendance (${date})`,
    timestamp: new Date().toISOString(),
    details: `Marked attendance for ${updatedOrCreated.length} cadets`
  });

  return res.json({
    success: true,
    message: `Successfully updated attendance for ${updatedOrCreated.length} cadets.`,
    data: updatedOrCreated
  });
};

export const getAttendanceStats = (req, res) => {
  const attendance = dbStore.getCollection('attendance');
  const cadets = dbStore.getCollection('cadets');

  const totalCadets = cadets.length;
  const activeCadets = cadets.filter(c => c.status === 'ACTIVE').length;

  const totalRecords = attendance.length;
  const presentRecords = attendance.filter(a => a.status === 'PRESENT').length;
  const absentRecords = attendance.filter(a => a.status === 'ABSENT').length;
  const leaveRecords = attendance.filter(a => a.status === 'LEAVE').length;
  const campRecords = attendance.filter(a => a.status === 'CAMP').length;

  const overallPercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 100;

  return res.json({
    success: true,
    data: {
      totalCadets,
      activeCadets,
      totalRecords,
      presentRecords,
      absentRecords,
      leaveRecords,
      campRecords,
      overallPercentage
    }
  });
};
