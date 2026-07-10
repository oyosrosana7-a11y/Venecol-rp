/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ShoppingCart, User, Menu, X, Search, ShieldCheck, Heart, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserType } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  toggleCart: () => void;
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  toggleCart,
  currentUser,
  setCurrentUser,
  searchQuery,
  setSearchQuery,
  wishlistCount
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const roles = [
    {
      name: "Juan_RP (Usuario)",
      role: "user" as const,
      email: "juan.rp@venecol.com",
      discordId: "JuanVzla#4512",
      balance: 150.0,
      ownedVehicles: ["ven-002"] // Already owns Gran Sabana Cruiser
    },
    {
      name: "VenecolAdmin (Admin)",
      role: "admin" as const,
      email: "admin@venecol.com",
      discordId: "AdminVenecol#0001",
      balance: 9999.0,
      ownedVehicles: ["ven-001", "ven-004", "ven-007"]
    },
    {
      name: "Invitado (Guest)",
      role: "guest" as const,
      email: "",
      discordId: "",
      balance: 0.0,
      ownedVehicles: []
    }
  ];

  const handleRoleChange = (selected: typeof roles[0]) => {
    setCurrentUser({
      username: selected.role === "guest" ? "Invitado" : selected.name.split(" ")[0],
      email: selected.email,
      role: selected.role,
      discordId: selected.discordId || undefined,
      balance: selected.balance,
      ownedVehicles: selected.ownedVehicles
    });
    setShowRoleSelector(false);
    // If we switch to guest, reset tab to inicio if we are in admin or profile
    if (selected.role === "guest" && (activeTab === "profile" || activeTab === "admin")) {
      setActiveTab("home");
    } else if (selected.role === "user" && activeTab === "admin") {
      setActiveTab("profile");
    } else if (selected.role === "admin" && activeTab === "profile") {
      setActiveTab("admin");
    }
  };

  const navItems = [
    { id: "home", label: "Inicio" },
    { id: "catalog", label: "Catálogo" },
    { id: "support", label: "Soporte" },
    ...(currentUser.role !== "guest" ? [{ id: "profile", label: "Mi Dashboard" }] : []),
    ...(currentUser.role === "admin" ? [{ id: "admin", label: "Admin Panel" }] : [])
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-[#F2C94C]/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab("home")}
          id="nav-logo-container"
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing layered gradient light behind logo */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#F2C94C] via-[#2F80ED] to-[#EB5757] opacity-60 blur-xs animate-pulse"></div>
            <div className="relative w-10 h-10 bg-black rounded-full border border-[#f2c94c]/50 flex items-center justify-center font-bold text-sm tracking-widest text-[#F2C94C]">
              V
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-tight">
              VENECOL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2C94C] via-[#2F80ED] to-[#EB5757]">RP</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">FIVE M PREMIUM</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium tracking-wide uppercase font-display">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative py-2 transition-all duration-300 ${
                activeTab === item.id 
                  ? "text-[#F2C94C] font-semibold" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F2C94C] to-[#2F80ED]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search, Action Icons & Role Switcher */}
        <div className="hidden md:flex items-center gap-4">
          {/* Quick Search */}
          <div className="relative w-44 lg:w-56" id="navbar-search-wrapper">
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "catalog") setActiveTab("catalog");
              }}
              className="w-full bg-white/5 backdrop-blur-md hover:bg-white/10 focus:bg-white/15 border border-white/10 focus:border-[#F2C94C]/40 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-gray-500 transition-all outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Wishlist Indicators */}
          {wishlistCount > 0 && (
            <button 
              onClick={() => setActiveTab("catalog")}
              className="text-gray-400 hover:text-[#EB5757] relative p-1.5 transition-colors"
              title="Ver favoritos"
            >
              <Heart className="w-5 h-5 fill-[#EB5757] text-[#EB5757]" />
              <span className="absolute -top-1 -right-1 bg-[#EB5757] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white">
                {wishlistCount}
              </span>
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
            id="nav-cart-btn"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-gradient-to-r from-[#EB5757] to-red-600 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Simulator Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center gap-2 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-[#F2C94C]/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
              id="role-selector-btn"
            >
              {currentUser.role === "admin" ? (
                <ShieldCheck className="w-4 h-4 text-[#F2C94C] animate-pulse" />
              ) : currentUser.role === "user" ? (
                <div className="w-2 h-2 rounded-full bg-[#2F80ED] animate-ping" />
              ) : (
                <User className="w-4 h-4 text-gray-400" />
              )}
              <span className="font-mono">{currentUser.username}</span>
              <span className="text-[9px] px-1 bg-white/5 text-gray-400 rounded uppercase">
                {currentUser.role}
              </span>
            </button>

            <AnimatePresence>
              {showRoleSelector && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleSelector(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 z-50 overflow-hidden font-sans"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                      <p className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Simular Identidad</p>
                      <p className="text-xs text-gray-300">Prueba los flujos del sitio</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {roles.map((r, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRoleChange(r)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col transition-all ${
                            currentUser.role === r.role
                              ? "bg-gradient-to-r from-[#F2C94C]/20 to-[#2F80ED]/10 text-white border border-[#F2C94C]/20"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="font-semibold flex items-center gap-1.5">
                            {r.role === "admin" && <ShieldCheck className="w-3.5 h-3.5 text-[#F2C94C]" />}
                            {r.role === "user" && <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED]" />}
                            {r.name}
                          </span>
                          {r.role !== "guest" && (
                            <span className="text-[10px] text-gray-500 font-mono">
                              {r.role === "user" ? `Saldo: $${r.balance}` : "Acceso Total"}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Wishlist indicator mobile */}
          {wishlistCount > 0 && (
            <button 
              onClick={() => setActiveTab("catalog")}
              className="text-[#EB5757] p-1"
            >
              <Heart className="w-5 h-5 fill-[#EB5757]" />
            </button>
          )}

          {/* Cart Icon Mobile */}
          <button onClick={toggleCart} className="relative p-1 text-gray-400 hover:text-white">
            <ShoppingCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EB5757] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Burger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0a] overflow-hidden px-4 py-4 flex flex-col gap-4 font-sans"
          >
            {/* Search Input mobile */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar auto..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "catalog") setActiveTab("catalog");
                }}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === item.id 
                      ? "bg-[#F2C94C]/10 text-[#F2C94C] border-l-2 border-[#F2C94C]" 
                      : "text-gray-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Role Simulator inside mobile menu */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-[10px] uppercase font-mono text-gray-500 tracking-wider mb-2">Simulador de Identidad</p>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleRoleChange(r);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all text-center ${
                      currentUser.role === r.role
                        ? "bg-[#F2C94C] text-black shadow-lg shadow-[#F2C94C]/25"
                        : "bg-[#141414] border border-white/10 text-gray-400"
                    }`}
                  >
                    {r.role === "admin" ? "Admin" : r.role === "user" ? "Juan_RP" : "Invitado"}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
