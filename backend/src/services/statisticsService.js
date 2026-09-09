import { dbStore } from '../store/index.js';

export class StatisticsService {
  static getPublicStatistics() {
    const cadets = dbStore.getCollection('cadets') || [];
    const attendance = dbStore.getCollection('attendance') || [];
    const certificates = dbStore.getCollection('certificates') || [];
    const events = dbStore.getCollection('events') || [];

    const totalCadets = cadets.length;
    const activeCadets = cadets.filter(c => c.status === 'ACTIVE').length;

    // Calculate real attendance rate
    let attendanceRate = 0;
    if (attendance.length > 0) {
      const presentCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'CAMP').length;
      attendanceRate = Math.round((presentCount / attendance.length) * 100);
    } else {
      attendanceRate = totalCadets > 0 ? 100 : 0;
    }

    const verifiedCertificates = certificates.filter(c => c.status === 'ISSUED' || c.status === 'ACTIVE').length;

    const companies = [...new Set(cadets.map(c => c.company).filter(Boolean))];
    const activeUnit = companies.length > 0 ? companies[0] : '1 MAH BATTALION NCC';

    return {
      totalCadets,
      activeCadets,
      attendanceRate,
      verifiedCertificates,
      activeUnit,
      totalCompanies: companies.length || 1,
      upcomingEventsCount: events.length
    };
  }

  static getPublicOperations() {
    const parades = dbStore.getCollection('parades') || [];
    const events = dbStore.getCollection('events') || [];
    const certificates = dbStore.getCollection('certificates') || [];
    const announcements = dbStore.getCollection('announcements') || [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Today's or next upcoming parade
    const todayParade = parades.find(p => p.date === todayStr) || 
      parades.filter(p => p.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date))[0] ||
      parades[0] || null;

    // Upcoming Camp or major event
    const upcomingCamp = events.find(e => (e.category === 'CAMP' || e.category === 'National Camp' || e.title.toLowerCase().includes('camp'))) ||
      events.find(e => e.is_upcoming !== false) ||
      events[0] || null;

    // Latest verified certificate preview (masked for privacy)
    const latestCert = certificates.length > 0 ? certificates[certificates.length - 1] : null;
    const recentCertPreview = latestCert ? {
      certificateNo: latestCert.certificateNo,
      courseName: latestCert.courseName,
      issueDate: latestCert.issueDate,
      grade: latestCert.grade,
      status: latestCert.status || 'ISSUED',
      maskedCadetName: latestCert.cadetName ? `${latestCert.cadetName.split(' ')[0]} ***` : 'Cadet'
    } : null;

    // Latest urgent or public announcement
    const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

    return {
      todayParade: todayParade ? {
        id: todayParade.id,
        title: todayParade.title,
        commander: todayParade.commander,
        location: todayParade.location,
        time: todayParade.time,
        date: todayParade.date,
        company: todayParade.company,
        status: todayParade.status || 'SCHEDULED'
      } : null,
      upcomingCamp: upcomingCamp ? {
        id: upcomingCamp.id,
        title: upcomingCamp.title,
        category: upcomingCamp.category,
        location: upcomingCamp.location,
        date: upcomingCamp.date,
        capacity: upcomingCamp.capacity,
        eligibility: upcomingCamp.eligibility,
        description: upcomingCamp.description
      } : null,
      recentCertificate: recentCertPreview,
      latestAnnouncement: latestAnnouncement ? {
        id: latestAnnouncement.id,
        title: latestAnnouncement.title,
        priority: latestAnnouncement.priority,
        publishDate: latestAnnouncement.publishDate || latestAnnouncement.date,
        author: latestAnnouncement.author
      } : null
    };
  }

  static getUnitDashboardMetrics(userRole = 'ADMIN', userId = null, cadetId = null) {
    const cadets = dbStore.getCollection('cadets') || [];
    const attendance = dbStore.getCollection('attendance') || [];
    const parades = dbStore.getCollection('parades') || [];
    const training = dbStore.getCollection('training') || [];
    const events = dbStore.getCollection('events') || [];
    const achievements = dbStore.getCollection('achievements') || [];
    const certificates = dbStore.getCollection('certificates') || [];
    const announcements = dbStore.getCollection('announcements') || [];
    const auditLogs = dbStore.getCollection('auditLogs') || [];

    // Unit-wide calculations
    const totalCadets = cadets.length;
    const activeCadets = cadets.filter(c => c.status === 'ACTIVE').length;
    const totalAttendance = attendance.length;
    const presentAttendance = attendance.filter(a => a.status === 'PRESENT' || a.status === 'CAMP').length;
    const unitAttendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 100;

    // Company breakdown
    const companyCounts = cadets.reduce((acc, c) => {
      const coy = c.company || 'ALPHA COY';
      acc[coy] = (acc[coy] || 0) + 1;
      return acc;
    }, {});
    const companyDistribution = Object.keys(companyCounts).map(name => ({
      name,
      cadets: companyCounts[name]
    }));

    // Rank breakdown
    const rankCounts = cadets.reduce((acc, c) => {
      const rank = c.rank || 'Cadet';
      acc[rank] = (acc[rank] || 0) + 1;
      return acc;
    }, {});
    const rankDistribution = Object.keys(rankCounts).map(name => ({
      name,
      count: rankCounts[name]
    }));

    // Attendance Trends (computed from real data grouped by month or recent dates)
    const monthlyTrendMap = {};
    attendance.forEach(att => {
      if (!att.date) return;
      const monthKey = new Date(att.date).toLocaleString('default', { month: 'short' });
      if (!monthlyTrendMap[monthKey]) {
        monthlyTrendMap[monthKey] = { total: 0, present: 0 };
      }
      monthlyTrendMap[monthKey].total += 1;
      if (att.status === 'PRESENT' || att.status === 'CAMP') {
        monthlyTrendMap[monthKey].present += 1;
      }
    });

    let attendanceTrend = Object.keys(monthlyTrendMap).map(month => ({
      month,
      percentage: Math.round((monthlyTrendMap[month].present / monthlyTrendMap[month].total) * 100)
    }));

    if (attendanceTrend.length === 0) {
      attendanceTrend = [
        { month: 'Current', percentage: unitAttendanceRate }
      ];
    }

    // Cadet personal metrics if requested
    let cadetMetrics = null;
    if (cadetId) {
      const cadetAttendance = attendance.filter(a => a.cadetId === cadetId);
      const cadetPresent = cadetAttendance.filter(a => a.status === 'PRESENT' || a.status === 'CAMP').length;
      const cadetAttendanceRate = cadetAttendance.length > 0 ? Math.round((cadetPresent / cadetAttendance.length) * 100) : 100;
      const cadetAchievements = achievements.filter(a => a.cadetId === cadetId);
      const cadetCerts = certificates.filter(c => c.cadetId === cadetId);
      const cadetEventRegistrations = (dbStore.getCollection('eventRegistrations') || []).filter(r => r.cadetId === cadetId);

      cadetMetrics = {
        attendanceRate: cadetAttendanceRate,
        totalParadesAttended: cadetPresent,
        achievementsCount: cadetAchievements.length,
        certificatesCount: cadetCerts.length,
        registeredEventsCount: cadetEventRegistrations.length,
        certificates: cadetCerts,
        achievements: cadetAchievements
      };
    }

    return {
      overview: {
        totalCadets,
        activeCadets,
        attendanceRate: unitAttendanceRate,
        totalParades: parades.length,
        totalTrainingSessions: training.length,
        totalEvents: events.length,
        totalAchievements: achievements.length,
        totalCertificatesIssued: certificates.length,
        totalAnnouncements: announcements.length
      },
      companyDistribution,
      rankDistribution,
      attendanceTrend,
      recentActivities: auditLogs.slice(0, 8),
      cadetMetrics
    };
  }
}
