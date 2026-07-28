import { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem("durga_compare_items");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("durga_compare_items", JSON.stringify(compareItems));
    } catch (e) {
      console.error("Failed to save compare items to localStorage:", e);
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product || !product._id) return;
    setCompareItems((prev) => {
      if (prev.some((p) => p._id === product._id)) return prev;
      if (prev.length >= 3) {
        alert("You can compare up to 3 machines side-by-side at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((p) => p._id !== productId));
  };

  const toggleCompare = (product) => {
    if (isInCompare(product._id)) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
    setIsModalOpen(false);
  };

  const isInCompare = (productId) => {
    return compareItems.some((p) => p._id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
