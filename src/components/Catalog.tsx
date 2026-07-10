/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { 
  ShoppingCart, Heart, SlidersHorizontal, Info, Search, 
  Flame, Gauge, Compass, CheckCircle2, ChevronRight, Sparkles, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Vehicle } from "../types";

interface CatalogProps {
  vehicles: Vehicle[];
  onAddToCart: (vehicle: Vehicle) => void;
  wishlist: string[];
  onToggleWishlist: (vehicleId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCustomizer: (vehicle: Vehicle) => void;
}

export default function Catalog({
  vehicles,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  searchQuery,
  setSearchQuery,
  onOpenCustomizer
}: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedHandling, setSelectedHandling] = useState<string>("Todos");
  const [minSpeed, setMinSpeed] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Unique Categories
  const categories = ["Todos", "Súper", "Deportivo", "SUV / Offroad", "Clásico", "Motos", "VIP Pack"];
  const handlings = ["Todos", "RWD (Trasera)", "AWD (Total)"];

  // Filter & Sort Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        const matchesCategory = selectedCategory === "Todos" || vehicle.category === selectedCategory;
        const matchesHandling = selectedHandling === "Todos" || vehicle.handlingType === selectedHandling;
        const matchesSearch = 
          vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpeed = vehicle.stats.speed >= minSpeed;

