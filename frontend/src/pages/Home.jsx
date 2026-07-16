import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Award, ShieldCheck, Factory } from "lucide-react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          API.get("/products"),
          API.get("/settings/categoryOrder").catch(() => null)
        ]);

        let products = productsRes.data.data || [];
        const categoryOrderSetting = settingsRes?.data?.success && settingsRes.data.data;

        if (categoryOrderSetting) {
          try {
            const categoryOrder = JSON.parse(categoryOrderSetting);
            if (categoryOrder && categoryOrder.length > 0) {
              const getCategoryIndex = (cat) => {
                const index = categoryOrder.indexOf(cat);
                return index === -1 ? Infinity : index;
              };
              products = [...products].sort((a, b) => {
                return getCategoryIndex(a.category) - getCategoryIndex(b.category);
              });
            }
          } catch (e) {
            console.error("Failed to parse categoryOrder:", e);
          }
        }

        setFeatured(products.slice(0, 3));
      } catch (error) {
        console.log(error);
        setFeatured([
          { _id: '1', name: 'Heavy Duty Potato Slicer HP-500', description: 'Cuts 500kg/hr. Stainless steel body with premium blades.', category: 'Slicers' },
          { _id: '2', name: 'Commercial Flour Mill FM-X', description: 'High speed grinding with stone mechanism. 20HP motor.', category: 'Mills' },
          { _id: '3', name: 'Industrial Veg Cutter V-300', description: 'Multifunctional cutting blades included. Continuous operation.', category: 'Cutters' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-brand-sage/30 py-12 lg:py-16 overflow-hidden border-b border-brand-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 items-center gap-16 relative z-10">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-sand text-brand-forest font-bold font-sans text-[10px] tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-forest"></span>
              Commercial grade manufacturing
            </div>

            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-brand-forest leading-[1.1] mb-4 tracking-tight">
              Commercial <br />
              <span className="text-brand-charcoal">Food Processing</span> <br />
              Machinery
            </h1>

            <p className="text-sm md:text-base text-brand-gray mb-6 max-w-lg leading-relaxed font-semibold">
              Engineered for absolute precision and maximum durability. We manufacture high-capacity vegetable cutters, potato slicers, and heavy-duty flour mills for commercial kitchens across India.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="bg-brand-forest hover:bg-transparent border border-brand-forest hover:text-brand-forest text-white px-8 py-4 rounded-none font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300 shadow-sm"
              >
                Shop Machines
              </Link>

              <Link
                to="/contact"
                className="border border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white px-8 py-4 rounded-none font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300"
              >
                Request Quote
              </Link>
            </div>

            {/* Core Stats Mini */}
            <div className="mt-8 grid grid-cols-2 gap-8 pt-6 border-t border-brand-sand">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-forest text-sm uppercase tracking-wider font-sans">22+ Years</h4>
                  <p className="text-xs text-brand-gray font-semibold">Manufacturing Excellence</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-forest text-sm uppercase tracking-wider font-sans">Pan India</h4>
                  <p className="text-xs text-brand-gray font-semibold">Delivery & Support</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative bg-white border border-brand-sand p-4 w-full max-w-lg shadow-sm">
              <div className="relative overflow-hidden bg-brand-cream aspect-square">
                <img
                  src="https://www.azom.com/images/Article_Thumbs/ThumbForArticle_2867_16010306047694886.png"
                  alt="Industrial Machine"
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
              </div>

              {/* Floating Minimal Badge */}
              <div className="absolute -bottom-6 -left-6 bg-brand-sage text-brand-forest px-6 py-4 border border-brand-sand shadow-lg flex items-center gap-3">
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="font-bold text-xs uppercase tracking-wider font-sans">304 Grade</p>
                  <p className="text-[10px] text-brand-gray font-bold uppercase tracking-widest">Stainless Steel</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-brand-forest tracking-tight mb-3">
              Featured Machinery
            </h2>
            <p className="text-brand-gray max-w-md mx-auto text-sm font-semibold">
              Explore our highest rated, commercial-grade food processing units.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-forest"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="bg-brand-forest hover:bg-transparent border border-brand-forest hover:text-brand-forest text-white px-8 py-4 rounded-none font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300 inline-flex items-center gap-2"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Legacy/Trust Banner */}
      <section className="py-12 bg-white border-t border-brand-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center text-brand-forest mx-auto md:mx-0">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-forest ">Rajkot Facility</h3>
            <p className="text-xs text-brand-gray font-semibold leading-relaxed">
              Every machine is precision-engineered in our advanced manufacturing facility based in Gujarat, India.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center text-brand-forest mx-auto md:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-forest">Quality Assurance</h3>
            <p className="text-xs text-brand-gray font-semibold leading-relaxed">
              We construct using top-tier 304 food-grade stainless steel to ensure sanitation and absolute structural durability.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center text-brand-forest mx-auto md:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-forest">Pan India Service</h3>
            <p className="text-xs text-brand-gray font-semibold leading-relaxed">
              Trusted by 500+ commercial kitchens and food processing industries across the Indian subcontinent.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
