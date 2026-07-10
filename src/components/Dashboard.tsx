/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  User as UserIcon, Download, Terminal, Settings, ShieldAlert, 
  HelpCircle, Copy, CheckCircle2, MessageSquare, AlertCircle, Gamepad2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, Vehicle } from "../types";

interface DashboardProps {
  currentUser: User;
  vehicles: Vehicle[];
  onOpenSupportTab: (subject: string) => void;
}

export default function Dashboard({ currentUser, vehicles, onOpenSupportTab }: DashboardProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInstallerGuide, setShowInstallerGuide] = useState<string | null>(null);

  // Filter out which vehicles the user owns
  const userOwnedVehicles = vehicles.filter((v) => 
    currentUser.ownedVehicles.includes(v.id)
  );

  const handleDownload = (vehicle: Vehicle) => {
    setDownloadingId(vehicle.id);
    // Simulate high-fidelity zip file compilation download
    setTimeout(() => {
      setDownloadingId(null);
      // Create a virtual download link
      const element = document.createElement("a");
      const file = new Blob([`// Venecol RP - FiveM Resource Pack for ${vehicle.name}\n// Resource Name: ${vehicle.id}\n// Version: 1.0.0\n\nfx_version 'cerulean'\ngame 'gta5'\n\nauthor 'Venecol RP Store'\ndescription 'Optimized high-fidelity model'\n`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${vehicle.id}_fivem_resource.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const handleCopySpawn = (spawnName: string, id: string) => {
    navigator.clipboard.writeText(spawnName);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-28 font-sans">
      {/* Title */}
      <div className="mb-10">
        <span className="text-xs font-bold font-mono text-[#2F80ED] uppercase tracking-widest flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5" /> ÁREA PRIVADA DEL CLIENTE
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight mt-1">
          Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F80ED] to-[#F2C94C]">Dashboard</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
          Administra tus compras, descarga los archivos listos para el servidor y encuentra las guías de instalación.
        </p>
      </div>

      {/* Account Telemetry Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#2F80ED]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="p-4 bg-gradient-to-r from-[#2F80ED] to-[#1d5fb8] text-white rounded-xl shadow-lg">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 font-mono">Usuario Registrado</p>
            <h3 className="text-lg font-black text-white">{currentUser.username}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{currentUser.email || "Invitado anónimo"}</p>
          </div>
        </div>

        {/* Discord Sync */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-lg">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 font-mono">Discord Sincronizado</p>
            <h3 className="text-lg font-black text-white">
              {currentUser.discordId ? currentUser.discordId : "No enlazado"}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              {currentUser.discordId ? "Rango: Cliente Oro VIP" : "Enlaza para recibir rangos en chat"}
            </p>
          </div>
        </div>

        {/* Coins/Balance info */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2C94C]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="p-4 bg-[#F2C94C] text-black rounded-xl shadow-lg font-bold">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 font-mono">Saldo en Servidor</p>
            <h3 className="text-lg font-black text-white">
              ${currentUser.balance?.toFixed(2) || "0.00"} USD
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Simulado para compras futuras</p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Purchased assets listing */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
            <span>Tus Vehículos Desbloqueados</span>
            <span className="bg-white/5 text-[10px] px-2 py-0.5 rounded-full text-gray-400 font-mono">
              {userOwnedVehicles.length}
            </span>
          </h3>

          {userOwnedVehicles.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
              <AlertCircle className="w-10 h-10 text-gray-500 mb-3" />
              <h4 className="text-white font-bold text-sm">Aún no tienes ningún vehículo</h4>
              <p className="text-gray-500 text-xs mt-1.5 max-w-sm leading-relaxed">
                Todos tus autos y paquetes VIP comprados se reflejarán instantáneamente en este panel listos para descargar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOwnedVehicles.map((vehicle) => {
                const spawnCommand = `/spawn ${vehicle.id.replace("ven-", "car_")}`;
                const isGuideOpen = showInstallerGuide === vehicle.id;

                return (
                  <div 
                    key={vehicle.id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#2F80ED]/40 transition-all duration-300"
                  >
                    <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-center justify-between">
                      {/* Left side: car details */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-20 h-14 bg-neutral-900 border border-white/5 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-[#F2C94C] uppercase bg-[#F2C94C]/10 border border-[#F2C94C]/20 px-1.5 py-0.5 rounded">
                              {vehicle.category}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">{vehicle.downloadSize}</span>
                          </div>
                          <h4 className="text-lg font-black text-white uppercase mt-1 leading-tight">{vehicle.name}</h4>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Archivo verificado libre de malware
                          </p>
                        </div>
                      </div>

                      {/* Right side: Action list */}
                      <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setShowInstallerGuide(isGuideOpen ? null : vehicle.id)}
                          className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Instalación</span>
                        </button>
                        
                        <button
                          onClick={() => onOpenSupportTab(`Problema con recurso de ${vehicle.name}`)}
                          className="p-2.5 bg-neutral-900 hover:bg-[#EB5757]/10 border border-white/10 hover:border-[#EB5757]/30 text-gray-400 hover:text-[#EB5757] rounded-xl transition-all cursor-pointer"
                          title="Pedir ayuda técnica"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownload(vehicle)}
                          disabled={downloadingId === vehicle.id}
                          className="px-4 py-2 bg-[#2F80ED] hover:bg-[#1d5fb8] disabled:bg-[#1d5fb8]/40 disabled:text-gray-400 font-bold text-xs rounded-xl text-white flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <Download className={`w-3.5 h-3.5 ${downloadingId === vehicle.id ? "animate-bounce" : ""}`} />
                          <span>{downloadingId === vehicle.id ? "COMPILANDO..." : "DESCARGAR ZIP"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable guide section */}
                    <AnimatePresence>
                      {isGuideOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-white/5 bg-black/40 overflow-hidden"
                        >
                          <div className="p-5 md:p-6 space-y-4 text-xs leading-relaxed">
                            {/* Spawn code details box */}
                            <div className="bg-[#141414] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div>
                                <h5 className="font-bold text-white uppercase font-display text-[11px] tracking-wider text-[#F2C94C]">Código de Spawn de FiveM</h5>
                                <p className="text-gray-400 text-[11px] mt-0.5">Usa este comando dentro del juego para spawnear el vehículo instantáneamente en el chat del servidor.</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-black border border-white/10 px-3 py-1.5 rounded-lg w-full sm:w-auto justify-between">
                                <code className="text-[#2F80ED] font-mono text-xs font-bold select-all">{spawnCommand}</code>
                                <button
                                  onClick={() => handleCopySpawn(spawnCommand, vehicle.id)}
                                  className="text-gray-400 hover:text-white p-1"
                                >
                                  {copiedId === vehicle.id ? (
                                    <span className="text-[10px] text-emerald-400 font-bold">¡Copiado!</span>
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Detailed server install guide */}
                            <div className="space-y-3 font-sans">
                              <h5 className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">Guía Paso a Paso para Administradores de Servidor</h5>
                              <ol className="list-decimal list-inside space-y-2 text-gray-400 text-xs">
                                <li>Extrae el contenido descargado del archivo <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-gray-200 font-mono text-[11px]">{vehicle.id}_fivem_resource.zip</code>.</li>
                                <li>Sube la carpeta <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-[#2F80ED] font-mono text-[11px]">{vehicle.id}</code> al directorio <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-gray-200 font-mono text-[11px]">/resources/[vehicles]/</code> de tu servidor FXServer.</li>
                                <li>Abre tu archivo <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-gray-200 font-mono text-[11px]">server.cfg</code> en la raíz del servidor.</li>
                                <li>Añade la línea de arranque: <code className="bg-neutral-900 border border-[#F2C94C]/20 text-[#F2C94C] font-mono px-1.5 py-0.5 rounded text-[11px] font-semibold">ensure {vehicle.id}</code> al final de la sección de vehículos.</li>
                                <li>Guarda el archivo y reinicia el servidor, o ejecuta <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-gray-200 font-mono text-[11px]">refresh</code> y <code className="bg-neutral-900 border border-white/5 px-1 py-0.5 rounded text-gray-200 font-mono text-[11px]">start {vehicle.id}</code> en la consola F8/Server RCON.</li>
                              </ol>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Installer FAQ / Discord widget */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white">Preguntas Frecuentes</h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-gray-200">¿Cómo sé si los autos tienen lag?</p>
                <p className="text-gray-400 leading-relaxed">Nuestros vehículos están optimizados a menos de 30 MB de peso de ytd, previniendo caídas de textura y problemas de memoria física.</p>
              </div>

              <div className="space-y-1 border-t border-white/5 pt-3">
                <p className="font-semibold text-gray-200">¿Funcionan con vMenu y QB-Core?</p>
                <p className="text-gray-400 leading-relaxed">Sí, todos los vehículos son compatibles con vMenu, QB-Core, ESX, y cualquier framework personalizado de FiveM.</p>
              </div>

              <div className="space-y-1 border-t border-white/5 pt-3">
                <p className="font-semibold text-gray-200">¿Puedo cambiar la velocidad o manejo?</p>
                <p className="text-gray-400 leading-relaxed">Absolutamente, dentro de cada recurso tendrás el archivo <code className="bg-black text-[#F2C94C] px-1 rounded text-[10px] font-mono font-semibold">handling.meta</code> que puedes modificar a tu gusto.</p>
              </div>
            </div>
          </div>

          {/* Discord widget simulation */}
          <div className="bg-[#111] border border-indigo-500/10 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded font-mono uppercase">DISCORD OFICIAL</span>
            <h4 className="text-base font-black text-white uppercase tracking-tight">¿Tienes dudas o necesitas ayuda?</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Únete a nuestra comunidad oficial en Discord. Contamos con staff calificado que te guiará paso a paso en la instalación de los vehículos.
            </p>
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noreferrer"
              className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl hover:scale-[1.01] transition-transform cursor-pointer"
            >
              UNIRSE AL DISCORD
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
