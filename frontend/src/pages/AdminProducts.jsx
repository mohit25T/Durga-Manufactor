import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import {
  PackageSearch,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");

        const data = (res.data?.data || []).map((p) => ({
          ...p,
          views: p.views || 0,
        }));

        setProducts(data);
      } catch (error) {
        console.error(error);

        // fallback demo data
        setProducts([
          {
            _id: "1",
            name: "Heavy Duty Potato Slicer HP-500",
            category: "Slicers",
            price: "150000",
            views: 34,
            images: [
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200",
            ],
          },
          {
            _id: "2",
            name: "Commercial Flour Mill FM-X",
            category: "Mills",
            price: "210000",
            views: 18,
            images: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-slateDark mb-2">
            Manage Inventory
          </h1>
          <p className="text-brand-gray text-sm">
            View, edit, or remove machines from your catalog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-brand-gray">
              <Search className="h-4 w-4" />
            </div>

            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-brand-sand rounded-none outline-none focus:border-brand-amber text-sm font-semibold"
            />
          </div>

          <button
            onClick={() => navigate("/admin/add-product")}
            className="flex items-center gap-2 bg-brand-slateDark text-white px-4 py-2 rounded-none font-bold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-brand-light rounded-none shadow-md border border-brand-sand overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-amber"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light/50 border-b border-black/5">
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Price (₹)
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/5">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-brand-light/20 transition-colors"
                  >
                    {/* PRODUCT */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none bg-brand-light border overflow-hidden">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-gray">
                              <PackageSearch className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-brand-slateDark text-sm">
                            {product.name}
                          </p>

                          <p className="text-[10px] text-brand-gray font-mono">
                            ID: {product._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 bg-brand-amber/10 text-brand-amber text-xs font-bold rounded-none">
                        {product.category || "N/A"}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-3 font-bold text-xs">
                      {product.price
                        ? parseInt(product.price).toLocaleString("en-IN")
                        : "N/A"}
                    </td>

                    {/* VIEWS */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 text-brand-slateDark font-semibold text-xs">
                        <Eye className="w-4 h-4 text-brand-gray" />
                        {product.views}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            window.open(`/#/products/${product._id}`, "_blank")
                          }
                          className="p-2 text-brand-gray hover:text-brand-slate"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/edit-product/${product._id}`)
                          }
                          className="p-2 text-blue-500"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 text-rose-600 hover:text-rose-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-16 text-brand-gray">
                No products found
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default Products;
