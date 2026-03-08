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
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />

      <main className="flex-grow">
        {/* Premium Header */}
        <section className="bg-brand-slateDark text-white pt-24 pb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-amber/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-block px-4 py-1.5 rounded-full border border-brand-amber/30 text-brand-amber text-sm font-bold tracking-widest uppercase mb-6"
            >
              Our Catalog
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
            >
              Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-amberHover">Machines</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-brand-gray max-w-2xl leading-relaxed"
            >
              Explore our comprehensive range of heavy-duty, commercial-grade food processing equipment engineered for reliability and high output.
            </motion.p>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 -mt-20 relative z-20">
          
          {loading ? (
            <div className="flex justify-center items-center h-[400px] bg-white rounded-3xl shadow-xl">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-amber"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center bg-white p-16 rounded-3xl shadow-xl border border-brand-slate/5">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-3xl font-bold text-brand-slateDark mb-3">No machines available</h3>
              <p className="text-brand-gray text-lg">Check back later or contact our sales team for custom inventory.</p>
            </div>
          )}
          
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Products;