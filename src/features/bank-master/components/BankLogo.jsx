import React, { useState } from "react";
import { Landmark } from "lucide-react";

/**
 * High-fidelity brand SVG icons for Indian Commercial & Scheduled Banks
 */
const BANK_PRESET_LOGOS = {
  // Bank of Baroda (BOB / BARB) - Vermilion Orange Sunburst 'B'
  BOB: {
    bg: "#FFF3EB",
    border: "#FDBA74",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#F26522" />
        <path
          d="M13 11H25C29.4183 11 33 14.5817 33 19C33 21.8494 31.4925 24.3486 29.2155 25.7486C32.0792 27.0673 34 29.8973 34 33.2C34 37.95 30.15 41.8 25.4 41.8H13V11Z"
          fill="white"
        />
        <path
          d="M19 16.5H24.5C26.433 16.5 28 18.067 28 20C28 21.933 26.433 23.5 24.5 23.5H19V16.5ZM19 28H25C27.2091 28 29 29.7909 29 32C29 34.2091 27.2091 36 25 36H19V28Z"
          fill="#F26522"
        />
        <path d="M31 13L35 9M35 15L39 12M37 20L42 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },

  // Bank of India (BOI / BKID) - Star of India with Sunburst & Blue Center
  BKID: {
    bg: "#FFF5F0",
    border: "#FDBA74",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#FF4A00" />
        {/* 5-pointed Star of India */}
        <polygon
          points="24,8 28.5,19 40,19.5 31,26.5 34.5,38 24,31 13.5,38 17,26.5 8,19.5 19.5,19"
          fill="white"
        />
        <circle cx="24" cy="24" r="6" fill="#003875" />
        <circle cx="24" cy="24" r="3" fill="#FFD100" />
      </svg>
    ),
  },

  // Indian Bank (IDIB) - Triad of 3 Curved Petals in Blue, Gold & Red
  IDIB: {
    bg: "#EFF6FF",
    border: "#93C5FD",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#024B86" />
        {/* Center Triad Circles & Curves */}
        <circle cx="24" cy="24" r="14" fill="#043259" />
        <circle cx="24" cy="18" r="5" fill="#FFC20E" />
        <circle cx="18" cy="28" r="5" fill="#E31B23" />
        <circle cx="30" cy="28" r="5" fill="#00A3E0" />
        <circle cx="24" cy="24" r="3.5" fill="white" />
      </svg>
    ),
  },

  // Central Bank of India (CBIN / CBI) - Red Square with White Circular Floral Crest
  CBIN: {
    bg: "#FEF2F2",
    border: "#FECACA",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#D2232A" />
        <circle cx="24" cy="24" r="14" stroke="white" strokeWidth="2.5" />
        {/* Concentric 'C' Petals */}
        <path
          d="M24 13C18 13 13 18 13 24C13 30 18 35 24 35C29 35 33 32 34.5 27.5H29C28 29.5 26 31 24 31C20.2 31 17 27.8 17 24C17 20.2 20.2 17 24 17C26 17 28 18.5 29 20.5H34.5C33 16 29 13 24 13Z"
          fill="white"
        />
        <circle cx="24" cy="24" r="3" fill="white" />
      </svg>
    ),
  },

  // Indian Overseas Bank (IOBA / IOB) - Royal Blue with Gold Elephant Emblem
  IOBA: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#005CA9" />
        <circle cx="24" cy="24" r="14" stroke="#FFD100" strokeWidth="2" />
        {/* Stylized Elephant silhouette */}
        <path
          d="M17 28V24C17 20 20 17 24 17C28 17 31 19 32 22C33 25 31 28 29 29C27.5 29.5 26 29 26 27V26"
          stroke="#FFD100"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="21" cy="21" r="1.5" fill="white" />
        <path d="M19 28H30" stroke="#FFD100" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },

  // UCO Bank (UCBA / UCO) - Cobalt Blue with Golden Octagonal Ring and Clasped Hands
  UCBA: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#003399" />
        {/* Octagonal Gear Ring */}
        <polygon
          points="24,10 33,14 38,24 33,34 24,38 15,34 10,24 15,14"
          stroke="#FFCC00"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Clasped Hands motif */}
        <path
          d="M16 26L21 21C22 20 24 20 25 21L28 24C29 25 31 25 32 24L34 22"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M16 23L22 29C23 30 25 30 26 29L30 25"
          stroke="#FFCC00"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  // Bank of Maharashtra (MAHB / BOM) - Deep Ocean Blue with Diya Flame
  MAHB: {
    bg: "#F0F9FF",
    border: "#BAE6FD",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#004C87" />
        {/* Traditional Diya / Lamp */}
        <path
          d="M14 28C14 34 34 34 34 28H14Z"
          fill="#F58220"
        />
        {/* Flame of Diya */}
        <path
          d="M24 12C24 12 20 18 20 22C20 24.5 21.8 26 24 26C26.2 26 28 24.5 28 22C28 18 24 12 24 12Z"
          fill="#FFD100"
        />
        <circle cx="24" cy="22" r="2" fill="#E31B23" />
        {/* Base Ocean Wave line */}
        <path d="M12 35C16 33 20 37 24 35C28 33 32 37 36 35" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },

  // Punjab & Sind Bank (PSIB / PSB) - Royal Blue with Golden Torch / Hands
  PSIB: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#0B4EA2" />
        <circle cx="24" cy="24" r="14" stroke="#F37024" strokeWidth="2.5" />
        {/* Protecting hands holding flame */}
        <path
          d="M16 28C19 32 29 32 32 28"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Torch / Flame */}
        <path
          d="M24 14C24 14 21 19 21 22C21 24 22.3 25.5 24 25.5C25.7 25.5 27 24 27 22C27 19 24 14 24 14Z"
          fill="#F37024"
        />
        <rect x="22.5" y="25" width="3" height="7" rx="1" fill="white" />
      </svg>
    ),
  },

  // HDFC Bank - Geometric Blue Square with Red Center
  HDFC: {
    bg: "#EEF4FC",
    border: "#93C5FD",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#004C8F" />
        <rect x="9" y="9" width="30" height="30" rx="3" fill="#004C8F" stroke="white" strokeWidth="3" />
        <rect x="18" y="18" width="12" height="12" fill="#ED232A" />
        <line x1="24" y1="9" x2="24" y2="18" stroke="white" strokeWidth="3.5" />
        <line x1="24" y1="30" x2="24" y2="39" stroke="white" strokeWidth="3.5" />
        <line x1="9" y1="24" x2="18" y2="24" stroke="white" strokeWidth="3.5" />
        <line x1="30" y1="24" x2="39" y2="24" stroke="white" strokeWidth="3.5" />
      </svg>
    ),
  },

  // ICICI Bank - Saffron / Orange Flame & 'i'
  ICICI: {
    bg: "#FFF5EC",
    border: "#FDBA74",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#F37021" />
        <path
          d="M14 36C18 36 21.5 33 22 28C22.5 23 25.5 19 31 18C33 17.6 35 18 36 19C33 15 28 13 23 14C16 15.5 12 22 13 29C13.5 32.5 15.5 35 18 36Z"
          fill="white"
        />
        <circle cx="28" cy="19" r="3.2" fill="#991B1E" />
        <path
          d="M26.5 24.5C26.5 23.5 27.5 23 28.5 23C29.5 23 30.5 23.5 30.5 24.5V34C30.5 35 29.5 35.5 28.5 35.5C27.5 35.5 26.5 35 26.5 34V24.5Z"
          fill="#991B1E"
        />
      </svg>
    ),
  },

  // State Bank of India (SBI) - Royal Blue Disc with Keyhole
  SBI: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#1C5FA8" />
        <circle cx="24" cy="24" r="14" fill="#00A5DF" />
        <circle cx="24" cy="24" r="4.2" fill="white" />
        <rect x="22.2" y="24" width="3.6" height="14" fill="white" />
      </svg>
    ),
  },

  // Axis Bank - Burgundy Stylized 'A' Triangle
  AXIS: {
    bg: "#FFF1F2",
    border: "#FECDD3",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#97124B" />
        <path
          d="M24 10L37 36H28.5L24 26.8L19.5 36H11L24 10Z"
          fill="white"
        />
        <path
          d="M24 19L27.5 27.5H20.5L24 19Z"
          fill="#97124B"
        />
        <path
          d="M24 29L20 36H28L24 29Z"
          fill="white"
        />
      </svg>
    ),
  },

  // Canara Bank - Intertwined Sky Blue & Gold Triangles
  CANARA: {
    bg: "#F0F9FF",
    border: "#BAE6FD",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#0080C8" />
        <path
          d="M14 34L26 12L34 26L30 34H14Z"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M22 14L34 34H18L14 26L22 14Z"
          fill="none"
          stroke="#FFCC00"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  // Kotak Mahindra Bank - Infinity Curve Ribbon
  KOTAK: {
    bg: "#FEF2F2",
    border: "#FECACA",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#ED1C24" />
        <path
          d="M17.5 18C14.5 18 12 20.7 12 24C12 27.3 14.5 30 17.5 30C21.5 30 24 24 24 24C24 24 26.5 18 30.5 18C33.5 18 36 20.7 36 24C36 27.3 33.5 30 30.5 30C26.5 30 24 24 24 24"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  // Punjab National Bank (PNB) - Maroon & Yellow Disc
  PNB: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#A21C2B" />
        <circle cx="24" cy="24" r="14" fill="#FFB81C" />
        <circle cx="24" cy="24" r="9.5" fill="#A21C2B" />
        <path
          d="M21 18H25.5C27.5 18 29 19.3 29 21C29 22.7 27.5 24 25.5 24H21V18Z"
          fill="#FFB81C"
        />
        <rect x="21" y="23" width="3" height="8" fill="#FFB81C" />
      </svg>
    ),
  },

  // Union Bank of India (UNION) - Red & Blue U
  UNION: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#004A97" />
        <path
          d="M14 16V26C14 31 18 34 23 34C28 34 32 31 32 26V16"
          stroke="#E31B23"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M18 16V25C18 28 20 30 23 30C26 30 28 28 28 25V16"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  // Federal Bank (FDRL) - Royal Blue Shield with Gold Wings
  FDRL: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#0B2B64" />
        {/* Gold wings / Double F crest */}
        <path
          d="M14 16H34L31 22H21V25H29L27 30H21V36H15L14 16Z"
          fill="#FFB81C"
        />
        <circle cx="34" cy="33" r="3" fill="#FFB81C" />
      </svg>
    ),
  },

  // IDBI Bank (IBKL) - Forest Green with Golden Flower
  IBKL: {
    bg: "#F0FDF4",
    border: "#BBF7D0",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#006837" />
        {/* Flower / Leaf triad */}
        <circle cx="24" cy="24" r="13" fill="#044D29" />
        <path
          d="M24 13L28 24L24 35L20 24Z"
          fill="#F9A01B"
        />
        <path
          d="M13 24L24 28L35 24L24 20Z"
          fill="#F9A01B"
        />
        <circle cx="24" cy="24" r="3.5" fill="white" />
      </svg>
    ),
  },

  // Bandhan Bank (BDBL) - Crimson with Gold Flame in Arch
  BDBL: {
    bg: "#FEF2F2",
    border: "#FECDD3",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#C8102E" />
        {/* Arch / House frame */}
        <path
          d="M14 24L24 14L34 24V34H14V24Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Yellow Flame */}
        <path
          d="M24 20C24 20 21 24 21 26.5C21 28 22.3 29.5 24 29.5C25.7 29.5 27 28 27 26.5C27 24 24 20 24 20Z"
          fill="#FFCC00"
        />
      </svg>
    ),
  },

  // RBL Bank (RATN / RBL) - Navy Blue with Red & Blue 'R'
  RATN: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#00205B" />
        {/* Blue and Red 'R' segments */}
        <rect x="14" y="14" width="5" height="20" rx="1" fill="#00A3E0" />
        <path
          d="M19 14H28C31.5 14 34 16.5 34 19.5C34 22.5 31.5 25 28 25H19V14Z"
          fill="#E31837"
        />
        <path
          d="M25 24L33 34H27L21 25H25Z"
          fill="#00A3E0"
        />
      </svg>
    ),
  },

  // South Indian Bank (SIBL) - Deep Red & Navy Triangle
  SIBL: {
    bg: "#FEF2F2",
    border: "#FECACA",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#CE1126" />
        <circle cx="24" cy="24" r="14" fill="#002D62" />
        <polygon points="24,14 34,32 14,32" fill="#CE1126" />
        <circle cx="24" cy="26" r="3" fill="#FFD100" />
      </svg>
    ),
  },

  // Karur Vysya Bank (KVBL) - Kamadhenu Emblem
  KVBL: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#1D2F6F" />
        <circle cx="24" cy="24" r="14" stroke="#FFCC00" strokeWidth="2.5" />
        <path
          d="M16 26C18 20 30 20 32 26C30 30 18 30 16 26Z"
          fill="#FFCC00"
        />
        <circle cx="24" cy="18" r="3" fill="white" />
      </svg>
    ),
  },

  // Karnataka Bank (KARB) - Deep Blue & Red Compass
  KARB: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#004899" />
        <circle cx="24" cy="24" r="14" fill="#E31B23" />
        <circle cx="24" cy="24" r="9" fill="white" />
        <circle cx="24" cy="24" r="4" fill="#004899" />
      </svg>
    ),
  },

  // City Union Bank (CIUB) - Deep Blue with Radiant Sun
  CIUB: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#0054A6" />
        <circle cx="24" cy="24" r="8" fill="#FFCC00" />
        <path d="M24 10V14M24 34V38M10 24H14M34 24H38M14 14L17 17M31 31L34 34M14 34L17 31M31 17L34 14" stroke="#FFCC00" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },

  // AU Small Finance Bank (AUBL) - Royal Purple & Orange
  AUBL: {
    bg: "#FAF5FF",
    border: "#E9D5FF",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#49176D" />
        {/* AU Monogram */}
        <path
          d="M14 34L20 14H24L30 34H25.5L24 28H19.5L18 34H14Z"
          fill="#FF671F"
        />
        <path
          d="M28 14H33V28C33 32 30 34 26 34"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },

  // IndusInd Bank - Crimson Bull Emblem
  INDUSIND: {
    bg: "#FEF2F2",
    border: "#FECACA",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#981C1E" />
        <circle cx="24" cy="24" r="14" stroke="#D4AF37" strokeWidth="2" />
        <path
          d="M17 21C19 17 22 16 24 16C26 16 29 17 31 21C29 20 27 20 24 21C21 20 19 20 17 21Z"
          fill="#D4AF37"
        />
        <path
          d="M19 23L24 32L29 23C27 25 24 26 24 26C24 26 21 25 19 23Z"
          fill="#D4AF37"
        />
      </svg>
    ),
  },

  // YES Bank - Red & Blue Ribbon
  YES: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#003B70" />
        <path
          d="M14 24L22 32L34 16"
          stroke="#E31837"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="16" r="3" fill="white" />
      </svg>
    ),
  },

  // IDFC FIRST Bank - Deep Carmine 1
  IDFC: {
    bg: "#FEF2F2",
    border: "#FECDD3",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#9E1B32" />
        <path
          d="M20 19L25 15V33H29"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  // Airtel Payments Bank (AIRP) - Iconic Airtel Red with Stylized Swoop Lettermark
  AIRP: {
    bg: "#FEF2F2",
    border: "#FECACA",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#E40000" />
        {/* Stylized lower-case airtel loop logo */}
        <circle cx="24" cy="24" r="14" fill="#C40000" />
        <path
          d="M24 13C17.9 13 13 17.9 13 24C13 30.1 17.9 35 24 35C27.5 35 30.6 33.3 32.6 30.7L28.8 26.9C27.6 28.2 25.9 29 24 29C21.2 29 19 26.8 19 24C19 21.2 21.2 19 24 19C26.8 19 29 21.2 29 24V24.8C29 25.5 28.4 26 27.8 26C27.1 26 26.6 25.5 26.6 24.8V24C26.6 22.6 25.4 21.4 24 21.4C22.6 21.4 21.4 22.6 21.4 24C21.4 25.4 22.6 26.6 24 26.6C24.8 26.6 25.5 26.2 26 25.6C26.5 26.5 27.4 27.2 28.5 27.2C30.2 27.2 31.6 25.8 31.6 24.1V24C31.6 19.8 28.2 16.4 24 16.4"
          fill="white"
        />
        <circle cx="24" cy="24" r="1.5" fill="#E40000" />
      </svg>
    ),
  },

  // India Post Payments Bank (IPOS / IPPB) - Postal Deep Crimson & Golden Wing
  IPOS: {
    bg: "#FEF2F2",
    border: "#FCA5A5",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#B71C1C" />
        {/* India Post Envelope & Speed Wings */}
        <path d="M12 16L24 26L36 16H12Z" fill="#FFD600" />
        <path d="M12 18V32H36V18L24 28L12 18Z" fill="#FFE082" fillOpacity="0.4" stroke="#FFD600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 32L21 23M36 32L27 23" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="28" r="3" fill="#D32F2F" stroke="#FFD600" strokeWidth="1.5" />
      </svg>
    ),
  },

  // Paytm Payments Bank (PYTM) - Iconic Navy & Cyan Blockmark
  PYTM: {
    bg: "#EFF6FF",
    border: "#93C5FD",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#002E6E" />
        {/* Paytm stylized letters */}
        <rect x="10" y="16" width="12" height="16" rx="3.5" fill="#00BAF2" />
        <path d="M14 20H18C19.1 20 20 20.9 20 22C20 23.1 19.1 24 18 24H16V28H14V20Z" fill="white" />
        <rect x="24" y="16" width="14" height="16" rx="3.5" fill="#00BAF2" />
        <path d="M27 20H35V22H32V28H30V22H27V20Z" fill="white" />
        <circle cx="36" cy="18" r="2" fill="#00BAF2" />
      </svg>
    ),
  },

  // Fino Payments Bank (FINO) - Maroon & Sunburst Crest
  FINO: {
    bg: "#FFF5F5",
    border: "#FECDD3",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#A81014" />
        <circle cx="24" cy="24" r="14" stroke="#FF9800" strokeWidth="2.5" />
        {/* Flower / Sunburst motif */}
        <circle cx="24" cy="18" r="3.5" fill="#FFC107" />
        <circle cx="24" cy="30" r="3.5" fill="#FFC107" />
        <circle cx="18" cy="24" r="3.5" fill="#FF9800" />
        <circle cx="30" cy="24" r="3.5" fill="#FF9800" />
        <circle cx="24" cy="24" r="3.5" fill="white" />
      </svg>
    ),
  },

  // Jio Payments Bank (JIOP) - Reliance Jio Cobalt & Circular Logo
  JIOP: {
    bg: "#EFF6FF",
    border: "#93C5FD",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#0A285F" />
        <circle cx="24" cy="24" r="15" fill="#0057B8" />
        {/* Iconic Jio Lettermark */}
        <path d="M17 21V26C17 28 15.8 28.5 14.5 28.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="17" cy="16.5" r="1.8" fill="#E31837" />
        <path d="M22 20.5V28.5" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="22" cy="16.5" r="1.8" fill="white" />
        <circle cx="30" cy="24.5" r="4.2" stroke="white" strokeWidth="3" />
      </svg>
    ),
  },

  // NSDL Payments Bank (NSPB) - Deep Indigo with Amber Orbit
  NSPB: {
    bg: "#EEF2FF",
    border: "#C7D2FE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#1A237E" />
        <circle cx="24" cy="24" r="13" stroke="#FF6F00" strokeWidth="2.5" />
        {/* NSDL Interlocking Ring */}
        <ellipse cx="24" cy="24" rx="13" ry="5.5" transform="rotate(-30 24 24)" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="4.5" fill="#FF8F00" />
      </svg>
    ),
  },

  // Equitas Small Finance Bank (ESFB) - Midnight Navy & Green Flower
  ESFB: {
    bg: "#F0FDF4",
    border: "#BBF7D0",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#002D62" />
        <circle cx="24" cy="17" r="4" fill="#8BC34A" />
        <circle cx="17" cy="28" r="4" fill="#8BC34A" />
        <circle cx="31" cy="28" r="4" fill="#8BC34A" />
        <path d="M24 24L17 28M24 24L31 28M24 24V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="3" fill="#FFD54F" />
      </svg>
    ),
  },

  // Ujjivan Small Finance Bank (UJVN) - Saffron Sunrise
  UJVN: {
    bg: "#FFF7ED",
    border: "#FED7AA",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#F58220" />
        <path d="M14 28C14 22.5 18.5 18 24 18C29.5 18 34 22.5 34 28H14Z" fill="white" />
        <path d="M24 12V15M15 16L17 18M33 16L31 18M11 25H13M35 25H37" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="28" r="4" fill="#003B70" />
      </svg>
    ),
  },

  // Saraswat Cooperative Bank (SRCB) - Royal Maroon with Lyre/Veena
  SRCB: {
    bg: "#FEF2F2",
    border: "#FECDD3",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#800000" />
        <circle cx="24" cy="24" r="14" stroke="#D4AF37" strokeWidth="2" />
        {/* Veena / Floral Motif */}
        <path d="M19 16C19 24 29 24 29 16" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 16V32" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="32" r="3" fill="#D4AF37" />
      </svg>
    ),
  },

  // Cosmos Cooperative Bank (COSB) - Deep Blue with Star of Cosmos
  COSB: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#003366" />
        {/* 8-pointed golden star */}
        <polygon
          points="24,11 27,20 36,20 29,26 32,35 24,29 16,35 19,26 12,20 21,20"
          fill="#FFD700"
          stroke="white"
          strokeWidth="1.5"
        />
        <circle cx="24" cy="24" r="3.5" fill="#003366" />
      </svg>
    ),
  },

  // SVC Cooperative Bank (SVCB) - Teal & Gold
  SVCB: {
    bg: "#F0FDFA",
    border: "#99F6E4",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#005B5C" />
        <circle cx="24" cy="24" r="14" stroke="#E6A117" strokeWidth="2.5" />
        <path d="M17 21C17 18 20 16 24 16C28 16 31 18 31 21C31 25 24 27 24 32" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="33" r="1.5" fill="#E6A117" />
      </svg>
    ),
  },

  // Aryavart Bank (ARYA) - Forest Green with Golden Wheat
  ARYA: {
    bg: "#F0FDF4",
    border: "#BBF7D0",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#1B5E20" />
        <circle cx="24" cy="24" r="14" stroke="#FFD54F" strokeWidth="2" />
        {/* Wheat sheaf / crop symbol */}
        <path d="M24 33V15M24 17L20 21M24 21L28 25M24 25L20 29M24 20L28 16M24 24L20 20M24 28L28 24" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },

  // Standard Chartered Bank (SCBL) - StanChart Ribbon Helix in Blue & Green
  SCBL: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    svg: (
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <rect width="48" height="48" rx="10" fill="#005776" />
        {/* Intertwined Blue and Green Ribbons */}
        <path d="M14 26C14 20 20 15 26 15C31 15 34 18 34 22C34 27 29 31 24 31C18 31 14 26 14 26Z" fill="#00A859" fillOpacity="0.85" />
        <path d="M34 22C34 28 28 33 22 33C17 33 14 30 14 26C14 21 19 17 24 17C30 17 34 22 34 22Z" fill="#0079C1" fillOpacity="0.85" />
        <circle cx="24" cy="24" r="4" fill="white" />
      </svg>
    ),
  },
};

