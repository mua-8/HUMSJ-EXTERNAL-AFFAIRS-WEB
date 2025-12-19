import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default AdminLayout;
