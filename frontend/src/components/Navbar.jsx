import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 glass flex justify-between items-center px-6 md:px-10 py-4 transition-all duration-300"
    >
      {/* Logo / Company Name */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-brand-slateDark group-hover:bg-brand-amber transition-colors rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-brand-amber group-hover:text-brand-slateDark font-bold text-xl transition-colors">D</span>
        </div>
        <h1 className="text-2xl font-extrabold text-brand-slate tracking-tight">
          Durga <span className="text-brand-amber text-lg align-top">•</span>
        </h1>
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex gap-8 text-brand-slate font-medium items-center">
        {['Home', 'Products', 'About', 'Contact'].map((item) => {
          const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
          const isActive = location.pathname === path;
          
          return (
            <Link 
              key={item} 
              to={path}
              className={`relative py-2 transition-colors hover:text-brand-amber ${isActive ? 'text-brand-amber' : ''}`}
            >
              {item}
              {isActive && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-amber rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* Call Button */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="tel:+919999999999"
        className="bg-brand-amber hover:bg-brand-amberHover text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-brand-amber/30 transition-all hidden sm:block"
      >
        Call Now
      </motion.a>
    </motion.nav>
  );
}

export default Navbar;