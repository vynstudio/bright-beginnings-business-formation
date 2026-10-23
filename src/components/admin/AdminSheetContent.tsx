import { ReactNode } from "react";

interface AdminSheetContentProps {
  children: ReactNode;
}

const AdminSheetContent = ({ children }: AdminSheetContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      {children}
    </div>
  );
};

export default AdminSheetContent;
