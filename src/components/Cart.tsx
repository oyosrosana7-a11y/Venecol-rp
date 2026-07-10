/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  X, Trash2, ShoppingCart, Tag, CreditCard, Wallet, 
  CheckCircle, ArrowRight, ShieldCheck, DollarSign, Download 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Vehicle, User } from "../types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (vehicleId: string, quantity: number) => void;
  onRemoveFromCart: (vehicleId: string) => void;
  onClearCart: () => void;
  currentUser: User;
  onAddPurchasedVehicles: (vehicleIds: string[]) => void;
  onAddNewOrder: (order: any) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  currentUser,
  onAddPurchasedVehicles,
  onAddNewOrder
}: CartProps) {
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string>("");
  const [promoError, setPromoError] = useState<string>("");
  const [promoSuccess, setPromoSuccess] = useState<string>("");

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"Credit Card" | "Binance Pay">("Credit Card");

  // Form Fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [binanceId, setBinanceId] = useState("");

  const [formErrors, setFormErrors] = useState<string>("");
  const [latestOrderInfo, setLatestOrderInfo] = useState<any | null>(null);

  // Math Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.vehicle.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% processing fee
  const totalAmount = subtotal - discountAmount + taxAmount;

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const cleanedCode = promoCode.trim().toUpperCase();

    if (cleanedCode === "VENEZUELA") {
      setDiscountPercent(15);
      setAppliedPromo("VENEZUELA (15%)");
      setPromoSuccess("Código promocional de la bandera aplicado: 15% DESCUENTO.");
    } else if (cleanedCode === "LOS_SANTOS") {
      setDiscountPercent(20);
      setAppliedPromo("LOS_SANTOS (20%)");
      setPromoSuccess("Código de las calles aplicado: 20% DESCUENTO.");
    } else if (cleanedCode === "") {
      setPromoError("Por favor ingresa un código.");
    } else {
      setPromoError("Código inválido o expirado.");
    }
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setAppliedPromo("");
    setPromoCode("");
    setPromoSuccess("");
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormErrors("");

    // Simple validations
    if (paymentMethod === "Credit Card") {
      if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
        setFormErrors("Por favor completa todos los campos de tu tarjeta de crédito.");
        return;
      }
      if (cardNumber.length < 12) {
        setFormErrors("El número de tarjeta es inválido.");
        return;
      }
    } else {
      if (!binanceId) {
        setFormErrors("Por favor introduce tu Binance Pay ID o correo verificado.");
        return;
      }
    }

    // Success transaction generation
    const transactionId = "TX-" + Math.floor(100000 + Math.random() * 900000);
    const purchasedIds = cartItems.map((item) => item.vehicle.id);

    const orderData = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString("es-VE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      items: [...cartItems],
      subtotal: subtotal,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod: paymentMethod,
      status: "Completed" as const,
      transactionId: transactionId
    };

    // Unlock purchased vehicles in database
    onAddPurchasedVehicles(purchasedIds);
    // Push order into site history
    onAddNewOrder(orderData);
    setLatestOrderInfo(orderData);

    // Navigate to success state
    setCheckoutStep("success");
    // Wipe cart
    onClearCart();
  };

  const resetCartState = () => {
    setCheckoutStep("cart");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
    setBinanceId("");
    setFormErrors("");
    handleRemovePromo();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={resetCartState}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/60 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#F2C94C]" />
                <h3 className="text-lg font-black text-white font-display uppercase tracking-wider">
                  {checkoutStep === "cart" && "Tu Carrito"}
                  {checkoutStep === "payment" && "Información de Pago"}
                  {checkoutStep === "success" && "¡Pago Exitoso!"}
                </h3>
              </div>
              <button 
                onClick={resetCartState} 
                className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle panel content */}
            <div className="flex-grow overflow-y-auto p-6">
              {/* STEP 1: Main Cart List */}
              {checkoutStep === "cart" && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-[#141414] rounded-full border border-white/5 text-gray-500 mb-4 animate-bounce">
                        <ShoppingCart className="w-10 h-10" />
                      </div>
                      <h4 className="text-white font-bold text-sm">Tu carrito está vacío</h4>
                      <p className="text-gray-500 text-xs max-w-xs mt-1 leading-relaxed">
                        Explora los vehículos premium en el catálogo y añade tus favoritos para empezar a conducir en Los Santos.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {cartItems.map((item) => (
                        <div 
                          key={item.vehicle.id} 
                          className="flex gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl hover:border-white/20 transition-all items-center justify-between"
                        >
                          <div className="w-16 h-12 bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.vehicle.imageUrl} alt={item.vehicle.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-grow">
                            <span className="text-[9px] font-mono text-[#F2C94C] uppercase font-bold">{item.vehicle.brand}</span>
                            <h4 className="text-xs font-bold text-white uppercase leading-tight line-clamp-1">{item.vehicle.name}</h4>
                            <p className="text-[11px] font-mono font-bold text-gray-400 mt-0.5">${item.vehicle.price}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Quantity Controls */}
                            <select
                              value={item.quantity}
                              onChange={(e) => onUpdateQuantity(item.vehicle.id, parseInt(e.target.value))}
                              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md px-1.5 py-0.5 text-[11px] text-gray-300 font-semibold focus:outline-none focus:border-[#F2C94C]/40"
                            >
                              {[1, 2, 3, 4, 5].map((q) => (
                                <option key={q} value={q}>{q}</option>
                              ))}
                            </select>

                            <button 
                              onClick={() => onRemoveFromCart(item.vehicle.id)}
                              className="p-1 text-gray-500 hover:text-[#EB5757] transition-colors cursor-pointer"
                              title="Eliminar del carrito"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Promo Codes Application */}
                      <div className="border-t border-white/5 pt-5">
                        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 font-mono">¿Tienes un cupón?</p>
                        {appliedPromo ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex justify-between items-center text-xs text-emerald-400">
                            <span>Cupón activo: <strong>{appliedPromo}</strong></span>
                            <button onClick={handleRemovePromo} className="text-xs text-[#EB5757] font-semibold hover:underline">
                              Eliminar
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="E.g. VENEZUELA"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#F2C94C]/40 flex-grow"
                              />
                              <button
                                onClick={handleApplyPromo}
                                className="bg-[#1a1a1a] border border-white/10 text-white hover:bg-neutral-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Aplicar
                              </button>
                            </div>
                            {promoError && <p className="text-[10px] text-[#EB5757] font-semibold font-mono">{promoError}</p>}
                            {promoSuccess && <p className="text-[10px] text-emerald-400 font-semibold font-mono">{promoSuccess}</p>}
                            <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                              💡 Tip: Prueba <span className="text-gray-300 font-bold">VENEZUELA</span> para un 15% off, o <span className="text-gray-300 font-bold">LOS_SANTOS</span> para un 20% off.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: Checkout / Payment Information */}
              {checkoutStep === "payment" && (
                <form onSubmit={handlePaymentSubmit} className="space-y-5 text-sm">
                  {/* Select Payment Method */}
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Credit Card")}
                        className={`py-3.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === "Credit Card"
                            ? "bg-[#2F80ED]/10 border-[#2F80ED] text-[#2F80ED]"
                            : "bg-black border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Tarjeta de Crédito</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Binance Pay")}
                        className={`py-3.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === "Binance Pay"
                            ? "bg-[#F2C94C]/10 border-[#F2C94C] text-[#F2C94C]"
                            : "bg-black border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Binance Pay (USD)</span>
                      </button>
                    </div>
                  </div>

                  {formErrors && (
                    <div className="bg-[#EB5757]/10 border border-[#EB5757]/20 rounded-xl p-3 text-xs text-[#EB5757] font-semibold font-mono">
                      ⚠ {formErrors}
                    </div>
                  )}

                  {/* Form fields based on selection */}
                  {paymentMethod === "Credit Card" ? (
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold uppercase">Nombre del Tarjetahabiente</label>
                        <input
                          type="text"
                          placeholder="Juan Pérez"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-black border border-white/10 focus:border-[#2F80ED]/50 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold uppercase">Número de Tarjeta</label>
                        <input
                          type="text"
                          placeholder="4000 1234 5678 9010"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                          className="w-full bg-black border border-white/10 focus:border-[#2F80ED]/50 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-semibold uppercase">Expiración</label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-black border border-white/10 focus:border-[#2F80ED]/50 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-gray-400 font-semibold uppercase">CVV</label>
                          <input
                            type="password"
                            placeholder="***"
                            maxLength={3}
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            className="w-full bg-black border border-white/10 focus:border-[#2F80ED]/50 rounded-lg px-3 py-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-2 border-t border-white/5 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Transacción segura de prueba encriptada SSL</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-[#F2C94C]/10 border border-[#F2C94C]/20 rounded-xl p-4 text-xs text-gray-300 space-y-2 leading-relaxed">
                        <p className="font-bold text-[#F2C94C] uppercase flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5" /> Binance Pay Wallet
                        </p>
                        <p>Simula tu transferencia instantánea en criptoactivos (USDT / FDUSD) directamente desde tu Binance App.</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold uppercase">Binance Pay ID (o Correo Registrado)</label>
                        <input
                          type="text"
                          placeholder="e.g. 582914562"
                          value={binanceId}
                          onChange={(e) => setBinanceId(e.target.value)}
                          className="w-full bg-black border border-white/10 focus:border-[#F2C94C]/50 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-2 font-mono text-xs">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Resumen de Cuenta</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Método de pago:</span>
                      <span className="text-white font-semibold">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total neto:</span>
                      <span className="text-white font-bold text-sm">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("cart")}
                      className="w-1/3 py-3 border border-white/10 hover:bg-neutral-800 rounded-xl font-bold text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className={`w-2/3 py-3 rounded-xl font-black text-xs hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === "Binance Pay"
                          ? "bg-[#F2C94C] text-black shadow-lg shadow-[#F2C94C]/10"
                          : "bg-[#2F80ED] text-white shadow-lg shadow-[#2F80ED]/10"
                      }`}
                    >
                      <span>CONFIRMAR PAGO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Checkout Success State */}
              {checkoutStep === "success" && latestOrderInfo && (
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-white font-black text-lg uppercase tracking-tight">¡Transacción Completa!</h4>
                  <p className="text-gray-400 text-xs mt-2 max-w-sm leading-relaxed">
                    Muchas gracias por tu compra. Tu apoyo ayuda a financiar y mantener los servidores de Venecol RP.
                  </p>

                  {/* Receipt overview details */}
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 w-full mt-6 text-left font-mono text-xs space-y-3.5">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">ID de Orden:</span>
                      <span className="text-gray-200 font-bold">{latestOrderInfo.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Transacción:</span>
                      <span className="text-gray-300">{latestOrderInfo.transactionId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Total pagado:</span>
                      <span className="text-[#F2C94C] font-bold">${latestOrderInfo.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Recursos Desbloqueados:</p>
                      <div className="space-y-1 bg-black/50 p-2.5 rounded-lg border border-white/5">
                        {latestOrderInfo.items.map((item: CartItem) => (
                          <div key={item.vehicle.id} className="flex justify-between text-[11px]">
                            <span className="text-gray-300 font-bold truncate max-w-[200px]">{item.vehicle.name}</span>
                            <span className="text-emerald-400 font-semibold">{item.vehicle.downloadSize}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {currentUser.role === "guest" ? (
                    <div className="mt-8 bg-yellow-500/5 border border-[#F2C94C]/10 p-3.5 rounded-xl text-xs text-gray-400 text-left leading-relaxed">
                      💡 <strong>Nota:</strong> Al comprar como invitado, no puedes guardar tus archivos descargables de forma indefinida en tu Dashboard. Te recomendamos usar el profile-switcher arriba para simular una cuenta registrada.
                    </div>
                  ) : (
                    <div className="mt-8 space-y-3 w-full">
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl text-xs text-gray-400 text-left">
                        🎉 Los archivos se han agregado de forma permanente en tu dashboard. Ya puedes descargarlos desde la pestaña <strong className="text-gray-200">"Mi Dashboard"</strong>.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom calculation sidebar (only if we are inside cart step and have items) */}
            {checkoutStep === "cart" && cartItems.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-black/45 space-y-4">
                <div className="space-y-2.5 font-mono text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Descuento aplicado:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tasa de procesamiento (5%):</span>
                    <span className="text-white">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2.5 text-white">
                    <span>Gran Total:</span>
                    <span className="text-[#F2C94C] font-black text-lg">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="w-full bg-gradient-to-r from-[#F2C94C] to-[#e0b435] hover:scale-[1.01] transition-transform text-black font-extrabold text-sm py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PROCEDER AL PAGO</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[3px]" />
                </button>
              </div>
            )}

            {/* Success step exit button */}
            {checkoutStep === "success" && (
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={resetCartState}
                  className="w-full bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  CERRAR Y VOLVER
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