        return matchesCategory && matchesHandling && matchesSearch && matchesSpeed;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "speed-desc") return b.stats.speed - a.stats.speed;
        if (sortBy === "accel-desc") return b.stats.acceleration - a.stats.acceleration;
        // Default (featured / default order)
        return a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1;
      });
  }, [vehicles, selectedCategory, selectedHandling, searchQuery, minSpeed, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-28 font-sans">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold font-mono text-[#F2C94C] uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> RECURSOS OPTIMIZADOS
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight mt-1">
            Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] to-[#2F80ED]">Vehículos</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
            Explora nuestra línea de mods premium. Cada vehículo incluye archivos comprimidos listos para "drag-and-drop" en tu servidor FiveM.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showFilters 
                ? "bg-[#F2C94C] text-black border-[#F2C94C]" 
                : "bg-white/5 backdrop-blur-md text-gray-300 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showFilters ? "OCULTAR FILTROS" : "FILTROS AVANZADOS"}</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 backdrop-blur-md text-gray-300 border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#F2C94C]/40"
          >
            <option value="featured">Destacados Primero</option>
            <option value="price-asc">Precio: Bajo a Alto</option>
            <option value="price-desc">Precio: Alto a Bajo</option>
            <option value="speed-desc">Velocidad Máxima</option>
            <option value="accel-desc">Aceleración Instantánea</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Handling filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Tipo de Tracción</h4>
                <div className="flex flex-wrap gap-2">
                  {handlings.map((h) => (
                    <button
                      key={h}
                      onClick={() => setSelectedHandling(h)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedHandling === h
                          ? "bg-[#2F80ED] text-white border border-[#2F80ED]"
                          : "bg-black/50 border border-white/5 text-gray-400 hover:text-white hover:bg-black/80"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Speed Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Velocidad Mínima ({minSpeed})</h4>
                  {minSpeed > 0 && (
                    <button onClick={() => setMinSpeed(0)} className="text-[10px] font-mono text-[#F2C94C] hover:underline">
                      Restablecer
                    </button>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minSpeed}
                  onChange={(e) => setMinSpeed(parseInt(e.target.value))}
                  className="w-full accent-[#F2C94C] cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                  <span>Estándar (0)</span>
                  <span>Hypercar (95+)</span>
                </div>
              </div>

              {/* Status/Telemetry Checkbox */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Características FiveM</h4>
                <div className="flex flex-col gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F2C94C]" />
                    <span>Sonidos personalizados de alta definición (.awc)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2F80ED]" />
                    <span>Texturas encriptadas optimizadas anti-crash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EB5757]" />
                    <span>Manejo editable y personalizado (.meta)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs list */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-[#F2C94C] to-[#e0b435] text-black shadow-lg shadow-[#F2C94C]/15"
                : "bg-white/5 backdrop-blur-md hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filters status count */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-6 font-mono">
        <span>Mostrando {filteredVehicles.length} de {vehicles.length} vehículos</span>
        {(selectedCategory !== "Todos" || selectedHandling !== "Todos" || minSpeed > 0 || searchQuery !== "") && (
          <button
            onClick={() => {
              setSelectedCategory("Todos");
              setSelectedHandling("Todos");
              setMinSpeed(0);
              setSearchQuery("");
            }}
            className="text-[#F2C94C] hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Catalog Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-[#F2C94C] mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No se encontraron vehículos</h3>
          <p className="text-gray-500 text-xs max-w-md">
            Prueba a buscar con otra palabra clave o resetea los filtros para ver la colección completa de Venecol RP.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const isLiked = wishlist.includes(vehicle.id);
            return (
              <motion.div
                key={vehicle.id}
                layout
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#F2C94C]/40 hover:shadow-[0_0_30px_rgba(242,201,76,0.15)] transition-all duration-500 flex flex-col justify-between"
              >
                {/* Sale and category ribbons */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="bg-black/60 backdrop-blur-md text-gray-300 text-[9px] font-bold px-2 py-1 rounded-md border border-white/10 uppercase tracking-widest">
                    {vehicle.category}
                  </span>
                  {vehicle.isOnSale && (
                    <span className="bg-[#EB5757] text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider animate-pulse">
                      ¡OFERTA!
                    </span>
                  )}
                </div>

                {/* Heart Button */}
                <button
                  onClick={() => onToggleWishlist(vehicle.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/60 backdrop-blur-md hover:bg-black/85 rounded-xl border border-white/5 transition-colors cursor-pointer group/heart"
                >
                  <Heart className={`w-4 h-4 transition-transform group-hover/heart:scale-110 ${isLiked ? "fill-[#EB5757] text-[#EB5757]" : "text-gray-400 hover:text-[#EB5757]"}`} />
                </button>

                {/* Card Top: Image */}
                <div 
                  className="aspect-video overflow-hidden relative bg-neutral-900 cursor-pointer"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#F2C94C]" /> Ver especificaciones completas
                    </span>
                  </div>
                </div>

                {/* Card Middle: Info & Stats */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <p className="text-[#F2C94C] text-[10px] font-bold uppercase tracking-widest font-mono">
                        {vehicle.brand}
                      </p>
                      <span className="text-[10px] font-mono text-gray-500">
                        {vehicle.downloadSize}
                      </span>
                    </div>

                    <h3 
                      className="text-xl font-black text-white group-hover:text-[#F2C94C] transition-colors cursor-pointer font-display uppercase tracking-tight"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      {vehicle.name}
                    </h3>
                    
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                      {vehicle.description}
                    </p>

                    {/* Stats overview sliders */}
                    <div className="grid grid-cols-2 gap-3 mt-5 border-t border-b border-white/10 py-4 font-mono">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                          <span className="flex items-center gap-1"><Gauge className="w-3 h-3 text-[#F2C94C]" /> VELOCIDAD</span>
                          <span>{vehicle.stats.speed}</span>
                        </div>
                        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F2C94C] rounded-full" style={{ width: `${vehicle.stats.speed}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-[#EB5757]" /> ACELERACIÓN</span>
                          <span>{vehicle.stats.acceleration}</span>
                        </div>
                        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#EB5757] rounded-full" style={{ width: `${vehicle.stats.acceleration}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Pricing & Actions */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex flex-col">
                      {vehicle.isOnSale && vehicle.originalPrice && (
                        <span className="text-gray-500 text-xs line-through font-semibold font-mono">
                          ${vehicle.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-black text-white font-mono">
                        ${vehicle.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenCustomizer(vehicle)}
                        className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                        title="Tuning Customizer"
                      >
                        <Compass className="w-4 h-4 text-[#2F80ED]" />
                      </button>
                      <button
                        onClick={() => onAddToCart(vehicle)}
                        className="px-4 py-2.5 bg-[#F2C94C] hover:bg-yellow-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 hover:scale-[1.03] transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5px]" />
                        <span>AÑADIR</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Details Expanded Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVehicle(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-y-auto inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 p-6 md:p-8 overflow-y-auto max-h-[85vh] font-sans top-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Modal left: Image & details stats list */}
                <div className="md:w-1/2 space-y-4">
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                    <img
                      src={selectedVehicle.imageUrl}
                      alt={selectedVehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 font-mono space-y-3 text-xs">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Especificaciones del recurso</p>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Peso del archivo:</span>
                      <span className="text-white font-semibold">{selectedVehicle.downloadSize}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Calidad de Texturas:</span>
                      <span className="text-white font-semibold">{selectedVehicle.textures}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Transmisión física:</span>
                      <span className="text-white font-semibold">{selectedVehicle.handlingType}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Optimizado:</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">✔ Listo para FiveM</span>
                    </div>
                  </div>
                </div>

                {/* Modal right: Details description & pricing */}
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F2C94C] font-mono">
                        {selectedVehicle.brand}
                      </span>
                      <span className="bg-[#2F80ED]/10 text-[#2F80ED] border border-[#2F80ED]/20 text-[9px] font-bold px-2.5 py-1 rounded">
                        {selectedVehicle.category}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white font-display mt-2 uppercase tracking-tight">
                      {selectedVehicle.name}
                    </h3>

                    <p className="text-gray-300 text-xs mt-4 leading-relaxed">
                      {selectedVehicle.longDescription || selectedVehicle.description}
                    </p>

                    {/* Performance sliders inside modal */}
                    <div className="mt-6 space-y-3 font-mono">
                      <h4 className="text-[10px] text-gray-500 uppercase font-bold">Rendimiento Físico</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Velocidad Máxima</span>
                            <span>{selectedVehicle.stats.speed}/100</span>
                          </div>
                          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F2C94C] rounded-full" style={{ width: `${selectedVehicle.stats.speed}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Aceleración</span>
                            <span>{selectedVehicle.stats.acceleration}/100</span>
                          </div>
                          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#EB5757] rounded-full" style={{ width: `${selectedVehicle.stats.acceleration}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Frenado</span>
                            <span>{selectedVehicle.stats.braking}/100</span>
                          </div>
                          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedVehicle.stats.braking}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Maniobrabilidad</span>
                            <span>{selectedVehicle.stats.handling}/100</span>
                          </div>
                          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedVehicle.stats.handling}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions inside modal */}
                  <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-mono font-bold">Soporte incluido</p>
                      <p className="text-white font-mono font-bold text-xl">
                        ${selectedVehicle.price}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onOpenCustomizer(selectedVehicle);
                          setSelectedVehicle(null);
                        }}
                        className="px-4 py-2.5 bg-neutral-900 border border-white/10 hover:bg-neutral-800 rounded-xl text-xs font-bold text-[#2F80ED] transition-colors cursor-pointer"
                      >
                        Personalizar Auto
                      </button>
                      <button
                        onClick={() => {
                          onAddToCart(selectedVehicle);
                          setSelectedVehicle(null);
                        }}
                        className="px-6 py-2.5 bg-[#F2C94C] hover:bg-yellow-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 stroke-[2.5px]" />
                        <span>AÑADIR AL CARRITO</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
