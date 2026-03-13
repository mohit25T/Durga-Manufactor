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

        setProduct({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          price: data.price || "",
        });

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
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

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
          {/* LEFT SIDE */}

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

              {/* TABLE */}

              <label className="font-bold block mt-6 mb-3">
                Machine Specification Table
              </label>

              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  + Row
                </button>

                <button
                  type="button"
                  onClick={addColumn}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  + Column
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
                                value={cell}
                                className="w-full p-2 bg-brand-light rounded"
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

          {/* RIGHT SIDE */}

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
                accept="image/*"
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
                  <div key={i} className="relative">
                    <img src={img} className="rounded-lg" />

                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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