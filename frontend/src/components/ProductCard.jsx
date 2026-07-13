import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function ProductCard({ product, index = 0 }) {
  // Simple fallback image if not provided
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group bg-white rounded-none border border-brand-sand hover:border-brand-forest/40 hover:shadow-lg hover:shadow-brand-forest/5 transition-all duration-500 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-brand-cream border-b border-brand-sand">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Category Tag */}
        {product.category && (
          <div className="absolute top-4 left-4 z-20 bg-brand-sage/90 text-brand-forest border border-brand-sand px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            {product.category}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-8 flex flex-col flex-grow relative">
        <h3 className="font-serif text-2xl font-bold text-brand-charcoal lowercase tracking-tight mb-3 group-hover:text-brand-red transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-brand-gray font-medium text-sm leading-relaxed line-clamp-2 mb-8 flex-grow">
          {product.description || "Industrial grade machine designed for optimal performance and durability in commercial kitchens."}
        </p>
        
        <div className="pt-6 border-t border-brand-sand/60">
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center justify-between w-full font-sans text-xs uppercase tracking-widest font-bold text-brand-forest group-hover:underline transition-all"
          >
            <span>View Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;