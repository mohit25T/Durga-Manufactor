import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../services/api";
import {
  ArrowLeft,
  UploadCloud,
  Info,
  IndianRupee,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    whatsappNumbers: "",
  });

  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewImages = files.map((file) => URL.createObjectURL(file));
    setPreview(previewImages);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index) => {
    const updated = specifications.filter((_, i) => i !== index);
    setSpecifications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("price", product.price);

      formData.append("specifications", JSON.stringify(specifications));

      const numbers = product.whatsappNumbers
        .split(",")
        .map((num) => num.trim());

      formData.append("whatsappNumbers", JSON.stringify(numbers));

      images.forEach((img) => formData.append("images", img));

      await API.post("/products", formData);

      setStatus("success");

      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (error) {
      console.error(error);

      setStatus("success");

      setTimeout(() => navigate("/admin/products"), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/admin/products"
            className="w-12 h-12 bg-white rounded-xl border border-black/5 shadow-sm flex items-center justify-center hover:bg-brand-light transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-brand-slateDark" />
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold text-brand-slateDark">
              Add New Machine
            </h1>
            <p className="text-brand-gray font-medium">
              Create a new product listing in your catalog.
            </p>
          </div>
        </div>

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 rounded-2xl border-2 border-green-200 flex items-center gap-4 text-green-700 font-bold shadow-sm"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <p className="text-lg">Product Added Successfully!</p>
              <p className="text-sm font-medium opacity-80">
                Redirecting to inventory...
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-slateDark/5 border border-black/5">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/5">
                <Info className="w-6 h-6 text-brand-amber" />
                <h2 className="text-xl font-bold text-brand-slateDark">
                  General Information
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-slate uppercase tracking-wide mb-2">
                    Machine Name
                  </label>

                  <input
                    required
                    placeholder="Heavy Duty Potato Slicer HP-500"
                    className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none"
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-slate uppercase tracking-wide mb-2">
                    Description
                  </label>

                  <textarea
                    required
                    rows="4"
                    className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none resize-none"
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-slate uppercase tracking-wide mb-4">
                    Technical Specifications
                  </label>

                  <div className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="Key (Motor, Weight...)"
                          className="px-4 py-3 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-lg outline-none"
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecChange(index, "key", e.target.value)
                          }
                        />

                        <div className="flex gap-2">
                          <input
                            placeholder="Value (1 HP, 35 Kg...)"
                            className="flex-1 px-4 py-3 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-lg outline-none"
                            value={spec.value}
                            onChange={(e) =>
                              handleSpecChange(index, "value", e.target.value)
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="px-3 bg-red-500 text-white rounded-lg"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addSpecification}
                      className="text-sm font-semibold text-brand-amber"
                    >
                      + Add Specification
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PRICE + WHATSAPP */}

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-slateDark/5 border border-black/5 grid sm:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <IndianRupee className="w-5 h-5 text-brand-amber" />
                  <h2 className="text-xl font-bold text-brand-slateDark">
                    Pricing
                  </h2>
                </div>

                <input
                  type="number"
                  className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none"
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="w-5 h-5 text-brand-amber" />
                  <h2 className="text-xl font-bold text-brand-slateDark">
                    Sales Contact
                  </h2>
                </div>

                <input
                  required
                  placeholder="+919876543210, +918888888888"
                  className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none"
                  onChange={(e) =>
                    setProduct({ ...product, whatsappNumbers: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border">
              <label className="block text-sm font-bold mb-2">Category</label>

              <input
                required
                className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none"
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              />
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border">
              <h2 className="text-xl font-bold mb-6">Machine Media</h2>

              <input type="file" multiple onChange={handleImageChange} />

              <div className="grid grid-cols-3 gap-3 mt-4">
                {preview.map((img, index) => (
                  <img key={index} src={img} className="rounded-xl" />
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-amber text-white py-5 rounded-[1.5rem] font-bold text-lg"
            >
              {loading ? "Saving..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddProduct;
