import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import { ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function AddProduct() {
  const navigate = useNavigate();

  const DEFAULT_WHATSAPP_NUMBERS = "919825870821, 919428156213, 919909917008";
  const [useDefaultWhatsApp, setUseDefaultWhatsApp] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    whatsappNumbers: "",
  });

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setUseDefaultWhatsApp(checked);
    setProduct((prev) => ({
      ...prev,
      whatsappNumbers: checked ? DEFAULT_WHATSAPP_NUMBERS : "",
    }));
  };

  const [tableData, setTableData] = useState([
    ["", ""],
    ["", ""],
  ]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  /* IMAGE HANDLER */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    const previewImages = files.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...previewImages]);
  };

  const removeImage = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* TABLE HANDLERS */

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updated = [...tableData];
    updated[rowIndex][colIndex] = value;
    setTableData(updated);
  };

  const addRow = () => {
    const cols = tableData[0].length;
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
      row.filter((_, i) => i !== colIndex)
    );

    setTableData(updated);
  };

  /* SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("price", product.price);

      const tableHasData = tableData.some((row) =>
        row.some((cell) => cell.trim() !== "")
      );

      if (!tableHasData) {
        alert("Please add at least one table value.");
        setLoading(false);
        return;
      }

      formData.append("table", JSON.stringify(tableData));

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
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/admin/products"
            className="w-12 h-12 bg-brand-light rounded-none border border-brand-sand shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-brand-slateDark mb-2 tracking-tight">
              Add New Machine
            </h1>

            <p className="text-brand-gray text-sm">
              Create a new product listing in your catalog.
            </p>
          </div>
        </div>

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 rounded-none border flex items-center gap-4"
          >
            <CheckCircle2 className="text-green-600" />
            Product Added Successfully!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-brand-light p-8 rounded-none shadow border border-brand-sand">

              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Info className="text-orange-500" />
                <h2 className="text-lg font-bold">
                  General Information
                </h2>
              </div>

              <input
                required
                placeholder="Machine Name"
                className="w-full px-4 py-3 bg-stone-50 rounded-none mb-4 border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />

              <textarea
                required
                rows="4"
                placeholder="Description"
                className="w-full px-4 py-3 bg-stone-50 rounded-none mb-6 border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />

              {/* TABLE */}

              <label className="text-sm font-bold block mb-2">
                Machine Specification Table
              </label>

              <div className="flex gap-3 mb-4">

                <button
                  type="button"
                  onClick={addRow}
                  className="bg-black text-white px-4 py-2 rounded-none"
                >
                  + Add Row
                </button>

                <button
                  type="button"
                  onClick={addColumn}
                  className="bg-black text-white px-4 py-2 rounded-none"
                >
                  + Add Column
                </button>

              </div>

              <div className="overflow-x-auto">
                <table className="border w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100/50 border-b">
                      {tableData[0]?.map((_, colIndex) => (
                        <th key={colIndex} className="border p-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between gap-2">
                            <span>Col {colIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => deleteColumn(colIndex)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50 px-2 py-1 rounded-none text-[10px] font-bold tracking-wide uppercase transition-all duration-200 hover:shadow-sm"
                              title={`Delete Column ${colIndex + 1}`}
                            >
                              ✕ Col
                            </button>
                          </div>
                        </th>
                      ))}
                      <th className="border p-2 text-xs font-bold text-gray-500 uppercase tracking-wider w-32 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border p-2">
                            <input
                              className="w-full p-2 bg-stone-50 rounded-none border border-brand-sand/60 focus:outline-none focus:ring-1 focus:ring-brand-amber/80 focus:border-brand-amber/80 transition-all duration-150"
                              value={cell}
                              onChange={(e) =>
                                handleCellChange(
                                  rowIndex,
                                  colIndex,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                        <td className="border p-2 text-center">
                          <button
                            type="button"
                            onClick={() => deleteRow(rowIndex)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 px-3 py-1.5 rounded-none text-xs font-semibold tracking-wide transition-all duration-200 hover:shadow-sm"
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

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <label className="text-sm font-bold block mb-1">Category</label>
              <input
                required
                placeholder="Category"
                className="w-full px-4 py-3 bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              />
            </div>

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <label className="text-sm font-bold block mb-1">Price</label>
              <input
                type="number"
                placeholder="Price"
                className="w-full px-4 py-3 bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand space-y-3">
              <label className="text-sm font-bold block">WhatsApp Contacts</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useDefaultWhatsApp"
                  checked={useDefaultWhatsApp}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded-none focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="useDefaultWhatsApp" className="text-xs font-semibold text-gray-600 cursor-pointer select-none">
                  Use default contact numbers
                </label>
              </div>
              <input
                placeholder="WhatsApp Numbers (comma-separated)"
                value={product.whatsappNumbers}
                className="w-full px-4 py-3 bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) => {
                  const value = e.target.value;
                  setProduct({
                    ...product,
                    whatsappNumbers: value,
                  });
                  setUseDefaultWhatsApp(value === DEFAULT_WHATSAPP_NUMBERS);
                }}
              />
            </div>

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand space-y-4">
              <label className="text-sm font-bold block">Product Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            {/* IMAGE PREVIEW */}

            <div className="grid grid-cols-3 gap-3">

              {preview.map((img, index) => (

                <div key={index} className="relative">

                  <img
                    src={img}
                    className="rounded-none"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-rose-100 text-rose-700 hover:bg-rose-200 px-2 py-1 rounded-none text-xs border border-rose-200"
                  >
                    ✕
                  </button>

                </div>

              ))}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-none font-bold text-lg"
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