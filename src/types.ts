/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: "Deportivo" | "Súper" | "SUV / Offroad" | "Clásico" | "Motos" | "VIP Pack";
  handlingType: "RWD (Trasera)" | "AWD (Total)" | "FWD (Delantera)";
  description: string;
  longDescription?: string;
  imageUrl: string;
  stats: {
    speed: number;      // 1-100
    acceleration: number; // 1-100
    braking: number;      // 1-100
    handling: number;     // 1-100
  };
  downloadSize: string; // e.g. "12 MB"
  textures: string;     // e.g. "4K Optimized"
  isFeatured?: boolean;
  isOnSale?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  vehicle: Vehicle;
  quantity: number;
}

export interface Review {
  id: string;
  vehicleId: string; // "general" for store reviews
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface TicketMessage {
  id: string;
  sender: "user" | "staff" | "system";
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject: string;
  category: "Soporte Técnico" | "Problema de Compra" | "Reporte de Bug" | "Donaciones";
  status: "Abierto" | "En Proceso" | "Resuelto" | "Cerrado";
  createdAt: string;
  messages: TicketMessage[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "Binance Pay" | "Credit Card" | "PayPal";
  status: "Completed" | "Pending";
  transactionId: string;
}

export interface User {
  username: string;
  email: string;
  role: "admin" | "user" | "guest";
  discordId?: string;
  balance?: number;
  ownedVehicles: string[]; // Vehicle IDs
}
