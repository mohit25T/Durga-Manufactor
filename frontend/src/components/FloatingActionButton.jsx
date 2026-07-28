import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingActionButton() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.innerHeight + window.scrollY;
          const threshold = document.documentElement.scrollHeight - 120;
          const atBottom = scrollPosition >= threshold;
          setIsAtBottom((prev) => (prev !== atBottom ? atBottom : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e) => {
    if (isAtBottom) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const whatsappUrl = `https://wa.me/919428156213?text=${encodeURIComponent(
    "Hello Durga Manufactor, I would like to inquire about your machines."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <a
        href={isAtBottom ? "#" : whatsappUrl}
        target={isAtBottom ? "_self" : "_blank"}
        rel={isAtBottom ? "" : "noopener noreferrer"}
        onClick={handleClick}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl border border-white/20 transition-all duration-300 ease-out hover:scale-105 cursor-pointer transform-gpu ${
          isAtBottom
            ? "bg-brand-forest hover:bg-brand-forest/90"
            : "bg-[#25D366] hover:bg-[#20bd5a]"
        }`}
      >
        {/* WhatsApp Icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out transform-gpu ${
            isAtBottom
              ? "opacity-0 rotate-180 scale-50 pointer-events-none"
              : "opacity-100 rotate-0 scale-100"
          }`}
        >
          <svg
            className="w-9 h-9 fill-current text-white"
            viewBox="0 0 24 24"
          >
            <path d="M12.011 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.475 1.33 4.986l-1.413 5.16 5.274-1.383c1.458.795 3.104 1.213 4.793 1.213h.005c5.506 0 9.989-4.479 9.99-9.985.001-2.669-1.034-5.177-2.916-7.062a9.923 9.923 0 0 0-7.063-2.913zm5.727 14.167c-.244.688-1.205 1.309-1.956 1.385-.506.052-1.168.093-3.376-.821-2.825-1.169-4.639-4.05-4.78-4.237-.14-.188-1.144-1.523-1.144-2.906 0-1.382.725-2.062.983-2.344.258-.282.563-.352.751-.352.188 0 .376.002.54.01.173.008.406-.065.635.485.235.563.8 1.955.87 2.096.07.141.117.306.023.494-.094.188-.141.305-.282.47-.141.164-.296.368-.423.494-.141.141-.288.294-.124.576.165.282.731 1.205 1.569 1.952 1.076.958 1.984 1.254 2.266 1.395.282.141.447.117.611-.07.164-.188.705-.822.893-1.104.188-.282.376-.235.634-.141.258.094 1.644.775 1.926.916.282.141.47.211.54.329.07.117.07.681-.174 1.369z" />
          </svg>
        </div>

        {/* Scroll To Top Arrow Icon */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out transform-gpu ${
            isAtBottom
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-50 pointer-events-none"
          }`}
        >
          <ArrowUp className="w-8 h-8 text-white transform group-hover:-translate-y-1 transition-transform" />
        </div>
      </a>
    </div>
  );
}
