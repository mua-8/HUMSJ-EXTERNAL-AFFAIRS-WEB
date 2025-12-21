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
  category: string;
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
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

// Collection references
const eventsCollection = collection(db, "events");
const registrationsCollection = collection(db, "registrations");
const distributionsCollection = collection(db, "distributions");

// Get all events
export const getEvents = async (): Promise<FirestoreEvent[]> => {
  try {
    const q = query(eventsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreEvent[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Subscribe to events (real-time updates)
export const subscribeToEvents = (
  callback: (events: FirestoreEvent[]) => void
): (() => void) => {
  const q = query(eventsCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreEvent[];
    callback(events);
  }, (error) => {
    console.error("Error subscribing to events:", error);
  });

  return unsubscribe;
};

// Add new event
export const addEvent = async (
  event: Omit<FirestoreEvent, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(eventsCollection, {
      ...event,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

// Update event
export const updateEvent = async (
  id: string,
  updates: Partial<FirestoreEvent>
): Promise<void> => {
  try {
    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, "events", id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Approve event
export const approveEvent = async (id: string): Promise<void> => {
  return updateEvent(id, { status: "approved" });
};

// Reject event
export const rejectEvent = async (id: string): Promise<void> => {
  return updateEvent(id, { status: "rejected" });
};

// --- Registrations ---

// Get all registrations
export const getRegistrations = async (): Promise<FirestoreRegistration[]> => {
  try {
    const q = query(registrationsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreRegistration[];
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
};

// Subscribe to registrations
export const subscribeToRegistrations = (
  callback: (registrations: FirestoreRegistration[]) => void
): (() => void) => {
  const q = query(registrationsCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const registrations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreRegistration[];
    callback(registrations);
  }, (error) => {
    console.error("Error subscribing to registrations:", error);
  });

  return unsubscribe;
};

// Add new registration
export const addRegistration = async (
  registration: Omit<FirestoreRegistration, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(registrationsCollection, {
      ...registration,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding registration:", error);
    throw error;
  }
};

// Update registration
export const updateRegistration = async (
  id: string,
  updates: Partial<FirestoreRegistration>
): Promise<void> => {
  try {
    const regRef = doc(db, "registrations", id);
    await updateDoc(regRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }
};

// Delete registration
export const deleteRegistration = async (id: string): Promise<void> => {
  try {
    const regRef = doc(db, "registrations", id);
    await deleteDoc(regRef);
  } catch (error) {
    console.error("Error deleting registration:", error);
    throw error;
  }
};
// --- Distributions ---

// Distribution interface
export interface FirestoreDistribution {
  id?: string;
  item: string;
  quantity: string | number;
  beneficiaries: string;
  date: string;
  sector: "charity" | "dawa" | "qirat";
  status: "planned" | "in-progress" | "completed";
  cost?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Get all distributions
export const getDistributions = async (): Promise<FirestoreDistribution[]> => {
  try {
    const q = query(distributionsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreDistribution[];
  } catch (error) {
    console.error("Error fetching distributions:", error);
    return [];
  }
};

// Subscribe to distributions
export const subscribeToDistributions = (
  callback: (distributions: FirestoreDistribution[]) => void
): (() => void) => {
  const q = query(distributionsCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const distributions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreDistribution[];
    callback(distributions);
  }, (error) => {
    console.error("Error subscribing to distributions:", error);
  });

  return unsubscribe;
};

// Add new distribution
export const addDistribution = async (
  distribution: Omit<FirestoreDistribution, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(distributionsCollection, {
      ...distribution,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding distribution:", error);
    throw error;
  }
};

// Update distribution
export const updateDistribution = async (
  id: string,
  updates: Partial<FirestoreDistribution>
): Promise<void> => {
  try {
    const distRef = doc(db, "distributions", id);
    await updateDoc(distRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating distribution:", error);
    throw error;
  }
};

// Delete distribution
export const deleteDistribution = async (id: string): Promise<void> => {
  try {
    const distRef = doc(db, "distributions", id);
    await deleteDoc(distRef);
  } catch (error) {
    console.error("Error deleting distribution:", error);
    throw error;
  }
};
