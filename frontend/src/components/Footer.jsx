import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-brand-black text-brand-light py-16 mt-20 border-t-4 border-brand-red relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-brand-black/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 relative z-10">
        {/* Brand Info */}
        <div>
          <div className="mb-6 bg-white/5 inline-block p-4 rounded-2xl border border-white/10">
            <img
              src="/millzon-logo.png"
              alt="MillZon Logo"
              className="h-12 w-auto"
            />
          </div>
          <p className="text-brand-gray mb-6 max-w-sm leading-relaxed">
            Premium Commercial food processing machinery engineered for
            durability, precision, and efficiency in commercial environments.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            Quick Links
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="text-brand-gray hover:text-brand-red transition-colors flex items-center gap-2"
              >
                <span className="text-xs">▶</span> Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-brand-gray hover:text-brand-red transition-colors flex items-center gap-2"
              >
                <span className="text-xs">▶</span> All Machines
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-brand-gray hover:text-brand-red transition-colors flex items-center gap-2"
              >
                <span className="text-xs">▶</span> About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-brand-gray hover:text-brand-red transition-colors flex items-center gap-2"
              >
                <span className="text-xs">▶</span> Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            Reach Out
          </h3>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="bg-white/5 border border-white/10 p-2 rounded-lg shrink-0">
                <MapPin className="w-5 h-5 text-brand-red" />
              </div>
              <span className="text-brand-gray pt-1">
                <a
                  href="https://maps.app.goo.gl/aU3AFdMye5pQWjrZA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold leading-relaxed hover:text-brand-amber transition"
                >
                  Plot No. A5, Shapar Main Road, Opp. Mahindra Gear, Decora
                  Cement Campus, Shapar (Veraval) 360024, Rajkot.
                  <br />
                  Rajkot, Gujarat, India 360003
                </a>
              </span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-white/5 border border-white/10 p-2 rounded-lg shrink-0">
                <Phone className="w-5 h-5 text-brand-red" />
              </div>
              <a
                href="tel:+919825270821"
                className="text-brand-gray hover:text-brand-amber transition block"
              >
                +91 98252 70821
              </a>
              <br />
              <a
                href="tel:+919428156213"
                className="text-brand-gray hover:text-brand-amber transition block"
              >
                +91 94281 56213
              </a>
              <br />
              <a
                href="tel:+919909917008"
                className="text-brand-gray hover:text-brand-amber transition block"
              >
                +91 99099 17008
              </a>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-white/5 border border-white/10 p-2 rounded-lg shrink-0">
                <Mail className="w-5 h-5 text-brand-red" />
              </div>
              <a
                href="mailto:durgamanufactures2010@gmail.com"
                className="text-brand-gray hover:text-brand-amber transition"
              >
                durgamanufactures2010@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-4">
              {/* <div className="bg-white/5 border border-white/10 p-2 rounded-lg shrink-0">
                <Clock className="w-5 h-5 text-brand-red" />
              </div>
              <span className="text-brand-gray">Mon - Sat: 9:00 AM - 6:00 PM</span> */}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-brand-gray/20 text-center text-brand-gray text-sm relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} MillZon. All rights reserved.</p>
        <p>Engineered for Excellence</p>
      </div>
    </footer>
  );
}

export default Footer;
