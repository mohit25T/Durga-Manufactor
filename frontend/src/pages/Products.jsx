import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { motion } from "framer-motion";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
              className="font-serif text-3xl md:text-5xl font-bold mb-4 text-brand-forest lowercase tracking-tight"
            >
              shop <span className="text-brand-charcoal">machines</span>
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

        {/* Products Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-10 relative z-20">
          
          {loading ? (
            <div className="flex justify-center items-center h-[300px] bg-white border border-brand-sand shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-forest"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center bg-white p-16 border border-brand-sand shadow-sm">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="font-serif text-3xl font-bold text-brand-forest lowercase mb-3">No machines available</h3>
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