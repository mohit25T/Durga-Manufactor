import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { motion } from "framer-motion";
import { LayoutGrid, List, ArrowRight, Scale, Check, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedHP, setSelectedHP] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const [categoryOrder, setCategoryOrder] = useState([]);
  const { toggleCompare, isInCompare } = useCompare();

  useEffect(() => {
    const fetchProductsAndSettings = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          API.get("/products"),
          API.get("/settings/categoryOrder").catch(() => null)
        ]);

        const fetched = productsRes.data.data || productsRes.data.products || productsRes.data;
        let finalProducts = Array.isArray(fetched) && fetched.length > 0 ? fetched : [];

        if (finalProducts.length === 0) {
          finalProducts = [
            { _id: '1', name: 'Heavy Duty Potato Slicer HP-500', description: 'Cuts 500kg/hr. Stainless steel body with premium blades.', category: 'Slicers', price: 0, images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'] },
            { _id: '2', name: 'Commercial Flour Mill FM-X', description: 'High speed grinding with stone mechanism. 20HP motor.', category: 'Mills', price: 0, images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758'] },
            { _id: '3', name: 'Industrial Veg Cutter V-300', description: 'Multifunctional cutting blades included. Continuous operation.', category: 'Cutters', price: 0, images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232'] },
            { _id: '4', name: 'Dough Kneader DK-50', description: '50kg capacity spiral kneader for commercial bakeries.', category: 'Kneaders', price: 0, images: ['https://images.unsplash.com/photo-1581092162384-8987c1d64718'] },
            { _id: '5', name: 'Onion Peeler OP-Pro', description: 'Automatic onion peeling machine, 200kg/hr output.', category: 'Peelers', price: 0, images: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc'] },
            { _id: '6', name: 'Pulverizer Machine P-Max', description: 'Heavy duty spices grinding machine with double chamber.', category: 'Mills', price: 0, images: ['https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0'] }
          ];
        }

        setProducts(finalProducts);

        if (settingsRes?.data?.success && settingsRes.data.data) {
          try {
            setCategoryOrder(JSON.parse(settingsRes.data.data));
          } catch (e) {
            console.error("Failed to parse categoryOrder:", e);
          }
        }
      } catch (error) {
        console.log(error);
        setProducts([
          { _id: '1', name: 'Heavy Duty Potato Slicer HP-500', description: 'Cuts 500kg/hr. Stainless steel body with premium blades.', category: 'Slicers', price: 0, images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'] },
          { _id: '2', name: 'Commercial Flour Mill FM-X', description: 'High speed grinding with stone mechanism. 20HP motor.', category: 'Mills', price: 0, images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758'] },
          { _id: '3', name: 'Industrial Veg Cutter V-300', description: 'Multifunctional cutting blades included. Continuous operation.', category: 'Cutters', price: 0, images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232'] },
          { _id: '4', name: 'Dough Kneader DK-50', description: '50kg capacity spiral kneader for commercial bakeries.', category: 'Kneaders', price: 0, images: ['https://images.unsplash.com/photo-1581092162384-8987c1d64718'] },
          { _id: '5', name: 'Onion Peeler OP-Pro', description: 'Automatic onion peeling machine, 200kg/hr output.', category: 'Peelers', price: 0, images: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc'] },
          { _id: '6', name: 'Pulverizer Machine P-Max', description: 'Heavy duty spices grinding machine with double chamber.', category: 'Mills', price: 0, images: ['https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0'] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndSettings();
  }, []);

  // Extract horsepower helper
  const extractHP = (product) => {
    const nameMatch = product.name?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
    if (nameMatch) {
      return `${nameMatch[1]} HP`;
    }
    
    if (product.table && Array.isArray(product.table)) {
      for (const row of product.table) {
        if (Array.isArray(row) && row.length >= 2) {
          const key = row[0]?.toUpperCase().trim();
          const value = row[1];
          if (key === "MOTOR" || key === "POWER" || key === "MOTOR POWER" || key === "HP" || key === "H.P.") {
            const match = value?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
            if (match) {
              return `${match[1]} HP`;
            }
            const rawNumberMatch = value?.match(/(\d+(\.\d+)?)/);
            if (rawNumberMatch) {
              return `${rawNumberMatch[1]} HP`;
            }
          }
        }
      }
    }
    
    if (product.description) {
      const descMatch = product.description.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
      if (descMatch) {
        return `${descMatch[1]} HP`;
      }
    }
    
    return null;
  };

  // Derive dynamic options for filters
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const productsForHP = selectedCategory === "ALL" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const hpOptions = [...new Set(productsForHP.map(p => extractHP(p)).filter(Boolean))].sort((a, b) => {
    return parseFloat(a) - parseFloat(b);
  });

  useEffect(() => {
    if (selectedCategory !== "ALL" && selectedHP !== "ALL") {
      const availableHPs = products
        .filter((p) => p.category === selectedCategory)
        .map((p) => extractHP(p));
      const hasNone = availableHPs.some((hp) => !hp);
      const validHPs = availableHPs.filter(Boolean);

      if (selectedHP === "NONE" && !hasNone) {
        setSelectedHP("ALL");
      } else if (selectedHP !== "NONE" && !validHPs.includes(selectedHP)) {
        setSelectedHP("ALL");
      }
    }
  }, [selectedCategory, products, selectedHP]);

  // Filter products logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory;
    
    const productHP = extractHP(product);
    const matchesHP = selectedHP === "ALL" || 
      (selectedHP === "NONE" && !productHP) || 
      (productHP === selectedHP);
      
    const matchesSearch = searchQuery.trim() === "" || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesHP && matchesSearch;
  });

  const getHPNumeric = (product) => {
    const hpString = extractHP(product);
    if (!hpString) return Infinity;
    const match = hpString.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : Infinity;
  };

  // Apply sorting
  filteredProducts.sort((a, b) => {
    if (selectedCategory === "ALL") {
      const getCategoryIndex = (cat) => {
        const index = categoryOrder.indexOf(cat);
        return index === -1 ? Infinity : index;
      };
      const catIndexA = getCategoryIndex(a.category);
      const catIndexB = getCategoryIndex(b.category);
      
      if (catIndexA !== catIndexB) {
        return catIndexA - catIndexB;
      }
    }
    
    const hpA = getHPNumeric(a);
    const hpB = getHPNumeric(b);
    return hpA - hpB;
  });

  const clearFilters = () => {
    setSelectedCategory("ALL");
    setSelectedHP("ALL");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Navbar />

      <main className="flex-grow">
        {/* Premium Header */}
        <section className="bg-brand-sage/30 text-brand-charcoal py-10 relative overflow-hidden border-b border-brand-sand">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-block px-3 py-1 bg-white border border-brand-sand text-brand-forest text-[10px] font-bold tracking-widest uppercase mb-6"
            >
              Our Catalog
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl md:text-5xl font-bold mb-4 text-brand-forest tracking-tight"
            >
              Shop <span className="text-brand-charcoal">Machines</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-brand-gray max-w-xl leading-relaxed font-semibold"
            >
              Explore our comprehensive range of heavy-duty, commercial-grade food processing equipment engineered for reliability and high output.
            </motion.p>
          </div>
        </section>

        {/* Filter Bar */}
        {!loading && products.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pt-10 pb-2 relative z-20">
            <div className="bg-white border border-brand-sand p-6 flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-end shadow-sm">
              
              {/* Search */}
              <div className="flex-grow flex flex-col gap-1">
                <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search machines by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-brand-sand focus:border-brand-forest bg-white outline-none text-xs font-semibold placeholder:text-brand-gray/40 transition-all font-sans"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray/50 text-xs">🔍</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                {/* Category Dropdown */}
                <div className="flex flex-col gap-1 min-w-[180px]">
                  <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* HP Dropdown */}
                <div className="flex flex-col gap-1 min-w-[180px]">
                  <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">Motor Power (H.P.)</label>
                  <select
                    value={selectedHP}
                    onChange={(e) => setSelectedHP(e.target.value)}
                    className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
                  >
                    <option value="ALL">All HP Ratings</option>
                    <option value="NONE">No Motor / NA</option>
                    {hpOptions.map((hp) => (
                      <option key={hp} value={hp}>
                        {hp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset button */}
                {(selectedCategory !== "ALL" || selectedHP !== "ALL" || searchQuery.trim() !== "") && (
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-brand-forest text-white border border-brand-forest font-bold uppercase tracking-widest text-[10px] font-sans hover:bg-transparent hover:text-brand-forest transition-all cursor-pointer h-[38px]"
                  >
                    Clear
                  </button>
                )}
              </div>

            </div>
          </section>
        )}

        {/* Products Grid & List Section */}
        <section className="max-w-7xl mx-auto px-6 py-10 relative z-20">
          {!loading && products.length > 0 && (
            <div className="flex items-center justify-between mb-6 bg-white border border-brand-sand px-4 py-3 shadow-2xs">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-forest">
                Showing {filteredProducts.length} of {products.length} machines
              </p>

              {/* GRID / LIST VIEW TOGGLE BUTTONS */}
              <div className="flex items-center gap-1 border border-brand-sand p-0.5 bg-stone-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    viewMode === "grid"
                      ? "bg-brand-forest text-white shadow-2xs"
                      : "text-brand-gray hover:text-brand-forest"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid View</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                    viewMode === "list"
                      ? "bg-brand-forest text-white shadow-2xs"
                      : "text-brand-gray hover:text-brand-forest"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List View</span>
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-[300px] bg-white border border-brand-sand shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-forest"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                viewMode === "grid" ? (
                  /* GRID VIEW */
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product._id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  /* LIST VIEW */
                  <div className="space-y-4">
                    {filteredProducts.map((product, index) => {
                      const hp = extractHP(product);
                      const isCompared = isInCompare(product._id);

                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.03 }}
                          className="bg-white border border-brand-sand hover:border-brand-forest/40 hover:shadow-md transition-all duration-300 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                        >
                          {/* Image Thumbnail */}
                          <div className="w-full md:w-52 h-44 bg-brand-cream border border-brand-sand overflow-hidden shrink-0 relative">
                            <img
                              src={product.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.category && (
                              <span className="absolute top-2 left-2 bg-brand-sage/90 text-brand-forest border border-brand-sand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                                {product.category}
                              </span>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow space-y-2">
                            <h3 className="font-serif text-xl font-bold text-brand-charcoal group-hover:text-brand-forest transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-brand-gray text-xs font-semibold leading-relaxed line-clamp-2">
                              {product.description || "Industrial grade machine designed for optimal performance and durability in commercial kitchens."}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              {hp && (
                                <span className="bg-amber-400/20 text-brand-forest font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border border-amber-400/40">
                                  ⚡ {hp}
                                </span>
                              )}
                              {product.price && (
                                <span className="font-bold text-sm text-brand-forest">
                                  ₹{parseInt(product.price).toLocaleString("en-IN")}{" "}
                                  <span className="text-[10px] font-normal text-brand-gray">(Ex-Factory)</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-brand-sand/60">
                            <button
                              onClick={() => toggleCompare(product)}
                              className={`w-full md:w-auto px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
                                isCompared
                                  ? "bg-amber-400 text-brand-charcoal border-amber-500 font-extrabold"
                                  : "bg-white hover:bg-brand-forest hover:text-white text-brand-forest border-brand-sand"
                              }`}
                            >
                              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                              <span>{isCompared ? "Compared" : "Compare"}</span>
                            </button>

                            <Link
                              to={`/products/${product._id}`}
                              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-brand-forest text-white py-2 px-4 text-xs font-bold uppercase tracking-wider hover:bg-brand-forest/90 transition-colors shadow-2xs"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <a
                              href={`https://wa.me/919428156213?text=${encodeURIComponent(
                                `Hello Durga Manufactor! I am interested in ${product.name}. Please send best price & demo video.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full md:w-auto inline-flex items-center justify-center gap-1 bg-[#25D366] text-white py-2 px-4 text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shadow-2xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : (
                products.length > 0 && (
                  <div className="text-center bg-white p-16 border border-brand-sand shadow-sm">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="font-serif text-3xl font-bold text-brand-forest mb-3">No matching machines found</h3>
                    <p className="text-brand-gray text-sm font-semibold mb-6">Try clearing your filters or search query to see other machines.</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-brand-forest text-white border border-brand-forest font-bold uppercase tracking-widest text-xs font-sans hover:bg-transparent hover:text-brand-forest transition-all cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )
              )}
            </>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center bg-white p-16 border border-brand-sand shadow-sm">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="font-serif text-3xl font-bold text-brand-forest mb-3">No machines available</h3>
              <p className="text-brand-gray text-sm font-semibold">Check back later or contact our sales team for custom inventory.</p>
            </div>
          )}
          
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Products;