/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle, Review } from "./types";

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "ven-001",
    name: "Bolívar Nero Súper V12",
    brand: "Venecol Custom",
    price: 39.99,
    category: "Súper",
    handlingType: "AWD (Total)",
    description: "La joya de la corona. Chasis monocasco de carbono ultra-ligero y motor V12 Twin-Turbo con sonido personalizado en alta fidelidad.",
    longDescription: "El Bolívar Nero Súper V12 representa el pináculo del rendimiento virtual. Ajustado meticulosamente para los servidores de FiveM con un peso de colisión óptimo, un manejo agresivo pero predecible, y un panel interactivo totalmente animado. El recurso incluye texturas optimizadas a 4K/2K para evitar caídas de FPS en el servidor.",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 98,
      acceleration: 96,
      braking: 90,
      handling: 94
    },
    downloadSize: "14.2 MB",
    textures: "4K / 2K Optimizadas",
    isFeatured: true,
    isOnSale: true,
    originalPrice: 49.99
  },
  {
    id: "ven-002",
    name: "Gran Sabana Cruiser 4x4",
    brand: "Orinoco Overland",
    price: 29.99,
    category: "SUV / Offroad",
    handlingType: "AWD (Total)",
    description: "Preparada para los caminos más difíciles de Los Santos. Amortiguación ajustable y equipamiento de rescate integrado.",
    longDescription: "Diseñada para dominar la geografía de Blaine County y más allá. Cuenta con suspensión dinámica que responde de forma realista a los terrenos montañosos. El archivo incluye modificaciones estéticas exclusivas (defensas, luces LED funcionales y rines offroad) listas para instalar en tu tienda de tuning.",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 75,
      acceleration: 80,
      braking: 85,
      handling: 82
    },
    downloadSize: "18.5 MB",
    textures: "HD Ultra Texturas",
    isFeatured: true
  },
  {
    id: "ven-003",
    name: "Táchira GT-R Black Edition",
    brand: "Venecol Custom",
    price: 24.99,
    category: "Deportivo",
    handlingType: "RWD (Trasera)",
    description: "Ideal para drift y velocidad urbana. Tracción trasera pura y caja secuencial deportiva con petardeos audibles.",
    longDescription: "El rey del asfalto nocturno. El Táchira GT-R cuenta con un script de manejo especializado para drift controlado. Excelente respuesta del acelerador y luces bajo el chasis configurables mediante el menú del vehículo.",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 89,
      acceleration: 92,
      braking: 88,
      handling: 91
    },
    downloadSize: "11.1 MB",
    textures: "4K Optimizadas",
    isOnSale: true,
    originalPrice: 29.99
  },
  {
    id: "ven-004",
    name: "Ávila G-Wagon Zenith",
    brand: "G-Class Custom",
    price: 34.99,
    category: "SUV / Offroad",
    handlingType: "AWD (Total)",
    description: "Lujo intimidante. Blindaje estético premium, rines dorados de 22 pulgadas e interiores de cuero de alta costura.",
    longDescription: "Presencia absoluta en la carretera. El Ávila G-Wagon une el poder militar con el refinamiento de la alta sociedad de Los Santos. Cuenta con físicas anti-vuelco mejoradas para persecuciones intensas y vidrios polarizados oscuros personalizables.",
    imageUrl: "https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 82,
      acceleration: 84,
      braking: 80,
      handling: 78
    },
    downloadSize: "21.3 MB",
    textures: "2K Altamente Optimizadas",
    isFeatured: true
  },
  {
    id: "ven-005",
    name: "Canaima Classic Roadster",
    brand: "Retro Motors",
    price: 19.99,
    category: "Clásico",
    handlingType: "RWD (Trasera)",
    description: "Elegancia atemporal. Líneas vintage curvadas perfectas y un ronroneo de motor clásico que enamora al conducirlo.",
    longDescription: "Revive la época dorada de la velocidad. Un convertible clásico con capota funcional, volante de madera real tallada y físicas de suspensión suave que transmiten la sensación de estar flotando en las colinas de Vinewood.",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 70,
      acceleration: 68,
      braking: 72,
      handling: 85
    },
    downloadSize: "9.8 MB",
    textures: "HD Clásicas"
  },
  {
    id: "ven-006",
    name: "Catatumbo Lightning RR",
    brand: "Kavalkade",
    price: 14.99,
    category: "Motos",
    handlingType: "RWD (Trasera)",
    description: "La moto más rápida de la ciudad. Físicas de inclinación agresiva y aceleración instantánea con nitro integrado.",
    longDescription: "Llamada así por la icónica tormenta eléctrica del Zulia, esta hipermoto corta el viento como un rayo. Ajustada con un centro de gravedad optimizado para evitar caídas fáciles y acelerar de 0 a 100 km/h en solo 1.8 segundos.",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 95,
      acceleration: 99,
      braking: 84,
      handling: 88
    },
    downloadSize: "7.4 MB",
    textures: "4K Livianas",
    isOnSale: true,
    originalPrice: 19.99
  },
  {
    id: "ven-007",
    name: "Venecol VIP Cartel Pack",
    brand: "Bundle Pack",
    price: 49.99,
    category: "VIP Pack",
    handlingType: "AWD (Total)",
    description: "El paquete definitivo de estatus. Incluye 3 vehículos premium exclusivos y rango de Fundador Oro en el Servidor Discord.",
    longDescription: "Destaca como miembro VIP del servidor. Este paquete de soporte otorga acceso instantáneo para spawnear los vehículos más raros, un tag personalizado con efectos de color en el chat de FiveM y Discord, y prioridad máxima en la cola de conexión del servidor (Anti-Queue).",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    stats: {
      speed: 92,
      acceleration: 94,
      braking: 92,
      handling: 90
    },
    downloadSize: "45.0 MB",
    textures: "Premium Multipack",
    isFeatured: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-001",
    vehicleId: "ven-001",
    userName: "Juan_RP_Vzla",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "El sonido de ese V12 es simplemente espectacular. En el servidor carga súper rápido y el manejo está finísimo. 100% recomendado.",
    date: "2026-06-28"
  },
  {
    id: "rev-002",
    vehicleId: "ven-002",
    userName: "Andres_Maracay",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "Subir a Mount Chiliad con la Gran Sabana es otra cosa. Las físicas de suspensión se sienten brutales y las luces LED alumbran de verdad por la noche.",
    date: "2026-07-02"
  },
  {
    id: "rev-003",
    vehicleId: "ven-003",
    userName: "Yonaiker_Drifter",
    userAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
    rating: 4,
    comment: "Muy buena para driftar por los muelles. Solo le bajaría un pelín la sensibilidad de dirección pero con cambiar la configuración de la tienda quedó perfecta.",
    date: "2026-07-05"
  },
  {
    id: "rev-004",
    vehicleId: "general",
    userName: "Carlos_FiveM",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment: "La entrega de los recursos es inmediata y los tutoriales de instalación son muy claros. El soporte al cliente es de primer nivel, me ayudaron con un problema de colisiones en 5 minutos.",
    date: "2026-07-08"
  }
];
