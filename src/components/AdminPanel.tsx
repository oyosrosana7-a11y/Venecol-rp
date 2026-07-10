/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  ShieldCheck, Plus, Trash2, Edit2, TrendingUp, ShoppingBag, 
  Users, CheckCircle, Save, DollarSign, Image as ImageIcon, BarChart3, Star
} from "lucide-react";
import { Vehicle, Order } from "../types";

interface AdminPanelProps {
  vehicles: Vehicle[];
  onAddNewVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onUpdateVehiclePrice: (vehicleId: string, newPrice: number) => void;
  ordersList: Order[];
}

export default function AdminPanel({
  vehicles,
  onAddNewVehicle,
  onDeleteVehicle,
  onUpdateVehiclePrice,
  ordersList
}: AdminPanelProps) {
  // New Vehicle Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Venecol Custom");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Vehicle["category"]>("Súper");
  const [handlingType, setHandlingType] = useState<Vehicle["handlingType"]>("AWD (Total)");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Specs slider states
  const [speed, setSpeed] = useState(85);
  const [acceleration, setAcceleration] = useState(80);
  const [braking, setBraking] = useState(75);
  const [handling, setHandling] = useState(80);

  // Price Editing state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const [formSuccess, setFormSuccess] = useState(false);

  // Unsplash shortcut suggestions
  const presetImages = [
    { label: "Deportivo Azul", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" },
    { label: "Súper Amarillo", url: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80" },
    { label: "Luxury SUV", url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80" }
  ];

  // Mathematical telemetry from real simulation orders
  const totalRevenue = ordersList.reduce((acc, order) => acc + order.total, 0) + 189.96; // Base seed revenue
  const totalItemsSold = ordersList.reduce((acc, order) => acc + order.items.length, 0) + 5;

  const handleCreateVehicleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) return;

    // Default image if empty
    const img = imageUrl.trim() || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80";

    const newVehicle: Vehicle = {
      id: "ven-" + Math.floor(100 + Math.random() * 900),
      name: name,
      brand: brand,
      price: parsedPrice,
      category: category,
      handlingType: handlingType,
      description: description,
      imageUrl: img,
      stats: {
        speed: speed,
        acceleration: acceleration,
        braking: braking,
        handling: handling
      },
      downloadSize: `${Math.floor(5 + Math.random() * 20)}.${Math.floor(0 + Math.random() * 9)} MB`,
      textures: "4K Optimizadas",
      isFeatured: false
    };

    onAddNewVehicle(newVehicle);
    
    // Clear Form
    setName("");
    setPrice("");
    setDescription("");
    setImageUrl("");
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const startEditPrice = (v: Vehicle) => {
    setEditingPriceId(v.id);
    setTempPrice(v.price.toString());
  };

  const handleSavePrice = (id: string) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val)) {
      onUpdateVehiclePrice(id, val);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-28 font-sans">
      {/* Title */}
      <div className="mb-10">
        <span className="text-xs font-bold font-mono text-[#F2C94C] uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> MÓDULO DE ADMINISTRACIÓN INTERNA
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight mt-1">
          Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] to-[#2F80ED]">Control</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
          Visualiza las estadísticas simuladas de compras, añade nuevos vehículos al catálogo en vivo y gestiona los precios y stock.
        </p>
      </div>

      {/* Analytics Telemetry row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {/* Rev */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#F2C94C]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3 text-gray-500 font-mono text-[10px] uppercase font-bold">
            <span>Ingresos Totales</span>
            <TrendingUp className="w-4 h-4 text-[#F2C94C]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-mono">${totalRevenue.toFixed(2)}</h3>
          <p className="text-[10px] text-gray-500 mt-1 font-mono">Simulaciones aprobadas</p>
        </div>

        {/* Sales count */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#2F80ED]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3 text-gray-500 font-mono text-[10px] uppercase font-bold">
            <span>Recursos Vendidos</span>
            <ShoppingBag className="w-4 h-4 text-[#2F80ED]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-mono">{totalItemsSold} packs</h3>
          <p className="text-[10px] text-gray-500 mt-1 font-mono">Descargas activas</p>
        </div>

        {/* Inventory size */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#EB5757]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3 text-gray-500 font-mono text-[10px] uppercase font-bold">
            <span>Catálogo Activo</span>
            <BarChart3 className="w-4 h-4 text-[#EB5757]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-mono">{vehicles.length} modelos</h3>
          <p className="text-[10px] text-gray-500 mt-1 font-mono">Optimizados para FiveM</p>
        </div>

        {/* User sessions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3 text-gray-500 font-mono text-[10px] uppercase font-bold">
            <span>Servidor Discord</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-mono">1,482 miembros</h3>
          <p className="text-[10px] text-gray-500 mt-1 font-mono">Bots y Webhooks online</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create new vehicle asset */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-black text-white uppercase font-display tracking-wider">Añadir Vehículo</h3>
              <p className="text-xs text-gray-500 mt-1">Crea un nuevo mod premium y agrégalo inmediatamente al catálogo general.</p>
            </div>

            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>¡Vehículo creado y cargado en el catálogo!</span>
              </div>
            )}

            <form onSubmit={handleCreateVehicleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase">Nombre del Vehículo</label>
                <input
                  type="text"
                  placeholder="E.g. Maracaibo Drift Roadster"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase">Precio ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase">Marca / Fabricante</label>
                  <input
                    type="text"
                    placeholder="Venecol Custom"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Vehicle["category"])}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Súper">Súper</option>
                    <option value="Deportivo">Deportivo</option>
                    <option value="SUV / Offroad">SUV / Offroad</option>
                    <option value="Clásico">Clásico</option>
                    <option value="Motos">Motos</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-bold uppercase">Tracción Física</label>
                  <select
                    value={handlingType}
                    onChange={(e) => setHandlingType(e.target.value as Vehicle["handlingType"])}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="AWD (Total)">AWD (Total)</option>
                    <option value="RWD (Trasera)">RWD (Trasera)</option>
                    <option value="FWD (Delantera)">FWD (Delantera)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase">Descripción Corta</label>
                <textarea
                  placeholder="Escribe un resumen atractivo del rendimiento..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-gray-400 font-bold uppercase">URL de Imagen Miniatura</label>
                  <span className="text-[10px] text-[#F2C94C] font-semibold">Presets abajo</span>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />

                {/* Preset suggestions shortcuts */}
                <div className="flex gap-2.5 mt-2">
                  {presetImages.map((pr, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(pr.url)}
                      className="bg-black border border-white/5 hover:border-[#F2C94C]/30 text-[9px] px-2 py-1 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs Sliders */}
              <div className="border-t border-white/5 pt-4 space-y-3.5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Ajuste de Atributos Físicos</h4>
                
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-gray-400">
                    <span>Velocidad Máxima ({speed})</span>
                  </div>
                  <input
                    type="range" min="40" max="100" value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full accent-[#F2C94C] h-1 bg-black rounded"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-gray-400">
                    <span>Aceleración ({acceleration})</span>
                  </div>
                  <input
                    type="range" min="40" max="100" value={acceleration}
                    onChange={(e) => setAcceleration(parseInt(e.target.value))}
                    className="w-full accent-[#EB5757] h-1 bg-black rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F2C94C] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#F2C94C]/15"
              >
                <Plus className="w-4 h-4 stroke-[2.5px]" />
                <span>AGREGAR AL CATÁLOGO</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Live Inventory List & Order Log Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Inventory List with Edit Price / Delete action */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6">
            <h3 className="text-sm font-black text-white uppercase font-display tracking-wider mb-4">Control de Inventario</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 font-mono text-[10px] uppercase text-gray-500 font-bold">
                    <th className="py-2.5">Vehículo</th>
                    <th className="py-2.5">Categoría</th>
                    <th className="py-2.5">Precio Unitario</th>
                    <th className="py-2.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vehicles.map((v) => {
                    const isEditing = editingPriceId === v.id;

                    return (
                      <tr key={v.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-2 font-semibold text-white">
                          <span className="font-mono text-[10px] text-[#F2C94C] mr-1.5 uppercase bg-[#F2C94C]/10 px-1 rounded">
                            {v.brand.split(" ")[0]}
                          </span>
                          {v.name}
                        </td>
                        <td className="py-3 text-gray-400">{v.category}</td>
                        <td className="py-3 font-mono font-bold">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-500">$</span>
                              <input
                                type="text"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-16 bg-black border border-[#F2C94C]/50 px-1.5 py-0.5 rounded text-xs text-white"
                              />
                            </div>
                          ) : (
                            <span>${v.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            {isEditing ? (
                              <button
                                onClick={() => handleSavePrice(v.id)}
                                className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition-all cursor-pointer"
                                title="Guardar Precio"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => startEditPrice(v)}
                                className="p-1.5 bg-neutral-900 border border-white/10 hover:border-[#F2C94C]/40 text-gray-400 hover:text-[#F2C94C] rounded transition-all cursor-pointer"
                                title="Editar Precio"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => onDeleteVehicle(v.id)}
                              className="p-1.5 bg-neutral-900 border border-white/10 hover:bg-[#EB5757]/10 hover:border-[#EB5757]/30 text-gray-500 hover:text-[#EB5757] rounded transition-all cursor-pointer"
                              title="Eliminar del catálogo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simulated Transaction Order Feed Log */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-white uppercase font-display tracking-wider">Historial de Ventas</h3>
              <span className="text-[10px] font-mono text-gray-500">Recientes de la sesión</span>
            </div>

            {ordersList.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-xs font-mono">
                No se han registrado transacciones en esta sesión de simulación.
              </div>
            ) : (
              <div className="space-y-3.5 font-mono text-[11px] leading-relaxed">
                {ordersList.map((order) => (
                  <div 
                    key={order.id}
                    className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center hover:border-white/20 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{order.id}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400">{order.date}</span>
                      </div>
                      <div className="text-gray-500 mt-1">
                        Vehículos: <span className="text-gray-300 font-semibold">{order.items.map(it => it.vehicle.name).join(", ")}</span>
                      </div>
                    </div>

                    <div className="text-right w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-start gap-4">
                      <span className="text-[9px] font-bold uppercase bg-[#F2C94C]/10 border border-[#F2C94C]/20 px-2 py-0.5 rounded text-[#F2C94C]">
                        {order.paymentMethod}
                      </span>
                      <span className="text-emerald-400 font-black text-sm sm:mt-1">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
