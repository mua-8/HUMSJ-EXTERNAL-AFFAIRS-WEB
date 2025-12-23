import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// Event interface
export interface FirestoreEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  venue?: string;
  type?: string;
  speaker?: string;
  category: string;
  sector?: "academic" | "qirat" | "charity" | "dawa";
  submittedBy?: string;
  status: "pending" | "approved" | "rejected" | "upcoming" | "ongoing" | "completed";
  expectedParticipants?: number;
  actualParticipants?: number;
  image?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Registration interface
export interface FirestoreRegistration {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  type: "student" | "teacher" | "donor" | "volunteer";
  sector: "qirat" | "charity" | "dawa";
  department?: string;
  year?: string;
  program?: string;
  experience?: string;
  interest?: string;
  amount?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Student interface (Universal for all sectors)
export interface FirestoreStudent {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  sector: "academic" | "qirat" | "dawa";
  program: string; // Course name or circle name
  level?: string;
  instructor?: string;
  progress?: number;
  juzCompleted?: number;
  role?: string;
  enrollmentDate: string;
  status: "active" | "graduated" | "on_hold" | "inactive" | "pending" | "approved" | "rejected";
  year?: string;
  department?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Program interface (Academic/Qirat courses)
export interface FirestoreProgram {
  id?: string;
  name: string;
  instructor: string;
  sector: "academic" | "qirat" | "dawa";
  type: string;
  status: "active" | "completed" | "upcoming";
  students: number;
  day?: string;
  time?: string;
  description: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Resource interface (Learning materials)
export interface FirestoreResource {
  id?: string;
  title: string;
  type: "audio" | "video" | "document" | "book";
  category: string;
  sector: "academic" | "qirat" | "dawa";
  downloads: number;
  link?: string;
  uploadDate: string;
  createdAt?: Timestamp;
}

// Competition interface (Qirat specific)
export interface FirestoreCompetition {
  id?: string;
  title: string;
  date: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
  prize: string;
  category: string;
  createdAt?: Timestamp;
}

// New Muslim interface (Dawa specific)
export interface FirestoreNewMuslim {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  shahadaDate: string;
  mentor: string;
  progress: number;
  coursesCompleted: string[];
  status: "active" | "graduated" | "needs_support";
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection references
const eventsCollection = collection(db, "events");
const registrationsCollection = collection(db, "registrations");
const distributionsCollection = collection(db, "distributions");
const studentsCollection = collection(db, "students");
const programsCollection = collection(db, "programs");
const resourcesCollection = collection(db, "resources");
const competitionsCollection = collection(db, "competitions");
const newMuslimsCollection = collection(db, "newMuslims");

// --- Utility Generic Function for simple CRUD ---
const subscribeToCollection = <T>(
  collRef: any,
  callback: (data: T[]) => void
) => {
  const q = query(collRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as T[]);
  });
};

// --- Events ---
export const getEvents = async (): Promise<FirestoreEvent[]> => {
  const q = query(eventsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as FirestoreEvent[];
};

export const subscribeToEvents = (callback: (events: FirestoreEvent[]) => void) =>
  subscribeToCollection<FirestoreEvent>(eventsCollection, callback);

export const addEvent = async (event: Omit<FirestoreEvent, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(eventsCollection, { ...(event as any), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return docRef.id;
};

export const updateEvent = async (id: string, updates: Partial<FirestoreEvent>) => {
  await updateDoc(doc(db, "events", id), { ...updates, updatedAt: Timestamp.now() });
};

export const deleteEvent = async (id: string) => await deleteDoc(doc(db, "events", id));
export const approveEvent = async (id: string) => updateEvent(id, { status: "approved" });
export const rejectEvent = async (id: string) => updateEvent(id, { status: "rejected" });

// --- Registrations ---
export const subscribeToRegistrations = (callback: (registrations: FirestoreRegistration[]) => void) =>
  subscribeToCollection<FirestoreRegistration>(registrationsCollection, callback);

export const addRegistration = async (registration: Omit<FirestoreRegistration, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(registrationsCollection, { ...(registration as any), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return docRef.id;
};

export const updateRegistration = async (id: string, updates: Partial<FirestoreRegistration>) => {
  await updateDoc(doc(db, "registrations", id), { ...updates, updatedAt: Timestamp.now() });
};

export const deleteRegistration = async (id: string) => await deleteDoc(doc(db, "registrations", id));

// --- Students ---
export const subscribeToStudents = (callback: (students: FirestoreStudent[]) => void) =>
  subscribeToCollection<FirestoreStudent>(studentsCollection, callback);

export const addStudent = async (student: Omit<FirestoreStudent, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(studentsCollection, { ...(student as any), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return docRef.id;
};

export const updateStudent = async (id: string, updates: Partial<FirestoreStudent>) => {
  await updateDoc(doc(db, "students", id), { ...updates, updatedAt: Timestamp.now() });
};

export const deleteStudent = async (id: string) => await deleteDoc(doc(db, "students", id));

// --- Programs ---
export const subscribeToPrograms = (callback: (programs: FirestoreProgram[]) => void) =>
  subscribeToCollection<FirestoreProgram>(programsCollection, callback);

export const addProgram = async (program: Omit<FirestoreProgram, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(programsCollection, { ...(program as any), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return docRef.id;
};

export const updateProgram = async (id: string, updates: Partial<FirestoreProgram>) => {
  await updateDoc(doc(db, "programs", id), { ...updates, updatedAt: Timestamp.now() });
};

export const deleteProgram = async (id: string) => await deleteDoc(doc(db, "programs", id));

// --- Resources ---
export const subscribeToResources = (callback: (resources: FirestoreResource[]) => void) =>
  subscribeToCollection<FirestoreResource>(resourcesCollection, callback);

export const addResource = async (resource: Omit<FirestoreResource, "id" | "createdAt">) => {
  const docRef = await addDoc(resourcesCollection, { ...(resource as any), createdAt: Timestamp.now() });
  return docRef.id;
};

export const updateResource = async (id: string, updates: Partial<FirestoreResource>) => {
  await updateDoc(doc(db, "resources", id), { ...updates });
};

export const deleteResource = async (id: string) => await deleteDoc(doc(db, "resources", id));

// --- Competitions ---
export const subscribeToCompetitions = (callback: (competitions: FirestoreCompetition[]) => void) =>
  subscribeToCollection<FirestoreCompetition>(competitionsCollection, callback);

export const addCompetition = async (comp: Omit<FirestoreCompetition, "id" | "createdAt">) => {
  const docRef = await addDoc(competitionsCollection, { ...(comp as any), createdAt: Timestamp.now() });
  return docRef.id;
};

export const deleteCompetition = async (id: string) => await deleteDoc(doc(db, "competitions", id));

export const updateCompetition = async (id: string, updates: Partial<FirestoreCompetition>) => {
  await updateDoc(doc(db, "competitions", id), { ...updates });
};

// --- Distributions ---
export interface FirestoreDistribution {
  id?: string;
  title: string;
  description: string;
  date: string;
  items: string[];
  beneficiaries: number;
  status: "planned" | "ongoing" | "completed";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const subscribeToDistributions = (callback: (distributions: FirestoreDistribution[]) => void) =>
  subscribeToCollection<FirestoreDistribution>(distributionsCollection, callback);

export const addDistribution = async (dist: Omit<FirestoreDistribution, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(distributionsCollection, { ...(dist as any), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return docRef.id;
};

export const updateDistribution = async (id: string, updates: Partial<FirestoreDistribution>) => {
  await updateDoc(doc(db, "distributions", id), { ...updates, updatedAt: Timestamp.now() });
};

export const deleteDistribution = async (id: string) => await deleteDoc(doc(db, "distributions", id));

// --- New Muslims ---
export const subscribeToNewMuslims = (callback: (data: FirestoreNewMuslim[]) => void) =>
  subscribeToCollection<FirestoreNewMuslim>(newMuslimsCollection, callback);

export const addNewMuslim = async (data: Omit<FirestoreNewMuslim, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(newMuslimsCollection, { ...(data as any), createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return docRef.id;
};

export const deleteNewMuslim = async (id: string) => await deleteDoc(doc(db, "newMuslims", id));
