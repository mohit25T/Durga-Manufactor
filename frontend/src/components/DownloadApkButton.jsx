import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Download, QrCode, X, ShieldCheck, Check } from "lucide-react";
import { getDeviceOS } from "../utils/deviceDetect";

export default function DownloadApkButton({ 
  variant = "primary", // "primary" | "secondary" | "minimal" | "banner"
  className = "",
  showQrModalDirectly = false
}) {
  const [device, setDevice] = useState({ isAndroid: false, isIOS: false, isDesktop: true });
  const [showQrModal, setShowQrModal] = useState(showQrModalDirectly);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDevice(getDeviceOS());
  }, []);

  // Construct absolute download URL for the QR code and download links
  const isLocalhost = typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.")
  );

  const baseUrl = typeof window !== "undefined"
    ? (isLocalhost ? "https://www.durgamanufactures.com" : window.location.origin)
    : "https://www.durgamanufactures.com";

  const apkDownloadUrl = `${baseUrl}/downloads/durga-dealer-app.apk`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(apkDownloadUrl)}`;

  // iOS users cannot install APK files directly
  if (device.isIOS) {
    return null;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(apkDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const renderButtonContent = () => {
    if (variant === "banner") {
      return (
        <div className={`bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 border border-brand-amber/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${className}`}>
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand-amber/10 border border-brand-amber/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-7 h-7 text-brand-amber" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-brand-amber/20 text-brand-amber text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-brand-amber/40">
                  Android App
                </span>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> v1.0.0 Ready
                </span>
              </div>
              <h3 className="text-white font-bold text-lg md:text-xl mt-1">
                Download Durga Dealer Mobile App
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-0.5 max-w-md">
                Fast order tracking, live inventory updates & instant quotes directly on your Android phone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {device.isAndroid ? (
              <a
                href={apkDownloadUrl}
                download="Durga-Dealer-App.apk"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-brand-amber hover:bg-white text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg hover:shadow-brand-amber/20"
              >
                <Download className="w-4 h-4" />
                Download Android APK
              </a>
            ) : (
              <>
                <a
                  href={apkDownloadUrl}
                  download="Durga-Dealer-App.apk"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-brand-amber hover:bg-white text-slate-950 font-bold px-5 py-3.5 rounded-xl text-xs md:text-sm transition-all duration-300 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download APK
                </a>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3.5 rounded-xl text-xs md:text-sm border border-white/10 transition-all duration-300"
                  title="Scan QR Code with Phone"
                >
                  <QrCode className="w-4 h-4 text-brand-amber" />
                  <span className="hidden sm:inline">Scan QR</span>
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    if (variant === "secondary") {
      return (
        <div className="inline-flex items-center gap-2">
          <a
            href={apkDownloadUrl}
            download="Durga-Dealer-App.apk"
            className={`inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-brand-amber border border-brand-amber/30 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${className}`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Download Android App (.APK)</span>
          </a>
          {!device.isAndroid && (
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white/80 hover:text-white border border-white/10 rounded-lg transition-colors"
              title="Scan QR code on Android phone"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    if (variant === "minimal") {
      return (
        <a
          href={apkDownloadUrl}
          download="Durga-Dealer-App.apk"
          className={`inline-flex items-center gap-1.5 text-brand-amber hover:text-white text-xs font-bold transition-colors ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android App (.APK)</span>
        </a>
      );
    }

    // Default primary button
    return (
      <div className="inline-flex items-center gap-2">
        <a
          href={apkDownloadUrl}
          download="Durga-Dealer-App.apk"
          className={`inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Android App (.APK)</span>
        </a>
        {!device.isAndroid && (
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-brand-amber border border-brand-amber/30 rounded-lg transition-all"
            title="Scan QR Code with Android Phone"
          >
            <QrCode className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {renderButtonContent()}

      {/* QR Code Modal for Desktop scanning */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-brand-amber/30 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber mx-auto flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                Install Android Dealer App
              </h3>
              <p className="text-white/70 text-xs mb-5">
                Scan this QR code with your Android phone camera to start the direct APK download.
              </p>

              <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-5">
                <img
                  src={qrApiUrl}
                  alt="Download Android APK QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={apkDownloadUrl}
                  download="Durga-Dealer-App.apk"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-amber hover:bg-white text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  <Download className="w-4 h-4" />
                  Direct Download APK File
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white/80 py-2 rounded-xl text-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <span>Copy APK Download Link</span>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-white/50">
                ⚡ For Android 8.0+ devices. Enable "Allow from this source" when prompted.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
