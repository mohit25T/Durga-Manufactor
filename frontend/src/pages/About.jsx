import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Award, Factory, Globe2, ShieldCheck } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Navbar />

      <main className="flex-grow">
        {/* Abstract Hero */}
        <section className="bg-brand-slateDark text-white pt-24 pb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-amber/20 via-transparent to-transparent opacity-70"></div>
          
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 drop-shadow-lg"
            >
              Engineered For <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-amberHover">Excellence</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed"
            >
              We are Durga Manufactures, pioneers in industrial food processing machinery. Based in Rajkot, Gujarat, we have been delivering uncompromised quality and innovation to commercial kitchens across India.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-brand-slateDark mb-8 leading-tight">
                Our legacy of <br/><span className="text-brand-amber border-b-4 border-brand-amber pb-1">precision</span>
              </h2>
              <p className="text-lg text-brand-gray mb-6 leading-relaxed">
                Starting as a small workshop, Durga Manufactures has grown into a leading facility stretching thousands of square feet. Our core philosophy is simple: build machines that don't just work, but outlast the competition.
              </p>
              <p className="text-lg text-brand-gray leading-relaxed">
                By integrating state-of-the-art 304 grade stainless steel and advanced engineering techniques, our cutters, slicers, and mills deliver maximum yield with minimum downtime. We believe in empowering the food industry with reliable tools.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-brand-amber/20 rounded-3xl transform -rotate-3 blur-md"></div>
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
                alt="Factory Floor" 
                className="relative rounded-3xl shadow-2xl object-cover h-[550px] w-full"
              />
            </motion.div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="bg-white py-32 border-y border-brand-slate/5 relative">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-brand-amber/5 rounded-full blur-[100px]"></div>
          <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-brand-slateDark/5 rounded-full blur-[100px]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-slateDark">Why Choose Us</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: Factory, title: 'In-House Production', desc: 'Every component is strictly monitored in our Rajkot facility.' },
                { icon: ShieldCheck, title: '304 Grade Quality', desc: 'We never compromise. Food-grade steel ensures absolute safety.' },
                { icon: Award, title: 'Trusted By Brands', desc: 'Over 500+ commercial kitchens and industries rely on us globally.' },
                { icon: Globe2, title: 'Pan-India Reach', desc: 'Robust supply chain delivering machinery exactly when needed.' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-brand-light rounded-3xl p-10 border border-black/5 hover:border-brand-amber hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-amber group-hover:text-white transition-all text-brand-amber">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-slateDark mb-4">{item.title}</h3>
                  <p className="text-brand-gray font-medium leading-relaxed">{item.desc}</p>
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
