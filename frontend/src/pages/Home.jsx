import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden flex-grow bg-grid-pattern">
        {/* Background Gradients - High Contrast Red and Black */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-brand-red/10 via-brand-red/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-brand-black/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-16 relative z-10">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-black/5 border border-brand-black/10 text-brand-black font-semibold text-sm mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse shadow-[0_0_8px_rgba(230,35,37,0.8)]"></span>
              Leading Manufacturer in India
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-black leading-tight mb-6 tracking-tight">
              Commercial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-redHover drop-shadow-sm">
                Food Processing
              </span>
              <br />
              Machinery
            </h1>

            <p className="text-xl text-brand-gray mb-10 max-w-lg leading-relaxed font-medium">
              Engineered for absolute precision and maximum durability. We
              manufacture high-capacity vegetable cutters, potato slicers, and
              heavy-duty flour mills for commercial kitchens and industries.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/products"
                className="group relative inline-flex items-center gap-2 bg-brand-black text-white px-8 py-4 rounded-xl font-bold overflow-hidden shadow-2xl shadow-brand-black/30 hover:shadow-brand-red/20 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Machines{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 ease-out group-hover:scale-100 group-hover:bg-brand-red"></div>
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-brand-black border-2 border-brand-black/10 hover:border-brand-red hover:text-brand-redHover hover:bg-white hover:shadow-xl hover:shadow-brand-red/10 transition-all duration-300"
              >
                Request Quote
              </Link>
            </div>

            {/* Stats/Features Mini */}
            <div className="mt-14 grid grid-cols-2 gap-8 pt-8 border-t border-brand-black/10">
              <motion.div
                whileHover={{ y: -5 }}
                className="flex gap-4 items-start p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-brand-red/10"
              >
                <div className="bg-brand-red/10 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-brand-red shrink-0" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-black text-lg">
                    15+ Years
                  </h4>
                  <p className="text-sm text-brand-gray font-medium">
                    Manufacturing Excellence
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="flex gap-4 items-start p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-brand-red/10"
              >
                <div className="bg-brand-red/10 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-brand-red shrink-0" />
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-black text-lg">
                    Pan India
                  </h4>
                  <p className="text-sm text-brand-gray font-medium">
                    Delivery & Support
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Decorative frame - Sharp Red Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-brand-red/40 via-brand-red/10 to-transparent rounded-[2rem] transform rotate-2 blur-xl opacity-70"></div>
            <div className="absolute -inset-4 bg-gradient-to-bl from-brand-black/20 to-transparent rounded-[2rem] transform -rotate-2 blur-lg opacity-50"></div>

            <div className="relative glass-dark rounded-3xl p-3 overflow-hidden shadow-2xl group">
              <div className="relative overflow-hidden rounded-2xl bg-brand-black">
                <img
                  src="https://www.azom.com/images/Article_Thumbs/ThumbForArticle_2867_16010306047694886.png"
                  alt="Industrial Machine"
                  className="w-full h-[550px] object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 mix-blend-luminosity hover:mix-blend-normal"
                />
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute bottom-12 -left-8 glass px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-brand-red/20 backdrop-blur-xl"
              >
                <div className="w-14 h-14 bg-brand-black rounded-xl flex items-center justify-center text-2xl shadow-inner border border-brand-red/30 relative overflow-hidden">
                  <span className="relative z-10 text-white">⚙️</span>
                  <div className="absolute inset-0 bg-brand-red/20 animate-pulse"></div>
                </div>
                <div>
                  <p className="font-extrabold text-brand-black text-lg tracking-tight">
                    Heavy Duty
                  </p>
                  <p className="text-xs text-brand-red font-bold uppercase tracking-wider">
                    304 Grade Stainless
                  </p>
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
