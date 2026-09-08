import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Home as HomeIcon, Package, PhoneCall, AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <SEO 
        title="404 - Page Not Found | Millzon" 
        description="The requested page could not be found on the Millzon Commercial Food Processing Machinery website."
        noindex={true}
      />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-2xl w-full bg-white border border-brand-sand p-8 md:p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-brand-sage/40 border border-brand-sand rounded-full flex items-center justify-center mx-auto mb-6 text-brand-forest">
            <AlertTriangle className="w-8 h-8 text-brand-amber" />
          </div>

          <span className="font-serif text-5xl md:text-6xl font-bold text-brand-forest block mb-2">
            404
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-forest mb-4">
            Page Not Found
          </h1>

          <p className="text-brand-gray text-sm md:text-base font-semibold max-w-md mx-auto mb-8 leading-relaxed">
            The page or machine catalog item you are looking for may have been moved, renamed, or is temporarily unavailable.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/"
              className="bg-brand-forest hover:bg-transparent border border-brand-forest hover:text-brand-forest text-white px-6 py-3 font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2"
            >
              <HomeIcon className="w-4 h-4" /> Go To Homepage
            </Link>

            <Link
              to="/products"
              className="border border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white px-6 py-3 font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> Explore Machines
            </Link>

            <Link
              to="/contact"
              className="border border-brand-sand bg-brand-cream hover:bg-brand-sand text-brand-charcoal px-6 py-3 font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-brand-forest" /> Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFound;
