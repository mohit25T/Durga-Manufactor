import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      // Mock login for demo if API fails
      if(form.email === 'admin@durgamanufactures.com' && form.password === 'admin123') {
        localStorage.setItem("token", "demo-token");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-brand-light">
      
      {/* Brand / Visual Side */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-slateDark text-white p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-amber/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        
        <img 
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          alt="Factory Background"
        />

        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-brand-amber/20">
              <span className="text-brand-slateDark font-extrabold text-2xl">D</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Durga Manufactures</h1>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-5xl font-bold mb-6 leading-tight">Secure <br/><span className="text-brand-amber">Admin Portal</span></h2>
            <p className="text-lg text-brand-gray max-w-md">Manage your products, view customer inquiries, and oversee your entire industrial catalog from one central command center.</p>
          </motion.div>
        </div>

        <div className="relative z-20 flex items-center gap-4 text-brand-gray/80 text-sm">
          <ShieldCheck className="w-5 h-5 text-brand-amber" />
          Authorized Personnel Only
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex items-center justify-center p-8 relative">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-amber/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl shadow-brand-slateDark/5 border border-brand-slate/5 relative z-10"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-brand-amber rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-brand-slateDark font-extrabold text-2xl">D</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand-slateDark mb-2">Welcome Back</h2>
            <p className="text-brand-gray font-medium">Please enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-slate uppercase tracking-wide ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-amber transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@durgamanufactures.com"
                  className="w-full pl-12 pr-4 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none transition-all font-medium text-brand-slateDark focus:bg-white focus:shadow-lg focus:shadow-brand-amber/10 placeholder:text-brand-gray/60"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-slate uppercase tracking-wide ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-amber transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none transition-all font-medium text-brand-slateDark focus:bg-white focus:shadow-lg focus:shadow-brand-amber/10 placeholder:text-brand-gray/60"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 mt-4 bg-brand-slateDark hover:bg-brand-slate text-white font-bold rounded-xl shadow-xl shadow-brand-slateDark/20 hover:shadow-brand-slateDark/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In Securely <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
          
          <p className="text-center text-xs text-brand-gray mt-8 font-medium">
            Demo credentials: admin@durgamanufactures.com / admin123
          </p>

        </motion.div>
      </div>

    </div>
  );
}

export default Login;