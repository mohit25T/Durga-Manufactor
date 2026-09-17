import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Apple, 
  Download, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Share2,
  PlusSquare,
  ArrowRight,
  PhoneCall
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { getDeviceOS } from "../utils/deviceDetect";

export default function InstallApp() {
  const device = getDeviceOS();
  const [activeTab, setActiveTab] = useState(device.isIOS ? "ios" : "android");
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Absolute paths for download & QR
  const isLocalhost = typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.")
  );

  const baseUrl = typeof window !== "undefined"
    ? (isLocalhost ? "https://www.durgamanufactures.com" : window.location.origin)
    : "https://www.durgamanufactures.com";

  const apkDownloadUrl = `${baseUrl}/downloads/durga-dealer-app.apk`;
  const dealerPortalUrl = `${baseUrl}/dealer/login`;
  const qrDownloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(apkDownloadUrl)}`;
  const qrIosUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(dealerPortalUrl)}`;

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Install Durga Dealer Mobile Application for Android and iOS",
    "description": "Step-by-step visual installation guide for Durga Manufactures Dealer Mobile Application on Android devices via APK and iOS Apple devices via Safari Home Screen Web App.",
    "publisher": {
      "@type": "Organization",
      "name": "Durga Manufactures",
      "url": baseUrl
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Download APK for Android",
        "text": "Download the official durga-dealer-app.apk file directly onto your Android device."
      },
      {
        "@type": "HowToStep",
        "name": "Allow Installation from Unknown Sources",
        "text": "Open Android Settings and enable 'Allow from this source' for Chrome or File Manager."
      },
      {
        "@type": "HowToStep",
        "name": "Install & Launch",
        "text": "Tap Install in the Package Installer dialog and launch the Durga Dealer application."
      },
      {
        "@type": "HowToStep",
        "name": "Add to Home Screen on iOS",
        "text": "Open Safari on iPhone or iPad, tap the Share icon, select Add to Home Screen, and tap Add."
      }
    ]
  };

  const faqs = [
    {
      q: "Why does Android show 'File might be harmful' when downloading?",
      a: "This is a standard default security prompt on all modern Android devices whenever downloading any .apk file directly outside the Google Play Store. Our application is 100% verified, virus-free, secure, and officially built by Durga Manufactures for authorized dealers and clients."
    },
    {
      q: "Can I install this app on iPhone or iPad?",
      a: "Yes! While Apple does not allow direct .apk downloads, you can instantly add the full standalone Durga Dealer Web App to your iPhone or iPad home screen in just 2 taps using Safari. It behaves like a native app with offline caching, fast speed, and full screen experience."
    },
    {
      q: "How do I update the application when a new version is released?",
      a: "For Android, you can simply visit this page and download the newest APK file; installing it will automatically update your existing app without losing your dealer account data. For iOS home screen apps, updates are applied automatically in real time whenever you launch the app."
    },
    {
      q: "What Android version is supported?",
      a: "The Durga Dealer Mobile App supports Android 8.0 (Oreo) and above, ensuring smooth performance on nearly all modern Android smartphones from Samsung, OnePlus, Xiaomi, Vivo, Realme, Motorola, and more."
    },
    {
      q: "Need help or experiencing issues installing?",
      a: "Our technical team is ready to assist you. Call our direct dealer helpline at +91 94281 56213 or contact us via WhatsApp for instant guided installation."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-brand-amber selection:text-slate-950">
      <SEO
        title="How to Install Durga Dealer App (Android & iOS Guide) | Durga Manufactures"
        description="Comprehensive step-by-step installation guide with screenshots for Durga Dealer Mobile App. Download official Android APK and install on iOS iPhone/iPad."
        canonicalUrl="/install"
        jsonLd={jsonLd}
        keywords="install Durga app, Durga dealer APK download, install APK Android, iOS Add to Home Screen, Durga manufactures mobile application"
      />
      <Navbar />

      <main className="flex-grow">
        {/* Top Hero Section */}
        <section className="relative overflow-hidden py-14 md:py-20 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading and Action */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs font-bold uppercase tracking-widest mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  Official Mobile App Guide
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                  How to Install the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                    Durga Dealer Mobile App
                  </span>
                </h1>

                <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-medium">
                  Follow our visual step-by-step guide to download, install, and configure our high-performance mobile application on your <strong className="text-white">Android smartphone</strong> or <strong className="text-white">Apple iOS device</strong>.
                </p>

                {/* Key Benefits Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-xs font-semibold text-white/80">
                  <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3.5 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                    <span>Instant Price Quotes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3.5 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                    <span>Full Machinery Specs</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3.5 py-2.5 rounded-xl col-span-2 sm:col-span-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                    <span>Live Order Tracking</span>
                  </div>
                </div>

                {/* Quick Action buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={apkDownloadUrl}
                    download="Durga-Dealer-App.apk"
                    className="inline-flex items-center gap-2.5 bg-brand-amber hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    Download Android APK (v1.0.0)
                  </a>

                  <button
                    onClick={() => {
                      setActiveTab("ios");
                      const el = document.getElementById("install-steps-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3.5 rounded-xl text-sm border border-white/15 transition-all duration-200 hover:border-brand-amber/40"
                  >
                    <Apple className="w-4 h-4 text-white" />
                    iOS iPhone Guide
                  </button>
                </div>
              </motion.div>

              {/* Right Column: Hero Mockup Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-5 relative"
              >
                <div className="relative mx-auto max-w-md group cursor-pointer" onClick={() => setPreviewImage("/images/app-showcase.jpg")}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-amber/40 to-amber-600/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border border-brand-amber/40 shadow-2xl bg-slate-900">
                    <img 
                      src="/images/app-showcase.jpg" 
                      alt="Durga Dealer Mobile Application Interface"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-brand-amber" />
                        Durga Dealer App Mobile UI
                      </span>
                      <span className="text-brand-amber font-mono text-[11px]">Tap to Zoom</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Platform Selection Tabs */}
        <section id="install-steps-section" className="py-12 bg-slate-950 relative">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* Tabs Bar */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-white/10 shadow-inner max-w-md w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("android")}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "android"
                      ? "bg-brand-amber text-slate-950 shadow-md scale-[1.02]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Android (APK)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ios")}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "ios"
                      ? "bg-brand-amber text-slate-950 shadow-md scale-[1.02]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Apple className="w-5 h-5" />
                  <span>Apple iOS (iPhone)</span>
                </button>
              </div>
            </div>

            {/* TAB 1: ANDROID GUIDE */}
            <AnimatePresence mode="wait">
              {activeTab === "android" && (
                <motion.div
                  key="android-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  {/* Visual Infographic Banner */}
                  <div className="bg-slate-900 border border-brand-amber/30 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Android 8.0 to 14+
                          </span>
                          <span className="text-white/50 text-xs">• File size: ~60 MB</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                          Android APK Installation Instructions
                        </h2>
                        <p className="text-white/70 text-sm mt-1">
                          Follow these 4 simple steps to install the APK file on your smartphone.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={apkDownloadUrl}
                          download="Durga-Dealer-App.apk"
                          className="inline-flex items-center gap-2 bg-brand-amber hover:bg-white text-slate-950 font-bold px-5 py-3 rounded-xl text-xs md:text-sm uppercase tracking-wider transition-all shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          Download APK
                        </a>
                      </div>
                    </div>

                    {/* Infographic Image Showcase */}
                    <div 
                      className="p-4 md:p-8 bg-black/40 text-center cursor-pointer group relative"
                      onClick={() => setPreviewImage("/images/android-install-guide.jpg")}
                      title="Click to view full image"
                    >
                      <div className="relative inline-block rounded-2xl overflow-hidden border border-white/15 shadow-xl max-w-4xl w-full">
                        <img 
                          src="/images/android-install-guide.jpg" 
                          alt="Android APK Installation Process Illustrated" 
                          className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
                          <span>Click to expand infographic</span>
                        </div>
                      </div>
                    </div>

                    {/* Step by Step Breakdown Cards */}
                    <div className="p-6 md:p-10 grid md:grid-cols-2 gap-6 bg-slate-900/50">
                      
                      {/* Step 1 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              1
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 01
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            Download the APK File
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Tap the <strong>Download APK</strong> button directly on your phone, or scan the QR code using your phone camera if you are viewing this page on a desktop computer.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <a
                            href={apkDownloadUrl}
                            download="Durga-Dealer-App.apk"
                            className="inline-flex items-center gap-2 text-brand-amber hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Download durga-dealer-app.apk
                          </a>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              2
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 02
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            Open the Download Notification
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Once the download finishes, swipe down your notification tray and tap the download complete notification, or open the <strong>Files / Downloads</strong> app and tap <code className="text-brand-amber bg-white/5 px-1.5 py-0.5 rounded text-xs">durga-dealer-app.apk</code>.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-white/50">
                          If prompted with <em>"File might be harmful"</em>, tap <strong>Download anyway</strong>.
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              3
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 03
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            Enable "Allow from this source"
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            If Android shows <em>"For your security, your phone is not allowed to install unknown apps from this source"</em>, tap <strong>Settings</strong> and turn the toggle switch <strong>ON</strong> for Chrome / Files.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Normal safety check for direct downloads
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              4
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 04
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            Tap Install & Launch
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Press the back arrow or return to the installer dialog. Tap <strong>Install</strong>. Once completed, tap <strong>Open</strong> to launch the Durga Dealer Mobile App and sign in with your credentials.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-brand-amber flex items-center gap-1.5 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> App icon will appear in your app drawer
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Desktop QR Scan Section for Android */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                      <span className="text-brand-amber font-bold text-xs uppercase tracking-widest">
                        Scan from Desktop Screen
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1 mb-2">
                        Install directly on your phone via QR Code
                      </h3>
                      <p className="text-white/70 text-sm max-w-xl leading-relaxed mb-5">
                        Point your smartphone camera at this QR code. Your phone will immediately detect the download link and prompt you to save the APK file directly to your device storage.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(apkDownloadUrl)}
                          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/10 transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">Direct Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-brand-amber" />
                              <span>Copy APK Download Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-slate-800 shrink-0 text-center">
                      <img
                        src={qrDownloadUrl}
                        alt="Scan QR code to download Android APK"
                        className="w-44 h-44 mx-auto"
                      />
                      <span className="block text-[11px] font-bold text-slate-800 mt-2 font-mono uppercase tracking-wider">
                        Scan with Android Camera
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB 2: IOS (IPHONE) GUIDE */}
            <AnimatePresence mode="wait">
              {activeTab === "ios" && (
                <motion.div
                  key="ios-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  {/* Visual Infographic Banner for iOS */}
                  <div className="bg-slate-900 border border-brand-amber/30 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Apple iOS (iPhone & iPad)
                          </span>
                          <span className="text-white/50 text-xs">• Instant 1-Tap Safari Install</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                          iPhone & iPad Installation Guide
                        </h2>
                        <p className="text-white/70 text-sm mt-1">
                          Apple devices use Safari's <strong>"Add to Home Screen"</strong> web application engine for an instant, full-screen app experience.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href="/dealer/login"
                          className="inline-flex items-center gap-2 bg-brand-amber hover:bg-white text-slate-950 font-bold px-5 py-3 rounded-xl text-xs md:text-sm uppercase tracking-wider transition-all shadow-md"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open Dealer Portal
                        </a>
                      </div>
                    </div>

                    {/* Infographic Image Showcase for iOS */}
                    <div 
                      className="p-4 md:p-8 bg-black/40 text-center cursor-pointer group relative"
                      onClick={() => setPreviewImage("/images/ios-install-guide.jpg")}
                      title="Click to view full image"
                    >
                      <div className="relative inline-block rounded-2xl overflow-hidden border border-white/15 shadow-xl max-w-4xl w-full">
                        <img 
                          src="/images/ios-install-guide.jpg" 
                          alt="Apple iPhone Safari Add to Home Screen Instructions" 
                          className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-brand-amber" />
                          <span>Click to expand infographic</span>
                        </div>
                      </div>
                    </div>

                    {/* Step by Step Breakdown Cards for iOS */}
                    <div className="p-6 md:p-10 grid md:grid-cols-3 gap-6 bg-slate-900/50">
                      
                      {/* Step 1 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              1
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 01
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            Open Safari Browser
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Open the official <strong>Apple Safari</strong> browser on your iPhone or iPad and navigate to our dealer portal:
                            <br />
                            <code className="text-brand-amber bg-white/5 px-2 py-1 rounded text-xs block mt-2 break-all">
                              durgamanufactures.com/dealer/login
                            </code>
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-white/50">
                          Note: Must use Safari (Apple restriction for Home Screen installation).
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              2
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 02
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            Tap the Share Button
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Look at the bottom toolbar of Safari and tap the <strong>Share</strong> button (the square icon with an arrow pointing upward <Share2 className="w-4 h-4 inline text-brand-amber" />).
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-brand-amber font-semibold">
                          Opens the iOS Action Share Sheet.
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand-amber/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-10 h-10 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber font-extrabold flex items-center justify-center text-lg">
                              3
                            </span>
                            <span className="text-xs uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-md">
                              Step 03
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">
                            "Add to Home Screen"
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Scroll down the menu list and tap <strong className="text-white">"Add to Home Screen"</strong> (with a <PlusSquare className="w-4 h-4 inline text-brand-amber" /> icon). Tap <strong>"Add"</strong> in the top-right corner to finish.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> App icon is now on your iPhone home screen!
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Desktop QR Scan Section for iOS */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                      <span className="text-sky-400 font-bold text-xs uppercase tracking-widest">
                        Scan with iPhone Camera
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1 mb-2">
                        Open directly in Safari on your iPhone
                      </h3>
                      <p className="text-white/70 text-sm max-w-xl leading-relaxed mb-5">
                        Open your iPhone's default Camera app and aim it at this QR code. Tap the yellow Safari notification pop-up to immediately open the dealer app and add it to your home screen.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(dealerPortalUrl)}
                          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/10 transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">Portal Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-brand-amber" />
                              <span>Copy Safari Portal Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-2xl border-4 border-slate-800 shrink-0 text-center">
                      <img
                        src={qrIosUrl}
                        alt="Scan QR code to open on iPhone"
                        className="w-44 h-44 mx-auto"
                      />
                      <span className="block text-[11px] font-bold text-slate-800 mt-2 font-mono uppercase tracking-wider">
                        Scan with iPhone Camera
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

        {/* Comparison / App Features Table */}
        <section className="py-16 bg-slate-900/50 border-t border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-brand-amber font-bold text-xs uppercase tracking-widest">
                Features & Highlights
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                Why Install the Durga Dealer Mobile App?
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Engineered specifically for machine distributors, food processing plants, and commercial flour mill partners across India.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 hover:border-brand-amber/40 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ultra-Fast Performance</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Built with high-performance Flutter mobile architecture and cached data streams, the app loads catalog items and high-resolution machinery specs with zero lag.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 hover:border-brand-amber/40 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Direct Factory Access</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Generate instant client quotes with your customized dealer margins, check warehouse stock availability, and submit quotation orders directly to the factory floor.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 hover:border-brand-amber/40 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber flex items-center justify-center mb-4">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Dedicated Tech Support</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  1-tap WhatsApp and phone support with Durga engineers for machine troubleshooting, spare parts ordering, and video call demonstration requests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="py-16 bg-slate-950">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-brand-amber font-bold text-xs uppercase tracking-widest">
                Troubleshooting & FAQs
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                Frequently Asked Questions
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Quick answers to common installation and security questions.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-bold text-white text-sm md:text-base cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-brand-amber shrink-0" />
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-brand-amber shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/50 shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-5 pb-5 md:px-6 md:pb-6 text-white/70 text-sm leading-relaxed border-t border-white/5 pt-4"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Assistance Banner */}
            <div className="mt-12 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent border border-brand-amber/30 rounded-2xl p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h4 className="font-bold text-white text-base">Still facing trouble installing?</h4>
                <p className="text-white/70 text-xs mt-1">Our customer technical team is available to assist you step-by-step.</p>
              </div>
              <a
                href="tel:+91 94281 56213"
                className="inline-flex items-center gap-2 bg-brand-amber hover:bg-white text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                Call +91 94281 56213
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-brand-amber text-sm font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Close (ESC)
              </button>
              <img
                src={previewImage}
                alt="Enlarged Visual Guide"
                className="w-full h-auto rounded-2xl border border-white/20 shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
