import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../services/api";
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
        <h1 className="text-4xl font-extrabold text-brand-slateDark mb-2 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-brand-gray text-lg">
          Welcome back. Here is what's happening today.
        </p>
      </div>

      {/* KPI Stats */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-brand-slateDark/5 border border-black/5 flex items-center gap-6 group hover:-translate-y-1 transition-transform"
          >
            <div
              className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className="w-8 h-8" />
            </div>

            <div>
              <p className="text-brand-gray font-bold text-sm uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-extrabold text-brand-slateDark">
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
          className="group relative overflow-hidden bg-brand-slateDark text-white rounded-3xl p-8 hover:shadow-2xl hover:shadow-brand-slateDark/20 transition-all flex flex-col items-start gap-4"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-amber/20 transition-colors"></div>

          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <PackagePlus className="w-7 h-7 text-brand-amber" />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-1">Add New Product</h3>
            <p className="text-brand-gray text-sm">
              Create a new machine listing
            </p>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="group relative overflow-hidden bg-white text-brand-slate rounded-3xl p-8 border border-black/5 hover:border-brand-amber hover:shadow-2xl hover:shadow-brand-amber/10 transition-all flex flex-col items-start gap-4"
        >
          <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center group-hover:bg-brand-amber/10 transition-colors">
            <PackageSearch className="w-7 h-7 text-brand-slateDark" />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-1 text-brand-slateDark">
              Manage Inventory
            </h3>
            <p className="text-brand-gray text-sm">
              Edit or delete existing products
            </p>
          </div>
        </Link>

        <Link
          to="/admin/leads"
          className="group relative overflow-hidden bg-white text-brand-slate rounded-3xl p-8 border border-black/5 hover:border-brand-amber hover:shadow-2xl hover:shadow-brand-amber/10 transition-all flex flex-col items-start gap-4"
        >
          <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center group-hover:bg-brand-amber/10 transition-colors">
            <Users className="w-7 h-7 text-brand-slateDark" />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-1 text-brand-slateDark">
              Customer Leads
            </h3>
            <p className="text-brand-gray text-sm">View incoming inquiries</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
