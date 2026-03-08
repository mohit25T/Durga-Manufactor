import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Calendar, Search, Inbox, Hash } from "lucide-react";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await API.get("/leads");
        setLeads(res.data.data);
      } catch (error) {
        console.log(error);
        // Fallback for visual demo
        setLeads([
          { _id: "1", name: "Rajesh Kumar", phone: "+91 9876543210", email: "rajesh@foodcorp.in", message: "Interested in the 500kg potato slicer for my chips factory.", createdAt: "2026-03-06T10:30:00.000Z" },
          { _id: "2", name: "Suresh Gupta", phone: "+91 9988776655", email: "suresh123@gmail.com", message: "Can you provide pricing for the commercial pulverizer?", createdAt: "2026-03-05T14:15:00.000Z" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-brand-slateDark tracking-tight mb-2">Customer Inquiries</h1>
          <p className="text-brand-gray text-lg">Manage and respond to machinery quotations and questions.</p>
        </div>
        
        {/* Search Bar placeholder */}
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray">
            <Search className="h-5 w-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-black/5 rounded-xl shadow-sm outline-none focus:border-brand-amber focus:ring-4 focus:ring-brand-amber/10 transition-all font-medium text-brand-slateDark"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-black/5">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-amber"></div>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-6 text-brand-gray">
            <Inbox className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-brand-slateDark mb-2">No Inquiries Yet</h3>
          <p className="text-brand-gray">Customer leads from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {leads.map((lead, index) => (
              <motion.div
                key={lead._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-black/5 hover:border-brand-amber/50 transition-all flex flex-col relative group"
              >
                {/* ID Tag */}
                <div className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1 bg-brand-light text-brand-gray rounded-full text-xs font-bold uppercase">
                  <Hash className="w-3 h-3" />
                  {lead._id.slice(-6)}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-slateDark to-brand-slate text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-brand-slateDark/20">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-slateDark">{lead.name}</h3>
                    <p className="text-sm text-brand-gray flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(lead.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {lead.phone && (
                    <div className="flex items-center gap-3 text-brand-slate font-medium">
                      <div className="w-8 h-8 rounded-lg bg-brand-amber/10 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-brand-amber" />
                      </div>
                      {lead.phone}
                    </div>
                  )}
                  {lead.email && (
                    <div className="flex items-center gap-3 text-brand-slate font-medium">
                      <div className="w-8 h-8 rounded-lg bg-brand-amber/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-brand-amber" />
                      </div>
                      <a href={`mailto:${lead.email}`} className="hover:text-brand-amber underline decoration-transparent hover:decoration-brand-amber transition-colors break-all">
                        {lead.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-brand-light p-5 rounded-2xl relative">
                   <div className="absolute top-0 left-5 -translate-y-1/2 w-4 h-4 bg-brand-light rotate-45 transform origin-center"></div>
                  <p className="text-brand-slateDark italic text-sm leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </AdminLayout>
  );
}

export default Leads;