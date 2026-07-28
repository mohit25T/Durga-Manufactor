import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Phone, ExternalLink, RefreshCw, Zap, Factory, Utensils, Wheat, Disc, Flame, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";

const APPLICATION_STEPS = [
  {
    id: "snacks",
    title: "Potato Chips & Snacks",
    categoryKey: ["Slicers", "Peelers", "Cutters"],
    icon: Disc,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
    desc: "Potato slicing, peeling, and commercial snack production lines",
  },
  {
    id: "milling",
    title: "Flour Milling & Grains",
    categoryKey: ["Mills", "Pulverizers"],
    icon: Wheat,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    desc: "High-speed grain grinding, flour mills, and spice pulverizers",
  },
  {
    id: "juicing",
    title: "Sugarcane & Juice Outlets",
    categoryKey: ["Juicers", "Sugarcane"],
    icon: Zap,
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&q=80",
    desc: "Heavy-duty sugarcane juice extraction for juice bars and kiosks",
  },
  {
    id: "veg",
    title: "Vegetables & Onions",
    categoryKey: ["Cutters", "Peelers", "Veg"],
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    desc: "Multi-functional vegetable cutting and automatic onion peeling",
  },
  {
    id: "bakery",
    title: "Bakery & Dough Prep",
    categoryKey: ["Kneaders", "Bakery"],
    icon: Factory,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    desc: "Commercial dough kneaders and heavy spiral mixers",
  },
  {
    id: "spices",
    title: "Heavy Spices & Herbs",
    categoryKey: ["Pulverizers", "Mills"],
    icon: Flame,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    desc: "Double-chamber pulverizers for chili, turmeric, and dry spices",
  },
];

