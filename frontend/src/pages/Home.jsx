import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Award, ShieldCheck, Factory, HelpCircle, PhoneCall, ChevronDown } from "lucide-react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import MachineFinderWizard from "../components/MachineFinderWizard";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
            
            const getHPNumeric = (product) => {
              const nameMatch = product.name?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
              if (nameMatch) return parseFloat(nameMatch[1]);
              
              if (product.table && Array.isArray(product.table)) {
                for (const row of product.table) {
                  if (Array.isArray(row) && row.length >= 2) {
                    const key = row[0]?.toUpperCase().trim();
                    const value = row[1];
                    if (key === "MOTOR" || key === "POWER" || key === "MOTOR POWER" || key === "HP" || key === "H.P.") {
                      const match = value?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
                      if (match) return parseFloat(match[1]);
                      const rawNumberMatch = value?.match(/(\d+(\.\d+)?)/);
                      if (rawNumberMatch) return parseFloat(rawNumberMatch[1]);
                    }
                  }
                }
              }
              
              if (product.description) {
                const descMatch = product.description.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
                if (descMatch) return parseFloat(descMatch[1]);
              }
              
              return Infinity;
            };

            products = [...products].sort((a, b) => {
              const getCategoryIndex = (cat) => {
                const index = categoryOrder.indexOf(cat);
                return index === -1 ? Infinity : index;
              };
              const catIndexA = getCategoryIndex(a.category);
              const catIndexB = getCategoryIndex(b.category);
              
              if (catIndexA !== catIndexB) {
                return catIndexA - catIndexB;
              }
              
              return getHPNumeric(a) - getHPNumeric(b);
            });
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

  const homeFaqs = [
    {
      question: "Which commercial food processing machines does Millzon manufacture?",
      answer: "Millzon manufactures heavy-duty commercial flour mills, pulverizers, potato slicers, vegetable cutting machines, dough kneaders, onion peelers, and spice grinding plants engineered with 304 food-grade stainless steel."
    },
    {
      question: "Where are Millzon machines manufactured in India?",
      answer: "All Millzon machinery is manufactured in our modern engineering facility located in Shapar (Veraval), Rajkot, Gujarat, India, ensuring high structural precision and quality control."
    },
    {
      question: "Does Millzon provide pan-India delivery and support?",
      answer: "Yes, Millzon provides pan-India shipping, installation guidance, technical support, and comprehensive dealer services across all states in India."
    },
    {
      question: "How can I request a price quotation for Millzon machinery?",
      answer: "You can click on 'Request Quote' on any product page, call our direct sales line at +91 94281 56213, or send your requirements via our online inquiry form."
    }
  ];

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Millzon",
      "legalName": "Durga Manufactures",
      "url": "https://www.durgamanufactures.com",
      "logo": "https://www.durgamanufactures.com/millzon-logo.png",
      "description": "Millzon is a leading Indian manufacturer of commercial food processing machinery, flour mills, pulverizers, vegetable cutters, and industrial kitchen equipment.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Plot A5, Shapar Main Rd, Opp. Mahindra Gear, Shapar (Veraval)",
        "addressLocality": "Rajkot",
        "addressRegion": "Gujarat",
        "postalCode": "360024",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9428156213",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Gujarati"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Millzon",
      "url": "https://www.durgamanufactures.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.durgamanufactures.com/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": homeFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <SEO
        title="Commercial Food Processing Machinery | Millzon"
        description="Millzon is a premier Indian manufacturer of commercial food processing machinery, pulverizers, heavy-duty flour mills, vegetable cutters, potato slicers, and dough kneaders."
        canonicalUrl="/"
        jsonLd={jsonLdData}
        keywords="commercial food processing machinery, Millzon, flour mill machine, pulverizer, vegetable cutter, dough kneader, Rajkot food machinery India"
      />
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
              Commercial Grade Manufacturing by Millzon
            </div>

            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-brand-forest leading-[1.1] mb-4 tracking-tight">
              Commercial <br />
              <span className="text-brand-charcoal">Food Processing</span> <br />
              Machinery | Millzon
            </h1>

            <p className="text-sm md:text-base text-brand-gray mb-6 max-w-lg leading-relaxed font-semibold">
              Engineered for absolute precision and maximum durability. Millzon manufactures high-capacity vegetable cutters, potato slicers, pulverizers, and heavy-duty flour mills for commercial kitchens, hotels, and food processing plants across India.
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
                  <h4 className="font-bold text-brand-forest text-sm uppercase tracking-wider font-sans">15+ Years</h4>
                  <p className="text-xs text-brand-gray font-semibold">Millzon Manufacturing Excellence</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-forest text-sm uppercase tracking-wider font-sans">Pan India</h4>
                  <p className="text-xs text-brand-gray font-semibold">Delivery & Technical Support</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative bg-white border border-brand-sand p-4 w-full max-w-lg shadow-sm">
              <div className="relative overflow-hidden bg-brand-cream aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758"
                  alt="Millzon Commercial Food Processing Machinery"
                  width="600"
                  height="600"
                  fetchPriority="high"
                  className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-all duration-700"
                />
              </div>

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

      {/* AI Machine Recommendation Finder Quiz Section */}
      <section className="py-12 bg-white border-t border-brand-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <MachineFinderWizard embedded={true} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-brand-forest tracking-tight mb-3">
              Featured Millzon Machinery
            </h2>
            <p className="text-brand-gray max-w-md mx-auto text-sm font-semibold">
              Explore our highest rated, commercial-grade food processing units engineered for high yield.
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
              View Full Machine Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Manufacturing Banner */}
      <section className="py-12 bg-white border-t border-brand-sand">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center text-brand-forest mx-auto md:mx-0">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-forest">Rajkot Manufacturing Plant</h3>
            <p className="text-xs text-brand-gray font-semibold leading-relaxed">
              Every Millzon machine is precision-engineered in our advanced manufacturing facility based in Gujarat, India.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center text-brand-forest mx-auto md:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-forest">Sanitary Stainless Steel</h3>
            <p className="text-xs text-brand-gray font-semibold leading-relaxed">
              Constructed using top-tier 304 food-grade stainless steel to ensure food safety compliance and structural durability.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center text-brand-forest mx-auto md:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-forest">Pan-India Support</h3>
            <p className="text-xs text-brand-gray font-semibold leading-relaxed">
              Trusted by 500+ commercial kitchens, food processing plants, and authorized dealers across India.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="py-12 bg-brand-sage/20 border-t border-brand-sand">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-sand text-brand-forest font-bold font-sans text-[10px] tracking-widest uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-brand-amber" /> Buyer FAQs
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-brand-forest tracking-tight">
              Frequently Asked Questions About Millzon Machinery
            </h2>
          </div>

          <div className="space-y-4">
            {homeFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="bg-white border border-brand-sand rounded-none overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-brand-cream/50 transition-colors"
                  >
                    <span className="font-serif font-bold text-brand-forest text-base md:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-brand-forest shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-brand-gray font-medium leading-relaxed border-t border-brand-sand/40 bg-brand-cream/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center bg-white p-6 border border-brand-sand">
            <p className="text-sm font-bold text-brand-forest mb-2">Have a specific machinery question or need a bulk price quotation?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold font-sans tracking-widest uppercase text-brand-amber bg-brand-slateDark px-5 py-3 rounded-none hover:bg-brand-forest transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> Speak With Millzon Sales Engineering
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
