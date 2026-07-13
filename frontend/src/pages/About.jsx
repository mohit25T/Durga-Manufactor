import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Award, Factory, Globe2, ShieldCheck } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal">
      <Navbar />

      <main className="flex-grow">
        {/* Abstract Hero */}
        <section className="bg-brand-sage/30 text-brand-charcoal py-10 relative overflow-hidden border-b border-brand-sand">
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl md:text-5xl font-bold mb-4 text-brand-forest lowercase tracking-tight"
            >
              engineered for <span className="text-brand-charcoal">excellence</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-brand-gray max-w-2xl mx-auto leading-relaxed font-semibold"
            >
              We are Durga Manufactures, pioneers in industrial food processing machinery. Based in Rajkot, Gujarat, we have been delivering uncompromised quality and innovation to commercial kitchens across India.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-forest lowercase tracking-tight mb-6">
                our legacy of <span className="border-b-2 border-brand-forest pb-1">precision</span>
              </h2>
              <div className="space-y-4 text-sm font-semibold text-brand-gray leading-relaxed">
                <p>
                  Starting as a small workshop, Durga Manufactures has grown into a leading facility stretching thousands of square feet. Our core philosophy is simple: build machines that don't just work, but outlast the competition.
                </p>
                <p>
                  By integrating state-of-the-art 304 grade stainless steel and advanced engineering techniques, our cutters, slicers, and mills deliver maximum yield with minimum downtime. We believe in empowering the food industry with reliable tools.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-brand-sand p-3 shadow-sm"
            >
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
                alt="Factory Floor" 
                className="w-full h-[450px] object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="bg-white py-12 border-t border-b border-brand-sand">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-forest lowercase tracking-tight">why choose us</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Factory, title: 'In-House Production', desc: 'Every component is strictly monitored in our Rajkot facility.' },
                { icon: ShieldCheck, title: '304 Grade Quality', desc: 'We never compromise. Food-grade steel ensures absolute safety.' },
                { icon: Award, title: 'Trusted By Brands', desc: 'Over 500+ commercial kitchens and industries rely on us globally.' },
                { icon: Globe2, title: 'Pan-India Reach', desc: 'Robust supply chain delivering machinery exactly when needed.' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-brand-cream/30 border border-brand-sand p-6 rounded-none transition-all duration-300 group hover:border-brand-forest/40"
                >
                  <div className="w-12 h-12 bg-brand-sage/40 border border-brand-sand flex items-center justify-center mb-4 text-brand-forest group-hover:bg-brand-forest group-hover:text-white transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brand-forest lowercase mb-3">{item.title}</h3>
                  <p className="text-brand-gray font-semibold text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default About;
