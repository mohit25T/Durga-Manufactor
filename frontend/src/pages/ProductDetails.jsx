import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Phone, X, ZoomIn, ZoomOut, Star, MessageSquare, User, Send, AlertCircle } from "lucide-react";
import ProgressiveImage from "../components/ProgressiveImage";
import { getOptimizedImageUrl } from "../utils/image";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [isWritingReview, setIsWritingReview] = useState(false);

  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      setReviewError("Please fill in both your name and comment.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await API.post(`/products/${id}/reviews`, reviewForm);
      if (res.data?.success) {
        setProduct(res.data.data);
        setReviewForm({ name: "", rating: 5, comment: "" });
        setReviewSuccess("Thank you! Your review has been posted.");
        setIsWritingReview(false);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    if (zoomScale <= 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoomScale]);

  const handleZoomDragStart = (e) => {
    if (zoomScale <= 1) return;
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleZoomDragMove = (e) => {
    if (!isDragging.current || zoomScale <= 1) return;
    // Panning bounds grow with zoomScale level
    const limitX = 350 * (zoomScale - 1);
    const limitY = 250 * (zoomScale - 1);
    const newX = Math.max(-limitX, Math.min(limitX, e.clientX - dragStartPos.current.x));
    const newY = Math.max(-limitY, Math.min(limitY, e.clientY - dragStartPos.current.y));
    setPanOffset({ x: newX, y: newY });
  };

  const handleZoomDragEnd = (e) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

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

  // Auto scroll/slide images
  const swipeDirection = useRef("");

  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1 || isZoomOpen) return;

    const interval = setInterval(() => {
      setSelectedImage((current) => {
        const images = product.images;
        const currentIndex = images.indexOf(current);
        const nextIndex = (currentIndex + 1) % images.length;
        swipeDirection.current = "left";
        return images[nextIndex];
      });
    }, 4000); // cycle every 4 seconds

    return () => clearInterval(interval);
  }, [product, isZoomOpen, selectedImage]);

  // Gesture Swipe State Management
  const swipeStartX = useRef(0);
  const hasSwiped = useRef(false);

  const handleDragStart = (clientX) => {
    swipeStartX.current = clientX;
    hasSwiped.current = false;
  };

  const handleDragMove = (clientX) => {
    if (hasSwiped.current) return;
    if (!product?.images || product.images.length <= 1) return;

    const diff = swipeStartX.current - clientX;
    const threshold = 40; // pixels to trigger swipe (40px is highly responsive)

    if (Math.abs(diff) > threshold) {
      hasSwiped.current = true;
      const currentIndex = product.images.indexOf(selectedImage);
      if (diff > 0) {
        swipeDirection.current = "left";
        const nextIdx = (currentIndex + 1) % product.images.length;
        setSelectedImage(product.images[nextIdx]);
      } else {
        swipeDirection.current = "right";
        const prevIdx = (currentIndex - 1 + product.images.length) % product.images.length;
        setSelectedImage(product.images[prevIdx]);
      }
    }
  };

  const handleImageClick = (e) => {
    if (hasSwiped.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setZoomScale(1);
    setIsZoomOpen(true);
  };

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
              <div 
                className="bg-white border border-brand-sand p-3 shadow-sm cursor-zoom-in relative group/img overflow-hidden select-none touch-pan-y"
                onClick={handleImageClick}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onPointerDown={(e) => handleDragStart(e.clientX)}
                onPointerMove={(e) => {
                  if (e.buttons === 1) handleDragMove(e.clientX);
                }}
              >
                {/* Hover zoom cue */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                  <span className="bg-white/80 backdrop-blur-sm border border-brand-sand/80 px-4 py-2 font-bold text-xs uppercase tracking-widest text-brand-forest shadow-md">
                    Click to Zoom
                  </span>
                </div>
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: swipeDirection.current === "left" ? 50 : swipeDirection.current === "right" ? -50 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full h-full"
                >
                  <ProgressiveImage
                    src={getOptimizedImageUrl(
                      selectedImage ||
                        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                      1200
                    )}
                    placeholderSrc={getOptimizedImageUrl(
                      selectedImage ||
                        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                      100,
                      20
                    )}
                    alt={product.name}
                    className="w-full h-auto object-contain bg-brand-cream aspect-square border border-brand-sand/40"
                  />
                </motion.div>
              </div>

              {/* THUMBNAILS */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const currIdx = product.images.indexOf(selectedImage);
                        if (index > currIdx) {
                          swipeDirection.current = "left";
                        } else if (index < currIdx) {
                          swipeDirection.current = "right";
                        } else {
                          swipeDirection.current = "";
                        }
                        setSelectedImage(img);
                      }}
                      className={`cursor-pointer bg-white p-1 border aspect-square transition-all ${
                        selectedImage === img
                          ? "border-brand-forest"
                          : "border-brand-sand hover:border-brand-gray"
                      }`}
                    >
                      <img
                        src={getOptimizedImageUrl(img, 150, 70)}
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
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-forest tracking-tight mb-2">
                  {product.name}
                </h1>

                {/* Rating Badge Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.averageRating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <a
                    href="#reviews-section"
                    className="text-xs font-bold text-brand-forest hover:underline"
                  >
                    {product.numReviews > 0
                      ? `${(product.averageRating || 0).toFixed(1)} (${product.numReviews} ${
                          product.numReviews === 1 ? "review" : "reviews"
                        })`
                      : "No reviews yet — be the first to review!"}
                  </a>
                </div>

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

          {/* CUSTOMER REVIEWS & RATINGS SECTION */}
          <div id="reviews-section" className="mt-12 pt-12 border-t border-brand-sand">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-forest tracking-tight">
                  Customer Reviews & Ratings
                </h2>
                <p className="text-brand-gray text-xs font-semibold mt-1">
                  Read genuine feedback from verified business owners & operators.
                </p>
              </div>
              <button
                onClick={() => setIsWritingReview(!isWritingReview)}
                className="inline-flex items-center justify-center gap-2 bg-brand-forest text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-forest/90 transition-all rounded-none self-start md:self-auto cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                {isWritingReview ? "Close Form" : "Write a Review"}
              </button>
            </div>

            {/* WRITE A REVIEW FORM */}
            <AnimatePresence>
              {isWritingReview && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleReviewSubmit}
                  className="bg-white border border-brand-forest/30 p-6 md:p-8 mb-10 shadow-md space-y-5 overflow-hidden"
                >
                  <h3 className="font-serif text-lg font-bold text-brand-forest border-b border-brand-sand pb-3">
                    Share Your Experience
                  </h3>

                  {reviewError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                        Your Name / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none rounded-none text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                        Rating *
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 focus:outline-none cursor-pointer transform hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoverRating || reviewForm.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-xs font-bold text-brand-gray">
                          {hoverRating || reviewForm.rating} / 5 Stars
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How has this machine performed for your food processing operations?"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-white outline-none rounded-none text-xs font-semibold"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-5 py-2.5 border border-brand-sand text-brand-gray text-xs font-bold uppercase tracking-wider hover:bg-brand-cream transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="inline-flex items-center gap-2 bg-brand-forest text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-brand-forest/90 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {reviewSubmitting ? "Submitting..." : "Post Review"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* RATINGS OVERVIEW & REVIEWS LIST */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* RATING SUMMARY CARD */}
              <div className="bg-white border border-brand-sand p-6 shadow-sm space-y-6">
                <div className="text-center pb-6 border-b border-brand-sand">
                  <div className="font-serif text-5xl font-bold text-brand-forest">
                    {(product.averageRating || 0).toFixed(1)}
                  </div>
                  <div className="flex justify-center items-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.averageRating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-brand-gray uppercase tracking-wider">
                    Based on {product.numReviews || 0} {product.numReviews === 1 ? "Review" : "Reviews"}
                  </p>
                </div>

                {/* BREAKDOWN BARS */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((starCount) => {
                    const total = product.numReviews || 0;
                    const count = (product.reviews || []).filter((r) => r.rating === starCount).length;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={starCount} className="flex items-center gap-3 text-xs font-semibold">
                        <span className="w-12 text-brand-gray flex items-center gap-1 font-bold">
                          {starCount} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                        </span>
                        <div className="flex-grow h-2 bg-brand-cream border border-brand-sand overflow-hidden">
                          <div
                            className="h-full bg-amber-400 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-brand-gray/80 text-[11px]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REVIEWS LIST */}
              <div className="lg:col-span-2 space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, idx) => (
                    <motion.div
                      key={rev._id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="bg-white border border-brand-sand p-6 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-forest text-white flex items-center justify-center font-bold text-sm font-serif">
                            {rev.name ? rev.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-brand-forest">{rev.name}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= rev.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-brand-gray/60">
                          {new Date(rev.createdAt || Date.now()).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-brand-charcoal/90 leading-relaxed pl-13">
                        {rev.comment}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white border border-brand-sand p-10 text-center space-y-3">
                    <MessageSquare className="w-10 h-10 text-brand-forest/30 mx-auto" />
                    <h4 className="font-serif text-lg font-bold text-brand-forest">No Reviews Yet</h4>
                    <p className="text-xs font-semibold text-brand-gray max-w-sm mx-auto">
                      Have you used this machine in your factory or kitchen? Share your feedback to help other buyers.
                    </p>
                    <button
                      onClick={() => setIsWritingReview(true)}
                      className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-brand-forest underline hover:text-brand-forest/80 cursor-pointer"
                    >
                      Be the first to review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center w-full z-10 shrink-0">
              <h3 className="font-serif text-base font-bold text-white tracking-wide">
                {product.name}
              </h3>
              <button
                onClick={() => {
                  setIsZoomOpen(false);
                  setZoomScale(1);
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all duration-150"
                title="Close Zoom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Drag-to-Pan area */}
            <div 
              className="flex-grow w-full overflow-hidden my-4 select-none relative flex items-center justify-center cursor-default touch-none"
              onPointerDown={handleZoomDragStart}
              onPointerMove={handleZoomDragMove}
              onPointerUp={handleZoomDragEnd}
              onPointerCancel={handleZoomDragEnd}
            >
              <img
                src={selectedImage || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"}
                alt={product.name}
                className="object-contain shadow-2xl bg-white/5 border border-white/5 p-2 select-none pointer-events-none"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                  transformOrigin: "center center",
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  transition: isDragging.current ? "none" : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  cursor: zoomScale > 1 ? (isDragging.current ? "grabbing" : "grab") : "default"
                }}
              />
            </div>

            {/* Zoom Control Bar */}
            <div className="flex justify-center items-center w-full shrink-0 z-10">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 rounded-full flex items-center gap-4">
                <button
                  onClick={() => {
                    const newScale = Math.max(1, zoomScale - 0.5);
                    setPanOffset(prev => {
                      const ratio = newScale / zoomScale;
                      return { x: prev.x * ratio, y: prev.y * ratio };
                    });
                    setZoomScale(newScale);
                  }}
                  className="text-white hover:text-brand-amber transition-colors disabled:opacity-30 cursor-pointer"
                  disabled={zoomScale <= 1}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.1"
                  value={zoomScale}
                  onChange={(e) => {
                    const newScale = parseFloat(e.target.value);
                    setPanOffset(prev => {
                      const ratio = newScale / zoomScale;
                      return { x: prev.x * ratio, y: prev.y * ratio };
                    });
                    setZoomScale(newScale);
                  }}
                  className="w-32 md:w-48 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-amber"
                />

                <button
                  onClick={() => {
                    const newScale = Math.min(6, zoomScale + 0.5);
                    setPanOffset(prev => {
                      const ratio = newScale / zoomScale;
                      return { x: prev.x * ratio, y: prev.y * ratio };
                    });
                    setZoomScale(newScale);
                  }}
                  className="text-white hover:text-brand-amber transition-colors disabled:opacity-30 cursor-pointer"
                  disabled={zoomScale >= 6}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <span className="text-white text-xs font-bold font-sans w-12 text-center select-none border-l border-white/10 pl-2">
                  {Math.round(zoomScale * 100)}%
                </span>

                {zoomScale > 1 && (
                  <button
                    onClick={() => setZoomScale(1)}
                    className="bg-brand-amber text-brand-slateDark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default ProductDetails;