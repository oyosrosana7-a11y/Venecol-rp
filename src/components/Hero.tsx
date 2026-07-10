/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, Gamepad2, ArrowRight, ShieldCheck, Zap, MessageSquare } from "lucide-react";

interface HeroProps {
  onExploreCatalog: () => void;
  onJoinSupport: () => void;
}

export default function Hero({ onExploreCatalog, onJoinSupport }: HeroProps) {
  // Stats counters
  const stats = [
    { value: "4K / 2K", label: "Texturas Optimizadas", desc: "Cero tirones de FPS", icon: Zap },
    { value: "Instantánea", label: "Entrega de Recursos", desc: "Botón de descarga inmediato", icon: ShieldCheck },
    { value: "FiveM Ready", label: "Ajuste de Colisión", desc: "Manejo y físicas realistas", icon: Gamepad2 },
    { value: "24/7", label: "Soporte Técnico", desc: "Ayuda e instalación guiada", icon: MessageSquare }
  ];

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-transparent pt-24 pb-16">
      {/* Visual background layers */}
      <div className="absolute inset-0 bg-transparent pointer-events-none z-0" />
      
      {/* Premium flag-themed glow effects */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-[#F2C94C]/8 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-1/3 w-[550px] h-[550px] bg-[#2F80ED]/8 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-[#EB5757]/6 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[7000ms]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        {/* VIP Server Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-[#F2C94C]/10 border border-[#F2C94C]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F2C94C] mb-8 uppercase tracking-widest font-mono"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
          <span>ESTUDIO DE ASSETS PREMIUM</span>
        </motion.div>

        {/* Main Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-tight uppercase font-display tracking-tight"
        >
          Domina las calles de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] via-[#2F80ED] to-[#EB5757] drop-shadow-[0_0_30px_rgba(47,128,237,0.3)]">
            Los Santos
          </span>
        </motion.h1>

        {/* Supporting Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-lg max-w-3xl mx-auto mt-6 mb-10 leading-relaxed font-sans"
        >
          Consigue vehículos exclusivos de alta gama y paquetes de soporte optimizados al 100% para FiveM. 
          Desarrollados con colisión perfecta, texturas 4K ultraligeras y físicas de manejo de alto desempeño.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md px-4"
        >
          <button
            onClick={onExploreCatalog}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F2C94C] to-[#e0b435] text-black font-extrabold rounded-xl hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(242,201,76,0.35)] flex items-center justify-center gap-2 font-display cursor-pointer"
          >
            <span>VER CATÁLOGO</span>
            <ArrowRight className="w-4 h-4 text-black stroke-[3px]" />
          </button>
          <button
            onClick={onJoinSupport}
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 text-white font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-display cursor-pointer"
          >
            <span>SOPORTE VIP</span>
          </button>
        </motion.div>

        {/* Key Features Statistics Ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-20 w-full max-w-6xl font-sans"
        >
          {stats.map((st, idx) => {
            const IconComponent = st.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#F2C94C]/40 p-5 rounded-2xl text-left transition-all duration-300"
              >
                {/* Micro golden accent top-border */}
                <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-[#F2C94C]/0 via-[#F2C94C]/40 to-[#F2C94C]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                    {st.value}
                  </span>
                  <div className="p-2 bg-white/5 group-hover:bg-white/10 rounded-lg border border-white/10 text-[#F2C94C] transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-200">
                  {st.label}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 font-mono">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
