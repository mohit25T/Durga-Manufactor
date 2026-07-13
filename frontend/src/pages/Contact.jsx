import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/leads", form);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-brand-sage/30 text-brand-charcoal py-10 relative overflow-hidden border-b border-brand-sand">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl md:text-5xl font-bold mb-4 text-brand-forest tracking-tight"
            >
              Get in <span className="text-brand-charcoal">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-brand-gray max-w-xl mx-auto leading-relaxed font-semibold"
            >
              Have a custom requirement or need a quote? Reach out to our team of experts directly.
            </motion.p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-6xl mx-auto px-6 py-8 relative z-20">
          <div className="bg-white rounded-none border border-brand-sand shadow-sm overflow-hidden grid lg:grid-cols-5">
            
            {/* Info Side */}
            <div className="lg:col-span-2 bg-brand-sage/10 p-6 lg:p-8 border-r border-brand-sand flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-brand-forest">
                  Contact Details
                </h3>

                <div className="space-y-4 font-semibold">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white border border-brand-sand flex items-center justify-center shrink-0 text-brand-forest">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-gray mb-1 uppercase tracking-widest font-bold">
                        Sales & Support
                      </p>
                      <a
                        href="tel:+919825270821"
                        className="text-base font-bold text-brand-forest hover:underline block"
                      >
                        +91 98252 70821
                      </a>
                      <a
                        href="tel:+919428156213"
                        className="text-base font-bold text-brand-forest hover:underline block"
                      >
                        +91 94281 56213
                      </a>
                      <a
                        href="tel:+919909917008"
                        className="text-base font-bold text-brand-forest hover:underline block"
                      >
                        +91 99099 17008
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white border border-brand-sand flex items-center justify-center shrink-0 text-brand-forest">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-gray mb-1 uppercase tracking-widest font-bold">
                        Email inquiries
                      </p>
                      <a
                        href="mailto:durgamanufactures2010@gmail.com"
                        className="text-base font-bold text-brand-forest hover:underline break-all"
                      >
                        durgamanufactures2010@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white border border-brand-sand flex items-center justify-center shrink-0 text-brand-forest">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-gray mb-1 uppercase tracking-widest font-bold">
                        Factory Location
                      </p>
                      <a
                        href="https://maps.app.goo.gl/aU3AFdMye5pQWjrZA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-brand-forest leading-relaxed hover:underline"
                      >
                        Plot No. A5, Shapar Main Road, Opp. Mahindra Gear,
                        Decora Cement Campus, Shapar (Veraval) 360024, Rajkot.
                        <br />
                        Rajkot, Gujarat, India 360003
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-3 p-6 lg:p-8 bg-white">
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-1">
                Send Us a Message
              </h3>
              <p className="text-brand-gray mb-6 font-semibold text-xs md:text-sm">
                We will get back to you within 24 hours.
              </p>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 font-bold flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  Message sent successfully! Our team will contact you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-brand-cream/30 outline-none rounded-none text-sm placeholder:text-brand-gray/50 transition-all font-semibold"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      minLength={10}
                      pattern="[0-9]{10}"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-brand-cream/30 outline-none rounded-none text-sm placeholder:text-brand-gray/50 transition-all font-semibold"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-brand-cream/30 outline-none rounded-none text-sm placeholder:text-brand-gray/50 transition-all font-semibold"
                    placeholder="john@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-forest uppercase tracking-widest">
                    Message / Requirement
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full py-2.5 px-3 border border-brand-sand focus:border-brand-forest bg-brand-cream/30 outline-none rounded-none text-sm placeholder:text-brand-gray/50 transition-all font-semibold resize-none"
                    placeholder="Describe the machine capacity or application you need..."
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-10 py-4.5 bg-brand-forest hover:bg-transparent border border-brand-forest text-white hover:text-brand-forest font-bold font-sans text-xs tracking-widest uppercase transition-all duration-300 rounded-none flex items-center justify-center gap-2"
                  >
                    Submit Inquiry <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
