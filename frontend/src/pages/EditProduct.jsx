import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import { ArrowLeft, Trash2, Save, RefreshCw } from "lucide-react";

function EditProduct() {
  const { id } = useParams();
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
  const [newPreview, setNewPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  /* FETCH PRODUCT */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data.data;

        const whatsappStr = Array.isArray(data.whatsappNumbers)
          ? data.whatsappNumbers.join(", ")
          : "";

        setProduct({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          price: data.price || "",
          whatsappNumbers: whatsappStr,
        });

        setUseDefaultWhatsApp(whatsappStr === DEFAULT_WHATSAPP_NUMBERS);

        setTableData(data.table?.length ? data.table : [["", ""]]);

        setPreview(Array.isArray(data.images) ? data.images : []);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* TABLE FUNCTIONS */

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
    if (tableData.length === 1) return;
    setTableData(tableData.filter((_, i) => i !== rowIndex));
  };

  const deleteColumn = (colIndex) => {
    if (tableData[0].length === 1) return;

    const updated = tableData.map((row) =>
      row.filter((_, i) => i !== colIndex),
    );

    setTableData(updated);
  };

  /* IMAGE HANDLER */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    const previewImages = files.map((file) => URL.createObjectURL(file));

    setNewPreview((prev) => [...prev, ...previewImages]);
  };

  const removeNewImage = (index) => {
    setNewPreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteImage = async (imageUrl) => {
    try {
      await API.delete(`/products/${id}/image`, {
        data: { imageUrl },
      });

      setPreview((prev) => prev.filter((img) => img !== imageUrl));
    } catch (error) {
      console.error(error);
      setPreview((prev) => prev.filter((img) => img !== imageUrl));
    }
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

      const numbers = product.whatsappNumbers
        ? product.whatsappNumbers.split(",").map((num) => num.trim()).filter((num) => num !== "")
        : [];
      formData.append("whatsappNumbers", JSON.stringify(numbers));

      formData.append("table", JSON.stringify(tableData));

      images.forEach((img) => formData.append("images", img));

      await API.put(`/products/${id}`, formData);

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Error updating product.");
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
      <div className="w-full">
        {/* HEADER */}

        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/admin/products"
            className="w-12 h-12 bg-brand-light rounded-none border border-brand-sand flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-brand-slateDark mb-2 tracking-tight">Edit Machine</h1>
            <p className="text-brand-gray text-sm">Update the machine specifications and details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-4 gap-8">
          {/* LEFT SIDE */}

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <label className="text-sm font-bold block mb-1">Machine Name</label>

              <input
                value={product.name}
                className="w-full py-2 px-3 text-sm bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value,
                  })
                }
              />

              <label className="text-sm font-bold block mt-4 mb-1">Description</label>

              <textarea
                rows="4"
                value={product.description}
                className="w-full py-2 px-3 text-sm bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description: e.target.value,
                  })
                }
              />

              {/* TABLE */}

              <label className="font-bold block mt-6 mb-3">
                Machine Specification Table
              </label>

              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-black text-white px-4 py-2 rounded-none"
                >
                  + Row
                </button>

                <button
                  type="button"
                  onClick={addColumn}
                  className="bg-black text-white px-4 py-2 rounded-none"
                >
                  + Column
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
                              value={cell}
                              className="w-full p-2 bg-gray-100 rounded-none border border-brand-sand/60 focus:outline-none focus:ring-1 focus:ring-brand-amber/80 focus:border-brand-amber/80 transition-all duration-150"
                              onChange={(e) =>
                                handleCellChange(
                                  rowIndex,
                                  colIndex,
                                  e.target.value,
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

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <label className="text-sm font-bold mb-1 block">Price</label>

              <input
                type="number"
                value={product.price}
                className="w-full py-2 px-3 text-sm bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-8">
            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <label className="text-sm font-bold mb-1 block">Category</label>

              <input
                value={product.category}
                className="w-full py-2 px-3 text-sm bg-stone-50 rounded-none border border-brand-sand/60"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <label className="text-sm font-bold mb-1 block">WhatsApp Contacts</label>
              <div className="flex items-center gap-2 mb-2">
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
                value={product.whatsappNumbers}
                className="w-full py-2 px-3 text-sm bg-stone-50 rounded-none border border-brand-sand/60"
                placeholder="WhatsApp Numbers (comma separated)"
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

            <div className="bg-brand-light p-6 rounded-none shadow border border-brand-sand">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
              />

              <div className="grid grid-cols-2 gap-3">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="rounded-none" />

                    <button
                      type="button"
                      onClick={() => deleteImage(img)}
                      className="absolute top-2 right-2 bg-rose-100 text-rose-700 hover:bg-rose-200 p-1.5 rounded-none border border-rose-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {newPreview.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="rounded-none" />

                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-2 right-2 bg-rose-100 text-rose-700 hover:bg-rose-200 p-1.5 rounded-none border border-rose-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-none font-bold flex items-center justify-center gap-2"
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