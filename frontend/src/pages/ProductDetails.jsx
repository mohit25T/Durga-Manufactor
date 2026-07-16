import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Phone } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const viewTracked = useRef(false);

  const [client, setClient] = useState({
    name: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data.data;

        setProduct(data);

        if (data.images?.length) {
          setSelectedImage(data.images[0]);
        }

        if (!viewTracked.current) {
          viewTracked.current = true;
          await API.post(`/products/${id}/view`);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const generateWhatsAppLink = () => {
    if (!product?.whatsappNumbers?.length) return "#";

    const pageLink = window.location.href;

    const message = `
Hello,

Client Inquiry Details:

Name: ${client.name}
Phone: ${client.phone}
City: ${client.city}

Interested Product:
${product.name}
Category: ${product.category}

Product Link:
${pageLink}

Please share price and more details.

Thank you.
`;

    return `https://wa.me/${product.whatsappNumbers[0]}?text=${encodeURIComponent(
      message,
    )}`;
  };

  const isFormValid =
    client.name.trim() !== "" &&
    client.phone.trim() !== "" &&
    client.city.trim() !== "";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-cream">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-forest"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-cream">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
          <h2 className="font-serif text-3xl font-bold text-brand-forest">Machine Not Found</h2>
          <Link to="/products" className="mt-4 text-xs tracking-widest uppercase font-bold text-brand-forest underline">Back to Catalog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <Navbar />

      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs font-bold text-brand-gray/80 mb-6 font-sans uppercase tracking-wider"
          >
            <Link to="/" className="hover:text-brand-forest transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray/40" />
            <Link to="/products" className="hover:text-brand-forest transition">Machines</Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray/40" />
            <span className="text-brand-forest">{product.category}</span>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            
            {/* PRODUCT IMAGE GALLERY */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-brand-sand p-3 shadow-sm">
                <img
                  src={
                    selectedImage ||
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  }
                  alt={product.name}
                  className="w-full h-auto object-contain bg-brand-cream aspect-square border border-brand-sand/40"
                />
              </div>

              {/* THUMBNAILS */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`cursor-pointer bg-white p-1 border aspect-square transition-all ${
                        selectedImage === img
                          ? "border-brand-forest"
                          : "border-brand-sand hover:border-brand-gray"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="lg:col-span-3 bg-white border border-brand-sand p-6 md:p-8 shadow-sm space-y-6">
              <div>
                {product.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-forest bg-brand-sage/40 border border-brand-sand px-2.5 py-1 inline-block mb-4">
                    {product.category}
                  </span>
                )}
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-forest tracking-tight mb-3">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="text-brand-gray font-semibold text-xs md:text-sm leading-relaxed">{product.description}</p>
                )}
              </div>

              {/* MACHINE SPECIFICATION TABLE */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-brand-forest flex items-center gap-2">
                  <CheckCircle2 className="text-brand-forest w-4 h-4" />
                  Machine Specifications
                </h3>

                {product.table && product.table.length > 0 && product.table.some(row => row.some(cell => cell && cell.trim() !== "")) ? (
                  <div className="overflow-x-auto border border-brand-sand">
                    <table className="w-full border-collapse">
                      <tbody>
                        {product.table.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`border-b border-brand-sand last:border-0 ${
                              rowIndex === 0 ? "bg-brand-sage/20 font-bold font-sans text-brand-forest" : "text-brand-charcoal"
                            }`}
                          >
                            {row.map((cell, colIndex) => (
                              <td
                                key={colIndex}
                                className={`px-3 py-2 text-xs font-semibold border-r border-brand-sand last:border-r-0 ${
                                  rowIndex === 0 ? "uppercase tracking-wider font-sans text-[10px]" : ""
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-brand-gray text-xs font-semibold">
                    No specifications list available for this unit.
                  </p>
                )}
              </div>

              {/* CLIENT INQUIRY FORM */}
              <div className="bg-brand-cream/40 border border-brand-sand p-4 space-y-3">
                <h3 className="font-serif text-base font-bold text-brand-forest">
                  Send Inquiry
                </h3>

                <div className="space-y-2 font-semibold">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full py-2 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none rounded-none text-xs placeholder:text-brand-gray/50 transition-all font-semibold"
                    value={client.name}
                    onChange={(e) =>
                      setClient({ ...client, name: e.target.value })
                    }
                  />

                  <input
                    required
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Mobile Number"
                    className="w-full py-2 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none rounded-none text-xs placeholder:text-brand-gray/50 transition-all font-semibold"
                    value={client.phone}
                    onChange={(e) =>
                      setClient({ ...client, phone: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="City"
                    className="w-full py-2 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none rounded-none text-xs placeholder:text-brand-gray/50 transition-all font-semibold"
                    value={client.city}
                    onChange={(e) =>
                      setClient({ ...client, city: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* WHATSAPP BUTTON */}
              <a
                href={isFormValid ? generateWhatsAppLink() : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 px-6 py-4.5 rounded-none font-bold uppercase tracking-widest text-xs font-sans border transition-all duration-300
                ${
                  isFormValid
                    ? "bg-green-600 border-green-600 text-white hover:bg-transparent hover:text-green-600"
                    : "bg-brand-cream border-brand-sand text-brand-gray/40 cursor-not-allowed"
                }`}
              >
                <Phone className="w-4 h-4 shrink-0" />
                Inquire on WhatsApp
              </a>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;