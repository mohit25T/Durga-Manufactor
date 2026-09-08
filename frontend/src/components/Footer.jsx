import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import DownloadApkButton from "./DownloadApkButton";

function Footer() {
  return (
    <footer className="bg-brand-slateDark text-white/90 py-8 mt-8 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 relative z-10">
        {/* Brand Info */}
        <div>
          <div className="mb-3">
            <span className="font-serif text-2xl font-bold tracking-wide text-brand-amber">
              Durga Manufactures
            </span>
          </div>
          <p className="text-white/70 mb-4 max-w-sm leading-relaxed text-sm font-medium">
            Premium commercial food processing machinery engineered for durability, precision, and efficiency in demanding commercial environments.
          </p>
          <div className="mt-3">
            <DownloadApkButton variant="secondary" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-sans text-xs md:text-sm tracking-widest uppercase mb-3 text-brand-amber font-bold">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm font-semibold text-white/80">
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
            <li>
              <Link
                to="/dealer/login"
                className="hover:text-brand-amber hover:underline transition-all text-brand-amber font-bold"
              >
                Authorized Dealer Portal
              </Link>
            </li>
            <li className="pt-1 flex items-center gap-2 text-xs">
              <Link
                to="/privacy-policy"
                className="hover:text-brand-amber hover:underline transition-all text-white/60"
              >
                Privacy Policy
              </Link>
              <span className="text-white/40">•</span>
              <Link
                to="/terms-and-conditions"
                className="hover:text-brand-amber hover:underline transition-all text-white/60"
              >
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-sans text-xs md:text-sm tracking-widest uppercase mb-3 text-brand-amber font-bold">
            Reach Out
          </h3>
          <ul className="space-y-3 text-sm font-semibold">
            <li className="flex items-start gap-3">
              <div className="bg-white/5 border border-white/10 p-2 rounded shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-brand-amber" />
              </div>
              <span className="text-white/80 text-sm">
                <a
                  href="https://maps.app.goo.gl/aU3AFdMye5pQWjrZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-amber leading-snug font-semibold block"
                >
                  Plot A5, Shapar Main Rd, Opp. Mahindra Gear, Shapar (Veraval), Rajkot, Gujarat 360024
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-white/5 border border-white/10 p-2 rounded shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-brand-amber" />
              </div>
              <div className="flex flex-col space-y-1.5 text-sm">
                <a
                  href="tel:+919825870821"
                  className="text-white/80 hover:text-brand-amber font-semibold transition leading-tight block"
                >
                  +91 98258 70821
                </a>
                <a
                  href="tel:+919428156213"
                  className="text-white/80 hover:text-brand-amber font-semibold transition leading-tight block"
                >
                  +91 94281 56213
                </a>
                <a
                  href="tel:+919909917008"
                  className="text-white/80 hover:text-brand-amber font-semibold transition leading-tight block"
                >
                  +91 99099 17008
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 p-2 rounded shrink-0">
                <Mail className="w-4 h-4 text-brand-amber" />
              </div>
              <a
                href="mailto:durgamanufactures2010@gmail.com"
                className="text-white/80 hover:text-brand-amber font-semibold text-sm transition break-all"
              >
                durgamanufactures2010@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 pt-4 border-t border-white/10 text-center text-white/60 text-xs md:text-sm font-medium relative z-10 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Durga Manufactures. All rights reserved.</p>
        <p className="font-serif text-brand-amber font-bold">Engineered for Excellence</p>
      </div>
    </footer>
  );
}

export default Footer;
