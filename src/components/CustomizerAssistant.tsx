/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Wrench, Sparkles, ChevronRight, Play, Gauge, ShieldCheck, 
  Flame, Compass, HelpCircle, RefreshCw, Car, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Vehicle } from "../types";

interface CustomizerAssistantProps {
  vehicles: Vehicle[];
  initialSelectedVehicle: Vehicle | null;
  onAddToCart: (vehicle: Vehicle, tuningConfig: any) => void;
}

export default function CustomizerAssistant({
  vehicles,
  initialSelectedVehicle,
  onAddToCart
}: CustomizerAssistantProps) {
  const [activeVehicle, setActiveVehicle] = useState<Vehicle>(
    initialSelectedVehicle || vehicles[0]
  );

  // Configuration States
  const [engineStage, setEngineStage] = useState<"Stage 1" | "Stage 2" | "Stage 3">("Stage 1");
  const [suspension, setSuspension] = useState<"Street" | "Track" | "Slammed (Suelo)">("Street");
  const [paintWrap, setPaintWrap] = useState<"Oro Venecol" | "Azul Eléctrico" | "Rojo Cardenal" | "Carbono Mate" | "Gris Nardo">("Oro Venecol");
  const [neonUnderglow, setNeonUnderglow] = useState<"Tricolor Bandera" | "Azul Eléctrico" | "Crimson Red" | "Apagado">("Tricolor Bandera");

  // Recalculated stats based on custom selections
  const [modifiedStats, setModifiedStats] = useState({
    speed: activeVehicle.stats.speed,
    acceleration: activeVehicle.stats.acceleration,
    braking: activeVehicle.stats.braking,
    handling: activeVehicle.stats.handling
  });

  const [simulatedReviewText, setSimulatedReviewText] = useState("");
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  // Sync state if initial vehicle changes
  useEffect(() => {
    if (initialSelectedVehicle) {
      setActiveVehicle(initialSelectedVehicle);
    }
  }, [initialSelectedVehicle]);

  // Recalculate physical performance stats
  useEffect(() => {
    let speedBonus = 0;
    let accelerationBonus = 0;
    let handlingBonus = 0;
    let brakingBonus = 0;

    // Engine Stages
    if (engineStage === "Stage 2") {
      speedBonus += 5;
      accelerationBonus += 8;
    } else if (engineStage === "Stage 3") {
      speedBonus += 12;
      accelerationBonus += 15;
    }

    // Suspension
    if (suspension === "Track") {
      handlingBonus += 8;
      brakingBonus += 4;
    } else if (suspension === "Slammed (Suelo)") {
      handlingBonus += 10;
      speedBonus -= 2; // Extra drag
    }

    setModifiedStats({
      speed: Math.min(100, activeVehicle.stats.speed + speedBonus),
      acceleration: Math.min(100, activeVehicle.stats.acceleration + accelerationBonus),
      braking: Math.min(100, activeVehicle.stats.braking + brakingBonus),
      handling: Math.min(100, activeVehicle.stats.handling + handlingBonus)
    });

    // Generate smart advice dynamically
    generateMechanicAdvice();

  }, [activeVehicle, engineStage, suspension, paintWrap, neonUnderglow]);

  const generateMechanicAdvice = () => {
    setIsGeneratingAdvice(true);
    // Simulate interactive parsing wait for responsive feeling
    setTimeout(() => {
      let text = "";
      if (activeVehicle.id === "ven-001") { // Bolívar Nero Súper V12
        text = `El motor V12 Twin-Turbo del Bolívar responde agresivamente al remapeo de ${engineStage}. `;
        if (suspension === "Slammed (Suelo)") {
          text += `Bajar la suspensión al suelo le da una estética imponente para presumir en el garage central de Los Santos, pero ojo con los baches de las alcantarillas de Legion Square. `;
        } else {
          text += `La suspensión ${suspension} mantendrá las 4 ruedas AWD firmemente plantadas en curvas rápidas. `;
        }
        text += `El color ${paintWrap} combinado con el neón ${neonUnderglow} proyecta una presencia de mafioso VIP inigualable.`;
      } else if (activeVehicle.id === "ven-002") { // Gran Sabana Cruiser
        text = `Preparar una Gran Sabana Offroad requiere torque constante. Con la reprogramación ${engineStage}, la respuesta de aceleración trepa de manera excelente en colinas empinadas. `;
        if (suspension === "Slammed (Suelo)") {
          text += `¿Una Gran Sabana al suelo? Es una build exótica digna de exhibición urbana, aunque sacrificas un poco de despeje offroad. `;
        } else {
          text += `Mantener la amortiguación ${suspension} le confiere el rebote de suspensión realista necesario para escalar Mount Chiliad. `;
        }
        text += `El vinilo ${paintWrap} resistirá el barro de Blaine County, y el kit de luces ${neonUnderglow} iluminará perfectamente en tus rutas nocturnas.`;
      } else {
        text = `La plataforma del ${activeVehicle.name} con tracción ${activeVehicle.handlingType} asimila de forma óptima el setup actual. `;
        text += `La modificación del motor a ${engineStage} incrementa la compresión del turbo y produce petardeos deportivos únicos al soltar el gas. `;
        text += `El acabado exterior ${paintWrap} con kit de neón ${neonUnderglow} lucirá fenomenal en carreras clandestinas nocturnas.`;
      }
      setSimulatedReviewText(text);
      setIsGeneratingAdvice(false);
    }, 600);
  };

  const handleAddCustomToCart = () => {
    const customPrice = activeVehicle.price + 
      (engineStage === "Stage 2" ? 5.00 : engineStage === "Stage 3" ? 10.00 : 0) + 
      (paintWrap === "Oro Venecol" ? 2.50 : 0);

    const customizedVehicle: Vehicle = {
      ...activeVehicle,
      name: `${activeVehicle.name} (Tuned)`,
      price: parseFloat(customPrice.toFixed(2)),
      stats: { ...modifiedStats },
      longDescription: `Edición exclusiva personalizada en nuestro taller Venecol Garage. Motor: ${engineStage} | Suspensión: ${suspension} | Wrap: ${paintWrap} | Neón: ${neonUnderglow}.`
    };

    onAddToCart(customizedVehicle, {
      engineStage,
      suspension,
      paintWrap,
      neonUnderglow
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-28 font-sans">
      {/* Title */}
      <div className="mb-10">
        <span className="text-xs font-bold font-mono text-[#2F80ED] uppercase tracking-widest flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5" /> PERSONALIZACIÓN VIRTUAL DEL ASSET
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight mt-1">
          Taller de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F80ED] via-[#F2C94C] to-[#EB5757]">Tuning</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
          Selecciona un auto, equipa mejoras de motor, cambia la pintura del wrapper y simula las nuevas físicas antes de realizar tu compra.
        </p>
      </div>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Vehicle picker list & configuration panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">1. Elige el Vehículo Base</h3>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVehicle(v)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                    activeVehicle.id === v.id
                      ? "bg-[#2F80ED]/10 border-[#2F80ED] text-white"
                      : "bg-white/5 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <img src={v.imageUrl} alt={v.name} className="w-10 h-7 object-cover rounded" />
                  <div className="truncate">
                    <p className="text-xs font-bold uppercase tracking-wide leading-tight">{v.name}</p>
                    <p className="text-[10px] font-mono text-gray-500">${v.price} Base</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modifications form options */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">2. Personaliza tus Componentes</h3>

            {/* Engine stage */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase font-mono">Reprogramación de Motor (ECU Remap)</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Stage 1", "Stage 2", "Stage 3"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setEngineStage(st)}
                    className={`py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      engineStage === st
                        ? "bg-[#2F80ED] text-white font-black"
                        : "bg-black border border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Suspension Setup */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase font-mono">Físicas de Suspensión</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Street", "Track", "Slammed (Suelo)"] as const).map((su) => (
                  <button
                    key={su}
                    onClick={() => setSuspension(su)}
                    className={`py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer truncate ${
                      suspension === su
                        ? "bg-[#F2C94C] text-black font-black"
                        : "bg-black border border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {su === "Slammed (Suelo)" ? "Suelo" : su}
                  </button>
                ))}
              </div>
            </div>

            {/* Paint wrapper presets */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase font-mono">Color de Pintura Metálica (Wrapper)</label>
              <select
                value={paintWrap}
                onChange={(e) => setPaintWrap(e.target.value as any)}
                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white outline-none focus:border-[#F2C94C]/40"
              >
                <option value="Oro Venecol">Oro Venecol (Dorado Bandera)</option>
                <option value="Azul Eléctrico">Azul Eléctrico (Satinado)</option>
                <option value="Rojo Cardenal">Rojo Cardenal (Brillante)</option>
                <option value="Carbono Mate">Carbono Mate (Texturizado)</option>
                <option value="Gris Nardo">Gris Nardo (Brillante)</option>
              </select>
            </div>

            {/* Neon underglow */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase font-mono">Kit de Neones en Chasis</label>
              <select
                value={neonUnderglow}
                onChange={(e) => setNeonUnderglow(e.target.value as any)}
                className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white outline-none focus:border-[#F2C94C]/40"
              >
                <option value="Tricolor Bandera">Bandera Venecol (Amarillo/Azul/Rojo)</option>
                <option value="Azul Eléctrico">Azul Eléctrico (Pulsante)</option>
                <option value="Crimson Red">Rojo Carmesí (Fijo)</option>
                <option value="Apagado">Sin neones</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center column: Live preview image, neons glow overlay effects, specifications panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-6 relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 font-mono">3. Vista Previa de la Ficha Técnica</h3>
            
            {/* Visual preview box with ambient light syncing color wraps */}
            <div className="aspect-video bg-neutral-950/60 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 relative flex items-center justify-center">
              <img
                src={activeVehicle.imageUrl}
                alt={activeVehicle.name}
                className="w-full h-full object-cover opacity-85"
              />

              {/* Simulated Ambient Neon glowing base beneath the preview image */}
              {neonUnderglow === "Tricolor Bandera" && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-500 via-blue-500 to-red-500 blur-md opacity-75" />
              )}
              {neonUnderglow === "Azul Eléctrico" && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-blue-500 blur-md opacity-75 animate-pulse" />
              )}
              {neonUnderglow === "Crimson Red" && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-red-600 blur-md opacity-75" />
              )}

              {/* Badge for paint selection info */}
              <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                Vinilo: <span className="text-[#F2C94C]">{paintWrap}</span>
              </div>
            </div>

            {/* Performance Stat Bars comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 border-t border-white/10 pt-6 font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400 font-bold">
                  <span className="flex items-center gap-1"><Gauge className="w-4 h-4 text-[#F2C94C]" /> VELOCIDAD MÁXIMA</span>
                  <span className="text-white">{modifiedStats.speed} / 100</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#F2C94C] rounded-full transition-all duration-500" style={{ width: `${modifiedStats.speed}%` }} />
                </div>
                {modifiedStats.speed > activeVehicle.stats.speed && (
                  <p className="text-[10px] text-emerald-400 font-bold">+{modifiedStats.speed - activeVehicle.stats.speed} de mejora de velocidad</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400 font-bold">
                  <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-[#EB5757]" /> ACELERACIÓN (0-100)</span>
                  <span className="text-white">{modifiedStats.acceleration} / 100</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#EB5757] rounded-full transition-all duration-500" style={{ width: `${modifiedStats.acceleration}%` }} />
                </div>
                {modifiedStats.acceleration > activeVehicle.stats.acceleration && (
                  <p className="text-[10px] text-emerald-400 font-bold">+{modifiedStats.acceleration - activeVehicle.stats.acceleration} de empuje de motor</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400 font-bold">
                  <span className="flex items-center gap-1"><Compass className="w-4 h-4 text-[#2F80ED]" /> MANIOBRABILIDAD</span>
                  <span className="text-white">{modifiedStats.handling} / 100</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-[#2F80ED] rounded-full transition-all duration-500" style={{ width: `${modifiedStats.handling}%` }} />
                </div>
                {modifiedStats.handling > activeVehicle.stats.handling && (
                  <p className="text-[10px] text-emerald-400 font-bold">+{modifiedStats.handling - activeVehicle.stats.handling} agarre de llantas</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400 font-bold">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> CALIDAD DE CARGA</span>
                  <span className="text-emerald-400">Excelente</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `100%` }} />
                </div>
                <p className="text-[10px] text-gray-500">Asset encriptado optimizado para evitar cuellos de botella.</p>
              </div>
            </div>
          </div>

          {/* Interactive Advisor box */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2C94C]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3.5">
              <MessageSquare className="w-4 h-4 text-[#F2C94C]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2C94C] font-mono">Consejo del Mecánico del Servidor</h4>
            </div>

            <AnimatePresence mode="wait">
              {isGeneratingAdvice ? (
                <div className="py-2 flex items-center gap-1.5 text-xs text-gray-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analizando las modificaciones físicas...</span>
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-300 leading-relaxed font-sans"
                >
                  "{simulatedReviewText}"
                </motion.p>
              )}
            </AnimatePresence>

            <div className="border-t border-white/10 mt-5 pt-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-mono">Precio del Auto Customizado</p>
                <p className="text-xl font-black text-white font-mono">
                  ${(activeVehicle.price + (engineStage === "Stage 2" ? 5.00 : engineStage === "Stage 3" ? 10.00 : 0) + (paintWrap === "Oro Venecol" ? 2.50 : 0)).toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleAddCustomToCart}
                className="px-6 py-3 bg-gradient-to-r from-[#2F80ED] to-indigo-600 hover:scale-[1.03] active:scale-[0.98] transition-all text-white font-black text-xs uppercase tracking-wide rounded-xl cursor-pointer"
              >
                Añadir Configuración al Carrito
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
