import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import { ArrowLeft, Trash2, Save, RefreshCw } from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [newPreview, setNewPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data.data;

        setProduct({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          price: data.price || "",
        });

        setSpecifications(
          data.specifications?.length
            ? data.specifications
            : [{ key: "", value: "" }],
        );

        setPreview(Array.isArray(data.images) ? data.images : []);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previewImages = files.map((file) => URL.createObjectURL(file));

    setNewPreview(previewImages);
  };

  const deleteImage = async (imageUrl) => {
    try {
      if (imageUrl.startsWith("blob:")) {
        setNewPreview((prev) => prev.filter((img) => img !== imageUrl));

        return;
      }

      await API.delete(`/products/${id}/image`, {
        data: { imageUrl },
      });

      setPreview((prev) => prev.filter((img) => img !== imageUrl));
    } catch (error) {
      console.error(error);

      setPreview((prev) => prev.filter((img) => img !== imageUrl));
    }
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

      const filteredSpecs = specifications.filter(
        (s) => s.key.trim() !== "" && s.value.trim() !== "",
      );

      formData.append("specifications", JSON.stringify(filteredSpecs));

      images.forEach((img) => formData.append("images", img));

      await API.put(`/products/${id}`, formData);

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-brand-amber rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/admin/products"
            className="w-12 h-12 bg-white rounded-xl border flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <h1 className="text-3xl font-extrabold">Edit Machine</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow">
              <label className="font-bold block mb-2">Machine Name</label>

              <input
                value={product.name}
                className="w-full p-3 bg-brand-light rounded-lg"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value,
                  })
                }
              />

              <label className="font-bold block mt-6 mb-2">Description</label>

              <textarea
                rows="4"
                value={product.description}
                className="w-full p-3 bg-brand-light rounded-lg"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description: e.target.value,
                  })
                }
              />

              {/* Specifications */}

              <label className="font-bold block mt-6 mb-4">
                Technical Specifications
              </label>

              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Key"
                      value={spec.key}
                      className="p-3 bg-brand-light rounded-lg"
                      onChange={(e) =>
                        handleSpecChange(index, "key", e.target.value)
                      }
                    />

                    <div className="flex gap-2">
                      <input
                        placeholder="Value"
                        value={spec.value}
                        className="flex-1 p-3 bg-brand-light rounded-lg"
                        onChange={(e) =>
                          handleSpecChange(index, "value", e.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="bg-red-500 text-white px-3 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-brand-amber font-semibold"
                >
                  + Add Specification
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow">
              <label className="font-bold mb-2 block">Price</label>

              <input
                type="number"
                value={product.price}
                className="w-full p-3 bg-brand-light rounded-lg"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow">
              <label className="font-bold mb-2 block">Category</label>

              <input
                value={product.category}
                className="w-full p-3 bg-brand-light rounded-lg"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow">
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="mb-4"
              />

              <div className="grid grid-cols-2 gap-3">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="rounded-lg" />

                    <button
                      type="button"
                      onClick={() => deleteImage(img)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {newPreview.map((img, i) => (
                  <img key={i} src={img} className="rounded-lg" />
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Save />}
              Save Updates
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditProduct;
