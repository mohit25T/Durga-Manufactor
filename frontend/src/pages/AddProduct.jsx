import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import {
  ArrowLeft,
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

  /* ---------------- CUSTOM TABLE STATE ---------------- */

  const [tableData, setTableData] = useState([
    ["", ""],
    ["", ""],
  ]);

  /* ---------------- EXISTING STATES ---------------- */

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  /* ---------------- IMAGE HANDLER ---------------- */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewImages = files.map((file) => URL.createObjectURL(file));
    setPreview(previewImages);
  };

  /* ---------------- SPECIFICATION HANDLER ---------------- */

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

  /* ---------------- TABLE FUNCTIONS ---------------- */

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updated = [...tableData];
    updated[rowIndex][colIndex] = value;
    setTableData(updated);
  };

  const addRow = () => {
    const cols = tableData.length > 0 ? tableData[0].length : 1;
    setTableData([...tableData, Array(cols).fill("")]);
  };

  const addColumn = () => {
    const updated = tableData.map((row) => [...row, ""]);
    setTableData(updated);
  };

  const deleteRow = (rowIndex) => {
    if (tableData.length === 1) {
      alert("At least one row is required.");
      return;
    }

    const updated = tableData.filter((_, i) => i !== rowIndex);
    setTableData(updated);
  };

  const deleteColumn = (colIndex) => {
    if (tableData[0].length === 1) {
      alert("At least one column is required.");
      return;
    }

    const updated = tableData.map((row) =>
      row.filter((_, i) => i !== colIndex),
    );

    setTableData(updated);
  };

  /* ---------------- SUBMIT ---------------- */

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
      formData.append("tableData", JSON.stringify(tableData));

      const numbers = product.whatsappNumbers
        .split(",")
        .map((num) => num.trim());

      formData.append("whatsappNumbers", JSON.stringify(numbers));

      images.forEach((img) => formData.append("images", img));

      await API.post("/products", formData);

      setStatus("success");

      setTimeout(() => navigate("/admin/add-products"), 2000);
    } catch (error) {
      console.error(error);
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/admin/products"
            className="w-12 h-12 bg-white rounded-xl border shadow-sm flex items-center justify-center hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold">Add New Machine</h1>
            <p className="text-gray-500">
              Create a new product listing in your catalog.
            </p>
          </div>
        </div>

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 rounded-2xl border flex items-center gap-4"
          >
            <CheckCircle2 className="text-green-600" />
            Product Added Successfully!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow border">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Info className="text-orange-500" />
                <h2 className="text-xl font-bold">General Information</h2>
              </div>

              {/* NAME */}

              <input
                required
                placeholder="Machine Name"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg mb-4"
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />

              {/* DESCRIPTION */}

              <textarea
                required
                rows="4"
                placeholder="Description"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg mb-6"
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />

              {/* SPECIFICATIONS */}

              <label className="font-bold mb-2 block">
                Technical Specifications
              </label>

              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    placeholder="Key"
                    value={spec.key}
                    className="px-4 py-3 bg-gray-100 rounded-lg"
                    onChange={(e) =>
                      handleSpecChange(index, "key", e.target.value)
                    }
                  />

                  <div className="flex gap-2">
                    <input
                      placeholder="Value"
                      value={spec.value}
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-lg"
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
                className="text-orange-500 font-semibold mb-8"
              >
                + Add Specification
              </button>

              {/* TABLE */}

              <label className="font-bold block mb-3">
                Custom Specification Table
              </label>

              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  + Add Row
                </button>

                <button
                  type="button"
                  onClick={addColumn}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  + Add Column
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="border w-full">
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border p-2">
                            <div className="flex gap-2">
                              <input
                                className="w-full p-2 bg-gray-100 rounded"
                                value={cell}
                                onChange={(e) =>
                                  handleCellChange(
                                    rowIndex,
                                    colIndex,
                                    e.target.value,
                                  )
                                }
                              />

                              <button
                                type="button"
                                onClick={() => deleteColumn(colIndex)}
                                className="bg-red-400 text-white px-2 rounded"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        ))}

                        <td className="border p-2">
                          <button
                            type="button"
                            onClick={() => deleteRow(rowIndex)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete Row
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-8">
            <input
              required
              placeholder="Category"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg"
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg"
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />

            <input
              placeholder="WhatsApp Numbers"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg"
              onChange={(e) =>
                setProduct({
                  ...product,
                  whatsappNumbers: e.target.value,
                })
              }
            />

            <input type="file" multiple onChange={handleImageChange} />

            <div className="grid grid-cols-3 gap-3">
              {preview.map((img, index) => (
                <img key={index} src={img} className="rounded-lg" />
              ))}
            </div>

            {/* ADD PRODUCT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg"
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
