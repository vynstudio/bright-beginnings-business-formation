import { ReactNode } from "react";
import { Cancel01Icon } from "hugeicons-react";

interface AdminSheetHeaderProps {
  onClose: () => void;
  children: ReactNode;
}

const AdminSheetHeader = ({ onClose, children }: AdminSheetHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-shrink-0 py-3 px-6 bg-background border-b border-border">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="p-2 rounded-md hover:bg-muted transition-colors"
      >
        <Cancel01Icon className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};

export default AdminSheetHeader;
