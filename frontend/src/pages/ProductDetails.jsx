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
        setProduct(res.data.data);

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
      <div className="min-h-screen flex flex-col bg-brand-light">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-brand-amber"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-light">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
          <h2 className="text-3xl font-bold">Machine Not Found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-brand-gray mb-10"
          >
            <Link to="/">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products">Machines</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-amber">{product.category}</span>
          </motion.div>

          <div className="bg-white rounded-3xl p-8 shadow-xl grid lg:grid-cols-2 gap-16">
            {/* Product Image */}
            <div>
              <img
                src={
                  product.images?.[0] ||
                  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                }
                alt={product.name}
                className="rounded-2xl w-full"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <p className="text-gray-600 mb-8">{product.description}</p>

              {/* MACHINE SPECIFICATION TABLE */}

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="text-brand-amber" />
                  Machine Specifications
                </h3>

                {product.table && product.table.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                      <tbody>
                        {product.table.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`border-b ${
                              rowIndex === 0 ? "bg-gray-100 font-semibold" : ""
                            }`}
                          >
                            {row.map((cell, colIndex) => (
                              <td
                                key={colIndex}
                                className="px-4 py-3 border-r text-sm"
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
                  <p className="text-gray-400">
                    No specification table available
                  </p>
                )}
              </div>

              {/* CLIENT INQUIRY FORM */}

              <div className="bg-brand-light p-6 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-4">Send Inquiry</h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 border rounded-lg"
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
                    className="w-full p-3 border rounded-lg"
                    value={client.phone}
                    onChange={(e) =>
                      setClient({ ...client, phone: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="City"
                    className="w-full p-3 border rounded-lg"
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
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition
                ${
                  isFormValid
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Phone className="w-5 h-5" />
                Send Inquiry on WhatsApp
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
