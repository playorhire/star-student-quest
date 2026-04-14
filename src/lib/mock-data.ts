export type Role = "admin" | "teacher" | "student";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  qrCode: string;
  totalPoints: number;
  avatarEmoji: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  assignedClasses: string[];
  assignedSubjects: string[];
}

export interface ClassInfo {
  id: string;
  name: string;
  sections: string[];
}

export interface Subject {
  id: string;
  name: string;
  className: string;
  passingMarks: number;
  multiplier: number;
}

export interface PointTransaction {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  marksEntered: number;
  passingMarks: number;
  multiplier: number;
  pointsAwarded: number;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requiredPoints: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pointCost: number;
  stock: number;
  category: string;
}

export interface Redemption {
  id: string;
  studentId: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  status: "pending" | "fulfilled";
  timestamp: string;
}

// --- Mutable store (simulates DB) ---

export const classes: ClassInfo[] = [
  { id: "c1", name: "10A", sections: ["A"] },
  { id: "c2", name: "10B", sections: ["B"] },
  { id: "c3", name: "9A", sections: ["A"] },
];

export const students: Student[] = [
  { id: "s1", name: "Aarav Sharma", rollNumber: "101", className: "10A", section: "A", qrCode: "STU-s1-101", totalPoints: 450, avatarEmoji: "🧑‍🎓" },
  { id: "s2", name: "Priya Patel", rollNumber: "102", className: "10A", section: "A", qrCode: "STU-s2-102", totalPoints: 620, avatarEmoji: "👩‍🎓" },
  { id: "s3", name: "Ravi Kumar", rollNumber: "103", className: "10A", section: "A", qrCode: "STU-s3-103", totalPoints: 380, avatarEmoji: "🧑‍💻" },
  { id: "s4", name: "Sneha Gupta", rollNumber: "201", className: "10B", section: "B", qrCode: "STU-s4-201", totalPoints: 510, avatarEmoji: "👩‍🔬" },
  { id: "s5", name: "Arjun Singh", rollNumber: "202", className: "10B", section: "B", qrCode: "STU-s5-202", totalPoints: 290, avatarEmoji: "🏅" },
];

export const teachers: Teacher[] = [
  { id: "t1", name: "Mrs. Deepa Nair", email: "deepa@school.edu", assignedClasses: ["10A", "10B"], assignedSubjects: ["Mathematics", "Science"] },
  { id: "t2", name: "Mr. Rajesh Verma", email: "rajesh@school.edu", assignedClasses: ["10A"], assignedSubjects: ["English", "History"] },
];

export const subjects: Subject[] = [
  { id: "sub1", name: "Mathematics", className: "10A", passingMarks: 35, multiplier: 2 },
  { id: "sub2", name: "Science", className: "10A", passingMarks: 35, multiplier: 2 },
  { id: "sub3", name: "English", className: "10A", passingMarks: 40, multiplier: 1.5 },
  { id: "sub4", name: "History", className: "10A", passingMarks: 35, multiplier: 1 },
  { id: "sub5", name: "Mathematics", className: "10B", passingMarks: 35, multiplier: 2 },
];

export const transactions: PointTransaction[] = [
  { id: "tx1", studentId: "s1", studentName: "Aarav Sharma", teacherId: "t1", teacherName: "Mrs. Deepa Nair", subjectId: "sub1", subjectName: "Mathematics", marksEntered: 85, passingMarks: 35, multiplier: 2, pointsAwarded: 100, timestamp: "2026-04-14T09:30:00Z" },
  { id: "tx2", studentId: "s2", studentName: "Priya Patel", teacherId: "t1", teacherName: "Mrs. Deepa Nair", subjectId: "sub2", subjectName: "Science", marksEntered: 92, passingMarks: 35, multiplier: 2, pointsAwarded: 114, timestamp: "2026-04-14T10:15:00Z" },
  { id: "tx3", studentId: "s1", studentName: "Aarav Sharma", teacherId: "t2", teacherName: "Mr. Rajesh Verma", subjectId: "sub3", subjectName: "English", marksEntered: 78, passingMarks: 40, multiplier: 1.5, pointsAwarded: 57, timestamp: "2026-04-13T14:00:00Z" },
  { id: "tx4", studentId: "s3", studentName: "Ravi Kumar", teacherId: "t1", teacherName: "Mrs. Deepa Nair", subjectId: "sub1", subjectName: "Mathematics", marksEntered: 60, passingMarks: 35, multiplier: 2, pointsAwarded: 50, timestamp: "2026-04-13T11:00:00Z" },
  { id: "tx5", studentId: "s4", studentName: "Sneha Gupta", teacherId: "t1", teacherName: "Mrs. Deepa Nair", subjectId: "sub5", subjectName: "Mathematics", marksEntered: 95, passingMarks: 35, multiplier: 2, pointsAwarded: 120, timestamp: "2026-04-12T09:00:00Z" },
];

