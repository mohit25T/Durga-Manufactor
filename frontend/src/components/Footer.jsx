import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-brand-slateDark text-white/90 py-10 mt-10 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 relative z-10">
        {/* Brand Info */}
        <div>
          <div className="mb-4">
            <span className="font-serif text-2xl font-bold tracking-wide text-brand-amber">
              Durga Manufactures
            </span>
          </div>
          <p className="text-white/60 mb-4 max-w-sm leading-relaxed text-sm font-medium">
            Premium commercial food processing machinery engineered for durability, precision, and efficiency in demanding commercial environments.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-sans text-xs tracking-widest uppercase mb-4 text-brand-amber font-bold">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm font-semibold text-white/70">
            <li>
              <Link
                to="/"
                className="hover:text-brand-amber hover:underline transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-brand-amber hover:underline transition-all"
              >
                All Machines
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-brand-amber hover:underline transition-all"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-brand-amber hover:underline transition-all"
              >
                Contact & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-sans text-xs tracking-widest uppercase mb-4 text-brand-amber font-bold">
            Reach Out
          </h3>
          <ul className="space-y-3 text-sm font-semibold">
            <li className="flex items-start gap-4">
              <div className="bg-white/5 border border-white/10 p-2 rounded-none shrink-0">
                <MapPin className="w-4 h-4 text-brand-amber" />
              </div>
              <span className="text-white/70 pt-0.5">
                <a
                  href="https://maps.app.goo.gl/aU3AFdMye5pQWjrZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-amber leading-relaxed font-bold block"
                >
                  Plot No. A5, Shapar Main Road, Opp. Mahindra Gear, Decora Cement Campus, Shapar (Veraval) 360024, Rajkot.
                  <br />
                  Rajkot, Gujarat, India 360003
                </a>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-white/5 border border-white/10 p-2 rounded-none shrink-0 mt-1">
                <Phone className="w-4 h-4 text-brand-amber" />
              </div>
              <div className="flex flex-col space-y-1">
                <a
                  href="tel:+919829870821"
                  className="text-white/70 hover:text-brand-amber font-bold transition"
                >
                  +91 98298 70821
                </a>
                <a
                  href="tel:+919428156213"
                  className="text-white/70 hover:text-brand-amber font-bold transition"
                >
                  +91 94281 56213
                </a>
                <a
                  href="tel:+919909917008"
                  className="text-white/70 hover:text-brand-amber font-bold transition"
                >
                  +91 99099 17008
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-white/5 border border-white/10 p-2 rounded-none shrink-0">
                <Mail className="w-4 h-4 text-brand-amber" />
              </div>
              <a
                href="mailto:durgamanufactures2010@gmail.com"
                className="text-white/70 hover:text-brand-amber font-bold transition break-all"
              >
                durgamanufactures2010@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/10 text-center text-white/50 text-xs font-semibold relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} durga manufactures. All rights reserved.</p>
        <p className="font-serif text-brand-amber">Engineered for Excellence</p>
      </div>
    </footer>
  );
}

export default Footer;
