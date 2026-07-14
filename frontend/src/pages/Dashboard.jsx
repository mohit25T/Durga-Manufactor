import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import {
  PackageSearch,
  PackagePlus,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const [stats, setStats] = useState([
    {
      title: "Total Products",
      value: "0",
      icon: PackageSearch,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "New Inquiries",
      value: "0",
      icon: Users,
      color: "text-brand-amber",
      bg: "bg-brand-amber/10",
    },
    {
      title: "Active Categories",
      value: "0",
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Profile Views",
      value: "0",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await API.get("/products");
        const leadsRes = await API.get("/leads");

        const products = productsRes.data.data || [];
        const leads = leadsRes.data.data || [];

        const categories = new Set(products.map((p) => p.category));

        setStats([
          {
            title: "Total Products",
            value: products.length,
            icon: PackageSearch,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            title: "New Inquiries",
            value: leads.length,
            icon: Users,
            color: "text-brand-amber",
            bg: "bg-brand-amber/10",
          },
          {
            title: "Active Categories",
            value: categories.size,
            icon: Activity,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            title: "Profile Views",
            value: "1.2k",
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-brand-slateDark mb-2 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-brand-gray text-sm">
          Welcome back. Here is what's happening today.
        </p>
      </div>

      {/* KPI Stats */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-brand-light rounded-none p-4 shadow-md shadow-brand-slateDark/5 border border-brand-sand flex items-center gap-4 group hover:-translate-y-1 transition-transform"
          >
            <div
              className={`w-12 h-12 rounded-none ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-6 h-6" />
            </div>

            <div>
              <p className="text-brand-gray font-bold text-xs uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-xl font-bold text-brand-slateDark">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}

      <h2 className="text-2xl font-bold text-brand-slateDark mb-6 uppercase tracking-wider text-sm">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/add-product"
          className="group relative overflow-hidden bg-brand-slateDark text-white rounded-none p-6 hover:shadow-xl hover:shadow-brand-slateDark/20 transition-all flex flex-col items-start gap-3"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-amber/20 transition-colors"></div>

          <div className="w-10 h-10 bg-white/10 rounded-none flex items-center justify-center backdrop-blur-md">
            <PackagePlus className="w-5 h-5 text-brand-amber" />
          </div>

          <div>
            <h3 className="text-base font-bold mb-1">Add New Product</h3>
            <p className="text-brand-gray text-xs">
              Create a new machine listing
            </p>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="group relative overflow-hidden bg-brand-light text-brand-slate rounded-none p-6 border border-brand-sand hover:border-brand-amber hover:shadow-xl hover:shadow-brand-amber/10 transition-all flex flex-col items-start gap-3"
        >
          <div className="w-10 h-10 bg-brand-light rounded-none flex items-center justify-center group-hover:bg-brand-amber/10 transition-colors">
            <PackageSearch className="w-5 h-5 text-brand-slateDark" />
          </div>

          <div>
            <h3 className="text-base font-bold mb-1 text-brand-slateDark">
              Manage Inventory
            </h3>
            <p className="text-brand-gray text-xs">
              Edit or delete existing products
            </p>
          </div>
        </Link>

        <Link
          to="/admin/leads"
          className="group relative overflow-hidden bg-brand-light text-brand-slate rounded-none p-6 border border-brand-sand hover:border-brand-amber hover:shadow-xl hover:shadow-brand-amber/10 transition-all flex flex-col items-start gap-3"
        >
          <div className="w-10 h-10 bg-brand-light rounded-none flex items-center justify-center group-hover:bg-brand-amber/10 transition-colors">
            <Users className="w-5 h-5 text-brand-slateDark" />
          </div>

          <div>
            <h3 className="text-base font-bold mb-1 text-brand-slateDark">
              Customer Leads
            </h3>
            <p className="text-brand-gray text-xs">View incoming inquiries</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
