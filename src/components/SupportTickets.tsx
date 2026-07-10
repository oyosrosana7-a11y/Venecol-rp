/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { 
  PlusCircle, MessageSquare, Clock, CheckCircle, Send, 
  User as UserIcon, LifeBuoy, AlertCircle, RefreshCw, Terminal, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Ticket, TicketMessage, User } from "../types";

interface SupportTicketsProps {
  currentUser: User;
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onAddMessageToTicket: (ticketId: string, text: string, sender: "user" | "staff" | "system") => void;
}

export default function SupportTickets({
  currentUser,
  tickets,
  onAddTicket,
  onAddMessageToTicket
}: SupportTicketsProps) {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Ticket["category"]>("Soporte Técnico");
  const [messageText, setMessageText] = useState("");
  const [replyText, setReplyText] = useState("");
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [simulatedTyping, setSimulatedTyping] = useState(false);

  // Filter tickets to only display user's tickets
  const filteredTickets = tickets; // Stored in state at App level

  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  // Handle Ticket Submission
  const handleCreateTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageText.trim()) return;

    const newTicketId = "TK-" + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleString("es-VE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newTicket: Ticket = {
      id: newTicketId,
      subject: subject,
      category: category,
      status: "Abierto",
      createdAt: now,
      messages: [
        {
          id: "msg-init",
          sender: "system",
          text: `Ticket de soporte creado bajo la categoría: ${category}. Se ha enviado una notificación automática a nuestro staff de Discord.`,
          timestamp: now
        },
        {
          id: "msg-user-init",
          sender: "user",
          text: messageText,
          timestamp: now
        }
      ]
    };

    onAddTicket(newTicket);
    setActiveTicketId(newTicketId);
    setSubject("");
    setMessageText("");
    setShowCreateForm(false);

    // Trigger automated staff reply after 3 seconds
    simulateStaffReply(newTicketId, category);
  };

  // Handle user sending a follow-up message inside an active ticket
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicketId) return;

    onAddMessageToTicket(activeTicketId, replyText, "user");
    const userMsg = replyText;
    setReplyText("");

    // Simulate staff replying back
    simulateStaffReply(activeTicketId, activeTicket?.category || "Soporte Técnico", userMsg);
  };

  // Simulated staff reply machine
  const simulateStaffReply = (ticketId: string, ticketCategory: string, userLastMsg?: string) => {
    setSimulatedTyping(true);

    setTimeout(() => {
      setSimulatedTyping(false);
      
      let staffText = "Hola. Hemos recibido tu mensaje y el equipo está analizando los detalles de tu servidor. Te contactaremos pronto.";
      const lower = userLastMsg?.toLowerCase() || "";

      if (ticketCategory === "Soporte Técnico") {
        if (lower.includes("instalar") || lower.includes("subir") || lower.includes("poner")) {
          staffText = "Hola. Para subir el vehículo, asegúrate de colocar los archivos descomprimidos en /resources/[vehicles]/ y añadir la línea 'ensure [id_recurso]' en tu archivo server.cfg. ¿Has hecho este paso?";
        } else {
          staffText = "Hola, soy Andrés del soporte técnico de Venecol. ¿Podrías confirmarnos si ves algún error específico de textura o colisión en la consola F8 de tu cliente FiveM?";
        }
      } else if (ticketCategory === "Problema de Compra") {
        staffText = "Saludos de Venecol Facturación. He verificado el estado de tu transacción simulada en la blockchain. Tu pago fue procesado correctamente y tus recursos ya están activos para descargar en tu Dashboard.";
      } else if (ticketCategory === "Reporte de Bug") {
        staffText = "Gracias por reportar el bug. Lo hemos transferido directamente a nuestro canal de desarrollo de FiveM. Si es necesario un parche, lo subiremos de inmediato a este portal.";
      } else if (ticketCategory === "Donaciones") {
        staffText = "Hola, muchas gracias por tu interés en apoyar a Venecol RP. Tus donaciones nos ayudan a mantener los servidores online. El rango VIP se sincroniza automáticamente con tu cuenta de Discord enlazada.";
      }

      onAddMessageToTicket(ticketId, staffText, "staff");
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-28 font-sans">
      {/* Title */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold font-mono text-[#EB5757] uppercase tracking-widest flex items-center gap-1">
            <LifeBuoy className="w-3.5 h-3.5" /> CANALES DE AYUDA DIRECTA
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight mt-1">
            Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EB5757] to-[#F2C94C]">Soporte</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
            Abre tickets técnicos y de facturación. Nuestro sistema simula un flujo de respuesta enlazado con webhooks de Discord.
          </p>
        </div>

        {!showCreateForm && !activeTicketId && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-5 py-3 bg-gradient-to-r from-[#EB5757] to-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(235,87,87,0.25)] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>NUEVO TICKET</span>
          </button>
        )}
      </div>

      {/* Main interface layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: List of Active Tickets */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 font-mono">Tus Tickets Históricos</h3>
            
            {filteredTickets.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-xs">No tienes ningún ticket de soporte activo.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="text-xs text-[#EB5757] font-semibold hover:underline mt-2 cursor-pointer"
                >
                  Crear un ticket ahora
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTickets.map((tk) => {
                  const isActive = tk.id === activeTicketId;
                  const lastMessage = tk.messages[tk.messages.length - 1];

                  return (
                    <button
                      key={tk.id}
                      onClick={() => {
                        setActiveTicketId(tk.id);
                        setShowCreateForm(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                        isActive
                          ? "bg-[#EB5757]/10 border-[#EB5757]/30"
                          : "bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono text-gray-500">{tk.createdAt}</span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          tk.status === "Abierto" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-gray-800 text-gray-400"
                        }`}>
                          {tk.status}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wide truncate ${isActive ? "text-white" : "text-gray-300"}`}>
                          {tk.subject}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{tk.category}</p>
                      </div>

                      {lastMessage && (
                        <p className="text-[11px] text-gray-400 line-clamp-1 italic bg-black/25 p-1.5 rounded">
                          {lastMessage.sender === "user" ? "Tú: " : lastMessage.sender === "staff" ? "Soporte: " : ""}
                          {lastMessage.text}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket Creation Form OR Active Ticket Messages View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* VIEW A: Create ticket Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black uppercase font-display text-white">Abrir Nuevo Ticket</h3>
                  <button 
                    onClick={() => setShowCreateForm(false)}
                    className="text-xs text-gray-500 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-5 text-xs sm:text-sm text-gray-300">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Asunto del Problema</label>
                    <input
                      type="text"
                      placeholder="E.g. Error de texturas en Bolívar V12 o error de descarga"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 focus:border-[#EB5757]/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Categoría de Consulta</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Ticket["category"])}
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 focus:border-[#EB5757]/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                      >
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Problema de Compra">Problema de Compra</option>
                        <option value="Reporte de Bug">Reporte de Bug</option>
                        <option value="Donaciones">Donaciones</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Tu Cuenta de Discord</label>
                      <input
                        type="text"
                        value={currentUser.discordId || "No enlazado"}
                        disabled
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Mensaje Explicativo</label>
                    <textarea
                      placeholder="Por favor describe detalladamente tu consulta. Indica errores vistos en consola o pasos realizados..."
                      rows={6}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 focus:border-[#EB5757]/50 rounded-xl p-4 text-xs text-white resize-none focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#EB5757] hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#EB5757]/15"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ENVIAR TICKET DE SOPORTE</span>
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW B: Active Ticket Messages Thread */}
            {activeTicket && !showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col justify-between overflow-hidden h-[600px]"
              >
                {/* Header info */}
                <div className="p-4 bg-black/20 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTicketId(null)}
                      className="p-1 text-gray-400 hover:text-white lg:hidden"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500">{activeTicket.id}</span>
                        <span className="text-[10px] font-mono text-[#F2C94C] uppercase font-bold">{activeTicket.category}</span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wide leading-tight mt-0.5">{activeTicket.subject}</h3>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">
                    {activeTicket.status}
                  </span>
                </div>

                {/* Messages Log Scroller */}
                <div className="flex-grow p-5 overflow-y-auto space-y-4 font-sans flex flex-col justify-end">
                  <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
                    {activeTicket.messages.map((msg) => {
                      if (msg.sender === "system") {
                        return (
                          <div key={msg.id} className="text-center py-2 px-6">
                            <span className="inline-block bg-[#1a1a1a] border border-white/5 text-gray-400 text-[10px] px-3.5 py-1.5 rounded-xl font-mono max-w-lg leading-relaxed">
                              {msg.text}
                            </span>
                          </div>
                        );
                      }

                      const isUser = msg.sender === "user";

                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
                        >
                          {!isUser && (
                            <div className="w-7 h-7 bg-[#EB5757]/15 rounded-full border border-[#EB5757]/30 flex items-center justify-center font-bold text-xs text-[#EB5757] flex-shrink-0">
                              S
                            </div>
                          )}
                          <div className={`max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed border ${
                            isUser
                              ? "bg-[#EB5757]/10 border-[#EB5757]/20 text-white rounded-tr-none"
                              : "bg-[#141414] border-white/5 text-gray-300 rounded-tl-none"
                          }`}>
                            <p className="font-semibold text-[10px] text-[#F2C94C] font-mono mb-1">
                              {isUser ? currentUser.username : "Andrés (Soporte Técnico)"}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-[9px] text-gray-500 font-mono text-right mt-1.5">{msg.timestamp}</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Simulated staff typing indicator */}
                    {simulatedTyping && (
                      <div className="flex justify-start gap-3">
                        <div className="w-7 h-7 bg-[#EB5757]/15 rounded-full border border-[#EB5757]/30 flex items-center justify-center font-bold text-xs text-[#EB5757]">
                          S
                        </div>
                        <div className="bg-[#141414] border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-gray-500">
                          <p className="font-mono text-[9px] text-gray-600 mb-1">Andrés está escribiendo...</p>
                          <div className="flex gap-1 py-1 px-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply Input Box */}
                <form onSubmit={handleSendMessage} className="p-4 bg-black/45 border-t border-white/5 flex gap-2 font-mono">
                  <input
                    type="text"
                    placeholder="Escribe tu respuesta aquí..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-grow bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#EB5757]/40"
                    disabled={simulatedTyping}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || simulatedTyping}
                    className="px-4 py-3 bg-[#EB5757] hover:bg-red-600 disabled:bg-[#EB5757]/30 text-white font-bold rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW C: Idle intro card */}
            {!activeTicketId && !showCreateForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#111] border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[600px] font-sans"
              >
                <div className="p-4 bg-[#EB5757]/5 border border-[#EB5757]/10 rounded-full text-[#EB5757] mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-white font-black text-base uppercase tracking-wider">Historial de Mensajería</h3>
                <p className="text-gray-500 text-xs mt-1.5 max-w-sm leading-relaxed">
                  Elige un ticket de la columna izquierda para leer la conversación y chatear con el soporte técnico, o abre un nuevo caso.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md w-full text-left font-mono">
                  <div className="bg-black/30 border border-white/5 p-3.5 rounded-xl">
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Respuesta Media</p>
                    <p className="text-white font-bold text-sm mt-0.5">&lt; 3 minutos</p>
                  </div>
                  <div className="bg-black/30 border border-white/5 p-3.5 rounded-xl">
                    <p className="text-[9px] text-gray-500 uppercase font-bold">Canal de Discord</p>
                    <p className="text-white font-bold text-sm mt-0.5">Sincronizado</p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
