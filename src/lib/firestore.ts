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

// Collection reference
const eventsCollection = collection(db, "events");

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
