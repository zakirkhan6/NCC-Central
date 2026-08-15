import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', '..', 'data_store.json');

const initialSeedData = {
  users: [
    {
      id: "u-admin-1",
      email: "admin@ncccentral.org",
      password: "password123", // In production hashed
      fullName: "Col. Rajesh Verma",
      role: "ADMIN",
      phone: "+91 98765 43210",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      status: "ACTIVE",
      createdAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "u-ano-1",
      email: "ano.roshan@ncccentral.org",
      password: "password123",
      fullName: "Capt. Roshan Khobragade",
      role: "ANO",
      phone: "+91 98765 12345",
      unit: "1 MAH BATTALION NCC, MUMBAI",
      company: "ALPHA COY",
      designation: "Associate NCC Officer & Asst. Professor",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      status: "ACTIVE",
      createdAt: "2025-01-12T10:00:00Z"
    },
    {
      id: "u-cadet-1",
      email: "hamza@cadet.ncccentral.org",
      password: "password123",
      fullName: "Hamza Sayyed",
      role: "CADET",
      phone: "+91 99305 25095",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
      status: "ACTIVE",
      createdAt: "2025-02-01T10:00:00Z"
    },
    {
      id: "u-cadet-2",
      email: "jay.gupta@cadet.ncccentral.org",
      password: "password123",
      fullName: "Jay Gupta",
      role: "CADET",
      phone: "+91 98200 88990",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
      status: "ACTIVE",
      createdAt: "2025-02-02T10:00:00Z"
    },
    {
      id: "u-cadet-3",
      email: "priya.sharma@cadet.ncccentral.org",
      password: "password123",
      fullName: "Priya Sharma",
      role: "CADET",
      phone: "+91 98111 22334",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      status: "ACTIVE",
      createdAt: "2025-02-05T10:00:00Z"
    }
  ],
  cadets: [
    {
      id: "cdt-1",
      userId: "u-cadet-1",
      regNo: "MH23SDA56785",
      fullName: "Hamza Sayyed",
      email: "hamza@cadet.ncccentral.org",
      phone: "+91 99305 25095",
      rank: "Senior Under Officer",
      company: "ALPHA COY",
      platoon: "Platoon 1",
      dateJoined: "2023-07-15",
      bloodGroup: "O+",
      status: "ACTIVE",
      dob: "2003-05-14",
      gender: "Male",
      fatherName: "Mohammad Yasin",
      collegeName: "Rizvi College of Arts, Science & Commerce",
      course: "B.Sc Computer Science",
      yearOfStudy: "3rd Year",
      emergencyContactName: "Mohammad Yasin",
      emergencyContactPhone: "+91 98200 11223",
      address: "Bandra West, Mumbai, Maharashtra 400050",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "cdt-2",
      userId: "u-cadet-2",
      regNo: "MH23SDA012345",
      fullName: "Jay Gupta",
      email: "jay.gupta@cadet.ncccentral.org",
      phone: "+91 98200 88990",
      rank: "Sergeant",
      company: "ALPHA COY",
      platoon: "Platoon 1",
      dateJoined: "2023-07-16",
      bloodGroup: "B+",
      status: "ACTIVE",
      dob: "2003-08-20",
      gender: "Male",
      fatherName: "Ramesh Gupta",
      collegeName: "Rizvi College of Arts, Science & Commerce",
      course: "B.Sc Information Technology",
      yearOfStudy: "3rd Year",
      emergencyContactName: "Ramesh Gupta",
      emergencyContactPhone: "+91 98200 99887",
      address: "Khar West, Mumbai, Maharashtra 400052",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "cdt-3",
      userId: "u-cadet-3",
      regNo: "MH23SWA78901",
      fullName: "Priya Sharma",
      email: "priya.sharma@cadet.ncccentral.org",
      phone: "+91 98111 22334",
      rank: "Corporal",
      company: "BRAVO COY",
      platoon: "Platoon 2",
      dateJoined: "2024-07-10",
      bloodGroup: "A+",
      status: "ACTIVE",
      dob: "2004-11-02",
      gender: "Female",
      fatherName: "Sanjay Sharma",
      collegeName: "Rizvi College of Arts, Science & Commerce",
      course: "B.Com",
      yearOfStudy: "2nd Year",
      emergencyContactName: "Sanjay Sharma",
      emergencyContactPhone: "+91 98111 99000",
      address: "Santa Cruz West, Mumbai, Maharashtra 400054",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    }
  ],
  attendance: [
    {
      id: "att-1",
      cadetId: "cdt-1",
      cadetName: "Hamza Sayyed",
      regNo: "MH23SDA56785",
      date: "2026-08-10",
      company: "ALPHA COY",
      platoon: "Platoon 1",
      status: "PRESENT",
      session: "Morning Fallin & Drill Practice",
      remarks: "On time, immaculate uniform"
    },
    {
      id: "att-2",
      cadetId: "cdt-2",
      cadetName: "Jay Gupta",
      regNo: "MH23SDA012345",
      date: "2026-08-10",
      company: "ALPHA COY",
      platoon: "Platoon 1",
      status: "PRESENT",
      session: "Morning Fallin & Drill Practice",
      remarks: "On time"
    },
    {
      id: "att-3",
      cadetId: "cdt-3",
      cadetName: "Priya Sharma",
      regNo: "MH23SWA78901",
      date: "2026-08-10",
      company: "BRAVO COY",
      platoon: "Platoon 2",
      status: "LEAVE",
      session: "Morning Fallin & Drill Practice",
      remarks: "Medical leave approved by ANO"
    }
  ],
  parades: [
    {
      id: "prd-1",
      title: "Independence Day Parade Practice",
      commander: "Capt. Roshan Khobragade",
      company: "ALPHA COY",
      platoon: "All Platoons",
      location: "Main Parade Ground, Rizvi Campus",
      date: "2026-08-14",
      time: "07:00 AM",
      status: "COMPLETED",
      notes: "Full uniform inspection and march past rehearsal."
    },
    {
      id: "prd-2",
      title: "Special Drill Fallin & Inspection",
      commander: "Capt. Roshan Khobragade",
      company: "ALPHA COY",
      platoon: "Platoon 1",
      location: "Quadrangle, Rizvi Campus",
      date: "2026-08-18",
      time: "07:30 AM",
      status: "UPCOMING",
      notes: "Focus on weapon handling postures and squad movement."
    }
  ],
  training: [
    {
      id: "trg-1",
      title: "Advanced Map Reading & Topography",
      category: "Map Reading",
      instructor: "Lt. V. K. Patil",
      date: "2026-08-20",
      time: "08:00 AM - 11:00 AM",
      location: "NCC Training Hall B",
      description: "Prismatic compass navigation, grid reference reading, and ground features identification.",
      status: "SCHEDULED"
    },
    {
      id: "trg-2",
      title: "Obstacle Course & PT Conditioning",
      category: "Physical Training",
      instructor: "Sub. Major Singh",
      date: "2026-08-22",
      time: "06:30 AM - 08:30 AM",
      location: "Obstacle Course Ground",
      description: "10-obstacle timing drills and stamina building.",
      status: "SCHEDULED"
    }
  ],
  events: [
    {
      id: "evt-1",
      title: "Annual Thal Sainik Camp (TSC) Selection Drive",
      category: "Camp",
      date: "2026-08-25",
      time: "08:00 AM",
      location: "HQ 1 MAH Battalion, Kalina",
      capacity: 50,
      eligibility: "Open to 2nd & 3rd Year Cadets",
      description: "Selection trials for shooting, obstacle course, map reading, and judging distance.",
      isUpcoming: true,
      registrations: ["cdt-1", "cdt-2"]
    },
    {
      id: "evt-2",
      title: "Tree Plantation & Swachh Bharat Abhiyan Drive",
      category: "Social Service",
      date: "2026-08-28",
      time: "09:00 AM",
      location: "Bandra Promenade",
      capacity: 100,
      eligibility: "All Cadets",
      description: "Community outreach clean-up and planting 500 saplings.",
      isUpcoming: true,
      registrations: ["cdt-1", "cdt-2", "cdt-3"]
    }
  ],
  achievements: [
    {
      id: "ach-1",
      cadetId: "cdt-1",
      cadetName: "Hamza Sayyed",
      title: "Gold Medal in State Level Shooting Competition",
      category: "Sports / Marksmanship",
      description: "Secured 1st rank in 50m Rifle Prone Shooting event at Maharashtra State NCC Meet.",
      date: "2025-12-15",
      level: "State",
      position: "1st Place (Gold)",
      organization: "Maharashtra NCC Directorate",
      documentUrl: "https://example.com/evidence/shooting_gold.pdf"
    },
    {
      id: "ach-2",
      cadetId: "cdt-2",
      cadetName: "Jay Gupta",
      title: "Best Cadet Award - Republic Day Camp Rehearsals",
      category: "Leadership",
      description: "Awarded Best Cadet in Drill Command & Discipline.",
      date: "2026-01-26",
      level: "Battalion",
      position: "Best Cadet",
      organization: "1 MAH Battalion NCC",
      documentUrl: "https://example.com/evidence/best_cadet.pdf"
    }
  ],
  certificates: [
    {
      id: "crt-1",
      certificateNo: "NCC-CENTRAL-2025-00892",
      cadetId: "cdt-1",
      cadetName: "Hamza Sayyed",
      regNo: "MH23SDA56785",
      rank: "Senior Under Officer",
      courseName: "NCC 'B' Certificate Examination",
      issueDate: "2025-04-10",
      grade: "Alpha (A Grade)",
      status: "ISSUED",
      verified: true
    },
    {
      id: "crt-2",
      certificateNo: "NCC-CENTRAL-2025-00893",
      cadetId: "cdt-2",
      cadetName: "Jay Gupta",
      regNo: "MH23SDA012345",
      rank: "Sergeant",
      courseName: "NCC 'B' Certificate Examination",
      issueDate: "2025-04-10",
      grade: "Alpha (A Grade)",
      status: "ISSUED",
      verified: true
    }
  ],
  announcements: [
    {
      id: "anc-1",
      title: "URGENT: Submission of TSC Camp Application Forms",
      content: "All selected cadets for Thal Sainik Camp must submit hard copies of medical fitness certificates and parent consent forms by 18th August 2026.",
      priority: "URGENT",
      audience: "Cadets",
      publishDate: "2026-08-15",
      author: "Capt. Roshan Khobragade (ANO)"
    },
    {
      id: "anc-2",
      title: "Schedule for Uniform Inspection & Badge Distribution",
      content: "Formal inspection of ceremonials and new rank badges distribution will take place on Saturday at 07:00 AM sharp at the Battalion Ground.",
      priority: "IMPORTANT",
      audience: "All",
      publishDate: "2026-08-12",
      author: "Admin HQ"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      userId: "u-cadet-1",
      title: "New Event Registration Open",
      message: "Registration for Thal Sainik Camp Selection Drive is now active.",
      read: false,
      timestamp: "2026-08-15T09:30:00Z",
      type: "EVENT"
    },
    {
      id: "notif-2",
      userId: "u-cadet-1",
      title: "Certificate Available",
      message: "Your NCC 'B' Certificate is verified and ready for download.",
      read: true,
      timestamp: "2026-08-10T14:00:00Z",
      type: "CERTIFICATE"
    }
  ],
  documents: [
    {
      id: "doc-1",
      name: "NCC_Unit_Standing_Orders_2026.pdf",
      category: "Circular",
      size: "2.4 MB",
      uploadedBy: "Admin",
      uploadDate: "2026-01-05",
      url: "#"
    },
    {
      id: "doc-2",
      name: "Camp_Medical_Fitness_Template.pdf",
      category: "Form",
      size: "450 KB",
      uploadedBy: "Capt. Roshan Khobragade",
      uploadDate: "2026-02-10",
      url: "#"
    }
  ],
  auditLogs: [
    {
      id: "log-1",
      user: "Capt. Roshan Khobragade",
      role: "ANO",
      action: "ATTENDANCE_MARKED",
      resource: "Attendance (2026-08-10)",
      timestamp: "2026-08-10T08:15:00Z",
      details: "Marked attendance for 3 cadets in ALPHA COY"
    },
    {
      id: "log-2",
      user: "Col. Rajesh Verma",
      role: "ADMIN",
      action: "CERTIFICATE_ISSUED",
      resource: "Certificate NCC-CENTRAL-2025-00892",
      timestamp: "2026-08-11T11:00:00Z",
      details: "Verified and approved Grade A certificate for Hamza Sayyed"
    }
  ],
  settings: {
    unitName: "1 MAH BATTALION NCC, MUMBAI - ALPHA COY",
    institutionName: "Rizvi College of Arts, Science & Commerce",
    academicYear: "2026-2027",
    anoInCharge: "Capt. Roshan Khobragade",
    contactEmail: "ano@rizvincc.edu.in",
    contactPhone: "+91 99305 25095",
    allowCadetSelfRegistration: true,
    requireApprovalForRegistration: true
  }
};

