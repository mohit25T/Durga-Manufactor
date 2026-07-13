import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { motion } from "framer-motion";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedHP, setSelectedHP] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data.data);
      } catch (error) {
        console.log(error);
        // Fallback for UI visualization if API fails or backend is down
        setProducts([
          { _id: '1', name: 'Heavy Duty Potato Slicer HP-500', description: 'Cuts 500kg/hr. Stainless steel body with premium blades.', category: 'Slicers' },
          { _id: '2', name: 'Commercial Flour Mill FM-X', description: 'High speed grinding with stone mechanism. 20HP motor.', category: 'Mills' },
          { _id: '3', name: 'Industrial Veg Cutter V-300', description: 'Multifunctional cutting blades included. Continuous operation.', category: 'Cutters' },
          { _id: '4', name: 'Dough Kneader DK-50', description: '50kg capacity spiral kneader for commercial bakeries.', category: 'Kneaders' },
          { _id: '5', name: 'Onion Peeler OP-Pro', description: 'Automatic onion peeling machine, 200kg/hr output.', category: 'Peelers' },
          { _id: '6', name: 'Pulverizer Machine P-Max', description: 'Heavy duty spices grinding machine with double chamber.', category: 'Mills' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract horsepower helper
  const extractHP = (product) => {
    // 1. Try to find HP in the product name
    const nameMatch = product.name?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
    if (nameMatch) {
      return `${nameMatch[1]} HP`;
    }
    
    // 2. Try to find HP in the table spec
    if (product.table && Array.isArray(product.table)) {
      for (const row of product.table) {
        if (Array.isArray(row) && row.length >= 2) {
          const key = row[0]?.toUpperCase().trim();
          const value = row[1];
          if (key === "MOTOR" || key === "POWER" || key === "MOTOR POWER") {
            const match = value?.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
            if (match) {
              return `${match[1]} HP`;
            }
          }
        }
      }
    }
    
    // 3. Try to find HP in the description
    if (product.description) {
      const descMatch = product.description.match(/(\d+(\.\d+)?)\s*(?:H\.P\.|HP)(?!\w)/i);
      if (descMatch) {
        return `${descMatch[1]} HP`;
      }
    }
    
    return null;
  };

  // Derive dynamic options for filters
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  const hpOptions = [...new Set(products.map(p => extractHP(p)).filter(Boolean))].sort((a, b) => {
    return parseFloat(a) - parseFloat(b);
  });

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

        {/* Products Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-10 relative z-20">
          
          {loading ? (
            <div className="flex justify-center items-center h-[300px] bg-white border border-brand-sand shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-forest"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} />
                  ))}
                </div>
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