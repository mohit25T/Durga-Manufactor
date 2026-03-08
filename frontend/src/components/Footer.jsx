import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-brand-slateDark text-brand-light py-16 mt-20 border-t-4 border-brand-amber relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-brand-slate/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 relative z-10">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-3xl font-extrabold mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-amber rounded-xl flex items-center justify-center">
              <span className="text-brand-slateDark font-bold text-xl">D</span>
            </div>
            Durga Manufactures
          </h2>
          <p className="text-brand-gray mb-6 max-w-sm leading-relaxed">
            Premium industrial food processing machinery engineered for durability, precision, and efficiency in commercial environments.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-amber"></span>
            Quick Links
          </h3>
          <ul className="space-y-4">
            <li><Link to="/" className="text-brand-gray hover:text-brand-amber transition-colors flex items-center gap-2"><span className="text-xs">▶</span> Home</Link></li>
            <li><Link to="/products" className="text-brand-gray hover:text-brand-amber transition-colors flex items-center gap-2"><span className="text-xs">▶</span> All Machines</Link></li>
            <li><Link to="/about" className="text-brand-gray hover:text-brand-amber transition-colors flex items-center gap-2"><span className="text-xs">▶</span> About Us</Link></li>
            <li><Link to="/contact" className="text-brand-gray hover:text-brand-amber transition-colors flex items-center gap-2"><span className="text-xs">▶</span> Contact Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-amber"></span>
            Reach Out
          </h3>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="bg-brand-slate p-2 rounded-lg shrink-0">
                <MapPin className="w-5 h-5 text-brand-amber" />
              </div>
              <span className="text-brand-gray pt-1">123 Industrial Area, Rajkot, Gujarat, India 360002</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-brand-slate p-2 rounded-lg shrink-0">
                <Phone className="w-5 h-5 text-brand-amber" />
              </div>
              <span className="text-brand-gray">+91 99999 99999</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-brand-slate p-2 rounded-lg shrink-0">
                <Mail className="w-5 h-5 text-brand-amber" />
              </div>
              <span className="text-brand-gray">info@durgamanufactures.com</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-brand-slate p-2 rounded-lg shrink-0">
                <Clock className="w-5 h-5 text-brand-amber" />
              </div>
              <span className="text-brand-gray">Mon - Sat: 9:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-brand-slate/50 text-center text-brand-gray text-sm relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Durga Manufactures. All rights reserved.</p>
        <p>Engineered for Excellence</p>
      </div>
    </footer>
  );
}

export default Footer;