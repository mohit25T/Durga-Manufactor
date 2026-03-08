import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden flex-grow bg-grid-pattern">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-amber/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-amber/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-16 relative z-10">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-slate/5 border border-brand-slate/10 text-brand-slate font-medium text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse"></span>
              Leading Manufacturer in India
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-slateDark leading-tight mb-6 tracking-tight">
              Industrial <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-amberHover drop-shadow-sm">Food Processing</span><br/>
              Machinery
            </h1>
            
            <p className="text-lg text-brand-gray mb-10 max-w-lg leading-relaxed">
              Engineered for absolute precision and maximum durability. We manufacture high-capacity vegetable cutters, potato slicers, and heavy-duty flour mills for commercial kitchens and industries.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-2 bg-brand-slateDark text-white px-8 py-4 rounded-xl font-bold overflow-hidden shadow-xl shadow-brand-slateDark/20 hover:shadow-brand-slateDark/40 transition-shadow"
              >
                <span className="relative z-10 flex items-center gap-2">Explore Machines <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 ease-out group-hover:scale-100 group-hover:bg-brand-amber"></div>
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-brand-slateDark border-2 border-brand-slate/10 hover:border-brand-amber hover:bg-white hover:shadow-lg transition-all"
              >
                Request Quote
              </Link>
            </div>
            
            {/* Stats/Features Mini */}
            <div className="mt-12 grid grid-cols-2 gap-6 pt-8 border-t border-brand-slate/10">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-6 h-6 text-brand-amber mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-brand-slateDark">15+ Years</h4>
                  <p className="text-sm text-brand-gray">Manufacturing Excellence</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-6 h-6 text-brand-amber mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-brand-slateDark">Pan India</h4>
                  <p className="text-sm text-brand-gray">Delivery & Support</p>
                </div>
              </div>
            </div>
            
          </motion.div>
          
          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-amber/20 to-transparent rounded-[2rem] transform rotate-3 blur-lg"></div>
            
            <div className="relative glass-dark rounded-3xl p-4 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091870627-3f1c7f1a06c1?q=80&w=1000&auto=format&fit=crop"
                alt="Industrial Machine"
                className="w-full h-[500px] object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105"
              />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-10 -left-6 glass px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 border border-white/40"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-inner border border-gray-100">
                  ⚙️
                </div>
                <div>
                  <p className="font-bold text-brand-slateDark">Heavy Duty</p>
                  <p className="text-xs text-brand-slate font-medium">304 Grade Stainless Steel</p>
                </div>
              </motion.div>
            </div>
            
          </motion.div>
          
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;