export default function MachineFinderWizard({ onClose, onSendToChat, embedded = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedScale, setSelectedScale] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch catalog on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products");
        if (res.data?.data) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load catalog in MachineFinder:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Helper to extract numeric HP
  const extractNumericHP = (product) => {
    if (product.name) {
      const match = product.name.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
      if (match) return parseFloat(match[1]);
    }
    if (product.table && Array.isArray(product.table)) {
      for (const row of product.table) {
        if (Array.isArray(row) && row.length >= 2) {
          const key = row[0]?.toUpperCase().trim();
          const val = row[1];
          if (["MOTOR", "POWER", "MOTOR POWER", "HP", "H.P."].includes(key)) {
            const m = val?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
            if (m) return parseFloat(m[1]);
            const raw = val?.match(/(\d+(\.\d+)?)/);
            if (raw) return parseFloat(raw[1]);
          }
        }
      }
    }
    if (product.description) {
      const m = product.description.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
      if (m) return parseFloat(m[1]);
    }
    return 1.5;
  };

  // Helper to dynamically calculate ONLY available capacities for the selected application
  const getAvailableCapacitiesForApp = (appObj) => {
    if (!appObj || !products || products.length === 0) return [];

    const appProducts = products.filter((p) => {
      const catLower = p.category?.toLowerCase() || "";
      const nameLower = p.name?.toLowerCase() || "";
      return appObj.categoryKey.some(
        (key) => catLower.includes(key.toLowerCase()) || nameLower.includes(key.toLowerCase())
      );
    });

    const targetProducts = appProducts.length > 0 ? appProducts : products;

    // Group by HP capacities
    const hpMap = new Map();

    targetProducts.forEach((p) => {
      const hpVal = extractNumericHP(p);
      const hpLabel = `${hpVal} H.P.`;

      if (!hpMap.has(hpLabel)) {
        hpMap.set(hpLabel, {
          id: `hp-${hpVal}`,
          title: `${hpVal} H.P. Capacity`,
          badge: `${hpVal} H.P.`,
          maxHp: hpVal,
          count: 1,
        });
      } else {
        const existing = hpMap.get(hpLabel);
        existing.count += 1;
      }
    });

    const dynamicList = Array.from(hpMap.values()).sort((a, b) => a.maxHp - b.maxHp);

    // Add "All Capacities" option so users can view everything
    dynamicList.push({
      id: "all-capacities",
      title: "All Capacities (View All)",
      badge: `${targetProducts.length} Models`,
      maxHp: null,
      count: targetProducts.length,
    });

    return dynamicList;
  };

  // Calculate Recommendations (NO SLICING - SHOW ALL MATCHING PRODUCTS FOR SELECTED CAPACITY)
  const handleCalculateMatch = (appObj, scaleObj) => {
    const targetApp = appObj || selectedApp;
    const targetScale = scaleObj || selectedScale;

    if (!targetApp || !targetScale) return;

    let matched = products.filter((p) => {
      const catLower = p.category?.toLowerCase() || "";
      const nameLower = p.name?.toLowerCase() || "";
      return targetApp.categoryKey.some(
        (key) => catLower.includes(key.toLowerCase()) || nameLower.includes(key.toLowerCase())
      );
    });

    if (matched.length === 0) {
      matched = [...products];
    }

    // Filter by specific HP capacity if selected (and not 'All')
    if (targetScale.maxHp !== null && targetScale.maxHp !== undefined) {
      const exactMatched = matched.filter((p) => extractNumericHP(p) === targetScale.maxHp);
      if (exactMatched.length > 0) {
        matched = exactMatched;
      } else {
        matched.sort((a, b) => {
          const hpA = extractNumericHP(a);
          const hpB = extractNumericHP(b);
          return Math.abs(hpA - targetScale.maxHp) - Math.abs(hpB - targetScale.maxHp);
        });
      }
    }

    setRecommendations(matched);
    setCurrentStep(3);
  };

  const handleReset = () => {
    setSelectedApp(null);
    setSelectedScale(null);
    setRecommendations([]);
    setCurrentStep(1);
  };

  const availableCapacities = getAvailableCapacitiesForApp(selectedApp);

  return (
    <div className={`w-full font-sans ${embedded ? "py-4" : "p-1"}`}>
      <div className="bg-white border border-brand-sand shadow-2xl overflow-hidden max-w-4xl mx-auto rounded-none">
        {/* HEADER */}
        <div className="bg-brand-forest text-white p-4 md:p-6 relative border-b border-brand-sand">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 border border-amber-400/30">
                  AI Recommendation Engine
                </span>
                <h3 className="font-serif text-lg md:text-2xl font-bold tracking-tight mt-0.5">
                  Durga Commercial Machine Finder
                </h3>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* STEP INDICATOR BAR */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className={`h-1.5 transition-all duration-300 ${currentStep >= 1 ? "bg-amber-400 shadow-xs" : "bg-white/20"}`} />
            <div className={`h-1.5 transition-all duration-300 ${currentStep >= 2 ? "bg-amber-400 shadow-xs" : "bg-white/20"}`} />
            <div className={`h-1.5 transition-all duration-300 ${currentStep >= 3 ? "bg-amber-400 shadow-xs" : "bg-white/20"}`} />
          </div>
          <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-wider font-bold text-white/80 mt-2">
            <span className={currentStep === 1 ? "text-amber-400 font-extrabold" : ""}>1. Select Application</span>
            <span className={currentStep === 2 ? "text-amber-400 font-extrabold" : ""}>2. Select Capacity</span>
            <span className={currentStep === 3 ? "text-amber-400 font-extrabold" : ""}>3. Matched Machines ({recommendations.length})</span>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-4 md:p-8 bg-stone-50/60 max-h-[500px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT APPLICATION (SINGLE HIGH-RES PROPERLY CENTERED IMAGE CARD) */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="border-b border-brand-sand pb-3">
                  <h4 className="font-serif text-lg md:text-xl font-bold text-brand-forest">
                    Step 1: Select your manufacturing or kitchen application
                  </h4>
                  <p className="text-xs text-brand-gray font-medium mt-1">
                    Choose the primary commercial food processing operation to view tailored machine models:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {APPLICATION_STEPS.map((app) => {
                    const IconComponent = app.icon;
                    const isSelected = selectedApp?.id === app.id;

                    return (
                      <button
                        key={app.id}
                        onClick={() => {
                          setSelectedApp(app);
                          setCurrentStep(2);
                        }}
                        className={`text-left border transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                          isSelected
                            ? "border-brand-forest bg-brand-forest text-white ring-2 ring-brand-forest/30"
                            : "border-brand-sand bg-white hover:border-brand-forest hover:bg-brand-sage/10 text-brand-charcoal"
                        }`}
                      >
                        {/* HIGH-RES PROPERLY FRAMED IMAGE BANNER */}
                        <div className="relative h-32 w-full overflow-hidden bg-stone-100 border-b border-brand-sand/60">
                          <img
                            src={app.image}
                            alt={app.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                          {/* FLOATING ICON BADGE */}
                          <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-brand-forest flex items-center justify-center shadow-md z-10">
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="absolute bottom-2 left-3 right-3 text-white">
                            <h5 className="font-serif font-bold text-sm tracking-wide text-white drop-shadow-xs">
                              {app.title}
                            </h5>
                          </div>
                        </div>

                        <div className="p-3.5 flex-grow flex flex-col justify-between">
                          <p
                            className={`text-xs leading-relaxed font-medium line-clamp-2 ${
                              isSelected ? "text-white/90" : "text-brand-gray"
                            }`}
                          >
                            {app.desc}
                          </p>

                          <div className="mt-4 flex items-center justify-between border-t pt-2 border-current/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 group-hover:text-brand-forest">
                              Select Application
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SELECT DYNAMICALLY AVAILABLE CAPACITY */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-brand-sand pb-3">
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-bold text-brand-forest">
                      Step 2: Select Available Motor Power & Capacity
                    </h4>
                    <p className="text-xs text-brand-gray font-medium mt-0.5">
                      Available capacities for: <strong className="text-brand-forest font-bold">{selectedApp?.title}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-forest hover:underline cursor-pointer bg-white border border-brand-sand px-3 py-1.5 shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 1
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableCapacities.map((scale) => {
                    const isSelected = selectedScale?.id === scale.id;

                    return (
                      <button
                        key={scale.id}
                        onClick={() => {
                          setSelectedScale(scale);
                          handleCalculateMatch(selectedApp, scale);
                        }}
                        className={`text-left p-3.5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                          isSelected
                            ? "border-brand-forest bg-brand-forest text-white ring-2 ring-brand-forest/30"
                            : "border-brand-sand bg-white hover:border-brand-forest hover:bg-brand-sage/10 text-brand-charcoal"
                        }`}
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                                isSelected
                                  ? "bg-amber-400 text-brand-charcoal"
                                  : "bg-brand-sage/40 text-brand-forest border border-brand-forest/20"
                              }`}
                            >
                              {scale.badge}
                            </span>
                            {scale.count > 0 && (
                              <span
                                className={`text-[10px] font-bold uppercase ${
                                  isSelected ? "text-white/80" : "text-brand-gray"
                                }`}
                              >
                                {scale.count} {scale.count === 1 ? "unit" : "units"}
                              </span>
                            )}
                          </div>

                          <h5 className="font-bold text-xs md:text-sm tracking-tight">{scale.title}</h5>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t pt-2 border-current/20">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Select</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: MATCHED RECOMMENDATIONS */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-sand pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="font-serif text-lg md:text-xl font-bold text-brand-forest">
                        Recommended Commercial Machines ({recommendations.length})
                      </h4>
                    </div>
                    <p className="text-xs text-brand-gray font-medium mt-1">
                      Matched for: <strong>{selectedApp?.title}</strong> ({selectedScale?.title})
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-100 text-brand-charcoal px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border border-brand-sand shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset Quiz
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-forest" />
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="text-center py-8 bg-white border border-brand-sand p-6">
                    <p className="text-sm font-semibold text-brand-gray">
                      No exact match found, but our sales engineers can manufacture custom machine capacities for you!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recommendations.map((item, idx) => (
                      <div
                        key={item._id}
                        className="bg-white border border-brand-sand p-4 flex flex-col justify-between shadow-2xs relative group hover:border-brand-forest hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-forest bg-brand-sage/30 px-2 py-0.5 border border-brand-forest/20">
                              {item.category}
                            </span>
                            {idx === 0 && (
                              <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 shadow-2xs">
                                #1 Top Match
                              </span>
                            )}
                          </div>

                          <h5 className="font-serif font-bold text-sm text-brand-charcoal mb-2 line-clamp-2 group-hover:text-brand-forest transition-colors">
                            {item.name}
                          </h5>

                          <p className="text-xs text-brand-gray font-medium line-clamp-3 mb-4 leading-relaxed">
                            {item.description || "Heavy-duty commercial machine designed for continuous performance."}
                          </p>

                          {item.price && (
                            <p className="font-bold text-sm text-brand-forest mb-4">
                              ₹{parseInt(item.price).toLocaleString("en-IN")}{" "}
                              <span className="text-[10px] font-normal text-brand-gray">(Ex-Factory)</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 pt-3 border-t border-brand-sand/60">
                          {onSendToChat && (
                            <button
                              onClick={() => {
                                onSendToChat(recommendations, selectedApp, selectedScale);
                                if (onClose) onClose();
                              }}
                              className="w-full inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Post Matches to Chat
                            </button>
                          )}

                          <Link
                            to={`/products/${item._id}`}
                            onClick={onClose}
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-forest text-white py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-brand-forest/90 transition-colors shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Specifications
                          </Link>

                          <a
                            href={`https://wa.me/919428156213?text=${encodeURIComponent(
                              `Hello Durga Manufactor! I ran the AI Machine Quiz for ${selectedApp?.title} (${selectedScale?.title}) and matched with ${item.name}. Please send price details & video demo.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shadow-2xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            WhatsApp Quote
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
