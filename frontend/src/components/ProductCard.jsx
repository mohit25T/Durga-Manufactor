import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function ProductCard({ product, index = 0 }) {
  // Simple fallback image if not provided
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-3xl shadow-sm border border-black/5 hover:shadow-2xl hover:shadow-brand-amber/10 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-brand-slateDark/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Category Tag */}
        {product.category && (
          <div className="absolute top-4 left-4 z-20 glass px-3 py-1 rounded-full text-xs font-bold text-brand-slateDark uppercase tracking-wider backdrop-blur-md">
            {product.category}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-8 flex flex-col flex-grow relative">
        <h3 className="text-2xl font-extrabold text-brand-slateDark mb-3 group-hover:text-brand-amber transition-colors">
          {product.name}
        </h3>
        
        <p className="text-brand-gray font-medium leading-relaxed line-clamp-2 mb-8 flex-grow">
          {product.description || "Industrial grade machine designed for optimal performance and durability in commercial kitchens."}
        </p>
        
        <div className="pt-6 border-t border-brand-slate/10">
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center justify-between w-full font-bold text-brand-slateDark group-hover:text-brand-amber transition-colors"
          >
            <span>View Specifications</span>
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center group-hover:bg-brand-amber group-hover:text-white transition-all transform group-hover:rotate-45">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;