import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

const TABLE_MAP = {
  users: 'profiles',
  cadets: 'cadets',
  attendance: 'attendance',
  parades: 'parades',
  training: 'training_modules',
  events: 'events',
  achievements: 'achievements',
  certificates: 'certificates',
  announcements: 'announcements',
  documents: 'documents',
  settings: 'settings',
  auditLogs: 'audit_logs'
};

class DataStore {
  constructor() {
    this.data = this.loadData();
    this.supabaseConnected = false;
    this.initSupabase();
  }

  async initSupabase() {
    if (!supabase) return;
    try {
      // Check if profiles table is accessible
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      if (!error) {
        this.supabaseConnected = true;
        logger.info('[Supabase] Database connected and ready.');
        await this.syncFromSupabase();
      } else {
        logger.warn(`[Supabase] Note: Tables not yet created in Supabase SQL editor (${error.message}). Run database/migrations/001_initial_schema.sql in Supabase SQL Editor.`);
      }
    } catch (err) {
      logger.warn(`[Supabase] Connection check: ${err.message}`);
    }
  }

  async syncFromSupabase() {
    if (!this.supabaseConnected || !supabase) return;
    try {
      for (const [collection, table] of Object.entries(TABLE_MAP)) {
        try {
          const { data, error } = await supabase.from(table).select('*');
          if (!error && data && data.length > 0) {
            this.data[collection] = data;
          }
        } catch (e) {
          // ignore individual table errors
        }
      }
      this.saveData();
      logger.info('[Supabase] Synced collection records from Supabase cloud database.');
    } catch (err) {
      logger.error('[Supabase] Sync error:', err.message);
    }
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.error("Error reading data_store.json, using initial seed data:", err.message);
    }
    this.saveData(initialSeedData);
    return initialSeedData;
  }

  saveData(dataToSave) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error writing to data_store.json:", err.message);
    }
  }

  getCollection(name) {
    return this.data[name] || [];
  }

  setCollection(name, items) {
    this.data[name] = items;
    this.saveData();
  }

  addItem(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    this.data[collectionName].unshift(item);
    this.saveData();

    // Replicate to Supabase if connected
    if (supabase) {
      const table = TABLE_MAP[collectionName];
      if (table) {
        supabase.from(table).insert([item]).then(({ error }) => {
          if (error && error.code !== 'PGRST205') {
            logger.warn(`[Supabase Insert Warning] ${table}: ${error.message}`);
          }
        }).catch(() => {});
      }
    }

    return item;
  }

  updateItem(collectionName, id, updates) {
    const list = this.data[collectionName] || [];
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.saveData();

      // Replicate update to Supabase
      if (supabase) {
        const table = TABLE_MAP[collectionName];
        if (table) {
          supabase.from(table).update(updates).eq('id', id).then(({ error }) => {
            if (error && error.code !== 'PGRST205') {
              logger.warn(`[Supabase Update Warning] ${table}: ${error.message}`);
            }
          }).catch(() => {});
        }
      }

      return list[index];
    }
    return null;
  }

  deleteItem(collectionName, id) {
    const list = this.data[collectionName] || [];
    const filtered = list.filter(i => i.id !== id);
    this.data[collectionName] = filtered;
    this.saveData();

    // Replicate delete to Supabase
    if (supabase) {
      const table = TABLE_MAP[collectionName];
      if (table) {
        supabase.from(table).delete().eq('id', id).then(({ error }) => {
          if (error && error.code !== 'PGRST205') {
            logger.warn(`[Supabase Delete Warning] ${table}: ${error.message}`);
          }
        }).catch(() => {});
      }
    }

    return true;
  }
}

export const dbStore = new DataStore();

