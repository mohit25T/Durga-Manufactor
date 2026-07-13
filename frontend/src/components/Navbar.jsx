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
        Free Pan-India Delivery & Demo Support | Call +91 98258 70821
      </div>

      <nav className="bg-brand-slateDark border-b border-white/10 flex justify-between items-center px-6 md:px-12 py-5">
        {/* Logo / Company Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-white hover:text-brand-amber transition-colors duration-300">
            DURGA MANUFACTURES
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-10 font-sans text-xs tracking-widest uppercase items-center">
          {['Home', 'Products', 'About', 'Contact'].map((item) => {
            const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
            const isActive = location.pathname === path;
            
            return (
              <Link 
                key={item} 
                to={path}
                className={`relative py-1.5 transition-colors duration-300 font-bold ${isActive ? 'text-brand-amber' : 'text-white/80 hover:text-white'}`}
              >
                {item}
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

        {/* Call Button */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="tel:+91 94281 56213"
          className="bg-brand-amber hover:bg-white border border-brand-amber hover:border-white text-brand-slateDark px-6 py-3 rounded-none font-bold font-sans text-[11px] tracking-widest uppercase transition-all duration-300 hidden sm:block"
        >
          Call Now
        </motion.a>
      </nav>
    </motion.header>
  );
}

export default Navbar;