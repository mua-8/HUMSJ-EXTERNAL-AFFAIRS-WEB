import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// Donation interface
export interface Donation {
  id?: string;
  fullName: string;
  phone: string;
  idNumber: string;
  department: string;
  year: string;
  amount: number;
  paymentMethod: string;
  startMonth: string;
  idea?: string;
  status: "pending" | "confirmed" | "rejected";
  donationType: "student_sadaqah" | "star_shining" | "general";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Star-Shining Member interface
export interface StarShiningMember {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  graduationYear: string;
  currentJob: string;
  location: string;
  monthlyPledge: number;
  status: "active" | "inactive";
  createdAt?: Timestamp;
}

// Collection references
const donationsCollection = collection(db, "donations");
const starShiningCollection = collection(db, "starShiningMembers");

// Subscribe to donations
export const subscribeToDonations = (
  callback: (donations: Donation[]) => void,
  donationType?: string
): (() => void) => {
  let q = query(donationsCollection, orderBy("createdAt", "desc"));
  
  if (donationType) {
    q = query(
      donationsCollection,
      where("donationType", "==", donationType),
      orderBy("createdAt", "desc")
    );
  }

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Donation[];
    callback(donations);
  });

  return unsubscribe;
};

// Add donation
export const addDonation = async (
  donation: Omit<Donation, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const docRef = await addDoc(donationsCollection, {
    ...donation,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// Update donation status
export const updateDonationStatus = async (
  id: string,
  status: Donation["status"]
): Promise<void> => {
  const donationRef = doc(db, "donations", id);
  await updateDoc(donationRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

// Delete donation
export const deleteDonation = async (id: string): Promise<void> => {
  const donationRef = doc(db, "donations", id);
  await deleteDoc(donationRef);
};

// Get donation stats
export const getDonationStats = async (): Promise<{
  total: number;
  confirmed: number;
  pending: number;
  totalAmount: number;
}> => {
  const snapshot = await getDocs(donationsCollection);
  const donations = snapshot.docs.map((doc) => doc.data() as Donation);
  
  return {
    total: donations.length,
    confirmed: donations.filter((d) => d.status === "confirmed").length,
    pending: donations.filter((d) => d.status === "pending").length,
    totalAmount: donations
      .filter((d) => d.status === "confirmed")
      .reduce((sum, d) => sum + d.amount, 0),
  };
};

// Star-Shining functions
export const subscribeToStarShining = (
  callback: (members: StarShiningMember[]) => void
): (() => void) => {
  const q = query(starShiningCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as StarShiningMember[];
    callback(members);
  });

  return unsubscribe;
};

export const addStarShiningMember = async (
  member: Omit<StarShiningMember, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(starShiningCollection, {
    ...member,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};
