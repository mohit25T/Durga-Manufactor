import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import API from "../services/api";
import { getOptimizedImageUrl } from "../utils/image";
import {
  PackageSearch,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  ArrowUp,
  ArrowDown,
  X,
  Star,
  MessageSquare,
} from "lucide-react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [categoryOrder, setCategoryOrder] = useState([]);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [modalCategories, setModalCategories] = useState([]);

  const [selectedReviewProduct, setSelectedReviewProduct] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const fetched = useRef(false);

  useEffect(() => {
    const fetchCategoryOrder = async () => {
      try {
        const res = await API.get("/settings/categoryOrder");
        if (res.data?.success && res.data.data) {
          try {
            setCategoryOrder(JSON.parse(res.data.data));
          } catch (e) {
            console.error("Failed to parse categoryOrder:", e);
          }
        }
      } catch (error) {
        console.error("Error loading category order:", error);
      }
    };
    fetchCategoryOrder();
  }, []);

  const handleOpenReorderModal = () => {
    const uniqueCats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    
    // Sort uniqueCats using current categoryOrder
    const sorted = uniqueCats.sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    setModalCategories(sorted);
    setIsReorderModalOpen(true);
  };

  const handlePositionChange = (currentIndex, val) => {
    const targetPos = parseInt(val, 10);
    if (isNaN(targetPos) || targetPos < 1 || targetPos > modalCategories.length) {
      return;
    }
    const newIndex = targetPos - 1;
    if (newIndex === currentIndex) return;

    const updated = [...modalCategories];
    const [item] = updated.splice(currentIndex, 1);
    updated.splice(newIndex, 0, item);
    setModalCategories(updated);
  };

  const handleSaveOrder = async () => {
    setPriorityLoading(true);
    try {
      await API.put("/settings/categoryOrder", { value: JSON.stringify(modalCategories) });
      setCategoryOrder(modalCategories);
      setIsReorderModalOpen(false);
      alert("Category order saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save category order.");
    } finally {
      setPriorityLoading(false);
    }
  };

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

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setDeletingReviewId(reviewId);
    try {
      const res = await API.delete(`/products/${productId}/reviews/${reviewId}`);
      if (res.data?.success) {
        const updatedProduct = res.data.data;
        setSelectedReviewProduct(updatedProduct);
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? updatedProduct : p))
        );
      }
    } catch (error) {
      console.error("Delete review error:", error);
      alert("Failed to delete review.");
    } finally {
      setDeletingReviewId(null);
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

      {/* Priority Display Setting */}
      <div className="bg-brand-light p-6 rounded-none shadow-md border border-brand-sand mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-base font-bold text-brand-slateDark mb-1">
            Category Display Order
          </h2>
          <p className="text-brand-gray text-xs font-semibold">
            Customize the order in which categories appear in the customer catalog.
          </p>
        </div>

        <button
          onClick={handleOpenReorderModal}
          className="flex items-center gap-2 bg-brand-slateDark hover:bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-none duration-150"
        >
          Reorder Categories
        </button>
      </div>

      {/* Reorder Modal */}
      {isReorderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full border border-brand-sand shadow-2xl p-6 relative rounded-none flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-brand-sand mb-4 shrink-0">
              <h3 className="font-serif text-lg font-bold text-brand-forest">
                Set Category Order
              </h3>
              <button
                onClick={() => setIsReorderModalOpen(false)}
                className="text-brand-gray hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto py-2 pr-1 space-y-3">
              <p className="text-brand-gray text-xs font-semibold mb-4 leading-relaxed">
                Use the Move Up and Move Down buttons to prioritize categories. Categories at the top will be displayed first in the catalog.
              </p>

              {modalCategories.length === 0 ? (
                <div className="text-center py-6 text-brand-gray text-xs font-semibold">
                  No active categories found in inventory.
                </div>
              ) : (
                <div className="divide-y border border-brand-sand/60 divide-brand-sand/40">
                  {modalCategories.map((cat, idx) => (
                    <div
                      key={cat}
                      className="flex justify-between items-center py-3 px-4 bg-stone-50 hover:bg-stone-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-brand-forest/10 border border-brand-forest/20 text-brand-forest font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs uppercase tracking-wider text-brand-slateDark">
                          {cat}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-brand-gray uppercase tracking-wider">
                          Position:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={modalCategories.length}
                          key={`${cat}-${idx}`}
                          defaultValue={idx + 1}
                          onBlur={(e) => handlePositionChange(idx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            }
                          }}
                          className="w-16 px-2 py-1 text-center border border-brand-sand bg-white font-bold text-xs outline-none focus:border-brand-amber rounded-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-brand-sand mt-4 flex gap-3 justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="px-4 py-2 border border-brand-sand text-xs font-bold uppercase tracking-widest text-brand-slate hover:bg-stone-50 transition-all rounded-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={priorityLoading}
                className="px-5 py-2 bg-brand-forest text-white border border-brand-forest text-xs font-bold uppercase tracking-widest hover:bg-brand-forest/90 transition-all rounded-none disabled:opacity-50"
              >
                {priorityLoading ? "Saving..." : "Save Order"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Rating / Reviews
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
                              src={getOptimizedImageUrl(product.images[0], 100, 70)}
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

                    {/* REVIEWS */}
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setSelectedReviewProduct(product)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{(product.averageRating || 0).toFixed(1)}</span>
                        <span className="text-gray-500 font-normal">({product.numReviews || 0})</span>
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedReviewProduct(product)}
                          title="Manage Reviews"
                          className="p-2 text-amber-600 hover:text-amber-800"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() =>
                            window.open(`/#/products/${product._id}`, "_blank")
                          }
                          title="View on Site"
                          className="p-2 text-brand-gray hover:text-brand-slate"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/admin/edit-product/${product._id}`)
                          }
                          title="Edit Product"
                          className="p-2 text-blue-500"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          title="Delete Product"
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

      {/* MANAGE REVIEWS MODAL */}
      {selectedReviewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full border border-brand-sand shadow-2xl p-6 relative rounded-none flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-start pb-4 border-b border-brand-sand mb-4 shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-forest">
                  Product Reviews Moderation
                </h3>
                <p className="text-xs font-semibold text-brand-gray mt-0.5">
                  {selectedReviewProduct.name} &bull; Average Rating: ⭐ {(selectedReviewProduct.averageRating || 0).toFixed(1)} ({selectedReviewProduct.numReviews || 0} reviews)
                </p>
              </div>
              <button
                onClick={() => setSelectedReviewProduct(null)}
                className="text-brand-gray hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 space-y-3">
              {selectedReviewProduct.reviews && selectedReviewProduct.reviews.length > 0 ? (
                selectedReviewProduct.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 bg-stone-50 border border-brand-sand flex justify-between items-start gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-brand-slateDark">{rev.name}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-brand-gray">
                          {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-gray leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(selectedReviewProduct._id, rev._id)}
                      disabled={deletingReviewId === rev._id}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-brand-gray text-xs font-semibold space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto opacity-30" />
                  <p>No customer reviews submitted yet for this product.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-brand-sand mt-4 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReviewProduct(null)}
                className="px-5 py-2 bg-brand-slateDark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all rounded-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Products;
