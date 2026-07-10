/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import Cart from "./components/Cart";
import SupportTickets from "./components/SupportTickets";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import CustomizerAssistant from "./components/CustomizerAssistant";
import { INITIAL_VEHICLES } from "./data";
import { Vehicle, CartItem, Ticket, Order, User } from "./types";

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TK-1001",
    subject: "Físicas del Bolívar Nero Súper V12",
    category: "Soporte Técnico",
    status: "Abierto",
    createdAt: "09 Jul, 19:20",
    messages: [
      {
        id: "msg-init",
        sender: "system",
        text: "Ticket de soporte creado bajo la categoría: Soporte Técnico. Se ha enviado una notificación automática a nuestro staff de Discord.",
        timestamp: "09 Jul, 19:20"
      },
      {
        id: "msg-user-1",
        sender: "user",
        text: "Hola, tengo dudas de cómo instalar este auto en mi servidor de QB-Core. ¿Podrían orientarme?",
        timestamp: "09 Jul, 19:21"
      },
      {
        id: "msg-staff-1",
        sender: "staff",
        text: "Hola. Para subir el vehículo, asegúrate de colocar los archivos descomprimidos en /resources/[vehicles]/ y añadir la línea 'ensure [id_recurso]' en tu archivo server.cfg. ¿Has hecho este paso?",
        timestamp: "09 Jul, 19:25"
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizerVehicle, setCustomizerVehicle] = useState<Vehicle | null>(null);

  // Simulation state for vehicles, tickets, and orders list
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  // Current active user simulator
  const [currentUser, setCurrentUser] = useState<User>({
    username: "Juan_RP",
    email: "juan.rp@venecol.com",
    role: "user",
    discordId: "JuanVzla#4512",
    balance: 150.0,
    ownedVehicles: ["ven-002"] // Already owns Gran Sabana Cruiser
  });

  // Cart operations
  const handleAddToCart = (vehicle: Vehicle) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.vehicle.id === vehicle.id);
      if (existing) {
        return prevItems.map((item) =>
          item.vehicle.id === vehicle.id
            ? { ...item, quantity: Math.min(5, item.quantity + 1) }
            : item
        );
      }
      return [...prevItems, { vehicle, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleAddToCartFromCustomizer = (vehicle: Vehicle, tuningConfig: any) => {
    setCartItems((prevItems) => {
      // Create a unique id for customized models to avoid overlap
      const customizedVehicle = {
        ...vehicle,
        id: `${vehicle.id}-tuned-${Date.now()}`
      };
      return [...prevItems, { vehicle: customizedVehicle, quantity: 1 }];
    });
    setIsCartOpen(true);
    setActiveTab("catalog");
  };

  const handleUpdateQuantity = (vehicleId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.vehicle.id === vehicleId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (vehicleId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.vehicle.id !== vehicleId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddPurchasedVehicles = (vehicleIds: string[]) => {
    // Strip custom tuning suffixes if any, to unlock base items, or unlock as is
    const normalizedIds = vehicleIds.map(id => id.split("-tuned-")[0]);
    setCurrentUser((prev) => ({
      ...prev,
      ownedVehicles: Array.from(new Set([...prev.ownedVehicles, ...normalizedIds]))
    }));
  };

  const handleAddNewOrder = (order: Order) => {
    setOrdersList((prev) => [order, ...prev]);
  };

  // Wishlist operations
  const handleToggleWishlist = (vehicleId: string) => {
    setWishlist((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  // Support ticket operations
  const handleAddTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleAddMessageToTicket = (
    ticketId: string,
    text: string,
    sender: "user" | "staff" | "system"
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const now = new Date().toLocaleString("es-VE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
          const newMessage = {
            id: "msg-" + Date.now(),
            sender,
            text,
            timestamp: now
          };
          return {
            ...t,
            messages: [...t.messages, newMessage]
          };
        }
        return t;
      })
    );
  };

  // Admin panel catalog management
  const handleAddNewVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleUpdateVehiclePrice = (vehicleId: string, newPrice: number) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, price: newPrice } : v))
    );
  };

  const handleOpenCustomizer = (vehicle: Vehicle) => {
    setCustomizerVehicle(vehicle);
    setActiveTab("customizer");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Frosted Glass Theme Ambient Glowing Background Circles */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F2C94C]/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse duration-[8000ms]" id="frosted-glow-1"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#2F80ED]/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse duration-[10000ms]" id="frosted-glow-2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#EB5757]/5 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse duration-[7000ms]" id="frosted-glow-3"></div>

      {/* Fixed top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlist.length}
      />

      {/* Main Tab Routing Layout Wrapper */}
      <main className="flex-grow z-10 w-full relative">
        {activeTab === "home" && (
          <Hero
            onExploreCatalog={() => setActiveTab("catalog")}
            onJoinSupport={() => setActiveTab("support")}
          />
        )}
        {activeTab === "catalog" && (
          <Catalog
            vehicles={vehicles}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenCustomizer={handleOpenCustomizer}
          />
        )}
        {activeTab === "customizer" && (
          <CustomizerAssistant
            vehicles={vehicles.filter(v => v.category !== "VIP Pack")}
            initialSelectedVehicle={customizerVehicle}
            onAddToCart={handleAddToCartFromCustomizer}
          />
        )}
        {activeTab === "support" && (
          <SupportTickets
            currentUser={currentUser}
            tickets={tickets}
            onAddTicket={handleAddTicket}
            onAddMessageToTicket={handleAddMessageToTicket}
          />
        )}
        {activeTab === "profile" && (
          <Dashboard
            currentUser={currentUser}
            vehicles={vehicles}
            onOpenSupportTab={(subject) => {
              // Open new ticket creation panel
              setActiveTab("support");
              // Preset subject is handled or can be handled as needed
            }}
          />
        )}
        {activeTab === "admin" && (
          <AdminPanel
            vehicles={vehicles}
            onAddNewVehicle={handleAddNewVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onUpdateVehiclePrice={handleUpdateVehiclePrice}
            ordersList={ordersList}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onAddPurchasedVehicles={handleAddPurchasedVehicles}
        onAddNewOrder={handleAddNewOrder}
      />

      {/* Footer conforming to the Frosted Glass specification */}
      <footer className="h-16 flex-none bg-black/40 backdrop-blur-xl px-4 md:px-10 border-t border-[#F2C94C]/20 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest z-10" id="footer-component">
        <div>© {new Date().getFullYear()} VENECOL ROLEPLAY SERVICES</div>
        <div className="flex gap-4 md:gap-6">
          <span className="text-[#2F80ED] hover:scale-105 transition-transform">Discord: 14.2k Miembros</span>
          <span className="text-[#F2C94C] hover:scale-105 transition-transform">Servidor: Online (124/256)</span>
        </div>
      </footer>
    </div>
  );
}
