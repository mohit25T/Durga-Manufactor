import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();
  
  return (
    <motion.header 
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full flex flex-col"
    >
      {/* Announcement Bar */}
      <div className="bg-brand-amber text-brand-slateDark text-[11px] md:text-xs font-bold py-2.5 px-4 text-center tracking-widest uppercase border-b border-white/10">
        Free Pan-India Delivery & Demo Support | Call +91 94281 56213
      </div>

      <nav className="bg-brand-slateDark border-b border-white/10 flex justify-between items-center px-6 md:px-12 py-5">
        {/* Logo / Company Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-white hover:text-brand-amber transition-colors duration-300">
            DURGA MANUFACTURES
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-8 font-sans text-xs tracking-widest uppercase items-center">
          {[
            { label: "Home", path: "/" },
            { label: "Products", path: "/products" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
            { label: "Dealer Portal", path: "/dealer/login" }
          ].map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/dealer/login" && location.pathname.startsWith("/dealer"));
            
            return (
              <Link 
                key={item.label} 
                to={item.path}
                className={`relative py-1.5 transition-colors duration-300 font-bold ${isActive ? 'text-brand-amber' : 'text-white/80 hover:text-white'}`}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-amber rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/dealer/login"
            className="border border-brand-amber/40 hover:border-brand-amber text-brand-amber hover:bg-brand-amber/10 px-4 py-3 font-bold font-sans text-[11px] tracking-widest uppercase transition-all duration-300"
          >
            Dealer Login
          </Link>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="tel:+91 94281 56213"
            className="bg-brand-amber hover:bg-white border border-brand-amber hover:border-white text-brand-slateDark px-5 py-3 rounded-none font-bold font-sans text-[11px] tracking-widest uppercase transition-all duration-300"
          >
            Call Now
          </motion.a>
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;