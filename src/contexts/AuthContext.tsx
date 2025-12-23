import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// User roles
export type UserRole = "super_admin" | "charity_amir" | "academic_amir" | "qirat_amir" | "dawa_amir" | "user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  role: UserRole;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Role mapping by email
const getRoleByEmail = (email: string | null): UserRole => {
  if (!email) return "user";

  const roleMap: Record<string, UserRole> = {
    "admin@humsj.org": "super_admin",
    "superadmin@humsj.org": "super_admin",
    "charity@humsj.org": "charity_amir",
    "academic@humsj.org": "academic_amir",
    "qirat@humsj.org": "qirat_amir",
    "dawa@humsj.org": "dawa_amir",
  };

  return roleMap[email.toLowerCase()] || "user"; // Default to user, not super_admin
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<UserRole>("user");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const userRole = getRoleByEmail(user.email);
        setRole(userRole);
        setIsAdmin(userRole !== "user");
      } else {
        setIsAdmin(false);
        setRole("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear any dev authentication bypass
      localStorage.removeItem("devAuth");

      setUser(null);
      setIsAdmin(false);
      setRole("user");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    role,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