/**
 * Normalizes bank code or bank name to find matching preset
 */
export function getBankPresetKey(bank) {
  if (!bank) return null;

  const code = (bank.bankCode || bank.bank_code || "").toUpperCase().trim();
  const name = (bank.bankName || bank.bank_name || "").toUpperCase().trim();

  // 1. Payment Banks (explicit code and name matching)
  if (code.includes("AIRP") || name.includes("AIRTEL")) return "AIRP";
  if (code.includes("IPOS") || code.includes("IPPB") || name.includes("INDIA POST") || name.includes("POST PAYMENTS")) return "IPOS";
  if (code.includes("PYTM") || code.includes("PAYTM") || name.includes("PAYTM")) return "PYTM";
  if (code.includes("FINO") || name.includes("FINO")) return "FINO";
  if (code.includes("JIOP") || code.includes("JIO") || name.includes("JIO")) return "JIOP";
  if (code.includes("NSPB") || code.includes("NSDL") || name.includes("NSDL")) return "NSPB";

  // 2. Small Finance Banks
  if (code.includes("AUBL") || code.includes("AUBANK") || name.includes("AU SMALL") || name.includes("AU BANK")) return "AUBL";
  if (code.includes("ESFB") || code.includes("EQUITAS") || name.includes("EQUITAS")) return "ESFB";
  if (code.includes("UJVN") || code.includes("UJJIVAN") || name.includes("UJJIVAN")) return "UJVN";

  // 3. Cooperative Banks
  if (code.includes("SRCB") || name.includes("SARASWAT")) return "SRCB";
  if (code.includes("COSB") || name.includes("COSMOS")) return "COSB";
  if (code.includes("SVCB") || name.includes("SHAMRAO") || name.includes("SVC")) return "SVCB";

  // 4. Regional Rural Banks
  if (code.includes("ARYA") || name.includes("ARYAVART")) return "ARYA";
  if (code.includes("KLGB") || name.includes("KERALA GRAMIN")) return "KLGB";

  // 5. Foreign Banks
  if (code.includes("SCBL") || name.includes("STANDARD CHARTERED") || name.includes("STANCHART")) return "SCBL";

  // 6. Scheduled Commercial Banks
  if (code.includes("BOB") || code.includes("BARB") || name.includes("BARODA")) return "BOB";
  if (code.includes("BKID") || code.includes("BOI") || (name.includes("BANK OF INDIA") && !name.includes("STATE") && !name.includes("CENTRAL") && !name.includes("UNION"))) return "BKID";
  if (code.includes("IDIB") || (name.includes("INDIAN BANK") && !name.includes("OVERSEAS"))) return "IDIB";
  if (code.includes("CBIN") || code.includes("CBI") || name.includes("CENTRAL BANK")) return "CBIN";
  if (code.includes("IOBA") || code.includes("IOB") || name.includes("OVERSEAS")) return "IOBA";
  if (code.includes("UCBA") || code.includes("UCO") || name.includes("UCO")) return "UCBA";
  if (code.includes("MAHB") || code.includes("BOM") || name.includes("MAHARASHTRA")) return "MAHB";
  if (code.includes("PSIB") || code.includes("PSB") || name.includes("PUNJAB & SIND") || name.includes("PUNJAB AND SIND")) return "PSIB";
  if (code.includes("HDFC") || name.includes("HDFC")) return "HDFC";
  if (code.includes("ICICI") || name.includes("ICICI")) return "ICICI";
  if (code.includes("SBI") || code.includes("SBIN") || name.includes("STATE BANK OF INDIA")) return "SBI";
  if (code.includes("AXIS") || code.includes("UTIB") || name.includes("AXIS")) return "AXIS";
  if (code.includes("CANARA") || code.includes("CNRB") || name.includes("CANARA")) return "CANARA";
  if (code.includes("KOTAK") || code.includes("KKBK") || name.includes("KOTAK")) return "KOTAK";
  if (code.includes("PNB") || code.includes("PUNB") || name.includes("PUNJAB NATIONAL")) return "PNB";
  if (code.includes("UNION") || code.includes("UBIN") || name.includes("UNION BANK")) return "UNION";
  if (code.includes("FDRL") || name.includes("FEDERAL")) return "FDRL";
  if (code.includes("IBKL") || code.includes("IDBI") || name.includes("IDBI")) return "IBKL";
  if (code.includes("BDBL") || name.includes("BANDHAN")) return "BDBL";
  if (code.includes("RATN") || code.includes("RBL") || name.includes("RBL")) return "RATN";
  if (code.includes("SIBL") || name.includes("SOUTH INDIAN")) return "SIBL";
  if (code.includes("KVBL") || code.includes("KVB") || name.includes("KARUR")) return "KVBL";
  if (code.includes("KARB") || name.includes("KARNATAKA")) return "KARB";
  if (code.includes("CIUB") || code.includes("CUB") || name.includes("CITY UNION")) return "CIUB";
  if (code.includes("INDUS") || code.includes("INDB") || name.includes("INDUSIND")) return "INDUSIND";
  if (code.includes("YES") || code.includes("YESB") || name.includes("YES BANK")) return "YES";
  if (code.includes("IDFC") || code.includes("IDFB") || name.includes("IDFC")) return "IDFC";

  return null;
}

