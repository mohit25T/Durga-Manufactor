import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import * as Icons from "lucide-react";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar Component */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-brand-slateDark text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-brand-amber/20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-amber rounded-lg flex items-center justify-center">
                <span className="text-brand-slateDark font-extrabold text-sm">D</span>
              </div>
             <span className="font-bold">Admin Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <Icons.Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