export const badges: Badge[] = [
  { id: "b1", name: "Rising Star", description: "Earn your first 100 points", emoji: "⭐", requiredPoints: 100 },
  { id: "b2", name: "Scholar", description: "Earn 250 points", emoji: "📚", requiredPoints: 250 },
  { id: "b3", name: "Achiever", description: "Earn 500 points", emoji: "🏆", requiredPoints: 500 },
  { id: "b4", name: "Champion", description: "Earn 750 points", emoji: "👑", requiredPoints: 750 },
  { id: "b5", name: "Legend", description: "Earn 1000 points", emoji: "🌟", requiredPoints: 1000 },
];

export const rewards: Reward[] = [
  { id: "r1", name: "Extra Recess", description: "30 minutes extra recess time", emoji: "🎮", pointCost: 100, stock: 10, category: "Privileges" },
  { id: "r2", name: "Homework Pass", description: "Skip one homework assignment", emoji: "📝", pointCost: 150, stock: 5, category: "Privileges" },
  { id: "r3", name: "Sticker Pack", description: "Cool holographic sticker pack", emoji: "✨", pointCost: 50, stock: 20, category: "Items" },
  { id: "r4", name: "Notebook Set", description: "Premium notebook set", emoji: "📓", pointCost: 200, stock: 8, category: "Items" },
  { id: "r5", name: "Lunch with Teacher", description: "Special lunch with your favorite teacher", emoji: "🍕", pointCost: 300, stock: 3, category: "Experiences" },
  { id: "r6", name: "Class DJ", description: "Choose music during free period", emoji: "🎵", pointCost: 250, stock: 2, category: "Privileges" },
];

export const redemptions: Redemption[] = [
  { id: "red1", studentId: "s2", rewardId: "r3", rewardName: "Sticker Pack", pointsSpent: 50, status: "fulfilled", timestamp: "2026-04-10T12:00:00Z" },
  { id: "red2", studentId: "s1", rewardId: "r1", rewardName: "Extra Recess", pointsSpent: 100, status: "pending", timestamp: "2026-04-13T15:00:00Z" },
];

// --- Helper functions ---

export function findStudentByQR(qrCode: string): Student | undefined {
  return students.find(s => s.qrCode === qrCode);
}

export function calculatePoints(marks: number, passingMarks: number, multiplier: number): number {
  if (marks < passingMarks) return 0;
  return Math.floor((marks - passingMarks) * multiplier);
}

export function getStudentBadges(totalPoints: number): Badge[] {
  return badges.filter(b => totalPoints >= b.requiredPoints);
}

export function getNextBadge(totalPoints: number): Badge | undefined {
  return badges.find(b => totalPoints < b.requiredPoints);
}

export function getLeaderboard(): Student[] {
  return [...students].sort((a, b) => b.totalPoints - a.totalPoints);
}

// --- Mutation helpers (simulate DB writes) ---

let nextId = 100;
function genId(prefix: string) { return `${prefix}${nextId++}`; }

export function addClass(name: string, sectionsList: string[]): ClassInfo {
  const c: ClassInfo = { id: genId("c"), name, sections: sectionsList };
  classes.push(c);
  return c;
}

export function removeClass(id: string) {
  const idx = classes.findIndex(c => c.id === id);
  if (idx >= 0) classes.splice(idx, 1);
}

export function addSubject(name: string, className: string, passingMarks: number, multiplier: number): Subject {
  const s: Subject = { id: genId("sub"), name, className, passingMarks, multiplier };
  subjects.push(s);
  return s;
}

export function updateSubject(id: string, updates: Partial<Pick<Subject, "passingMarks" | "multiplier">>) {
  const s = subjects.find(x => x.id === id);
  if (s) Object.assign(s, updates);
}

export function removeSubject(id: string) {
  const idx = subjects.findIndex(s => s.id === id);
  if (idx >= 0) subjects.splice(idx, 1);
}

export function addStudent(name: string, rollNumber: string, className: string, section: string): Student {
  const id = genId("s");
  const s: Student = { id, name, rollNumber, className, section, qrCode: `STU-${id}-${rollNumber}`, totalPoints: 0, avatarEmoji: "🧑‍🎓" };
  students.push(s);
  return s;
}

export function removeStudent(id: string) {
  const idx = students.findIndex(s => s.id === id);
  if (idx >= 0) students.splice(idx, 1);
}

export function addTeacher(name: string, email: string, assignedClasses: string[], assignedSubjects: string[]): Teacher {
  const t: Teacher = { id: genId("t"), name, email, assignedClasses, assignedSubjects };
  teachers.push(t);
  return t;
}

export function removeTeacher(id: string) {
  const idx = teachers.findIndex(t => t.id === id);
  if (idx >= 0) teachers.splice(idx, 1);
}
