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
      // Mocked if API fails
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
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-brand-slateDark text-white pt-24 pb-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-amber/10 rounded-full blur-[80px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight"
            >
              Get In <span className="text-brand-amber">Touch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-brand-gray max-w-2xl mx-auto leading-relaxed"
            >
              Have a custom requirement or need a quote? Reach out to our team of experts directly.
            </motion.p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 mb-32">
          <div className="glass-dark !bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid lg:grid-cols-5 flex-col-reverse lg:flex-row border border-brand-slate/10">
            
            {/* Info Side */}
            <div className="lg:col-span-2 bg-brand-slateDark text-white p-8 lg:p-12 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-amber/20 rounded-full blur-[60px] translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-10 text-brand-amber">Contact Information</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                      <Phone className="w-6 h-6 text-brand-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1 uppercase tracking-wider font-bold">Sales & Support</p>
                      <p className="text-lg font-bold">+91 99999 99999</p>
                      <p className="text-lg font-bold">+91 88888 88888</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                      <Mail className="w-6 h-6 text-brand-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1 uppercase tracking-wider font-bold">Email inquiries</p>
                      <p className="text-lg font-bold break-all">info@durgamanufactures.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                      <MapPin className="w-6 h-6 text-brand-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1 uppercase tracking-wider font-bold">Factory Location</p>
                      <p className="text-lg font-bold leading-relaxed">123 Industrial Area, Near AJI GIDC,<br/>Rajkot, Gujarat, India 360003</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-16 pt-8 border-t border-white/10">
                <p className="font-semibold text-brand-amber mb-2 uppercase tracking-wide">Business Hours</p>
                <p className="text-brand-gray">Monday - Saturday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-3 p-8 lg:p-12 xl:p-16 bg-white">
              <h3 className="text-3xl font-extrabold text-brand-slateDark mb-2">Send us a message</h3>
              <p className="text-brand-gray mb-10 font-medium text-lg">We will get back to you within 24 hours.</p>

              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-green-50 border border-green-200 text-green-700 rounded-2xl font-bold flex items-center gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                  Message sent successfully! Our team will contact you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-brand-slateDark uppercase tracking-wide">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none transition-colors font-medium text-brand-slateDark focus:bg-white focus:shadow-lg focus:shadow-brand-amber/10 placeholder:text-brand-gray/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-brand-slateDark uppercase tracking-wide">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})} 
                      className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none transition-colors font-medium text-brand-slateDark focus:bg-white focus:shadow-lg focus:shadow-brand-amber/10 placeholder:text-brand-gray/50"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-brand-slateDark uppercase tracking-wide">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none transition-colors font-medium text-brand-slateDark focus:bg-white focus:shadow-lg focus:shadow-brand-amber/10 placeholder:text-brand-gray/50"
                    placeholder="john@company.com"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-brand-slateDark uppercase tracking-wide">Message / Requirement</label>
                  <textarea 
                    required
                    rows="5" 
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full px-5 py-4 bg-brand-light border-2 border-transparent focus:border-brand-amber rounded-xl outline-none transition-colors font-medium text-brand-slateDark focus:bg-white focus:shadow-lg focus:shadow-brand-amber/10 placeholder:text-brand-gray/50 resize-none"
                    placeholder="Describe the machine capacity or application you need..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto px-10 py-5 bg-brand-amber hover:bg-brand-amberHover text-white font-bold rounded-xl shadow-xl shadow-brand-amber/20 hover:shadow-brand-amber/40 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  Submit Inquiry <Send className="w-6 h-6 drop-shadow-sm" />
                </button>
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