/**
 * Generates an initials monogram for unrecognized banks
 */
function getBankMonogram(name, code) {
  if (code && code.length >= 2 && code.length <= 4) return code.toUpperCase();
  if (!name) return "BK";
  const words = name.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return (words[0][0] + (words[1]?.[0] || "")).toUpperCase();
}

/**
 * Deterministic color palette for generic banks based on bank name
 */
const MONOGRAM_PALETTES = [
  { bg: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { bg: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { bg: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { bg: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  { bg: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  { bg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
];

function getPalette(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MONOGRAM_PALETTES.length;
  return MONOGRAM_PALETTES[index];
}

const SIZE_MAP = {
  xs: "w-6 h-6 text-[10px] rounded-lg",
  sm: "w-9 h-9 text-xs rounded-xl",
  md: "w-11 h-11 text-sm rounded-xl",
  lg: "w-13 h-13 text-base rounded-2xl",
  xl: "w-16 h-16 text-lg rounded-2xl",
};

/**
 * BankLogo Component
 * Renders either:
 * 1. Custom uploaded logo URL if present (with fallback)
 * 2. High fidelity SVG brand logo if bank is recognized (BOB, BKID, IDIB, CBIN, IOBA, UCBA, MAHB, PSIB, etc.)
 * 3. Fallback monogram initials pill with authentic banking colors
 */
export default function BankLogo({
  bank = {},
  logoUrl = null,
  size = "md",
  className = "",
  showBorder = true,
}) {
  const [imgError, setImgError] = useState(false);

  const customUrl = logoUrl || bank?.logoUrl || bank?.logo_url || bank?.logo;
  const presetKey = getBankPresetKey(bank);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  const bankName = bank?.bankName || bank?.bank_name || "";
  const bankCode = bank?.bankCode || bank?.bank_code || "";

  // 1. If custom image URL is provided and not errored
  if (customUrl && !imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-base-100 ${sizeClass} ${
          showBorder ? "border border-base-300 shadow-2xs" : ""
        } ${className}`}
      >
        <img
          src={customUrl}
          alt={bankName || "Bank Logo"}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. High fidelity SVG preset
  if (presetKey && BANK_PRESET_LOGOS[presetKey]) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden ${sizeClass} ${
          showBorder ? "border border-base-300/80 shadow-2xs" : ""
        } ${className}`}
        title={bankName || bankCode}
      >
        {BANK_PRESET_LOGOS[presetKey].svg}
      </div>
    );
  }

  // 3. Fallback Monogram
  const palette = getPalette(bankName || bankCode);
  const monogram = getBankMonogram(bankName, bankCode);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 font-bold tracking-tight select-none border ${sizeClass} ${palette.bg} ${className}`}
      title={bankName || bankCode}
    >
      {monogram || <Landmark className="w-4 h-4 opacity-75" />}
    </div>
  );
}
